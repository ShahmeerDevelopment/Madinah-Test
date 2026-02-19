"use client";

import AppLayout from "@/app/AppLayout";
import GuestUser from "@/components/UI/Auth/guestUser/GuestUser";
import React, { Suspense } from "react";

const index = () => {
  return (
    <Suspense>
    <AppLayout withFooter={true} withHeroSection={false}>
      <GuestUser />
    </AppLayout>
    </Suspense>
  );
};

export default index;
