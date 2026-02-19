"use client";

/**
 * Client component for Lottie animation only
 * Minimal client-side code for the map animation
 */
import Animate from "@/components/atoms/Animate/Animate";
import useLottieAnimation from "@/hooks/useLottieAnimation";

const HelpHappensHereAnimation = () => {
  const { animationData: mapImage } = useLottieAnimation("map_countries");

  if (!mapImage) {
    // Placeholder while loading
    return <div style={{ width: "100%", height: "430px", background: "#f5f5f5", borderRadius: "12px" }} />;
  }

  return <Animate animationData={mapImage} />;
};

export default HelpHappensHereAnimation;
