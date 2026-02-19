import PropTypes from "prop-types";
import React from "react";
import FullWidthInputWithLength from "@/components/advance/FullWidthInputWithLength";
import { useSelector } from "react-redux";

export const CountryNameField = ({ isSubmittionAttempted }) => {
  const countryName = useSelector((state) => state.mutateAuth?.countryName);

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
        gap: "5px",
      }}
      label={"Country"}
      placeholder={"Country"}
      name="countryName"
      adornmentChildren={<></>}
      value={countryName}
      disabled
      error={isSubmittionAttempted}
      onBlur={() => {
        // addBlurredInput('title');
      }}
    />
  );
};

export const CharitableOrganizationNameField = ({ isSubmittionAttempted }) => {
  const charitableOrganizationName = useSelector(
    (state) => state.mutateAuth?.charitableOrganizationName
  );

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
      }}
      label={"Charitable Organization name"}
      placeholder={"Charitable Organization name"}
      name="charitableOrganizationName"
      adornmentChildren={<></>}
      value={charitableOrganizationName}
      disabled
      error={isSubmittionAttempted}
      onBlur={() => {
        // addBlurredInput('title');
      }}
    />
  );
};

export const CharityRegistrationNumberField = ({ isSubmittionAttempted }) => {
  const charityRegistrationNumber = useSelector(
    (state) => state.mutateAuth?.charityRegistrationNumber
  );

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
      }}
      label={"Charity Registration Number"}
      placeholder={"Charity Registration Number"}
      name="charityRegistrationNumber"
      adornmentChildren={<></>}
      value={charityRegistrationNumber}
      disabled
      error={isSubmittionAttempted}
    />
  );
};

export const StreetAddressField = ({ isSubmittionAttempted }) => {
  const streetAddress = useSelector((state) => state.mutateAuth?.streetAddress);

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
      }}
      label={"Street address"}
      placeholder={"Street address"}
      name="streetAddress"
      value={streetAddress}
      adornmentChildren={<></>}
      disabled
      error={isSubmittionAttempted}
      onBlur={() => {
        // addBlurredInput('title');
      }}
    />
  );
};

export const StreetAddress2Field = ({ isSubmittionAttempted }) => {
  const streetAddress2 = useSelector(
    (state) => state.mutateAuth?.streetAddress2
  );

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
      }}
      label={"Street address 2"}
      placeholder={"Street address 2"}
      name="streetAddress2"
      value={streetAddress2}
      adornmentChildren={<></>}
      disabled
      error={isSubmittionAttempted}
      onBlur={() => {
        // addBlurredInput('title');
      }}
    />
  );
};

export const CityField = ({ isSubmittionAttempted }) => {
  const city = useSelector((state) => state.mutateAuth?.city || "");

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
      }}
      label={"City"}
      placeholder={"City"}
      name="city"
      value={city}
      adornmentChildren={<></>}
      disabled
      error={isSubmittionAttempted}
      onBlur={() => {
        // addBlurredInput('title');
      }}
    />
  );
};

export const StateField = ({ isSubmittionAttempted }) => {
  const countryState = useSelector((state) => state.mutateAuth?.state || "");

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
      }}
      label={"State"}
      placeholder={"State"}
      name="countryState"
      value={countryState}
      adornmentChildren={<></>}
      disabled
      error={isSubmittionAttempted}
      onBlur={() => {
        // addBlurredInput('title');
      }}
    />
  );
};

export const ZipField = ({ isSubmittionAttempted }) => {
  const zipCode = useSelector((state) => state.mutateAuth?.zipCode || "");

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
      }}
      label={"Zip"}
      placeholder={"Zip"}
      name="zipCode"
      value={zipCode}
      adornmentChildren={<></>}
      disabled
      error={isSubmittionAttempted}
    />
  );
};

export const FullNameField = ({ isSubmittionAttempted }) => {
  const fullName = useSelector((state) => state.mutateAuth?.fullName || "");

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
      }}
      label={"Full Name Authorized Representative"}
      placeholder={"Full Name Authorized Representative"}
      name="fullName"
      value={fullName}
      adornmentChildren={<></>}
      // disabled
      error={isSubmittionAttempted}
    />
  );
};

CountryNameField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};

CharitableOrganizationNameField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};

CharityRegistrationNumberField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};

StreetAddressField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};

StreetAddress2Field.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};

CityField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};

StateField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};

ZipField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};

FullNameField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};