/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React from "react";
import { useGetProfile } from "@/api";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import StackComponent from "@/components/atoms/StackComponent";
import TransferSkeleton from "./TransferSkeleton";
import Status from "@/components/atoms/status/Status";
import { useRouter } from "next/navigation";

const styles = {
  box: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", sm: "center" },
    border: "1px solid #E9E9EB",
    borderRadius: "28px",
    width: "100%",
    height: { xs: "170px", sm: "88px" },
    px: 2,
    py: { xs: 2 },
    mt: 3,
    mb: 1,
  },
  typography: {
    thankYou: {
      fontWeight: 400,
      fontSize: "16px",
      color: "#A1A1A8",
    },
    startReceiving: {
      fontWeight: 500,
      fontSize: "22px",
      lineHeight: "22px",
    },
  },
  button: {
    borderRadius: "25px",
    paddingTop: "15px",
  },
};

const TransferInfo = () => {
  const router = useRouter();
  const { isSmallScreen } = useResponsiveScreen();
  const { data: userProfile, isLoading: profileLoading } = useGetProfile();

  const { bankInfo } = userProfile?.data?.data || {};

  if (profileLoading) return <TransferSkeleton />;

  const bankStatus = bankInfo?.status;
  const hasBankInfo = Boolean(bankInfo?.countryId);

  return (
    <BoxComponent sx={styles.box}>
      <BoxComponent sx={{ width: { xs: "100%", sm: "auto" } }}>
        <StackComponent
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <TypographyComp align="left" sx={styles.typography.startReceiving}>
            Start receiving funds
          </TypographyComp>
          {hasBankInfo && isSmallScreen && (
            <Status isApproved={bankStatus === "active"}>
              {bankStatus === "active"
                ? "Approved"
                : bankStatus === "pending"
                  ? `${isSmallScreen ? "Pending" : "Pending Approval"}`
                  : "Rejected"}
            </Status>
          )}
        </StackComponent>
        <TypographyComp align="left" sx={styles.typography.thankYou}>
          {hasBankInfo
            ? "Thank you for submitting the info"
            : "To receive the funds you raise, be sure to provide bank information"}
        </TypographyComp>
      </BoxComponent>
      <StackComponent
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        {hasBankInfo && !isSmallScreen && (
          <Status isApproved={bankStatus === "active"}>
            {bankStatus === "active"
              ? "Approved"
              : bankStatus === "pending"
                ? `${isSmallScreen ? "Pending" : "Pending Approval"}`
                : "Rejected"}
          </Status>
        )}
        <ButtonComp
          size={"normal"}
          fullWidth={isSmallScreen}
          sx={styles.button}
          onClick={() => router.push("/add-documents")}
        >
          Add Documents
        </ButtonComp>
        <ButtonComp
          size={"normal"}
          fullWidth={isSmallScreen}
          sx={styles.button}
          onClick={() => router.push("/setup-transfers")}
        >
          {hasBankInfo ? "Edit Bank Info" : "Set up transfers"}
        </ButtonComp>
      </StackComponent>
    </BoxComponent>
  );
};

export default TransferInfo;
