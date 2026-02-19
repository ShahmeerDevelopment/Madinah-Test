"use client";

import AppLayout from "@/app/AppLayout";
import CookiePolicy from "@/components/UI/CookiePolicy";
import { Suspense } from "react";

const CookiePolicyPage = () => {
  return (
    <Suspense>
    <AppLayout withFooter={true} withHeroSection={false}>
      <CookiePolicy />
    </AppLayout>
    </Suspense>
  );
};

export default CookiePolicyPage;
