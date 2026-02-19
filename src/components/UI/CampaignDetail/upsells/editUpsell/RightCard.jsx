import React, { useEffect, useState } from "react";
import BoxComponent from "../../../../../components/atoms/boxComponent/BoxComponent";

// import SubHeading1 from "../../../../../components/atoms/createCampaigns/SubHeading1";
import { theme } from "../../../../../config/customTheme";
import TypographyComp from "../../../../../components/atoms/typography/TypographyComp";

import ButtonComp from "../../../../../components/atoms/buttonComponent/ButtonComp";
import PropTypes from "prop-types";
import { getVideoThumbnail } from "@/utils/helpers";
import CoverImagePreview from "@/components/advance/CoverImagePreview";
import StackComponent from "@/components/atoms/StackComponent";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import LoadingBtn from "@/components/advance/LoadingBtn";

const RightCard = React.memo(({ item, imageHandler, type }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(imageHandler);
  useEffect(() => {
    const fetchThumbnail = async (imageOrVideoUrl) => {
      if (imageOrVideoUrl.includes("vimeo.com")) {
        const thumbnail = await getVideoThumbnail(imageOrVideoUrl);
        setThumbnailUrl(thumbnail);
      } else {
        setThumbnailUrl(imageOrVideoUrl);
      }
    };

    fetchThumbnail(imageHandler);
  }, [imageHandler]);

  return (
    <BoxComponent
      sx={{
        padding: "24px 16px",

        backgroundColor: theme.palette.primary.light,
        boxShadow: { xs: "none", sm: "0px 4px 15px 0px rgba(0, 0, 0, 0.06)" },
        maxWidth: "335px",
        width: "100%",
        border: { xs: "1px solid #E9E9EB", sm: "none" },
        height: "fit-content",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {type === "downSell" ? (
        <>
          <BoxComponent sx={{ marginTop: "42px !important" }}>
            <CoverImagePreview imageSrc={thumbnailUrl} />
          </BoxComponent>
          <CampaignHeading
            sx={{
              textAlign: "center",
              width: "100%",
              marginTop: "32px !important",
              marginBottom: "10px !important",
            }}
          >
            {item.title}
          </CampaignHeading>

          <SubHeading
            sx={{
              width: "100%",
              fontWeight: 500,
              fontSize: "18px",
              lineHeight: "22px",
              color: "#424243",
              // ...breakWordStyle,
            }}
          >
            {item.subTitle}
          </SubHeading>

          <BoxComponent sx={{ marginBottom: "20px !important" }}>
            <TypographyComp
              sx={{
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "22px",
                color: "#424243",
                wordWrap: item?.description
                  ?.split(" ")
                  .some((word) => word.length > 30)
                  ? "break-word"
                  : undefined,
                // ...breakWordStyle,
              }}
            >
              {item?.description}
            </TypographyComp>
          </BoxComponent>
          <StackComponent
            direction={{ xs: "column", sm: "column" }}
            spacing={1.5}
            sx={{ width: "100%" }}
          >
            <LoadingBtn
              // disabled={paymentLoader}
              // loadingState={paymentLoader}
              loadingLabel="Loading"
              fullWidth={true}
              size={"normal"}
              // onClick={handleYesButtonClick}
            >
              {item.yesButtonText}
            </LoadingBtn>
            <ButtonComp
              fullWidth={true}
              size={"normal"}
              variant="text"
              // onClick={() => setOpen(false)}
            >
              {item?.noButtonText}
            </ButtonComp>
          </StackComponent>
        </>
      ) : (
        <>
          <CampaignHeading
            sx={{
              // mt: "40px !important",
              width: "100%",
              textAlign: "center",
              fontSize: "32px",
              lineHeight: "38px",
              // ...breakWordStyle,
            }}
          >
            {item?.title}
          </CampaignHeading>

          <SubHeading
            sx={{
              width: "100%",
              fontWeight: 500,
              fontSize: "18px",
              lineHeight: "22px",
              color: "#A1A1A8",
              marginBottom: "20px !important",
              // ...breakWordStyle,
            }}
          >
            {item?.subTitle}
          </SubHeading>

          <CoverImagePreview imageSrc={thumbnailUrl} />

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
                wordWrap: item?.description
                  ?.split(" ")
                  .some((word) => word.length > 30)
                  ? "break-word"
                  : undefined,
              }}
            >
              {item?.description}
            </TypographyComp>
          </BoxComponent>
          <StackComponent
            direction={{ xs: "column", sm: "column" }}
            spacing={1.5}
            sx={{ width: "100%" }}
          >
            <LoadingBtn
              // disabled={paymentLoader}
              // loadingState={paymentLoader}
              loadingLabel="Loading"
              fullWidth={true}
              size={"normal"}
              // onClick={handleYesButtonClick}
            >
              {item?.yesButtonText}
            </LoadingBtn>
            <ButtonComp
              fullWidth={true}
              size={"normal"}
              variant="text"
              // onClick={onNoButtonClick}
            >
              {item?.noButtonText}
            </ButtonComp>
          </StackComponent>
        </>
      )}
    </BoxComponent>
    // <BoxComponent
    //   sx={{
    //     padding: "24px 16px",

    //     backgroundColor: theme.palette.primary.light,
    //     boxShadow: { xs: "none", sm: "0px 4px 15px 0px rgba(0, 0, 0, 0.06)" },
    //     maxWidth: "335px",
    //     width: "100%",
    //     border: { xs: "1px solid #E9E9EB", sm: "none" },
    //     height: "fit-content",
    //     borderRadius: "8px",
    //     display: "flex",
    //     flexDirection: "column",
    //   }}
    // >
    //   <SubHeading1
    //     align="center"
    //     sx={{
    //       color: theme.palette.primary.dark,
    //       mb: "9px",
    //     }}
    //   >
    //     {item.title}
    //   </SubHeading1>
    //   <TypographyComp
    //     sx={{
    //       fontWeight: 400,
    //       fontSize: "14px",
    //       lineHeight: "16px",
    //       color: theme.palette.primary.gray,
    //     }}
    //   >
    //     {item.subTitle}
    //   </TypographyComp>
    //   <BoxComponent
    //     sx={{ marginTop: "25px", marginBottom: "25px", height: "234px" }}
    //   >
    //     <CoverImagePreview
    //       style={{ height: "234px" }}
    //       imageSrc={thumbnailUrl}
    //     />
    //   </BoxComponent>
    //   {/* <Image
    //     width="auto"
    //     height="100%"
    //     borderRadius="28px"
    //     source={thumbnailUrl}
    //     objectFit="contain"
    //     style={{ maxHeight: "250px" }}
    //     containerStyles={{
    //       marginTop: "25px",
    //       marginBottom: "25px",
    //     }}
    //     alt="Image Preview"
    //   /> */}
    //   <TypographyComp
    //     sx={{
    //       fontWeight: 400,
    //       fontSize: "14px",
    //       lineHeight: "16px",
    //       color: theme.palette.primary.darkGray,

    //       width: "100%",
    //       wordWrap: item?.description
    //         ?.split(" ")
    //         .some((word) => word.length > 30)
    //         ? "break-word"
    //         : undefined,
    //     }}
    //   >
    //     {item.description}
    //   </TypographyComp>
    //   <ButtonComp
    //     fontSize="14px"
    //     fontWeight={400}
    //     lineHeight="16px"
    //     size="normal"
    //     sx={{ marginTop: "32px" }}
    //   >
    //     {item.yesButtonText
    //       ? item.yesButtonText
    //       : "Yes, I would like to donate water (10$)"}
    //   </ButtonComp>
    //   <ButtonComp
    //     padding="14px 6px"
    //     variant="text"
    //     fontSize="14px"
    //     fontWeight={400}
    //     lineHeight="16px"
    //     size="normal"
    //     sx={{
    //       color: theme.palette.primary.main,
    //       wordBreak: item?.noButtonText?.length > 10 ? "break-all" : undefined,
    //       marginTop: "10px",
    //       height: "auto",
    //     }}
    //   >
    //     {item.noButtonText
    //       ? item.noButtonText
    //       : "No, I don’t want to quench their thirst yet"}
    //   </ButtonComp>
    // </BoxComponent>
  );
});

RightCard.displayName = "RightCard";
RightCard.propTypes = {
  item: PropTypes.any,
  imageHandler: PropTypes.any,
};
export default RightCard;
