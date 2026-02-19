import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Private from "@/Layouts/Private";
import CampaignNotificationsUI from "@/components/UI/Notifications/CampaignNotificationsUI";

const CampaignNotifications = () => {
  const router = useRouter();
  const { campaignId } = router.query;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (router.isReady && campaignId) {
      setIsReady(true);
    }
  }, [router.isReady, campaignId]);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return <CampaignNotificationsUI campaignId={campaignId} />;
};

CampaignNotifications.Layout = Private;

export default CampaignNotifications;
