"use client";

import React, { useEffect, useMemo, startTransition } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@mui/material/styles";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import { store } from "@/store/store";

import { theme } from "@/config/customTheme";
import { generateRandomToken } from "@/utils/helpers";

// Helper to get unix timestamp (replaces dayjs().unix())
const getUnixTimestamp = () => Math.floor(Date.now() / 1000);

// Lazy load components
// const Loader = dynamic(() => import("@/components/UI/Loader/Loader"));
// GBProvider must be imported directly to render children during SSR
import GBProvider from "./GBProviderAppRouter";
const DeferredScripts = dynamic(
  () => import("@/components/performance/DeferredScripts"),
  { ssr: false },
);
// Import PostHogWrapper directly - it handles SSR gracefully and must render children
import PostHogWrapper from "@/components/performance/PostHogWrapper";

// Store slices imports
import {
  configureCategories,
  configureCountries,
} from "@/store/slices/metaSlice";
import {
  addUserDetails,
  isAdminLogin,
  isLoginHandler,
  isLoginModalOpen,
  login,
  resetUserDetails,
  logout as storeLogout,
} from "@/store/slices/authSlice";
import { resetValues } from "@/store/slices/mutateCampaignSlice";
import { resetActiveStepper } from "@/store/slices/campaignSlice";
import { updateAuthValues } from "@/store/slices/mutateAuthSlice";

// API imports
import { getCategoriesList, getCountriesList } from "@/api";
import { getToken } from "@/api/post-api-services";
import { getProfile } from "@/api/get-api-services";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const token = useSelector((state) => state.auth.token);

  const isTokenExpired = React.useCallback((token) => {
    if (!token) return true;
    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      return exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }, []);

  // Sync auth state from cookies whenever pathname changes
  useEffect(() => {
    const cookieToken = getCookie("token");
    const refreshToken = getCookie("madinah_refresh");
    
    // If we have a valid token in cookies but Redux state is not set, initialize it
    if (cookieToken && !isLogin) {
      if (!isTokenExpired(cookieToken)) {
        dispatch(isLoginHandler(true));
        dispatch(login(cookieToken));
        
        // Fetch profile if we have refresh token
        if (refreshToken) {
          getProfile()
            .then((res) => {
              const profileDetails = res?.data?.data;
              if (profileDetails) {
                startTransition(() => {
                  dispatch(addUserDetails(profileDetails));
                  dispatch(updateAuthValues(profileDetails));
                });
              }
            })
            .catch((err) => {
              console.error("Failed to fetch profile:", err.message);
            });
        }
      }
    }
  }, [pathname, dispatch, isLogin, isTokenExpired]); // Re-run when pathname changes

  // Initialize external ID and A/B testing cookie
  useEffect(() => {
    // Only run in browser (skip during SSR/prerender)
    if (typeof window === "undefined") return;

    const cookieExternalId = getCookie("externalId");

    if (!cookieExternalId) {
      const externalId = generateRandomToken("a", 5) + getUnixTimestamp();
      setCookie("externalId", externalId);
    }

    const abTestingCookie = getCookie("abtesting");
    if (!abTestingCookie) {
      setCookie("abtesting", "donation_version_1");
    }

    if (!getCookie("distinctId")) {
      const distinctId = generateRandomToken("d", 5) + getUnixTimestamp();
      setCookie("distinctId", distinctId);
    }
  }, []);

  // Fetch countries and categories - use startTransition to mark as non-urgent
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesResult, categoriesResult] = await Promise.allSettled([
          getCountriesList(),
          getCategoriesList(),
        ]);
        // Use startTransition to prevent blocking main thread during state updates
        startTransition(() => {
          if (countriesResult.status === "fulfilled") {
            dispatch(
              configureCountries(countriesResult.value?.data?.data.countries),
            );
          }
          if (categoriesResult.status === "fulfilled") {
            dispatch(
              configureCategories(
                categoriesResult.value?.data?.data.categories,
              ),
            );
          }
        });
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    // Delay non-critical data fetching significantly to reduce TBT
    // Use requestIdleCallback for better scheduling
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => fetchData(), { timeout: 5000 });
      return () => window.cancelIdleCallback(idleId);
    }
    const timeoutId = setTimeout(fetchData, 2000);
    return () => clearTimeout(timeoutId);
  }, [dispatch]);

  // Token refresh and profile fetch - use startTransition to reduce TBT
  useEffect(() => {
    const refreshToken = getCookie("madinah_refresh");
    const token = getCookie("token");
    const payload = { refreshToken };

    // Initialize auth state from cookies immediately
    if (token) {
      dispatch(isLoginHandler(true));
      dispatch(login(token));
    }

    if (refreshToken && !isTokenExpired(refreshToken)) {
      getToken(payload).then((response) => {
        // Wrap state updates in startTransition to mark as non-urgent
        startTransition(() => {
          if (response?.data?.success) {
            setCookie("token", response.data?.data?.accessToken);
            setCookie("madinah_refresh", response.data?.data?.refreshToken);
            dispatch(isLoginHandler(true));
            dispatch(login(response?.data?.data?.accessToken));
          } else {
            deleteCookie("token");
            deleteCookie("madinah_refresh");
            dispatch(storeLogout());
            dispatch(isAdminLogin(false));
            dispatch(isLoginHandler(false));
            dispatch(resetValues());
            dispatch(resetActiveStepper(0));
            dispatch(resetUserDetails());
            dispatch(isLoginModalOpen(true));
          }
        });
      });
    }

    if (token && refreshToken) {
      getProfile()
        .then((res) => {
          const profileDetails = res?.data?.data;
          if (profileDetails) {
            // Wrap profile state updates in startTransition
            startTransition(() => {
              dispatch(addUserDetails(profileDetails));
              dispatch(updateAuthValues(profileDetails));
            });
          }
        })
        .catch((err) => {
          console.error(err.message);
        });
    }

    const handleTokenExpired = () => {
      dispatch(storeLogout());
      dispatch(isAdminLogin(false));
      dispatch(isLoginHandler(false));
      dispatch(resetValues());
      dispatch(resetActiveStepper(0));
      dispatch(resetUserDetails());
    };

    const handleShowLoginModal = () => {
      dispatch(isLoginModalOpen(true));
    };

    window.addEventListener("tokenExpired", handleTokenExpired);
    window.addEventListener("showLoginModal", handleShowLoginModal);

    return () => {
      window.removeEventListener("tokenExpired", handleTokenExpired);
      window.removeEventListener("showLoginModal", handleShowLoginModal);
    };
  }, [dispatch, isTokenExpired]);



  return (
    <>
      {/* {isLoading ? (
        <Loader />
      ) : ( */}
      <PostHogWrapper>
        <React.Suspense fallback={null}>
          {children}
          <DeferredScripts />
        </React.Suspense>
      </PostHogWrapper>
      {/* )} */}
    </>
  );
}

export function Providers({ children }) {
  const [isClient, setIsClient] = React.useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
    [],
  );

  // Don't render providers until client-side
  // if (!isClient) {
  //   return null;
  // }

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={clientId}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            {/* <GBProvider> */}
            <Toaster />
            <React.Suspense fallback={null}>
              <AppInitializer>{children}</AppInitializer>
            </React.Suspense>
            {/* </GBProvider> */}
          </ThemeProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}
