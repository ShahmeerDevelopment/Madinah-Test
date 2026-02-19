/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React, { useState } from "react";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import PasswordField from "@/components/atoms/inputFields/PasswordField";
import CheckBoxComp from "@/components/atoms/checkBoxComp/CheckBoxComp";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import StackComponent from "@/components/atoms/StackComponent";
import AuthModelForm from "@/components/advance/AuthModelForm/AuthModelForm";
import { FormHelperText } from "@mui/material";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import useCheckWeakPassword from "@/hooks/useCheckWeakPassword";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

const SignUpForm = ({
  onSignUpSubmit,
  loader,
  removeErrorEmailAlreadyExists,
  emailAlreadyExistsError,
}) => {
  const { passwordStrengthInWords, testPassword, passwordLength } =
    useCheckWeakPassword();
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const toggleTermsAndConditions = () =>
    setTermsAndConditions((prevState) => !prevState);

  const SignUpSchema = Yup.object().shape({
    firstName: Yup.string().required("Required field"),
    lastName: Yup.string().required("Required field"),
    email: Yup.string()
      .email("Invalid email address.")
      .required("Required field"),

    password: Yup.string()
      .required("Required field")
      .min(12, "Password must be at least 12 characters long.")
      .matches(/[a-zA-Z]/, "Password must contain letters.")
      .matches(/[A-Z]/, "Password must contain an Uppercase letter.")
      .matches(/[a-z]/, "Password must contain a lowercase letter.")
      .matches(/\d/, "Password must contain a number.")
      .matches(
        /(?=.*[!.@#$%^&*])/,
        "Password must contain a special character.",
      ),
  });
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: SignUpSchema,
    onSubmit: (values, { resetForm }) => {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      };
      onSignUpSubmit({ payload, resetForm });
    },
  });
  const isFormEmpty =
    !formik.values.firstName || !formik.values.email || !formik.values.password;

  const isInvalidPassword = Boolean(formik.errors.password);

  const customHelperText = (
    <FormHelperText
      sx={{
        ml: "2px",
        mt: "5px",
        color: isInvalidPassword ? "#ff0000" : "auto",
      }}
    >
      <TypographyComp
        component="span"
        color={isInvalidPassword ? "#ff0000" : "primary.main"}
        sx={{ fontWeight: "inherit", fontSize: "inherit" }}
      >
        <TypographyComp
          sx={{
            color:
              isInvalidPassword || formik.values.password.length === 0
                ? "#ff0000"
                : "#A1A1A8",
            fontSize: "12px",
            fontWeight: 400,
          }}
          component="span"
        >
          {passwordLength > 0 ? (
            <>
              {passwordLength < 12 ? (
                <>
                  The password is
                  <span style={{ textTransform: "lowercase" }}>
                    {` ${passwordStrengthInWords} ${formik.values.password.length === 0 && !isInvalidPassword
                        ? "Password must be at least 12 characters, including at least 1 uppercase, 1 lowercase, 1 special character, and 1 number."
                        : ""
                      }`}
                  </span>
                  {formik.values.password.length}
                  /12,&nbsp;
                </>
              ) : null}
              {isInvalidPassword ? formik.errors.password : null}
            </>
          ) : null}
        </TypographyComp>{" "}
      </TypographyComp>
      {/* /12 {isInvalidPassword ? formik.errors.password : null} */}
    </FormHelperText>
  );

  const termsAgreementCheckboxStyles = (isBlueText) => ({
    color: isBlueText ? "primary.main" : "#4F4F4F",
    fontWeight: 500,
    fontSize: "14px",
    cursor: isBlueText ? "pointer" : "auto",
    textDecoration: "none",
  });
  return (
    <AuthModelForm
      customSpacing="6px"
      dense
      mt="25px"
      formAction={formik.handleSubmit}
    >
      <StackComponent
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 0.5, sm: 1 }}
        sx={{
          width: "100%",
          // mt: 'px',
        }}
      >
        <TextFieldComp
          fullWidth
          id="firstName"
          name="firstName"
          autoComplete="first-name"
          label={"First name"}
          placeholder={"Enter your first name"}
          isRequired={true}
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />
        <TextFieldComp
          fullWidth
          id="lastName"
          name="lastName"
          label={"Last name"}
          autoComplete="last-name"
          placeholder={"Enter your last name"}
          isRequired={true}
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
      </StackComponent>
      <TextFieldComp
        id="email"
        name="email"
        label={"Email"}
        autoComplete="email"
        isRequired={true}
        placeholder={"Enter your email"}
        value={formik.values.email}
        onChange={(e) => {
          removeErrorEmailAlreadyExists();
          formik.handleChange(e);
        }}
        onBlur={formik.handleBlur}
        error={
          (formik.touched.email && Boolean(formik.errors.email)) ||
          emailAlreadyExistsError
        }
        helperText={
          (formik.touched.email && formik.errors.email) ||
          (emailAlreadyExistsError && "Email is already used!")
        }
        fullWidth
      />

      <PasswordField
        fullWidth
        id="password"
        name="password"
        label={"Password"}
        autoComplete="new-password"
        placeholder={"Enter your password"}
        isRequired={true}
        value={formik.values.password}
        onChange={(e) => {
          testPassword(e.target.value);
          formik.handleChange(e);
        }}
        onFocus={() => testPassword(formik.values.password)}
        onBlur={formik.handleBlur}
        error={isInvalidPassword}
        helperText={formik.touched.password && formik.errors.password}
        customHelperText={customHelperText}
        inputProps={{
          maxLength: 100, // Enforce the max length directly in the input
        }}
      />
      <StackComponent
        {...{
          justifyContent: "flex-start",
          alignContent: "flex-start",
          pl: "10px !important",
        }}
      >
        <CheckBoxComp
          specialIcon={true}
          customCheckbox={true}
          label={
            <TypographyComp component="span">
              <TypographyComp
                sx={termsAgreementCheckboxStyles(false)}
                component="span"
              >
                {"By continuing, you agree to the Madinah"}&nbsp;
              </TypographyComp>
              <TypographyComp
                sx={termsAgreementCheckboxStyles(true)}
                component="a"
                color="primary.main"
                href="/terms-and-conditions"
                target="_blank" // Ensure it opens in a new tab.
                rel="noopener noreferrer"
              >
                {"terms of service"}
              </TypographyComp>
              <TypographyComp
                sx={termsAgreementCheckboxStyles(false)}
                component="span"
              >
                &nbsp;{"and"}&nbsp;
              </TypographyComp>
              <TypographyComp
                sx={termsAgreementCheckboxStyles(true)}
                component="a"
                color="primary.main"
                href="https://madinah.com/privacy-policy"
                target="_blank" // Ensure it opens in a new tab.
                rel="noopener noreferrer"
              >
                {"privacy notice."}
              </TypographyComp>
            </TypographyComp>
          }
          checked={termsAndConditions}
          onChange={() => toggleTermsAndConditions()}
        />
      </StackComponent>
      <BoxComponent sx={{ width: "100%", padding: "0px 5px" }}>
        <ButtonComp
          fullWidth
          size="normal"
          type="submit"
          disabled={
            Object.keys(formik.errors).length > 0 ||
            !termsAndConditions ||
            isFormEmpty ||
            loader
          }
          sx={{ color: "#FFFFFF" }}
        >
          {loader === true ? "Sending..." : "Sign Up"}
        </ButtonComp>
      </BoxComponent>
    </AuthModelForm>
  );
};

SignUpForm.propTypes = {
  emailAlreadyExistsError: PropTypes.string,
  loader: PropTypes.bool,
  onSignUpSubmit: PropTypes.func.isRequired,
  removeErrorEmailAlreadyExists: PropTypes.func,
  t: PropTypes.func,
};

export default SignUpForm;
