"use client";

import AboutUsUI from "@/components/UI/AboutUs";
import AppLayout from "@/app/AppLayout";
import { Suspense } from "react";

const AboutUs = () => {
  return (
    <Suspense>
    <AppLayout withFooter={true} withHeroSection={false}>
      <AboutUsUI />
    </AppLayout>
    </Suspense>
  );
};

export default AboutUs;
