import { Suspense } from "react";
import CampaignChrome from "./CampaignChrome.client";

export default function CampaignLayout({ children }) {
  return (
    <Suspense fallback={null}>
      <CampaignChrome>{children}</CampaignChrome>
    </Suspense>
  );
}
