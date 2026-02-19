/**
 * Error UI for the homepage route
 * Displayed when an error occurs during rendering
 */
"use client";

import { useEffect } from "react";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Homepage error:", error);
  }, [error]);

  return (
    <StackComponent
      direction="column"
      spacing="24px"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "50vh",
        p: 4,
        textAlign: "center",
      }}
    >
      <TypographyComp
        sx={{
          fontSize: "24px",
          fontWeight: 600,
          color: "#1F1F1F",
        }}
      >
        Something went wrong
      </TypographyComp>
      <TypographyComp
        sx={{
          fontSize: "16px",
          color: "#A1A1A8",
          maxWidth: "400px",
        }}
      >
        We encountered an error while loading this page. Please try again.
      </TypographyComp>
      <ButtonComp
        onClick={() => reset()}
        variant="contained"
        sx={{
          mt: 2,
          backgroundColor: "#3D67FF",
          "&:hover": {
            backgroundColor: "#2952CC",
          },
        }}
      >
        Try Again
      </ButtonComp>
    </StackComponent>
  );
}
