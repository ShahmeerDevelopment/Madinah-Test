import React from "react";
import PropTypes from "prop-types";
import StackComponent from "@/components/atoms/StackComponent";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import CoverImagePreview from "@/components/advance/CoverImagePreview";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import LoadingBtn from "@/components/advance/LoadingBtn";
import RecurringIcon from "@/assets/iconComponent/RecurringIcon";
import { AUTOMATIC_DONATION_DAYS } from "@/config/constant";

const PreviewUpsell = ({ data }) => {

  const getRecurringTypeTitle = () => {
    const recurringTypeItem = AUTOMATIC_DONATION_DAYS.find(
      (item) => item.value === data?.recurringType
    );
    return recurringTypeItem ? recurringTypeItem.label : "";
  };


  return (
    <>
      {data?.type === "downSell" ? (
        <StackComponent direction={"column"} alignItems="center">
          <BoxComponent sx={{ marginTop: "42px !important" }}>
            <CoverImagePreview imageSrc={data.imageUrl} />
          </BoxComponent>
          <CampaignHeading
            sx={{
              textAlign: "center",
              width: "100%",
              marginTop: "32px !important",
            }}
          >
            {data.title}
          </CampaignHeading>

          <SubHeading
            sx={{
              width: "100%",
              fontWeight: 500,
              fontSize: "18px",
              lineHeight: "22px",
              color: "#424243",
            }}
          >
            {data.subTitle}
          </SubHeading>

          <BoxComponent sx={{ marginBottom: "20px !important" }}>
            <TypographyComp
              sx={{
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "22px",
                color: "#424243",
                wordWrap: data?.description
                  ?.split(" ")
                  .some((word) => word.length > 30)
                  ? "break-word"
                  : undefined,
              }}
            >
              {data?.description}
            </TypographyComp>
          </BoxComponent>
          <StackComponent
            direction={{ xs: "column", sm: "column" }}
            spacing={1.5}
            sx={{ width: "100%" }}
          >
            <LoadingBtn
              loadingLabel="Loading"
              fullWidth={true}
              size={"normal"}
            >
              {data.yesButtonText}
            </LoadingBtn>
            <ButtonComp
              fullWidth={true}
              size={"normal"}
              variant="text"
            >
              {data?.noButtonText}
            </ButtonComp>
          </StackComponent>
        </StackComponent>
      ) : (
        <StackComponent direction={"column"} alignItems="center">
          <CampaignHeading
            sx={{
              width: "100%",
              textAlign: "center",
              fontSize: "32px",
              lineHeight: "38px",
            }}
          >
            {data?.title}
          </CampaignHeading>

          <SubHeading
            sx={{
              width: "100%",
              fontWeight: 500,
              fontSize: "18px",
              lineHeight: "22px",
              color: "#A1A1A8",
              marginBottom: "20px !important",
            }}
          >
            {data?.subTitle}
          </SubHeading>

          <CoverImagePreview imageSrc={data?.imageUrl} />

          <BoxComponent
            sx={{
              marginBottom: "20px !important",
              width: "100%",
              marginTop: "32px !important",
            }}
          >
            <TypographyComp
              sx={{
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "22px",
                color: "#424243",
                wordWrap: data?.description
                  ?.split(" ")
                  .some((word) => word.length > 30)
                  ? "break-word"
                  : undefined,
              }}
            >
              {data?.description}
            </TypographyComp>
          </BoxComponent>
          <StackComponent
            direction={{ xs: "column", sm: "column" }}
            spacing={1.5}
            sx={{ width: "100%" }}
          >
            {data?.recurringType ? (
              <BoxComponent
                sx={{
                  borderRadius: "22px",
                  border: "2px solid #F7F7FF",
                  height: "auto",
                  padding: "12px 16px 12px 16px",
                  gap: "24px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <BoxComponent
                  sx={{
                    display: "flex",
                    gap: "10px",
                    height: "40px",
                    alignItems: "center",
                  }}
                >
                  <RecurringIcon />
                  <BoxComponent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <TypographyComp
                      sx={{
                        fontWeight: 500,
                        fontSize: "14px",
                        lineHeight: "16px",
                        color: "#090909",
                      }}
                    >
                      {getRecurringTypeTitle()}
                    </TypographyComp>
                  </BoxComponent>
                </BoxComponent>
                <BoxComponent
                  sx={{ display: "flex", flexDirection: "column", gap: "4px" }}
                >
                  <LoadingBtn
                    loadingLabel="Loading"
                    fullWidth={true}
                    size={"normal"}
                  >
                    {data?.yesButtonText}
                  </LoadingBtn>
                </BoxComponent>
              </BoxComponent>
            ) : (
              <LoadingBtn
                loadingLabel="Loading"
                fullWidth={true}
                size={"normal"}
              >
                {data?.yesButtonText}
              </LoadingBtn>
            )}
            <ButtonComp
              fullWidth={true}
              size={"normal"}
              variant="text"
            >
              {data?.noButtonText}
            </ButtonComp>
          </StackComponent>
        </StackComponent>
      )}
    </>
  );
};

PreviewUpsell.propTypes = {
  data: PropTypes.any,
};
export default PreviewUpsell;
