import React, { Suspense } from "react";
import DonationSuccessClient from "./DonationSuccessClient";

export async function generateStaticParams() {
  // Return a dummy param to satisfy build-time validation
  // Real routes will be handled at request time
  return [{ campaignId: "placeholder" }];
}

const DonationSuccess = async ({ params }) => {
  const { campaignId } = await params;

  return (
    <Suspense fallback={<div>Loading donation success page...</div>}>
      <DonationSuccessClient />
    </Suspense>
  );
};

export default DonationSuccess;
