import Private from "@/Layouts/Private";
import CampaignNotificationsUI from "@/components/UI/Notifications/CampaignNotificationsUI";

export async function generateStaticParams() {
  // Return a dummy param to satisfy build-time validation
  // Real routes will be handled at request time
  return [{ campaignId: 'placeholder' }];
}

const CampaignNotifications = async ({ params }) => {
  const { campaignId } = await params;

  if (!campaignId) {
    return <div>Campaign not found</div>;
  }

  return (
    <Private withFooter={true} withSidebar={true}>
      <CampaignNotificationsUI campaignId={campaignId} />
    </Private>
  );
};

export default CampaignNotifications;
