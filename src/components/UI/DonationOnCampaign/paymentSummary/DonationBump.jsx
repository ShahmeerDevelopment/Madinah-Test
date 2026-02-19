"use client";

import React from "react";
import PropTypes from "prop-types";

import { CardWrapper } from "./Card.style";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import DonationBumpIcon from "@/assets/iconComponent/DonationBumpIcon";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import SwitchButton from "@/components/atoms/buttonComponent/SwitchButton";

// Next
const DonationBump = ({
  orderBump,
  toggleOrderBump,
  isOrderBumpSelected,
  currency,
}) => {
  return (
    <CardWrapper height="auto" heightInMobileViw="auto">
      <div style={{ width: "100%" }}>
        <BoxComponent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Icon + Text Container */}
          <BoxComponent sx={{ display: "flex", alignItems: "center" }}>
            <DonationBumpIcon />
            <BoxComponent
              sx={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "8px",
              }}
            >
              <TypographyComp
                sx={{
                  fontSize: "14px",
                  lineHeight: "16px",
                  fontWeight: "500",
                  color: "#090909",
                  textAlign: "start", // Text aligned to start (left)
                  wordBreak: orderBump.title
                    ?.split(" ")
                    .some((word) => word.length > 30)
                    ? "break-all"
                    : undefined,
                }}
              >
                {`${orderBump.title} ${currency}${orderBump.amount}`}
              </TypographyComp>
              <TypographyComp
                sx={{
                  marginTop: "2px",
                  fontSize: "12px",
                  lineHeight: "16px",
                  fontWeight: "400",
                  color: "#A1A1A8",
                  textAlign: "start", // Text aligned to start (left)
                  wordBreak: orderBump.subTitle
                    ?.split(" ")
                    .some((word) => word.length > 30)
                    ? "break-all"
                    : undefined,
                }}
              >
                {orderBump.subTitle}
              </TypographyComp>
            </BoxComponent>
          </BoxComponent>
          {/* Switch at the end of the BoxComponent */}
          <SwitchButton
            onChange={toggleOrderBump}
            checked={isOrderBumpSelected}
          />
        </BoxComponent>
      </div>
    </CardWrapper>
  );
};

DonationBump.propTypes = {
  orderBump: PropTypes.any,
  toggleOrderBump: PropTypes.any,
};

export default DonationBump;
