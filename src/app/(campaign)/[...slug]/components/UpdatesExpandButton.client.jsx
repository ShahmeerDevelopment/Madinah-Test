"use client";

/**
 * UpdatesExpandButton - Client Component for expand/collapse functionality
 * Only handles the interactive button, content is rendered server-side
 */

import { useState, useCallback } from "react";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { theme } from "@/config/customTheme";

export default function UpdatesExpandButton({
  index,
  bodyLength,
  onToggle,
  isExpanded: initialExpanded = false,
}) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const handleClick = useCallback(() => {
    setIsExpanded((prev) => !prev);
    if (onToggle) onToggle(index, !isExpanded);
  }, [index, isExpanded, onToggle]);

  if (bodyLength <= 900) return null;

  return (
    <ButtonComp
      variant="text"
      onClick={handleClick}
      sx={{
        color: theme.palette.primary.main,
        fontSize: "14px",
        padding: "8px 0",
        fontWeight: 500,
        "&:hover": {
          background: "none",
        },
      }}
    >
      {isExpanded ? "Read less" : "Read more"}
    </ButtonComp>
  );
}
