"use client";

import React from "react";
import { useRouter } from "next/navigation";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";

const NoCampaignSelected = () => {
  const router = useRouter();
  return (
    <StackComponent direction="column" alignItems="center" spacing={2}>
      <TypographyComp variant="h4">
        No Campaign Selected For Preview
      </TypographyComp>
      <ButtonComp size="large" onClick={() => router.back()}>
        Go Back
      </ButtonComp>
    </StackComponent>
  );
};

export default NoCampaignSelected;
