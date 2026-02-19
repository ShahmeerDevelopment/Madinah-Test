/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useState } from "react";
import TabComp from "@/components/molecules/Tabs/TabComp";
// import { Wrapper } from "@/styles/CampaignDetails.style";
import BackButton from "@/components/atoms/createCampaigns/BackButton";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { useGetSingleCampaign } from "@/api";
import { useDispatch, useSelector } from "react-redux";
import { updateValues } from "@/store/slices/mutateCampaignSlice";
import { theme } from "@/config/customTheme";
import { useRouter, useSearchParams } from "next/navigation";
import { Wrapper } from "@/components/UI/Dashboard/Dashboard.style";
import { getAllVisits } from "@/api/get-api-services";
import dayjs from "dayjs";
import { CAMPAIGN_MEDIUMS, RANDOM_URL } from "@/config/constant";
import OutlinedIconButton from "@/components/advance/OutlinedIconButton";
import CopyIcon from "@/components/molecules/table/icons/CopyIcon";
import toast from "react-hot-toast";
import LinkComponent from "@/components/atoms/LinkComponent";

const CampaignDetail = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const [extraParam, setExtraParam] = useState();
  const utmParameters = useSelector((state) => state.utmParameters);
  const allValues = useSelector((state) => state.mutateCampaign);

  const {
    data: singleCampaign,
    isLoading,
    isError,
    error,
  } = useGetSingleCampaign(campaignId, "update");

  if (isError) return <p>Error: {error.message}</p>;

  useEffect(() => {
    // Get all search params except 'id'
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id"); // Remove the id param

    const extraString = params.toString();
    if (extraString) {
      setExtraParam(extraString);
    }
  }, [searchParams]);

  useEffect(() => {
    getAllVisits(
      utmParameters.utmSource,
      utmParameters.utmMedium,
      utmParameters.utmCampaign,
      utmParameters.utmTerm,
      utmParameters.utmContent,
      utmParameters.referral,
    );
  }, []);

  // Helper function to find medium object by value
  const findMediumObjectByValue = (mediumValue) => {
    return (
      CAMPAIGN_MEDIUMS.find((medium) => medium.value === mediumValue) || null
    );
  };

  const singleCampaignDetails =
    singleCampaign && singleCampaign?.data?.data?.campaignDetails;

  const addInitialData = (dataFromBackend) => {
    const {
      title,
      subTitle,
      automaticDonationDays,
      targetAmount,
      coverImageUrl,
      videoLinks,
      story,
      uniqueDonationsCount,
      categoryId,
      medium,
      countryId,
      zipCode,
      isRecurringDonation,
      isZakatEligible,
      isOneTimeDonation,
      isTaxDeductable,
      amountCurrency,
      currencySymbol,
      privacy,
      teamMembers,
      campaignerId,
      milestoneNotifications,
      meta,
      status,
      randomToken,
      _id,
      givingLevels,
      sellConfigs,
      isCustomDonationsAllowed,
      minimumDonationAmount,
      endDate,
      isCommentAllowed,
      commentboxHeading,
      isPromoteRecurringDonations,
    } = dataFromBackend;
    const {
      allowDonations,
      allowToAppearInSearchResult,
      allowToAppearOnFundraiserPage,
    } = privacy;

    // let temp = { ...allValues };

    let temp = {
      ...allValues,
      scriptValues: {
        ...allValues.scriptValues,
      },
    };
    if (categoryId) {
      temp.category = categoryId;
    }
    if (medium) {
      // Convert medium from string to object
      temp.medium = findMediumObjectByValue(medium);
    }
    if (status) {
      temp.status = status;
    }
    if (countryId) {
      temp.location_country = countryId;
    }
    if (isZakatEligible !== undefined) {
      temp.zakatEligible = !!isZakatEligible;
    } else {
      temp.zakatEligible = true;
    }
    if (isRecurringDonation !== undefined) {
      temp.allowRecurringDonations = !!isRecurringDonation;
    } else {
      temp.allowRecurringDonations = true;
    }

    temp.promoteRecurringDonations = isPromoteRecurringDonations;

    if (isOneTimeDonation !== undefined) {
      temp.allowOneTimeDonations = !!isOneTimeDonation;
    } else {
      temp.allowOneTimeDonations = true;
    }
    if (isCustomDonationsAllowed !== undefined) {
      temp.allowCustomDonation = !!isCustomDonationsAllowed;
    } else {
      temp.allowCustomDonation = true;
    }

    if (isCommentAllowed !== undefined) {
      temp.isCommentAllowed = !!isCommentAllowed;
    } else if (isCommentAllowed === undefined) {
      temp.isCommentAllowed = false;
    } else {
      temp.isCommentAllowed = true;
    }

    if (commentboxHeading) {
      temp.commentboxHeading = commentboxHeading;
    }

    if (automaticDonationDays) {
      temp.automaticDonationDays = automaticDonationDays;
    }

    if (isTaxDeductable !== undefined) {
      temp.taxDeductable = !!isTaxDeductable;
    } else {
      temp.taxDeductable = false;
    }
    if (endDate) {
      temp.campaignTimelineDate = dayjs(endDate);
      temp.allowCampaignTimeline = true;
    }
    if (allowDonations !== undefined) {
      temp.allowFundraiserToAcceptDonations = !!allowDonations;
    } else {
      temp.allowFundraiserToAcceptDonations = true;
    }
    if (allowToAppearInSearchResult !== undefined) {
      temp.allowAppearInSearchResultsAndSuggestedLists =
        !!allowToAppearInSearchResult;
    } else {
      temp.allowAppearInSearchResultsAndSuggestedLists = true;
    }
    if (allowToAppearOnFundraiserPage !== undefined) {
      temp.allowSuggestedToAppearInFundraiserPage =
        !!allowToAppearOnFundraiserPage;
    } else {
      temp.allowSuggestedToAppearInFundraiserPage = true;
    }
    if (story) {
      temp.story = story;
    }
    if (coverImageUrl && (!videoLinks || videoLinks?.length === 0)) {
      temp.coverMedia = coverImageUrl;
    }
    if (videoLinks) {
      temp.coverYoutubeUrl = videoLinks[0]?.url;
    }
    if (amountCurrency) {
      temp.currency = amountCurrency;
    }
    if (currencySymbol) {
      temp.currencySymbol = currencySymbol;
    }
    if (targetAmount) {
      temp.initialGoal = targetAmount;
    }
    if (minimumDonationAmount) {
      temp.minimumDonationValue = minimumDonationAmount;
    }
    if (dataFromBackend?.startingAmount) {
      temp.startingAmount = dataFromBackend.startingAmount;
    } else {
      temp.startingAmount = 0;
    }

    if (title) {
      temp.title = title;
    }
    if (subTitle) {
      temp.subTitle = subTitle;
    }
    if (zipCode) {
      temp.location_zipCode = zipCode;
    }
    if (
      Array.isArray(milestoneNotifications) &&
      milestoneNotifications.length > 0
    ) {
      temp.milestoneNotifications = milestoneNotifications;
    }

    if (Array.isArray(meta) && meta.length > 0) {
      meta.forEach((item) => {
        if (item.type === "viewPageScript") {
          temp.scriptValues.viewPageScript = item.value;
        } else if (item.type === "donationButtonScript") {
          temp.scriptValues.donationButtonScript = item.value;
        }
      });
    }

    if (Array.isArray(teamMembers) && teamMembers.length > 0) {
      temp.team = teamMembers;
    }

    if (campaignerId) {
      temp.creator = `${campaignerId.firstName} ${campaignerId.lastName}`;
      temp.creatorEmail = `${campaignerId.email}`;
    }
    temp.emailCount = uniqueDonationsCount;
    if (randomToken) {
      temp.fundraiserCustomUrl = randomToken;
    }
    if (milestoneNotifications) {
      // temp.milestoneNotifications = [
      // 	...new Set(milestoneNotifications?.map((el) => `${el}%`)),
      // ];
      temp.milestoneNotifications = milestoneNotifications;
    }
    if (_id) {
      temp.id = _id;
    }
    temp.gradingLevelsList = givingLevels;
    temp.upSellLevel = sellConfigs;
    dispatch(updateValues(temp));
  };
  // const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (singleCampaignDetails) {
      addInitialData(singleCampaignDetails);
    }
  }, [singleCampaignDetails, dispatch]);

  const copyLinkToClipboard = () => {
    navigator.clipboard
      .writeText(`${RANDOM_URL}donation-success/${campaignId}`)
      .then(() => {
        toast.success("Link copied successfully!");
      })
      .catch((err) => {
        toast.error("Failed to copy: ", err);
      });
  };

  return (
    <Wrapper isBackground={true}>
      <BoxComponent
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 5,
          mt: 1,
          gap: 1,
        }}
      >
        <BackButton isStepperInclude={false} />
        <BoxComponent
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ButtonComp
            onClick={() => router.push(`/preview?id=${campaignId}`)}
            variant="outlined"
            size={"normal"}
            sx={{ width: "113px" }}
          >
            Preview
          </ButtonComp>
          <LinkComponent
            target={"_blank"}
            href={`/donation-success/${campaignId}?isThankYouPage=true`}
          >
            <ButtonComp
              // onClick={() =>
              //   router.push({
              //     pathname: "/donation-success",
              //     query: { id: campaignId, isThankYouPage: true }, // Pass the boolean here
              //   })
              // }
              variant="outlined"
              size={"normal"}
              sx={{ width: "auto" }}
            >
              <BoxComponent
                component="span"
                sx={{ display: { xs: "inline", sm: "none" } }}
              >
                Thank You
              </BoxComponent>
              <BoxComponent
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Thank you Page
              </BoxComponent>
            </ButtonComp>
          </LinkComponent>
          <OutlinedIconButton
            width={44}
            height={44}
            sx={{ padding: "0px 0px 0px 0px" }}
            borderColor="rgba(99, 99, 230, 0.5)"
            onClick={() => copyLinkToClipboard()}
          >
            <CopyIcon />
          </OutlinedIconButton>
        </BoxComponent>
      </BoxComponent>

      <TypographyComp
        align="left"
        sx={{
          fontSize: "32px",
          fontWeight: 500,
          lineHeight: "38px",
          mb: 2,
          color: theme.palette.primary.dark,
        }}
      >
        Edit fundraiser
      </TypographyComp>
      {isLoading ? (
        <p>Loading campaigns...</p>
      ) : (
        <TabComp
          tabSearch={extraParam}
          singleCampaignDetails={singleCampaignDetails}
        />
      )}
    </Wrapper>
  );
};
const MemoizedCampaignDetails = React.memo(CampaignDetail);
export default MemoizedCampaignDetails;
