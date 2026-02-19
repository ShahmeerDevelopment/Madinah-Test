/**
 * Dynamically loads payment-related scripts (Recurly and Apple Pay SDK)
 * Only loads when needed (when user clicks donate button)
 * to improve initial page load performance
 */

let recurlyLoaded = false;
let applePayLoaded = false;
let recurlyPromise = null;
let applePayPromise = null;

/**
 * Load Recurly script dynamically
 * @returns {Promise<void>}
 */
export const loadRecurlyScript = () => {
  if (recurlyLoaded) {
    return Promise.resolve();
  }

  if (recurlyPromise) {
    return recurlyPromise;
  }

  recurlyPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.recurly) {
      recurlyLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.recurly.com/v4/recurly.js";
    script.async = true;
    script.onload = () => {
      recurlyLoaded = true;
      resolve();
    };
    script.onerror = () => {
      recurlyPromise = null;
      reject(new Error("Failed to load Recurly script"));
    };
    document.head.appendChild(script);
  });

  return recurlyPromise;
};

/**
 * Load Apple Pay SDK script dynamically
 * @returns {Promise<void>}
 */
export const loadApplePayScript = () => {
  if (applePayLoaded) {
    return Promise.resolve();
  }

  if (applePayPromise) {
    return applePayPromise;
  }

  applePayPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.ApplePaySession || customElements.get("apple-pay-button")) {
      applePayLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js";
    script.async = true;
    script.onload = () => {
      applePayLoaded = true;
      resolve();
    };
    script.onerror = () => {
      applePayPromise = null;
      reject(new Error("Failed to load Apple Pay SDK"));
    };
    document.head.appendChild(script);
  });

  return applePayPromise;
};

/**
 * Load both payment scripts
 * @returns {Promise<void[]>}
 */
export const loadPaymentScripts = () => {
  return Promise.all([loadRecurlyScript(), loadApplePayScript()]);
};

/**
 * Check if payment scripts are loaded
 * @returns {boolean}
 */
export const arePaymentScriptsLoaded = () => {
  return recurlyLoaded && applePayLoaded;
};
