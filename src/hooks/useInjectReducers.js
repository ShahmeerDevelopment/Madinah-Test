import { useEffect, useState } from "react";
import { useStore } from "react-redux";
import {
  injectDonationSlices,
  injectDashboardSlices,
  injectStatisticsSlices,
  injectCampaignManagementSlices,
  injectMetaSlice,
} from "@/store/store";

/**
 * Hook to inject donation flow slices (donation, sellConfigs, successDonation, meta)
 * Use this on campaign pages with donation functionality
 */
export const useInjectDonationSlices = () => {
  const store = useStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    injectDonationSlices(store).then(() => {
      if (mounted) setIsReady(true);
    });
    return () => {
      mounted = false;
    };
  }, [store]);

  return isReady;
};

/**
 * Hook to inject dashboard slice
 * Use this on the dashboard page
 */
export const useInjectDashboardSlices = () => {
  const store = useStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    injectDashboardSlices(store).then(() => {
      if (mounted) setIsReady(true);
    });
    return () => {
      mounted = false;
    };
  }, [store]);

  return isReady;
};

/**
 * Hook to inject statistics slice
 * Use this on the statistics page
 */
export const useInjectStatisticsSlices = () => {
  const store = useStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    injectStatisticsSlices(store).then(() => {
      if (mounted) setIsReady(true);
    });
    return () => {
      mounted = false;
    };
  }, [store]);

  return isReady;
};

/**
 * Hook to inject campaign management slices (donations, donationTable)
 * Use this on donation stats/management pages
 */
export const useInjectCampaignManagementSlices = () => {
  const store = useStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    injectCampaignManagementSlices(store).then(() => {
      if (mounted) setIsReady(true);
    });
    return () => {
      mounted = false;
    };
  }, [store]);

  return isReady;
};

/**
 * Hook to inject meta slice only (countries/categories)
 * Use this on pages that need meta data but not full donation flow
 */
export const useInjectMetaSlice = () => {
  const store = useStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    injectMetaSlice(store).then(() => {
      if (mounted) setIsReady(true);
    });
    return () => {
      mounted = false;
    };
  }, [store]);

  return isReady;
};
