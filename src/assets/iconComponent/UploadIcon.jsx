import React from "react";
import Image from "next/image";
import { ASSET_PATHS } from "@/utils/assets";

const UploadIcon = ({ disabled }) => {
  // Use the disabled prop to apply appropriate styling
  // Colors match DeleteIcon: #6363E6 for normal state, #bdbdbd for disabled
  const style = {
    display: "inline-block",
    paddingTop: "4px",
    filter: disabled
      ? "brightness(0) saturate(100%) invert(91%) sepia(0%) saturate(0%) hue-rotate(175deg) brightness(94%) contrast(86%)"
      : "brightness(0) saturate(100%) invert(41%) sepia(83%) saturate(6904%) hue-rotate(236deg) brightness(93%) contrast(91%)",
  };

  return (
    <span style={style}>
      <Image src={ASSET_PATHS.images.defaultItems.upload} alt="Upload" width={16} height={16} />
    </span>
  );
};

export default UploadIcon;
