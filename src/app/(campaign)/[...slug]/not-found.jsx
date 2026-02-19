"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useLottieAnimation from "@/hooks/useLottieAnimation";
import Animate from "@/components/atoms/Animate/Animate";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

export default function NotFound() {
  const router = useRouter();
  const { animationData: errorIcon } = useLottieAnimation("404(2)");

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 8000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "center",
        width: "100%",
        position: "relative",
      }}
    >
      <BoxComponent
        sx={{
          height: "calc(100vh - 70px)",
          mt: -5,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Animate animationData={errorIcon} />
      </BoxComponent>
    </div>
  );
}
