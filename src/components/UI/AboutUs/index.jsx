"use client";

import React, { useEffect } from "react";
import StackComponent from "@/components/atoms/StackComponent";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import { theme } from "@/config/customTheme";
import Paragraph from "@/components/atoms/createCampaigns/Paragraph";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { useRouter } from "next/navigation";
import { getAllVisits } from "@/api/get-api-services";
import { useSelector } from "react-redux";

const AboutUsUI = ({ onClose }) => {
  const { isSmallScreen } = useResponsiveScreen();
  const utmParameters = useSelector((state) => state.utmParameters);
  const router = useRouter();
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
    <StackComponent
      direction="column"
      spacing={2}
      sx={{ padding: { xs: 1, sm: 2 } }}
    >
      <CampaignHeading
        align={"left"}
        sx={{ color: theme.palette.primary.main, mb: "16px !important" }}
      >
        About Madinah
      </CampaignHeading>

      <Paragraph align="center" sx={{ textAlign: "justify" }}>
        www.madinah.com serves as the virtual version of the city of the Prophet
        Muhammad (peace be upon him). Over 1400 years ago, the citizens of
        Madinah exemplified the best story of generosity and sacrifice within
        the Muslim Ummah. Early Muslims provided a remarkable model of
        compassion and solidarity, particularly towards the poor, displaced,
        immigrants, widows, and orphans. In 2024, the age of digital
        relationships & immediate actions, Muslims continue to uphold this same
        model through the community of givers known as ‘www.madinah.com’.
      </Paragraph>
      <StackComponent
        justifyContent="center"
        sx={{ marginTop: "50px !important" }}
      >
        <ButtonComp
          fullWidth={isSmallScreen ? true : false}
          onClick={() => {
            if (onClose) {
              onClose();
            }
            router.push("/");
          }}
        >
          Explore Campaigns
        </ButtonComp>
      </StackComponent>
    </StackComponent>
  );
};

export default AboutUsUI;
