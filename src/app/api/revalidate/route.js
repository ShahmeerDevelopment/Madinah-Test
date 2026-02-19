import { revalidateTag, updateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * API Route for on-demand cache revalidation
 *
 * Usage:
 * - Revalidate specific campaign: POST /api/revalidate?tag=campaign-{slug}
 * - Revalidate campaign left side: POST /api/revalidate?tag=campaign-left-{slug}
 * - Revalidate campaign giving levels: POST /api/revalidate?tag=campaign-giving-levels-{slug}
 * - Revalidate all campaigns: POST /api/revalidate?tag=campaigns
 * - Revalidate specific supporters: POST /api/revalidate?tag=supporters-{slug}
 * - Revalidate all supporters: POST /api/revalidate?tag=supporters
 *
 * Requires secret token for security
 */
export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    const secret = searchParams.get("secret");
    const useUpdateTag = searchParams.get("update") === "true";

    // Verify secret token
    if (secret !== process.env.REVALIDATION_SECRET) {
      console.error('[Revalidate API] Invalid secret token');
      return NextResponse.json(
        { error: "Invalid secret token" },
        { status: 401 }
      );
    }

    if (!tag) {
      console.error('[Revalidate API] Missing tag parameter');
      return NextResponse.json(
        { error: "Missing tag parameter" },
        { status: 400 }
      );
    }

    try {
      // Use revalidateTag for Next.js cache revalidation
      revalidateTag(tag);

      return NextResponse.json({
        success: true,
        revalidated: true,
        tag,
        method: "revalidateTag",
        now: Date.now(),
      });
    } catch (revalidationError) {
      console.error('[Revalidate API] Revalidation error:', revalidationError);
      return NextResponse.json(
        { 
          error: "Error revalidating", 
          details: revalidationError.message,
          stack: revalidationError.stack 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Revalidate API] Unexpected error:', error);
    return NextResponse.json(
      { 
        error: "Unexpected error", 
        details: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler for health check
 */
export async function GET() {
  return NextResponse.json({
    message: "Revalidation API is running",
    usage: {
      method: "POST",
      params: {
        tag: "The cache tag to revalidate (e.g., campaign-{slug}, campaigns, supporters-{slug}, supporters)",
        secret: "Your REVALIDATION_SECRET environment variable value",
      },
    },
  });
}
