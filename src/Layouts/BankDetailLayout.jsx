import React from "react";
import PropTypes from "prop-types";
import BoxComponent from "../components/atoms/boxComponent/BoxComponent";
import { theme } from "../config/customTheme";
import BackButton from "../components/atoms/createCampaigns/BackButton";
import ButtonComp from "../components/atoms/buttonComponent/ButtonComp";
import StackComponent from "../components/atoms/StackComponent";
import CampaignHeading from "../components/atoms/createCampaigns/CampaignHeading";
// import SubmitButton from '../components/atoms/createCampaigns/SubmitButton';
import { BANK_STEPPER, BOX_SHADOW_STYLE } from "../config/constant";
import { useRouter } from "next/navigation";

const BankDetailLayout = ({
  children,
  activeStep,
  setActiveStep,
  setCurrentIndex,
  isFullHeight = true,
  isSkipForNow = false,
  heading = "Your Personal Information",
  createCampaign = false,
}) => {
  const router = useRouter();
  const handleNext = () => {
    if (activeStep === BANK_STEPPER.length - 1) {
      router.push("success");
      setActiveStep(0);
      setCurrentIndex(0);
    } else {
      setActiveStep((prevActiveStep) => {
        setCurrentIndex(prevActiveStep);
        return prevActiveStep + 1;
      });
    }
  };

  return (
    <BoxComponent
      sx={{
        backgroundColor: theme.palette.primary.light,
        padding: { xs: "16px 16px 32px 16px", sm: "32px 32px 40px 32px" },
        width: "100%",
        borderRadius: "32px",
        boxShadow: BOX_SHADOW_STYLE,
        height: { xs: "100%", sm: isFullHeight ? "100%" : "670px" },
        // marginTop: '30px',
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "flex-start",
      }}
    >
      <StackComponent
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        mb={4}
      >
        <BackButton
          isStepperLocal={true}
          activeStep={activeStep}
          setCurrentIndex={setCurrentIndex}
          setActiveStep={setActiveStep}
          createCampaign={createCampaign}
        />
        {isSkipForNow && (
          <ButtonComp
            onClick={handleNext}
            variant="outlined"
            color="secondary"
            sx={{ padding: "5px 15px 4px 12px", color: "black" }}
          >
            Skip for now
          </ButtonComp>
        )}
      </StackComponent>
      <CampaignHeading marginBottom={0}>{heading}</CampaignHeading>
      {children}
      {/* <SubmitButton onClick={handleNext}>Continue</SubmitButton> */}
    </BoxComponent>
  );
};

BankDetailLayout.propTypes = {
  activeStep: PropTypes.number,
  children: PropTypes.node,
  defaultFormState: PropTypes.any,
  heading: PropTypes.string,
  isFullHeight: PropTypes.bool,
  isSkipForNow: PropTypes.bool,
  setActiveStep: PropTypes.func,
  setCurrentIndex: PropTypes.func,
};

export default BankDetailLayout;
