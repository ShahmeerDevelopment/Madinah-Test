/* eslint-disable react/react-in-jsx-scope */
"use client";

import PropTypes from "prop-types";
import { useRef, useState, useEffect } from "react";

import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import StackComponent from "@/components/atoms/StackComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import setCanvasPreview from "./setCanvasPreview";

const ASPECT_RATIO = 16 / 9;
const MIN_DIMENSION = 150;

const CropImage = ({
  heading = "Cover Photo",
  saveLabel = "Save",
  onCropSave = () => { },
  image,
  isLoading = false,
  userProfileImage = false,
}) => {
  const imgRef = useRef(null);

  const previewCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();

  useEffect(() => {
    if (image) {
      setImgSrc(image);
    }
  }, [image]);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    let initialCrop;
    if (userProfileImage) {
      const staticCropSize = 70;
      const pixelCrop = makeAspectCrop(
        {
          unit: "px",
          width: staticCropSize,
          height: staticCropSize,
        },
        1,
        width,
        height,
      );
      const centered = centerCrop(pixelCrop, width, height);
      setCrop(centered);
      return;
    } else {
      let initialCropWidth = width;
      let initialCropHeight = initialCropWidth / ASPECT_RATIO;

      if (initialCropHeight > height) {
        initialCropHeight = height;
        initialCropWidth = initialCropHeight * ASPECT_RATIO;
      }

      initialCrop = makeAspectCrop(
        {
          unit: "px",
          width: initialCropWidth,
          height: initialCropHeight,
        },
        ASPECT_RATIO,
        width,
        height,
      );
    }
    const centeredCrop = centerCrop(initialCrop, width, height);
    setCrop(centeredCrop);
  };

  return (
    <StackComponent
      sx={{
        width: { xs: "90vw", sm: "80vw", md: "650px" },
        maxWidth: "95vw",
        padding: { xs: "20px 10px", sm: "30px 20px" },
        boxSizing: "border-box",
      }}
      direction="column"
    >
      <SubHeading sx={{ mb: 2, color: "black", textAlign: "center" }}>
        {heading}
      </SubHeading>
      {imgSrc && (
        <StackComponent
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <BoxComponent
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ReactCrop
              crop={crop}
              onChange={(percentCrop) => setCrop(percentCrop)}
              locked={userProfileImage}
              keepSelection
              aspect={userProfileImage ? 1 : ASPECT_RATIO}
              minWidth={userProfileImage ? 70 : MIN_DIMENSION}
              style={{ maxWidth: "100%", width: "100%" }}
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Upload"
                style={{
                  maxHeight: "60vh",
                  width: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </BoxComponent>
          <StackComponent
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 2, width: "100%" }}
          >
            <ButtonComp
              size={"normal"}
              onClick={() => {
                setCanvasPreview(
                  imgRef.current,
                  previewCanvasRef.current,
                  convertToPixelCrop(
                    crop,
                    imgRef.current.width,
                    imgRef.current.height,
                  ),
                );
                const dataUrl = previewCanvasRef.current.toDataURL();
                onCropSave(dataUrl);
              }}
              disabled={isLoading}
              sx={{ minWidth: "120px" }}
            >
              {saveLabel}
            </ButtonComp>
          </StackComponent>
        </StackComponent>
      )}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: userProfileImage ? 70 : 150,
            height: userProfileImage ? 70 : 150,
            borderRadius: "20px",
            background: "yellow",
          }}
        />
      )}
    </StackComponent>
  );
};

CropImage.propTypes = {
  heading: PropTypes.string,
  image: PropTypes.string,
  isLoading: PropTypes.bool,
  onCropSave: PropTypes.func,
  saveLabel: PropTypes.string,
  userProfileImage: PropTypes.bool,
};

export default CropImage;
