import React, { useState } from "react";
import TypographyComp from "../../../../components/atoms/typography/TypographyComp";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import passwordEncryption from "../../../../utils/encryptionData";
import ButtonComp from "../../../../components/atoms/buttonComponent/ButtonComp";
import AuthModelForm from "../../../../components/advance/AuthModelForm/AuthModelForm";
import StackComponent from "../../../../components/atoms/StackComponent";
import AuthmodelSubHeading from "../../../../components/advance/AuthModelSubHeading/AuthmodelSubHeading";
import AuthModelSubPageLayout from "../../../../components/advance/AuthModelSubPageLayout";
import AuthModelsLayout from "../../../../components/advance/AuthModelsLayout";
import ModalComponent from "../../../../components/molecules/modal/ModalComponent";
import PasswordField from "../../../../components/atoms/inputFields/PasswordField";
import { FormHelperText } from "@mui/material";
import { changePassword } from "../../../../api/api-services";
import { useEffect } from "react";

const ResetPassword = ({ resetModal, setResetModal }) => {
  const [loader, setLoader] = useState(false);
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [isError, setIsError] = useState(false);

  const SignUpSchema = Yup.object().shape({
    password: Yup.string()
      .required("Enter your password")
      .min(12, "Password must be at least 12 characters long")
      .matches(/[a-zA-Z]/, "Password must contain letters")
      .matches(/[A-Z]/, "Password must contain an uppercase letter")
      .matches(/[a-z]/, "Password must contain a lowercase letter")
      .matches(/\d/, "Password must contain a number")
      .matches(
        /(?=.*[!.@#$%^&*])/,
        "Password must contain a special character",
      ),
    oldPassword: Yup.string()
      .required("Enter your password")
      .min(12, "Password must be at least 12 characters long")
      .matches(/[a-zA-Z]/, "Password must contain letters")
      .matches(/[A-Z]/, "Password must contain an uppercase letter")
      .matches(/[a-z]/, "Password must contain a lowercase letter")
      .matches(/\d/, "Password must contain a number")
      .matches(
        /(?=.*[!.@#$%^&*])/,
        "Password must contain a special character",
      ),
    confirmPassword: Yup.string()
      .required("Please confirm your password.")
      .oneOf([Yup.ref("password"), null], "Passwords must match."),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: SignUpSchema,

    onSubmit: (values) => {
      setLoader(true);

      const payload = {
        currentPassword: values.oldPassword,
        newPassword: values.password,
      };

      const encryption = {
        data: passwordEncryption(JSON.stringify(payload)),
      };
      changePassword(encryption)
        .then((res) => {
          const result = res?.data;
          if (result?.success === true) {
            setResetModal(false);
            toast.success("Password changed successfully");
            // 	setIsError(false);
          } else {
            // setErrorMessage(result.message);
            // setIsError(true);
            toast.error(result.message);
          }
        })
        .catch(() => {
          toast.error("Something went wrong");
          // setIsError(true);
        })
        .finally(() => {
          setLoader(false);
        });
    },
  });

  // Effect to reset form when modal opens
  useEffect(() => {
    if (resetModal) {
      formik.resetForm();
    }
  }, [resetModal]);

  const isInvalidPassword =
    formik.touched.password && Boolean(formik.errors.password);
  const isInvalidOldPassword =
    formik.touched.oldPassword && Boolean(formik.errors.oldPassword);
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
  const customHelperTextOld = (
    <FormHelperText
      sx={{
        ml: "2px",
        mt: "5px",
        color: isInvalidOldPassword ? "red" : "auto",
      }}
    >
      <TypographyComp
        component="span"
        color={isInvalidOldPassword ? "error.main" : "primary.main"}
        sx={{ fontWeight: "inherit", fontSize: "inherit" }}
      >
        {formik.values.oldPassword.length}
      </TypographyComp>
      /12. {isInvalidOldPassword ? formik.errors.oldPassword : null}
    </FormHelperText>
  );
  const buttonText = loader ? "Sending..." : "Continue";
  const isFormEmpty =
    !formik.values.password &&
    !formik.values.oldPassword &&
    !formik.values.confirmPassword;
  return (
    <>
      <div>
        <ModalComponent
          width={"454px"}
          padding={"40px 48px"}
          responsivePadding={"40px 16px"}
          open={resetModal}
          hideInMobileView={true}
          onClose={() => {
            setResetModal(false);
          }}
        >
          <AuthModelsLayout>
            <AuthModelForm formAction={formik.handleSubmit}>
              <AuthModelSubPageLayout
                heading="Change Password"
                hideButtonInMobile={true}
                hideButton
              >
                <StackComponent
                  {...{
                    direction: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    spacing: 0,
                    mt: "0 !important",
                  }}
                >
                  <AuthmodelSubHeading>Change Password</AuthmodelSubHeading>
                  <TypographyComp
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      fontSize: "18px",
                      lineHeight: "22px",
                      color: "#606062",
                    }}
                  >
                    Enter your previous password to change password
                  </TypographyComp>
                </StackComponent>
                <PasswordField
                  fullWidth
                  id="oldPassword"
                  placeholder="Old Password"
                  name="oldPassword"
                  label="Old Password"
                  value={formik.values.oldPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.oldPassword &&
                    Boolean(formik.errors.oldPassword)
                  }
                  helperText={
                    formik.touched.oldPassword && formik.errors.oldPassword
                  }
                  customHelperText={customHelperTextOld}
                />
                <PasswordField
                  fullWidth
                  id="password"
                  placeholder="New Password"
                  name="password"
                  label="New Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
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
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                />

                <ButtonComp
                  sx={{ mt: 4, mb: 2, color: "#ffffff !important" }}
                  fullWidth
                  type="submit"
                  size="normal"
                  variant="contained"
                  color="primary"
                  disabled={
                    Object.keys(formik.errors).length > 0 ||
                    isFormEmpty ||
                    loader
                  }
                >
                  {buttonText}
                </ButtonComp>
              </AuthModelSubPageLayout>
            </AuthModelForm>
          </AuthModelsLayout>
        </ModalComponent>
      </div>
    </>
  );
};

ResetPassword.propTypes = {
  resetModal: PropTypes.bool,
  setResetModal: PropTypes.any,
};

export default ResetPassword;
