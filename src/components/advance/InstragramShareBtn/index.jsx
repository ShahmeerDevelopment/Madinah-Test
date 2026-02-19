"use client";


import PropTypes from "prop-types";
import React from "react";
import Image from "next/image";
import { ASSET_PATHS } from "@/utils/assets";
import {
  SocialText,
  SocialWrapper,
} from "../../molecules/socialShare/SocialShare.style";

const InstagramShareBtn = ({ label = "Instagram" }) => {
  return (
    <>
      <a
        target="_blank"
        href={"https://www.instagram.com"}
        rel="noreferrer"
        style={{ textDecoration: "none" }}
      >
        <SocialWrapper>
          <Image src={ASSET_PATHS.social.instagram} width={22} height={22} alt="instagram" />
          <SocialText>{label}</SocialText>
        </SocialWrapper>
      </a>
    </>
  );
};

InstagramShareBtn.propTypes = {
  label: PropTypes.string,
};

export default InstagramShareBtn;
