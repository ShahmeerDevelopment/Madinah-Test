import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Lazy load the SuccessDonation component
const SuccessDonation = dynamic(
  () =>
    import("@/components/UI/DonationOnCampaign/successDonation/SuccessDonation"),
  {
    loading: () => <div>Loading donation success page...</div>,
    ssr: false, // Success page is post-transaction, no need for SSR
  }
);

const DonationSuccess = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading donation success page...</div>}>
        <SuccessDonation />
      </Suspense>
    </div>
  );
};

export default DonationSuccess;
