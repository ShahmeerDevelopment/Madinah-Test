"use client";

import React, { useEffect, useState, useRef } from "react";
import { getAllCampaigns } from "../../../../api/get-api-services";
import { getThumbnailUrl, queryToString } from "@/utils/helpers";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import AlertComponent from "@/components/atoms/AlertComponent";
import { CarouselItemWitImgTitleDescCard } from "@/components/advance/CarouselItemTypes";
import ReuseAbleSlider from "@/components/molecules/carousel/ReuseAbleSlider";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import OutlinedIconButton from "@/components/advance/OutlinedIconButton";
import BackIcon from "@/assets/icons/BackIcon";

const BigCarousal = ({
  serverCampaigns = [],
  containerStyleOverrides = {},
  isFromHomepage = false,
}) => {
  // Use server data if available, otherwise fetch client-side
  const [campaigns, setCampaigns] = useState(serverCampaigns);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(serverCampaigns.length === 0);
  const [currentPage, setCurrentPage] = useState(0);
  const { isSmallScreen } = useResponsiveScreen();

  const itemsPerPage = 3;
  const totalPages = Math.ceil(campaigns.length / itemsPerPage);

  useEffect(() => {
    // Skip client fetch if we have server data
    if (serverCampaigns.length > 0) {
      setCampaigns(serverCampaigns);
      setLoading(false);
      return;
    }

    // Fallback: fetch client-side only if no server data
    const cfCountry =
      typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;

    setLoading(true);
    getAllCampaigns(
      queryToString({ isAllCategoryCampaignsRequired: true }),
      12,
      0,
      cfCountry,
    )
      .then((res) => {
        setError("");
        if (!res?.data?.success) {
          return setError("Something went wrong while fetching campaigns");
        }
        const tempCampaigns = res?.data?.data?.campaigns.map((eachCampaign) => {
          return {
            id: eachCampaign?._id,
            title: eachCampaign?.title,
            subTitle: eachCampaign?.subTitle,
            image: eachCampaign?.coverImageUrl
              ? eachCampaign?.coverImageUrl
              : getThumbnailUrl(eachCampaign?.videoLinks[0]?.url),
            raisedAmount: eachCampaign?.collectedAmount,
            raisedCurrency: eachCampaign?.amountCurrency,
            totalGoal: eachCampaign?.targetAmount,
            urlRedirect: eachCampaign?.randomToken,
          };
        });
        setCampaigns(tempCampaigns);
      })
      .catch((err) => {
        console.error(err.message);
        return setError(err.message);
      })
      .finally(() => {
        return setLoading(false);
      });
  }, [serverCampaigns]);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCampaigns = campaigns.slice(startIndex, endIndex);

  return (
    <BoxComponent sx={{ mt: "56px !important", ...containerStyleOverrides }}>
      {error ? (
        <AlertComponent severity="error">{error}</AlertComponent>
      ) : (
        <>
          {isSmallScreen ? (
            <BoxComponent sx={{ width: "100%" }}>
              <StackComponent
                direction="column"
                spacing="16px"
                sx={{
                  "& .card-item": {
                    width: "100%",
                  },
                  "& .card-item .lazy-load-image-background": {
                    height: "154px !important",
                  },
                }}
              >
                {currentCampaigns.map((eachCampaign, index) => {
                  return (
                    <CarouselItemWitImgTitleDescCard
                      key={index}
                      {...eachCampaign}
                      fromHomepage={isFromHomepage}
                    />
                  );
                })}
              </StackComponent>

              {/* Navigation buttons below the stacked campaigns */}
              <BoxComponent
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  mt: "16px",
                }}
              >
                <OutlinedIconButton
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                  sx={{
                    width: "40px",
                    height: "40px",
                    minWidth: "40px",
                    "&.Mui-disabled": { background: "#ffffff !important" },
                  }}
                >
                  <BackIcon isDisabled={currentPage === 0} />
                </OutlinedIconButton>
                <OutlinedIconButton
                  onClick={handleNext}
                  disabled={currentPage >= totalPages - 1}
                  sx={{
                    width: "40px",
                    height: "40px",
                    minWidth: "40px",
                    "&.Mui-disabled": { background: "#ffffff !important" },
                  }}
                >
                  <BackIcon
                    isDisabled={currentPage >= totalPages - 1}
                    style={{ transform: "rotateY(180deg)" }}
                  />
                </OutlinedIconButton>
              </BoxComponent>
            </BoxComponent>
          ) : (
            <ReuseAbleSlider
              slidesToShowFullView={3}
              slidesToShowAt800px={2}
              slidesToShowAt600px={1}
              slidesToShowAt480px={1}
              totalArrayLength={campaigns.length}
            >
              {campaigns?.map((eachCampaign, index) => {
                return (
                  <CarouselItemWitImgTitleDescCard
                    key={index}
                    {...eachCampaign}
                    fromHomepage={isFromHomepage}
                  />
                );
              })}
            </ReuseAbleSlider>
          )}
        </>
      )}
    </BoxComponent>
  );
};

export default BigCarousal;
