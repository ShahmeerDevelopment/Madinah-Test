"use client";

import PropTypes from "prop-types";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { postZipCodeValidation, updateCampaign } from "../../../../api";
import StackComponent from "../../../../components/atoms/StackComponent";
import {
  minimumDonationValueHandler,
  updateStartingAmount,
} from "../../../../store/slices/mutateCampaignSlice";
import { getTextLengthWithoutHTML } from "@/utils/helpers";
import { revalidateCampaignCache, revalidateMultipleTags } from "@/utils/revalidateCache";
import dayjs from "dayjs";

const DetailsFormSubmit = ({
  setLoading,
  children,
  setIsSubmittedAttempted,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const allValues = useSelector((state) => state.mutateCampaign);
  const _id = useSelector((state) => state.mutateCampaign.id);
  const campaignSlug = useSelector(
    (state) => state.mutateCampaign.fundraiserCustomUrl,
  );

  const handleSubmit = async () => {
    const editorDataRefContent = allValues?.story || "";
    const maxLength = 50000;

    if (allValues.allowCampaignTimeline && !allValues.campaignTimelineDate) {
      toast.error("End date is required once selected.");
      setLoading(false);
      return;
    }
    if (
      allValues.allowCampaignTimeline &&
      allValues.campaignTimelineDate &&
      dayjs(allValues.campaignTimelineDate)
        .startOf("day")
        .isBefore(dayjs().startOf("day").add(1, "day"))
    ) {
      toast.error("Please select a date after today.");
      setLoading(false);
      return;
    }
    if (getTextLengthWithoutHTML(editorDataRefContent) <= maxLength) {
      const payload = {
        countryId: allValues.location_country?._id,
        categoryId: allValues.category?._id,
        campaignTitle: allValues.title,
        subTitle: allValues.subTitle,
        medium: allValues.medium?.value,
        campaignStory: allValues.story,
        coverImageUrl: allValues.coverYoutubeUrl ? "" : allValues.coverMedia,
        customUrl: allValues.fundraiserCustomUrl,
        zipCode: allValues.location_zipCode,
        fundraisingGoal: {
          currencyUnit: allValues.currency,
          amount: +allValues.initialGoal,
        },
        startingAmount: allValues.startingAmount,

        videoLinks: allValues.coverYoutubeUrl
          ? [{ url: allValues.coverYoutubeUrl, type: "youtube" }]
          : [],
        isZakatEligible: allValues.zakatEligible,
        isTaxDeductable: allValues?.taxDeductable,
        isRecurringDonation: allValues.allowRecurringDonations,
        isOneTimeDonation: allValues.allowOneTimeDonations,
        isCustomDonationsAllowed: allValues.allowCustomDonation,
        endDate: allValues?.campaignTimelineDate,
        minimumDonationAmount: allValues.allowCustomDonation
          ? +allValues.minimumDonationValue
          : 0,
        isCommentAllowed: allValues?.isCommentAllowed,
        commentboxHeading: allValues?.commentboxHeading,
        isPromoteRecurringDonations: allValues?.promoteRecurringDonations,
      };
      const zipCodePayload = {
        countryCode: allValues?.location_country?.isoAlpha2,
        zipCode: allValues?.location_zipCode,
      };
      const res = await postZipCodeValidation(zipCodePayload);
      const response = res?.data?.data?.zipCodeValidity;
      if (response) {
        updateCampaign(payload, _id)
          .then(async (res) => {
            const result = res?.data;
            if (result.success) {
              toast.success("Campaign Updated Successfully");
              dispatch(updateStartingAmount(0));
              dispatch(minimumDonationValueHandler(0));
              // Revalidate campaign cache (left side + giving levels)
              if (campaignSlug) {
                const revalidated = await revalidateMultipleTags(campaignSlug, [
                  `campaign-left-${campaignSlug}`,
                  `campaign-giving-levels-${campaignSlug}`,
                ]);
              } else {
                console.warn(
                  "[Campaign Update] No campaign slug found, skipping revalidation",
                );
              }

              router.push("/dashboard");
            } else {
              toast.error(result.message);
            }
          })
          .catch((error) => {
            console.error(error);
            toast.error("Something went wrong");
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
        toast.error("Invalid Zip Code");
      }
    } else {
      setLoading(false);
      toast.error("Maximum story character limit of 50,000 is allowed.");
    }
  };

  // const dispatch = useDispatch();
  return (
    <StackComponent
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);
        handleSubmit();
        setIsSubmittedAttempted(true);
      }}
      direction="column"
      spacing="32px"
    >
      {children}
    </StackComponent>
  );
};

DetailsFormSubmit.propTypes = {
  children: PropTypes.any,
  setIsSubmittedAttempted: PropTypes.func,
  setLoading: PropTypes.func,
};

export default DetailsFormSubmit;
