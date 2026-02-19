"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Stack, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { theme } from "@/config/customTheme";

const CookieConsentBanner = styled(Box)(({ theme }) => ({
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
    zIndex: 1300,
    boxShadow: theme.shadows[8],
}));

const CookiePreferencesModal = styled(Box)(({ theme }) => ({
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3),
    maxWidth: 600,
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    zIndex: 1400,
    boxShadow: theme.shadows[24],
}));

const Overlay = styled(Box)({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1300,
});

const CookieManagement = ({ forceShowPreferences = false, onClose = null }) => {
    const [showBanner, setShowBanner] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [cookiePreferences, setCookiePreferences] = useState({
        essential: true, // Always true, cannot be disabled
        analytics: false,
        advertising: false,
        functional: false,
    });

    useEffect(() => {
        // Check if user has already made cookie choices
        const cookieConsent = localStorage.getItem("madinah-cookie-consent");

        if (forceShowPreferences) {
            setShowPreferences(true);
            if (cookieConsent) {
                try {
                    const preferences = JSON.parse(cookieConsent);
                    setCookiePreferences(preferences);
                } catch (error) {
                    console.error("Error parsing cookie preferences:", error);
                }
            }
            return;
        }

        if (!cookieConsent) {
            setShowBanner(true);
        } else {
            try {
                const preferences = JSON.parse(cookieConsent);
                setCookiePreferences(preferences);
            } catch (error) {
                console.error("Error parsing cookie preferences:", error);
                setShowBanner(true);
            }
        }
    }, [forceShowPreferences]);

    const handleAcceptAll = () => {
        const preferences = {
            essential: true,
            analytics: true,
            advertising: true,
            functional: true,
        };
        setCookiePreferences(preferences);
        localStorage.setItem("madinah-cookie-consent", JSON.stringify(preferences));
        setShowBanner(false);
        setShowPreferences(false);
    };

    const handleRejectNonEssential = () => {
        const preferences = {
            essential: true,
            analytics: false,
            advertising: false,
            functional: false,
        };
        setCookiePreferences(preferences);
        localStorage.setItem("madinah-cookie-consent", JSON.stringify(preferences));
        setShowBanner(false);
        setShowPreferences(false);
    };

    const handleSavePreferences = () => {
        localStorage.setItem("madinah-cookie-consent", JSON.stringify(cookiePreferences));
        setShowBanner(false);
        setShowPreferences(false);
        if (onClose) onClose();
    };

    const handlePreferenceChange = (type, value) => {
        if (type === "essential") return; // Essential cookies cannot be disabled
        setCookiePreferences(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const openPreferences = () => {
        setShowPreferences(true);
    };

    if (!showBanner && !showPreferences) {
        return null;
    }

    return (
        <>
            {showPreferences && <Overlay onClick={() => setShowPreferences(false)} />}

            {showBanner && (
                <CookieConsentBanner>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
                        <Box flex={1}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Your Privacy Matters</strong>
                            </Typography>
                            <Typography variant="body2">
                                We and our vendors use cookies and similar technologies that analyze how you use
                                our site to help people help each other, save your preferences, and provide you
                                with meaningful experiences. By continuing to use our site, you consent to the
                                use of these technologies as explained in our Privacy Notice and Cookie Policy.
                            </Typography>
                        </Box>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={openPreferences}
                                sx={{ minWidth: 120 }}
                            >
                                Customize
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={handleRejectNonEssential}
                                sx={{ minWidth: 120 }}
                            >
                                Essentials Only
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={handleAcceptAll}
                                sx={{ minWidth: 120 }}
                            >
                                Accept All
                            </Button>
                        </Stack>
                    </Stack>
                </CookieConsentBanner>
            )}

            {showPreferences && (
                <CookiePreferencesModal>
                    <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                        Cookie Preferences
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 3 }}>
                        We use cookies to provide you with the best possible experience on our website.
                        You can choose which types of cookies to allow below.
                    </Typography>

                    <Stack spacing={3}>
                        {/* Essential Cookies */}
                        <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    Essential Cookies
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Always Active
                                </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                These cookies are necessary for the website to function and cannot be switched off.
                                They are usually only set in response to actions made by you which amount to a
                                request for services.
                            </Typography>
                        </Box>

                        <Divider />

                        {/* Analytics Cookies */}
                        <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    Analytics Cookies
                                </Typography>
                                <Button
                                    variant={cookiePreferences.analytics ? "contained" : "outlined"}
                                    size="small"
                                    onClick={() => handlePreferenceChange("analytics", !cookiePreferences.analytics)}
                                >
                                    {cookiePreferences.analytics ? "Enabled" : "Disabled"}
                                </Button>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Help us understand how you use our site so we can improve it. We use these cookies to identify issues and make your experience smoother.
                            </Typography>
                        </Box>

                        <Divider />

                        {/* Functional Cookies */}
                        <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    Functional Cookies
                                </Typography>
                                <Button
                                    variant={cookiePreferences.functional ? "contained" : "outlined"}
                                    size="small"
                                    onClick={() => handlePreferenceChange("functional", !cookiePreferences.functional)}
                                >
                                    {cookiePreferences.functional ? "Enabled" : "Disabled"}
                                </Button>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Enhance your experience by remembering your preferences, such as language, region, and customized settings.
                            </Typography>
                        </Box>

                        <Divider />

                        {/* Advertising Cookies */}
                        <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    Marketing Cookies
                                </Typography>
                                <Button
                                    variant={cookiePreferences.advertising ? "contained" : "outlined"}
                                    size="small"
                                    onClick={() => handlePreferenceChange("advertising", !cookiePreferences.advertising)}
                                >
                                    {cookiePreferences.advertising ? "Enabled" : "Disabled"}
                                </Button>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Allow us to deliver more relevant advertising and measure the effectiveness of our campaigns, while helping us spend less on platforms like Google or Facebook.
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{ mt: 4 }} justifyContent="flex-end">
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setShowPreferences(false);
                                if (onClose) onClose();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSavePreferences}
                        >
                            Save Preferences
                        </Button>
                    </Stack>
                </CookiePreferencesModal>
            )}
        </>
    );
};

export default CookieManagement;