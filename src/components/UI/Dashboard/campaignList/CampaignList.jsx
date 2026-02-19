"use client";

import React, {
  memo,
  startTransition,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";

import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { LoaderWrapper } from "../Dashboard.style";
import ProgressBarComponent from "@/components/atoms/ProgressBarComponent/ProgressBarComponent";
import LimitedParagraph from "@/components/atoms/limitedParagraph/LimitedParagraph";
import Status from "@/components/atoms/status/Status";
import IconButtonComp from "@/components/atoms/buttonComponent/IconButtonComp";
import ShareIcon from "@/assets/iconComponent/ShareIcon";
import EditIcons from "@/assets/iconComponent/EditIcons";
import ModalComponent from "@/components/molecules/modal/ModalComponent";
import SocialShare from "@/components/molecules/socialShare/SocialShare";

import {
  BOX_SHADOW_STYLE,
  // DEFAULT_AVATAR,
  RANDOM_URL,
} from "@/config/constant";

import { createSearchParams, getVideoThumbnail } from "@/utils/helpers";
import IconMenu from "@/components/molecules/IconMenu";
import { formatNumber } from "@/utils/formatNumber";
import { updateCoverMedia } from "@/store/slices/mutateCampaignSlice";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import { DeleteButtonWrapper } from "@/styles/CampaignDetails.style";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { deleteCampaign } from "@/api/delete-api-services";
import { campaignListHandler } from "@/store/slices/campaignSlice";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { theme } from "@/config/customTheme";
import Image from "@/components/atoms/imageComponent/Image";
import NextImage from "next/image";
import { ASSET_PATHS } from "@/utils/assets";
import { postDeactivateCampaign, postDuplicateCampaign } from "@/api";

const CampaignList = ({ campaignData, username }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isSmallScreen } = useResponsiveScreen();

  const [socialShareModal, setSocialShareModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleteLoader, setIsDeleteLoader] = useState(false);
  const [duplicateLoader, setDuplicateLoader] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const campaignList = useSelector((state) => state.campaign?.campaignList);

  const [thumbnailUrl, setThumbnailUrl] = useState(
    campaignData.coverImageUrl || ASSET_PATHS.images.placeholder,
  );

  const deactivateHandler = useCallback(
    async (campaignId) => {
      setDuplicateLoader(true);
      try {
        const temp = await postDeactivateCampaign(campaignId);
        if (temp.data.success === true) {
          queryClient.invalidateQueries(["campaignList"]);
          toast.success("Campaign has been de-activated");
        }
        setDuplicateLoader(false);
      } catch (error) {
        console.error(error);
        setDuplicateLoader(false);
      }
    },
    [queryClient],
  );

  const duplicateHandler = useCallback(
    async (campaignId) => {
      setDuplicateLoader(true);
      try {
        const temp = await postDuplicateCampaign(campaignId);
        if (temp.data.success === true) {
          queryClient.invalidateQueries(["campaignList"]);
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
        setDuplicateLoader(false);
      } catch (error) {
        console.error(error);
        setDuplicateLoader(false);
      }
    },
    [queryClient],
  );

  const deleteHandler = useCallback(() => {
    setIsDeleteLoader(true);
    deleteCampaign(deleteId)
      .then((res) => {
        const result = res?.data;
        if (result.success) {
          toast.success("Campaign deleted successfully");
          setIsDeleteLoader(false);
          setOpenDeleteModal(false);

          // Filter out the deleted campaign from the campaignList
          const updatedCampaignList = campaignList.filter(
            (campaign) => campaign._id !== deleteId,
          );

          dispatch(campaignListHandler(updatedCampaignList));
          queryClient.invalidateQueries(["campaignList"]);
          // window.location.reload();
        } else {
          setIsDeleteLoader(false);
          toast.error(result.message);
        }
      })
      .catch(() => {
        setIsDeleteLoader(false);
      });
  }, [deleteId, campaignList, dispatch, queryClient]);

  const handleNavigateToCampaign = useCallback(
    (item, choice) => {
      if (!item.coverImageUrl || item.coverImageUrl === "") {
        dispatch(updateCoverMedia(null));
      } else {
        dispatch(updateCoverMedia(item.coverImageUrl));
      }
      const navigateToCampaign = (choice) => {
        if (choice === "view") {
          startTransition(() => {
            router.push(`/${item.randomToken}?src=internal_website`);
          });
        } else if (choice === "edit") {
          let route;
          if (item.status !== "draft") {
            route = createSearchParams(
              {
                id: item.randomToken,
              },
              `campaign/${choice}/`,
            );
          } else {
            route = createSearchParams(
              {
                id: item.randomToken,
              },
              "/create-campaign",
            );
          }
          startTransition(() => {
            router.push(route);
          });
        }
      };
      if (choice === "edit") {
        navigateToCampaign("edit");
      }
      if (choice === "view") {
        navigateToCampaign("view");
      }
      if (choice === "delete") {
        setOpenDeleteModal(true);
        setDeleteId(item._id);
      }
      if (choice === "duplicate") {
        duplicateHandler(item._id);
      }
      if (choice === "deactivate") {
        deactivateHandler(item._id);
      }
    },
    [
      dispatch,
      router,
      duplicateHandler,
      deactivateHandler,
      setOpenDeleteModal,
      setDeleteId,
    ],
  );

  const handleCardClick = (e) => {
    // Check if click is on or inside menu items, share button, or icon menu
    if (
      e.target.closest(".menu-items") ||
      e.target.closest(".share-button") ||
      e.target.closest(".MuiMenu-root") // This checks for clicks inside the menu dropdown
    ) {
      return;
    }
    if (campaignData.status === "active") {
      handleNavigateToCampaign(campaignData, "view");
    }
  };

  const setStatus = () => {
    if (
      campaignData?.status === "rejected" ||
      campaignData?.status === "inActive" ||
      campaignData?.status === "in-active" ||
      campaignData?.status === "inactive"
    ) {
      return "Inactive";
    }
    if (campaignData?.status === "expired") {
      return "Expired";
    }
    if (campaignData?.status === "draft") {
      return "Draft";
    }
    if (campaignData?.status === "pending-approval") {
      return "Pending";
    }
    if (campaignData?.status === "expired") {
      return "Expired";
    }
    return "Active";
  };

  const setApproved = () => {
    if (
      campaignData?.status === "pending-approval" ||
      campaignData?.status === "rejected" ||
      campaignData?.status === "draft" ||
      campaignData?.status === "inActive" ||
      campaignData?.status === "inactive" ||
      campaignData?.status === "in-active" ||
      campaignData?.status === "expired"
    ) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchThumbnail = async () => {
      if (!campaignData.coverImageUrl && campaignData.videoLinks?.[0]?.url) {
        const thumbnail = await getVideoThumbnail(
          campaignData.videoLinks[0].url,
        );
        setThumbnailUrl(thumbnail);
      }
    };

    fetchThumbnail();
  }, [campaignData.coverImageUrl, campaignData.videoLinks]);

  const isMonth = useMemo(() => {
    return campaignData?.isOneTimeDonation === true &&
      campaignData?.isRecurringDonation === true
      ? null
      : campaignData?.isRecurringDonation
        ? "/month"
        : null;
  }, [campaignData?.isOneTimeDonation, campaignData?.isRecurringDonation]);

  const truncateUsername = (username) => {
    return username.length > 30 ? `${username.slice(0, 30)}...` : username;
  };

  const validThumbnailUrl = thumbnailUrl || ASSET_PATHS.images.placeholder;

  const menuOptions = useMemo(
    () => [
      {
        label: "Edit",
        name: "edit",
        clickSideEffects: () => {
          handleNavigateToCampaign(campaignData, "edit");
        },
      },
      ...(campaignData.status === "active"
        ? [
            {
              label: "View",
              name: "view",
              clickSideEffects: () => {
                handleNavigateToCampaign(campaignData, "view");
              },
            },
          ]
        : []),
      ...(campaignData.status !== "draft"
        ? [
            {
              label: "Duplicate",
              name: "duplicate",
              clickSideEffects: () => {
                handleNavigateToCampaign(campaignData, "duplicate");
              },
            },
          ]
        : []),
      ...(campaignData.status === "active"
        ? [
            {
              label: "Deactivate",
              name: "deactivate",
              clickSideEffects: () => {
                handleNavigateToCampaign(campaignData, "deactivate");
              },
            },
          ]
        : []),

      {
        label: "Delete",
        name: "delete",
        clickSideEffects: () => {
          handleNavigateToCampaign(campaignData, "delete");
        },
      },
    ],
    [campaignData, handleNavigateToCampaign],
  );

  return (
    <div>
      {openDeleteModal && (
        <ModalComponent
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          width={"422px"}
          padding={"48px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
        >
          <CampaignHeading
            align={"center"}
            marginBottom={1}
            sx={{ color: theme.palette.primary.dark }}
          >
            Delete fundraiser
          </CampaignHeading>

          <SubHeading1 sx={{ color: theme.palette.primary.gray }}>
            Are you sure that you want to delete the fundraiser? All information
            about it will be deleted.
          </SubHeading1>

          <DeleteButtonWrapper>
            <ButtonComp size="normal" fullWidth onClick={deleteHandler}>
              {isDeleteLoader ? "Deleting..." : "Delete"}
            </ButtonComp>
            <ButtonComp
              size="normal"
              variant="outlined"
              onClick={() => setOpenDeleteModal(false)}
              fullWidth
            >
              Close
            </ButtonComp>
          </DeleteButtonWrapper>
        </ModalComponent>
      )}
      {duplicateLoader === true ? (
        <BoxComponent sx={{ marginLeft: "5px", padding: "10px" }}>
          Campaign duplicating...
        </BoxComponent>
      ) : (
        <BoxComponent
          onClick={handleCardClick}
          sx={{
            height: { xs: "208px", sm: "160px" },
            borderRadius: "32px",
            padding: { xs: "16px", sm: "24px" },
            backgroundColor: theme.palette.primary.light,
            mb: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "space-between",
            boxShadow: BOX_SHADOW_STYLE,
            cursor: campaignData.status === "active" ? "pointer" : "default",
            "&:hover": {
              backgroundColor:
                campaignData.status === "active"
                  ? "#f5f5f5"
                  : theme.palette.primary.light,
            },
          }}
        >
          <BoxComponent
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              width: "100%",
              height: "60px",
              justifyContent: { xs: "flex-start", sm: "space-between" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1, sm: 3 },
              boxSizing: "border-box",
            }}
          >
            <BoxComponent
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 3 },
                order: { xs: 2, sm: 1 },
                height: "60px",
                width: "100%",
              }}
            >
              <BoxComponent
                sx={{
                  minWidth: "92px",
                  maxWidth: "92px",
                  height: "60px",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {campaignData.coverImageUrl ? (
                  <Image
                    source={validThumbnailUrl}
                    alt="campaign_image"
                    width="100%"
                    height="100%"
                    borderRadius="12px"
                    objectFit="cover"
                  />
                ) : (
                  <NextImage
                    src={validThumbnailUrl}
                    alt="campaign_image"
                    width="92"
                    height="58"
                    style={{ borderRadius: "12px", objectFit: "cover" }}
                  />
                )}
              </BoxComponent>

              <div style={{ width: "100%" }}>
                <LimitedParagraph
                  align="left"
                  fontSize="18px"
                  line={1}
                  fontWeight={500}
                  sx={{
                    color: "#A1A1A8",
                    lineHeight: "22px",
                  }}
                >
                  We&apos;re in this together, {truncateUsername(username)}
                </LimitedParagraph>
                <LimitedParagraph
                  align="left"
                  fontSize={isSmallScreen ? "22px" : "32px"}
                  line={1}
                  fontWeight={500}
                  sx={{
                    lineHeight: { xs: "22px", sm: "38px" },
                    mt: 0.3,
                    mb: 0.3,
                    color: theme.palette.primary.dark,
                    wordBreak: "break-all",
                    overflowWrap: "break-word",
                  }}
                >
                  {campaignData.title}
                </LimitedParagraph>
              </div>
            </BoxComponent>
            <BoxComponent
              className="menu-items"
              sx={{
                width: { xs: "100%", sm: "auto" },
                display: "flex",
                alignItems: "flex-end",
                order: { xs: 1, sm: 2 },
                gap: 1.5,
                mb: { xs: 0, sm: -1.5 },
              }}
            >
              <BoxComponent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  width: { xs: "100%", sm: "auto" },
                  gap: 1,
                  mb: { xs: 0.6, sm: 0 },
                }}
              >
                <BoxComponent
                  sx={{
                    minWidth: "92px",
                    maxWidth: "92px",
                    height: "60px",
                    display: { xs: "block", sm: "none" },
                  }}
                >
                  {campaignData.coverImageUrl ? (
                    <Image
                      source={validThumbnailUrl}
                      alt="campaign_image"
                      width="100%"
                      height="100%"
                      borderRadius="12px"
                      objectFit="cover"
                    />
                  ) : (
                    <NextImage
                      src={validThumbnailUrl}
                      alt="campaign_image"
                      width="92"
                      height="58"
                      style={{ borderRadius: "12px", objectFit: "cover" }}
                    />
                  )}
                </BoxComponent>
                <BoxComponent sx={{ display: "flex", alignItems: "center" }}>
                  <Status
                    isApproved={setApproved()}
                    isDraft={campaignData?.status === "draft"}
                  >
                    {setStatus()}
                  </Status>
                  <IconButtonComp
                    className="share-button"
                    disabled={campaignData?.status !== "active"}
                    sx={{
                      opacity: campaignData?.status !== "active" ? 0.4 : 1,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSocialShareModal(true);
                    }}
                  >
                    <ShareIcon />
                  </IconButtonComp>
                  <IconMenu
                    tooltipLabel="Options"
                    menuWidth="100px"
                    menuOptions={menuOptions}
                  >
                    <EditIcons />
                  </IconMenu>
                </BoxComponent>
              </BoxComponent>
            </BoxComponent>
          </BoxComponent>
          <LoaderWrapper>
            <ProgressBarComponent
              currentValue={campaignData.collectedAmount}
              totalValue={campaignData.targetAmount}
            />
            <BoxComponent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: { xs: 0, sm: -1 },
                mt: 1,
              }}
            >
              <TypographyComp
                component={"div"}
                sx={{ fontWeight: 500, fontSize: "14px", lineHeight: "16px" }}
              >
                {campaignData.currencySymbol}
                {formatNumber(campaignData.collectedAmount)}
                {isMonth}{" "}
                <span
                  style={{
                    color: theme.palette.primary.gray,
                    fontWeight: 400,
                    fontSize: "16px",
                  }}
                >
                  raised
                </span>
              </TypographyComp>

              <TypographyComp
                component={"div"}
                sx={{ fontWeight: 500, fontSize: "14px", lineHeight: "16px" }}
              >
                {campaignData.currencySymbol}
                {formatNumber(campaignData.targetAmount)}
                {isMonth}{" "}
                <span
                  style={{
                    color: "#A1A1A8",
                    fontWeight: 400,
                    fontSize: "16px",
                  }}
                >
                  goal
                </span>
              </TypographyComp>
            </BoxComponent>
          </LoaderWrapper>
        </BoxComponent>
      )}
      {socialShareModal && (
        <ModalComponent
          width={600}
          open={socialShareModal}
          onClose={() => setSocialShareModal(false)}
        >
          <SocialShare
            setSocialShareModal={setSocialShareModal}
            customTitle={campaignData.title}
            customUrlData={`${RANDOM_URL}${campaignData.randomToken}`}
          />
        </ModalComponent>
      )}
    </div>
  );
};

CampaignList.propTypes = {
  campaignData: PropTypes.any,
  username: PropTypes.string,
};

export default memo(CampaignList);
