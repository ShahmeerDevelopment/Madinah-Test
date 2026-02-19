/* eslint-disable quotes */
import { RANDOM_URL } from "../config/constant";
import { passwordStrength } from "check-password-strength";
import dayjs from "dayjs";

export function parsePercentageToInt(percentageString) {
  return parseInt(percentageString.replace("%", ""), 10);
}

// export const YOUTUBE_VIMEO_REGEX_HANDLER =
//   /^(https?://)?(www.)?(youtube.com/(c/)?[a-zA-Z0-9_-]+|youtu.be/[a-zA-Z0-9_-]+|vimeo.com/[a-zA-Z0-9_-]+)(S+)?$/;

export function formatNumberWithCommas(number) {
  if (number === null || number === undefined) {
    return "";
  }
  const parts = number.toString().split(".");
  // Detect leading zeros
  const leadingZerosMatch = parts[0].match(/^0+/);
  const leadingZeros = leadingZerosMatch ? leadingZerosMatch[0] : "";

  // Only remove leading zeros for the purpose of comma insertion
  let integerPartWithoutLeadingZeros = parts[0].replace(/^0+/, "");

  // Insert commas
  integerPartWithoutLeadingZeros = integerPartWithoutLeadingZeros.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  // Prepend leading zeros back to the integer part
  parts[0] = leadingZeros + integerPartWithoutLeadingZeros;

  return parts.join(".");
}

export function formatNumberShort(number) {
  if (number === null || number === undefined) {
    return "";
  }

  const numValue = parseFloat(number);

  if (numValue >= 10000) {
    // For numbers >= 10,000, format as k, M, B, etc.
    if (numValue >= 1000000000) {
      return (numValue / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (numValue >= 1000000) {
      return (numValue / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    return (numValue / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }

  // For numbers < 10,000, use the regular comma format
  return formatNumberWithCommas(number);
}

export function getYoutubeThumbnail(url) {
  try {
    let videoId;

    // Parse the URL using the URL constructor for better reliability
    const urlObj = new URL(url);

    if (
      urlObj?.hostname === "youtube.com" ||
      urlObj?.hostname === "www.youtube.com"
    ) {
      if (urlObj?.pathname === "/watch") {
        // Standard YouTube URL: https://www.youtube.com/watch?v=VIDEOID
        videoId = urlObj?.searchParams.get("v");
        if (!videoId) {
          throw new Error("Invalid YouTube URL: Missing video ID");
        }
      } else if (urlObj?.pathname?.startsWith("/embed/")) {
        // Embedded YouTube URL: https://www.youtube.com/embed/VIDEOID
        videoId = urlObj?.pathname?.split("/embed/")[1].split("/")[0];
        if (!videoId) {
          throw new Error("Invalid YouTube embed URL: Missing video ID");
        }
      } else if (urlObj?.pathname?.startsWith("/shorts/")) {
        // YouTube Shorts URL: https://www.youtube.com/shorts/VIDEOID
        videoId = urlObj?.pathname?.split("/shorts/")[1].split("/")[0];
        if (!videoId) {
          throw new Error("Invalid YouTube Shorts URL: Missing video ID");
        }
      } else if (urlObj?.pathname?.startsWith("/playlist")) {
        // Playlist URLs are not supported
        throw new Error("Playlist URLs are not supported");
      } else {
        throw new Error("Unsupported YouTube URL format");
      }
    } else if (urlObj?.hostname === "youtu.be") {
      // Shortened YouTube URL: https://youtu.be/VIDEOID
      videoId = urlObj.pathname
        .slice(1)
        .split("/")[0]
        .split("?")[0]
        .split("#")[0];
      if (!videoId) {
        throw new Error("Invalid shortened YouTube URL: Missing video ID");
      }
    } else {
      throw new Error("Unsupported YouTube URL format");
    }

    // Construct the thumbnail URL
    // Thumbnail URL format: https://img.youtube.com/vi/VIDEOID/0.jpg
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export const getVideoThumbnail = async (url) => {
  try {
    if (url.includes("vimeo.com")) {
      return await getVimeoThumbnailUrl(url); // Make sure to return the awaited call
    } else {
      return getYoutubeThumbnail(url); // This is synchronous but ensure it's returned
    }
  } catch (error) {
    console.error("Error fetching video thumbnail:", error);
    return null;
  }
};

// const getVimeoThumbnail = async (url) => {
//   // Handle Vimeo URLs
//   let videoId;
//   let thumbnailUrl;
//   const urlParts = url.split("/");
//   videoId = urlParts[urlParts.length - 1];

//   // Fetching Vimeo thumbnail via API
//   const response = await fetch(
//     `https://vimeo.com/api/v2/video/${videoId}.json`,
//   );
//   console.log("response", response);
//   if (!response.ok) {
//     throw new Error("Failed to fetch Vimeo thumbnail");
//   }
//   const data = await response.json();
//   thumbnailUrl = data[0].thumbnail_large; // Adjust according to available sizes
//   console.log("my thumbnail", thumbnailUrl);
//   return `${thumbnailUrl}.jpg`;
// };

//video thumbnail url for featured campaigns
// New functions
function getVimeoVideoId(url) {
  const regExp = /vimeo.*?(?:\/|video\/)(\d+)/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

function getVimeoThumbnailUrl(url) {
  const videoId = getVimeoVideoId(url);
  if (!videoId) {
    console.error("Invalid Vimeo URL: Missing video ID");
    return null;
  }
  return `https://vumbnail.com/${videoId}.jpg`;
}

export function getThumbnailUrl(url) {
  if (!url) {
    return null;
  }
  if (url.includes("vimeo.com")) {
    return getVimeoThumbnailUrl(url);
  } else {
    return getYoutubeThumbnail(url);
  }
}

export function toSnakeCase(str) {
  return str.toLowerCase().replace(/\s+/g, "_");
}

export function removeRandomUrl(str) {
  return str.replace(RANDOM_URL, "");
}

export function getKeyFromParams(query, key = "id") {
  const searchParams = new URLSearchParams(query);
  const result = searchParams.get(key);
  return result;
}

// don't use this function for createSearchParams. use createSearchParamsNext()
export function createSearchParams(queryToAdd, url, pathParam = null) {
  const searchParams = new URLSearchParams();
  for (let eachQueryParam in queryToAdd) {
    searchParams.append(eachQueryParam, queryToAdd[eachQueryParam]);
  }

  // If pathParam is provided, append it to the URL path
  const basePath = pathParam ? `${url}/${pathParam}` : url;
  const routeUrl = basePath + "?" + searchParams.toString();
  return routeUrl;
}

export function queryToString(queryToAdd) {
  const searchParams = new URLSearchParams();
  for (let eachQueryParam in queryToAdd) {
    searchParams.append(eachQueryParam, queryToAdd[eachQueryParam]);
  }
  return searchParams.toString();
}

// Helper function to escape CSV fields to prevent CSV injection and parsing issues
export function escapeCSVField(field) {
  if (field == null) return "";
  const stringField = String(field);
  // If the field contains quotes, commas, or newlines, it needs to be escaped
  if (
    stringField.includes('"') ||
    stringField.includes(",") ||
    stringField.includes("\n") ||
    stringField.includes("\r")
  ) {
    // Escape quotes by doubling them and wrap the entire field in quotes
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
}

export function queryToStringWithCSVAdjusted(queryToAdd) {
  const searchParams = new URLSearchParams();
  for (let eachQueryParam in queryToAdd) {
    if (queryToAdd[eachQueryParam].includes(",")) {
      // Directly append the parameter as a string if it contains commas,
      // indicating it might be a CSV. This bypasses the automatic encoding.
      searchParams.append(eachQueryParam, queryToAdd[eachQueryParam]);
    } else {
      // For other parameters, let URLSearchParams handle them normally.
      searchParams.append(eachQueryParam, queryToAdd[eachQueryParam]);
    }
  }
  // Convert to string
  let paramString = searchParams.toString();

  // Fix only the encoded commas in CSV parameters
  paramString = paramString.replace(/%2C/g, ",");

  return paramString;
}

export function isSuccessStatus(status) {
  return status >= 200 && status < 300;
}

export function formatTimestamp(timestamp) {
  const currentTime = new Date();
  const timeDifference = currentTime - new Date(timestamp);

  const minutes = Math.floor(timeDifference / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) {
    return "Just now";
  } else if (minutes < 60) {
    return formatTime(minutes, "minute");
  } else if (hours < 24) {
    return formatTime(hours, "hour");
  } else if (days < 30) {
    return formatTime(days, "day");
  } else if (months < 12) {
    return formatTime(months, "month");
  } else {
    return formatTime(years, "year");
  }
}

function formatTime(value, unit) {
  const unitString = value === 1 ? unit : unit + "s";
  return value + " " + unitString + " ago";
}

export function formatNumberWithEllipsis(number, maxLength) {
  const numberString = number?.toString();
  if (numberString?.length > maxLength) {
    return numberString?.substring(0, maxLength - 3) + "...";
  }
  return numberString;
}

export function truncateString(str, num = 10) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}

export function convertTimeToMilliseconds({ hours, minutes, seconds }) {
  // Ensure the required keys are present in the input object

  // Convert hours, minutes, and seconds to milliseconds
  const hoursInMilliseconds = hours * 60 * 60 * 1000;
  const minutesInMilliseconds = minutes * 60 * 1000;
  const secondsInMilliseconds = seconds * 1000;

  // Calculate total milliseconds
  const totalMilliseconds =
    hoursInMilliseconds + minutesInMilliseconds + secondsInMilliseconds;

  return totalMilliseconds;
}

export function checkPasswordStrength(password) {
  return passwordStrength(password);
}

export function calculateConvertedAmount(amount, rate) {
  if (rate === 0) return amount;
  return (amount * rate).toFixed(2);
}

export function buildSimpleTypography(
  weight,
  size,
  lineHeight,
  letterSpacing = "-0.41px"
) {
  return {
    fontWeight: weight,
    fontSize: `${size}px`,
    lineHeight: `${lineHeight}px`,
    letterSpacing,
  };
}

export const scrollToTop = (behavior = "instant") => {
  window.scrollTo({ top: 0, left: 0, behavior: behavior });
  return true;
};

export const formatDateRange = (startDate, endDate) => {
  const _endDate =
    endDate === undefined || endDate === null ? startDate : endDate;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const start = new Date(startDate);
  const end = new Date(_endDate);

  start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
  end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

  const startMonth = months[start.getMonth()];
  const endMonth = months[end.getMonth()];
  const startDay = start.getDate();
  const endDay = end.getDate();
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  // If years are different, show full date range
  if (startYear !== endYear) {
    return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
  }

  // Same year logic
  if (startDay === endDay && startMonth === endMonth) {
    return `${startMonth} ${startDay}, ${endYear}`;
  } else if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${endYear}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`;
  }
};

export const previousDateRangeFormat = (startDate, endDate) => {
  const _endDate =
    endDate === undefined || endDate === null ? startDate : endDate;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const start = new Date(startDate);
  const end = new Date(_endDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const startMonth = months[start.getMonth()];
  const endMonth = months[end.getMonth()];
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear() - 1; // Set year to previous year

  if (start.toDateString() === today.toDateString()) {
    const previousDay = startDay - 1;
    return `(${startMonth} ${previousDay}-${startDay}. ${year})`;
  } else if (start.toDateString() === yesterday.toDateString()) {
    const previousDay = startDay - 1;
    return `(${startMonth} ${startDay}-${previousDay}. ${year})`;
  } else if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}. ${year}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}. ${year}`;
  }
};

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function stripHtmlTags(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}
export const formatDateMonthToYear = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const getTotalAmount = (isRecurring, donationValues, tipValue, orderBump) => {
  // Add null/undefined checks to prevent NaN
  const safeTipValue = tipValue || 0;
  const safeOrderBump = orderBump || 0;
  const safeRecurringDonation = donationValues?.recurringDonation || 0;
  const safeTotalAmount = donationValues?.totalAmount || 0;

  if (isRecurring && !orderBump) {
    return safeTipValue + safeRecurringDonation;
  }
  if (isRecurring && orderBump) {
    return safeTipValue + safeRecurringDonation + safeOrderBump;
  }
  if (!isRecurring && orderBump) {
    return safeTotalAmount + safeTipValue + safeOrderBump;
  }
  return safeTotalAmount + safeTipValue;
};

export const calculateTotalAmount = (
  isRecurring,
  donationValues,
  tipValue,
  orderBump
) => {
  const total = getTotalAmount(
    isRecurring,
    donationValues,
    tipValue,
    orderBump
  );
  return total; // Returns a string representing the fixed-point notation.
};

/**
 * Generates a secure random alphanumeric token using Web Crypto API.
 * This avoids the need for the heavy crypto-browserify polyfill (~108KB savings).
 *
 * @param {string} prefix - An optional prefix to prepend to the token.
 * @param {number} length - The desired length of the random part of the token.
 * @returns {string} - The generated token.
 */
export const generateRandomToken = (prefix = "", length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charsLength = chars.length;
  
  // Use Web Crypto API (available in all modern browsers and Node.js 15+)
  // Falls back to Math.random for older environments (less secure but functional)
  let randomValues;
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
  } else {
    // Fallback for environments without Web Crypto API
    randomValues = new Array(length);
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * 256);
    }
  }
  
  let token = prefix;
  for (let i = 0; i < length; i++) {
    token += chars[randomValues[i] % charsLength];
  }

  return token;
};

export function getTextLengthWithoutHTML(html) {
  // Create a temporary element to parse HTML
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;

  // Extract text content without HTML tags
  const textContent = tempElement.textContent || tempElement.innerText || "";

  // Return the length of the text content
  return textContent.length;
}

export function getTextWithoutHTML(html) {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;
  const textContent = tempElement.textContent || tempElement.innerText || "";
  return textContent;
}

export function sanitizeUtmParams(utmParams) {
  return Object.entries(utmParams).reduce((acc, [key, value]) => {
    if (value && value !== "null" && value !== "undefined") {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export function getUTMParams(url) {
  const params = new URL(url).searchParams;
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
  };
}

// Utility function to detect if user is from Europe or UK
// Uses multiple detection methods with fallbacks for reliability on mobile devices
export function isUserFromEuropeOrUK() {
  try {
    // Method 1: Check Cloudflare country data (most reliable)
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        const cfCountry = localStorage.getItem("cfCountry");
        if (cfCountry) {
          // List of European country codes (including UK)
          const europeanCountries = [
            "AL",
            "AD",
            "AT",
            "BY",
            "BE",
            "BA",
            "BG",
            "HR",
            "CY",
            "CZ",
            "DK",
            "EE",
            "FI",
            "FR",
            "DE",
            "GR",
            "HU",
            "IS",
            "IE",
            "IT",
            "XK",
            "LV",
            "LI",
            "LT",
            "LU",
            "MT",
            "MD",
            "MC",
            "ME",
            "NL",
            "MK",
            "NO",
            "PL",
            "PT",
            "RO",
            "RU",
            "SM",
            "RS",
            "SK",
            "SI",
            "ES",
            "SE",
            "CH",
            "UA",
            "GB",
            "VA",
          ];
          return europeanCountries.includes(cfCountry.toUpperCase());
        }
      } catch (storageError) {
        console.warn(
          "Could not access localStorage for country detection:",
          storageError
        );
      }
    }

    // Method 2: Fallback to timezone detection (less reliable on mobile but better than nothing)
    if (typeof Intl !== "undefined" && Intl.DateTimeFormat) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // European timezone patterns
      const europeanTimezones = [
        "Europe/",
        "Atlantic/Azores",
        "Atlantic/Canary",
        "Atlantic/Faroe",
        "Atlantic/Madeira",
        "Atlantic/Reykjavik",
      ];

      // Specific European timezones
      const specificEuropeanTimezones = [
        "GMT",
        "WET", // Western European Time
        "CET", // Central European Time
        "EET", // Eastern European Time
      ];

      // Non-European timezones that might contain GMT or similar patterns
      const nonEuropeanTimezones = [
        "America/",
        "Asia/",
        "Africa/",
        "Australia/",
        "Pacific/",
        "Indian/",
        "Antarctica/",
        "Arctic/",
        "UTC",
      ];

      // First check if it's explicitly non-European
      const isNonEuropean = nonEuropeanTimezones.some((tz) =>
        timezone.startsWith(tz)
      );
      if (isNonEuropean) {
        return false;
      }

      // Then check if it's European
      const isEuropean =
        europeanTimezones.some((tz) => timezone.startsWith(tz)) ||
        specificEuropeanTimezones.includes(timezone);

      return isEuropean;
    }

    // If all detection methods fail, default to false (not European)
    // This is safer for GDPR compliance - only show banner if we're sure
    return false;
  } catch (error) {
    console.warn("Could not detect user location:", error);
    return false;
  }
}

// Utility function to format date for API without timezone conversion
export function formatDateForAPI(date) {
  if (!date) return null;

  try {
    // If it's a dayjs object
    if (date.$isDayjsObject) {
      // Extract the local date components directly to avoid any timezone conversion
      const year = date.year();
      const month = String(date.month() + 1).padStart(2, "0");
      const day = String(date.date()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    // If it's a native Date object
    if (date instanceof Date && !isNaN(date.getTime())) {
      // Use local date methods to avoid timezone conversion
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    // If it's a string, try to parse it carefully
    if (typeof date === "string") {
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }

      // For other string formats, create a Date object but use local methods
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    }

    console.warn("Invalid date provided to formatDateForAPI:", date);
    return null;
  } catch (error) {
    console.warn("Error formatting date for API:", error);
    return null;
  }
}

// Alternative utility function that creates a date string from individual components
export function formatDateComponentsForAPI(year, month, day) {
  if (!year || !month || !day) return null;

  const yearStr = String(year);
  const monthStr = String(month).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");

  return `${yearStr}-${monthStr}-${dayStr}`;
}

// Utility function to parse date from API without timezone conversion issues
export function parseDateFromAPI(dateString) {
  if (!dateString) return null;

  try {
    // Handle ISO date strings with timezone info (e.g., "2024-02-15T00:00:00.000Z")
    if (
      typeof dateString === "string" &&
      dateString.includes("T") &&
      (dateString.includes("Z") || dateString.includes("+"))
    ) {
      // Extract just the date part before 'T' and create a local date
      const datePart = dateString.split("T")[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
        // Create date with midday time to avoid timezone issues
        return dayjs(datePart + "T12:00:00");
      }
    }

    // If it's already a YYYY-MM-DD string, append time to avoid timezone conversion
    if (
      typeof dateString === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(dateString)
    ) {
      // Add midday time to avoid timezone edge cases
      return dayjs(dateString + "T12:00:00");
    }

    // For other formats, try to parse normally but set to midday
    const parsed = dayjs(dateString);
    if (parsed.isValid()) {
      return parsed.hour(12).minute(0).second(0).millisecond(0);
    }

    return null;
  } catch (error) {
    console.warn("Error parsing date from API:", error);
    return null;
  }
}
