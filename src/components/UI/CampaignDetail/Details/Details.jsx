"use client";

import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DetailsFormSubmit from "./DetailsFormSubmit";
import LargeBtn from "../../../../components/advance/LargeBtn";
import StackComponent from "../../../../components/atoms/StackComponent";
import DropDown from "../../../../components/atoms/inputFields/DropDown";
import useResponsiveScreen from "./../../../../hooks/useResponsiveScreen";
import CoverImagePreview from "../../../../components/advance/CoverImagePreview";
import BoxComponent from "../../../../components/atoms/boxComponent/BoxComponent";
import ModalComponent from "../../../../components/molecules/modal/ModalComponent";
import TypographyComp from "../../../../components/atoms/typography/TypographyComp";
import EditCampaignHeading from "../../../../components/advance/EditCampaignHeading";
import DropDownWithLargeMenu from "../../../../components/atoms/DropDownWithLargeMenu";
import CircularLoader from "../../../../components/atoms/ProgressBarComponent/CircularLoader";
import ImageAndVideoUploader from "../../../../components/templates/imageAndVideoUploader/ImageAndVideoUploader";

import {
  CampaignTimeline,
  FundRaiserUrlField,
  InitialGoalField,
  IsAllowRecurringDonations,
  IsAllowPromoteRecurringDonations,
  IsCommentBox,
  IsCustomDonation,
  IsTextDeductible,
  IsZakatEligible,
  StartingAmountField,
  Story,
  SubTitleField,
  TitleField,
  ZipCodeField,
  IsAllowOneTimeDonations,
} from "./Fields";

import {
  updateCoverMedia,
  updateCategory,
  updateLocation_country,
  updateCoverYoutubeUrl,
  updateMedium,
} from "../../../../store/slices/mutateCampaignSlice";
import { styles } from "@/components/templates/ViewCampaignTemplate/ViewCampaignTemplate.style";
import { CAMPAIGN_MEDIUMS } from "@/config/constant";

const Details = () => {
  const dispatch = useDispatch();
  const { isMobile } = useResponsiveScreen();

  const { countries, categories } = useSelector((state) => state.meta);
  const { coverMedia, category, medium } = useSelector(
    (state) => state.mutateCampaign,
  );

  const [loading, setLoading] = useState(false);
  const [isSubmittionAttempted, setIsSubmittedAttempted] = useState(false);
  const [changeCoverImageModal, setChangeCoverImageModal] = useState(false);

  const coverYoutubeUrl = useSelector(
    (state) => state.mutateCampaign.coverYoutubeUrl,
  );
  const location_country = useSelector(
    (state) => state.mutateCampaign.location_country,
  );

  // Handle both cases: location_country as object or as string ID
  const locationCountry = countries.find((country) => {
    if (!location_country) return false;

    // If location_country is an object with _id
    if (typeof location_country === "object" && location_country._id) {
      return country._id === location_country._id;
    }

    // If location_country is just an ID string
    return country._id === location_country;
  });

  const thumbnailImage =
    coverYoutubeUrl && !coverMedia ? coverYoutubeUrl : coverMedia;

  return (
    <>
      <DetailsFormSubmit
        setLoading={setLoading}
        setIsSubmittedAttempted={setIsSubmittedAttempted}
      >
        <StackComponent direction="column">
          <EditCampaignHeading>Title and Subtitle</EditCampaignHeading>
          <TitleField isSubmittionAttempted={isSubmittionAttempted} />
          <SubTitleField isSubmittionAttempted={isSubmittionAttempted} />
        </StackComponent>
        <StackComponent direction="column" sx={{ mt: "12px !important" }}>
          <EditCampaignHeading>Goal Amount</EditCampaignHeading>
          <InitialGoalField isSubmittionAttempted={isSubmittionAttempted} />
        </StackComponent>
        <StackComponent direction="column" sx={{ mt: "12px !important" }}>
          {/* <EditCampaignHeading>Collected Amount</EditCampaignHeading> */}
          <StartingAmountField isSubmittionAttempted={isSubmittionAttempted} />
        </StackComponent>
        <StackComponent direction="column">
          <EditCampaignHeading
            containerStyleOverrides={{
              pb: 1,
            }}
            withEdit={true}
            editAction={() => setChangeCoverImageModal(true)}
          >
            Cover Media
          </EditCampaignHeading>

          <CoverImagePreview
            imageSrc={thumbnailImage}
            containerStyleOverrides={styles.coverImg}
            height="450px"
          />
        </StackComponent>

        <StackComponent direction="column" spacing={1}>
          <Story />
        </StackComponent>
        <StackComponent direction="column" sx={{ mt: "10px !important" }}>
          <EditCampaignHeading>Fundraiser URL</EditCampaignHeading>
          <FundRaiserUrlField />
        </StackComponent>
        <StackComponent direction="column" sx={{ mt: "12px !important" }}>
          <EditCampaignHeading>Category</EditCampaignHeading>

          <DropDownWithLargeMenu
            placeholder="Select Category"
            data={categories}
            isLabel={false}
            selectedValue={category}
            onChange={(newVal) => dispatch(updateCategory(newVal))}
          />
        </StackComponent>
        <StackComponent direction="column" sx={{ mt: "12px !important" }}>
          <EditCampaignHeading>Medium</EditCampaignHeading>

          <DropDownWithLargeMenu
            placeholder="Select Medium"
            data={CAMPAIGN_MEDIUMS}
            isLabel={false}
            selectedValue={medium}
            onChange={(newVal) => dispatch(updateMedium(newVal))}
          />
        </StackComponent>
        <StackComponent direction="column">
          <EditCampaignHeading>Location</EditCampaignHeading>
          <StackComponent spacing={2} direction={{ xs: "column", sm: "row" }}>
            <DropDown
              placeholder="Select Country"
              data={countries}
              label="Country"
              selectedValue={locationCountry || null}
              onChange={(newVal) => dispatch(updateLocation_country(newVal))}
              textColor="#606062"
            />
            <ZipCodeField isSubmittionAttempted={isSubmittionAttempted} />
          </StackComponent>
        </StackComponent>
        <BoxComponent sx={{ mt: "12px !important" }}>
          <IsAllowRecurringDonations />
        </BoxComponent>
        <IsAllowPromoteRecurringDonations />
        <IsAllowOneTimeDonations />
        <IsCommentBox />
        <IsZakatEligible />
        <IsTextDeductible />
        <IsCustomDonation />
        <CampaignTimeline />
        <LargeBtn
          type="submit"
          fullWidth={isMobile ? true : false}
          sx={{ mt: "40px" }}
          disabled={loading}
        >
          {loading ? (
            <StackComponent alignItems="center" component="span">
              <CircularLoader color="white" size="20px" />
              <TypographyComp>Saving...</TypographyComp>
            </StackComponent>
          ) : (
            "Save"
          )}
        </LargeBtn>
      </DetailsFormSubmit>

      {changeCoverImageModal && (
        <ModalComponent
          width={422}
          padding={"48px 32px"}
          open={changeCoverImageModal}
          onClose={() => setChangeCoverImageModal(false)}
        >
          <ImageAndVideoUploader
            setOpenImageModal={(choice) => setChangeCoverImageModal(choice)}
            setCoverImageUrlData={(image) => dispatch(updateCoverMedia(image))}
            updateVideo={(youtubeUrl) =>
              dispatch(updateCoverYoutubeUrl(youtubeUrl))
            }
          />
        </ModalComponent>
      )}
    </>
  );
};

const MemoizedDetails = memo(Details);
export default MemoizedDetails;
