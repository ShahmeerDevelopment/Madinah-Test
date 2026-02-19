import React from "react";
import BoxComponent from "../../../../../components/atoms/boxComponent/BoxComponent";
import AddUpsells from "../addUpsells/AddUpsells";
import AddDownSells from "../addDownsells/AddDownSells";
import AddOrderBump from "../addOrderBump/AddOrderBump";
import { useSelector } from "react-redux";
import useUpSellSubmission from "../../../../../hooks/useUpSellSubmission";

const UpSellAndDownSellForm = () => {
  const id = useSelector((state) => state.mutateCampaign.id);
  const { allowRecurringDonations, allowOneTimeDonations } = useSelector(
    (state) => state.mutateCampaign,
  );

  const {
    submitUpSellData,
    isLoadingUpsell,
    isLoadingDownsell,
    isLoadingOrderBump,
  } = useUpSellSubmission();
  return (
    <BoxComponent sx={{ padding: { xs: "16px", sm: "0px" } }}>
      <AddUpsells
        id={id}
        isLoading={isLoadingUpsell}
        submitUpSellData={submitUpSellData}
        allowRecurringDonations={allowRecurringDonations}
        allowOneTimeDonations={allowOneTimeDonations}
      />
      <AddDownSells
        id={id}
        isLoading={isLoadingDownsell}
        submitUpSellData={submitUpSellData}
        allowRecurringDonations={allowRecurringDonations}
        allowOneTimeDonations={allowOneTimeDonations}
      />
      <AddOrderBump
        id={id}
        isLoading={isLoadingOrderBump}
        submitUpSellData={submitUpSellData}
      />
    </BoxComponent>
  );
};

export default UpSellAndDownSellForm;
