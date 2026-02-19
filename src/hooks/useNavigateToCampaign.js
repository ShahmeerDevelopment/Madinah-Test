import { useRouter } from "next/navigation";
import { startTransition } from "react";

const useNavigateToCampaign = () => {
  const router = useRouter();
  const viewCampaign = (randomToken) => {
    startTransition(() => {
      router.push(`/${randomToken}?src=internal_website`);
    });
  };

  return viewCampaign;
};

export default useNavigateToCampaign;
