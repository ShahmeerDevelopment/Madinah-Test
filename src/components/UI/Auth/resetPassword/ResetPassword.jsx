"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { resetPassword, verifyToken } from "@/api";
import ResetPasswordForm from "./ResetPasswordForm";
import passwordEncryption from "@/utils/encryptionData";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { changeModal, isLoginModalOpen } from "@/store/slices/authSlice";
import AuthmodelSubHeading from "@/components/advance/AuthModelSubHeading/AuthmodelSubHeading";
import TypographyComp from "@/components/atoms/typography/TypographyComp";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const router = useRouter(); // Use useRouter hook
  const searchParms = useSearchParams();
  const tokenFromURL = searchParms.get("token");
  const [tokenValue, setTokenValue] = useState("");
  const [loader, setLoader] = useState(false);

  const resetPasswordHandler = (values) => {
    setLoader(true);
    const payload = {
      password: values.password,
      token: tokenValue,
    };

    const encryption = {
      data: passwordEncryption(JSON.stringify(payload)),
    };
    resetPassword(encryption)
      .then((res) => {
        const result = res?.data;

        if (result.success) {
          toast.success(result.message);
          dispatch(changeModal(0));
          dispatch(isLoginModalOpen(true));
        } else {
          toast.error(result.message);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false); // Set loader to false when the API call is completed or failed
      });
  };

  const verifyTokenHandler = (payload) => {
    const sendTokenAsPayload = { token: payload };
    verifyToken(sendTokenAsPayload)
      .then((res) => {
        const result = res?.data;
        if (!result.success) {
          alert(result.message);
          setTimeout(() => {
            router.push("/");
          }, 1500);
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (tokenFromURL) {
      setTokenValue(tokenFromURL);
      verifyTokenHandler(tokenFromURL); // If you need to verify the token
    }
  }, [tokenFromURL]);
  return (
    <BoxComponent
      sx={{
        width: "100%",
        minHeight: "50vh", // Changed from height to minHeight
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingY: 2, // Added padding for better spacing
      }}
    >
      <BoxComponent
        sx={{
          width: {
            xs: "95vw",
            sm: "375px",
            md: "450px",
          },
        }}
      >
        <AuthmodelSubHeading>Password recovery</AuthmodelSubHeading>
        <TypographyComp
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: "18px",
            lineHeight: "22px",
            color: "#424243",
          }}
        >
          Passwords must not be the same as those previously used on this
          platform
        </TypographyComp>
        <ResetPasswordForm
          tokenValue={tokenValue}
          loader={loader}
          onSubmit={resetPasswordHandler}
        />
      </BoxComponent>
    </BoxComponent>
  );
};

export default ResetPassword;
