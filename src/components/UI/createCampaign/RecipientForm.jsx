"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import {
  campaignStepperIncrementHandler,
  createCampaignHandler,
} from "@/store/slices/campaignSlice";

import { FUNDRAISING_FOR } from "@/config/constant";
import { WrapperLayout } from "./createCampaign.style";
import BackButton from "@/components/atoms/createCampaigns/BackButton";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import SubmitButton from "@/components/atoms/createCampaigns/SubmitButton";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import SelectAbleFieldComp from "@/components/atoms/selectAbleField/SelectAbleFieldComp";
import { theme } from "@/config/customTheme";

const RecipientForm = ({ setCharitySelected, defaultOption }) => {
  const dispatch = useDispatch();

  const { selectedBox: boxNumber } = useSelector(
    (state) => state.campaign.campaignValues,
  );
  const defaultIndex = FUNDRAISING_FOR.findIndex(
    (fundraiser) => fundraiser.item === defaultOption,
  );
  const [selectedBox, setSelectedBox] = useState(
    boxNumber !== undefined ? boxNumber : defaultIndex,
  );

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // This effect ensures that if boxNumber updates from the Redux state, it updates the local state as well
  useEffect(() => {
    if (boxNumber !== undefined) {
      setSelectedBox(boxNumber);
    } else if (defaultOption) {
      if (defaultIndex === 2) {
        setCharitySelected(true);
      }
      setSelectedBox(defaultIndex);
    }
  }, [boxNumber, defaultOption, defaultIndex]);

  const handleBoxClick = (item, index) => {
    setSelectedBox((prevSelected) => (prevSelected === index ? null : index));

    if (item.item === "charity-organization") {
      setCharitySelected(true);
    } else {
      setCharitySelected(false);
    }
  };

  const handleNext = () => {
    const payload = {
      fundraisingFor: FUNDRAISING_FOR[selectedBox]?.item,
      selectedBox: selectedBox,
    };

    dispatch(createCampaignHandler(payload));
    dispatch(campaignStepperIncrementHandler(1));
  };

  return (
    <WrapperLayout>
      <BackButton />
      <BoxComponent sx={{ mt: { xs: 3, sm: 5 } }}>
        <CampaignHeading marginBottom={0} mobileMarginBottom={0}>
          Tell us a bit more about your fundraiser
        </CampaignHeading>
        <SubHeading1 sx={{ mb: 3, color: theme.palette.primary.gray }}>
          This information helps us get to know you and your fundraising needs.
        </SubHeading1>
        <SubHeading sx={{ mb: 2 }}>Who are you fundraising for?</SubHeading>
        <BoxComponent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mb: { xs: 1, sm: "auto" },
          }}
        >
          {FUNDRAISING_FOR.map((item, index) => (
            <SelectAbleFieldComp
              key={index}
              isActive={selectedBox === index}
              onClick={() => handleBoxClick(item, index)}
              heading={item.heading}
              title={item.title} // Pass the handleBoxClick function to onClick prop
            />
          ))}
        </BoxComponent>
      </BoxComponent>
      <SubmitButton
        disabled={
          selectedBox === -1 || selectedBox == null || selectedBox == undefined
        }
        withSticky
        onClick={handleNext}
      >
        Continue
      </SubmitButton>
    </WrapperLayout>
  );
};
RecipientForm.propTypes = {
  defaultOption: PropTypes.any,
  setCharitySelected: PropTypes.func,
};

export default RecipientForm;
