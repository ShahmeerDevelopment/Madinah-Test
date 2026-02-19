/**
 * Theme colors for server components
 *
 * These are plain JavaScript objects that can be safely imported
 * in both server and client components without triggering
 * client-only code in server components.
 *
 * For client components, use the full theme from @/config/customTheme
 */

export const themeColors = {
  primary: {
    main: "#6363E6",
    mainLight: "#F7F7FF",
    light: "#FFFFFF",
    gray: "#A1A1A8",
    lightGreen: "#E1FBF2",
    green: "#0CAB72",
    red: "#E61D1D",
    lightRed: "#FFEDED",
    lightGray: "#E9E9EB",
    darkGray: "#606062",
    dark: "#090909",
  },
  text: {
    primary: "#666666",
  },
  secondary: {
    main: "#E0C2FF",
    light: "#F5EBFF",
    contrastText: "#47008F",
  },
  white: {
    main: "#FFFFFF",
    light: "#F8F8F8",
  },
  gradients: {
    primary: "linear-gradient(90deg, #6363E6 0.05%, #59C9F9 99.96%)",
    secondary: "linear-gradient(180deg, #E9E9FF 0%, #C9EEFF 100%)",
  },
};

// Typography settings for server components
export const themeTypography = {
  fontFamily: [
    "var(--font-league-spartan)",
    "var(--font-noto-sans-arabic)",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
  ].join(","),
};
