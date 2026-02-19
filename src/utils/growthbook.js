import { GrowthBook } from "@growthbook/growthbook";
import { useEffect, useState } from "react";

// Initialize GrowthBook with empty values - will be configured during runtime
export const growthbook = new GrowthBook({
  apiHost:
    process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST || "https://cdn.growthbook.io",
  clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY || "",
  navigate: (url) => {
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
  },
  navigateDelay: 0,
  trackingCallback: (experiment, result) => {
    if (!experiment?.key || !result?.key) return;

    localStorage.setItem("experimentKey", experiment.key);
    localStorage.setItem("variationKey", result.key);

    if (window.gtag) {
      window.gtag("event", "experiment_viewed", {
        experiment_id: experiment.key,
        variation_id: result.key,
      });
    }
    if (window.posthog) {
      window.posthog.capture("$experiment_viewed", {
        experiment_id: experiment.key,
        variation_id: result.key,
      });
    }
  },
});

let loadFeaturesPromise = null;

// Function to load features and return a promise
const loadFeatures = async () => {
  if (!loadFeaturesPromise) {
    loadFeaturesPromise = growthbook.loadFeatures().catch((e) => {
      console.error("Failed to load GrowthBook features", e);
      loadFeaturesPromise = null; // Reset on error
      throw e;
    });
  }
  return loadFeaturesPromise;
};

// Function to update the navigation method with Next.js router
export const setGrowthBookNavigation = (router) => {
  if (router) {
    growthbook.navigate = (url) => {
      router.push(url);
    };
  }
};

// Hook to use GrowthBook features in React components
export function useGrowthBook() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    loadFeatures()
      .then(() => {
        setReady(true);
      })
      .catch(() => {
        // Error already logged in loadFeatures
      });
  }, []);

  return { growthbook, ready };
}

// Function to force a specific variation for testing (development only)
export const forceExperimentVariation = (experimentKey, variationIndex) => {
  if (process.env.NODE_ENV !== "development") {
    console.warn("forceExperimentVariation should only be used in development");
    return;
  }
  
  if (!growthbook.forcedVariations) {
    growthbook.forcedVariations = {};
  }
  
  growthbook.forcedVariations[experimentKey] = variationIndex;
  growthbook.setForcedVariations(growthbook.forcedVariations);
};

// Export the loadFeatures function to be used outside of React components
export { loadFeatures };
