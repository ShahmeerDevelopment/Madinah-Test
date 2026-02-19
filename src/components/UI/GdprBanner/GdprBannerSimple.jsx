"use client";

import React, { useState, useEffect } from "react";
// Direct MUI imports for better tree-shaking
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "@mui/icons-material/Close";
import { setCookie, getCookie } from "cookies-next";

const CONSENT_COOKIE_NAME = "gdpr_consent";
const CONSENT_EXPIRY_DAYS = 365;

const GdprBanner = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [showBanner, setShowBanner] = useState(false);

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
        } else if (!consent.analytics && typeof window !== "undefined" && window.posthog) {
            window.posthog.opt_out_capturing();
        }

        // Dispatch custom event for other components to listen to
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("gdprConsentUpdated", {
                detail: consent
            }));
        }
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
                p: { xs: 1, sm: 2 },
            }}
        >
            <Paper
                elevation={12}
                sx={{
                    maxWidth: "1120px", // Match your app's MAX_PAGE_WIDTH
                    mx: "auto",
                    p: { xs: 2, sm: 3 },
                    borderRadius: "20px", // Match your app's border radius patterns
                    bgcolor: theme.palette.primary.light, // Use theme white
                    border: `1px solid ${theme.palette.primary.lightGray}`, // Subtle border
                }}
            >
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                    gap: 2,
                }}>
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                            fontWeight: 600,
                            color: theme.palette.primary.dark,
                            fontFamily: "League Spartan, sans-serif",
                            fontSize: "20px",
                            lineHeight: "24px",
                        }}
                    >
                        🍪 We use cookies
                    </Typography>
                    <IconButton
                        onClick={handleClose}
                        size="small"
                        sx={{
                            color: theme.palette.primary.gray,
                            "&:hover": {
                                bgcolor: theme.palette.primary.lightGray,
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        mb: 3,
                        color: theme.palette.primary.darkGray,
                        fontFamily: "League Spartan, sans-serif",
                        fontSize: "16px",
                        lineHeight: "20px",
                    }}
                >
                    We use cookies and similar technologies to enhance your browsing experience, analyze site traffic,
                    and provide personalized content. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                </Typography>

                <Stack
                    direction={isMobile ? "column" : "row"}
                    spacing={2}
                    sx={{ mb: 0 }}
                >
                    <Button
                        variant="contained"
                        onClick={handleAcceptAll}
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            color: theme.palette.primary.light,
                            borderRadius: "48px",
                            padding: "12px 32px",
                            height: "44px",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "20px",
                            textTransform: "none",
                            fontFamily: "League Spartan, sans-serif",
                            boxShadow: "none",
                            "&:hover": {
                                bgcolor: theme.palette.primary.main,
                                boxShadow: "0px 8px 24px rgba(99, 99, 230, 0.2)",
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
                            borderRadius: "48px",
                            padding: "12px 32px",
                            height: "44px",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "20px",
                            textTransform: "none",
                            fontFamily: "League Spartan, sans-serif",
                            boxShadow: "none",
                            "&:hover": {
                                borderColor: theme.palette.primary.main,
                                bgcolor: theme.palette.primary.mainLight,
                                boxShadow: "none",
                            },
                            flex: isMobile ? "none" : 1,
                        }}
                    >
                        Necessary Only
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default GdprBanner;
