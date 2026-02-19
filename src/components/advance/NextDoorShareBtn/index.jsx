"use client";


import PropTypes from "prop-types";
import React from "react";
import Image from "next/image";
import { ASSET_PATHS } from "@/utils/assets";
import {
  SocialText,
  SocialWrapper,
} from "../../molecules/socialShare/SocialShare.style";

const NextDoorShareBtn = ({
  label = "Nextdoor",
  urlToShare = "www.google.com",
  text = "Check out my campaign!",
}) => {
  return (
    <>
      <a
        target="_blank"
        href={`https://nextdoor.com/sharekit/?source={madinah.com}&body=${text
          .split(" ")
          .join("%20")}%20${urlToShare}`}
        rel="noreferrer"
        style={{ textDecoration: "none" }}
      >
        <SocialWrapper>
          <Image src={ASSET_PATHS.social.nextDoor} width={22} height={22} alt="nextDoor" />
          <SocialText>{label}</SocialText>
        </SocialWrapper>
      </a>
    </>
  );
};

NextDoorShareBtn.propTypes = {
  label: PropTypes.string,
  text: PropTypes.string,
  urlToShare: PropTypes.string,
};

export default NextDoorShareBtn;
