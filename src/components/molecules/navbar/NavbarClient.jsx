"use client";

/* eslint-disable no-mixed-spaces-and-tabs */
import * as React from "react";
import { startTransition } from "react";
// Direct MUI imports for better tree-shaking
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useDispatch, useSelector } from "react-redux";
import { getCookie, deleteCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import PropTypes from "prop-types";
import Image from "next/image";

// App Router compatible imports
import {
  usePathname,
  useSearchParams,
  useRouter as useAppRouter,
} from "next/navigation";

import BtnMenu from "../BtnMenu";
import { logout } from "../../../api";
import ModalManager from "../modal/ModalManager";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import Search from "../../../assets/common/Search";

import LogoutModal from "./LogoutModal";
import CloseIcon from "../BtnMenu/icons/CloseIcon";
import SearchModal from "../../advance/SearchModal/";
import ModalComponent from "../modal/ModalComponent";
import BurgerIcon from "../../../assets/icons/BurgerIcon";
import OutlinedIconButton from "../../advance/OutlinedIconButton";
import useResponsiveScreen from "../../../hooks/useResponsiveScreen";
import { resetValues } from "../../../store/slices/mutateCampaignSlice";
import { resetProfileValues } from "../../../store/slices/mutateAuthSlice";

import {
  AccountSettingsIcon,
  DonationsYouveMadeIcon,
  StartFundraiserIcon,
  YourFundraisersIcon,
} from "./../../../assets/icons/Nav/";

import {
  isAdminLogin,
  isLoginHandler,
  isLoginModalOpen,
  resetUserDetails,
  logout as userLogout,
} from "../../../store/slices/authSlice";

import {
  resetActiveStepper,
  resetCampaignValues,
} from "../../../store/slices/campaignSlice";
import LanguageOutlined from "@mui/icons-material/LanguageOutlined";

const AuthButton = ({ isLogin, handleOpenModal, transparent }) => {
  const theme = useTheme();
  const [auth] = useState(getCookie("token"));

  if (isLogin && auth) return null;
  return (
    <ButtonComp
      sx={{
        height: "34px !important",
        p: "10.5px 19px",
        borderColor: transparent ? "#ffffff" : theme.palette.primary.main,
        color: transparent ? "#ffffff" : theme.palette.primary.main,
        pt: "12.5px !important",
        "&:hover": {
          borderColor: transparent ? "#ffffff" : theme.palette.primary.main,
        },
        "&.Mui-disabled": {
          borderColor: "rgba(0, 0, 0, 0.12)",
          color: "rgba(0, 0, 0, 0.26)",
        },
      }}
      variant="outlined"
      onClick={handleOpenModal}
    >
      Sign In
    </ButtonComp>
  );
};

AuthButton.propTypes = {
  handleOpenModal: PropTypes.func,
  isLogin: PropTypes.bool,
  transparent: PropTypes.any,
};

/**
 * Client component for Navbar interactive functionality
 * Receives initial auth state from server to avoid hydration mismatch
 */
export default function NavbarClient({
  isWidgetMode = false,
  initialHasAuth = false,
  logoSrc,
}) {
  const router = useAppRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isSmallScreen } = useResponsiveScreen();

  // Build query object from searchParams for compatibility
  const query = React.useMemo(() => {
    const obj = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  // Use Redux auth state, but initialize with server-provided value
  const auth =
    useSelector((state) => state.auth.token) || (initialHasAuth ? true : null);
  const [transparent, setIsTransparent] = useState(true);
  const { isLogin } = useSelector((state) => (auth ? state.auth : false));

  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [whiteBackground, setWhiteBackground] = useState(false);

  // Get slug from pathname for App Router
  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  const slug = pathSegments.length > 0 ? pathSegments : undefined;
  const isSlugPage = Array.isArray(slug) && slug.length > 0;

  // Known routes that are NOT campaign pages
  const knownRoutes = [
    "/discover",
    "/about-us",
    "/account-settings",
    "/add-documents",
    "/campaign",
    "/campaign-success",
    "/category",
    "/cookie-policy",
    "/create-campaign",
    "/dashboard",
    "/donate-now",
    "/donation-success",
    "/donations",
    "/email-verification",
    "/guest-user",
    "/how-it-works",
    "/invite-user",
    "/notifications",
    "/preview",
    "/privacy-policy",
    "/reset-password",
    "/setup-transfers",
    "/statistics",
    "/summary",
    "/terms-and-conditions",
    "/your-donations",
    "/home",
    "/profile",
  ];

  // Check if current path starts with any known route
  const isKnownRoute = knownRoutes.some((route) => pathname.startsWith(route));

  // A campaign page is a slug page that's NOT a known route
  const isCampaignPage = isSlugPage && !isKnownRoute && pathname !== "/";

  // Logo should be disabled ONLY on campaign pages when src !== "internal_website"
  const isNotInternalSrc = isCampaignPage && query.src !== "internal_website";

  const experimentalFeature = getCookie("abtesting");

  useEffect(() => {
    // Define pages where the navbar should start transparent
    const pagesWithTransparentNav = ["/home", "/about", "/services", "/"];
    setIsTransparent(pagesWithTransparentNav.includes(pathname));
  }, [pathname]);

  const handleOpenModal = () => {
    if (isLogin) {
      startTransition(() => {
        router.push("/profile");
      });
    } else {
      dispatch(isLoginModalOpen(true));
    }
  };

  const handleLogoutButton = async () => {
    try {
      await logout();
      startTransition(() => {
        deleteCookie("google_token");
        deleteCookie("token");
        deleteCookie("madinah_refresh");
        deleteCookie("name");
        dispatch(userLogout());
        localStorage.clear();
        dispatch(isAdminLogin(false));
        dispatch(isLoginHandler(false));
        dispatch(resetValues());
        dispatch(resetActiveStepper(0));
        dispatch(resetUserDetails());
        dispatch(resetProfileValues());
        setOpenLogoutModal(false);
        window.location.href = "/";
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogout = async () => {
    setOpenLogoutModal(true);
  };

  const accountHandler = () => {
    startTransition(() => {
      dispatch(resetValues());
      router.push("/account-settings");
    });
  };

  const campaignHandler = () => {
    dispatch(resetActiveStepper(0));
    dispatch(resetCampaignValues());
    startTransition(() => {
      dispatch(resetValues());
      router.push("/create-campaign");
    });
  };

  const discoverCampaignsHandler = () => {
    startTransition(() => {
      dispatch(resetValues());
      router.push("/discover");
    });
  };

  let transparentStyles = {
    appBar: {
      background: "rgba(255,255,255,0.1)",
      backdropFilter: "blur(3px)",
    },
  };

  const handleScroll = () => {
    if (window.scrollY > 675) {
      setWhiteBackground(true);
    } else {
      setWhiteBackground(false);
    }
  };

  useEffect(() => {
    if (!auth) {
      dispatch(isLoginHandler(false));
    }
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleOpenSearchModal = () => setOpenSearchModal(true);
  const handleCloseSearchModal = () => setOpenSearchModal(false);

  const dynamicColors = !whiteBackground
    ? transparent
      ? "#ffffff"
      : theme.palette.primary.main
    : theme.palette.primary.main;

  return (
    <BoxComponent
      sx={{
        // Suppress ALL transitions recursively to prevent any perceptual gliding during hydration or state changes
        "& *": {
          transition: "none !important",
        },
        "& .MuiAppBar-root": {
          transition: "none !important",
        },
      }}
    >
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          ...(!whiteBackground
            ? transparent
              ? transparentStyles.appBar
              : { background: "#FFFFFF" }
            : { background: "#FFFFFF" }),
          // Ensure AppBar always accounts for full viewport minus scrollbar
          left: 0,
          right: 0,
          width: "100%",
        }}
        elevation={0}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center", // Centered content (Logo)
            alignItems: "center",
            position: "relative", // Host for absolute children
            px: "0px !important",
            minHeight: "64px !important",
            "@media (max-width:600px)": {
              px: "16px !important", // Stable padding to match skeleton and prevent hydration jump
              minHeight: "56px !important",
            },
            "@media (min-width:600px)": {
              px: "40px !important",
            },
            "@media (min-width:900px)": {
              px: "151px !important",
            },
          }}
        >
          {/* LEFT SLOT - Absolute on mobile, Static on Desktop */}
          <BoxComponent
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              flexShrink: 0,
              "@media (max-width:599px)": {
                width: "48px",
                position: "absolute",
                left: "16px",
              },
              "@media (min-width:600px)": {
                width: "auto",
                minWidth: "100px",
                position: "static",
              },
              zIndex: 1,
            }}
          >
            {!isWidgetMode && (
              <BoxComponent
                sx={{
                  display: {
                    xs: "flex",
                    sm: isNotInternalSrc ? "none" : "flex",
                    md: "none",
                  },
                  width: "48px",
                  justifyContent: "center",
                  visibility: isNotInternalSrc ? "hidden" : "visible",
                }}
              >
                <OutlinedIconButton
                  onClick={handleOpenSearchModal}
                  borderColor={dynamicColors}
                >
                  <Search color={dynamicColors} />
                </OutlinedIconButton>
              </BoxComponent>
            )}

            {/* Desktop Auth Section */}
            {!isWidgetMode && (
              <BoxComponent sx={{ display: { xs: "none", sm: "block" } }}>
                {auth ? (
                  <div>&nbsp;</div>
                ) : (
                  <AuthButton
                    transparent={!whiteBackground ? transparent : false}
                    isLogin={isLogin}
                    handleOpenModal={handleOpenModal}
                  />
                )}
              </BoxComponent>
            )}
          </BoxComponent>

          {/* CENTER SLOT - Flexible to keep logo perfectly centered */}
          <BoxComponent
            sx={{
              display: "flex",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <a
              href={isNotInternalSrc || isWidgetMode ? "#" : "/"}
              onClick={(e) => {
                e.preventDefault();
                if (
                  isNotInternalSrc ||
                  (isWidgetMode && pathname !== "/donation-success")
                ) {
                  return;
                }
                if (isWidgetMode && pathname === "/donation-success") {
                  window.open("/", "_blank");
                } else {
                  startTransition(() => {
                    router.push("/");
                  });
                }
              }}
              style={{
                cursor:
                  isNotInternalSrc ||
                  (isWidgetMode && pathname !== "/donation-success")
                    ? "default"
                    : "pointer",
                pointerEvents:
                  isNotInternalSrc ||
                  (isWidgetMode && pathname !== "/donation-success")
                    ? "none"
                    : "auto",
              }}
            >
              <Image
                src={logoSrc}
                height={40}
                width={114}
                alt="logo"
                style={{ height: "auto" }}
                priority
              />
            </a>
          </BoxComponent>

          {/* RIGHT SLOT - Absolute on mobile, Static on Desktop */}
          <BoxComponent
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1,
              flexShrink: 0,
              "@media (max-width:899px)": {
                width: "48px",
                position: "absolute",
                right: "16px",
              },
              "@media (min-width:900px)": {
                width: "auto",
                minWidth: "110px",
                position: "static",
                right: "auto",
              },
              zIndex: 1,
            }}
          >
            {/* Desktop Only Search - Controlled by CSS visibility */}
            <BoxComponent
              sx={{
                display: { xs: "none", md: "flex" },
                visibility:
                  isNotInternalSrc || isWidgetMode ? "hidden" : "visible",
              }}
            >
              <OutlinedIconButton
                onClick={() => {
                  handleOpenSearchModal();
                }}
                borderColor={dynamicColors}
              >
                <Search color={dynamicColors} />
              </OutlinedIconButton>
            </BoxComponent>

            {/* Show hamburger menu */}
            {!isWidgetMode && (
              <BtnMenu
                closeIcon={<CloseIcon color={dynamicColors} />}
                iconBtn
                btnProps={{
                  sx: {
                    height: "34px",
                    width: "48px",
                    borderColor: dynamicColors,
                    // Ensure stable positioning
                    flexShrink: 0,
                    transition: "none !important",
                  },
                  variant: "outlined",
                }}
                menuItemStyleOverrides={{
                  py: "12px !important",
                }}
                paperStyleOverrides={{
                  borderRadius: "12px",
                  "& .MuiListItemIcon-root": {
                    minWidth: "31px",
                  },
                }}
                tooltipLabel="Options"
                menuOptions={
                  auth
                    ? [
                        {
                          label: "Your fundraisers",
                          name: "fundraisers",
                          clickSideEffects: () => {
                            router.push("/dashboard");
                          },
                          icon: <YourFundraisersIcon />,
                        },
                        {
                          label: "Donations you've made",
                          name: "donations-made",
                          clickSideEffects: () =>
                            router.push("/your-donations"),
                          icon: <DonationsYouveMadeIcon />,
                        },
                        {
                          label: "Account settings",
                          name: "settings",
                          clickSideEffects: () => {
                            accountHandler();
                          },
                          icon: <AccountSettingsIcon />,
                        },
                        {
                          label: "Start a new fundraiser",
                          name: "create-campaign",
                          clickSideEffects: () => {
                            dispatch(resetCampaignValues());
                            campaignHandler();
                          },
                          icon: <StartFundraiserIcon />,
                        },
                        ...(isNotInternalSrc
                          ? []
                          : [
                              {
                                label: "Discover Campaigns",
                                name: "discover-campaigns",
                                clickSideEffects: () => {
                                  discoverCampaignsHandler();
                                },
                                icon: <LanguageOutlined fontSize="small" />,
                              },
                            ]),
                        {
                          label: "Sign out",
                          name: "sign-out",
                          clickSideEffects: () => {
                            handleLogout();
                          },
                          red: true,
                        },
                      ]
                    : [
                        {
                          label: "Start a new fundraiser",
                          name: "create-campaign",
                          clickSideEffects: () => {
                            dispatch(resetCampaignValues());
                            campaignHandler();
                          },
                          icon: <StartFundraiserIcon />,
                        },
                        ...(isNotInternalSrc
                          ? []
                          : [
                              {
                                label: "Discover Campaigns",
                                name: "discover-campaigns",
                                clickSideEffects: () => {
                                  discoverCampaignsHandler();
                                },
                                icon: <LanguageOutlined fontSize="small" />,
                              },
                            ]),
                        {
                          label: "Sign In",
                          name: "sign-in",
                          clickSideEffects: () => {
                            handleOpenModal();
                          },
                          icon: <AccountSettingsIcon />,
                        },
                      ]
                }
              >
                <BurgerIcon color={dynamicColors} />
              </BtnMenu>
            )}
          </BoxComponent>
        </Toolbar>
      </AppBar>
      <ModalManager />
      {openSearchModal && (
        <SearchModal
          state={openSearchModal}
          handleOpen={handleOpenSearchModal}
          handleClose={handleCloseSearchModal}
        />
      )}
      {openLogoutModal && (
        <ModalComponent
          open={openLogoutModal}
          onClose={() => setOpenLogoutModal(false)}
          width={"422px"}
          padding={"48px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
        >
          <LogoutModal
            logoutHandler={handleLogoutButton}
            setOpenLogoutModal={setOpenLogoutModal}
          />
        </ModalComponent>
      )}
    </BoxComponent>
  );
}

NavbarClient.propTypes = {
  isWidgetMode: PropTypes.bool,
  initialHasAuth: PropTypes.bool,
  logoSrc: PropTypes.string,
};
