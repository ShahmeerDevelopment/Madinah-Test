"use client";

import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import { theme } from "@/config/customTheme";
import StackComponent from "@/components/atoms/StackComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { isRecurringHandler } from "@/store/slices/donationSlice";

const RecurringModal = ({
  onClick = () => {},
  levelAmount,
  recurringPercentage,
  symbol,
  unit,
  packageValues,
  isLevel,
}) => {
  const dispatch = useDispatch();

  let ThirtyFivePercent =
    recurringPercentage && recurringPercentage.length > 0
      ? ((parseFloat(levelAmount, 10) / 100) * recurringPercentage[0]).toFixed(
          2
        )
      : 0;

  let TwentyFivePercent =
    recurringPercentage && recurringPercentage.length > 1
      ? ((parseFloat(levelAmount, 10) / 100) * recurringPercentage[1]).toFixed(
          2
        )
      : 0;
  const recurringHandler = (identifier, prop) => {
    if (prop === "recurring") {
      dispatch(isRecurringHandler(true));
    } else {
      dispatch(isRecurringHandler(false));
    }
    if (identifier === 0) {
      const thirtyFivePercentRecurring = isLevel
        ? packageValues[0]
        : ThirtyFivePercent;
      onClick(thirtyFivePercentRecurring);
    }
    if (identifier === 1) {
      const twentyFivePercentRecurring = isLevel
        ? packageValues[1]
        : TwentyFivePercent;
      onClick(twentyFivePercentRecurring);
    }
    if (identifier === 2) {
      onClick(levelAmount);
    }
  };

  return (
    <div>
      <CampaignHeading marginBottom={1}>
        Become a monthly supporter
      </CampaignHeading>
      <SubHeading1 sx={{ color: theme.palette.primary.gray }}>
        Will you consider becoming one of our valued monthly supporters by
        converting your{" "}
        <span style={{ color: "black", fontWeight: 500 }}>
          {symbol && symbol}
          {parseFloat(levelAmount, 10)?.toFixed(2)} {unit}
        </span>{" "}
        contribution into a monthly donation?
        <br /> Ongoing monthly donations allow us to better focus on our
        mission.
      </SubHeading1>

      <StackComponent
        direction={{ xs: "column", sm: "row" }}
        mt={4}
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <ButtonComp
          onClick={() => recurringHandler(0, "recurring")}
          color={"success"}
          sx={{
            background: "#0CAB72",
            width: { xs: "100%", sm: "219px" },
            padding: "10px 16px 8px 16px",
          }}
        >
          Donate {symbol && symbol}
          {isLevel ? packageValues[0].toFixed(2) : ThirtyFivePercent}
          /month
        </ButtonComp>
        <ButtonComp
          onClick={() => recurringHandler(1, "recurring")}
          sx={{
            width: { xs: "100%", sm: "219px" },
            padding: "10px 16px 8px 16px",
          }}
        >
          Donate {symbol && symbol}
          {isLevel ? packageValues[1].toFixed(2) : TwentyFivePercent}
          /month
        </ButtonComp>
        <ButtonComp
          variant={"outlined"}
          sx={{
            width: { xs: "100%", sm: "219px" },
            padding: "10px 16px 8px 16px",
            color: "black",
          }}
          onClick={() => recurringHandler(2, "oneTimePayment")}
        >
          Keep {symbol && symbol}
          {parseFloat(levelAmount, 10)?.toFixed(2)}
        </ButtonComp>
      </StackComponent>
    </div>
  );
};

RecurringModal.propTypes = {
  onClick: PropTypes.func,
  levelAmount: PropTypes.any,
  recurringPercentage: PropTypes.array,
  symbol: PropTypes.string,
  unit: PropTypes.string,
  multierRates: PropTypes.any,
  packageValues: PropTypes.any,
  isLevel: PropTypes.bool,
};
export default RecurringModal;
