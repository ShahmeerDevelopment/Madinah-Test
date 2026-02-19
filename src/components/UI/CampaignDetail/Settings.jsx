"use client";

import React, { useState, memo } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { updateSettings } from "../../../api";
import { revalidateCampaignCache } from "@/utils/revalidateCache";
import { theme } from "../../../config/customTheme";
import { MILESTONE } from "../../../config/constant";
import { SettingTypographyWrapper } from "../../../styles/CampaignDetails.style";
import { deleteCampaign } from "../../../api/delete-api-services";
import SubHeading from "../../../components/atoms/createCampaigns/SubHeading";
import ButtonComp from "../../../components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "../../../components/atoms/boxComponent/BoxComponent";
import ModalComponent from "../../../components/molecules/modal/ModalComponent";
import TypographyComp from "../../../components/atoms/typography/TypographyComp";
import AccordionBox from "../../../components/molecules/accodionBox/AccordionBox";
import DeleteModals from "../../../components/molecules/deleteModals/DeleteModals";
import SelectAbleButton from "../../../components/atoms/selectAbleField/SelectAbleButton";
import CustomSwitchButton from "../../../components/atoms/buttonComponent/CustomSwitchButton";
import CampaignWidget from "./CampaignWidget";
// import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
// import StackComponent from "@/components/atoms/StackComponent";
// import CircularLoader from "@/components/atoms/ProgressBarComponent/CircularLoader";
// import { validateScript } from "@/utils/scriptValidator";

const Settings = memo(({ singleCampaignDetails }) => {
  const router = useRouter();
  const {
    _id,
    currentUserRole,
    milestoneNotifications = [],
    privacy = {},
    customUrl,
  } = singleCampaignDetails;

  const [selectedTags, setSelectedTags] = useState(milestoneNotifications);
  const [isAllowToAppearInSearchResult, setIsAllowToAppearInSearchResult] =
    useState(privacy.allowToAppearInSearchResult || false);
  const [allowToAppearOnFundraiserPage, setAllowToAppearOnFundraiserPage] =
    useState(privacy.allowToAppearOnFundraiserPage || false);
  // const scriptValues = useSelector(
  //   (state) => state.mutateCampaign.scriptValues,
  // );

  const [isDeleteLoader, setIsDeleteLoader] = useState(false);
  const [openDeleteModel, setOpenDeleteMOdel] = useState(false);

  const handleBoxClick = async (item) => {
    if (currentUserRole === "admin") {
      const updatedTags = selectedTags.includes(item)
        ? selectedTags.filter((tag) => tag !== item)
        : [...selectedTags, item];

      setSelectedTags(updatedTags);

      const payload = {
        allowToAppearInSearchResult: isAllowToAppearInSearchResult,
        allowToAppearOnFundraiserPage: allowToAppearOnFundraiserPage,
        milestoneNotifications: updatedTags,
      };

      try {
        await updateSettings(payload, _id);
        toast.success("Notification settings updated");

        // Revalidate campaign cache
        if (customUrl) {
          await revalidateCampaignCache(customUrl, true);
        }
      } catch (error) {
        console.error("Error updating settings:", error);
        toast.error("Failed to update settings");
      }
    }
  };
  // updateSettings
  const handleAllowToAppearOnFundraiserPage = async (e) => {
    const newValue = e.target.checked;
    setAllowToAppearOnFundraiserPage(newValue);

    const payload = {
      allowToAppearInSearchResult: isAllowToAppearInSearchResult,
      allowToAppearOnFundraiserPage: newValue,
      milestoneNotifications: selectedTags,
    };

    try {
      await updateSettings(payload, _id);
      toast.success("Privacy settings updated");

      // Revalidate campaign cache
      if (customUrl) {
        await revalidateCampaignCache(customUrl, true);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  };

  const handleAllowToAppearInSearchResults = async (e) => {
    const newValue = e.target.checked;
    setIsAllowToAppearInSearchResult(newValue);

    const payload = {
      allowToAppearInSearchResult: newValue,
      allowToAppearOnFundraiserPage: allowToAppearOnFundraiserPage,
      milestoneNotifications: selectedTags,
    };

    try {
      await updateSettings(payload, _id);
      toast.success("Privacy settings updated");

      // Revalidate campaign cache
      if (customUrl) {
        await revalidateCampaignCache(customUrl, true);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  };

  const deleteHandler = () => {
    setIsDeleteLoader(true);
    deleteCampaign(_id)
      .then((res) => {
        const result = res?.data;
        if (result.success) {
          toast.success("Campaign deleted successfully");
          setOpenDeleteMOdel(false);
          router.push("/dashboard");
        } else {
          toast.error(result.message);
        }
        setIsDeleteLoader(false);
      })
      .catch((error) => {
        console.error(error);
        setIsDeleteLoader(false);
      });
  };

  return (
    <div>
      <AccordionBox heading="Privacy">
        <SettingTypographyWrapper>
          <TypographyComp align="left" sx={typographyStyles}>
            Allow my fundraiser to appear in search result and in suggested
            fundraiser lists on madinah.com
          </TypographyComp>
          <CustomSwitchButton
            withMargins={false}
            name="exampleSwitch"
            color="primary"
            checked={isAllowToAppearInSearchResult}
            onChange={(e) => handleAllowToAppearInSearchResults(e)}
          />
        </SettingTypographyWrapper>
        <SettingTypographyWrapper>
          <TypographyComp align="left" sx={typographyStyles}>
            Allow my fundraiser to appear in search results on google.com
          </TypographyComp>
          <CustomSwitchButton
            withMargins={false}
            name="exampleSwitch"
            color="primary"
            checked={allowToAppearOnFundraiserPage}
            onChange={(e) => handleAllowToAppearOnFundraiserPage(e)}
          />
        </SettingTypographyWrapper>
      </AccordionBox>
      <AccordionBox heading="Widget">
        <CampaignWidget singleCampaignDetails={singleCampaignDetails} />
      </AccordionBox>
      <AccordionBox heading="Notifications">
        <TypographyComp align="left" sx={typographyStyles}>
          Notify me if my campaign reaches the following milestones
        </TypographyComp>
        <BoxComponent sx={{ display: "flex", gap: 2, mt: 1, mb: 2 }}>
          {MILESTONE?.map((item) => (
            <SelectAbleButton
              key={item.id} // It's better to use unique IDs if available
              isActive={
                currentUserRole === "admin"
                  ? selectedTags.some((tag) => tag === item.value)
                  : false
              }
              onClick={() => handleBoxClick(item.value)}
              title={item.label}
              height="32px"
              padding="0px 20px"
              width={"65px"}
              fontSize="14px"
              lineHeight={"16px"}
              isGray={true}
            />
          ))}
        </BoxComponent>
      </AccordionBox>
      <SubHeading sx={{ mt: 1 }}>Delete fundraiser</SubHeading>
      <TypographyComp
        align="left"
        sx={{
          color: theme.palette.primary.gray,
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "20px",
        }}
      >
        Deleting will remove your manage access to this fundraiser.
      </TypographyComp>
      <BoxComponent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          my: 3,
        }}
      >
        <ButtonComp
          disabled={currentUserRole === "admin" ? false : true}
          variant={"outlined"}
          size="normal"
          color="error"
          sx={{
            width: "76px",
            borderRadius: "25px",
            border: "1px solid #FFEDED",
            color: "#E61D1D",
          }}
          padding="10px 10px 8px 10px "
          height="34px"
          onClick={() => setOpenDeleteMOdel(true)}
        >
          Delete
        </ButtonComp>
      </BoxComponent>

      {openDeleteModel && (
        <ModalComponent
          width={"422px"}
          open={openDeleteModel}
          onClose={() => setOpenDeleteMOdel(false)}
          padding={"48px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
        >
          <DeleteModals
            levelDeleteHandler={deleteHandler}
            isDeleteLoader={isDeleteLoader}
            setOpenDeleteMOdel={setOpenDeleteMOdel}
            heading={"Delete fundraiser"}
            description={
              "Are you sure that you want to delete the fundraiser? All information about it will be deleted."
            }
          />
        </ModalComponent>
      )}
    </div>
  );
});

const typographyStyles = {
  fontSize: "14px",
  fontWeight: 400,
  lineHeight: "16px",
  color: theme.palette.primary.dark,
};

Settings.propTypes = {
  singleCampaignDetails: PropTypes.object,
};
Settings.displayName = "Settings";
export default Settings;
