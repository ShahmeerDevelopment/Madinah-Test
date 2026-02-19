"use client";

import React from "react";
import PropTypes from "prop-types";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import StackComponent from "@/components/atoms/StackComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { useGetSingleCampaign } from "@/api";
import TransferSkeleton from "../transferInfo/TransferSkeleton";
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
    height: { xs: "auto", sm: "88px" },
    px: 2,
    py: { xs: 2 },
    // mt: 3,
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
  },
};

const GivingLevelsInfo = ({ campaignId }) => {
  const router = useRouter();
  const { data: singleCampaign, isLoading } = useGetSingleCampaign(campaignId);
  const { isSmallScreen } = useResponsiveScreen();

  const campaignLevels =
    singleCampaign?.data?.data?.campaignDetails?.givingLevels;

  if (isLoading) return <TransferSkeleton />;

  if (campaignLevels && campaignLevels.length === 0) {
    return (
      <BoxComponent sx={styles.box}>
        <BoxComponent>
          <TypographyComp align="left" sx={styles.typography.startReceiving}>
            Boost Your Campaign with Giving Levels
          </TypographyComp>
          <TypographyComp align="left" sx={styles.typography.thankYou}>
            Encourage more donations by adding giving levels. Show the impact of
            each contribution easily.
          </TypographyComp>
        </BoxComponent>
        <StackComponent
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
            marginTop: { xs: "20px", sm: "unset" },
          }}
        >
          <ButtonComp
            size={"normal"}
            fullWidth={isSmallScreen}
            sx={styles.button}
            onClick={() =>
              router.push(`/campaign/edit/?id=${campaignId}&givingLevel`)
            }
          >
            Add Giving Levels
          </ButtonComp>
        </StackComponent>
      </BoxComponent>
    );
  }
  return null;
};

GivingLevelsInfo.propTypes = {
  campaignId: PropTypes.any,
};

export default GivingLevelsInfo;
