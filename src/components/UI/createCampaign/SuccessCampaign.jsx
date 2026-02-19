"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import Animate from "@/components/atoms/Animate/Animate";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { BOX_SHADOW_STYLE } from "@/config/constant";
import useLottieAnimation from "@/hooks/useLottieAnimation";
import LinearText from "@/components/atoms/typography/LinearText";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import { theme } from "@/config/customTheme";
import { Paragraph } from "@/components/atoms/limitedParagraph/LimitedParagraph.style";
import PopOver from "@/components/molecules/popOver/PopOver";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import RightForwardIcon from "@/assets/iconComponent/RightForwardIcon";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { getAllVisits } from "@/api/get-api-services";
import { useSelector } from "react-redux";

const SuccessCampaign = () => {
  const router = useRouter();
  const { animationData: loveIcon } = useLottieAnimation("heart_uploading");
  const buttonHandler = () => router.push("/dashboard");
  const utmParameters = useSelector((state) => state.utmParameters);
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
    <BoxComponent
      sx={{
        boxShadow: BOX_SHADOW_STYLE,
        // height: '88vh',
        mt: 3,
        width: "100%",
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "32px",
        padding: { xs: "32px 16px 40px 16px ", sm: "32px 32px 40px 32px" },
      }}
    >
      {/* <Image source={loveIcon} alt="thank you icon" /> */}
      <Animate animationData={loveIcon} />
      <LinearText
        style={{
          fontWidth: 600,
          fontSize: "48px",
          lineHeight: "54px",
          marginBottom: "18px",
          marginTop: "40px",
        }}
      >
        Thank you!
      </LinearText>
      <CampaignHeading
        marginBottom={1.5}
        align="center"
        sx={{
          display: { xs: "none", sm: "block" },
          color: theme.palette.primary.dark,
        }}
      >
        Your campaign has successfully been submitted for review
      </CampaignHeading>
      <SubHeading
        align="center"
        sx={{
          display: { xs: "block", sm: "none" },
          mb: 1.5,
          color: theme.palette.primary.dark,
        }}
      >
        Your campaign has successfully been submitted for review
      </SubHeading>

      <Paragraph align="center">
        You’ll receive an email from us within 1-2 business days with updates on
      </Paragraph>
      <TypographyComp
        // href="https://www.google.com"
        // passHref
        style={{ textDecoration: "none" }}
      >
        <PopOver
          sx={{ color: theme.palette.primary.main, cursor: "pointer", mt: 0 }}
          maxWidth="350px"
          popoverContent="At Madinah.com, we strive to maintain a high standard of quality and integrity for all campaigns on our platform. The review process ensures that all campaigns comply with our community guidelines and terms of service. This helps to create a safe and trustworthy environment for both campaign creators and donors."
          text="Why does my campaign need to be reviewed?"
        />
      </TypographyComp>
      <ButtonComp
        onClick={buttonHandler}
        fullWidth={false}
        size="small"
        color="inherit"
        variant="outlined"
        sx={{
          padding: "2px 25px 1px 25px",
          width: "207px",
          height: "46px",
          color: theme.palette.primary.gray,
          fontSize: "16px",
          mt: 5,
        }}
        endIcon={
          <div style={{ marginTop: "6px" }}>
            <RightForwardIcon fontSize="medium" />
          </div>
        }
      >
        View your campaigns
      </ButtonComp>
    </BoxComponent>
  );
};

export default SuccessCampaign;
