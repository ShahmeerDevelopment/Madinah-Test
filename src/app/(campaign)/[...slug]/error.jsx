"use client";

/**
 * Error boundary for campaign page
 * Catches and displays errors that occur during rendering
 */

import { useEffect } from "react";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error
    console.error("Campaign page error:", error);
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
        background: "#f7f7f7",
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
        {error?.message ||
          "We encountered an error while loading this campaign. Please try again."}
      </TypographyComp>
      <ButtonComp
        onClick={() => reset()}
        variant="contained"
        sx={{
          backgroundColor: "#2563EB",
          color: "white",
          "&:hover": {
            backgroundColor: "#1D4ED8",
          },
        }}
      >
        Try again
      </ButtonComp>
    </StackComponent>
  );
}
