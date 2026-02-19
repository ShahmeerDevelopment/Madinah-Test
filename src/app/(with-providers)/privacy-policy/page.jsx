"use client";

import AppLayout from "@/app/AppLayout";
import PrivacyPolicyUI from "@/components/UI/PrivacyPolicy";
import { Suspense } from "react";

const PrivacyPolicy = () => {
  return (
    <Suspense>
    <AppLayout withFooter={true} withHeroSection={false}>
      <PrivacyPolicyUI />
    </AppLayout>
    </Suspense>
  );
};

export default PrivacyPolicy;
