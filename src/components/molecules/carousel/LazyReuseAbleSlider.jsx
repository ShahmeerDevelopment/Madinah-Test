"use client";

import dynamic from "next/dynamic";

// Dynamically import ReuseAbleSlider to reduce initial bundle size
// react-slick and slick-carousel are ~40KB+ gzipped
// No loading skeleton here - handled by parent Suspense boundary
const ReuseAbleSlider = dynamic(() => import("./ReuseAbleSlider"), {
  ssr: false,
});

export default ReuseAbleSlider;
