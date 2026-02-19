/* eslint-disable quotes */
import { ASSET_PATHS } from "@/utils/assets";

export const ANONYMOUS = "Anonymous";
export const DEFAULT_IMG = ASSET_PATHS.images.defaultItems.defaultOrganizer;
export const PLACEHOLDER_IMAGE = ASSET_PATHS.images.placeholder;
export const RECENT_SUPPORTERS = [
  {
    id: 0,
    name: ANONYMOUS,
    img: ASSET_PATHS.images.defaultItems.defaultAvatar,
    donatedAmount: "$25 USD",
    lastDonated: "16 hours ago",
  },
  {
    id: 1,
    name: ANONYMOUS,
    img: ASSET_PATHS.images.defaultItems.defaultAvatar,
    donatedAmount: "$25 USD",
    lastDonated: "16 hours ago",
  },
  {
    id: 2,
    name: "Fatimah",
    donatedAmount: "$25 USD",
    lastDonated: "16 hours ago",
    img: ASSET_PATHS.images.defaultItems.fatimah,
  },
  {
    id: 3,
    name: "Ahmed Ali",
    donatedAmount: "$25 USD",
    lastDonated: "16 hours ago",
    img: ASSET_PATHS.images.defaultItems.ahmedAli,
  },
];

export const SIMILAR_CAMPAIGNS = [
  {
    id: 3,
    title: "Guardian Angel Patron",
    donationAmount: "$500",
    description:
      "Become a Guardian Angel Patron and watch over the dreams of these children. Your generous contribution will provide essential resources for their education, healthcare, and overall well-being, ensuring a brighter future.",
    claimed: 6,
    buttonText: "Donate $500",
  },
  {
    id: 4,
    title: "Champion of Hope",
    donationAmount: "$1000",
    description:
      "Step into the role of a Champion of Hope and ignite lasting change. Your substantial donation will empower the orphanage to implement impactful programs, fostering an environment where every child can thrive, dream, and achieve their fullest potential.",
    claimed: 2,
    buttonText: "Donate $1000",
  },
  {
    id: 5,
    title: "Legacy Builder",
    donationAmount: "$5000",
    description:
      "As a Legacy Builder, you are leaving an indelible mark on the lives of generations to come. Your significant contribution will contribute to the construction of new facilities, ensuring a stable and nurturing home for countless orphaned children in the years ahead.",
    claimed: 1,
    buttonText: "Donate $5000",
  },
];
