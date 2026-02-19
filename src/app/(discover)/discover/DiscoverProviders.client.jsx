"use client";

import React, { useRef } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ThemeProvider } from "@mui/material/styles";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";

import { theme } from "@/config/customTheme";

// Import all needed slices for discover functionality
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

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function makeDiscoverStore() {
  return configureStore({
    reducer: {
      auth: authSlice,
      campaign: campaignSlice,
      mutateCampaign: mutateCampaignSlice,
      meta: metaSlice,
      donation: donationSlice,
      sellConfigs: sellConfigSlice,
      mutateAuth: mutateAuthSlice,
      statistics: statisticsSlice,
      utmParameters: utmSlice,
      donations: donorSlice,
      loader: loaderSlice,
    },
  });
}

// QueryClient instance for discover page
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * DiscoverProviders - Client component with Redux store and providers
 * Follows the same pattern as CampaignProviders and HomeProviders
 * 
 * Note: Categories and countries are now fetched via server-side cache
 * in discover-cache.server.js and hydrated in DiscoverContent.client.jsx
 */
export default function DiscoverProviders({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeDiscoverStore();
  }

  return (
    <Provider store={storeRef.current}>
      <GoogleOAuthProvider clientId={clientId}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <Toaster />
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}
