"use client";

import React, { useRef } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ThemeProvider } from "@mui/material/styles";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { theme } from "@/config/customTheme";

// Minimal reducers needed for homepage chrome interactions
import authSlice from "@/store/slices/authSlice";
import campaignSlice from "@/store/slices/campaignSlice";
import mutateCampaignSlice from "@/store/slices/mutateCampaignSlice";
import mutateAuthSlice from "@/store/slices/mutateAuthSlice";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function makeHomeStore() {
  return configureStore({
    reducer: {
      auth: authSlice,
      campaign: campaignSlice,
      mutateCampaign: mutateCampaignSlice,
      mutateAuth: mutateAuthSlice,
    },
  });
}

export default function HomeProviders({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeHomeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <GoogleOAuthProvider clientId={clientId}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}
