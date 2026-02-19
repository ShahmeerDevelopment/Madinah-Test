import { cookies } from "next/headers";
import Image from "next/image";
import { ASSET_PATHS } from "@/utils/assets";
import NavbarClient from "./NavbarClient";

/**
 * Server-rendered Navbar shell component
 * This component renders the static structure on the server
 * and delegates interactive parts to the client component
 */
export default async function NavbarServer({ isWidgetMode = false }) {
  // Read auth state from cookies on the server
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const hasAuth = !!token;

  return (
    <NavbarClient
      isWidgetMode={isWidgetMode}
      initialHasAuth={hasAuth}
      logoSrc={ASSET_PATHS.images.logo}
    />
  );
}
