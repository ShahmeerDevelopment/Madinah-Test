"use client";

import StackComponent from "@/components/atoms/StackComponent";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { styles } from "./ViewCampaignTemplate.style";
import LimitedParagraph from "@/components/atoms/limitedParagraph/LimitedParagraph";
import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import ShowMoreComponent from "@/components/atoms/ShowMoreComponent";
import Paragraph from "@/components/atoms/createCampaigns/Paragraph";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { useTheme } from "@emotion/react";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { useSelector } from "react-redux";
import Chip from "@mui/material/Chip";
import { useDispatch } from "react-redux";
import { donationBackHandler } from "@/store/slices/donationSlice";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import RecurringIcon from "@/assets/iconComponent/RecurringIcon";
import { AUTOMATIC_DONATION_DAYS } from "@/config/constant";

const SingleSimilarCampaign = ({
  title,
  donationAmount,
  claimed,
  donationType,
  status,
  buttonText,
  description,
  btnClickEvent = () => {},
  currencySymbol = "USD",
  isMostNeeded = false,
  recurringType,
}) => {
  const dispatch = useDispatch();
  const isAdminLogin = useSelector((state) =>
    state.auth.userDetails?.loginAs === "admin" ? true : false
  );
  const theme = useTheme();

  const overflowStylesHeading = {
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-word",
  };

  useEffect(() => {
    dispatch(donationBackHandler(false));
  }, [dispatch]);

  const getRecurringTypeTitle = () => {
    const recurringTypeItem = AUTOMATIC_DONATION_DAYS.find(
      (item) => item.value === recurringType
    );
    return recurringTypeItem ? recurringTypeItem.label : "";
  };

  return (
    <StackComponent
      sx={styles.sectionLayout}
      direction="column"
      component="section"
    >
      <StackComponent direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        {isMostNeeded && (
          <Chip
            label="Most Needed"
            size="small"
            sx={{
              backgroundColor: "#FFD700",
              color: "black",
              fontWeight: 500,
              paddingTop: "2px",
              height: "28px",
              fontSize: "12px",
              lineHeight: "16px",
            }}
          />
        )}
      </StackComponent>
      <StackComponent
        sx={{
          "& > *": {
            fontSize: "18px",
            fontWeight: 500,
          },
        }}
        justifyContent="space-between"
      >
        <LimitedParagraph
          line={2}
          fontWeight={500}
          fontSize={"18px"}
          sx={{
            ...overflowStylesHeading,
            lineHeight: "22px",
          }}
        >
          {title}
        </LimitedParagraph>
        <SubHeading1>
          {currencySymbol}
          {`${donationAmount}${donationType === "recurringDonation" ? "" : ""}`}
        </SubHeading1>
      </StackComponent>
      <ShowMoreComponent lines={3} descriptionLength={description.length}>
        <Paragraph sx={{ lineHeight: "20px" }}>{description}</Paragraph>
      </ShowMoreComponent>
      <TypographyComp
        sx={{
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: "16px",
          color: "#424243",
        }}
      >
        {`${claimed} claimed`}
      </TypographyComp>
      {donationType !== "recurringDonation" && (
        <ButtonComp
          variant="outlined"
          size="normal"
          fontSize="14px"
          fontWeight={500}
          height="34px"
          lineHeight="16px"
          disabled={isAdminLogin || status !== "active" ? true : false}
          sx={{
            "&:hover": {
              color: "#ffffff",
              background: theme.palette.primary.main,
            },
          }}
          onClick={btnClickEvent}
        >
          {`${buttonText} ${
            donationType === "recurringDonation" ? " monthly" : ""
          }`}
        </ButtonComp>
      )}
      {donationType === "recurringDonation" && (
        <BoxComponent
          sx={{
            borderRadius: "22px",
            border: "2px solid #F7F7FF",
            height: "auto",
            padding: "12px 16px 12px 16px",
            gap: "24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <BoxComponent
            sx={{
              display: "flex",
              gap: "10px",
              height: "40px",
              alignItems: "center",
            }}
          >
            <RecurringIcon />
            <BoxComponent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <TypographyComp
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "16px",
                  color: "#090909",
                }}
              >
                {getRecurringTypeTitle()}
              </TypographyComp>
            </BoxComponent>
          </BoxComponent>
          <BoxComponent
            sx={{ display: "flex", flexDirection: "column", gap: "4px" }}
          >
            <ButtonComp
              variant="outlined"
              size="normal"
              fontSize="14px"
              fontWeight={500}
              height="34px"
              lineHeight="16px"
              disabled={isAdminLogin || status !== "active" ? true : false}
              sx={{
                width: "100%",
                "&:hover": {
                  color: "#ffffff",
                  background: theme.palette.primary.main,
                },
              }}
              onClick={btnClickEvent}
            >
              {`${buttonText}${donationType === "recurringDonation" ? "" : ""}`}
            </ButtonComp>
          </BoxComponent>
        </BoxComponent>
      )}
    </StackComponent>
  );
};

SingleSimilarCampaign.propTypes = {
  btnClickEvent: PropTypes.any,
  buttonText: PropTypes.any,
  claimed: PropTypes.any,
  description: PropTypes.any,
  donationAmount: PropTypes.any,
  title: PropTypes.any,
  currencySymbol: PropTypes.string,
  donationType: PropTypes.string,
  recurringType: PropTypes.string,
};

export default SingleSimilarCampaign;
