"use client";


import PropTypes from "prop-types";
import React from "react";
import { Divider } from "@mui/material";
import dynamic from "next/dynamic";
import StackComponent from "@/components/atoms/StackComponent";
import GoogleSignIn from "@/components/UI/Auth/googleLogin/GoogleSignIn";
const FacebookLogin = dynamic(
  () => import("@/components/UI/Auth/facebookLogin/FacebookLogin"),
  {
    ssr: false,
  },
);
const AppleLogin = dynamic(
  () => import("@/components/UI/Auth/appleLogin/AppleLogin"),
  {
    ssr: false,
  },
);
// import FacebookLogin from "@/components/UI/Auth/facebookLogin/FacebookLogin";
// import AppleLogin from "@/components/UI/Auth/appleLogin/AppleLogin";

const SocialAuthBtnList = ({ mb = "40px" }) => {
  return (
    <>
      <Divider
        textAlign="center"
        sx={{
          width: "100%",
          my: 1,
          "& .MuiDivider-wrapper": {
            px: "8px",
            color: "#A1A1A8",
            fontWeight: 500,
            fontSize: "14px",
            marginTop: "-1px",
          },
        }}
      >
        or{" "}
      </Divider>
      <StackComponent
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing="18px"
        sx={{
          mb: `${mb} !important`,
        }}
      >
        <GoogleSignIn />
        <FacebookLogin />
        <AppleLogin />
      </StackComponent>
    </>
  );
};

SocialAuthBtnList.propTypes = {
  mb: PropTypes.any,
};

export default SocialAuthBtnList;
