import DonationsUI from "@/components/UI/CampaignDonationStats";
import Private from "@/Layouts/Private";
import { useInjectCampaignManagementSlices } from "@/hooks/useInjectReducers";

const Donations = () => {
  // Inject campaign management slices (donations, donationTable)
  useInjectCampaignManagementSlices();

  return <DonationsUI />;
};

Donations.Layout = Private;

export default Donations;
