/**
 * Asset utility functions for CDN-optimized asset delivery
 * Assets are served from /public/assets and cached by Cloudflare CDN
 */

/**
 * Get the full path to a public asset
 * @param {string} path - The asset path relative to /public/assets/
 * @returns {string} The full asset path
 */
export const getAssetPath = (path) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `/assets/${cleanPath}`;
};

/**
 * Get the full path to an image in /public/assets/images/
 * @param {string} path - The image path relative to /public/assets/images/
 * @returns {string} The full image path
 */
export const getImagePath = (path) => {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `/assets/images/${cleanPath}`;
};

/**
 * Get the full path to an SVG in /public/assets/svg/
 * @param {string} path - The SVG path relative to /public/assets/svg/
 * @returns {string} The full SVG path
 */
export const getSvgPath = (path) => {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `/assets/svg/${cleanPath}`;
};

/**
 * Get the full path to a video in /public/assets/videos/
 * @param {string} path - The video path relative to /public/assets/videos/
 * @returns {string} The full video path
 */
export const getVideoPath = (path) => {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `/assets/videos/${cleanPath}`;
};

/**
 * Get the full path to a Lottie animation JSON
 * @param {string} name - The animation name (without .json extension)
 * @returns {string} The full animation path
 */
export const getAnimationPath = (name) => {
  const cleanName = name.replace(/\.json$/, "");
  return `/assets/animations/${cleanName}.json`;
};

// =============================================================================
// ANIMATION CACHE: Prevents multiple fetches for the same animation
// =============================================================================
// This cache stores:
// 1. Resolved animation data (for completed fetches)
// 2. Pending promises (for in-flight requests - deduplication)
// =============================================================================
const animationCache = new Map();

/**
 * Fetch a Lottie animation JSON from the public folder
 * Uses in-memory cache to prevent duplicate fetches
 * @param {string} name - The animation name (without .json extension)
 * @returns {Promise<object>} The parsed animation data
 */
export const fetchLottieAnimation = async (name) => {
  // Return cached data if available
  if (animationCache.has(name)) {
    const cached = animationCache.get(name);
    // If it's a promise, return it (request in flight)
    // If it's data, wrap in resolved promise
    if (cached instanceof Promise) {
      return cached;
    }
    return Promise.resolve(cached);
  }

  // Create the fetch promise and cache it immediately
  // This deduplicates concurrent requests for the same animation
  const fetchPromise = (async () => {
    const path = getAnimationPath(name);
    const response = await fetch(path);
    if (!response.ok) {
      // Remove from cache on error so retry is possible
      animationCache.delete(name);
      throw new Error(`Failed to load animation: ${name}`);
    }
    const data = await response.json();
    // Replace promise with actual data in cache
    animationCache.set(name, data);
    return data;
  })();

  // Cache the promise to deduplicate concurrent requests
  animationCache.set(name, fetchPromise);
  return fetchPromise;
};

/**
 * Clear the animation cache (useful for testing or memory management)
 */
export const clearAnimationCache = () => {
  animationCache.clear();
};

// Pre-defined asset paths for commonly used assets
export const ASSET_PATHS = {
  // Animations
  animations: {
    heartfall: "/assets/animations/Heartfall.json",
    heartbreaking: "/assets/animations/heartbreaking.json",
    heartUploading: "/assets/animations/heart_uploading.json",
    dots: "/assets/animations/dots.json",
    tick: "/assets/animations/tick_icon.json",
    data: "/assets/animations/data.json",
    ai: "/assets/animations/AI_icon.json",
    error404: "/assets/animations/404(2).json",
    handsHoldingHeart: "/assets/animations/hands_holding_heart.json",
    mapCountries: "/assets/animations/map_countries.json",
  },

  // Images
  images: {
    placeholder: "/assets/images/placeholder_image.jpg",
    logo: "/assets/images/Madinahl_logo.png",
    imagePlaceholder: "/assets/images/common/imagePlaceholder.png",
    rebuildFamily: "/assets/images/Rebuild_family.jpg",
    // Voice of Madinah
    voiceOfMadinah: {
      yusuf: "/assets/images/voice_of_madinah/Dr_yousaf_compressed.jpeg",
      musleh: "/assets/images/voice_of_madinah/ShMuslehKhan_Compressed.jpeg",
      abdullah: "/assets/images/voice_of_madinah/Sh_Abdullah_compressed.jpeg",
      elsyed: "/assets/images/voice_of_madinah/ShAlaa_compressed.jpg",
      waleed: "/assets/images/voice_of_madinah/DR_Waleed_compressed.jpg",
      misra:
        "/assets/images/voice_of_madinah/Shaykh_Abdullah_2023_Compressed.jpg",
    },
    // Default items
    defaultItems: {
      defaultOrganizer: "/assets/images/defaultItems/default_organizer.png",
      defaultAvatar: "/assets/images/defaultItems/defaultAvatar.png",
      ahmedAli: "/assets/images/defaultItems/ahmed-ali.png",
      fatimah: "/assets/images/defaultItems/fatimah.png",
      upload: "/assets/images/defaultItems/upload.png",
    },
  },

  // Donation card images
  donations: {
    visa: "/assets/images/donations/visa.png",
    mastercard: "/assets/images/donations/mastercard.png",
    americanExpress: "/assets/images/donations/american-express.png",
    discover: "/assets/images/donations/discover.png",
    dinersClub: "/assets/images/donations/diner.png",
    jcb: "/assets/images/donations/jcb.png",
    unionPay: "/assets/images/donations/union-pay.png",
    donateGif: "/assets/images/donations/donate_gif.gif",
  },

  // SVG icons
  svg: {
    heartIcon: "/assets/svg/donations/heartIcon.svg",
    blackCard: "/assets/svg/donations/blackCars.svg",
    checkBox: "/assets/svg/donations/checkBox.svg",
    applePay: "/assets/svg/donations/appleIcon.svg",
    googlePay: "/assets/svg/donations/google-pay-mark_800.svg",
    emptyProfile: "/assets/svg/emptyProfile.svg",
    taxDeductible: "/assets/svg/common/tax_deductable.svg",
    zakatEligible: "/assets/svg/common/zakat_eligible.svg",
    secureDonation: "/assets/svg/common/secure_donation.svg",
    donation: "/assets/svg/donation.svg",
    average: "/assets/svg/average.svg",
    checked: "/assets/svg/campaign/checked.svg",
  },

  // Social icons
  social: {
    facebook: "/assets/svg/socialIcons/facebook.svg",
    facebookIcon: "/assets/svg/socialIcons/facebookIcon.svg",
    google: "/assets/svg/socialIcons/googleIcon.svg",
    apple: "/assets/svg/socialIcons/appleIcon.svg",
    twitter: "/assets/svg/socialIcons/twitter.svg",
    instagram: "/assets/svg/socialIcons/instagram.svg",
    whatsapp: "/assets/svg/socialIcons/whatsapp.svg",
    telegram: "/assets/svg/socialIcons/telegram.svg",
    youtube: "/assets/svg/socialIcons/youtube.svg",
    email: "/assets/svg/socialIcons/email.svg",
    copyLink: "/assets/svg/socialIcons/socialLink.svg",
    slack: "/assets/svg/socialIcons/slack.svg",
    tiktok: "/assets/svg/socialIcons/tiktok.svg",
    nextDoor: "/assets/svg/socialIcons/nextDoor.svg",
    widget: "/assets/svg/socialIcons/widgets.svg",
    qr: "/assets/svg/socialIcons/qr.svg",
  },

  // Videos
  videos: {
    skyMp4: "/assets/videos/sky.mp4",
    skyGif: "/assets/videos/sky.gif",
  },

  // Campaign SVGs
  campaign: {
    charityActiveStep: "/assets/svg/campaign/charityActiveStep.svg",
    infoBlog: "/assets/svg/campaign/infoBlog.jpg",
    notification: "/assets/svg/campaign/notification.svg",
  },

  // Bank details
  bankDetails: {
    arrow: "/assets/svg/bankDetails/arrow.svg",
  },

  // Blog
  blog: {
    blog1: "/assets/svg/blog/blog1.png",
  },

  // Testimonials
  testimonials: {
    avatarPlaceholder: "/assets/images/testimonials/avatarPlaceholder.svg",
  },

  // Organization logos
  organizations: {
    img1: "/assets/images/organizations/img_1.png",
    img2: "/assets/images/organizations/img_2.png",
    img3: "/assets/images/organizations/img_3.png",
    img4: "/assets/images/organizations/img_4.png",
    img5: "/assets/images/organizations/img_5.png",
    img6: "/assets/images/organizations/img_6.png",
    img7: "/assets/images/organizations/img_7.png",
    img8: "/assets/images/organizations/img_8.png",
    img9: "/assets/images/organizations/img_9.png",
    img10: "/assets/images/organizations/img_10.png",
  },

  // Country images
  countries: {
    country1: "/assets/images/countries/country_1.png",
    country2: "/assets/images/countries/country_2.png",
    country3: "/assets/images/countries/country_3.png",
  },

  // How it works icons
  howItWorks: {
    startFundraiser: "/assets/images/howItWorks/start_fundraiser.png",
    manageDonations: "/assets/images/howItWorks/manage_donations.png",
    shareWithFriends: "/assets/images/howItWorks/share_with_friends.png",
  },

  // Statistics icons
  statistics: {
    visit: "/assets/svg/statistics/visit.svg",
    donation: "/assets/svg/statistics/donation.svg",
    totalDonation: "/assets/svg/statistics/totatDonation.svg",
    average: "/assets/svg/statistics/average.svg",
    donationPerVisit: "/assets/svg/statistics/donationPerVisit.svg",
    conversion: "/assets/svg/statistics/conversion.svg",
  },

  // Table icons
  table: {
    users: "/assets/svg/table/users.svg",
    wallet: "/assets/svg/table/wallet.svg",
    clip: "/assets/svg/table/clip.svg",
    dropDown: "/assets/svg/table/dropDownIcon.svg",
  },
};

export default ASSET_PATHS;
