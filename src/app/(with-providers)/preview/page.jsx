/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, {Suspense } from "react";

import PreviewUI from "@/components/UI/Preview";

const PreviewCampaign = () => {


  return (
    <Suspense>
      <PreviewUI/>
    </Suspense>
  );
};

export default PreviewCampaign;
