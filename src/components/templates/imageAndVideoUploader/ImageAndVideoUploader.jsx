"use client";

import React, { useState } from "react";
import * as Yup from "yup";
import PropTypes from "prop-types";
import useResponsiveScreen from "../../../hooks/useResponsiveScreen";
import useUploadFileService from "../../../hooks/useUploadFileService";
import {
  CAMPAIGN_COVER_IMAGE,
  IMAGE_COMPRESSION_OPTIONS,
} from "../../../config/constant";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import CampaignHeading from "../../atoms/createCampaigns/CampaignHeading";
import { theme } from "../../../config/customTheme";
import ImageUploading from "react-images-uploading";
import StackComponent from "../../atoms/StackComponent";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";
import GalleryAdd from "../../../assets/iconComponent/GalleryAdd";
import YoutubeIcon from "../../../assets/iconComponent/YoutubeIcon";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import TextFieldComp from "../../atoms/inputFields/TextFieldComp";
import ModalComponent from "../../molecules/modal/ModalComponent";
import CropImage from "../../molecules/uploadImage/CropImage";
import { base64ToFile } from "../../../utils/base64ToFile";

const DEFAULT_CROPPING_MODAL_STATE = {
  value: false,
  images: [],
};

const ImageAndVideoUploader = React.memo(
  ({
    setOpenImageModal,
    setCoverImageUrlData,
    updateVideo,
    heading = "Change cover media",
    setIsImageUploaded,
  }) => {
    const { isMobile } = useResponsiveScreen();
    const { uploadFileService } = useUploadFileService();

    const [images, setImages] = useState([]);
    const [loader, setLoader] = useState(false);
    const [isShowField, setIsShowField] = useState(false);
    const [openCroppingModal, setOpenCroppingModal] = useState(
      DEFAULT_CROPPING_MODAL_STATE,
    );

    const maxNumber = 50;

    const closeCroppingModal = () => {
      if (!loader) {
        setOpenCroppingModal(DEFAULT_CROPPING_MODAL_STATE);
      }
    };

    const onChange = (imageList) => {
      setIsShowField(false);
      if (imageList && imageList.length > 0) {
        setOpenCroppingModal({
          value: true,
          images: imageList,
        });
      }
    };

    const onCropSaveHandler = (croppedImage) => {
      const file = base64ToFile(croppedImage, "cover_image.png");
      uploadImageHandler([{ data_url: croppedImage, file: file }]);
    };

    const uploadImageHandler = async (imageData = images) => {
      setLoader(true);
      const file = imageData[0].file;
      try {
        const compressedFile = await imageCompression(
          file,
          IMAGE_COMPRESSION_OPTIONS
        );
        const readerForUpload = new FileReader();
        readerForUpload.onloadend = () => {
          const lastDotIndex = compressedFile.name.lastIndexOf(".");
          const fileExtension = compressedFile.name.substring(lastDotIndex + 1);
          handleUploadClick(fileExtension, readerForUpload.result);
        };
        readerForUpload.readAsArrayBuffer(compressedFile);
      } catch (error) {
        toast.error(error);
      }
    };

    const handleUploadClick = async (fileExtension, fileData) => {
      try {
        const { success, imageUrl } = await uploadFileService(
          CAMPAIGN_COVER_IMAGE,
          fileExtension,
          fileData
        );

        if (success) {
          closeCroppingModal();
          setOpenImageModal(false);
          toast.success("Image uploaded successfully");
          setCoverImageUrlData(imageUrl);
          setLoader(false);
          setIsImageUploaded(true);
        } else {
          toast.error("Error uploading file");
          setLoader(false);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    };

    const youTubeButtonHandler = () => {
      setIsShowField(true);
      setImages([]);
    };

    const youtubeLinkSchema = Yup.object().shape({
      youtubeLink: Yup.string().matches(
        /^(https?:\/\/)?(www\.)?(youtube\.com\/(c\/)?[a-zA-Z0-9_-]+|youtu\.be\/[a-zA-Z0-9_-]+|vimeo\.com\/[a-zA-Z0-9_-]+)(\S+)?$/,
        "Please enter a valid YouTube or Vimeo URL"
      ),
    });

    const formik = useFormik({
      initialValues: {
        youtubeLink: "",
      },
      validationSchema: youtubeLinkSchema,
      onSubmit: (values) => {
        updateVideo(values.youtubeLink);
        setOpenImageModal(false);
      },
    });

    return (
      <>
        <CampaignHeading
          align={"center"}
          marginBottom={2}
          sx={{ color: theme.palette.primary.dark }}
        >
          {heading}
        </CampaignHeading>
        <ImageUploading
          multiple={false}
          value={images}
          onChange={onChange}
          maxNumber={maxNumber}
          dataURLKey="data_url"
        >
          {({ onImageUpload }) => (
            <StackComponent direction="column" alignItems="flex-start">
              <ButtonComp
                onClick={onImageUpload}
                variant="text"
                startIcon={<GalleryAdd />}
                size="normal"
              >
                Upload a photo
              </ButtonComp>
              <ButtonComp
                size="normal"
                variant="text"
                sx={{ mt: "-8px !important" }}
                onClick={youTubeButtonHandler}
                startIcon={<YoutubeIcon />}
              >
                Add a YouTube or Vimeo link
              </ButtonComp>
              {isShowField ? (
                <BoxComponent sx={{ width: "100%", mt: 2 }}>
                  <TextFieldComp
                    label={"Youtube or Vimeo link"}
                    placeholder={"Enter link here"}
                    name="youtubeLink"
                    fullWidth
                    value={formik.values.youtubeLink}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.youtubeLink &&
                      Boolean(formik.errors.youtubeLink)
                    }
                    helperText={
                      formik.touched.youtubeLink && formik.errors.youtubeLink
                    }
                  />
                  <ButtonComp
                    disabled={!formik.values.youtubeLink}
                    type="submit"
                    onClick={formik.handleSubmit}
                    fullWidth={isMobile ? true : false}
                  >
                    Save
                  </ButtonComp>
                </BoxComponent>
              ) : null}
              <ButtonComp
                onClick={() => setOpenImageModal(false)}
                fullWidth={true}
                variant="outlined"
                sx={{ display: { xs: "block", sm: "none" } }}
              >
                Close
              </ButtonComp>
            </StackComponent>
          )}
        </ImageUploading>
        <ModalComponent
          open={openCroppingModal.value}
          onClose={() => closeCroppingModal()}
          width="auto"
          padding={0}
          containerStyleOverrides={{
            maxWidth: "95vw",
            maxHeight: "95vh",
            overflow: "hidden",
          }}
        >
          <CropImage
            image={openCroppingModal.images[0]?.data_url}
            saveLabel={loader ? "Saving..." : "Save"}
            isLoading={loader}
            onCropSave={onCropSaveHandler}
          />
        </ModalComponent>
      </>
    );
  }
);

ImageAndVideoUploader.propTypes = {
  setCoverImageUrlData: PropTypes.func,
  setOpenImageModal: PropTypes.func,
  updateVideo: PropTypes.func,
  heading: PropTypes.string,
  setIsImageUploaded: PropTypes.func,
};

ImageAndVideoUploader.displayName = "ImageAndVideoUploader";
export default ImageAndVideoUploader;
