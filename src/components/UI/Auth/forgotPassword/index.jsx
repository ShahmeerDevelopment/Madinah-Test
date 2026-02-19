"use client";

import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { forgotPassword } from "@/api";
import passwordEncryption from "@/utils/encryptionData";
import { changeModal, resetEmail } from "@/store/slices/authSlice";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import AuthModelForm from "@/components/advance/AuthModelForm/AuthModelForm";
import StackComponent from "@/components/atoms/StackComponent";
import AuthmodelSubHeading from "@/components/advance/AuthModelSubHeading/AuthmodelSubHeading";
import AuthModelSubPageLayout from "@/components/advance/AuthModelSubPageLayout";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const SignUpSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email")
      .required("Email is required fields"),
  });

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: SignUpSchema,

    onSubmit: (values) => {
      setLoader(true);

      const payload = { email: values.email };

      const encryption = {
        data: passwordEncryption(JSON.stringify(payload)),
      };
      forgotPassword(encryption)
        .then((res) => {
          const result = res?.data;
          if (result?.success === true) {
            dispatch(resetEmail(values.email));
            dispatch(changeModal(3));
            setIsError(false);
          } else {
            setErrorMessage(result.message);

            setIsError(true);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Something went wrong");
          setIsError(true);
        })
        .finally(() => {
          setLoader(false);
        });
    },
  });
  const buttonText = loader ? `${"Sending"}...` : "Continue";
  const isFormEmpty = !formik.values.email;
  return (
    <>
      <AuthModelForm formAction={formik.handleSubmit}>
        <AuthModelSubPageLayout
          heading={"Password recovery"}
          hideButtonInMobile={true}
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
            <AuthmodelSubHeading>{"Password recovery"}</AuthmodelSubHeading>
            <TypographyComp
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: "18px",
                lineHeight: "22px",
                color: "#606062",
              }}
            >
              {"Enter the"}&nbsp;
              {"email"}&nbsp;
              {"to which your account is linked"}
            </TypographyComp>
          </StackComponent>
          <TextFieldComp
            containerStyleOverrides={{
              "& label": {
                textTransform: "capitalize",
              },
            }}
            fontColor="rgba(96, 96, 98, 1)"
            fullWidth={true}
            id="email"
            name="email"
            label={"Email"}
            isRequired={true}
            placeholder={"Enter your email"}
            value={formik.values.email}
            onChange={(e) => {
              formik.handleChange(e);
              if (e.target.value === "" || e.target.value) {
                setIsError(false);
                setErrorMessage(null);
              }
            }}
            onBlur={formik.handleBlur}
            error={
              (formik.touched.email && Boolean(formik.errors.email)) || isError
            }
            helperText={
              (formik.touched.email && formik.errors.email) || errorMessage
            }
          />
          <BoxComponent sx={{ width: "100%", padding: "5px", mt: 4, mb: 2 }}>
            <ButtonComp
              sx={{ color: "#ffffff !important" }}
              fullWidth
              type="submit"
              size="normal"
              variant="contained"
              color="primary"
              disabled={
                Object.keys(formik.errors).length > 0 || isFormEmpty || loader
              }
            >
              {buttonText}
            </ButtonComp>
          </BoxComponent>
        </AuthModelSubPageLayout>
      </AuthModelForm>
    </>
  );
};

export default ForgotPassword;
