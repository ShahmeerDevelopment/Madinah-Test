"use client";

import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";

import { theme } from "@/config/customTheme";
// import { formatNumber } from "@/utils/formatNumber";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import StackComponent from "@/components/atoms/StackComponent";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
// import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import LimitedParagraph from "@/components/atoms/limitedParagraph/LimitedParagraph";
// import ProgressBarComponent from "@/components/atoms/ProgressBarComponent/ProgressBarComponent";
import { ASSET_PATHS } from "@/utils/assets";
const placeholderImage = ASSET_PATHS.images.placeholder;
const example = "/assets/svg/example.jpg";
import DonationProgressBar from "@/components/advance/DonationProgressBar";

const CampaignCard = ({
  image = example,
  title = "This is title",
  subTitle = "Subtitle",
  description = "This is description",
  collectedAmount = 10,
  targetAmount = 30,
  caption = "Newest",
  recurringDonation = false,
  currencySymbol = "$",
  oneTimeDonation = true,
  fromSuccessDonation = false,
}) => {
  const { isSmallScreen } = useResponsiveScreen();

  const overflowStyles = {
    display: "-webkit-box",
    WebkitLineClamp: "1",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-word",
  };
  return (
    <BoxComponent
      sx={{
        height: isSmallScreen && fromSuccessDonation ? "auto" : "286px",
        width: "100%",
        px: 1,
        position: "relative",
        cursor: "pointer",
      }}
    >
      <BoxComponent
        sx={{
          position: "absolute",
          top: 7,
          left: 16,
          background: theme.palette.primary.light,
          padding: "6px 10px",
          borderRadius: "25px",
        }}
      >
        <p style={{ fontSize: "12px", lineHeight: "16px", fontWeight: 500 }}>
          {caption}
        </p>
      </BoxComponent>
      {/* <div
        style={{
          width: isSmallScreen ? "100%" : "240px",
          height: "154px",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
        }}
      > */}
      <Image
        src={!image || image === "" ? placeholderImage : image}
        alt={description}
        height={154}
        width={isSmallScreen ? 343 : 240}
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
          objectFit: "cover",
          ...(isSmallScreen && {
            maxWidth: "100%",
            height: "auto",
          }),
        }}
      />
      {/* </div> */}

      <StackComponent
        direction={"column"}
        justifyContent="space-between"
        sx={{ height: "125px" }}
        mt={1}
      >
        <div>
          <LimitedParagraph
            line={2}
            fontSize={"18px"}
            fontWeight={500}
            sx={{ ...overflowStyles }}
          >
            {title}
          </LimitedParagraph>
          <LimitedParagraph
            overflowStyles
            line={1}
            fontSize={"16px"}
            fontWeight={400}
            sx={{ color: theme.palette.primary.gray, ...overflowStyles }}
          >
            {subTitle}
          </LimitedParagraph>
        </div>
        <BoxComponent>
          <DonationProgressBar
            minVal={0}
            maxVal={targetAmount}
            defaultValue={collectedAmount}
            small
            currency={currencySymbol}
            withoutResponsiveness
            recurringDonation={recurringDonation}
            isStatic={false}
            // isLoading={isLoading}
            oneTimeDonation={oneTimeDonation}
          />
          {/* <ProgressBarComponent
            currentValue={raisedAmount}
            totalValue={goalAmount}
          /> */}
          {/* <BoxComponent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <SubHeading1>
              ${formatNumber(raisedAmount)}
              {recurringDonation && (
                <span style={{ fontWeight: 400, fontSize: "16px" }}>
                  /month
                </span>
              )}
              &nbsp;
              <span
                style={{
                  color: "#A1A1A8",
                  fontWeight: 400,
                  fontSize: "16px",
                }}
              >
                raised
              </span>
            </SubHeading1>

            <SubHeading1>
              ${formatNumber(goalAmount)}
              {recurringDonation && (
                <span style={{ fontWeight: 400, fontSize: "16px" }}>
                  /month
                </span>
              )}
              &nbsp;
              <span
                style={{
                  color: "#A1A1A8",
                  fontWeight: 400,
                  fontSize: "16px",
                }}
              >
                goal
              </span>
            </SubHeading1>
          </BoxComponent> */}
        </BoxComponent>
      </StackComponent>
    </BoxComponent>
  );
};
CampaignCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  description: PropTypes.string,
  raisedAmount: PropTypes.number,
  goalAmount: PropTypes.number,
  caption: PropTypes.string,
  recurringDonation: PropTypes.bool,
};

export default CampaignCard;
