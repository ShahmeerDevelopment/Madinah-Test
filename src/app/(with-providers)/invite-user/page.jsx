"use client";

import AppLayout from "@/app/AppLayout";
import InviteUserUI from "@/components/UI/InviteUserUI";
import { Suspense } from "react";

const InviteUser = () => {
  return (
    <Suspense>
    <AppLayout withFooter={true} withHeroSection={false}>
      <InviteUserUI />
    </AppLayout>
    </Suspense>
  );
};

export default InviteUser;
