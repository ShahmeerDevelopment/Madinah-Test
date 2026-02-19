"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const GdprBanner = dynamic(() => import("@/components/UI/GdprBanner"), {
  ssr: false,
});
const HomeInit = dynamic(() => import("./HomeInit.client"), { ssr: false });

/**
 * HomeChrome - Client component wrapper for the home layout
 * Hero is now rendered at layout level (outside Suspense) for initial paint
 */
export default function HomeChrome({ children, footerSection, navbarSection }) {
  const searchParams = useSearchParams();

  const isWidgetMode =
    searchParams.get("widget") === "true" &&
    searchParams.get("embedded") === "true";

  return (
    <>
      {/* HomeInit runs initialization that requires Redux context */}
      <HomeInit />
      {navbarSection}
      {children}
      {!isWidgetMode && footerSection}
      {!isWidgetMode && <GdprBanner />}
    </>
  );
}
