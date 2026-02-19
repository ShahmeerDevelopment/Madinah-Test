"use client";

import React from "react";
import { Button } from "@mui/material";

const CookiePreferencesButton = ({ variant = "text", size = "small", ...props }) => {
    const handleOpenPreferences = () => {
        // Use the global function to open the GDPR banner preferences modal
        if (typeof window !== "undefined" && window.openCookiePreferences) {
            window.openCookiePreferences();
        } else if (typeof window !== "undefined") {
            // Fallback: dispatch custom event
            window.dispatchEvent(new CustomEvent("openCookiePreferences"));
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleOpenPreferences}
            {...props}
        >
            Manage Cookie Preferences
        </Button>
    );
};

export default CookiePreferencesButton;