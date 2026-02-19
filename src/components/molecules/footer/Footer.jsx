"use client";

import PropTypes from "prop-types";
import React, { useState } from "react";
import { FooterWrapper } from "./Footer.style";
import { ASSET_PATHS } from "@/utils/assets";
// import logoColored from '../../../assets/svg/logoColored.svg';
import { FOOTER } from "@/config/constant";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import SubHeading from "../../atoms/createCampaigns/SubHeading";
import Paragraph from "../../atoms/createCampaigns/Paragraph";
import useResponsiveScreen from "../../../hooks/useResponsiveScreen";
// import { LinkSpan } from "../../../pages/auth/signup/SignUp.style";
import LinkComponent from "../../atoms/LinkComponent";
import Image from "next/image";
import { LinkSpan } from "@/components/UI/Auth/signup/SignUp.style";
import {  usePathname, useSearchParams } from "next/navigation";
import { isUserFromEuropeOrUK } from "@/utils/helpers";
import FooterLinkModal from "./FooterLinkModal";

const Footer = ({ withSidebar }) => {
  const { isSmallerThan } = useResponsiveScreen();
  const smallerThan900 = isSmallerThan("900");
  const date = new Date();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLinkPath, setSelectedLinkPath] = useState("");

  // Build query object from searchParams for compatibility
  const query = React.useMemo(() => {
    const obj = {};
    searchParams?.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  // Get slug from pathname for App Router
  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  const slug = pathSegments.length > 0 ? pathSegments : undefined;
  const isSlugPage = Array.isArray(slug) && slug.length > 0;

  // Known routes that are NOT campaign pages
  const knownRoutes = [
    '/discover', '/about-us', '/account-settings', '/add-documents',
    '/campaign', '/campaign-success', '/category', '/cookie-policy',
    '/create-campaign', '/dashboard', '/donate-now', '/donation-success',
    '/donations', '/email-verification', '/guest-user', '/how-it-works',
    '/invite-user', '/notifications', '/preview', '/privacy-policy',
    '/reset-password', '/setup-transfers', '/statistics', '/summary',
    '/terms-and-conditions', '/your-donations', '/home', '/profile'
  ];
  
  // Check if current path starts with any known route
  const isKnownRoute = knownRoutes.some(route => pathname.startsWith(route));
  
  // A campaign page is a slug page that's NOT a known route
  const isCampaignPage = isSlugPage && !isKnownRoute && pathname !== '/';
  
  // Footer should be restricted ONLY on campaign pages when src !== "internal_website"
  const isNotInternalSrc = isCampaignPage && query.src !== "internal_website";

  let year = date.getFullYear();

  const handleFooterItemClick = (item) => {
    if (item.action === "openCookiePreferences") {
      // Open cookie preferences modal
      if (typeof window !== "undefined" && window.openCookiePreferences) {
        window.openCookiePreferences();
      } else if (typeof window !== "undefined") {
        // Fallback: dispatch custom event
        window.dispatchEvent(new CustomEvent("openCookiePreferences"));
      }
    } else if (item.path && isNotInternalSrc) {
      setSelectedLinkPath(item.path);
      setModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedLinkPath("");
  };

  // Filter footer items based on user's location
  const isEuropeanUser = isUserFromEuropeOrUK();
  const filteredFooterItems = FOOTER.filter((item) => {
    // Hide cookie-related items for non-European users
    if (!isEuropeanUser && (item.id === 3 || item.id === 4)) {
      return false; // id 3 = Cookie Policy, id 4 = Cookie Settings
    }
    return true;
  });

  return (
    <FooterWrapper withSidebar={withSidebar} smallerThan900={smallerThan900}>
      <>
        <BoxComponent
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: "39px",
            mb: 3,
            "@media (max-width: 600px)": {
              "& .logo": {
                // marginBottom: '40.6px',
              },
            },
          }}
        >
          <BoxComponent
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              width: { xs: "100%" },
              order: { xs: 2, sm: 1 },
            }}
          >
            {filteredFooterItems.map((item) => (
              <BoxComponent key={item.id}>
                <SubHeading
                  sx={{
                    color: { xs: "black", sm: "#A1A1A8" },
                  }}
                >
                  {item.path && item.path !== "" ? (
                    isNotInternalSrc ? (
                      <span
                        onClick={() => handleFooterItemClick(item)}
                        style={{
                          cursor: "pointer",
                          textDecoration: "none",
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.textDecoration = "none";
                        }}
                      >
                        {item.name}
                      </span>
                    ) : (
                      <LinkSpan
                        to={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                      // color={theme.palette.primary.main}
                      >
                        {item.name}
                      </LinkSpan>
                    )
                  ) : item.action ? (
                    <span
                      onClick={() => handleFooterItemClick(item)}
                      style={{
                        cursor: "pointer",
                        textDecoration: "none",
                      }}
                      // onMouseEnter={(e) => {
                      //   e.target.style.textDecoration = "underline";
                      // }}
                      onMouseLeave={(e) => {
                        e.target.style.textDecoration = "none";
                      }}
                    >
                      {item.name}
                    </span>
                  ) : (
                    item.name
                  )}
                </SubHeading>
              </BoxComponent>
            ))}
          </BoxComponent>
          <BoxComponent className="logo" sx={{ order: { xs: 1, sm: 2 } }}>
            <LinkComponent
              styleOverrides={{
                transform: "translateX(10px)",
                cursor: isNotInternalSrc ? "default" : "pointer",
                pointerEvents: isNotInternalSrc ? "none" : "auto",
                // opacity: isNotInternalSrc ? 0.5 : 1,
              }}
              disabled={isNotInternalSrc}
              to={isNotInternalSrc ? "#" : "/"}
            >
              <div
                style={{ width: "114px", height: "auto", position: "relative" }}
              >
                <Image
                  src={ASSET_PATHS.images.logo}
                  alt="logo"
                  layout="responsive"
                  width={114}
                  height={114}
                />
              </div>
            </LinkComponent>
          </BoxComponent>
        </BoxComponent>
        <Paragraph
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-start" },
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-start" },
            gap: { xs: 1, sm: 2 },
          }}
        >
          <span>&copy;{year} Madinah</span>
        </Paragraph>
      </>

      {/* Modal for footer links when in widget/embedded mode */}
      <FooterLinkModal
        open={modalOpen}
        onClose={handleModalClose}
        linkPath={selectedLinkPath}
      />
    </FooterWrapper>
  );
};

Footer.propTypes = {
  withSidebar: PropTypes.any,
};

export default Footer;
