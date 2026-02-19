import { styled } from "@mui/material/styles";

export const CardWrapper = styled("div")(
  ({ theme, height = "64px", heightInMobileViw = "74px" }) => ({
    marginTop: "20px",
    padding: "12px 8px 12px 16px",
    borderRadius: "22px",
    border: "2px solid #F7F7FF",
    width: "100%",
    height: height,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      height: heightInMobileViw, // Height for mobile view
    },
  }),
);
