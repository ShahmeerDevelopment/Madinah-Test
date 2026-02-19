"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { guestUserLogin, logout } from "@/api/api-services";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import {
  addUserDetails,
  isAdminLogin,
  isLoginHandler,
  login,
  resetUserDetails,
  logout as storeLogout,
} from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
import { resetValues } from "@/store/slices/mutateCampaignSlice";
import { resetActiveStepper } from "@/store/slices/campaignSlice";
import { getProfile } from "@/api/get-api-services";
import { updateAuthValues } from "@/store/slices/mutateAuthSlice";

const GuestUser = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const guestToken = searchParams.get("guestToken");
  const code = searchParams.get("code");
  const email = searchParams.get("email");
  const [verificationStatus, setVerificationStatus] = useState({
    loading: true,
    verified: false,
  });

  useEffect(() => {
    // Wait for router to be ready
    // if (!router.isReady) {
    //   return;
    // }

    if (!email && !code) {
      setVerificationStatus({ loading: false, verified: false });
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await guestUserLogin({
          token: guestToken,
          code,
          email,
        });
        const result = response?.data;

        if (result.success) {
          setVerificationStatus({ loading: false, verified: true });
          logoutAndClearStorage(
            result?.data?.accessToken,
            result?.data?.refreshToken,
            result?.data?.firstName,
            result?.data?.lastName,
            result?.data?.transactionId
          );
          // router.push("/your-donations");
        } else {
          toast.error(result.message || "Verification failed");
          setVerificationStatus({ loading: false, verified: false });
        }
      } catch (error) {
        toast.error("An error occurred during verification");
        setVerificationStatus({ loading: false, verified: false });
      }
    };

    verifyEmail();
  }, [router]);

  const logoutAndClearStorage = async (
    token,
    refreshTokenNew,
    firstName,
    lastName,
    transactionId
  ) => {
    const fullName = `${firstName} ${lastName}`;
    const tokenOld = getCookie("token");
    if (tokenOld) {
      await logout();
      dispatch(storeLogout());
      clearLocalStorage();
    }
    setLocalStorage(token, refreshTokenNew, fullName);
    dispatch(isLoginHandler(true));

    await fetchAndSetUserProfile(transactionId);
  };

  const fetchAndSetUserProfile = async (transactionId) => {
    try {
      const res = await getProfile();
      const profileDetails = res?.data?.data;
      if (profileDetails) {
        dispatch(addUserDetails(profileDetails));
        dispatch(updateAuthValues(profileDetails));
        if (res?.data?.success) {
          router.push(
            `/your-donations/details?id=${transactionId}&guest-user=true`
          );
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const clearLocalStorage = () => {
    deleteCookie("token");
    deleteCookie("madinah_refresh");
    deleteCookie("name");
    localStorage.clear();
    dispatch(storeLogout());
    dispatch(isAdminLogin(false));
    dispatch(isLoginHandler(false));
    dispatch(resetValues());
    dispatch(resetActiveStepper(0));
    dispatch(resetUserDetails());
  };

  const setLocalStorage = (token, newRefreshToken, fullName) => {
    setCookie("token", token);
    setCookie("madinah_refresh", newRefreshToken);
    setCookie("name", fullName);
    dispatch(login(token));
  };

  return (
    <BoxComponent
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "100vh", // Ensures the component takes full viewport height
        padding: "20px", // Adds some padding for better spacing on smaller screens
      }}
    >
      <BoxComponent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: { xs: "100%", sm: "50%" },
          background: "#f9f9f9", // Optional: Adds a light background for better contrast
          padding: "40px", // Adds padding inside the box
          borderRadius: "8px", // Rounds the corners
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Adds a subtle shadow
        }}
      >
        {verificationStatus.loading ? (
          <CampaignHeading>Verifying link...</CampaignHeading>
        ) : (
          <>
            {verificationStatus.verified ? (
              <>
                <CampaignHeading>Your email has been verified!</CampaignHeading>
                <BoxComponent sx={{ mt: 3 }}>
                  <ButtonComp
                    fullWidth
                    variant="outlined"
                    onClick={() => router.push("/")}
                  >
                    Go to Home Page
                  </ButtonComp>
                </BoxComponent>
              </>
            ) : (
              <>
                <CampaignHeading>
                  Link is expired. New link sent to your email address.
                </CampaignHeading>
                <BoxComponent sx={{ mt: 3 }}>
                  <ButtonComp
                    fullWidth
                    variant="outlined"
                    onClick={() => router.push("/")}
                  >
                    Home Page
                  </ButtonComp>
                </BoxComponent>
              </>
            )}
          </>
        )}
      </BoxComponent>
    </BoxComponent>
  );
};

export default GuestUser;
