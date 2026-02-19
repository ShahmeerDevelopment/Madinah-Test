"use client";

import React, { useState } from "react";
import { signIn } from "@/api";
import toast from "react-hot-toast";
import { setCookie } from "cookies-next";
// import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import {
  addUserDetails,
  changeModal,
  isLoginHandler,
  isLoginModalOpen,
  login,
  userNameHandler,
} from "@/store/slices/authSlice";

import SignInForm from "./SignInForm";
import passwordEncryption from "@/utils/encryptionData";
import { campaignStepperIncrementHandler } from "@/store/slices/campaignSlice";
import { getProfile } from "@/api/get-api-services";
import { updateAuthValues } from "@/store/slices/mutateAuthSlice";
import AuthmodelSubHeading from "@/components/advance/AuthModelSubHeading/AuthmodelSubHeading";
import AuthModelSecondaryAction from "@/components/advance/AuthModelSecondaryAction/AuthModelSecondaryAction";
import SocialAuthBtnList from "@/components/advance/SocialAuthBtnList";
import WelcomeToMadinahAuthHeading from "@/components/advance/AuthModelHeading";

const SignIn = () => {
  const dispatch = useDispatch();
  // const router = useRouter();

  const isCreateCampaign = useSelector(
    (state) => state.campaign.isCreateCampaign,
  );

  const [loader, setLoader] = useState(null);
  const [invalidCredentialsError, setInvalidCredentialsError] = useState(false);

  const throwErrorInvalidCredentials = () => setInvalidCredentialsError(true);
  const removeInvalidCredentialsError = () => setInvalidCredentialsError(false);

  const handleSubmit = (payload) => {
    setLoader(true);
    const encryption = {
      data: passwordEncryption(JSON.stringify(payload)),
    };

    signIn(encryption)
      .then((res) => {
        const result = res?.data;
        if (result?.success === true) {
          removeInvalidCredentialsError();
          const firstName = result?.data.firstName;
          const lastName = result?.data.lastName;
          const fullName = firstName + " " + lastName;
          setCookie("token", result.data.accessToken, {
            sameSite: "strict",
          });
          setCookie("madinah_refresh", result.data.refreshToken, {
            sameSite: "strict",
          });
          setCookie("name", fullName, { sameSite: "strict" });

          dispatch(login(result.data.accessToken));
          // startTransition(() => {
          dispatch(isLoginHandler(result.success));
          dispatch(userNameHandler(fullName));
          // localStorage.setItem("name", fullName);
          toast.success("Successfully logged in");
          getProfile().then((res) => {
            const profileDetails = res?.data?.data;
            if (profileDetails) {
              dispatch(addUserDetails(profileDetails));
              dispatch(updateAuthValues(profileDetails));
            }
          });
          if (isCreateCampaign) {
            dispatch(isLoginModalOpen(false));
            dispatch(campaignStepperIncrementHandler(1));
            // router.push("/create-campaign");
          } else {
            dispatch(isLoginModalOpen(false));
            // router.push("/dashboard");
            //   navigate("/dashboard");
          }
          // });
        } else {
          if (result?.message === "Invalid credentials") {
            throwErrorInvalidCredentials();
          } else {
            toast.error(result?.message);
          }
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <>
      <WelcomeToMadinahAuthHeading />
      <AuthmodelSubHeading>{"Sign in to the platform"}</AuthmodelSubHeading>
      <SignInForm
        removeInvalidCredentialsError={removeInvalidCredentialsError}
        onSubmit={handleSubmit}
        invalidCredentialsError={invalidCredentialsError}
        loader={loader}
      // t={t}
      />
      <SocialAuthBtnList onSuccess={handleSubmit} />
      <AuthModelSecondaryAction
        mainText={"Don't have an account yet?"}
        actionText={"Sign up"}
        action={() => dispatch(changeModal(1))}
      />
    </>
  );
};

export default SignIn;
