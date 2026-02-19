"use client";

import { useState, useEffect, useCallback } from "react";
import { getAnnouncements } from "@/api/get-api-services";

export const useAnnouncementsData = (campaignId, initialAnnouncements) => {
  const [expandedAnnouncements, setExpandedAnnouncements] = useState({});
  const [newAnnouncements, setNewAnnouncements] = useState([]);
  const [announcementsOffset, setAnnouncementsOffset] = useState(0);
  const [announcementsLimit] = useState(10);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [totalAnnouncements] = useState(initialAnnouncements?.length || 0);

  const fetchAnnouncements = useCallback(
    async (offset = 0) => {
      if (!campaignId) return;

      try {
        setLoadingAnnouncements(true);
        const res = await getAnnouncements(
          campaignId,
          announcementsLimit,
          offset
        );
        const announcements = res.data.data.announcements;

        if (offset === 0) {
          setNewAnnouncements(announcements);
        } else {
          setNewAnnouncements((prev) => [...prev, ...announcements]);
        }
        setAnnouncementsOffset(offset + announcementsLimit);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoadingAnnouncements(false);
      }
    },
    [campaignId, announcementsLimit]
  );

  const loadMoreAnnouncements = useCallback(() => {
    fetchAnnouncements(announcementsOffset);
  }, [fetchAnnouncements, announcementsOffset]);

  const toggleAnnouncement = useCallback((index) => {
    setExpandedAnnouncements((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return {
    expandedAnnouncements,
    newAnnouncements,
    loadingAnnouncements,
    totalAnnouncements,
    loadMoreAnnouncements,
    toggleAnnouncement,
  };
};
