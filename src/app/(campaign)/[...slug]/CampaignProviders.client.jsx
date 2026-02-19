"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ThemeProvider } from "@mui/material/styles";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "react-query";

import { theme } from "@/config/customTheme";

// Import all needed slices for campaign functionality
import authSlice from "@/store/slices/authSlice";
import campaignSlice from "@/store/slices/campaignSlice";
import mutateCampaignSlice from "@/store/slices/mutateCampaignSlice";
import metaSlice from "@/store/slices/metaSlice";
import donationSlice from "@/store/slices/donationSlice";
import sellConfigSlice from "@/store/slices/sellConfigSlice";
import mutateAuthSlice from "@/store/slices/mutateAuthSlice";
import statisticsSlice from "@/store/slices/statisticsSlice";
import utmSlice from "@/store/slices/utmSlice";
import donorSlice from "@/store/slices/donorSlice";
import loaderSlice from "@/store/slices/loaderSlice";
import dashboardSlice from "@/store/slices/dashboardSlice";
import donationTableSlice from "@/store/slices/donationTableSlice";
import successDonationSlice from "@/store/slices/successDonationSlice";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const LazyToaster = dynamic(
  () => import("react-hot-toast").then((m) => m.Toaster),
  { ssr: false }
);

// function makeCampaignStore() {
//   return configureStore({
//     reducer: {
//       auth: authSlice,
//       campaign: campaignSlice,
//       mutateCampaign: mutateCampaignSlice,
//       meta: metaSlice,
//       donation: donationSlice,
//       sellConfigs: sellConfigSlice,
//       mutateAuth: mutateAuthSlice,
//       statistics: statisticsSlice,
//       utmParameters: utmSlice,
//       donations: donorSlice,
//       loader: loaderSlice,
//       dashboard: dashboardSlice,
//       donationTable: donationTableSlice,
//       successDonation: successDonationSlice,
//     },
//   });
// }

// Simple QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Simplified providers - matching HomeProviders pattern that works
export default function CampaignProviders({ children }) {
  // const storeRef = useRef(null);
  // if (!storeRef.current) {
  //   storeRef.current = makeCampaignStore();
  // }

  const [showToaster, setShowToaster] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const run = () => setShowToaster(true);
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(run, { timeout: 1500 });
      return () => window.cancelIdleCallback?.(idleId);
    }

    const timeoutId = setTimeout(run, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    // <Provider store={storeRef.current}>
      <GoogleOAuthProvider clientId={clientId}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            {showToaster && <LazyToaster />}
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    // </Provider>
  );
}
