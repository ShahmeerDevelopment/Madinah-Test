"use client";

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import FullWidthInputWithLength from "../../../../../components/advance/FullWidthInputWithLength";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  updateAllowOneTimeDonations,
  updateCurrency,
  updateCurrencySymbol,
  updateCustomDonationHandler,
  updateFundraiserCustomUrl,
  updateInitialGoal,
  updateLocation_zipCode,
  updateStartingAmount,
  updateStory,
  updateSubTitle,
  updateTaxDeductAble,
  updateTitle,
  updateZakatEligible,
  updateAllowRecurringDonations,
  minimumDonationValueHandler,
  updateAllowCampaignTimelineHandler,
  updateCampaignTimelineHandler,
  updateIsCommentAllowed,
  updateCommentBoxHeading,
  updatePromoteRecurringDonations,
} from "../../../../../store/slices/mutateCampaignSlice";
import DisplayEditorData from "../../../../../components/atoms/displayEditorData/DisplayEditorData";
import ModalComponent from "../../../../../components/molecules/modal/ModalComponent";
import EditorModal from "../EditorModal";
import EditCampaignHeading from "../../../../../components/advance/EditCampaignHeading";
import TitleWithSwitch from "../../../../../components/advance/TitleWithSwitch";
import TextFieldWithDropdown from "../../../../../components/molecules/TextFieldWithDropdown";
import { RANDOM_URL } from "../../../../../config/constant";
import ShowMoreComponent from "../../../../../components/atoms/ShowMoreComponent";
import TextFieldComp from "../../../../../components/atoms/inputFields/TextFieldComp";
import { formatNumberWithCommas } from "../../../../../utils/helpers";
import DeleteModals from "../../../../../components/molecules/deleteModals/DeleteModals";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import DatePickerComp from "@/components/molecules/datePicker/DatePickerComp";
import dayjs from "dayjs";

export const TitleField = ({ isSubmittionAttempted }) => {
  const title = useSelector((state) => state.mutateCampaign.title);
  const dispatch = useDispatch();

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
      }}
      label={"Fundraiser title"}
      placeholder={"Enter fundraiser title"}
      name="title"
      helperText={
        title.length < 10 && title.length > 0 ? (
          <p style={{ color: "red" }}>Minimum 10 characters</p>
        ) : (
          ""
        )
      }
      adornmentChildren={
        <>
          <span
            style={{
              color:
                title.length < 10 || title.length > 100 ? "red" : "#A1A1A8",
            }}
          >
            {title.length}
          </span>
          <span style={{ color: "#606062" }}>/100</span>
        </>
      }
      value={title}
      onChange={(e) => {
        dispatch(updateTitle(e.target.value));
      }}
      error={isSubmittionAttempted && title.length < 10}
      onBlur={() => {}}
    />
  );
};
TitleField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};

export const SubTitleField = ({ isSubmittionAttempted }) => {
  const subTitle = useSelector((state) => state.mutateCampaign.subTitle);

  const dispatch = useDispatch();
  return (
    <FullWidthInputWithLength
      label={"Fundraiser subtitle"}
      placeholder={"Enter fundraiser sub-title"}
      name="subTitle"
      helperText={
        subTitle.length < 10 && subTitle.length > 0 ? (
          <p style={{ color: "red" }}>Minimum 10 characters</p>
        ) : (
          ""
        )
      }
      subtitleField
      adornmentChildren={
        <>
          <span
            style={{
              color:
                (subTitle.length < 10 && subTitle.length > 0) ||
                subTitle.length > 200
                  ? "red"
                  : "#A1A1A8",
            }}
          >
            {subTitle.length}
          </span>
          <span style={{ color: "#606062" }}>/200</span>
        </>
      }
      value={subTitle}
      error={
        isSubmittionAttempted && subTitle.length < 10 && subTitle.length > 0
      }
      onChange={(e) => {
        dispatch(updateSubTitle(e.target.value));
      }}
      onBlur={() => {}}
    />
  );
};
SubTitleField.propTypes = {
  isSubmittionAttempted: PropTypes.any,
};

export const InitialGoalField = () => {
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.mutateCampaign.currency);
  const initialGoal = useSelector((state) => state.mutateCampaign.initialGoal);
  const countries = useSelector((state) => state.meta.countries);
  const [value, setValue] = useState({
    dropdownValue: null,
    inputValue: "",
    displayValue: initialGoal,
    symbol: "",
  });

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

  let defaultCurrencyIndex;

  // First, try to find the index of the specified currency
  if (currency) {
    defaultCurrencyIndex = activeCurrencies.findIndex(
      (eachCurr) => eachCurr.code === currency,
    );
  }

  // If the specified currency is not found (-1), or if `currency` is not provided, look for "USD"
  if (defaultCurrencyIndex === -1 || defaultCurrencyIndex === undefined) {
    defaultCurrencyIndex = activeCurrencies.findIndex(
      (eachCurr) => eachCurr.code === "USD",
    );
  }

  // If "USD" is also not found, you might default to the first currency or another default action
  if (defaultCurrencyIndex === -1) {
    defaultCurrencyIndex = 0; // or handle accordingly
  }

  const handleNumberInputChange = (e) => {
    const { value } = e.target;
    // Remove commas for calculation and storage
    const normalizedValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
    const isOnlyZeros = /^0+\.?0*$/.test(normalizedValue);
    dispatch(updateInitialGoal(normalizedValue));
    // Update state with raw number and formatted display value

    setValue((prevState) => ({
      ...prevState,
      inputValue: isOnlyZeros ? "" : normalizedValue,
      displayValue: formatNumberWithCommas(normalizedValue),
    }));
  };

  // Initialize dropdownValue with the currency from Redux to prevent infinite loops
  useEffect(() => {
    if (currency && value.dropdownValue !== currency) {
      setValue((prevState) => ({
        ...prevState,
        dropdownValue: currency,
      }));
    }
  }, [currency]);

  useEffect(() => {
    let stringGoal = initialGoal.toString();
    const normalizedValue = stringGoal
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
    setValue((prevState) => ({
      ...prevState,
      displayValue: formatNumberWithCommas(normalizedValue),
    }));
  }, [initialGoal]);

  return (
    <>
      <TextFieldWithDropdown
        label="Goal Amount"
        dropdownArr={activeCurrencies
          .map((currency) => ({
            value: currency.code,
            label: currency.code,
            symbol: currency.symbol,
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
            dispatch(updateCurrency(vals.dropdownValue));
            dispatch(updateCurrencySymbol(vals.symbol));
          }
        }}
        errorMessage="Required field"
        previousValue={initialGoal}
        error={!initialGoal}
      />
    </>
  );
};

export const StartingAmountField = () => {
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.mutateCampaign.currency);
  const startingAmount = useSelector(
    (state) => state.mutateCampaign?.startingAmount,
  );
  const countries = useSelector((state) => state.meta.countries);
  const [value, setValue] = useState({
    dropdownValue: null,
    inputValue: "",
    displayValue: startingAmount,
    symbol: "",
  });

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

  let defaultCurrencyIndex;

  // First, try to find the index of the specified currency
  if (currency) {
    defaultCurrencyIndex = activeCurrencies.findIndex(
      (eachCurr) => eachCurr.code === currency,
    );
  }

  // If the specified currency is not found (-1), or if `currency` is not provided, look for "USD"
  if (defaultCurrencyIndex === -1 || defaultCurrencyIndex === undefined) {
    defaultCurrencyIndex = activeCurrencies.findIndex(
      (eachCurr) => eachCurr.code === "USD",
    );
  }

  // If "USD" is also not found, you might default to the first currency or another default action
  if (defaultCurrencyIndex === -1) {
    defaultCurrencyIndex = 0; // or handle accordingly
  }

  const handleNumberInputChange = (e) => {
    const { value } = e.target;
    // Remove commas for calculation and storage
    const normalizedValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
    const isOnlyZeros = /^0+\.?0*$/.test(normalizedValue);
    dispatch(updateStartingAmount(normalizedValue));
    // Update state with raw number and formatted display value

    setValue((prevState) => ({
      ...prevState,
      inputValue: isOnlyZeros ? "" : normalizedValue,
      displayValue: formatNumberWithCommas(normalizedValue),
    }));
  };

  useEffect(() => {
    let stringGoal = startingAmount?.toString();
    const normalizedValue = stringGoal
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
    setValue((prevState) => ({
      ...prevState,
      displayValue: formatNumberWithCommas(normalizedValue),
    }));
  }, [startingAmount]);

  return (
    <>
      <TextFieldWithDropdown
        label="Starting Amount"
        disabledCurrency
        dropdownArr={activeCurrencies
          .map((currency) => ({
            value: currency.code,
            label: currency.code,
            symbol: currency.symbol,
          }))
          .filter((eachCur) => eachCur.value !== "")}
        defaultCurrencyIndex={defaultCurrencyIndex}
        inputFieldProps={{
          type: "text",
          placeholder: "Enter campaign starting Amount",
          value: value.displayValue,
          onChange: handleNumberInputChange,
        }}
        maxDigits={10}
        nonNegative
        getValues={(vals) => {
          setValue(vals);
          dispatch(updateCurrency(vals.dropdownValue));
        }}
        errorMessage="Required field"
        previousValue={startingAmount}
      />
    </>
  );
};

export const FundRaiserUrlField = () => {
  const dispatch = useDispatch();
  const fundraiserCustomUrl = useSelector(
    (state) => state.mutateCampaign.fundraiserCustomUrl,
  );
  const status = useSelector((state) => state.mutateCampaign.status);

  const [inputValue, setInputValue] = useState(fundraiserCustomUrl);

  const handleInputChange = (e) => {
    let value = e.target.value;
    let newUserInput;

    if (value.startsWith(RANDOM_URL)) {
      // User is editing after the RANDOM_URL
      newUserInput = value.replace(RANDOM_URL, "");
    } else {
      // User is editing the RANDOM_URL part
      const partialRandomUrl = value.substring(0, RANDOM_URL.length);
      newUserInput = value.replace(partialRandomUrl, "");
    }
    // Remove any '/' characters from the user input
    newUserInput = newUserInput.replace(/\//g, "");
    setInputValue(newUserInput);
    dispatch(updateFundraiserCustomUrl(newUserInput));
  };

  useEffect(() => {
    setInputValue(fundraiserCustomUrl);
  }, [fundraiserCustomUrl]);

  return (
    <TextFieldComp
      label={"Custom URL"}
      placeholder={"Enter URL"}
      name="fundraiserCustomUrl"
      value={RANDOM_URL + inputValue}
      withAdornment={false}
      fullWidth
      onChange={handleInputChange}
      helperText={
        status !== "active"
          ? "This campaign is inactive and custom url will not be viewable"
          : ""
      }
      error={status !== "active"}
      onBlur={() => {}}
    />
  );
};

export const ZipCodeField = () => {
  const dispatch = useDispatch();
  const location_zipCode = useSelector(
    (state) => state.mutateCampaign.location_zipCode,
  );
  return (
    <FullWidthInputWithLength
      label={"Zip Code"}
      placeholder={"Enter Zip Code"}
      name="zipCode"
      withAdornment={false}
      value={location_zipCode}
      helperText={location_zipCode.length < 1 ? "Required field" : ""}
      error={location_zipCode.length < 1}
      onChange={(e) => dispatch(updateLocation_zipCode(e.target.value))}
      onBlur={() => {}}
    />
  );
};

export const Story = () => {
  const dispatch = useDispatch();
  const story = useSelector((state) => state.mutateCampaign.story);
  const [editStoryModal, setEditStoryModal] = useState(false);
  const [tempStory, setTempStory] = useState(story);
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // state to manage delete

  const openDelete = () => {
    setOpenDeleteModal(true);
  };

  useEffect(() => {
    setTempStory(story);
  }, [story]);

  const teamDeleteHandler = () => {
    setTempStory(null);
    setEditStoryModal(false);
    setOpenDeleteModal(false);
  };

  return (
    <>
      <EditCampaignHeading
        containerStyleOverrides={{
          mb: "12px",
        }}
        withEdit={true}
        editAction={() => {
          setEditStoryModal(true);
        }}
      >
        Story
      </EditCampaignHeading>
      <ShowMoreComponent lines={7}>
        <DisplayEditorData content={tempStory || story} />
      </ShowMoreComponent>
      <ModalComponent
        width={"100vw"}
        height={"100vh"}
        padding={("32px", "48px")}
        responsivePadding={("40px", "16px")}
        open={editStoryModal}
        onClose={openDelete}
      >
        <EditorModal
          textEditorHandler={(data) => setTempStory(data)}
          editorData={tempStory || story}
          submitHandler={() => dispatch(updateStory(tempStory))}
          setSetEditorModal={setEditStoryModal}
        />
      </ModalComponent>
      {openDeleteModal && (
        <ModalComponent
          width={"422px"}
          open={openDeleteModal}
          padding={"48px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
          onClose={() => setOpenDeleteModal(false)}
        >
          <DeleteModals
            isStory
            levelDeleteHandler={teamDeleteHandler}
            setOpenDeleteMOdel={setOpenDeleteModal}
            heading="Discard Changes"
            description={
              "Your recent changes will be discarded. Are you sure you want to exit?"
            }
          />
        </ModalComponent>
      )}
    </>
  );
};
export const IsAllowRecurringDonations = () => {
  const dispatch = useDispatch();
  const allowRecurringDonations = useSelector(
    (state) => state.mutateCampaign.allowRecurringDonations,
  );
  const allowOneTimeDonations = useSelector(
    (state) => state.mutateCampaign.allowOneTimeDonations,
  );

  const recurringDonationHandler = (newState) => {
    if (!newState && !allowOneTimeDonations) {
      toast.dismiss(); // Dismiss any previous toast to prevent multiple toasts
      toast.error("At least one donation type must be enabled.");
      return;
    }
    // If both are off and we are trying to turn this on, ensure monthly donations are also turned on
    if (!allowRecurringDonations && !allowOneTimeDonations && newState) {
      dispatch(updateAllowRecurringDonations(true));
    }
    dispatch(updateAllowRecurringDonations(newState));
  };
  return (
    <TitleWithSwitch
      heading="Allow recurring donations"
      subHeading="Let people commit to a recurring donation amount"
      checked={allowRecurringDonations}
      onChange={(e) => recurringDonationHandler(e)}
    />
  );
};

export const IsAllowPromoteRecurringDonations = () => {
  const dispatch = useDispatch();
  const promoteRecurringDonations = useSelector(
    (state) => state.mutateCampaign.promoteRecurringDonations,
  );

  const recurringDonationHandler = (newState) => {
    // If both are off and we are trying to turn this on, ensure monthly donations are also turned on
    dispatch(updatePromoteRecurringDonations(newState));
  };
  return (
    <TitleWithSwitch
      heading="Promote recurring donations"
      subHeading="Let people donate on recurring donations"
      checked={promoteRecurringDonations}
      onChange={(e) => recurringDonationHandler(e)}
    />
  );
};

export const IsAllowOneTimeDonations = () => {
  const dispatch = useDispatch();

  const { allowOneTimeDonations, allowRecurringDonations } = useSelector(
    (state) => state.mutateCampaign,
  );

  const oneTimeDonationHandler = (newState) => {
    // If trying to turn off and the other is already off, prevent this action
    if (!newState && !allowRecurringDonations) {
      toast.dismiss(); // Dismiss any previous toast to prevent multiple toasts
      toast.error("At least one type of donation must be enabled.");
      return;
    }
    if (!allowRecurringDonations && !allowOneTimeDonations && newState) {
      dispatch(updateAllowOneTimeDonations(true));
    }
    dispatch(updateAllowOneTimeDonations(newState));
  };

  return (
    <TitleWithSwitch
      heading="Allow one-time donations"
      subHeading="Let people commit to one-time donation amount"
      checked={allowOneTimeDonations}
      onChange={(e) => oneTimeDonationHandler(e)}
    />
  );
};

export const IsCommentBox = () => {
  const dispatch = useDispatch();
  const { isCommentAllowed } = useSelector((state) => state.mutateCampaign);
  const { commentboxHeading } = useSelector((state) => state.mutateCampaign);

  return (
    <>
      <TitleWithSwitch
        heading="Allow comment box"
        subHeading="Let people leave a comment with their donation"
        checked={isCommentAllowed}
        onChange={(e) => {
          dispatch(updateIsCommentAllowed(e));
        }}
      />
      {isCommentAllowed ? (
        <TextFieldComp
          label={""}
          placeholder={"Enter comment box heading"}
          name="commentboxHeading"
          value={commentboxHeading}
          withAdornment={true}
          fullWidth
          inputProps={{
            maxLength: 200,
          }}
          helperText={
            commentboxHeading?.length > 200 ? (
              <p style={{ color: "red" }}>Maximum 200 characters allowed</p>
            ) : (
              ""
            )
          }
          InputProps={{
            endAdornment: (
              <span style={{ color: "#A1A1A8" }}>
                {commentboxHeading?.length || 0}/200
              </span>
            ),
          }}
          onChange={(e) => {
            if (e.target.value.length <= 200) {
              dispatch(updateCommentBoxHeading(e.target.value));
            }
          }}
        />
      ) : null}
    </>
  );
};

export const IsZakatEligible = () => {
  const dispatch = useDispatch();
  const { zakatEligible } = useSelector((state) => state.mutateCampaign);

  return (
    <TitleWithSwitch
      isDisabled={true}
      heading="Zakat eligible"
      subHeading="We will calculate and transfer zakat ourselves"
      checked={zakatEligible}
      onChange={(e) => {
        dispatch(updateZakatEligible(e));
      }}
    />
  );
};
export const IsTextDeductible = () => {
  const dispatch = useDispatch();
  const { taxDeductable } = useSelector((state) => state.mutateCampaign);

  return (
    <TitleWithSwitch
      heading="Tax deductible"
      subHeading="We will calculate and transfer tax ourselves"
      checked={taxDeductable} //Need to modify
      onChange={(e) => {
        dispatch(updateTaxDeductAble(e));
      }}
    />
  );
};

export const IsCustomDonation = () => {
  const dispatch = useDispatch();

  const { allowCustomDonation, minimumDonationValue } = useSelector(
    (state) => state.mutateCampaign,
  );

  const currency = useSelector((state) => state.mutateCampaign.currency);
  const countries = useSelector((state) => state.meta.countries);
  const [value, setValue] = useState({
    dropdownValue: null,
    inputValue: "",
    displayValue: minimumDonationValue,
    symbol: "",
  });

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

  let defaultCurrencyIndex;

  // First, try to find the index of the specified currency
  if (currency) {
    defaultCurrencyIndex = activeCurrencies.findIndex(
      (eachCurr) => eachCurr.code === currency,
    );
  }

  // If the specified currency is not found (-1), or if `currency` is not provided, look for "USD"
  if (defaultCurrencyIndex === -1 || defaultCurrencyIndex === undefined) {
    defaultCurrencyIndex = activeCurrencies.findIndex(
      (eachCurr) => eachCurr.code === "USD",
    );
  }

  // If "USD" is also not found, you might default to the first currency or another default action
  if (defaultCurrencyIndex === -1) {
    defaultCurrencyIndex = 0; // or handle accordingly
  }

  const handleNumberInputChange = (e) => {
    const { value } = e.target;
    // Remove commas for calculation and storage
    const normalizedValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
    const isOnlyZeros = /^0+\.?0*$/.test(normalizedValue);
    dispatch(minimumDonationValueHandler(normalizedValue));
    // Update state with raw number and formatted display value

    setValue((prevState) => ({
      ...prevState,
      inputValue: isOnlyZeros ? "" : normalizedValue,
      displayValue: formatNumberWithCommas(normalizedValue),
    }));
  };

  useEffect(() => {
    if (minimumDonationValue === undefined) {
      return;
    }
    let stringGoal = minimumDonationValue?.toString();
    const normalizedValue = stringGoal
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
    setValue((prevState) => ({
      ...prevState,
      displayValue: formatNumberWithCommas(normalizedValue),
    }));
  }, [minimumDonationValue]);

  return (
    <BoxComponent>
      <TitleWithSwitch
        isDisabled={true}
        heading="Allow Custom Donation"
        subHeading="Allow users to donate any amount"
        checked={allowCustomDonation} //Need to modify
        // checked={true}
        onChange={(e) => {
          dispatch(updateCustomDonationHandler(e));
        }}
      />
      {allowCustomDonation && (
        <>
          <TextFieldWithDropdown
            label=""
            disabledCurrency
            dropdownArr={activeCurrencies
              .map((currency) => ({
                value: currency.code,
                label: currency.code,
                symbol: currency.symbol,
              }))
              .filter((eachCur) => eachCur.value !== "")}
            defaultCurrencyIndex={defaultCurrencyIndex}
            inputFieldProps={{
              type: "text",
              placeholder: "Enter minimum donation amount",
              value: value.displayValue,
              onChange: handleNumberInputChange,
            }}
            maxDigits={10}
            nonNegative
            getValues={(vals) => {
              setValue(vals);
            }}
            error={!minimumDonationValue}
          />
        </>
      )}
    </BoxComponent>
  );
};

export const CampaignTimeline = () => {
  const dispatch = useDispatch();
  const { allowCampaignTimeline, campaignTimelineDate } = useSelector(
    (state) => state.mutateCampaign,
  );

  const handleDateChange = (newDate) => {
    dispatch(updateCampaignTimelineHandler(newDate));
  };

  const tomorrow = dayjs().add(1, "day");

  return (
    <>
      <TitleWithSwitch
        heading="Set an end date"
        subHeading="Select when you want the campaign to end"
        checked={allowCampaignTimeline} //Need to modify
        onChange={(e) => {
          if (!e) {
            dispatch(updateCampaignTimelineHandler(null));
          }
          dispatch(updateAllowCampaignTimelineHandler(e));
        }}
      />
      {allowCampaignTimeline ? (
        <>
          <div style={{ marginTop: "-15px !important" }}>
            <DatePickerComp
              value={campaignTimelineDate}
              onChange={handleDateChange}
              label="End date"
              disableFuture={false}
              isRequired={false}
              sx={{ marginTop: "10px !important" }}
              minDate={tomorrow} // Exclude today, start from tomorrow
            />
          </div>
        </>
      ) : null}
    </>
  );
};
