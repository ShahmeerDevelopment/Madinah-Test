/* eslint-disable @next/next/no-sync-scripts */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { appWithTranslation } from "next-i18next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import toast, { Toaster } from "react-hot-toast";

// Import core app requirements
import "@/styles/globals.css";
import localFont from "next/font/local";

const leagueSpartan = localFont({
  src: "../../public/fonts/league-spartan-latin.woff2",
  weight: "100 900",
  variable: "--font-league-spartan",
  display: "swap",
});

const notoSansArabic = localFont({
  src: "../../public/fonts/noto-sans-arabic.woff2",
  variable: "--font-noto-sans-arabic",
  weight: "400 700",
  display: "swap",
});

import { theme } from "@/config/customTheme";
import { wrapper } from "@/store/store";
import RootLayout from "@/Layouts/RootLayout";
import { getCategoriesList, getCountriesList, logout } from "@/api";
import { getToken } from "@/api/post-api-services";

// const ExperimentTester = dynamic(
//   () =>
//     process.env.NODE_ENV === "development"
//       ? import("@/components/UI/ExperimentTester")
//       : Promise.resolve(() => null),
//   { ssr: false }
// );

// Lazy load components that aren't needed immediately
const Loader = dynamic(() => import("@/components/UI/Loader/Loader"));
const GBProvider = dynamic(() => import("@/components/GrowthBookProvider"));
const DeferredScripts = dynamic(
  () => import("@/components/performance/DeferredScripts"),
  { ssr: false }
);
// PostHog wrapper - dynamically loaded to reduce initial bundle size (~100KB savings)
const PostHogWrapper = dynamic(
  () => import("@/components/performance/PostHogWrapper"),
  { ssr: false }
);

// Delayed analytics - load after LCP to stabilize Lighthouse scores
const DelayedAnalytics = dynamic(
  () => import("@/components/performance/DelayedAnalytics"),
  { ssr: false }
);

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
import { getProfile } from "@/api/get-api-services";
import { updateAuthValues } from "@/store/slices/mutateAuthSlice";
import { hideLoader, showLoader } from "@/store/slices/loaderSlice";
// import useActiveCampaignTracking from "@/hooks/useActiveCampaignTracking";
import { generateRandomToken } from "@/utils/helpers";
import dayjs from "dayjs";
import useActiveCampaignTracking from "@/hooks/useActiveCampaignTracking";
// import GBProvider from "@/components/GrowthBookProvider";
// import ConditionalAnalytics from "@/components/UI/ConditionalAnalytics";
// import {
//   gtagWithConsent,
//   posthogWithConsent,
// } from "@/utils/trackingPreventionUtils";
// import AuthSync from "@/components/advance/AuthSync";

// Define TrackingComponent outside the App component and memoize it
const TrackingComponent = React.memo(() => {
  if (process.env.NEXT_PUBLIC_FACEBOOK_TRACKING_ID) {
    // useActiveCampaignTracking();
  }
  return null;
});
TrackingComponent.displayName = "TrackingComponent"; // Optional: for better debugging

function App({ Component, pageProps: { ...pageProps } }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { store } = wrapper.useWrappedStore(pageProps);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const refreshToken = getCookie("madinah_refresh");
  const invitedUser = useSelector((state) => state.auth.invitedUser);
  const cookieExternalId = getCookie("externalId");

  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  );

  const Layout = Component.Layout || RootLayout;

  // Apply font CSS variables to body for MUI portals (modals, popovers, etc.)
  useEffect(() => {
    document.body.classList.add(
      leagueSpartan.variable,
      notoSansArabic.variable
    );
    return () => {
      document.body.classList.remove(
        leagueSpartan.variable,
        notoSansArabic.variable
      );
    };
  }, []);

  useEffect(() => {
    // Handle cookies synchronously (non-blocking)
    // const fetchCountries = async () => {
    //   try {
    //     const resCountries = await getCountriesList();
    //     dispatch(configureCountries(resCountries?.data?.data.countries));
    //   } catch (error) {
    //     console.error("Failed to fetch countries list:", error);
    //   }
    // };
    // const fetchCategories = async () => {
    //   try {
    //     const resCategories = await getCategoriesList();
    //     dispatch(configureCategories(resCategories?.data?.data.categories));
    //   } catch (error) {
    //     console.error("Failed to fetch categories list:", error);
    //   }
    // };
    if (!cookieExternalId) {
      const externalId = generateRandomToken("a", 5) + dayjs().unix();
      setCookie("externalId", externalId);
    }

    const abTestingCookie = getCookie("abtesting");
    if (!abTestingCookie) {
      let variant;
      variant = "donation_version_1";

      setCookie("abtesting", variant);
    }

    // Defer API calls to avoid blocking initial render
    const fetchData = async () => {
      try {
        // Use Promise.allSettled to prevent one failure from blocking others
        const [countriesResult, categoriesResult] = await Promise.allSettled([
          getCountriesList(),
          getCategoriesList(),
        ]);
        if (countriesResult.status === "fulfilled") {
          dispatch(
            configureCountries(countriesResult.value?.data?.data.countries)
          );
        } else {
          console.error(
            "Failed to fetch countries list:",
            countriesResult.reason
          );
        }

        if (categoriesResult.status === "fulfilled") {
          dispatch(
            configureCategories(categoriesResult.value?.data?.data.categories)
          );
        } else {
          console.error(
            "Failed to fetch categories list:",
            categoriesResult.reason
          );
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    // Defer API calls with setTimeout to not block initial render
    const timeoutId = setTimeout(fetchData, 100);
    return () => clearTimeout(timeoutId);
  }, [dispatch, cookieExternalId]);

  useEffect(() => {
    const handleMessage = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenOld = getCookie("token");

      const logoutAndClearStorage = async (
        token,
        refreshTokenNew,
        fullName,
        isAdmin
      ) => {
        if (tokenOld) {
          await logout();
          dispatch(storeLogout());
          clearLocalStorage();
        }
        console.log("pathname", router.pathname);
        setLocalStorage(token, refreshTokenNew, fullName);
        dispatch(isLoginHandler(true));
        if (isAdmin) {
          dispatch(isAdminLogin(true));
          router.push("/dashboard");
        }
        if (
          router.pathname !== "/email-verification" &&
          router.pathname !== "/reset-password" &&
          router.pathname !== "/guest-user"
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
          router.pathname !== "/invite-user" &&
          router.pathname !== "/email-verification" &&
          router.pathname !== "/reset-password" &&
          router.pathname !== "/guest-user"
        ) {
          logoutAndClearStorage(token, refreshTokenNew, fullName, isAdmin);
        }
      };

      if (
        router.pathname !== "/invite-user" &&
        router.pathname !== "/email-verification" &&
        router.pathname !== "/reset-password" &&
        router.pathname !== "/guest-user"
      ) {
        await setNewTokens();
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

    if (window.location.search !== "") {
      handleMessage();
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [dispatch, invitedUser, router.pathname]);

  const isTokenExpired = React.useCallback((token) => {
    if (!token) return true;
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    return exp * 1000 <= Date.now();
  }, []);
  useEffect(() => {
    const token = getCookie("token");
    const payload = {
      refreshToken: refreshToken,
    };
    if (refreshToken && !isTokenExpired(refreshToken)) {
      getToken(payload).then((response) => {
        if (response?.data?.success) {
          setCookie("token", response.data?.data?.accessToken);
          setCookie("madinah_refresh", response.data?.data?.refreshToken);
          dispatch(isLoginHandler(true));
          dispatch(login(response?.data?.data?.accessToken));
        } else {
          toast.error(
            "Something went wrong. Please try again or refresh the page"
          );
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
    }
    if (token && refreshToken) {
      dispatch(isLoginHandler(true));
      getProfile()
        .then((res) => {
          const profileDetails = res?.data?.data;
          if (profileDetails) {
            dispatch(addUserDetails(profileDetails));
            dispatch(updateAuthValues(profileDetails));
          }
        })
        .catch((err) => {
          console.error(err.message);
        });
    }

    const handleTokenExpired = () => {
      console.log("Token expired event received");
      dispatch(storeLogout());
      dispatch(isAdminLogin(false));
      dispatch(isLoginHandler(false));
      dispatch(resetValues());
      dispatch(resetActiveStepper(0));
      dispatch(resetUserDetails());
    };
    const handleShowLoginModal = () => {
      console.log("Show login modal event received");
      dispatch(isLoginModalOpen(true));
    };

    window.addEventListener("tokenExpired", handleTokenExpired);
    window.addEventListener("showLoginModal", handleShowLoginModal); // Check for localStorage flag to show login modal
    if (typeof window !== "undefined") {
      const shouldShowLoginModal = localStorage.getItem(
        "showLoginModalAfterRedirect"
      );
      if (shouldShowLoginModal === "true") {
        localStorage.removeItem("showLoginModalAfterRedirect");
        setTimeout(() => {
          dispatch(isLoginModalOpen(true));
        }, 500);
      }
    }

    return () => {
      window.removeEventListener("tokenExpired", handleTokenExpired);
      window.removeEventListener("showLoginModal", handleShowLoginModal);
    };
  }, [dispatch, refreshToken]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const showModal = urlParams.get("showLogin");

    if (showModal === "true") {
      const url = new URL(window.location);
      url.searchParams.delete("showLogin");
      window.history.replaceState({}, document.title, url.pathname);
      dispatch(isLoginModalOpen(true));
    }
  }, [dispatch]);

  const isLoading = useSelector((state) => state?.loader?.loading);
  const canonicalUrl = `https://www.madinah.com${router.asPath}`;
  // PostHog initialization is now handled by PostHogWrapper component

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENV === "development") {
      console.log("Running in development mode");
    } else if (process.env.NEXT_PUBLIC_ENV === "production") {
      console.log("Running in production mode");
    }

    if (!getCookie("distinctId")) {
      const distinctId = generateRandomToken("d", 5) + dayjs().unix();
      setCookie("distinctId", distinctId);
    }

    const handlePopState = () => {
      const currentPath = window.location.pathname;
      const redirectPaths = ["/donation-success"];

      if (redirectPaths.includes(currentPath)) {
        router.push("/");
      }
    };

    const handleRouteChangeStart = () => {
      dispatch(showLoader());
    };

    const handleRouteChangeComplete = () => {
      dispatch(hideLoader());
    };

    const handleRouteChangeError = () => {
      dispatch(hideLoader());
    };

    window.addEventListener("popstate", handlePopState);
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, [router, dispatch]);

  if (process.env.NEXT_PUBLIC_FACEBOOK_TRACKING_ID) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useActiveCampaignTracking();
  }

  // Expose consent-aware tracking functions to window for inline scripts
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.gtagWithConsent = gtagWithConsent;
      window.posthogWithConsent = posthogWithConsent;
    }
  }, []);

  if (typeof window !== "undefined") {
    // checks that we are client-side
    // Use proxy path for PostHog to route through /ph rewrites
    const apiHost = `${window.location.origin}/ph`;
    
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: apiHost, // Use proxy instead of direct PostHog URL
      ui_host: "https://us.posthog.com", // UI host for toolbar functionality
      // person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
      session_recording: {
        recordCanvas: true, // optional: for canvas-based apps
      },
      // Use localStorage instead of cookies for better privacy
      persistence: "localStorage",
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
      },
    });
  }

  return (
    <>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={clientId}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <GBProvider>
                <Toaster />

                <main
                  className={`${leagueSpartan.variable} ${notoSansArabic.variable}`}
                >
                  <Layout
                    withFooter={true}
                    withHeroSection={Component.withHeroSection}
                  >
                    <Head>
                      {/* Critical preconnects only (max 4) */}
                      <link
                        rel="preconnect"
                        href="https://madinah.s3.us-east-2.amazonaws.com"
                        crossOrigin="anonymous"
                      />
                      <link
                        rel="preconnect"
                        href="https://cdn.growthbook.io"
                        crossOrigin="anonymous"
                      />
                      {/* DNS prefetch for other domains - lower priority */}
                      <link
                        rel="dns-prefetch"
                        href="https://www.googletagmanager.com"
                      />
                      <link
                        rel="dns-prefetch"
                        href="https://connect.facebook.net"
                      />
                      <link rel="dns-prefetch" href="https://www.clarity.ms" />
                      <link rel="dns-prefetch" href="https://js.recurly.com" />
                      <title>Madinah</title>
                      <link rel="canonical" href={canonicalUrl} />
                      {/* Recurly CSS removed - loaded dynamically on payment pages */}
                      <noscript>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          height="1"
                          width="1"
                          style={{ display: "none" }}
                          src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
                          alt=""
                        />
                      </noscript>
                      <meta
                        name="description"
                        content="Trusted fundraising for all of life's moments..."
                      />
                      <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                      />
                      <meta
                        name="robots"
                        content={
                          process.env.NEXT_PUBLIC_ENV === "production"
                            ? "index, follow"
                            : "noindex, nofollow"
                        }
                      />
                      <link
                        rel="icon"
                        href="https://madinah.s3.us-east-2.amazonaws.com/favicon.ico"
                      />
                      <link
                        rel="shortcut icon"
                        href="https://madinah.s3.us-east-2.amazonaws.com/favicon.ico"
                      />
                    </Head>
                    {/* Removed redundant Script tags from here. They are handled at the end of the component. */}
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <PostHogWrapper>
                        <React.Suspense fallback={<Loader />}>
                          {" "}
                          <Component {...pageProps} />
                          {/* {process.env.NODE_ENV === "development" && (
                            <ExperimentTester />
                          )} */}
                          <TrackingComponent />
                          <DeferredScripts />
                        </React.Suspense>
                      </PostHogWrapper>
                    )}
                  </Layout>
                </main>
                <DelayedAnalytics />
              </GBProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </GoogleOAuthProvider>
      </Provider>
    </>
  );
}

export default appWithTranslation(wrapper.withRedux(App));
