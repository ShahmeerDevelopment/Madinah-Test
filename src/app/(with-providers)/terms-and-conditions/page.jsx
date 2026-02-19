"use client";

import AppLayout from "@/app/AppLayout";
import TermsAndConditionsUI from "@/components/UI/TermsAndConditions";
import { Suspense } from "react";

const TermsAndConditions = () => {
  return (
    <Suspense>
    <AppLayout withFooter={true} withHeroSection={false}>
      <TermsAndConditionsUI />
    </AppLayout>
    </Suspense>
  );
};

export default TermsAndConditions;
