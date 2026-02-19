"use client";

import PropTypes from "prop-types";
import React from "react";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";
import Image from "next/image";

const SocialAuthBtn = ({ source, action = () => {} }) => {
  return (
    <ButtonComp
      variant={"outlined"}
      color={"primary"}
      sx={{
        margin: "0",
        padding: "6px 19px 6px 19px",
        width: "48px",
        height: "34px",
        minWidth: "40px",
        borderRadius: "25px",
      }}
      onClick={() => action()}
    >
      <Image src={source} alt="social-auth-btn" width={18} height={18} />
    </ButtonComp>
  );
};

SocialAuthBtn.propTypes = {
  action: PropTypes.func,
  source: PropTypes.any,
};

export default SocialAuthBtn;
