/**
 * Process Story HTML for LCP & CLS Optimization
 *
 * This utility processes images in story HTML to:
 * 1. Prevent them from competing with the main LCP image (cover)
 * 2. Prevent Cumulative Layout Shift (CLS) when images load
 *
 * Next.js 16 Optimization:
 * - Story images should NOT be the LCP element - the cover image should be
 * - Adding loading="lazy" and fetchpriority="low" ensures story images don't compete
 * - Adding aspect-ratio containers reserves space before images load (CLS)
 * - This is processed server-side for better performance
 */

/**
 * Add width/height attributes and aspect-ratio wrapper to images in story HTML
 * Also ensures images are lazy loaded and have low priority
 * @param {string} html - The story HTML content
 * @returns {string} - Processed HTML with CLS-safe image wrappers
 */
export function processStoryHtml(html) {
  if (!html) return "";

  // Add aspect-ratio wrapper to images that don't have explicit dimensions
  // Also add loading="lazy", fetchpriority="low", and decoding="async"
  return html.replace(
    /<img(?![^>]*(?:width|height)=)([^>]*)>/gi,
    `<div style="aspect-ratio:16/9;background:#f0f0f0;border-radius:8px;overflow:hidden;max-width:100%;margin:16px 0;">
      <img$1 style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy" fetchpriority="low" decoding="async">
    </div>`
  );
}

/**
 * Add lazy loading, low priority, and optimization to all images in story HTML
 * This prevents story images from becoming LCP elements
 * @param {string} html - The story HTML content
 * @returns {string} - Processed HTML with optimized images
 */
export function optimizeStoryImages(html) {
  if (!html) return "";

  let processed = html;

  // Optimize image source to use Next.js Image Optimization API
  // This converts images to WebP/AVIF and resizes them
  processed = processed.replace(/<img([^>]*)src=["']([^"']*)["']([^>]*)>/gi, (match, before, src, after) => {
    // Skip if already optimized or data URI
    if (src.startsWith("/_next/image") || src.startsWith("data:")) return match;

    // Use Next.js image proxy
    // Width 1080 is sufficient for the story column (max ~750px + retina)
    const optimizedSrc = `/_next/image?url=${encodeURIComponent(src)}&w=1080&q=75`;
    
    // Add loading="lazy" if not present
    let attrs = before + after;
    if (!attrs.includes("loading=")) attrs += ' loading="lazy"';
    if (!attrs.includes("fetchpriority=")) attrs += ' fetchpriority="low"';
    if (!attrs.includes("decoding=")) attrs += ' decoding="async"';

    return `<img${before}src="${optimizedSrc}"${after} loading="lazy" fetchpriority="low" decoding="async">`;
  });

  return processed;
}

/**
 * Full story HTML processing combining LCP prevention and CLS prevention
 * @param {string} html - The story HTML content
 * @returns {string} - Fully processed and optimized HTML
 */
export function processAndOptimizeStory(html) {
  if (!html) return "";

  let processed = html;

  // First, add lazy loading, low priority, and decoding to all images
  // This prevents story images from competing with cover image for LCP
  processed = optimizeStoryImages(processed);

  // Then wrap images without explicit dimensions in aspect-ratio containers
  // This prevents CLS when images load
  processed = processStoryHtml(processed);

  return processed;
}

export default processAndOptimizeStory;
