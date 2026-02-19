"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Switch,
    FormControlLabel,
    Stack,
    Box,
    useTheme,
} from "@mui/material";
import { setCookie } from "cookies-next";
import { useGdprConsent } from "@/hooks/useGdprConsent";

const CONSENT_COOKIE_NAME = "gdpr_consent";
const CONSENT_EXPIRY_DAYS = 365;

const CookiePreferencesDialog = ({ open, onClose }) => {
    const theme = useTheme();
    const { consent } = useGdprConsent();

    const [preferences, setPreferences] = useState({
        necessary: true,
        analytics: consent?.analytics || false,
        marketing: consent?.marketing || false,
        functional: consent?.functional || false,
    });

    const handlePreferenceChange = (category) => (event) => {
        if (category === "necessary") return; // Cannot disable necessary cookies

        setPreferences(prev => ({
            ...prev,
            [category]: event.target.checked,
        }));
    };

    const handleSave = () => {
        const consentData = {
            ...preferences,
            timestamp: new Date().toISOString(),
        };

        setCookie(CONSENT_COOKIE_NAME, JSON.stringify(consentData), {
            maxAge: CONSENT_EXPIRY_DAYS * 24 * 60 * 60,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        // Dispatch custom event for other components to listen to
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("gdprConsentUpdated", {
                detail: consentData
            }));
        }

        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                Cookie Preferences
            </DialogTitle>

            <DialogContent>
                <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.primary }}>
                    Manage your cookie preferences below. You can enable or disable different types of cookies
                    except for necessary cookies which are required for the website to function properly.
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
                                    }}
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Necessary Cookies
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Essential for the website to function properly. These cannot be disabled as they
                                        are required for basic functionality like security, network management, and accessibility.
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
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Analytics Cookies
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Help us understand how visitors interact with our website by collecting and reporting
                                        information anonymously. This helps us improve our services and user experience.
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
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Marketing Cookies
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Used to track visitors across websites for personalized advertising and marketing purposes.
                                        This helps us show you relevant advertisements and measure campaign effectiveness.
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
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Functional Cookies
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Enable enhanced functionality and personalization, such as remembering your preferences,
                                        language settings, and providing personalized content.
                                    </Typography>
                                </Box>
                            }
                        />
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    sx={{
                        bgcolor: theme.palette.primary.main,
                        "&:hover": {
                            bgcolor: theme.palette.primary.dark,
                        },
                    }}
                >
                    Save Preferences
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CookiePreferencesDialog;
