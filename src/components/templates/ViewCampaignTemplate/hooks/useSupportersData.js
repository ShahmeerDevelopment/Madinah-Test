"use client";

import { useState, useCallback } from "react";
import { getRecentSupporters } from "@/api/get-api-services";

export const useSupportersData = (
  initialSupporters,
  randomToken,
  previewMode
) => {
  const [supporters, setSupporters] = useState(initialSupporters);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(initialSupporters?.length || 0);
  const [limit, setLimit] = useState(6);
  const [noSupporters, setNoSupporters] = useState(false);

  const handleViewMoreClick = useCallback(async () => {
    if (previewMode || isLoading) return;

    setIsLoading(true);

    try {
      const response = await getRecentSupporters(randomToken, limit, offset);
      const newSupporters = response?.data?.data?.recentSupporters || [];

      // If we received fewer supporters than requested, or no supporters at all,
      // it means there are no more supporters to load
      if (newSupporters.length === 0 || newSupporters.length < limit) {
        setNoSupporters(true);
      }

      setSupporters((prevSupporters) => [...prevSupporters, ...newSupporters]);
      setOffset((prevOffset) => prevOffset + newSupporters.length);
    } catch (err) {
      console.error("Error loading more supporters:", err);
    } finally {
      setIsLoading(false);
    }
    setLimit(10);
  }, [randomToken, limit, offset, previewMode, isLoading]);

  return {
    supporters,
    isLoading,
    noSupporters,
    handleViewMoreClick,
  };
};
