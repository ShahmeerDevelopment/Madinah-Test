import React, { useCallback, useState } from "react";
import SubHeading from "../../../../../components/atoms/createCampaigns/SubHeading";
import * as Yup from "yup";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import TextFieldComp from "../../../../../components/atoms/inputFields/TextFieldComp";
import CurrencyField from "../addUpsells/CurrencyField";
import ButtonComp from "../../../../../components/atoms/buttonComponent/ButtonComp";
import StackComponent from "../../../../../components/atoms/StackComponent";
import CircularLoader from "../../../../../components/atoms/ProgressBarComponent/CircularLoader";
import TypographyComp from "../../../../../components/atoms/typography/TypographyComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

const AddOrderBump = React.memo(({ id, isLoading, submitUpSellData }) => {
  const [amount, setAmount] = useState({ amount: 0, currency: "" });
  const [resetTrigger, setResetTrigger] = useState(false);
  const [amountError, setAmountError] = useState(false);

  const addUpsellsSchema = Yup.object().shape({
    title: Yup.string().required("Required field"),
    subTitle: Yup.string().required("Required field"),
  });

  const handleReset = useCallback(() => {
    setResetTrigger(true);
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      subTitle: "",
    },
    validationSchema: addUpsellsSchema,
    onSubmit: (values, { resetForm }) => {
      onSubmitHandler(values, resetForm);
      handleReset();
    },
  });
  const handleCurrencyChange = useCallback((newCurrencyData) => {
    setAmount(newCurrencyData);
  }, []);

  const isDisabled =
    amount.amount === 0 ||
    amount.amount === "" ||
    formik.values.title === "" ||
    formik.values.subTitle === "";

  const onSubmitHandler = async (value, resetForm) => {
    try {
      await submitUpSellData(value, amount, id, "orderBump");
      resetForm();
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <div>
      <SubHeading sx={{ mb: "18px" }}>Add Donation bump</SubHeading>
      <form onSubmit={formik.handleSubmit}>
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
    </div>
  );
});

AddOrderBump.displayName = "AddOrderBump";
AddOrderBump.propTypes = {
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  submitUpSellData: PropTypes.func,
};
export default AddOrderBump;
