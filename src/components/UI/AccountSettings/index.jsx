"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Wrapper } from "../Dashboard/Dashboard.style";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import BackButton from "@/components/atoms/createCampaigns/BackButton";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import AuthTabComp from "@/components/molecules/Tabs/AuthTabComp";
import { theme } from "@/config/customTheme";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { useSelector, useDispatch } from "react-redux";
import { getAllVisits, getProfile } from "@/api/get-api-services";
import { addUserDetails } from "@/store/slices/authSlice";
import { updateAuthValues } from "@/store/slices/mutateAuthSlice";

const AccountSettingsUI = () => {
  const { isSmallScreen } = useResponsiveScreen();
  const [isLoading] = useState(false);
  const utmParameters = useSelector((state) => state.utmParameters);
  const paymentCardLength = useSelector(
    (state) => state?.mutateAuth?.paymentCardLength
  );
  const dispatch = useDispatch();

  const [isEdit, setIsEdit] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [showAddNewCard, setShowAddNewCard] = useState(false);

  const handleTabChange = useCallback((currentTab) => {
    setShowAddNewCard(currentTab === 2); // Assuming tabs are 0-indexed and the 3rd tab is "Saved cards"
  }, []);

  const addNewCardDataHandler = useCallback(() => {
    setIsEdit(false);
    setOpenEditModal(true);
  }, []);

  const fetchAndSetUserProfile = async () => {
    try {
      const res = await getProfile();
      const profileDetails = res?.data?.data;
      if (profileDetails) {
        dispatch(addUserDetails(profileDetails));
        dispatch(updateAuthValues(profileDetails));
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchAndSetUserProfile();
  }, []);

  useEffect(() => {
    getAllVisits(
      utmParameters.utmSource,
      utmParameters.utmMedium,
      utmParameters.utmCampaign,
      utmParameters.utmTerm,
      utmParameters.utmContent,
      utmParameters.referral
    );
  }, []);

  return (
    <Wrapper isBackground={true}>
      <BoxComponent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 5,
          mt: 1,
        }}
      >
        <BackButton isStepperInclude={false} />
        {showAddNewCard && isSmallScreen ? (
          <ButtonComp
            onClick={addNewCardDataHandler}
            variant={"text"}
            size="normal"
            sx={{ color: theme.palette.primary.darkGray }}
            fontSize={"14px"}
            lineHeight={"16px"}
            fontWeight={500}
            disabled={paymentCardLength > 0}
          >
            Add new card
          </ButtonComp>
        ) : null}
      </BoxComponent>
      <BoxComponent sx={{ padding: "10px" }}>
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
          Settings
        </TypographyComp>
        {isLoading ? (
          <p>Loading campaigns...</p>
        ) : (
          <AuthTabComp
            onTabChange={handleTabChange}
            isEdit={isEdit}
            openEditModal={openEditModal}
            setIsEdit={setIsEdit}
            setOpenEditModal={setOpenEditModal}
          />
        )}
      </BoxComponent>
    </Wrapper>
  );
};

export default AccountSettingsUI;
