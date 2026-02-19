import React from "react";
import PropTypes from "prop-types";

import IconMenu from "@/components/molecules/IconMenu";
import { useRouter } from "next/navigation";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import BackIcon from "./icons/BackIcon";
import { theme } from "@/config/customTheme";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import SkeletonComponent from "@/components/atoms/SkeletonComponent";

const YourDonationLayout = ({
  children,
  backButtonDisabled = false,
  isDownloadButton = false,
  heading = "Donations you've made",
  buttonHandler = () => {},
  csvButtonHandler = () => {},
  isLoading = false,
  guestUser = false,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (guestUser) {
      router.push("/your-donations");
    } else {
      router.back();
    }
  };

  return (
    <BoxComponent
      component={"section"}
      mt={4}
      p={4}
      sx={{
        p: { xs: "16px 16px 32px 16px", sm: "32px" },
        borderRadius: "32px",
        boxShadow: "0px 0px 100px 0px rgba(0, 0, 0, 0.06)",
      }}
    >
      <StackComponent justifyContent={"space-between"} alignItems="center">
        <ButtonComp
          onClick={handleBack}
          disabled={backButtonDisabled}
          fullWidth={false}
          size="normal"
          variant="outlined"
          padding="12px 18px 12px 18px"
          sx={{
            color: theme.palette.primary.darkGray,
            border: `1px solid ${theme.palette.primary.lightGray}`,
            width: "107px",
            textAlign: "center",
          }}
          startIcon={<BackIcon disabled={backButtonDisabled} />}
        >
          <span style={{ marginTop: "3px" }}>Back</span>
        </ButtonComp>
        {isDownloadButton && (
          <BoxComponent
            sx={{
              display: { xs: "block", sm: "none" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <ButtonComp
              variant="outlined"
              onClick={buttonHandler}
              height="40px"
              size="normal"
              fontSize="14px"
              lineHeight="16px"
              padding="9px 19px 8px 19px"
              // endIcon={<DropDownIcon />}
            >
              Download all receipts
            </ButtonComp>
          </BoxComponent>
        )}
      </StackComponent>
      <StackComponent
        justifyContent={"space-between"}
        alignItems="center"
        sx={{ marginTop: { xs: "24px", sm: "40px" }, mb: { xs: 2, sm: 4 } }}
      >
        {isLoading ? (
          <SkeletonComponent width="50%" />
        ) : (
          <CampaignHeading marginBottom={0} mobileMarginBottom={0}>
            {heading}
          </CampaignHeading>
        )}
        {isDownloadButton && (
          <BoxComponent sx={{ display: { xs: "none", sm: "block" } }}>
            <IconMenu
              tooltipLabel="Options"
              menuOptions={[
                {
                  label: "Download PDFs",
                  name: "downloadPdf",
                  clickSideEffects: () => {
                    buttonHandler();
                  },
                },

                {
                  label: "Download CSV",
                  name: "downloadCsv",
                  clickSideEffects: () => {
                    csvButtonHandler();
                  },
                },
              ]}
            >
              <ButtonComp
                variant="outlined"
                // onClick={buttonHandler}
                height="40px"
                size="normal"
                fontSize="14px"
                lineHeight="16px"
                padding="9px 19px 8px 19px"
                // endIcon={<DropDownIcon />}
              >
                Download all receipts
              </ButtonComp>
            </IconMenu>
          </BoxComponent>
        )}
      </StackComponent>
      {children}
    </BoxComponent>
  );
};

YourDonationLayout.propTypes = {
  children: PropTypes.node,
  backButtonDisabled: PropTypes.bool,
  heading: PropTypes.string,
  buttonHandler: PropTypes.func,
  isDownloadButton: PropTypes.bool,
  csvButtonHandler: PropTypes.func,
  isLoading: PropTypes.bool,
};
export default YourDonationLayout;
