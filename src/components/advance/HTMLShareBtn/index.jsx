"use client";

import PropTypes from "prop-types";
import React from "react";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import {
  SocialText,
  SocialWrapper,
} from "../../molecules/socialShare/SocialShare.style";
import { ASSET_PATHS } from "@/utils/assets";

const HTMLShareBtn = ({
  copyBtnLabel = "Website widget",
  url,
  height = "200px",
  width = "300px",
}) => {
  return (
    <CopyToClipboard
      text={`<iframe src="${url}" style="border:none; border-radius: 8px" height=${height} width=${width} title="Iframe Example"></iframe>`}
      onCopy={() =>
        toast.success("Copied to clipboard!", {
          duration: 1000,
        })
      }
    >
      <SocialWrapper>
        <Image src={ASSET_PATHS.social.widget} width={22} height={22} alt="websiteWidget" />
        <SocialText>{copyBtnLabel}</SocialText>
      </SocialWrapper>
      {/* <ButtonComp>{copyBtnLabel}</ButtonComp> */}
    </CopyToClipboard>
  );
};

HTMLShareBtn.propTypes = {
  copyBtnLabel: PropTypes.string,
  height: PropTypes.string,
  url: PropTypes.string.isRequired,
  width: PropTypes.string,
};

export default HTMLShareBtn;
