"use client";

import React, { lazy, Suspense } from "react";
import PropTypes from "prop-types";
import ModalComponent from "@/components/molecules/modal/ModalComponent";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { CircularProgress } from "@mui/material";

const AboutUsUI = lazy(() => import("@/components/UI/AboutUs"));
const PrivacyPolicyUI = lazy(() => import("@/components/UI/PrivacyPolicy"));
const CookiePolicyUI = lazy(() => import("@/components/UI/CookiePolicy"));
const TermsAndConditionsUI = lazy(
  () => import("@/components/UI/TermsAndConditions")
);

const FooterLinkModal = ({ open, onClose, linkPath }) => {
  const getComponent = () => {
    switch (linkPath) {
      case "/about-us":
        return <AboutUsUI onClose={onClose} />;
      case "/privacy-policy":
        return <PrivacyPolicyUI />;
      case "/cookie-policy":
        return <CookiePolicyUI />;
      case "/terms-and-conditions":
        return <TermsAndConditionsUI />;
      default:
        return null;
    }
  };

  return (
    <ModalComponent
      open={open}
      onClose={onClose}
      width="90%"
      padding={0}
      containerStyleOverrides={{
        maxHeight: "90vh",
        maxWidth: "1200px",
        overflow: "hidden",
      }}
    >
      <BoxComponent
        sx={{
          height: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          padding: { xs: 2, sm: 3, md: 4 },
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        <Suspense
          fallback={
            <BoxComponent
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "300px",
              }}
            >
              <CircularProgress />
            </BoxComponent>
          }
        >
          {getComponent()}
        </Suspense>
      </BoxComponent>
    </ModalComponent>
  );
};

FooterLinkModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  linkPath: PropTypes.string.isRequired,
};

export default FooterLinkModal;
