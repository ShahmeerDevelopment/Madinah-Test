"use client";

import React, { memo } from "react";
import { useRouter } from "next/navigation";
import { theme } from "../../../config/customTheme";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import StackComponent from "@/components/atoms/StackComponent";
import { styles } from "./ViewCampaignTemplate.style";

const CampaignHeader = memo(({ previewMode, title, subTitle, altSubTitle }) => {
  const router = useRouter();

  return (
    <>
      <StackComponent
        justifyContent="space-between"
        alignItems="center"
        sx={styles.initialBtns}
      >
        {/* Do not show Back button in view campaign. It will be shown in preview mode */}
        {previewMode ? (
          <ButtonComp
            onClick={() => router.back()}
            fullWidth={false}
            size="normal"
            variant="outlined"
            sx={{
              padding: "12px 32px 12px 18px",
              width: "107",
              border: `1px solid ${theme.palette.primary.lightGray}`,
              color: theme.palette.primary.gray,
            }}
            startIcon={
              <KeyboardArrowLeftIcon
                sx={{ mr: -0.7, mt: -0.3 }}
                fontSize="medium"
              />
            }
          >
            Back
          </ButtonComp>
        ) : null}
        <TypographyComp sx={styles.previewModeText}>
          {previewMode ? "Preview Mode" : null}
        </TypographyComp>
      </StackComponent>

      <StackComponent direction="column">
        <TypographyComp
          align="center"
          component="h1"
          style={{ lineHeight: 1 }}
          sx={styles.heading}
        >
          {title}
        </TypographyComp>
      </StackComponent>

      {subTitle || altSubTitle ? (
        <TypographyComp
          align="center"
          component="h4"
          sx={{
            marginTop: "4px !important",
            color: "rgba(161, 161, 168, 1)",
            fontWeight: 400,
            fontSize: "18px",
            lineHeight: "22px",
            marginBottom: "16px !important",
          }}
        >
          {subTitle}
        </TypographyComp>
      ) : null}
    </>
  );
});

CampaignHeader.displayName = "CampaignHeader";

export default CampaignHeader;
