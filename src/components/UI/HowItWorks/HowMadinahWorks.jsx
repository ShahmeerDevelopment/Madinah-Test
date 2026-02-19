"use client";

import React from "react";

import { howToGuideArr } from "./steps";
import StackComponent from "@/components/atoms/StackComponent";
import useTransitionNavigate from "@/hooks/useTransitionNavigate";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import StepBox from "./UI/StepBox";
import { resetCampaignValues } from "@/store/slices/campaignSlice";
import { useDispatch } from "react-redux";

const HowMadinahWorks = () => {
  const navigate = useTransitionNavigate();
  const dispatch = useDispatch();

  return (
    <StackComponent direction="column" spacing={0}>
      <StackComponent
        justifyContent="space-between"
        spacing="16px"
        sx={{
          mb: "24px !important",
          mt: "40px !important",
          "@media (max-width:900px)": {
            width: "100%",
            flexDirection: "column",
            gap: "16px",
            "& > *": {
              ml: "0 !important",
            },
          },
        }}
      >
        {howToGuideArr.map((eachStep) => (
          <StepBox key={eachStep.id} {...eachStep} />
        ))}
      </StackComponent>
      <ButtonComp
        onClick={() => {
          dispatch(resetCampaignValues());
          navigate("/create-campaign");
        }}
        sx={{
          alignSelf: "center",
          width: "170px",
          height: "46px",
          p: "0 !important",
          letterSpacing: "-0.41px",
        }}
      >
        Start fundraising
      </ButtonComp>
    </StackComponent>
  );
};

export default HowMadinahWorks;
