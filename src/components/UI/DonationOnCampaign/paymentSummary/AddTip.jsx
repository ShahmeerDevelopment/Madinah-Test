"use client";

import React, { memo } from "react";
import PropTypes from "prop-types";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import SelectAbleButton from "@/components/atoms/selectAbleField/SelectAbleButton";
import StackComponent from "@/components/atoms/StackComponent";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import InputAdornment from "@mui/material/InputAdornment";
import { formatNumberWithCommas } from "@/utils/helpers";
import { useDispatch } from "react-redux";
import { selectedTipReduxHandler } from "@/store/slices/donationSlice";

// Next
const AddTip = memo(
  ({
    selectedTip,
    setSelectedTip,
    amount = 0,
    customTipValue,
    setCustomTipValue,
    currencySymbol,
  }) => {
    const { isSmallScreen } = useResponsiveScreen();
    const dispatch = useDispatch();
    const FivePercent = (0.05 * amount).toFixed(2);
    const TenPercent = (0.1 * amount).toFixed(2);
    const FifteenPercent = (0.15 * amount).toFixed(2);
    const TwentyPercent = (0.2 * amount).toFixed(2);
    const TwentyFivePercent = (0.25 * amount).toFixed(2);

    const customTipHandler = (e) => {
      const value = e.target.value;
      const numericValue = parseFloat(value);
      // Update state only if the value is non-negative
      if (numericValue >= 0) {
        setCustomTipValue(numericValue);
      }
    };
    return (
      <BoxComponent
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          my: 2,
        }}
      >
        <SelectAbleButton
          isBoxShadow={true}
          isActive={selectedTip === 0}
          onClick={() => {
            setSelectedTip(0);
            dispatch(selectedTipReduxHandler(0));
          }}
          title={`5% (${currencySymbol}${formatNumberWithCommas(FivePercent)})`}
          isBackground={true}
          padding={isSmallScreen ? "0px 14px 0px 22px" : "0px 24px 0px 24px"}
          sx={{ minWidth: isSmallScreen ? "115px" : "124px" }}
        />
        <SelectAbleButton
          isBoxShadow={true}
          isActive={selectedTip === 1}
          onClick={() => {
            setSelectedTip(1);
            dispatch(selectedTipReduxHandler(1));
          }}
          title={`10% (${currencySymbol}${formatNumberWithCommas(TenPercent)})`}
          padding={isSmallScreen ? "0px 14px 0px 22px" : "0px 24px 0px 24px"}
          sx={{ minWidth: isSmallScreen ? "115px" : "124px" }}
          isBackground={true}
        />
        <SelectAbleButton
          isBoxShadow={true}
          isActive={selectedTip === 2}
          onClick={() => {
            setSelectedTip(2);
            dispatch(selectedTipReduxHandler(2));
          }}
          title={`15% (${currencySymbol}${formatNumberWithCommas(
            FifteenPercent
          )})`}
          isBackground={true}
          padding={isSmallScreen ? "0px 14px 0px 22px" : "0px 24px 0px 24px"}
          sx={{ minWidth: isSmallScreen ? "115px" : "124px" }}
        />
        <SelectAbleButton
          isBoxShadow={true}
          isActive={selectedTip === 3}
          onClick={() => {
            setSelectedTip(3);
            dispatch(selectedTipReduxHandler(3));
          }}
          title={`20% (${currencySymbol}${formatNumberWithCommas(
            TwentyPercent
          )})`}
          isBackground={true}
          padding={isSmallScreen ? "0px 14px 0px 22px" : "0px 24px 0px 24px"}
          sx={{ minWidth: isSmallScreen ? "115px" : "124px" }}
        />
        <SelectAbleButton
          isBoxShadow={true}
          isActive={selectedTip === 4}
          onClick={() => {
            setSelectedTip(4);
            dispatch(selectedTipReduxHandler(4));
          }}
          title={`25% (${currencySymbol}${formatNumberWithCommas(
            TwentyFivePercent
          )})`}
          isBackground={true}
          padding={isSmallScreen ? "0px 14px 0px 22px" : "0px 24px 0px 24px"}
          sx={{ minWidth: isSmallScreen ? "115px" : "124px" }}
        />
        <StackComponent spacing={2} sx={{ height: "40px" }}>
          <SelectAbleButton
            isBoxShadow={true}
            isActive={selectedTip === 5}
            onClick={() => {
              setSelectedTip(5);
              dispatch(selectedTipReduxHandler(5));
            }}
            title="Enter Custom tip"
            isBackground={true}
            padding={"0px 24px 0px 24px"}
            sx={{ minWidth: "173px" }}
          />
          {selectedTip === 5 ? (
            <TextFieldComp
              onChange={customTipHandler}
              value={customTipValue}
              placeholder={"Enter custom tip"}
              type="number"
              onWheel={(e) => e.target.blur()}
              customHelperText={""}
              name="customTip"
              onBlur={""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {currencySymbol}
                  </InputAdornment>
                ),
              }}
            />
          ) : null}
        </StackComponent>
      </BoxComponent>
    );
  }
);

AddTip.propTypes = {
  amount: PropTypes.number,
  selectedTip: PropTypes.number,
  setSelectedTip: PropTypes.func,
  customTipValue: PropTypes.any,
  setCustomTipValue: PropTypes.func,
  currencySymbol: PropTypes.string,
};

AddTip.displayName = "AddTip";
export default AddTip;
