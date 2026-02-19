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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import { setCookie, getCookie } from "cookies-next";
import { LinkSpan } from "../Auth/signup/SignUp.style";
import { isUserFromEuropeOrUK } from "../../../utils/helpers";
import { getGeolocationData } from "../../../utils/countryToContinent";
import { sendConsentToApi } from "@/api/post-api-services";

const CONSENT_COOKIE_NAME = "gdpr_consent";
const CONSENT_EXPIRY_DAYS = 365;
const BANNER_DISMISS_STORAGE_KEY = "gdpr_banner_dismissed";
const SESSION_STORAGE_KEY = "gdpr_session_active";
const GdprBanner = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [showBanner, setShowBanner] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [cookiePreferences, setCookiePreferences] = useState({
        necessary: true, // Always true and disabled
        analytics: false,
        marketing: false,
        functional: false,
    });

    useEffect(() => {
        // Delay the check to allow cfCountry to be set from server-side props
        // This prevents a race condition where the banner checks before cfCountry is available
        const checkUserLocation = () => {

            // Only show banner for users from Europe or UK
            const isEuropeanUser = isUserFromEuropeOrUK();

            if (!isEuropeanUser) {
                // For non-European users, automatically accept all cookies/tracking
                // since GDPR doesn't apply to them
                const consent = getCookie(CONSENT_COOKIE_NAME);

                if (!consent) {
                    const allAccepted = {
                        necessary: true,
                        analytics: true,
                        marketing: true,
                        functional: true,

                        timestamp: new Date().toISOString(),
                        autoAccepted: true, // Flag to indicate this was auto-accepted for non-EU users
                    };

                    setCookie(CONSENT_COOKIE_NAME, JSON.stringify(allAccepted), {
                        maxAge: CONSENT_EXPIRY_DAYS * 24 * 60 * 60,
                        sameSite: "lax",
                        secure: process.env.NODE_ENV === "production",
                    });

                    // Enable all tracking services for non-European users
                    enableTrackingServices(allAccepted);
                }

                // Ensure banner is not shown for non-EU users
                setShowBanner(false);
                return; // Don't show banner for non-European users
            }

            // Check if user has already given consent
            const consent = getCookie(CONSENT_COOKIE_NAME);

            if (!consent) {
                // No consent cookie - show banner
                // Check if dismissed in current session
                const dismissedInSession = typeof window !== "undefined" && typeof sessionStorage !== "undefined"
                    ? sessionStorage.getItem("gdpr_dismissed_current_session")
                    : null;

                if (!dismissedInSession) {
                    setShowBanner(true);
                }
            } else {
                // Load existing preferences if available
                try {
                    const existingPreferences = JSON.parse(consent);
                    setCookiePreferences(existingPreferences);

                    // Check if user dismissed without making explicit choice
                    // If so, show banner again on next session
                    if (existingPreferences.dismissed) {
                        // Check if this is a new session
                        const dismissedInSession = typeof window !== "undefined" && typeof sessionStorage !== "undefined"
                            ? sessionStorage.getItem("gdpr_dismissed_current_session")
                            : null;

                        if (!dismissedInSession) {
                            // New session - clear the cookie and show banner again
                            document.cookie = `${CONSENT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                            setShowBanner(true);
                        }
                    }
                } catch (error) {
                    console.error("Error parsing existing cookie preferences:", error);
                }
            }
        };

        // Add a small delay to allow cfCountry to be set from the page's useEffect
        // We wait for up to 500ms, checking every 50ms if cfCountry is available
        let attempts = 0;
        const maxAttempts = 10; // 10 attempts * 50ms = 500ms max wait

        const waitForCfCountry = () => {
            const cfCountry = typeof window !== "undefined" && typeof localStorage !== "undefined"
                ? localStorage.getItem("cfCountry")
                : null;

            // If we have cfCountry or we've tried enough times, proceed with the check
            if (cfCountry || attempts >= maxAttempts) {
                checkUserLocation();
            } else {
                attempts++;
                setTimeout(waitForCfCountry, 50);
            }
        };

        // Start the check after a small initial delay
        setTimeout(waitForCfCountry, 50);

        // Add a global function for development to reset the banner
        if (
            typeof window !== "undefined" &&
            process.env.NODE_ENV === "development"
        ) {
            window.resetGdprBanner = () => {
                document.cookie = `${CONSENT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                localStorage.removeItem(BANNER_DISMISS_STORAGE_KEY);
                sessionStorage.removeItem(SESSION_STORAGE_KEY);
                setShowBanner(true);
            };
        }

        // Add global function to open preferences modal
        if (typeof window !== "undefined") {
            window.openCookiePreferences = () => {
                setShowPreferences(true);
            };
        }

        // Listen for custom events to open preferences
        const handleOpenPreferences = () => {
            setShowPreferences(true);
        };

        if (typeof window !== "undefined") {
            window.addEventListener("openCookiePreferences", handleOpenPreferences);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener(
                    "openCookiePreferences",
                    handleOpenPreferences
                );
            }
        };
    }, []);

    const logConsentPayload = (action, preferences) => {
        const geolocationData = getGeolocationData();
        const payload = {
            necessary: preferences.necessary,
            analytics: preferences.analytics,
            marketing: preferences.marketing,
            functional: preferences.functional,
            country: geolocationData.countryName || "",
        };
        sendConsentToApi(payload);
    };

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

        // Clear dismissal tracking since user made a choice
        if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
            localStorage.removeItem(BANNER_DISMISS_STORAGE_KEY);
        }

        setShowBanner(false);

        // Log consent data
        logConsentPayload("accept_all", allAccepted);

        // Enable all tracking services
        enableTrackingServices(allAccepted);
    };

    const handleManageCookies = () => {
        setShowPreferences(true);
        setShowBanner(false);
    };

    const handlePreferenceChange = (category) => {
        if (category === "necessary") return; // Necessary cookies cannot be disabled

        setCookiePreferences((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const handleSavePreferences = () => {
        const preferences = {
            ...cookiePreferences,
            timestamp: new Date().toISOString(),
        };

        setCookie(CONSENT_COOKIE_NAME, JSON.stringify(preferences), {
            maxAge: CONSENT_EXPIRY_DAYS * 24 * 60 * 60,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        // Clear dismissal tracking since user made a choice
        if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
            localStorage.removeItem(BANNER_DISMISS_STORAGE_KEY);
        }

        setShowBanner(false);
        setShowPreferences(false);

        // Log consent data
        logConsentPayload("custom_preferences", preferences);

        // Enable services based on preferences
        enableTrackingServices(preferences);
    };

    const handleClosePreferences = () => {
        setShowPreferences(false);
        setShowBanner(true); // Show banner again if user cancels
    };

    const handleDeclineAll = () => {
        const declineAllPreferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false,
            timestamp: new Date().toISOString(),
        };

        setCookie(CONSENT_COOKIE_NAME, JSON.stringify(declineAllPreferences), {
            maxAge: CONSENT_EXPIRY_DAYS * 24 * 60 * 60,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        // Clear dismissal tracking since user made a choice
        if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
            localStorage.removeItem(BANNER_DISMISS_STORAGE_KEY);
        }

        setShowBanner(false);
        setShowPreferences(false);

        // Log consent data
        logConsentPayload("decline_all", declineAllPreferences);

        // Enable only necessary services
        enableTrackingServices(declineAllPreferences);
    };

    const cookieCategories = [
        {
            key: "necessary",
            title: "Necessary Cookies",
            description:
                "These cookies are required for our Services and websites to operate and are always on.",
            required: true,
        },
        {
            key: "analytics",
            title: "Analytics Cookies",
            description:
                "Help us understand how you use our site so we can improve it. We use these cookies to identify issues and make your experience smoother.",
            required: false,
        },
        {
            key: "marketing",
            title: "Marketing Cookies",
            description:
                "Allow us to deliver more relevant advertising and measure the effectiveness of our campaigns, while helping us spend less on platforms like Google or Facebook.",
            required: false,
        },
        {
            key: "functional",
            title: "Functional Cookies",
            description:
                "Enhance your experience by remembering your preferences, such as language, region, and customized settings.",
            required: false,
        },
    ];

    const enableTrackingServices = (consent) => {
        // Enable/disable Google Analytics
        if (consent.analytics && typeof window !== "undefined" && window.gtag) {
            window.gtag("consent", "update", {
                analytics_storage: "granted",
            });
        } else if (typeof window !== "undefined" && window.gtag) {
            window.gtag("consent", "update", {
                analytics_storage: "denied",
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied",
            });
        }

        // Enable/disable Marketing cookies (Facebook Pixel, etc.)
        if (consent.marketing && typeof window !== "undefined") {
            if (window.fbq) {
                window.fbq("consent", "grant");
            }
        } else if (typeof window !== "undefined" && window.fbq) {
            window.fbq("consent", "revoke");
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

        // Handle ActiveCampaign tracking
        if (typeof window !== "undefined" && window.vgo) {
            if (consent.marketing) {
                window.vgo("setTrackByDefault", true);
            } else {
                window.vgo("setTrackByDefault", false);
            }
        }

        // If only necessary cookies are allowed, clear tracking cookies
        if (
            consent.necessary &&
            !consent.analytics &&
            !consent.marketing &&
            !consent.functional
        ) {
            setTimeout(() => {
                try {
                    // Clear Google Analytics cookies
                    const gaCookies = document.cookie
                        .split(";")
                        .filter(
                            (cookie) =>
                                cookie.trim().startsWith("_ga") ||
                                cookie.trim().startsWith("_gid") ||
                                cookie.trim().startsWith("_gat")
                        );
                    gaCookies.forEach((cookie) => {
                        const cookieName = cookie.split("=")[0].trim();
                        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
                        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
                    });

                    // Clear Facebook tracking cookies
                    const fbCookies = document.cookie
                        .split(";")
                        .filter(
                            (cookie) =>
                                cookie.trim().startsWith("_fbp") ||
                                cookie.trim().startsWith("_fbc")
                        );
                    fbCookies.forEach((cookie) => {
                        const cookieName = cookie.split("=")[0].trim();
                        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
                        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
                    });
                } catch (error) {
                    console.warn("Error clearing tracking cookies:", error);
                }
            }, 100);
        }

        // Dispatch custom event for other components to listen to
        if (typeof window !== "undefined") {
            window.dispatchEvent(
                new CustomEvent("gdprConsentUpdated", {
                    detail: consent,
                })
            );
        }
    };

    const handleClose = () => {
        // When user closes without selecting, save necessary-only consent
        // but mark it as dismissed so banner reappears on next session
        const necessaryOnly = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false,
            timestamp: new Date().toISOString(),
            dismissed: true, // Flag to indicate user dismissed without explicit choice
        };

        // Save the consent cookie so tracking is properly configured
        setCookie(CONSENT_COOKIE_NAME, JSON.stringify(necessaryOnly), {
            maxAge: CONSENT_EXPIRY_DAYS * 24 * 60 * 60,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        // Mark as dismissed in sessionStorage so banner doesn't keep showing in same session
        // but will clear on next session/visit
        if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
            sessionStorage.setItem("gdpr_dismissed_current_session", "true");
        }

        setShowBanner(false);

        // Log consent data as dismiss action
        logConsentPayload("dismiss_banner", necessaryOnly);

        // Enable only necessary services
        enableTrackingServices(necessaryOnly);
    };

    if (!showBanner && !showPreferences) return null;

    return (
        <>
            {showBanner && (
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
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 2,
                                gap: 2,
                            }}
                        >
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
                                We use cookies
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
                            We and our vendors use cookies and similar technologies that
                            analyze how you use our site to help people help each other, save
                            your preferences, and provide you with meaningful experiences. By
                            continuing to use our site, you consent to the use of these
                            technologies as explained in our{" "}
                            <LinkSpan
                                color={theme.palette.primary.main}
                                target="_blank" // Open in a new tab
                                rel="noopener noreferrer"
                                to="/privacy-policy"
                            >
                                Privacy Notice
                            </LinkSpan>{" "}
                            and{" "}
                            <LinkSpan
                                to="/cookie-policy"
                                rel="noopener noreferrer"
                                target="_blank"
                                color={theme.palette.primary.main}
                            >
                                Cookie Policy
                            </LinkSpan>
                            , and agree to our{" "}
                            <LinkSpan
                                to="/terms-and-conditions"
                                color={theme.palette.primary.main}
                                target="_blank"
                            >
                                Terms of Service.
                            </LinkSpan>
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
                                onClick={handleManageCookies}
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
                                Manage Cookies
                            </Button>
                            {/* 
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
                            </Button> */}
                        </Stack>
                    </Paper>
                </Box>
            )}

            {/* Cookie Preferences Modal */}
            <Dialog
                open={showPreferences}
                onClose={handleClosePreferences}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "20px",
                        p: 2,
                        // Custom scrollbar styling for the entire modal
                        "& *": {
                            "&::-webkit-scrollbar": {
                                width: "4px",
                            },
                            "&::-webkit-scrollbar-track": {
                                background: "transparent",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                background: theme.palette.primary.lightGray,
                                borderRadius: "2px",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                                background: theme.palette.primary.gray,
                            },
                            "&::-webkit-scrollbar-button": {
                                display: "none",
                                height: "0px",
                                width: "0px",
                            },
                            "&::-webkit-scrollbar-button:start:decrement": {
                                display: "none",
                            },
                            "&::-webkit-scrollbar-button:end:increment": {
                                display: "none",
                            },
                            // Firefox scrollbar styling
                            scrollbarWidth: "thin",
                            scrollbarColor: `${theme.palette.primary.lightGray} transparent`,
                        },
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontFamily: "League Spartan, sans-serif",
                        fontSize: "24px",
                        fontWeight: 600,
                        color: theme.palette.primary.dark,
                        pb: 1,
                    }}
                >
                    Cookie Preferences
                    <IconButton
                        onClick={handleClosePreferences}
                        sx={{
                            position: "absolute",
                            right: 16,
                            top: 16,
                            color: theme.palette.primary.gray,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent
                    sx={{
                        // Additional scrollbar styling for DialogContent
                        "&::-webkit-scrollbar": {
                            width: "4px",
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "transparent",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: theme.palette.primary.lightGray,
                            borderRadius: "2px",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                            background: theme.palette.primary.gray,
                        },
                        "&::-webkit-scrollbar-button": {
                            display: "none !important",
                            height: "0px !important",
                            width: "0px !important",
                        },
                        "&::-webkit-scrollbar-button:start:decrement": {
                            display: "none !important",
                        },
                        "&::-webkit-scrollbar-button:end:increment": {
                            display: "none !important",
                        },
                        "&::-webkit-scrollbar-corner": {
                            display: "none",
                        },
                        // Firefox scrollbar styling
                        scrollbarWidth: "thin",
                        scrollbarColor: `${theme.palette.primary.lightGray} transparent`,
                    }}
                >
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
                        Customize your cookie preferences below. You can enable or disable
                        different categories of cookies based on your preferences. Please
                        note that disabling some cookies may affect your website experience.
                    </Typography>

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
                        For more information about how we use cookies and your data, please
                        review our{" "}
                        <LinkSpan
                            color={theme.palette.primary.main}
                            target="_blank" // Open in a new tab
                            rel="noopener noreferrer"
                            to="/privacy-policy"
                        >
                            Privacy Policy
                        </LinkSpan>
                        ,{" "}
                        <LinkSpan
                            to="/cookie-policy"
                            rel="noopener noreferrer"
                            target="_blank"
                            color={theme.palette.primary.main}
                        >
                            Cookie Policy
                        </LinkSpan>
                        , and{" "}
                        <LinkSpan
                            to="/terms-and-conditions"
                            color={theme.palette.primary.main}
                            target="_blank"
                        >
                            Terms and Conditions
                        </LinkSpan>
                        .
                    </Typography>

                    {cookieCategories.map((category, index) => (
                        <Box key={category.key}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    py: 2,
                                }}
                            >
                                <Box sx={{ flex: 1, mr: 2 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontFamily: "League Spartan, sans-serif",
                                            fontSize: "18px",
                                            fontWeight: 600,
                                            color: theme.palette.primary.dark,
                                            mb: 1,
                                        }}
                                    >
                                        {category.title}
                                        {category.required && (
                                            <Typography
                                                component="span"
                                                sx={{
                                                    ml: 1,
                                                    fontSize: "14px",
                                                    color: theme.palette.primary.gray,
                                                    fontWeight: 400,
                                                }}
                                            >
                                                (Required)
                                            </Typography>
                                        )}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: theme.palette.primary.darkGray,
                                            fontFamily: "League Spartan, sans-serif",
                                            fontSize: "14px",
                                            lineHeight: "18px",
                                        }}
                                    >
                                        {category.description}
                                    </Typography>
                                </Box>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={cookiePreferences[category.key]}
                                            onChange={() => handlePreferenceChange(category.key)}
                                            disabled={category.required}
                                            sx={{
                                                "& .MuiSwitch-switchBase.Mui-checked": {
                                                    color: theme.palette.primary.main,
                                                },
                                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                                {
                                                    backgroundColor: theme.palette.primary.main,
                                                },
                                            }}
                                        />
                                    }
                                    label=""
                                    sx={{ m: 0 }}
                                />
                            </Box>
                            {index < cookieCategories.length - 1 && (
                                <Divider sx={{ color: theme.palette.primary.lightGray }} />
                            )}
                        </Box>
                    ))}
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 2 }}>
                    <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                        <Button
                            variant="outlined"
                            onClick={handleDeclineAll}
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
                                flex: 1,
                            }}
                        >
                            Decline All
                        </Button>
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
                                    boxShadow: "0px 8px 24px rgba(99, 99, 230, 0.2)",
                                },
                                flex: 1,
                            }}
                        >
                            Save Preferences
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default GdprBanner;
