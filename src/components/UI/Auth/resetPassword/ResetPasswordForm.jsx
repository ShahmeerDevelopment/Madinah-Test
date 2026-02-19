"use client";

import React from "react";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import { FormHelperText } from "@mui/material";
import AuthModelForm from "@/components/advance/AuthModelForm/AuthModelForm";
import PasswordField from "@/components/atoms/inputFields/PasswordField";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { resetPasswordValidator } from "./resetPasswordSchema";
import TypographyComp from "@/components/atoms/typography/TypographyComp";

const ResetPasswordForm = ({ onSubmit, loader }) => {
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },

    validationSchema: resetPasswordValidator,

    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const buttonText = loader ? "Sending..." : "Set Password";

  const isFormEmpty = !formik.values.password || !formik.values.confirmPassword;

  const isInvalidPassword =
    formik.touched.password && Boolean(formik.errors.password);

  const customHelperText = (
    <FormHelperText
      sx={{ ml: "2px", color: isInvalidPassword ? "red" : "auto" }}
    >
      <TypographyComp
        component="span"
        color={isInvalidPassword ? "error.main" : "primary.main"}
        sx={{ fontWeight: "inherit", fontSize: "inherit" }}
      >
        {formik.values.password.length}
      </TypographyComp>
      /12 {isInvalidPassword ? formik.errors.password : null}
    </FormHelperText>
  );
  return (
    <>
      <AuthModelForm dense mt="32px" formAction={formik.handleSubmit}>
        <PasswordField
          fullWidth
          id="password"
          placeholder="Password"
          name="password"
          label="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          customHelperText={customHelperText}
        />
        <PasswordField
          fullWidth
          placeholder="Confirm password"
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />
        <ButtonComp
          sx={{ mt: 4, mb: 2 }}
          fullWidth
          type="submit"
          size="normal"
          variant="contained"
          color="primary"
          disabled={isFormEmpty || loader}
        >
          {buttonText}
        </ButtonComp>
      </AuthModelForm>
    </>
  );
};

ResetPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loader: PropTypes.bool,
};
export default ResetPasswordForm;
