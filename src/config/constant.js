/* eslint-disable indent */
// Static assets from public folder for CDN delivery
const step1 = "/assets/svg/campaign/step1.svg";
const step1Active = "/assets/svg/campaign/step1Active.svg";
const step2 = "/assets/svg/campaign/step2.svg";
const step2Active = "/assets/svg/campaign/step2Aactive.svg";
const step3 = "/assets/svg/campaign/step3.svg";
const step3Active = "/assets/svg/campaign/step3Active.svg";
const step4 = "/assets/svg/campaign/step4.svg";
const step4Active = "/assets/svg/campaign/step4Active.svg";
const step5 = "/assets/svg/campaign/step5.svg";
const step5Active = "/assets/svg/campaign/step5Active.svg";
const copyLink = "/assets/svg/socialIcons/socialLink.svg";
const nextDoor = "/assets/svg/socialIcons/nextDoor.svg";
const facebook = "/assets/svg/socialIcons/facebook.svg";
const twitter = "/assets/svg/socialIcons/twitter.svg";
const email = "/assets/svg/socialIcons/email.svg";
const whatsapp = "/assets/svg/socialIcons/whatsapp.svg";
const websiteWidgets = "/assets/svg/socialIcons/widgets.svg";
const qrCode = "/assets/svg/socialIcons/qr.svg";
const userActiveIcon = "/assets/svg/bankDetails/userActiveIcon.svg";
const homeIcon = "/assets/svg/bankDetails/homeIcon.svg";
const homeActiveIcon = "/assets/svg/bankDetails/homeActiveIcon.svg";
const bankIcon = "/assets/svg/bankDetails/bankIcon.svg";
const bankActiveIcon = "/assets/svg/bankDetails/bankActiveIcon.svg";
const termsIcon = "/assets/svg/bankDetails/termsIcon.svg";
const termsActiveIcon = "/assets/svg/bankDetails/termsActiveIcon.svg";
export const DEFAULT_AVATAR =
  "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg";
const activePaymentCard = "/assets/svg/donations/activePaymentCard.svg";
const activeHandshake = "/assets/svg/donations/activeHandshake.svg";
const activeSummaryIcon = "/assets/svg/donations/activeSummaryIcon.svg";
const paymentCard = "/assets/svg/donations/paymentCard.svg";
const summaryIcon = "/assets/svg/donations/summaryIcon.svg";
const apple = "/assets/svg/donations/appleIcon.svg";
const google = "/assets/svg/donations/googleIcon.svg";
const blackCard = "/assets/svg/donations/blackCars.svg";
const visaCard = "/assets/images/donations/visa.png";
const americaExpressCard = "/assets/images/donations/american-express.png";
const masterCard = "/assets/images/donations/mastercard.png";
const unionPayCard = "/assets/images/donations/union-pay.png";
const discoverCard = "/assets/images/donations/discover.png";
const dinersClubCard = "/assets/images/donations/diner.png";
const jcbCard = "/assets/images/donations/jcb.png";

export const PAGES_WITH_TRANSPARENT_NAV = [""];

export const CONSENT_COOKIE_NAME = "gdpr_consent";

export const CACHE_LIFE_TIME = 60;

export const RANDOM_URL = `${process.env.NEXT_PUBLIC_SHAREABLE_URL}`;
export const PROFILE_IMAGE = "profile-image";
export const CAMPAIGN_COVER_IMAGE = "campaign-cover-image";
export const CAMPAIGN_STORY_IMAGE_S3 = "email-image";
export const BANK_DOCUMENT_COVER_IMAGE = "bank-document-image";
export const CAMPAIGN_STORY_IMAGE = "campaign-story-image";
export const BANK_DOCUMENT = "bank-document";
export const SHARE_URL = "https://madinah.com/campaign/1";
export const SHARE_TITLE = "Fundraise campaign for students";
export const CUSTOM_LAYOUT_MARGIN = { xs: 0, sm: 0, md: 4, lg: 18 };
export const SIDEBAR_WIDTH = "167px";
export const BOX_SHADOW_STYLE = "0px 0px 100px 0px rgba(0, 0, 0, 0.06)";
export const MAX_PAGE_WIDTH = "1120px";
export const APOSTROPHE = " &apos;";
export const WIDGET_DIMENSIONS = {
  height: "350px",
  width: "200px",
};
export const EXPIRATION_TIME = 10 * 60 * 1000;
export const TOKEN_EXPIRATION_CHECK = 5 * 60 * 1000;

// export const EXPIRATION_TIME = 10 * 1000;
// export const TOKEN_EXPIRATION_CHECK = 5 * 1000;

export const breakWordStyle = {
  wordWrap: "break-word",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};
export const modalHeightAdjustAble = {
  maxHeight: "92vh",
  overflowY: "auto",

  "::-webkit-scrollbar": {
    width: "0px", // Set width to 0 to effectively hide the scrollbar
    background: "transparent", // Ensures scrollbar takes no visible space
  },
  "::-webkit-scrollbar-track": {
    background: "transparent", // Make the track transparent
  },
  "::-webkit-scrollbar-thumb": {
    background: "transparent", // Make the thumb transparent
  },
};
export const breakWordWithNoEllipsisStyle = {
  wordWrap: "break-word",
  overflow: "hidden",
};
export const DROPDOWN_BANK_CLASS = [
  { _id: "personal", name: "Personal" },
  { _id: "corporate", name: "Corporate" },
];
export const DROPDOWN_BANK_ACCOUNT_TYPE = [
  { _id: "checking", name: "Checking" },
  { _id: "savings", name: "Savings" },
];

export const USA_PAYOUT_METHOD = [
  { _id: "wire", name: "Wire" },
  { _id: "ach", name: "ACH" },
];
export const PAYOUT_METHOD = [{ _id: "wire", name: "Wire" }];
export const CANADA_PAYOUT_METHOD = [
  { _id: "wire", name: "Wire" },
  { _id: "eft", name: "EFT" },
];

export const PAYMENT_METHODS_DATA = [
  { id: 1, name: "Apple Pay", icon: apple, title: "apple_pay" },
  { id: 2, name: "Google Pay", icon: google, title: "google_pay" },
  {
    id: 2,
    name: "Credit or debit card",
    icon: blackCard,
    title: "credit_card",
  },
];

export const PAGINATION_DATA = [
  { _id: 1, name: "5 per page", value: 5 },
  { _id: 2, name: "10 per page", value: 10 },
  { _id: 3, name: "15 per page", value: 15 },
  { _id: 4, name: "20 per page", value: 20 },
  { _id: 5, name: "50 per page", value: 50 },
  { _id: 6, name: "100 per page", value: 100 },
];

export const getCardIcon = (brand) => {
  switch (brand) {
    case "Visa":
      return visaCard;
    case "American Express":
      return americaExpressCard;
    case "MasterCard":
      return masterCard;
    case "Union Pay":
      return unionPayCard;
    case "JCB":
      return jcbCard;
    case "Discover":
      return discoverCard;
    case "Diners Club":
      return dinersClubCard;
    default:
      return visaCard;
  }
};
export const FUNDRAISING_FOR = [
  {
    heading: "Yourself",
    item: "myself",
    title: "Funds are delivered to your bank account for your own use",
  },
  {
    heading: "Someone else",
    item: "someone-else",
    title:
      "You will invite a beneficiary to receive funds or distribute them yourself",
  },
  {
    heading: "Charity",
    item: "charity-organization",
    title: "Funds are delivered to your chosen nonprofit for you",
  },
];

export const STEPPER_STEP = [
  {
    id: 1,
    heading: "STEP 1",
    title: "Location & Fundraising",
    icon: step1,
    activeIcon: step1Active,
  },
  {
    id: 2,
    heading: "STEP 2",
    title: "Choose Recipient",
    icon: step2,
    activeIcon: step2Active,
  },
  {
    id: 3,
    heading: "STEP 3",
    title: "Starting Goal",
    icon: step3,
    activeIcon: step3Active,
  },
  {
    id: 4,
    heading: "STEP 4",
    title: "Campaign Description",
    icon: step5,
    activeIcon: step5Active,
  },
  {
    id: 5,
    heading: "STEP 5",
    title: "Cover Photo",
    icon: step4,
    activeIcon: step4Active,
  },
  {
    id: 6,
    heading: "STEP 6",
    title: "Personal Information",
    icon: userActiveIcon,
    activeIcon: userActiveIcon,
  },
  {
    id: 7,
    heading: "STEP 7",
    title: "Home Address",
    icon: homeIcon,
    activeIcon: homeActiveIcon,
  },
  {
    id: 8,
    heading: "STEP 8",
    title: "Bank Information",
    icon: bankIcon,
    activeIcon: bankActiveIcon,
  },
  {
    id: 9,
    heading: "STEP 9",
    title: "Documents Verification",
    icon: termsIcon,
    activeIcon: termsActiveIcon,
  },
  {
    id: 10,
    heading: "STEP 10",
    title: "Terms and Conditions",
    icon: termsIcon,
    activeIcon: termsActiveIcon,
  },
];

export const BANK_STEPPER = [
  {
    id: 1,
    heading: "STEP 1",
    title: "Personal Information",
    icon: userActiveIcon,
    activeIcon: userActiveIcon,
  },
  {
    id: 2,
    heading: "STEP 2",
    title: "Home address",
    icon: homeIcon,
    activeIcon: homeActiveIcon,
  },
  {
    id: 3,
    heading: "STEP 3",
    title: "Bank information",
    icon: bankIcon,
    activeIcon: bankActiveIcon,
  },
  {
    id: 4,
    heading: "STEP 4",
    title: "Terms and Conditions",
    icon: termsIcon,
    activeIcon: termsActiveIcon,
  },
];

export const DONATION_METHOD_OPTION = [
  {
    id: 1,
    label: "One time",
    value: "oneTimeDonation",
    subtext: "Make a single donation",
  },
  // {
  //   id: 2,
  //   label: "Monthly",
  //   value: "recurringDonation",
  //   subtext: "Donate automatically every month"
  // },
  {
    id: 2,
    label: "Encourage donors to automatically donate on special days",
    value: "recurringDonation",
    subtext: "Automatic recurring donations on special days",
  },
  // {
  //   id: 3,
  //   label: "Advanced settings for automatically donate",
  //   value: "recurringDonationWithAdvancedSettings",
  //   subtext: "Set up regular payments for special days"
  // }
];

export const AUTOMATIC_DONATION_DAYS = [
  {
    id: 1,
    label: "Daily during the last 10 nights of Ramadan",
    value: "dailyLast10NightsRamadan",
  },
  {
    id: 2,
    label: "Daily for 30 days of Ramadan",
    value: "daily30DaysRamadan",
  },
  {
    id: 3,
    label: "Daily in the first 10 days of Dhul Hijjah",
    value: "dailyFirst10DaysDhulHijjah",
  },
  {
    id: 4,
    label: "Every Friday",
    value: "everyFriday",
  },
  {
    id: 5,
    label: "Monthly",
    value: "monthly",
  },
];

export const CAMPAIGN_MEDIUMS = [
  {
    _id: 1,
    name: "Organic",
    value: "organic",
  },
  {
    _id: 2,
    name: "Email",
    value: "email",
  },
  {
    _id: 3,
    name: "Social Media",
    value: "social-media",
  },
];

export const NEW_DONATION_STEPPER = [];

export const DONATION_STEPPER = [
  {
    id: 1,
    heading: "STEP 1",
    title: "Giving level",
    icon: activeHandshake,
    activeIcon: activeHandshake,
  },
  {
    id: 2,
    heading: "STEP 2",
    title: "Payment method",
    icon: paymentCard,
    activeIcon: activePaymentCard,
  },
  {
    id: 3,
    heading: "STEP 3",
    title: "Summary",
    icon: summaryIcon,
    activeIcon: activeSummaryIcon,
  },
];

export const TAGS = [
  { id: 1, label: "Food/Water" },
  { id: 2, label: "Mosque/Community" },
  { id: 3, label: "Education" },
  { id: 4, label: "Women" },
  { id: 5, label: "Orphans" },
  { id: 6, label: "Refugee" },
  { id: 7, label: "Emergency Relief" },
  { id: 8, label: "Health" },
  { id: 9, label: "Creative" },
  { id: 10, label: "Other" },
];

export const MILESTONE = [
  { id: 1, label: "25%", value: 25 },
  { id: 2, label: "50%", value: 50 },
  { id: 3, label: "75%", value: 75 },
  { id: 4, label: "100%", value: 100 },
];

export const FUNDRAISER_TYPE = {
  myself: "myself",
  someoneElse: "someone-else",
  charityOrganization: "charity-organization",
};
export const CAMPAIGN_STATUSES = {
  pendingApproval: "pending-approval",
  active: "active",
  completed: "completed",
};

export const FOOTER = [
  {
    id: 1,
    name: "About Us",
    path: "/about-us",
  },
  {
    id: 2,
    name: "Privacy Policy",
    path: "/privacy-policy",
  },
  {
    id: 3,
    name: "Cookie Policy",
    path: "/cookie-policy",
  },
  {
    id: 4,
    name: "Cookie Settings",
    action: "openCookiePreferences",
  },
  {
    id: 5,
    name: "Terms & Conditions",
    path: "/terms-and-conditions",
  },
  // {
  // 	id: 4,
  // 	name: 'Emergency',
  // },
  // {
  // 	id: 5,
  // 	name: 'About',
  // },
  // {
  // id: 6,
  // name: "Blog",
  // path: "https://blog.madinah.com/",
  // },
  // {
  // 	id: 7,
  // 	name: 'Pricing',
  // },
  // {
  // 	id: 8,
  // 	name: 'Career',
  // },
  // {
  // 	id: 9,
  // 	name: 'Why Madinah',
  // },
];

export const SOCIAL_DATA = [
  {
    icon: copyLink,
    name: "Copy link",
  },

  {
    icon: facebook,
    name: "Facebook",
  },
  {
    icon: email,
    name: "Email",
  },
  {
    icon: twitter,
    name: "X",
  },
  {
    icon: nextDoor,
    name: "Nextdoor",
  },

  {
    icon: whatsapp,
    name: "WatsApp",
  },
  {
    id: 7,
    icon: websiteWidgets,
    name: "Website widget",
  },
  {
    id: 8,
    icon: qrCode,
    name: "QR Code",
  },
];

export const STEPPER_CARD = { minWidth: "217px", gap: "8px" };

export const HERO_SECTION_VIDEO_CLOUD_URL =
  "https://madinah-test.s3.eu-north-1.amazonaws.com/sky.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDYaCmFwLXNvdXRoLTEiRzBFAiAsVD6L2jk%2BjGHzRbpnTa6OCqdWIoVWi6kHKQKijtZPvQIhAKeD8TMwzR5RK2w9fYVe3%2BIxRxU7jQbWXgRI1syQtWeWKugCCC8QABoMMDYwODgwMzQ1OTU4Igy49qqt3o9klv0JOHAqxQKn3hp0%2FbHuLei8V9J6FI2h5%2BrCnCNPA3qZRkh7ISkyJFaMNPaXg8jP2bxWNG9sJlD%2B%2FFeZc07Q68TD3CgxSOmVmZTEIpgY3x5mbG%2FfKMhiZ2h0D79PDcFzgfEysHHpNJ1Zi0x%2F3k%2BTLbLadJlW41ntI7%2BIP5awTWcA96sC2tflKdCx0jeLwsRGtgjTky1ZvB5uFwm287ra%2BiI7rYqErD45lQsOXomTKohi3B0QMqNmdjfkNJ61FAR%2FFVGoWol%2FlWUDLrRItkHe%2Bl6LDYvWFPKSn%2Bn1XKCKdGObNAS1o%2F%2FZQyzdcMurxAXFqruwF3WM8z7MYKEHNcQwBq%2B2xZtoKyvz5sqXtekfFnoYpFAraDPmA20AA8N%2BD9gjFyq%2FFrm3hYkyMe9JCoa%2Fgg%2BnRIpo%2FDQZ7pD45kR6622EjlvQp8l81Tr6XL3VMMWSh68GOrMC%2FXsXBiP9%2BIFOgXamav9dPeTWgnlOJqyFYghtReI4VkxweEU7IP5u340rmPE5CB7a%2BBJDLCdFLMksVKQh3852I2fwGLrqcTIKBfJw6psykXlh3%2FFbIULiOB3iVPaNoGRYapjiM%2Bh%2FtvUsLnAUvdSEHok2Hv1NZQ4%2FoHmZkbOWSXRgMuVw1%2BYqfuMEdXYbxpAuG8JHuUlNeyDyh%2F4vG%2FrVta63QmQ4Q1ne4xV4iylMzdmWU0Hm%2BuxdfLRlxD9z7ASHi%2BMS%2FfC2ET1x7PsXFDIRitqn8K1IZTnwm%2F8CdDs%2BIzn3%2FxP1N4rdEK6EA177lC5AvGNKJydhTMwYZkPvvAOQIGt9txN%2FMBgViOz%2F%2FF4%2F49BxHh2IdRBeHRi1wQlUpy9TWBF%2FZy1m0XlNVBWw1BXOAt3fsg%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240301T140909Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAQ4LGALNTJPLC6RX6%2F20240301%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Signature=0f51adb253067bf0adf170a7aa77b86d2373c6e39bb98caf5574096a66055a0a";

export const menuItems = [
  { _id: 1, label: "Creation date" },
  { _id: 2, label: "Amount collection" },
  { _id: 3, label: "Goal amount" },
];

export const IMAGE_COMPRESSION_OPTIONS = {
  maxWidthOrHeight: 900,
};
