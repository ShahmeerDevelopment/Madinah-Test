/* eslint-disable no-mixed-spaces-and-tabs */
// useUpSellSubmission.js
import { useState } from "react";
import { postUpSellData } from "../api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addUpSellLevel } from "../store/slices/mutateCampaignSlice";

const useUpSellSubmission = () => {
  const dispatch = useDispatch();
  const [isLoadingUpsell, setIsLoadingUpsell] = useState(false);
  const [isLoadingDownsell, setIsLoadingDownsell] = useState(false);
  const [isLoadingOrderBump, setIsLoadingOrderBump] = useState(false);
  const [error, setError] = useState(null);

  const setLoading = (type, value) => {
    switch (type) {
      case "upSell":
        setIsLoadingUpsell(value);
        break;
      case "downSell":
        setIsLoadingDownsell(value);
        break;
      case "orderBump":
        setIsLoadingOrderBump(value);
        break;
      default:
        console.error("Unknown type", type);
    }
  };

  const submitUpSellData = async (
    value,
    amount,
    id,
    type,
    imageOrVideoUrl,
    donationOption,
    specialDays,
    specialDaysEndDate
  ) => {
    setLoading(type, true);
    setError(null);

    let isRecurring;
    if (type !== "orderBump") {
      isRecurring = donationOption === "recurringDonation" ? true : false;
    }

    const formatDateForAPI = (date) => {
      console.log("Data", date);
      if (!date) return null;
      try {
        // Check if it's a Day.js object
        if (date.$isDayjsObject) {
          // Use Day.js format method
          return date.format("YYYY-MM-DD");
        }

        // Check if it's a native Date object
        if (date instanceof Date && !isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }

        console.warn("Invalid date provided to formatDateForAPI:", date);
        return null;
      } catch (error) {
        console.warn("Error formatting date for API:", error);
        return null;
      }
    };

    try {
      const payload = {
        title: value.title,
        subTitle: value.subTitle,
        description: value.description,
        imageUrl: imageOrVideoUrl,
        amount: amount.amount === "" ? 0 : Number(amount.amount),
        type: type,
        yesButtonText: value.yesButtonText,
        noButtonText: value.noButtonText,
        isRecurring: isRecurring,
        recurringType:
          donationOption === "oneTimeDonation" ? null : specialDays,
        recurringEndDate:
          donationOption === "oneTimeDonation"
            ? null
            : formatDateForAPI(specialDaysEndDate),
      };
      if (type === "orderBump") {
        delete payload.imageUrl;
        delete payload.yesButtonText;
        delete payload.noButtonText;
        delete payload.isRecurring;
        delete payload.recurringType;
        delete payload.recurringEndDate;
      }
      const res = await postUpSellData(id, payload);
      if (res.data.message === "Success" && res.data.success === true) {
        const successMessage =
          type === "orderBump"
            ? "Donation bump added successfully"
            : `${
                type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
              } added successfully`;
        window.scrollTo(0, 0);
        toast.success(successMessage);
        dispatch(addUpSellLevel(res.data.data.sellConfigs));
        setLoading(type, false);
        return res;
      }
      toast.error(res.data.message);
      setLoading(type, false);
    } catch (error) {
      console.error("error", error);
      setError(error);
      setLoading(type, false);
      throw error;
    }
  };

  return {
    submitUpSellData,
    isLoadingUpsell,
    isLoadingDownsell,
    isLoadingOrderBump,
    error,
  };
};

export default useUpSellSubmission;
