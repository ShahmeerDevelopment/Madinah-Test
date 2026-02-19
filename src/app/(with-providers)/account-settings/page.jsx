"use client";

import AppLayout from "@/app/AppLayout";
import AccountSettingsUI from "@/components/UI/AccountSettings";
import { Suspense } from "react";

const AccountSettings = () => {
  return (
    <Suspense>
    <AppLayout withFooter={true} withHeroSection={false}>
      <AccountSettingsUI />
    </AppLayout>
    </Suspense>
  );
};

export default AccountSettings;
