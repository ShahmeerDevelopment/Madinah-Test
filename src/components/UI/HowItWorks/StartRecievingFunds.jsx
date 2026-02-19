"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { buildSimpleTypography } from "@/utils/helpers";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";

const StartRecievingFunds = () => {
  const router = useRouter();

  return (
    <StackComponent
      alignItems="center"
      direction="column"
      sx={{ pt: "4px !important" }}
    >
      <TypographyComp
        sx={{
          textAlign: "center",
          color: "rgba(96, 96, 98, 1)",
          ...buildSimpleTypography(500, 18, 22),
          maxWidth: "563px",
          mb: "16px",
        }}
      >
        Millions trust Madinah as the #1 online fundraising expert. That&apos;s
        why more people start fundraisers on Madinah than any other platform.
      </TypographyComp>
      <ButtonComp
        onClick={() => router.push("/create-campaign")}
        sx={{
          height: "46px",
          ...buildSimpleTypography(400, 16, 20),
          p: "0 !important",
          width: "136px",
          "@media (max-width:600px)": {
            mt: "24px !important",
          },
        }}
      >
        Get started
      </ButtonComp>
    </StackComponent>
  );
};

export default StartRecievingFunds;
