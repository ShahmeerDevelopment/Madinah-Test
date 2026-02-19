/**
 * HelpHappensHere - Server Component
 * Static text is rendered on the server
 * Only the Lottie animation is client-side
 */
"use client";

import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import HelpHappensHereAnimation from "./HelpHappensHereAnimation";

const HelpHappensHere = () => {
  return (
    <StackComponent direction="column" spacing={"32px"} sx={{ mt: "8px" }}>
      <TypographyComp
        sx={{
          color: "#A1A1A8",
          fontSize: "18px",
          lineheight: "22px",
          letterSpacing: "-0.41px",
        }}
      >
        Madinah is a platform where communities from around the world come
        together to make a difference.
        <br /> Explore cities that are receiving the most donations right now.
      </TypographyComp>
      <HelpHappensHereAnimation />
    </StackComponent>
  );
};

export default HelpHappensHere;
