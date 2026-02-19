"use client";

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { theme } from "../../../config/customTheme";
import { WIDGET_DIMENSIONS } from "../../../config/constant";
import TypographyComp from "../../../components/atoms/typography/TypographyComp";
import ButtonComp from "../../../components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "../../../components/atoms/boxComponent/BoxComponent";
import StackComponent from "../../../components/atoms/StackComponent";
import TextFieldComp from "../../../components/atoms/inputFields/TextFieldComp";
import SelectAbleButton from "../../../components/atoms/selectAbleField/SelectAbleButton";

const CampaignWidget = ({ singleCampaignDetails }) => {
    const [widgetSize, setWidgetSize] = useState("medium");
    const [embedType, setEmbedType] = useState("script"); // "iframe" or "script"
    const [widgetCode, setWidgetCode] = useState("");
    // const [previewWidget, setPreviewWidget] = useState(false);

    const { _id: campaignId, title, randomToken } = singleCampaignDetails;

    // Widget size options
    const widgetSizes = [
        { id: "small", label: "Small", value: "small" },
        { id: "medium", label: "Medium", value: "medium" },
        { id: "large", label: "Large", value: "large" },
    ];

    // Generate widget dimensions based on selected size
    const getWidgetDimensions = (size) => {
        switch (size) {
            case "small":
                return { width: "350px", height: "400px" };
            case "medium":
                return { width: "400px", height: "500px" };
            case "large":
                return { width: "500px", height: "600px" };
            default:
                return {
                    width: WIDGET_DIMENSIONS.width,
                    height: WIDGET_DIMENSIONS.height,
                };
        }
    };

    // Update widget code when size changes
    useEffect(() => {
        const dimensions = getWidgetDimensions(widgetSize);
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

        // Ensure we use the randomToken, not the campaign ID
        if (!randomToken) {
            console.warn(
                "fundraiserCustomUrl (randomToken) is not available in singleCampaignDetails"
            );
            return;
        }

        const widgetUrl = `${baseUrl}/${randomToken}?widget=true&embedded=true&src=widget`;

        // Generate embed code based on selected type
        let code;
        if (embedType === "script") {
            // Script-based embed (recommended)
            code = `<div class="madinah-embed" data-url="${widgetUrl}" data-width="${dimensions.width}" data-height="${dimensions.height}"></div>
<script defer src="${baseUrl}/widget-embed.js"></script>`;
        } else {
            // Traditional iframe embed
            code = `<iframe 
  src="${widgetUrl}" 
  width="${dimensions.width}" 
  height="${dimensions.height}" 
  frameborder="0" 
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
  title="${title} - Campaign Widget">
</iframe>`;
        }

        setWidgetCode(code);
    }, [widgetSize, embedType, campaignId, title, randomToken]);

    // Copy widget code to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(widgetCode);
            toast.success("Widget code copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy: ", err);
            toast.error("Failed to copy widget code");
        }
    };

    const handleSizeClick = (size) => {
        setWidgetSize(size);
    };

    return (
        <BoxComponent>
            <TypographyComp
                align="left"
                sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "20px",
                    color: theme.palette.primary.dark,
                    mb: 2,
                }}
            >
                Embed your campaign on any website with a customizable widget. The
                embedded widget will be fully functional with donation capabilities.
                Choose your preferred embed method: Script Embed (recommended) provides
                better integration and responsive behavior, while iFrame Embed offers
                maximum compatibility.
            </TypographyComp>{" "}
            {!randomToken ? (
                <TypographyComp
                    align="left"
                    sx={{
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px",
                        color: theme.palette.error.main,
                        mb: 2,
                        p: 2,
                        backgroundColor: "#ffebee",
                        borderRadius: "4px",
                    }}
                >
                    Widget is not available. Campaign URL (randomToken) is missing. Please
                    contact support.
                </TypographyComp>
            ) : (
                <BoxComponent>
                    {/* Widget Size Selection */}
                    <TypographyComp
                        align="left"
                        sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            lineHeight: "16px",
                            color: theme.palette.primary.dark,
                            mb: 1,
                        }}
                    >
                        Widget Size
                    </TypographyComp>
                    <BoxComponent sx={{ display: "flex", gap: 1, mb: 3 }}>
                        {widgetSizes.map((size) => (
                            <SelectAbleButton
                                key={size.id}
                                isActive={widgetSize === size.value}
                                onClick={() => handleSizeClick(size.value)}
                                title={`${size.label}`}
                                height="40px"
                                padding="8px 16px"
                                fontSize="14px"
                                lineHeight="16px"
                                isGray={true}
                            />
                        ))}
                    </BoxComponent>

                    {/* Embed Type Selection */}
                    <TypographyComp
                        align="left"
                        sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            lineHeight: "16px",
                            color: theme.palette.primary.dark,
                            mb: 1,
                        }}
                    >
                        Embed Type
                    </TypographyComp>
                    <BoxComponent sx={{ display: "flex", gap: 1, mb: 3 }}>
                        <SelectAbleButton
                            isActive={embedType === "script"}
                            onClick={() => setEmbedType("script")}
                            title="Script Embed (Recommended)"
                            height="40px"
                            padding="8px 16px"
                            fontSize="14px"
                            lineHeight="16px"
                            isGray={true}
                        />
                        <SelectAbleButton
                            isActive={embedType === "iframe"}
                            onClick={() => setEmbedType("iframe")}
                            title="iFrame Embed"
                            height="40px"
                            padding="8px 16px"
                            fontSize="14px"
                            lineHeight="16px"
                            isGray={true}
                        />
                    </BoxComponent>

                    {/* Widget Code */}
                    <TypographyComp
                        align="left"
                        sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            lineHeight: "16px",
                            color: theme.palette.primary.dark,
                            mb: 1,
                        }}
                    >
                        Embed Code
                    </TypographyComp>
                    <TextFieldComp
                        multiline
                        rows={6}
                        value={widgetCode}
                        placeholder="Widget code will appear here..."
                        fullWidth
                        InputProps={{
                            readOnly: true,
                            style: {
                                fontFamily: "monospace",
                                fontSize: "12px",
                                backgroundColor: "#f5f5f5",
                            },
                        }}
                        sx={{ mb: 2 }}
                    />

                    {/* Action Buttons */}
                    <StackComponent direction="row" spacing={2} sx={{ mb: 3 }}>
                        <ButtonComp
                            variant="contained"
                            size="normal"
                            onClick={copyToClipboard}
                            sx={{
                                borderRadius: "25px",
                                minWidth: "120px",
                            }}
                        >
                            Copy Code
                        </ButtonComp>
                        {/* <ButtonComp
                            variant="outlined"
                            size="normal"
                            onClick={togglePreview}
                            sx={{
                                borderRadius: "25px",
                                minWidth: "120px",
                            }}
                        >
                            {previewWidget ? "Hide Preview" : "Preview Widget"}
                        </ButtonComp> */}
                    </StackComponent>
                </BoxComponent>
            )}
        </BoxComponent>
    );
};

CampaignWidget.propTypes = {
    singleCampaignDetails: PropTypes.object.isRequired,
};

export default CampaignWidget;
