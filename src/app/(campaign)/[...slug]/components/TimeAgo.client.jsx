"use client";

import { useState, useEffect } from "react";
import TypographyComp from "@/components/atoms/typography/TypographyComp";

/**
 * TimeAgo - Client Component for dynamic time ago display
 *
 * This component calculates and displays relative time (e.g., "2 days ago")
 * on the client side, updating in real-time as time passes.
 *
 * @param {string} dateString - ISO date string to calculate time from
 */
export default function TimeAgo({ dateString, sx }) {
  const [timeAgo, setTimeAgo] = useState("...");

  useEffect(() => {
    function calculateTimeAgo() {
      if (!dateString) return "Recently";

      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);

      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
      };

      for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
          return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
        }
      }
      return "Just now";
    }

    // Calculate immediately on mount
    setTimeAgo(calculateTimeAgo());

    // Update every minute to keep it fresh
    const intervalId = setInterval(() => {
      setTimeAgo(calculateTimeAgo());
    }, 60000); // 60 seconds

    return () => clearInterval(intervalId);
  }, [dateString]);

  return (
    <TypographyComp
      sx={{
        color: "rgba(161, 161, 168, 1)",
        fontSize: "14px",
        fontWeight: 400,
        ...sx,
      }}
    >
      {timeAgo}
    </TypographyComp>
  );
}
