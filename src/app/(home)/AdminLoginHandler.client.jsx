"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

import {
  addUserDetails,
  isAdminLogin,
  isLoginHandler,
  login,
  resetUserDetails,
  logout as storeLogout,
} from "@/store/slices/authSlice";
import { resetValues } from "@/store/slices/mutateCampaignSlice";
import { resetActiveStepper } from "@/store/slices/campaignSlice";
import { updateAuthValues } from "@/store/slices/mutateAuthSlice";

import { logout } from "@/api";
import { getProfile } from "@/api/get-api-services";

export default function AdminLoginHandler() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const invitedUser = useSelector((state) => state.auth.invitedUser);

  // Handle Token Login from Admin
  useEffect(() => {
    const handleMessage = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenOld = getCookie("token");

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

      const fetchAndSetUserProfile = async () => {
        try {
          const res = await getProfile();
          const profileDetails = res?.data?.data;
          if (profileDetails) {
            dispatch(addUserDetails(profileDetails));
            dispatch(updateAuthValues(profileDetails));
            if (res?.data?.success) {
              window.history.replaceState(null, "", window.location.pathname);
            }
          }
        } catch (err) {
          console.error(err.message);
        }
      };

      const logoutAndClearStorage = async (
        token,
        refreshTokenNew,
        fullName,
        isAdmin,
      ) => {
        if (tokenOld) {
          await logout();
          dispatch(storeLogout());
          clearLocalStorage();
        }
        setLocalStorage(token, refreshTokenNew, fullName);
        dispatch(isLoginHandler(true));
        
        // Check for "true" string explicitly as URL params are strings
        if (isAdmin === "true" || isAdmin === true) {
          dispatch(isAdminLogin(true));
          // Force a hard redirect to ensure all client state (Navbar etc.) is fresh
          window.location.href = "/dashboard";
          return; // Stop execution to let the page reload
        }
        
        if (
          pathname !== "/email-verification" &&
          pathname !== "/reset-password" &&
          pathname !== "/guest-user"
        ) {
          await fetchAndSetUserProfile();
        }
      };

      const setNewTokens = async () => {
        const token = urlParams.get("token");
        const refreshTokenNew = urlParams.get("refreshToken");
        const fullName = urlParams.get("fullName");
        const isAdmin = urlParams.get("isAdmin");


        if (
          token &&
          !invitedUser &&
          pathname !== "/invite-user" &&
          pathname !== "/email-verification" &&
          pathname !== "/reset-password" &&
          pathname !== "/guest-user"
        ) {
          logoutAndClearStorage(token, refreshTokenNew, fullName, isAdmin);
        }
      };

      if (
        pathname !== "/invite-user" &&
        pathname !== "/email-verification" &&
        pathname !== "/reset-password" &&
        pathname !== "/guest-user"
      ) {
        await setNewTokens();
      }
    };

    if (window.location.search !== "") {
      handleMessage();
    }

    // Also listen for postMessage if needed (legacy), though URL params are the main target here
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [dispatch, invitedUser, pathname, router]);

  return null;
}
