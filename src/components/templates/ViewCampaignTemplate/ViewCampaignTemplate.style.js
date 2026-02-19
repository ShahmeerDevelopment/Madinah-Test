// import { BOX_SHADOW_STYLE } from "@/config/constant";

export const styles = {
  containerStyles: () => ({
    maxWidth: "1120px",
    width: "100%",
    margin: "24px auto",
    minHeight: "calc(100vh - 272px)",
  }),
  // total:1,114
  leftSide: ({ isMediumScreen }) => ({
    width: isMediumScreen ? "100%" : "66.33%",
    // overflowY: !isSmallScreen ? 'auto' : '',
    // height: !isSmallScreen ? '100vh' : '',
    // position: !isSmallScreen ? 'sticky' : '',
    // boxShadow: !isSmallScreen ? BOX_SHADOW_STYLE : "",
    borderRadius: "32px",
    WebkitOverflowScrolling: "touch", // Enables smooth scrolling on iOS
    scrollbarWidth: "none", // Firefox
    MsOverflowStyle: "none", // IE and Edge
    "&::-webkit-scrollbar": {
      display: "none", // Hide scrollbar for Webkit browsers (Chrome, Safari)
    },
  }),
  rightSide: ({ isMediumScreen, isSmallScreen }) => ({
    width: isMediumScreen ? "100%" : "100%",
    position: "sticky",
    top: "80px",
    maxHeight: "calc(100vh - 100px)", // Fixed height based on viewport
    overflowY: !isSmallScreen ? "auto" : "", // Always enable scrolling on desktop
    borderRadius: "32px",
    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "none", // Hide scrollbar for Firefox
    MsOverflowStyle: "none", // Hide scrollbar for IE and Edge
    "&::-webkit-scrollbar": {
      display: "none", // Hide scrollbar for Chrome/Safari
    },
  }),
  previewModeText: {
    color: "rgba(161, 161, 168, 1)",
    fontSize: "16px",
    fontWeight: 400,
  },
  sectionLayout: {
    // boxShadow: BOX_SHADOW_STYLE,
    p: "32px",
    borderRadius: "32px",
    background: "white",
    lineHeight: "20px",
  },
  initialBtns: {
    mb: "40px !important",
  },
  heading: {
    color: "rgba(9, 9, 9, 1)",
    fontWeight: 500,
    fontSize: "32px",
    lineHeight: "48px",
    wordBreak: "auto-phrase",
    overflowWrap: "break-word",
  },
  announcementHeading: {
    color: "rgba(9,9,9,1)",
    fontWeight: 500,
    fontSize: "24px",
    lineHeight: "32px",
    wordBreak: "auto-phrase",
    overflowWrap: "break-word",
  },
  subTitle: {
    marginTop: "4px !important",
    color: "rgba(161, 161, 168, 1)",

    fontSize: "14px",
    lineHeight: "16px",
    marginBottom: "16px !important",
  },
  organizerHeading: {
    color: "rgba(96, 96, 98, 1)",
    fontWeight: 500,
    fontSize: "22px",
    mb: "8px !important",
  },
  coverImg: {
    marginBottom: "16px !important",
  },
  organizerInfo: {
    flexGrow: 1,
  },
  organizerName: {
    color: "rgba(96, 96, 98, 1)",
    fontSize: "18px",
    fontWeight: 500,
    lineHeight: "22px",
    mr: "2px",
    wordBreak: "break-all",
  },
  organizerCountry: {
    color: "rgba(161, 161, 168, 1)",
    fontSize: "14px",
    lineHeight: "16px",
    fontWeight: 400,
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    // gap: '5px',
  },
  btnText: {
    fontWeight: 400,
    fontSize: "16px",
    color: "rgba(96, 96, 98, 1)",
  },
  organizerSubtext: {
    fontWeight: 400,
    fontSize: "14px",
    color: "rgba(96, 96, 98, 1)",
  },
  organizerSubTextContainer: {
    mb: "24px !important",
  },
  story: {
    "& p": {
      color: "rgba(96, 96, 98, 1) !important",
      fontWeight: 400,
      fontSize: "16px",
      wordWrap: "break-word",
    },
    "& img": {
      maxWidth: "100%",
    },
    marginBottom: "32px !important",
    maxWidth: "100%",
  },
  reportBtn: {
    alignSelf: "flex-start",
    alignItems: "center !important",
  },
  reportText: {
    color: "rgba(99, 99, 230, 1)",
    marginLeft: "6.67px",
    fontSize: "14px",
    lineHeight: "16px",
    fontWeight: 500,
  },
  recentSupportersHeadingOverride: {
    // marginBottom: '12px !important',
  },
  recentSupportersContainer: {
    flexWrap: "wrap",
  },
  eachRecentSupporterContainer: (index, isSmallScreen) => ({
    // marginTop: index > 1 ? '24px !important' : '0px !important',
    marginTop: "22px",
    width: isSmallScreen ? "100%" : "50%",
    minWidth: isSmallScreen ? "auto" : " 176px",
  }),
  organizerPhoto: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  supporterImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },
};
