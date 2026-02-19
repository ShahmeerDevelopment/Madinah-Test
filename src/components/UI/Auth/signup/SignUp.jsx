"use client";

import React, { useState, useEffect, useCallback } from "react";
import SignUpForm from "./SignUpForm";
import passwordEncryption from "@/utils/encryptionData";
import { signUp } from "@/api";
import toast from "react-hot-toast";

import { changeModal, resetEmail } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";

import AuthmodelSubHeading from "@/components/advance/AuthModelSubHeading/AuthmodelSubHeading";
import AuthModelSecondaryAction from "@/components/advance/AuthModelSecondaryAction/AuthModelSecondaryAction";
import SocialAuthBtnList from "@/components/advance/SocialAuthBtnList";
import WelcomeToMadinahAuthHeading from "@/components/advance/AuthModelHeading";
import { verifyGoogleReCaptcha } from "@/api/post-api-services";

const useRecaptcha = () => {
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  useEffect(() => {
    // Check if the reCAPTCHA script is already loaded
    if (window.grecaptcha && window.grecaptcha.execute) {
      setRecaptchaLoaded(true);
      return;
    }

    // Function to handle script loading
    const handleRecaptchaLoad = () => {
      setRecaptchaLoaded(true);
    };

    // Add callback to window object for script to call when loaded
    window.onRecaptchaLoad = handleRecaptchaLoad;

    // Load reCAPTCHA script if not already loaded
    const script = document.createElement("script");
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}&onload=onRecaptchaLoad`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Clean up
      document.head.removeChild(script);
      delete window.onRecaptchaLoad;
    };
  }, []);

  // Function to hide the reCAPTCHA badge
  const hideRecaptchaBadge = useCallback(() => {
    const recaptchaBadge = document.querySelector(".grecaptcha-badge");
    if (recaptchaBadge) {
      recaptchaBadge.style.visibility = "hidden";
    }
  }, []);

  const executeRecaptcha = useCallback(
    async (action) => {
      if (!recaptchaLoaded) {
        throw new Error("reCAPTCHA not loaded yet");
      }

      try {
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        const token = await window.grecaptcha.enterprise.execute(siteKey, {
          action,
        });
        return token;
      } catch (error) {
        console.error("reCAPTCHA execution error:", error);
        throw error;
      }
    },
    [recaptchaLoaded]
  );

  return { executeRecaptcha, recaptchaLoaded, hideRecaptchaBadge };
};

const SignUpContent = () => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [emailAlreadyExistsError, setEmailAlreadyExistsError] = useState(false);
  const { executeRecaptcha, recaptchaLoaded, hideRecaptchaBadge } =
    useRecaptcha();

  const removeErrorEmailAlreadyExists = () => setEmailAlreadyExistsError(false);

  // Function to verify reCAPTCHA token with the server
  const verifyRecaptchaToken = async (token) => {
    try {
      // Call your own backend API that will verify the token with Google
      const response = await verifyGoogleReCaptcha(token);
      // const data = await response.json();
      return [response?.data?.success, response?.data?.message];
    } catch (error) {
      console.error("reCAPTCHA verification error:", error);
      return false;
    }
  };

  const signUpHandler = async ({ payload, resetForm }) => {
    if (!recaptchaLoaded) {
      toast.error("reCAPTCHA not available");
      return;
    }

    setLoader(true);

    try {
      // Execute reCAPTCHA and get token
      const recaptchaToken = await executeRecaptcha();

      // console.log("recaptchaToken", JSON.stringify({ recaptchaToken }));

      // First verify the reCAPTCHA token
      const [isRecaptchaValid, recaptchaMessage] =
        await verifyRecaptchaToken(recaptchaToken);
      if (!isRecaptchaValid) {
        toast.error(recaptchaMessage);
        setLoader(false);
        return;
      }

      // Hide reCAPTCHA badge after successful validation
      hideRecaptchaBadge();

      const encryption = {
        data: passwordEncryption(JSON.stringify(payload)),
      };

      // Only proceed with signup after reCAPTCHA verification
      const res = await signUp(encryption);

      if (res?.status === 409) {
        setEmailAlreadyExistsError(true);
      } else if (
        res?.status === 400 &&
        res?.data?.message?.includes("reCAPTCHA")
      ) {
        toast.error(res?.data?.message || "reCAPTCHA verification failed");
      } else {
        const result = res?.data;
        if (result?.success === true) {
          dispatch(resetEmail(payload.email));
          dispatch(changeModal(4));
          resetForm();
        } else {
          toast.error(result?.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <WelcomeToMadinahAuthHeading />
      <AuthmodelSubHeading>{"Create an account"}</AuthmodelSubHeading>
      <SignUpForm
        emailAlreadyExistsError={emailAlreadyExistsError}
        removeErrorEmailAlreadyExists={removeErrorEmailAlreadyExists}
        onSignUpSubmit={signUpHandler}
        loader={loader}
      />
      <SocialAuthBtnList mb="20px" />
      <AuthModelSecondaryAction
        mainText={"Already have an account?"}
        actionText={"Sign in"}
        action={() => dispatch(changeModal(0))}
      />
    </>
  );
};

// No need for GoogleReCaptchaProvider wrapping anymore
const SignUp = () => {
  return <SignUpContent />;
};

export default SignUp;
