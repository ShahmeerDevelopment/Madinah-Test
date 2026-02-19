"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import PhoneInputField from "@/components/atoms/inputFields/PhoneInputField";
import DatePickerComp from "@/components/molecules/datePicker/DatePickerComp";
import SubmitButton from "@/components/atoms/createCampaigns/SubmitButton";
import { updateUserPersonalInformation } from "@/api";
import { useSelector } from "react-redux";
import {
  formatDateForAPI,
  formatDateComponentsForAPI,
  parseDateFromAPI,
} from "@/utils/helpers";
import {
  campaignStepperIncrementHandler,
  personalInformationHandler,
} from "@/store/slices/campaignSlice";
import { useDispatch } from "react-redux";

export const FieldWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
  gap: 20,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    marginBottom: "20px",
    gap: 5,
  },
}));
const PersonalInformation = ({
  countriesData,
  profileData,
  setCurrentIndex,
  setActiveStep,
  createCampaign,
}) => {
  const dispatch = useDispatch();
  const [isError, setIsError] = useState(false);
  const personalInformation = useSelector(
    (state) => state?.campaign?.personalInformation
  );
  const [initialPhoneNumberValid, setInitialPhoneNumberValid] = useState(
    Boolean(profileData?.phoneNumber)
  );
  const [selectedDate, setSelectedDate] = useState(() => {
    if (profileData?.dateOfBirth) {
      const parsed = parseDateFromAPI(profileData.dateOfBirth);
      return parsed;
    }
    return null;
  });
  const validatePhoneNumber = useSelector(
    (state) => state.meta.validatePhoneNumber
  );
  const [phone, setPhone] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const userInformationSchema = Yup.object().shape({
    firstName: Yup.string().required("Please enter your first name."),
    lastName: Yup.string().required("Please enter your last name."),
    email: Yup.string()
      .email("Invalid email address.")
      .required("Please enter your email address."),
  });
  const formik = useFormik({
    initialValues: {
      firstName: createCampaign ? personalInformation?.firstName || "" : "",
      lastName: createCampaign ? personalInformation?.lastName || "" : "",
      email: createCampaign ? personalInformation?.alternateEmail || "" : "",
    },
    validationSchema: userInformationSchema,
    onSubmit: (values) => {
      setIsLoading(true);

      // Use the utility function to format date consistently
      let formattedEndDate = formatDateForAPI(selectedDate);
      // Fallback: if the main function doesn't work as expected, use component-based formatting
      if (!formattedEndDate && selectedDate) {
        formattedEndDate = formatDateComponentsForAPI(
          selectedDate.year(),
          selectedDate.month() + 1,
          selectedDate.date()
        );
      }
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        alternateEmail: values.email,
        phoneNumber: phone,
        dateOfBirth: formattedEndDate,
      };
      if (createCampaign) {
        dispatch(personalInformationHandler(payload));
        dispatch(campaignStepperIncrementHandler(1));
      } else {
        updateUserPersonalInformation(payload)
          .then((res) => {
            const result = res?.data;
            if (result.success) {
              setIsLoading(false);
              toast.success(result.message);
              setActiveStep((prevActiveStep) => {
                if (!createCampaign) {
                  setCurrentIndex(prevActiveStep);
                }
                if (createCampaign) {
                  dispatch(campaignStepperIncrementHandler(1));
                }
                return prevActiveStep + 1;
              });
            } else {
              console.error(result.error);
              setIsLoading(false);
            }
          })
          .catch((error) => {
            console.error(error);
            setIsLoading(false);
          });
      }
    },
  });
  const countryList = countriesData.map((item) =>
    item?.isoAlpha2.toLowerCase()
  );

  useEffect(() => {
    if (profileData) {
      formik.setValues({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.alternateEmail || profileData.email,
      });
      setPhone(
        createCampaign
          ? personalInformation?.phoneNumber
          : profileData.phoneNumber
      );
      // Parse date without timezone conversion to prevent date shifting
      if (createCampaign) {
        const dateOfBirth = parseDateFromAPI(personalInformation?.dateOfBirth);
        setSelectedDate(dateOfBirth);
      }
      if (profileData?.dateOfBirth) {
        const dateOfBirth = parseDateFromAPI(profileData.dateOfBirth);
        setSelectedDate(dateOfBirth);
      }
      setInitialPhoneNumberValid(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  const isFormEmpty =
    !formik.values.firstName ||
    !formik.values.lastName ||
    !formik.values.email ||
    !selectedDate;
  const hasPhoneNumber = Boolean(phone);
  const enableContinueButton =
    !isFormEmpty &&
    !Object.keys(formik.errors).length &&
    !isLoading &&
    !isError &&
    ((hasPhoneNumber && validatePhoneNumber) || // When a new or existing phone number is valid
      (profileData?.phoneNumber &&
        initialPhoneNumberValid &&
        validatePhoneNumber !== false));

  const isFormInvalid = !enableContinueButton;

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <BoxComponent sx={{ mt: { xs: 3, sm: 3 } }}>
          <FieldWrapper>
            <TextFieldComp
              isRequired
              id="email"
              name="email"
              label={"Email address"}
              autoComplete="email"
              placeholder={"Enter email address"}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              fullWidth
            />
            <BoxComponent sx={{ width: "100%", mt: { xs: 0, sm: -2 } }}>
              <PhoneInputField
                label="Phone number*"
                value={phone}
                onInputChange={(e) => setPhone(e)}
                countriesData={countryList}
                previousPhoneNumber={profileData?.phoneNumber}
              />
            </BoxComponent>
          </FieldWrapper>
          <FieldWrapper>
            <TextFieldComp
              isRequired
              fullWidth
              id="firstName"
              name="firstName"
              autoComplete="first-name"
              label={"First name "}
              placeholder={"Enter first name"}
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
            />
            <TextFieldComp
              isRequired
              fullWidth
              id="lastName"
              name="lastName"
              label="Last name"
              autoComplete="last-name"
              placeholder={"Enter your last name"}
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />
          </FieldWrapper>
          <BoxComponent sx={{ mb: { xs: 3, sm: 0 }, mt: { xs: -1.5, sm: 0 } }}>
            <DatePickerComp
              value={selectedDate}
              onChange={handleDateChange}
              setIsError={setIsError}
              isError={isError}
            />
          </BoxComponent>
        </BoxComponent>
        <SubmitButton isContinueButtonDisabled={isFormInvalid}>
          {isLoading ? "Updating..." : "Continue"}
        </SubmitButton>
      </form>
    </div>
  );
};

PersonalInformation.propTypes = {
  countriesData: PropTypes.array,
  profileData: PropTypes.any,
  setActiveStep: PropTypes.func,
  setCurrentIndex: PropTypes.func,
};
export default PersonalInformation;
