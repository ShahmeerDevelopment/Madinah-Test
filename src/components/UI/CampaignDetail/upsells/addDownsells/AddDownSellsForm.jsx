import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import TextFieldComp from "../../../../../components/atoms/inputFields/TextFieldComp";
import CurrencyField from "../addUpsells/CurrencyField";
import ButtonComp from "../../../../../components/atoms/buttonComponent/ButtonComp";
import PropTypes from "prop-types";
import StackComponent from "../../../../../components/atoms/StackComponent";
import CircularLoader from "../../../../../components/atoms/ProgressBarComponent/CircularLoader";
import TypographyComp from "../../../../../components/atoms/typography/TypographyComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { DONATION_METHOD_OPTION } from "@/config/constant";
import RadioButtonGroups from "@/components/molecules/radionButtonGroups/RadioButtonGroups";
import { useSelector } from "react-redux";

const AddDownSellsForm = ({
  isLoading,
  onSubmit,
  imageOrVideoUrl,
  isImage = true,
  allowRecurringDonations,
  allowOneTimeDonations,
}) => {
  const [amount, setAmount] = useState({ amount: 0, currency: "" });
  const [resetTrigger, setResetTrigger] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [specialDays, setSpecialDays] = useState("monthly");
  const [specialDaysEndDate, setSpecialDaysEndDate] = useState(null);

  const campaignDetails = useSelector((state) => state.mutateCampaign);
  const automaticDonationDaysData = campaignDetails?.automaticDonationDays;

  const donationDefaultValue =
    allowRecurringDonations === true && allowOneTimeDonations === false
      ? "recurringDonation"
      : "oneTimeDonation";

  const [donationOption, setDonationOption] = useState(donationDefaultValue);

  const addUpsellsSchema = Yup.object().shape({
    title: Yup.string().required("Required field"),
    yesButtonText: Yup.string().required("Required field"),
    noButtonText: Yup.string().required("Required field"),
    subTitle: Yup.string().required("Required field"),
  });

  const handleReset = useCallback(() => {
    setResetTrigger(true);
    setAmount({ amount: 0, currency: "" });
  }, []);

  const handleSpecialDaysClick = (value, endDate) => {
    setSpecialDays(value || "monthly");
    setSpecialDaysEndDate(endDate);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      subTitle: "",
      yesButtonText: "",
      noButtonText: "",
    },
    validationSchema: addUpsellsSchema,
    onSubmit: (values, { resetForm }) => {
      onSubmit(
        values,
        amount,
        resetForm,
        donationOption,
        specialDays,
        specialDaysEndDate,
      );
      handleReset();
    },
  });
  const handleCurrencyChange = useCallback(
    (newCurrencyData) => {
      if (!resetTrigger) {
        setAmount(newCurrencyData);
      }
    },
    [resetTrigger],
  );

  useEffect(() => {
    if (resetTrigger) {
      // This will ensure the reset only triggers once per action
      setResetTrigger(false);
    }
  }, [resetTrigger]);

  const isDisabled =
    (isImage && !imageOrVideoUrl) ||
    amount.amount === 0 ||
    amount.amount === "";
  return (
    <form onSubmit={formik.handleSubmit}>
      {allowRecurringDonations ? (
        <BoxComponent
          sx={{
            mt: 2,
            mb: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "column" },
            alignItems: { xs: "flex-start", sm: "flex-start" },
            gap: { xs: 0, sm: 0 },
          }}
        >
          {DONATION_METHOD_OPTION.map((item) => (
            <RadioButtonGroups
              key={item.id}
              label=""
              options={item}
              value={donationOption}
              onChange={(e) => setDonationOption(e)}
              specialDays={specialDays}
              handleSpecialDaysClick={handleSpecialDaysClick}
              automaticDonationDays={automaticDonationDaysData}
            />
          ))}
        </BoxComponent>
      ) : null}
      <TextFieldComp
        id="title"
        name="title"
        label={"Title"}
        autoComplete="title"
        placeholder={"Enter title here"}
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
        fullWidth
      />
      <TextFieldComp
        id="subTitle"
        name="subTitle"
        label={"Subtitle"}
        autoComplete="subTitle"
        placeholder={"Enter subtitle here"}
        value={formik.values.subTitle}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.subTitle && Boolean(formik.errors.subTitle)}
        helperText={formik.touched.subTitle && formik.errors.subTitle}
        fullWidth
      />

      <TextFieldComp
        id="yesButtonText"
        name="yesButtonText"
        label={"Yes button text"}
        autoComplete="yesButtonText"
        placeholder={"Yes, I would like to donate water (10$) "}
        value={formik.values.yesButtonText}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.yesButtonText && Boolean(formik.errors.yesButtonText)
        }
        helperText={formik.touched.yesButtonText && formik.errors.yesButtonText}
        fullWidth
      />
      <TextFieldComp
        id="noButtonText"
        name="noButtonText"
        label={"No button text"}
        autoComplete="noButtonText"
        placeholder={"No, I don’t want to quench their thirst yet"}
        value={formik.values.noButtonText}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.noButtonText && Boolean(formik.errors.noButtonText)
        }
        helperText={formik.touched.noButtonText && formik.errors.noButtonText}
        fullWidth
      />
      <CurrencyField
        onValueChange={handleCurrencyChange}
        resetTrigger={resetTrigger}
        onBlur={() => setAmountError(true)}
      />
      {(amount.amount === 0 || !amount.amount) && amountError && (
        <BoxComponent sx={{ marginLeft: "3px", marginTop: "5px" }}>
          <TypographyComp
            sx={{
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "20px",
              color: "#f00",
            }}
          >
            {"Required Field"}
          </TypographyComp>
        </BoxComponent>
      )}
      <ButtonComp
        disabled={isDisabled}
        size="normal"
        type="submit"
        sx={{ width: "135px", mt: "24px" }}
      >
        {isLoading ? (
          <StackComponent alignItems="center" component="span">
            <CircularLoader color="white" size="20px" />
            <TypographyComp>Adding...</TypographyComp>
          </StackComponent>
        ) : (
          "Add"
        )}
      </ButtonComp>
    </form>
  );
};

AddDownSellsForm.propTypes = {
  onSubmit: PropTypes.func,
  imageOrVideoUrl: PropTypes.any,
  isImage: PropTypes.bool,
  isLoading: PropTypes.bool,
  allowRecurringDonations: PropTypes.string,
  allowOneTimeDonations: PropTypes.string,
};

export default AddDownSellsForm;
