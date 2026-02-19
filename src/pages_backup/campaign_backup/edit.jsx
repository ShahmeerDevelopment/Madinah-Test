import MemoizedCampaignDetails from "@/components/UI/CampaignDetail/CampaignDetail";
import Private from "@/Layouts/Private";

const CampaignDetails = () => {
	return <MemoizedCampaignDetails />;
};

CampaignDetails.Layout = Private;

export default CampaignDetails;
