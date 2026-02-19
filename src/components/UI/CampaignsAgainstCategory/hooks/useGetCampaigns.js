"use client";

import { useEffect, useState } from "react";
import { getYoutubeThumbnail, queryToString } from "@/utils/helpers";
import { getAllCampaigns } from "@/api/get-api-services";
import { useRouter } from "next/navigation";

const useGetCampaigns = (query) => {
  const router = useRouter();
  const [baseData, setBaseData] = useState({
    totalCampaigns: "",
    totalAmount: "",
    totalSupporters: "",
    currency: "$",
  });

  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get cfCountry from localStorage
    const cfCountry =
      typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;

    setLoading(true);
    getAllCampaigns(queryToString(query), 12, 0, cfCountry)
      .then((res) => {
        setError("");
        if (!res?.data?.success) {
          return setError("Something went wrong while fetching campaigns");
        }

        const result = res?.data?.data;
        setBaseData({
          totalCampaigns: result?.categoryCampaigns,
          totalAmount: result?.totalDonations,
          totalSupporters: result?.totalSupporters,
          currency: "$",
        });
        const tempCampaigns = res?.data?.data?.campaigns.map((eachCampaign) => {
          return {
            id: eachCampaign?._id,
            title: eachCampaign?.title,
            image: eachCampaign?.coverImageUrl
              ? eachCampaign?.coverImageUrl
              : getYoutubeThumbnail(eachCampaign?.videoLinks[0]?.url),
            raisedAmount: eachCampaign?.collectedAmount,
            raisedCurrency: eachCampaign?.amountCurrency,
            totalGoal: eachCampaign?.targetAmount,
            urlRedirect: eachCampaign?.randomToken,
            currencySymbol: eachCampaign?.currencySymbol,
            subtitle: eachCampaign?.subTitle,
            recurringDonation: eachCampaign?.isRecurringDonation,
          };
        });
        setCampaigns(tempCampaigns);
      })
      .catch((err) => {
        return setError(err.message);
      })
      .finally(() => {
        return setLoading(false);
      });
  }, [router.query]);
  return {
    baseData,
    campaigns,
    error,
    loading,
  };
};

export default useGetCampaigns;
