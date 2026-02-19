import { styled } from "@mui/material/styles";

export const Main = styled("main")(() => ({
  // height: '100vh',
  // height: "calc(100vh - 70px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  // [theme.breakpoints.down('sm')]: {
  // 	// Using MUI's breakpoints for mobile view
  // 	height: '100vh', // Height for mobile view
  // },
}));
export const Wrapper = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 10000,
  backgroundColor: "#fbfbfb",
}));
