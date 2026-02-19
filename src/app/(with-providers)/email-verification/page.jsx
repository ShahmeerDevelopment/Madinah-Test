"use client";

import React, { Suspense } from "react";
import VerifiedEmail from "@/components/UI/Auth/verifiedEmail/VerifiedEmail";
import AppLayout from "@/app/AppLayout";

const index = () => {
  return (
    <Suspense>
    <AppLayout withFooter={true} withHeroSection={false}>
      <VerifiedEmail />
    </AppLayout>
    </Suspense>
  );
};

export default index;
