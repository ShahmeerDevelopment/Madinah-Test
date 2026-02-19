"use client";

import React, { useState, forwardRef, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useUploadFileService from "@/hooks/useUploadFileService";
import { BANK_DOCUMENT_COVER_IMAGE } from "@/config/constant";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import Paragraph from "@/components/atoms/createCampaigns/Paragraph";
import PropTypes from "prop-types";
import UploadFile from "@/components/molecules/uploadImage/uploadFile/UploadFile";

const BankFileUpload = forwardRef(
  (
    {
      imagesDataUrl,
      defaultFormState,
      createCampaign = false,
      title = "Bank Verification Documents",
      body = "Upload Bank Statement (must be from the last three months), or Voided. Check, or Bank letter showing bank logo, full name on the account and full account number.",
      imageType = BANK_DOCUMENT_COVER_IMAGE,
      multiple = true,
    },
    ref
  ) => {
    const bankInfoImages = useSelector((state) => state?.campaign?.bankInfoImages);
    
    const [images, setImages] = useState(
      title === "Bank Verification Documents"
        ? createCampaign 
          ? bankInfoImages || []
          : defaultFormState?.bankInfo?.bankDocuments || []
        : []
    );

    const { uploadFileService } = useUploadFileService();
    const [isLoading, setIsLoading] = useState(false);
    const prevImagesRef = useRef();
    const imagesDataUrlRef = useRef(imagesDataUrl);
    const isInitialMount = useRef(true);

    // Update the ref when imagesDataUrl changes
    useEffect(() => {
      imagesDataUrlRef.current = imagesDataUrl;
    }, [imagesDataUrl]);

    const handleDeleteFile = (index) => {
      const updatedList = [...images];
      updatedList.splice(index, 1);
      setImages(updatedList);
    };
    const uploadFileHandler = (value, _, generalUpload = false) => {
      setIsLoading(true);
      if (generalUpload) {
        // Only use the last file if multiple files are selected
        const file = value[value.length - 1];
        const readerForUpload = new FileReader();
        readerForUpload.onloadend = () => {
          const lastDotIndex = file.name.lastIndexOf(".");
          const fileExtension = file.name.substring(lastDotIndex + 1);
          handleUploadClick(fileExtension, readerForUpload.result, true, [
            file,
          ]);
        };
        readerForUpload.readAsArrayBuffer(file);
      } else {
        const file = value[0].file;
        const readerForUpload = new FileReader();
        readerForUpload.onloadend = () => {
          const lastDotIndex = file.name.lastIndexOf(".");
          const fileExtension = file.name.substring(lastDotIndex + 1);
          handleUploadClick(fileExtension, readerForUpload.result);
        };
        readerForUpload.readAsArrayBuffer(file);
      }
    };

    const handleUploadClick = async (
      fileExtension,
      fileData,
      generalFilesIncluded,
      files
    ) => {
      try {
        const { success, imageUrl } = await uploadFileService(
          imageType,
          fileExtension,
          fileData
        );

        if (success) {
          if (generalFilesIncluded) {
            const uploadedFiles = files.map((file) => ({
              name: file.name,
              url: imageUrl,
              fileData: file,
            }));
            // Replace existing images with new one
            setImages(uploadedFiles);
          } else {
            // Replace existing images with new one
            setImages([imageUrl]);
          }
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    useEffect(() => {
      // Skip calling imagesDataUrl on initial mount if we already have images from Redux
      if (isInitialMount.current && createCampaign && images.length > 0) {
        isInitialMount.current = false;
        prevImagesRef.current = JSON.stringify(images);
        return;
      }
      
      isInitialMount.current = false;
      
      // Only call imagesDataUrl if images have actually changed
      const currentImagesString = JSON.stringify(images);
      if (typeof imagesDataUrlRef.current === "function" && prevImagesRef.current !== currentImagesString) {
        prevImagesRef.current = currentImagesString;
        imagesDataUrlRef.current(images);
      }
    }, [images, createCampaign]); // Added createCampaign to dependencies

    return (
      <BoxComponent sx={{ marginTop: "12px" }}>
        <SubHeading>{title}</SubHeading>
        <Paragraph sx={{ pb: 4 }}>{body}</Paragraph>
        <UploadFile
          ref={ref}
          onlyImages={false}
          images={images}
          onUpload={uploadFileHandler}
          isLoading={isLoading}
          handleFileDeletion={handleDeleteFile}
          oldImages={
            title === "Bank Verification Documents"
              ? defaultFormState?.bankInfo?.bankDocuments
              : null
          }
          multiple={multiple}
        />
      </BoxComponent>
    );
  }
);
BankFileUpload.displayName = "BankFileUpload";
BankFileUpload.propTypes = {
  imagesDataUrl: PropTypes.func,
  defaultFormState: PropTypes.any,
  createCampaign: PropTypes.bool,
  title: PropTypes.string,
  body: PropTypes.string,
  imageType: PropTypes.string,
  multiple: PropTypes.bool,
};

export default BankFileUpload;
