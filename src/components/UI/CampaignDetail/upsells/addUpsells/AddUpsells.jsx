import React, { memo, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Divider from "@mui/material/Divider";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

import { getVideoThumbnail } from "@/utils/helpers";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import PopOverIcon from "@/assets/iconComponent/PopOverIcon";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { theme } from "@/config/customTheme";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import AddUpsellsForm from "./AddUpsellsForm";
import ModalComponent from "@/components/molecules/modal/ModalComponent";
import ImageAndVideoUploader from "@/components/templates/imageAndVideoUploader/ImageAndVideoUploader";

export const boxStyles = {
  height: "223px",
  width: "100%",
  borderRadius: "8px",
  padding: { xs: "10px 5px 10px 5px", sm: "32px 48px" },
  border: `2px dashed ${theme.palette.primary.lightGray}`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  mt: "24px",
  mb: "18px",
};

const AddUpsells = memo(
  ({
    id,
    isLoading,
    submitUpSellData,
    allowRecurringDonations,
    allowOneTimeDonations,
  }) => {
    const [openImageModal, setOpenImageModal] = useState(false);
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [imageOrVideoUrl, setImageOrVideoUrl] = useState(null);
    const [sendURLtoBackend, setSendURLtoBackend] = useState(null);

    const onUploadButton = useCallback(() => setOpenImageModal(true), []);

    const youtubeUrlHandler = async (url) => {
      // const videoUrl = url;
      setImageOrVideoUrl(url);

      if (url) {
        setIsImageUploaded(true);
        setSendURLtoBackend(url);
        if (
          url?.includes("youtube.com") ||
          url?.includes("youtu.be") ||
          url?.includes("vimeo.com")
        ) {
          const thumbnail = await getVideoThumbnail(url);
          setImageOrVideoUrl(thumbnail);
        } else {
          setImageOrVideoUrl(url);
        }
      }
    };

    useEffect(() => {
      if (
        !imageOrVideoUrl?.includes("youtube.com") &&
        !imageOrVideoUrl?.includes("youtu.be") &&
        !imageOrVideoUrl?.includes("vimeocdn.com")
      ) {
        setSendURLtoBackend(imageOrVideoUrl);
      }
    }, [imageOrVideoUrl]);

    const onSubmitHandler = async (
      value,
      amount,
      resetForm,
      donationOption,
      specialDays,
      specialDaysEndDate,
    ) => {
      try {
        await submitUpSellData(
          value,
          amount,
          id,
          "upSell",
          sendURLtoBackend,
          donationOption,
          specialDays,
          specialDaysEndDate,
        );
        setImageOrVideoUrl(null);
        setIsImageUploaded(false);
        resetForm();
      } catch (err) {
        toast.error(err.message);
      }
    };

    return (
      <div>
        <SubHeading>Add Upsell page</SubHeading>
        <BoxComponent sx={boxStyles}>
          {isImageUploaded ? (
            <BoxComponent
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: "400px",
                height: "137px",
                borderRadius: "5px",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              <Image
                src={imageOrVideoUrl}
                alt="cover_image"
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </BoxComponent>
          ) : (
            <>
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
                  Upload Image or photo
                </SubHeading>
                <BoxComponent
                  sx={{ cursor: "pointer" }}
                  // onClick={handleCoverImagePopup}
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
                  textAlign: "center",
                }}
              >
                Upload your campaign image using the button below or drag and
                drop your photo into the upload area
              </TypographyComp>
            </>
          )}
          <ButtonComp size="normal" onClick={onUploadButton}>
            Select photo or video
          </ButtonComp>
        </BoxComponent>
        <AddUpsellsForm
          isLoading={isLoading}
          onSubmit={onSubmitHandler}
          imageOrVideoUrl={imageOrVideoUrl}
          allowRecurringDonations={allowRecurringDonations}
          allowOneTimeDonations={allowOneTimeDonations}
        />
        <Divider sx={{ my: "32px" }}></Divider>
        {openImageModal && (
          <ModalComponent
            width={422}
            padding={"48px 32px"}
            open={openImageModal}
            onClose={() => setOpenImageModal(false)}
          >
            <ImageAndVideoUploader
              setIsImageUploaded={setIsImageUploaded}
              setOpenImageModal={(choice) => setOpenImageModal(choice)}
              setCoverImageUrlData={(image) => setImageOrVideoUrl(image)}
              updateVideo={youtubeUrlHandler}
              heading="Upload Image or photo"
            />
          </ModalComponent>
        )}
      </div>
    );
  },
);
AddUpsells.displayName = "AddUpsells";

AddUpsells.propTypes = {
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  submitUpSellData: PropTypes.func,
  allowRecurringDonations: PropTypes.string,
  allowOneTimeDonations: PropTypes.string,
};
export default AddUpsells;
