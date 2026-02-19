"use client";

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

import AlertComponent from "@/components/atoms/AlertComponent";
import GridComp from "@/components/atoms/GridComp/GridComp";
import StackComponent from "@/components/atoms/StackComponent";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import CampaignOption from "../Home/UI/CampaignOption";
import LoadingBtn from "@/components/advance/LoadingBtn";

const CampaignsList = ({
  campaignsArr,
  heading = "Latest activity",
  searchPage = false,
  hideViewMore,
  handleLoadMore,
  moreLoading,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (campaignsArr.length === 0) {
      // Redirect to home page after 5 seconds if no campaigns found
      const timer = setTimeout(() => {
        router.push("/");
      }, 5000);

      // Cleanup timer if component unmounts or campaignsArr changes
      return () => clearTimeout(timer);
    }
  }, [campaignsArr.length, router]);

  return (
    <StackComponent
      sx={{
        background: "#ffffff",
        p: "40px 32px 10px 32px !important",
        borderRadius: "32px",
        boxShadow: "0px 0px 100px 0px #0000000F",
      }}
      spacing="24px"
      direction="column"
    >
      <TypographyComp
        sx={{
          color: "#090909",
          fontWeight: 500,
          fontSize: "32px",
          lineHeight: "38px",
          letterSpacing: "-0.41px",
          wordWrap: heading?.split(" ").some((word) => word.length > 30)
            ? "break-word"
            : undefined,
        }}
      >
        {heading}
      </TypographyComp>
      <BoxComponent>
        {campaignsArr.length === 0 ? (
          <AlertComponent severity="info">No Campaigns Found!</AlertComponent>
        ) : (
          <GridComp container spacing={4}>
            {campaignsArr.map((eachCampaign) => (
              <GridComp item xs={12} md={4} lg={4} xl={3} key={eachCampaign.id}>
                <CampaignOption
                  isRatio={true}
                  imageHeight="medium"
                  searchPage={searchPage ? true : false}
                  discoverPage={searchPage}
                  {...eachCampaign}
                />
              </GridComp>
            ))}
          </GridComp>
        )}
        {!hideViewMore ? (
          <BoxComponent
            sx={{
              display: "flex",
              justifyContent: "center", // Centers horizontally
              alignItems: "center",
            }}
          >
            <LoadingBtn
              onClick={handleLoadMore}
              variant="text"
              loadingState={moreLoading}
              loadingLabel={"Loading more campaigns..."}
            >
              View more campaigns
            </LoadingBtn>
          </BoxComponent>
        ) : null}
      </BoxComponent>
      {/* {!hideViewMore ? (
        <ButtonComp onClick={handleLoadMore} variant="text">
          View more
        </ButtonComp>
      ) : null} */}
    </StackComponent>
  );
};

CampaignsList.propTypes = {
  campaignsArr: PropTypes.array,
  heading: PropTypes.string,
};

export default CampaignsList;
