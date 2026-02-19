/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React from "react";
import PropTypes from "prop-types";
import BoxComponent from "../boxComponent/BoxComponent";
import ButtonComp from "../buttonComponent/ButtonComp";

const Status = ({
  children,
  isApproved = false,
  isButton = false,
  isDraft = false,
}) => {
  const getStatusColors = () => {
    if (isApproved) {
      return {
        bg: "#e1faf3",
        color: "#0CAB72"
      };
    }
    if (isDraft) {
      return {
        bg: "#F7F7FF",
        color: "#6363E6"
      };
    }
    // For inactive/expired/rejected states
    if (children === "Inactive") {
      return {
        bg: "#F4F4F4",
        color: "#A0A0A0"
      };
    }
    if (children === "Pending") {
      return {
        bg: "#FFF4D9",
        color: "#F0AD4E"
      };
    }
    if (children === "Expired") {
      return {
        bg: "#FFE5E5",
        color: "#D9534F"
      };
    }
    // Default fallback
    return {
      bg: "#F4F4F4",
      color: "#A0A0A0"
    };
  };

  const { bg, color } = getStatusColors();

  return (
    <div>
      {isButton ? (
        <ButtonComp>{children}</ButtonComp>
      ) : (
        <BoxComponent
          color={color}
          sx={{
            height: "34px",
            width: "100%",
            backgroundColor: bg,
            padding: "10px 14px 10px 14px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "25px",
          }}
        >
          {children}
        </BoxComponent>
      )}
    </div>
  );
};

Status.propTypes = {
  children: PropTypes.any,
  isApproved: PropTypes.bool,
  isButton: PropTypes.bool,
  isDraft: PropTypes.bool,
};

export default Status;
