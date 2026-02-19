"use client";

import ResetPassword from "@/components/UI/Auth/resetPassword/ResetPassword";
import React, { Suspense } from "react";

const index = () => {
  return (
    <Suspense>
    <div>
      <ResetPassword />
    </div>
    </Suspense>
  );
};

export default index;
