"use client";

import React, { Suspense } from "react";
import HowItWorks from "@/components/UI/HowItWorks";
import AppLayout from "@/app/AppLayout";

const index = () => {
  return (
    <Suspense>
    <AppLayout withFooter={true} withHeroSection={false}>
      <>
        <HowItWorks />
      </>
    </AppLayout>
    </Suspense>
  );
};

export default index;
