import { styled } from "@mui/material/styles";

export const CardWrapper = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.white.main, // Fallback color
  background: "url(/assets/svg/card.svg)", // Using the card SVG as background
  backgroundSize: "cover", // This ensures the background covers the entire element
  backgroundPosition: "center",
  padding: "36px 20px 36px 20px",
  borderRadius: "32px",
  width: "97%",
  height: "264px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  color: "white",
  [theme.breakpoints.down("sm")]: {
    height: "224px", // Height for mobile view
  },
}));
export const ImageCardWrapper = styled("div")(({ theme }) => ({
  // background: theme.palette.gradients.primary,
  borderRadius: "32px",
  width: "97%",
  // height: '317px',
  display: "flex",
  flexDirection: "column",
  // justifyContent: 'space-between',
  // alignItems: 'flex-start',
  [theme.breakpoints.down("sm")]: {
    // paddingBottom: '40px',
    // height: '345px', // Height for mobile view
  },
}));
