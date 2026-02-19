"use client";

import PropTypes from "prop-types";
import React from "react";
import BoxWithImageBackground from "@/components/atoms/BoxWithImageBackground";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import SmallCard from "./UI/SmallCard";
import { formatNumber } from "@/utils/formatNumber";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";

const IMAGE_URL =
  "https://images.unsplash.com/photo-1682687220989-cbbd30be37e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const MainImage = ({
  image = IMAGE_URL,
  title,
  currency = "$",
  total = 500,
  numberOfSupporters = "150000",
  numberOfCampaigns = "100",
  showBaseData = false,
}) => {
  const { isSmallScreen } = useResponsiveScreen();
  return (
    <BoxWithImageBackground
      imageUrl={image}
      sx={{
        width: "100%",
        height: "50vh",
        borderRadius: isSmallScreen ? "0px" : "32px",
        marginTop: "50px !important",
        "@media (max-width:600px)": {
          marginTop: "10px !important",
        },
      }}
    >
      <StackComponent
        direction="column"
        sx={{
          position: "absolute",
          // top: '318px',
          left: { xs: 0, sm: "24px" },
          right: "24px",
          bottom: "24px",
          height: "max-content",
        }}
        spacing="12px"
      >
        <TypographyComp
          sx={{
            color: "#FFFFFF",
            fontSize: "32px",
            fontWeight: 500,
            lineHeight: "38px",
            letterSpacing: "-0.41px",
            paddingLeft: { xs: "15px", sm: "0px" },
          }}
        >
          {title}
        </TypographyComp>
        {showBaseData ? (
          <StackComponent
            spacing="8px"
            justifyContent={{ xs: "space-around", sm: "flex-start" }}
          >
            <SmallCard
              label="total"
              amount={`${currency}${
                +total > 0 ? formatNumber(+total) : +total
              }`}
            />
            <SmallCard
              label="supporters"
              amount={
                +numberOfSupporters > 0
                  ? formatNumber(numberOfSupporters)
                  : formatNumber(numberOfSupporters)
              }
            />
            <SmallCard
              label="campaigns"
              amount={
                +numberOfCampaigns > 0
                  ? formatNumber(+numberOfCampaigns)
                  : formatNumber(+numberOfCampaigns)
              }
            />
          </StackComponent>
        ) : null}
      </StackComponent>
    </BoxWithImageBackground>
  );
};

MainImage.propTypes = {
  currency: PropTypes.string,
  image: PropTypes.any,
  numberOfCampaigns: PropTypes.string,
  numberOfSupporters: PropTypes.string,
  showBaseData: PropTypes.bool,
  title: PropTypes.any,
  total: PropTypes.string,
  type: PropTypes.string,
};

export default MainImage;
