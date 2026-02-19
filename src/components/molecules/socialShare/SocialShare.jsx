"use client";

import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
// import { useRouter } from "next/router";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { theme } from "@/config/customTheme";
import SocialIconBox from "./SocialIconBox";
import StackComponent from "@/components/atoms/StackComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import {
  resetActiveStepper,
  resetCampaignValues,
} from "@/store/slices/campaignSlice";

// Next
const SocialShare = ({ setSocialShareModal, customUrlData, customTitle }) => {
  // const router = useRouter();
  const dispatch = useDispatch();

  const saveHandler = () => {
    setSocialShareModal(false);
    // router.push("/dashboard");
    dispatch(resetActiveStepper(0));
    dispatch(resetCampaignValues());
  };
  return (
    <BoxComponent>
      <TypographyComp
        align="center"
        sx={{
          fontSize: "32px",
          fontWeight: 500,
          lineHeight: "38px",
        }}
      >
        Your fundraising is ready to share
      </TypographyComp>
      <TypographyComp
        align="center"
        sx={{
          fontWeight: 500,
          fontSize: "18px",
          lineHeight: "22px",
          mb: 3,
          color: theme.palette.primary.gray,
        }}
      >
        Sharing early often is key to a successful fundraiser
      </TypographyComp>
      <SocialIconBox customUrlData={customUrlData} customTitle={customTitle} />
      <StackComponent direction={"flex"} justifyContent="center" mt={2}>
        <ButtonComp
          onClick={() => saveHandler()}
          sx={{
            width: { xs: "100%", sm: "148px" },
            height: "40px",
            padding: "8px 28px 8px 28px",
          }}
        >
          Close
        </ButtonComp>
      </StackComponent>
    </BoxComponent>
  );
};
SocialShare.propTypes = {
  setSocialShareModal: PropTypes.func,
  customUrlData: PropTypes.any,
  customTitle: PropTypes.string,
};
export default SocialShare;
