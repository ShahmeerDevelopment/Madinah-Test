/* eslint-disable quotes */
"use client";


import React, { useMemo, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import BasicText from "@/components/advance/BasicText";
import { useCampaignImageOptimization } from "@/hooks/useCriticalImagePreload";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import Button from "@mui/material/Button";
import { theme } from "@/config/customTheme";

const DisplayEditorData = ({ isStory = false, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const contentRef = useRef(null);
  const { isSmallScreen } = useResponsiveScreen();

  // Use the image optimization hook
  useCampaignImageOptimization(content);

  // Check if content height exceeds threshold
  useEffect(() => {
    if (isStory && isSmallScreen && contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const threshold = 400; // Height threshold in pixels
      setShowReadMore(contentHeight > threshold);
    }
  }, [isStory, isSmallScreen, content]);

  // Memoize the processed content to convert img tags to Next.js Image components
  const processedContent = useMemo(() => {
    if (!content) {
      return null;
    }

    // Unescape content if it has been escaped (e.g., from HTML editor)
    let unescapedContent = content
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, '\\');

    // Parse HTML and replace img tags with Next.js Image components
    if (typeof window === "undefined") {
      // Server-side: Use regex to extract image info since DOMParser is not available
      const imgRegex = /<img[^>]+src="([^">]+)"([^>]*)>/g;
      const images = [];
      let match;
      let index = 0;
      let htmlWithPlaceholders = unescapedContent;

      while ((match = imgRegex.exec(unescapedContent)) !== null) {
        const fullTag = match[0];
        const src = match[1];
        const attributes = match[2];

        const altMatch = attributes.match(/alt="([^">]*)"/);
        const widthMatch = attributes.match(/width="([^">]*)"/);
        const heightMatch = attributes.match(/height="([^">]*)"/);
        const classMatch = attributes.match(/class="([^">]*)"/);

        const placeholder = `__IMAGE_PLACEHOLDER_${index}__`;
        htmlWithPlaceholders = htmlWithPlaceholders.replace(fullTag, placeholder);

        images.push({
          placeholder,
          src,
          alt: altMatch ? altMatch[1] : "",
          width: widthMatch ? parseInt(widthMatch[1], 10) : 800,
          height: heightMatch ? parseInt(heightMatch[1], 10) : 600,
          className: classMatch ? classMatch[1] : "",
          priority: index === 0,
          index,
        });
        index++;
      }

      return {
        html: htmlWithPlaceholders,
        images,
      };
    }

    // Client-side: Use DOMParser as before
    const parser = new DOMParser();
    const doc = parser.parseFromString(unescapedContent, "text/html");
    const imgElements = doc.querySelectorAll("img");

    // Create a map of placeholders for images
    const imageReplacements = [];
    imgElements.forEach((img, index) => {
      const src = img.getAttribute("src") || "";
      const alt = img.getAttribute("alt") || "";
      const width = img.getAttribute("width") || "800";
      const height = img.getAttribute("height") || "600";
      const className = img.getAttribute("class") || "";

      const placeholder = `__IMAGE_PLACEHOLDER_${index}__`;
      const parent = img.parentNode;
      const textNode = doc.createTextNode(placeholder);
      parent.replaceChild(textNode, img);

      imageReplacements.push({
        placeholder,
        src,
        alt,
        width: parseInt(width, 10),
        height: parseInt(height, 10),
        className,
        priority: index === 0, // First image gets priority
        index,
      });
    });

    return {
      html: doc.body.innerHTML,
      images: imageReplacements,
    };
  }, [content]);

  // Render content with Next.js Image components
  const renderContent = useMemo(() => {
    if (!processedContent || typeof processedContent === "string") {
      // If it's a string (server-side or no images), wrap it in dangerouslySetInnerHTML
      return processedContent ? (
        <span dangerouslySetInnerHTML={{ __html: processedContent }} />
      ) : null;
    }

    const { html, images } = processedContent;

    if (images.length === 0) {
      // No images, but we still need to render the HTML properly
      return <span dangerouslySetInnerHTML={{ __html: html }} />;
    }

    // Split HTML by image placeholders and interleave with Image components
    const parts = [];
    let remainingHtml = html;

    images.forEach((imageData, index) => {
      const splitIndex = remainingHtml.indexOf(imageData.placeholder);

      if (splitIndex !== -1) {
        // Add HTML before the placeholder
        const beforeHtml = remainingHtml.substring(0, splitIndex);
        if (beforeHtml) {
          parts.push(
            <span
              key={`html-${index}`}
              dangerouslySetInnerHTML={{ __html: beforeHtml }}
            />
          );
        }

        // Add Next.js Image component
        parts.push(
          <span
            key={`img-${index}`}
            className={imageData.className || "display-image-wrapper"}
          >
            <Image
              src={imageData.src}
              alt={imageData.alt}
              width={imageData.width}
              height={imageData.height}
              priority={imageData.priority}
              loading={imageData.priority ? undefined : "lazy"}
              className={imageData.className}
              style={{ maxWidth: "100%", height: "auto", borderRadius: "12px" }}
              unoptimized={
                imageData.src.startsWith("data:") ||
                !imageData.src.startsWith("http")
              }
            />
          </span>
        );

        // Update remaining HTML
        remainingHtml = remainingHtml.substring(
          splitIndex + imageData.placeholder.length
        );
      }
    });

    // Add any remaining HTML
    if (remainingHtml) {
      parts.push(
        <span
          key="html-end"
          dangerouslySetInnerHTML={{ __html: remainingHtml }}
        />
      );
    }

    return parts;
  }, [processedContent]);

  // Early return if no content
  if (!content) {
    return null;
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={contentRef}
        style={{
          minHeight: isStory && isSmallScreen && showReadMore ? "400px" : "auto",
          maxHeight:
            isStory && isSmallScreen && showReadMore && !isExpanded
              ? "400px"
              : "none",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <BasicText
          className={`display-container display-text-editor-container ql-editor`}
          sx={{ ...(isStory ? { wordWrap: "break-word" } : {}) }}
          quillEditor
        >
          {renderContent}
        </BasicText>
      </div>

      {isStory && isSmallScreen && showReadMore && !isExpanded && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "120px",
            background:
              "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 40%, rgba(255, 255, 255, 1) 100%)",
            pointerEvents: "none",
          }}
        />
      )}

      {isStory && isSmallScreen && showReadMore && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: isExpanded ? "10px" : "0",
          }}
        >
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
              color: theme.palette.primary.main,
              padding: "8px 16px",
              position: "relative",
              zIndex: 1,
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            {isExpanded ? "Show Less" : "Read More"}
          </Button>
        </div>
      )}
    </div>
  );
};

DisplayEditorData.propTypes = {
  content: PropTypes.string.isRequired,
  isStory: PropTypes.bool,
};

export default DisplayEditorData;
