import React, { useState } from "react";
import EditCampaignHeading from "@/components/advance/EditCampaignHeading";
import LargeBtn from "@/components/advance/LargeBtn";
import StackComponent from "@/components/atoms/StackComponent";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import CircularLoader from "@/components/atoms/ProgressBarComponent/CircularLoader";
import DetailsFormSubmit from "./DetailsFormSubmit";
import { GTMIdField, PixelApiKeyField, PixelIdField } from "./Fields";

const CampaignSettings = () => {
  const [loading, setLoading] = useState(false);

  const { isMobile } = useResponsiveScreen();

  const [isSubmittionAttempted, setIsSubmittedAttempted] = useState(false);

  return (
    <>
      <DetailsFormSubmit
        setLoading={setLoading}
        setIsSubmittedAttempted={setIsSubmittedAttempted}
      >
        <StackComponent direction="column">
          <EditCampaignHeading>Campaign Pixel Settings</EditCampaignHeading>
          <StackComponent
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
          >
            <PixelIdField isSubmittionAttempted={isSubmittionAttempted} />
            <PixelApiKeyField isSubmittionAttempted={isSubmittionAttempted} />
          </StackComponent>
          {/* <StackComponent
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
          >
            <GTMIdField isSubmittionAttempted={isSubmittionAttempted} />
          </StackComponent> */}
        </StackComponent>
        <LargeBtn
          type="submit"
          fullWidth={isMobile ? true : false}
          sx={{ mt: "40px" }}
        >
          {loading ? (
            <StackComponent alignItems="center" component="span">
              <CircularLoader color="white" size="20px" />
              <TypographyComp>Saving</TypographyComp>
            </StackComponent>
          ) : (
            "Save"
          )}
        </LargeBtn>
      </DetailsFormSubmit>
    </>
  );
};

const MemoizedSettings = React.memo(CampaignSettings);
export default MemoizedSettings;
