"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import EditForm from "./EditForm";
import { theme } from "@/config/customTheme";
import userGetCurrencies from "@/hooks/userGetCurrencies";
import userGetCampaignList from "@/hooks/userGetCampaignList";
import { postOfflineDonation, updateDonation } from "@/api";
import StackComponent from "@/components/atoms/StackComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import CircularLoader from "@/components/atoms/ProgressBarComponent/CircularLoader";
import CustomCheckBox from "@/components/atoms/checkBoxComp/CustomCheckBox";

import {
  openAddDonorModalHandler,
  singleDonorDataHandler,
} from "@/store/slices/donorSlice";

const buttonStyle = {
  boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.06)",
  width: "91px",
  borderRadius: "32px",
  height: "40px",
  padding: "2px 24px 0px 24px",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const AddAndEditModal = memo(() => {
  const dispatch = useDispatch();
  const { paymentType, isEdit } = useSelector((state) => state.donations);
  const donorData = useSelector((state) => state.donations.singleDonorData);
  const { data } = userGetCampaignList(isEdit);
  const { currenciesData } = userGetCurrencies(isEdit);

  const [loader, setLoader] = useState(false);
  const [country, setCountry] = useState("");
  const [campaign, setCampaign] = useState("");
  const countryId = useSelector(
    (state) => state.donations?.singleDonorData?.countryId,
  );
  const countryList = useSelector((state) => state.meta?.countries); // assuming countryList is here

  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState({ inputValue: "", _id: "" });

  const [isCheckbox, setIsCheckbox] = useState({
    isAnonymousDonor: donorData.hidePublicVisibility || false,
    isAttestedInformation: true,
  });

  const amountHandler = useCallback(
    (value) => {
      setAmount({ inputValue: value.inputValue, _id: value._id });
    },
    [amount],
  );
  const phoneHandler = useCallback((number) => setPhoneNumber(number), []);
  const countryHandler = useCallback((country) => setCountry(country), []);
  const campaignHandler = useCallback((campaign) => setCampaign(campaign), []);

  useEffect(() => {
    if (!country && countryId && countryList && isEdit) {
      const selectedCountry = countryList.find(
        (country) => country._id === countryId,
      );
      if (selectedCountry) {
        setCountry(selectedCountry);
        countryHandler(selectedCountry);
      }
    }
  }, [country, countryId, countryList, countryHandler]);

  const donarSchema = Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .matches(
        /^[A-Za-z\s'-]+$/,
        "First name can only contain letters, spaces, hyphens, and apostrophes.",
      )
      .required("Please enter your first name."),
    lastName: Yup.string()
      .trim()
      .matches(
        /^[A-Za-z\s'-]+$/,
        "Last name can only contain letters, spaces, hyphens, and apostrophes.",
      )
      .required("Please enter your last name."),
    campaign: Yup.string().required("Please select a campaign."), // Make campaign required
    email: Yup.string()
      .email("Invalid email address.")
      .required("Please enter your email address."),
    city: Yup.string()
      .trim()
      .matches(
        /^[A-Za-z\s'-]+$/,
        "City can only contain letters, spaces, hyphens, and apostrophes.",
      ),
    state: Yup.string()
      .trim()
      .matches(
        /^[A-Za-z\s'-]+$/,
        "State can only contain letters, spaces, hyphens, and apostrophes.",
      ),
    zipCode: Yup.string()
      .trim()
      .matches(
        /^[A-Za-z0-9-]+$/,
        "Zip Code can only contain letters, numbers, and hyphens.",
      ),
  });

  const donarSchemaEdit = Yup.object().shape({
    city: Yup.string()
      .trim()
      .matches(
        /^[A-Za-z\s'-]+$/,
        "City can only contain letters, spaces, hyphens, and apostrophes.",
      ),
    state: Yup.string()
      .trim()
      .matches(
        /^[A-Za-z\s'-]+$/,
        "State can only contain letters, spaces, hyphens, and apostrophes.",
      ),
    zipCode: Yup.string()
      .trim()
      .matches(
        /^[A-Za-z0-9-]+$/,
        "Zip Code can only contain letters, numbers, and hyphens.",
      ),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      street: isEdit ? donorData.street : "",
      streetLine2: isEdit ? donorData.streetLine2 : "",
      city: isEdit ? donorData.city || "" : "",
      state: isEdit ? donorData.state || "" : "",
      zipCode: isEdit ? donorData.zipCode || "" : "",
      campaign: isEdit ? donorData.campaignId : "", // Added campaign field
    },
    validationSchema: isEdit ? donarSchemaEdit : donarSchema,
    onSubmit: (values) => {
      if (isEdit) {
        // updateDonation;
        updateDonationHandler(values);
      } else {
        addDonation(values);
      }
    },
  });

  const updateDonationHandler = async (values) => {
    setLoader(true);
    try {
      const payload = {
        street: values.street,
        city: values.city,
        state: values.state,
        countryId: country._id,
        zipCode: values.zipCode,
        streetLine2: values.streetLine2,
        anonymousDonor: isCheckbox.isAnonymousDonor,
      };

      await updateDonation(donorData.campaignId, donorData._id, payload);

      dispatch(openAddDonorModalHandler(false));
      setLoader(false);
    } catch (error) {
      console.error("error", error);
      setLoader(false);
    }
  };

  const addDonation = async (values) => {
    setLoader(true);
    try {
      const payload = {
        amount: Number(amount.inputValue),
        phoneNumber: phoneNumber,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        street: values.street,
        streetLine2: values.streetLine2,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        anonymousDonor: isCheckbox.isAnonymousDonor,
        currencyId: amount._id,
        countryId: country._id,
      };

      const res = await postOfflineDonation(campaign._id, payload);
      const result = res.data.data;
      dispatch(openAddDonorModalHandler(false));
      // eslint-disable-next-line no-self-assign
      result.usdAmount = result.usdAmount;
      if (result.hidePublicVisibility) {
        result.donorName = "";
      }
      dispatch(singleDonorDataHandler(result));
      setLoader(false);
    } catch (error) {
      console.error("error", error);
      setLoader(false);
    }
  };

  return (
    <StackComponent direction="column" alignItems="center">
      <CampaignHeading marginBottom={0}>
        {isEdit ? "Edit donation" : "Add donation"}
      </CampaignHeading>
      <TypographyComp
        sx={{
          fontSize: "14px",
          lineHeight: "16px",
          textAlign: "center",
          color: theme.palette.primary.gray,
          mb: 2,
        }}
      >
        Since this is an online donation, only some elements can be edited
      </TypographyComp>
      <BoxComponent
        sx={{
          display: "flex",
          justifyContent: { xs: "flex-start", sm: "flex-end" },
          width: "100%",
        }}
      >
        <BoxComponent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <TypographyComp
            sx={{
              fontSize: "14px",
              lineHeight: "16px",
              textAlign: "center",
              color: theme.palette.primary.gray,
            }}
          >
            Payment Type
          </TypographyComp>
          <BoxComponent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <BoxComponent
              sx={{
                ...buttonStyle,
                background:
                  paymentType === "online"
                    ? theme.palette.primary.main
                    : "#ffffff",
                color:
                  paymentType === "online"
                    ? "#ffffff"
                    : theme.palette.primary.darkGray,
              }}
              // onClick={() => toggleActive('online')}
            >
              Online
            </BoxComponent>
            <BoxComponent
              sx={{
                ...buttonStyle,
                background:
                  paymentType === "offline"
                    ? theme.palette.primary.main
                    : "#ffffff",
                color:
                  paymentType === "offline"
                    ? "#ffffff"
                    : theme.palette.primary.darkGray,
              }}
              // onClick={() => toggleActive('offline')}
            >
              Offline
            </BoxComponent>
          </BoxComponent>
        </BoxComponent>
      </BoxComponent>

      <form onSubmit={formik.handleSubmit}>
        <EditForm
          formik={formik}
          amountHandler={amountHandler}
          campaignData={data}
          currenciesData={currenciesData}
          phoneHandler={phoneHandler}
          campaignHandler={campaignHandler}
          countryHandler={countryHandler}
          isEdit={isEdit}
          donorData={donorData}
          country={country}
        />
        <CustomCheckBox
          labelStyling={{
            color: theme.palette.primary.gray,
          }}
          onChange={(e) =>
            setIsCheckbox({
              ...isCheckbox,
              isAnonymousDonor: e.target.checked,
            })
          }
          disabled={donorData?.hidePublicVisibility}
          checked={isCheckbox.isAnonymousDonor}
          label="Anonymous Donor"
        />
        <CustomCheckBox
          lineHeight={"16px"}
          labelStyling={{
            color: theme.palette.primary.gray,
          }}
          onChange={(e) =>
            setIsCheckbox({
              ...isCheckbox,
              isAttestedInformation: e.target.checked,
            })
          }
          checked={isCheckbox.isAttestedInformation}
          label="By checking this box, I attest this information provided is true to the best of my ability and if required I can provide proof of offline donation"
        />
        <BoxComponent
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ButtonComp
            type="submit"
            height="46px"
            disabled={isCheckbox.isAttestedInformation ? false : true}
            size="normal"
            sx={{ width: { xs: "100%", sm: "166px" }, mt: 4 }}
          >
            {loader ? (
              <StackComponent alignItems="center" component="span">
                <CircularLoader color="white" size="20px" />
                <TypographyComp>
                  {isEdit ? "Updating..." : "Saving..."}
                </TypographyComp>
              </StackComponent>
            ) : isEdit ? (
              "Update"
            ) : (
              "Save"
            )}
          </ButtonComp>
        </BoxComponent>
      </form>
    </StackComponent>
  );
});

AddAndEditModal.displayName = "AddAndEditModal";

export default AddAndEditModal;
