"use client";

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import ImageUploading from "react-images-uploading";
import "react-image-crop/dist/ReactCrop.css";
import { base64ToFile } from "@/utils/base64ToFile";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import PopOverIcon from "@/assets/iconComponent/PopOverIcon";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { theme } from "@/config/customTheme";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import CropImage from "./CropImage";
import ModalComponent from "../modal/ModalComponent";

const DEFAULT_CROPPING_MODAL_STATE = {
  value: false,
  images: [],
};

const UploadImage = ({
  setImages,
  images,
  // setIsShowImage,
  isShowImage,
  hasCroppingFunctionality = true,
  onUploadHandler,
  loader,
  imageLink,
  setOpen,
  aiGeneratedImage,
}) => {
  const [openCroppingModal, setOpenCroppingModal] = React.useState(
    DEFAULT_CROPPING_MODAL_STATE
  );

  useEffect(() => {
    if (aiGeneratedImage) {
      setImages([{ data_url: aiGeneratedImage }]);

      // Here, we directly open the cropping modal if the AI image is set
      if (hasCroppingFunctionality) {
        setOpenCroppingModal({
          value: true,
          images: [{ data_url: aiGeneratedImage }],
        });
      }
    }
  }, [aiGeneratedImage, hasCroppingFunctionality, setImages]);

  const updateImages = (imagesArr) => setImages(imagesArr);
  const closeCroppingModal = () => {
    if (!loader) {
      setOpenCroppingModal(DEFAULT_CROPPING_MODAL_STATE);
    }
  };
  const maxNumber = 69;
  const onChange = (imageList) => {
    // setIsShowImage(true);

    if (hasCroppingFunctionality) {
      setOpenCroppingModal({
        value: true,
        images: imageList,
      });
    } else {
      updateImages(imageList);
    }
  };

  const onCropSaveHandler = (croppedImage) => {
    const file = base64ToFile(croppedImage, "login_image.png");
    onUploadHandler(
      [{ data_url: croppedImage, file: file }],
      closeCroppingModal
    );
    // setIsShowImage(true);
  };

  const handleCoverImagePopup = () => setOpen(true);

  return (
    <div>
      <ImageUploading
        multiple={false}
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({ onImageUpload, onImageUpdate, dragProps }) => (
          <BoxComponent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
            {...dragProps}
          >
            {!isShowImage ? (
              <BoxComponent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <BoxComponent
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "space-between", sm: "flex-start" },
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <SubHeading sx={{ color: "#090909" }}>
                    Upload Images
                  </SubHeading>
                  <BoxComponent
                    sx={{ cursor: "pointer" }}
                    onClick={handleCoverImagePopup}
                  >
                    <PopOverIcon />
                  </BoxComponent>
                </BoxComponent>
                <TypographyComp
                  color={theme.palette.primary.gray}
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "16px",
                    width: "273px",
                    mb: 3,
                  }}
                >
                  Upload your campaign image using the button below or drag and
                  drop your photo into the upload area
                </TypographyComp>
                <ButtonComp
                  variant="contained"
                  onClick={onImageUpload}
                  sx={{
                    padding: "12px 32px",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "20px",
                  }}
                  component="span"
                >
                  Select photos
                </ButtonComp>
              </BoxComponent>
            ) : (
              <BoxComponent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <BoxComponent
                  sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "400px",
                    height: "137px",
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={imageLink}
                    alt="cover_image"
                    fill
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </BoxComponent>
                <ButtonComp
                  padding={"10px 19px"}
                  fontSize={"14px"}
                  lineHeight="16px"
                  // fontWeight={500}
                  variant="outlined"
                  size="normal"
                  sx={{
                    width: "161px",
                    letterSpacing: "-0.41px",
                  }}
                  height={"36px"}
                  component="span"
                  onClick={() => onImageUpdate()}
                >
                  Choose another photo
                </ButtonComp>
              </BoxComponent>
            )}
          </BoxComponent>
        )}
      </ImageUploading>
      <ModalComponent
        open={openCroppingModal.value}
        onClose={() => closeCroppingModal()}
      >
        <CropImage
          image={openCroppingModal.images[0]?.data_url}
          saveLabel={loader ? "Saving..." : "Save"}
          isLoading={loader}
          onCropSave={onCropSaveHandler}
        />
      </ModalComponent>
    </div>
  );
};

UploadImage.propTypes = {
  hasCroppingFunctionality: PropTypes.bool,
  images: PropTypes.any,
  isShowImage: PropTypes.bool,
  setImages: PropTypes.func,
  // setIsShowImage: PropTypes.func,
  onUploadHandler: PropTypes.func,
  loader: PropTypes.bool,
  imageLink: PropTypes.string,
  setOpen: PropTypes.func,
  aiGeneratedImage: PropTypes.any,
};

export default UploadImage;
