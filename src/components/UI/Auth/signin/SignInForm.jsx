"use client";

import React, { useEffect } from "react";
import { LinkSpan, LinkWrapper } from "../signup/SignUp.style";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { changeModal, isLoginModalOpen } from "@/store/slices/authSlice";
import { FormHelperText } from "@mui/material";
import { theme } from "@/config/customTheme";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import PasswordField from "@/components/atoms/inputFields/PasswordField";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import AuthModelForm from "@/components/advance/AuthModelForm/AuthModelForm";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

const SignInForm = ({
  onSubmit,
  loader,
  removeInvalidCredentialsError = () => {},
  invalidCredentialsError = false,
}) => {
  const dispatch = useDispatch();
  const SignUpSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Please enter your email address"),
    password: Yup.string()
      .min(12)

      .required("Enter your password"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: SignUpSchema,
    onSubmit: (values) => {
      const payload = {
        email: values.email,
        password: values.password,
      };

      onSubmit(payload);
    },
  });

  useEffect(() => {
    removeInvalidCredentialsError();
  }, [formik.values]);

  // Check if the form fields are empty
  const isFormEmpty = !formik.values.email || !formik.values.password;
  const isInvalidPassword =
    formik.touched.password && Boolean(formik.errors.password);
  const invalidEmail = formik.touched.email && Boolean(formik.errors.email);
  const customHelperText = (
    <FormHelperText
      sx={{ ml: "2px", mt: "5px", color: isInvalidPassword ? "red" : "auto" }}
    >
      <TypographyComp
        component="span"
        color={isInvalidPassword ? "error.main" : "primary.main"}
        sx={{ fontWeight: "inherit", fontSize: "inherit" }}
      >
        {formik.values.password.length}
      </TypographyComp>
      /12. {isInvalidPassword ? formik.errors.password : null}
    </FormHelperText>
  );
  return (
    <AuthModelForm dense mt="25px" formAction={formik.handleSubmit}>
      <TextFieldComp
        fullWidth
        id="email"
        name="email"
        autoComplete="email"
        label={"Email"}
        placeholder={"Enter your email"}
        isRequired={true}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={invalidEmail}
        helperText={formik.touched.email && formik.errors.email}
      />
      <PasswordField
        fullWidth
        id="password"
        name="password"
        autoComplete="password"
        label={"Password"}
        isRequired={true}
        placeholder={"Enter your password"}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        customHelperText={customHelperText}
        inputProps={{
          maxLength: 100, // Enforce the max length directly in the input
        }}
      />
      <LinkWrapper invalidCredentialsError={invalidCredentialsError}>
        {invalidCredentialsError ? (
          <TypographyComp
            color="#E61D1D"
            sx={{
              fontSize: "12px",
              fontWeight: 400,
            }}
          >
            Invalid Email or Password
          </TypographyComp>
        ) : null}
        <TypographyComp
          color="rgba(79, 79, 79, 1)"
          sx={{
            fontWeight: 500,
            fontSize: "14px",
            cursor: "pointer",
          }}
          onClick={() => dispatch(changeModal(2))}
          variant="text"
        >
          {"Forgot your password?"}
        </TypographyComp>
        {/* <LinkText to="/auth/forgot-password">{t('forgotPassword')}</LinkText> */}
      </LinkWrapper>
      <TypographyComp
        variant="subtitle2"
        sx={{
          mt: "40px !important",
          mb: -2,
          color: "rgba(167, 170, 174, 1)",
        }}
        component={"div"}
      >
        {"Madinah"}&nbsp;
        <LinkSpan
          clickHandler={() => dispatch(isLoginModalOpen(false))}
          to="/terms-and-conditions"
          color={theme.palette.primary.main}
          target="_blank" // Open in a new tab
          rel="noopener noreferrer"
        >
          {"terms of service"}&nbsp;
        </LinkSpan>
        {"and"}&nbsp;
        <LinkSpan
          to="/privacy-policy"
          color={theme.palette.primary.main}
          clickHandler={() => dispatch(isLoginModalOpen(false))}
          target="_blank" // Open in a new tab
          rel="noopener noreferrer"
        >
          {"privacy notice."}
        </LinkSpan>
      </TypographyComp>
      <BoxComponent sx={{ width: "100%", padding: "0px 5px" }}>
        <ButtonComp
          fullWidth
          size="normal"
          type="submit"
          disabled={
            Object.keys(formik.errors).length > 0 || isFormEmpty || loader
          }
          sx={{
            color: theme.palette.primary.light,
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          {loader === true ? "Sending..." : "Confirm"}
        </ButtonComp>
      </BoxComponent>
    </AuthModelForm>
  );
};
SignInForm.propTypes = {
  invalidCredentialsError: PropTypes.bool,
  loader: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  removeInvalidCredentialsError: PropTypes.func,
  t: PropTypes.func,
};

export default SignInForm;
