"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: true, // Enable CSS variables for better SSR support
  typography: {
    fontFamily: [
      "var(--font-league-spartan)",
      "var(--font-noto-sans-arabic)", // Added as a fallback for Arabic text
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
  },
  palette: {
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
    text: { primary: "#666666" },
    secondary: {
      main: "#E0C2FF",
      light: "#F5EBFF",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#47008F",
    },
    white: {
      main: "#FFFFFF",
      light: "#F8F8F8",
    },

    gradients: {
      primary: "linear-gradient(90deg, #6363E6 0.05%, #59C9F9 99.96%)",
      secondary: "linear-gradient(180deg, #E9E9FF 0%, #C9EEFF 100%)",
      // You can add more gradients if needed
    },
  },
});
