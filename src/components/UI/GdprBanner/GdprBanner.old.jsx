"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Divider,
  Collapse,
  Switch,
  FormControlLabel,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Close as CloseIcon,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { setCookie, getCookie } from "cookies-next";
import Link from "next/link";

const CONSENT_COOKIE_NAME = "gdpr_consent";
const CONSENT_EXPIRY_DAYS = 365;

const GdprBanner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = getCookie(CONSENT_COOKIE_NAME);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString(),
    };

    setCookie(CONSENT_COOKIE_NAME, JSON.stringify(allAccepted), {
      maxAge: CONSENT_EXPIRY_DAYS * 24 * 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    setShowBanner(false);

    // Enable all tracking services
    enableTrackingServices(allAccepted);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString(),
    };

    setCookie(CONSENT_COOKIE_NAME, JSON.stringify(necessaryOnly), {
      maxAge: CONSENT_EXPIRY_DAYS * 24 * 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    setShowBanner(false);

    // Enable only necessary services
    enableTrackingServices(necessaryOnly);
  };

  const handleSavePreferences = () => {
    const consentData = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };

    setCookie(CONSENT_COOKIE_NAME, JSON.stringify(consentData), {
      maxAge: CONSENT_EXPIRY_DAYS * 24 * 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    setShowBanner(false);

    // Enable tracking services based on preferences
    enableTrackingServices(consentData);
  };

  const enableTrackingServices = (consent) => {
    // Enable/disable Google Analytics
    if (consent.analytics && typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }

    // Enable/disable Marketing cookies (Facebook Pixel, etc.)
    if (consent.marketing && typeof window !== "undefined") {
      if (window.fbq) {
        window.fbq("consent", "grant");
      }
    }

    // Enable/disable PostHog analytics
    if (consent.analytics && typeof window !== "undefined" && window.posthog) {
      window.posthog.opt_in_capturing();
    } else if (
      !consent.analytics &&
      typeof window !== "undefined" &&
      window.posthog
    ) {
      window.posthog.opt_out_capturing();
    }

    // Dispatch custom event for other components to listen to
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("gdprConsentUpdated", {
          detail: consent,
        }),
      );
    }
  };

  const handlePreferenceChange = (category) => (event) => {
    if (category === "necessary") return; // Cannot disable necessary cookies

    setPreferences((prev) => ({
      ...prev,
      [category]: event.target.checked,
    }));
  };

  const handleClose = () => {
    // If user closes without making a choice, treat as necessary only
    handleAcceptNecessary();
  };

  if (!showBanner) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        p: 2,
        bgcolor: "rgba(0, 0, 0, 0.8)",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          p: 3,
          borderRadius: 2,
          bgcolor: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: 600, color: theme.palette.primary.main }}
          >
            🍪 We use cookies
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ color: theme.palette.text.secondary }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography
          variant="body2"
          sx={{ mb: 2, color: theme.palette.text.primary }}
        >
          We use cookies and similar technologies to enhance your browsing
          experience, analyze site traffic, and provide personalized content. By
          clicking &quot;Accept All&quot;, you consent to our use of cookies.
        </Typography>

        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Button
            variant="contained"
            onClick={handleAcceptAll}
            sx={{
              bgcolor: theme.palette.primary.main,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
              flex: isMobile ? "none" : 1,
            }}
          >
            Accept All
          </Button>

          <Button
            variant="outlined"
            onClick={handleAcceptNecessary}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              flex: isMobile ? "none" : 1,
            }}
          >
            Necessary Only
          </Button>

          <Button
            variant="text"
            onClick={() => setShowDetails(!showDetails)}
            endIcon={showDetails ? <ExpandLess /> : <ExpandMore />}
            sx={{
              color: theme.palette.primary.main,
              flex: isMobile ? "none" : 1,
            }}
          >
            Customize
          </Button>
        </Stack>

        <Collapse in={showDetails}>
          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Cookie Preferences
          </Typography>

          <Stack spacing={2}>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.necessary}
                    disabled={true}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Necessary Cookies
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Essential for the website to function properly. These
                      cannot be disabled.
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.analytics}
                    onChange={handlePreferenceChange("analytics")}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Analytics Cookies
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Help us understand how visitors interact with our website
                      by collecting and reporting information.
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.marketing}
                    onChange={handlePreferenceChange("marketing")}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Marketing Cookies
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Used to track visitors across websites for personalized
                      advertising and marketing purposes.
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.functional}
                    onChange={handlePreferenceChange("functional")}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Functional Cookies
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Enable enhanced functionality and personalization, such as
                      remembering your preferences.
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Stack>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              You can change your preferences at any time in our{" "}
              <Link href="/privacy-policy" passHref prefetch={false}>
                <Box
                  component="span"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Privacy Policy
                </Box>
              </Link>
            </Typography>

            <Button
              variant="contained"
              onClick={handleSavePreferences}
              sx={{
                bgcolor: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              Save Preferences
            </Button>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default GdprBanner;
