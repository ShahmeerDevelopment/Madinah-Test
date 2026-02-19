import { useEffect } from "react";
import { useGdprConsent } from "./useGdprConsent";

const useActiveCampaignTracking = () => {
  const { hasMarketingConsent, isLoading, isNecessaryOnlyMode } =
    useGdprConsent();

  useEffect(() => {
    // Don't initialize tracking if only necessary cookies are allowed
    if (isLoading || isNecessaryOnlyMode()) {
      return;
    }

    // Only proceed if marketing consent is given
    if (!hasMarketingConsent()) {
      return;
    }

    // ActiveCampaign tracking code setup
    (function (e, t, o, n, p, r, i) {
      e.visitorGlobalObjectAlias = n;
      e[e.visitorGlobalObjectAlias] =
        e[e.visitorGlobalObjectAlias] ||
        function () {
          (e[e.visitorGlobalObjectAlias].q =
            e[e.visitorGlobalObjectAlias].q || []).push(arguments);
        };
      e[e.visitorGlobalObjectAlias].l = new Date().getTime();
      r = t.createElement("script");
      r.src = o;
      r.async = true;
      i = t.getElementsByTagName("script")[0];
      i.parentNode.insertBefore(r, i);
    })(
      window,
      document,
      "https://diffuser-cdn.app-us1.com/diffuser/diffuser.js",
      "vgo"
    );

    // Initialize your ActiveCampaign account and default tracking
    if (window && window.vgo) {
      window.vgo("setAccount", process.env.NEXT_PUBLIC_FACEBOOK_TRACKING_ID);
      window.vgo("setTrackByDefault", true);
      window.vgo("process");
    }
  }, [hasMarketingConsent, isLoading, isNecessaryOnlyMode]);

  // Listen for tracking stopped events to disable ActiveCampaign
  useEffect(() => {
    const handleTrackingStopped = () => {
      if (window && window.vgo) {
        window.vgo("setTrackByDefault", false);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("trackingStopped", handleTrackingStopped);
      return () => {
        window.removeEventListener("trackingStopped", handleTrackingStopped);
      };
    }
  }, []);
};

export default useActiveCampaignTracking;
