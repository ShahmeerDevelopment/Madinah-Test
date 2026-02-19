/* eslint-disable react/react-in-jsx-scope */
"use client";


import PropTypes from "prop-types";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const CropComponent = ({
  imageSrc,
  circularCrop = false,
  crop,
  setCrop,
  ...otherProps
}) => {
  return (
    <ReactCrop
      style={{
        maxHeight: "60vh",
        maxWidth: "max-content",
      }}
      crop={crop}
      onChange={(c) => setCrop(c)}
      circularCrop={circularCrop}
      {...otherProps}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        width="100%"
        style={{ objectFit: "contain" }}
        alt="crop-image"
        src={imageSrc}
      />
    </ReactCrop>
  );
};

CropComponent.propTypes = {
  circularCrop: PropTypes.bool,
  crop: PropTypes.any.isRequired,
  imageSrc: PropTypes.any.isRequired,
  setCrop: PropTypes.func.isRequired,
};

export default CropComponent;
