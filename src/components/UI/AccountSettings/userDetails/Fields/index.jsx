import PropTypes from "prop-types";
import React from "react";
import FullWidthInputWithLength from "@/components/advance/FullWidthInputWithLength";
import { useDispatch, useSelector } from "react-redux";
import { useGetCountriesList } from "@/api";
import PhoneInputField from "@/components/atoms/inputFields/PhoneInputField";
import {
  updateCity,
  updateEmail,
  updateFirstName,
  updateLastName,
  updatePhoneNumber,
  updateState,
} from "@/store/slices/mutateAuthSlice";

export const FirstNameField = ({ isSubmittionAttempted }) => {
  const firstName = useSelector((state) => state.mutateAuth?.firstName);
  const dispatch = useDispatch();

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
        gap: "5px",
      }}
      label={"First name*"}
      placeholder={"First name*"}
      name="firstName"
      adornmentChildren={<></>}
      value={firstName}
      onChange={(e) => {
        dispatch(updateFirstName(e.target.value));
      }}
      error={isSubmittionAttempted}
      onBlur={() => {
        // addBlurredInput('title');
      }}
    />
  );
};

export const LastNameField = ({ isSubmittionAttempted }) => {
  const lastName = useSelector((state) => state.mutateAuth?.lastName);
  const dispatch = useDispatch();

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
      }}
      label={"Last name*"}
      placeholder={"Last name*"}
      name="lastName"
      adornmentChildren={<></>}
      value={lastName}
      onChange={(e) => {
        dispatch(updateLastName(e.target.value));
      }}
      error={isSubmittionAttempted}
      onBlur={() => {
        // addBlurredInput('title');
      }}
    />
  );
};

export const StateField = ({ isSubmittionAttempted }) => {
  const countryState = useSelector(
    (state) =>
      state.mutateAuth?.state || state.mutateAuth?.addressDetails?.state || "",
  );
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const value = e.target.value;
    // Regular expression to match only alphabetic characters and spaces
    const isValid = /^[A-Za-z\s]*$/.test(value);
    if (isValid) {
      dispatch(updateState(value));
    }
  };

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
      }}
      label={"State*"}
      placeholder={"State*"}
      name="countryState"
      adornmentChildren={<></>}
      value={countryState}
      onChange={handleChange}
      error={isSubmittionAttempted}
      onBlur={() => {
        // addBlurredInput('title');
      }}
    />
  );
};

export const CityField = ({ isSubmittionAttempted }) => {
  const city = useSelector(
    (state) =>
      state.mutateAuth?.city || state.mutateAuth?.addressDetails?.city || "",
  );
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const value = e.target.value;

    // Regular expression to match only alphabetic characters and spaces
    const isValid = /^[A-Za-z\s]*$/.test(value);

    if (isValid) {
      dispatch(updateCity(value));
    }
  };

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
      }}
      label={"City*"}
      placeholder={"City"}
      name="city"
      adornmentChildren={<></>}
      value={city}
      onChange={handleChange}
      error={isSubmittionAttempted}
      onBlur={() => {
        // addBlurredInput('title');
      }}
    />
  );
};

export const EmailField = ({ isSubmittionAttempted }) => {
  const email = useSelector((state) => state.mutateAuth?.email);
  const dispatch = useDispatch();

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
      }}
      label={"Email*"}
      placeholder={"Email*"}
      name="email"
      adornmentChildren={<></>}
      value={email}
      onChange={(e) => {
        dispatch(updateEmail(e.target.value));
      }}
      disabled
      error={isSubmittionAttempted}
      onBlur={() => {
        // addBlurredInput('title');
      }}
    />
  );
};

export const PhoneField = ({ previousPhone, ...otherProps }) => {
  const { data: countriesListResponse } = useGetCountriesList();
  const countriesData = countriesListResponse?.data?.data.countries;
  const phone = useSelector((state) => state.mutateAuth?.phoneNumber);
  // const [phone, setPhone] = useState();
  const dispatch = useDispatch();
  const countryList = countriesData?.map((item) =>
    item?.isoAlpha2.toLowerCase(),
  );

  return (
    <PhoneInputField
      label="Phone number*"
      value={phone}
      onInputChange={(e) => dispatch(updatePhoneNumber(e))}
      countriesData={countryList}
      {...otherProps}
      previousPhoneNumber={previousPhone}
    />
  );
};

FirstNameField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};

LastNameField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};

StateField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};

CityField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};

EmailField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};
