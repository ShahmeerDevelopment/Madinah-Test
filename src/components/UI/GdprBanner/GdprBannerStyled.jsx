"use client";

import React, { useState, useEffect } from "react";
// Direct MUI imports for better tree-shaking
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import { setCookie, getCookie } from "cookies-next";

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

    const handlePreferenceChange = (category) => (event) => {
        if (category === "necessary") return; // Cannot disable necessary cookies

        setPreferences(prev => ({
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
                p: { xs: 1, sm: 2 },
                bgcolor: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(4px)",
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
                    mb: 2
                }}>
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                            fontWeight: 500, // Match your app's font weights
                            fontSize: "18px",
                            lineHeight: "22px",
                            color: theme.palette.primary.dark,
                            fontFamily: "League Spartan, sans-serif", // Match your app's font family
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
                            }
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
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "20px",
                        fontFamily: "League Spartan, sans-serif",
                    }}
                >
                    We use cookies and similar technologies to enhance your browsing experience, analyze site traffic,
                    and provide personalized content. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
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
                            color: theme.palette.primary.light,
                            borderRadius: "48px", // Match your button border radius
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
                                opacity: 0.9,
                                boxShadow: "none",
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

                    <Button
                        variant="text"
                        onClick={() => setShowDetails(!showDetails)}
                        endIcon={showDetails ? <ExpandLess /> : <ExpandMore />}
                        sx={{
                            color: theme.palette.primary.main,
                            borderRadius: "48px",
                            padding: "12px 32px",
                            height: "44px",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "20px",
                            textTransform: "none",
                            fontFamily: "League Spartan, sans-serif",
                            "&:hover": {
                                bgcolor: theme.palette.primary.mainLight,
                            },
                            flex: isMobile ? "none" : 1,
                        }}
                    >
                        Customize
                    </Button>
                </Stack>

                <Collapse in={showDetails}>
                    <Divider sx={{ my: 2, borderColor: theme.palette.primary.lightGray }} />

                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2,
                            fontWeight: 500,
                            fontSize: "18px",
                            lineHeight: "22px",
                            color: theme.palette.primary.dark,
                            fontFamily: "League Spartan, sans-serif",
                        }}
                    >
                        Cookie Preferences
                    </Typography>

                    <Stack spacing={3}>
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
                                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                backgroundColor: theme.palette.primary.main,
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Box sx={{ ml: 1 }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 500,
                                                fontSize: "16px",
                                                lineHeight: "20px",
                                                color: theme.palette.primary.dark,
                                                fontFamily: "League Spartan, sans-serif",
                                            }}
                                        >
                                            Necessary Cookies
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: theme.palette.primary.gray,
                                                fontSize: "14px",
                                                fontWeight: 400,
                                                lineHeight: "16px",
                                                fontFamily: "League Spartan, sans-serif",
                                            }}
                                        >
                                            Essential for the website to function properly. These cannot be disabled.
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
                                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                backgroundColor: theme.palette.primary.main,
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Box sx={{ ml: 1 }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 500,
                                                fontSize: "16px",
                                                lineHeight: "20px",
                                                color: theme.palette.primary.dark,
                                                fontFamily: "League Spartan, sans-serif",
                                            }}
                                        >
                                            Analytics Cookies
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: theme.palette.primary.gray,
                                                fontSize: "14px",
                                                fontWeight: 400,
                                                lineHeight: "16px",
                                                fontFamily: "League Spartan, sans-serif",
                                            }}
                                        >
                                            Help us understand how visitors interact with our website by collecting and reporting information.
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
                                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                backgroundColor: theme.palette.primary.main,
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Box sx={{ ml: 1 }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 500,
                                                fontSize: "16px",
                                                lineHeight: "20px",
                                                color: theme.palette.primary.dark,
                                                fontFamily: "League Spartan, sans-serif",
                                            }}
                                        >
                                            Marketing Cookies
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: theme.palette.primary.gray,
                                                fontSize: "14px",
                                                fontWeight: 400,
                                                lineHeight: "16px",
                                                fontFamily: "League Spartan, sans-serif",
                                            }}
                                        >
                                            Used to track visitors across websites for personalized advertising and marketing purposes.
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
                                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                backgroundColor: theme.palette.primary.main,
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Box sx={{ ml: 1 }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 500,
                                                fontSize: "16px",
                                                lineHeight: "20px",
                                                color: theme.palette.primary.dark,
                                                fontFamily: "League Spartan, sans-serif",
                                            }}
                                        >
                                            Functional Cookies
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: theme.palette.primary.gray,
                                                fontSize: "14px",
                                                fontWeight: 400,
                                                lineHeight: "16px",
                                                fontFamily: "League Spartan, sans-serif",
                                            }}
                                        >
                                            Enable enhanced functionality and personalization, such as remembering your preferences.
                                        </Typography>
                                    </Box>
                                }
                            />
                        </Box>
                    </Stack>

                    <Box sx={{
                        mt: 3,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 2, sm: 0 }
                    }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: theme.palette.primary.gray,
                                fontSize: "14px",
                                fontWeight: 400,
                                lineHeight: "16px",
                                fontFamily: "League Spartan, sans-serif",
                            }}
                        >
                            You can change your preferences at any time in our{" "}
                            <Box
                                component="a"
                                href="/privacy-policy"
                                sx={{
                                    color: theme.palette.primary.main,
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    "&:hover": {
                                        textDecoration: "underline"
                                    }
                                }}
                            >
                                Privacy Policy
                            </Box>
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={handleSavePreferences}
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
                                    opacity: 0.9,
                                    boxShadow: "none",
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
