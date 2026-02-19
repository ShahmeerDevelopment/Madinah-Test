"use client";

import { isLoginModalOpen } from "@/store/slices/authSlice";
import {
  campaignStepperIncrementHandler,
  createCampaignHandler,
  isCreateCampaignHandler,
} from "@/store/slices/campaignSlice";
import { formatNumberWithCommas } from "@/utils/helpers";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WrapperLayout } from "./createCampaign.style";
import BackButton from "@/components/atoms/createCampaigns/BackButton";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import PopOver from "@/components/molecules/popOver/PopOver";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import TextFieldWithDropdown from "@/components/molecules/TextFieldWithDropdown";
import { Paragraph } from "@/components/atoms/limitedParagraph/LimitedParagraph.style";
import SubmitButton from "@/components/atoms/createCampaigns/SubmitButton";

const StartingGoalForm = () => {
  const auth = getCookie("token");
  const dispatch = useDispatch();

  const countries = useSelector((state) => state.meta.countries);

  const { startingGoal, currency } = useSelector(
    (state) => state.campaign.campaignValues,
  );

  const [isTouched, setIsTouched] = useState(false);

  const [value, setValue] = useState({
    dropdownValue: null,
    inputValue: startingGoal || "",
    displayValue: startingGoal,
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sync Redux currency to local state when available
  useEffect(() => {
    if (currency && value.dropdownValue !== currency) {
      setValue((prev) => ({
        ...prev,
        dropdownValue: currency,
      }));
    }
  }, [currency]);

  const uniqueCurrencies = Array.from(
    new Map(
      countries.map((eachCountry) => [
        eachCountry.currency.code,
        eachCountry.currency,
      ]),
    ).values(),
  );

  const activeCurrencies = uniqueCurrencies.filter(
    (currency) => currency.isActive === true,
  );

  const isContinueButtonDisabled = !value.inputValue;

  let defaultCurrencyIndex;

  if (currency) {
    // Try to find the index of the specified currency
    defaultCurrencyIndex = activeCurrencies.findIndex(
      (eachCurr) => eachCurr.code === currency,
    );

    if (defaultCurrencyIndex === -1) {
      // If the specified currency is not found, look for "USD"
      defaultCurrencyIndex = activeCurrencies.findIndex(
        (eachCurr) => eachCurr.code === "USD",
      );
    }
  } else {
    // If `currency` is not provided, look for "USD"
    defaultCurrencyIndex = activeCurrencies.findIndex(
      (eachCurr) => eachCurr.code === "USD",
    );
  }

  if (defaultCurrencyIndex === -1) {
    // If "USD" is also not found, default to the first currency (index 0)
    defaultCurrencyIndex = 0;
  }

  const handleNumberInputChange = (e) => {
    const { value: inputVal } = e.target;
    // Remove commas for calculation and storage
    const normalizedValue = inputVal
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");

    const isOnlyZeros = /^0+\.?0*$/.test(normalizedValue);
    const finalValue = isOnlyZeros ? "" : normalizedValue;

    // Update state with raw number and formatted display value
    setValue((prevState) => ({
      ...prevState,
      inputValue: finalValue,
      displayValue: formatNumberWithCommas(normalizedValue),
    }));

    // Dispatch the updated starting goal with current currency - moved outside setValue
    dispatch(
      createCampaignHandler({
        startingGoal: finalValue,
        currency: value.dropdownValue,
      }),
    );
  };

  const handleNext = async () => {
    const payload = {
      startingGoal: value.inputValue,
      currency: value.dropdownValue,
      // draftId: res?.data.data._id,
    };
    dispatch(createCampaignHandler(payload));
    if (auth) {
      // handleNext();
      dispatch(campaignStepperIncrementHandler(1));
      dispatch(isCreateCampaignHandler(false));
    } else {
      dispatch(isLoginModalOpen(true));
    }
  };

  return (
    <WrapperLayout height="542px">
      <BackButton />
      <BoxComponent sx={{ mt: { xs: 3, sm: 5 } }}>
        <BoxComponent
          sx={{
            display: "flex",
            justifyContent: { xs: "space-between", sm: "flex-start" },
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <CampaignHeading>How much would you like to raise?</CampaignHeading>
          <PopOver
            maxWidth={"270px"}
            popoverContent={
              "Define a specific and achievable goal for fundraising in your currency. Donor will see the goal in their local currency. Keep in mind, you can always increase or decrease your goal afterwards."
            }
          />
        </BoxComponent>
        <SubHeading sx={{ mb: 2 }}>Your starting goal</SubHeading>

        <BoxComponent
          sx={{
            width: { xs: "100%", sm: "516px" },
          }}
        >
          <TextFieldWithDropdown
            label="Starting goal*"
            // disabledCurrency
            dropdownArr={activeCurrencies
              .map((currency) => ({
                value: currency.code,
                label: currency.code,
              }))
              .filter((eachCur) => eachCur.value !== "")}
            defaultCurrencyIndex={defaultCurrencyIndex}
            inputFieldProps={{
              type: "text",
              placeholder: "Enter campaign starting goal",
              value: value.displayValue,
              onChange: handleNumberInputChange,
            }}
            maxDigits={10}
            nonNegative
            getValues={(vals) => {
              if (vals.dropdownValue !== value.dropdownValue) {
                setValue((prev) => ({
                  ...prev,
                  dropdownValue: vals.dropdownValue,
                }));
                // Dispatch the updated values when currency changes
                dispatch(
                  createCampaignHandler({
                    startingGoal: value.inputValue,
                    currency: vals.dropdownValue,
                  }),
                );
              }
            }}
            handleBlurTextField={() => setIsTouched(true)}
            error={isTouched && !value.inputValue}
            errorMessage="Required field"
            previousValue={startingGoal}
          />
        </BoxComponent>

        <Paragraph sx={{ mt: 1, mb: { xs: 3, sm: "auto", color: "#A1A1A8" } }}>
          You receive money even if you don’t reach your target goal
        </Paragraph>
      </BoxComponent>
      <SubmitButton
        withSticky
        onClick={() => {
          handleNext();
        }}
        isContinueButtonDisabled={isContinueButtonDisabled}
      />
    </WrapperLayout>
  );
};

StartingGoalForm.propTypes = {};

export default StartingGoalForm;
