import { styled } from "@mui/material/styles";
import { theme } from "../../../config/customTheme";

export const Table = styled("table")(() => ({
  width: "100%",
  borderCollapse: "collapse",
}));

export const TableHeadText = styled("th")(() => ({
  fontWeight: "bold",
  fontSize: "14px",
  lineHeight: "16px",
}));
export const TableHeadCell = styled("td")(() => ({
  padding: "16px 8px",
  border: "1px solid #F7F7FF",
  borderTop: "0px",
  width: "100%",
}));

export const TableHeadRow = styled("tr")(() => ({
  color: theme.palette.primary.gray,
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "16px",
  height: "48px",
}));
export const TableHRow = styled("tr")(() => ({
  fontSize: "14px",
  lineHeight: "16px",
  height: "66px",
}));
export const TableCell = styled("td")(
  ({ color = "#606062", fontWeight = 500 }) => ({
    color: color,
    fontWeight: fontWeight,
    fontSize: "14px",
    lineHeight: "16px",
    padding: "16px 8px",
    border: "1px solid #F7F7FF ",
    textAlign: "center",
  })
);
export const MainContainer = styled("div")(({ dataLength }) => ({
  width: "100%",
  overflowX: dataLength < 1 ? "hidden" : "auto",

  // Enables horizontal scrolling
  // Custom scrollbar styles
  "&::-webkit-scrollbar": {
    height: "6px", // Thickness of the scrollbar
    backgroundColor: "#F8F8F8F8",
    cursor: "pointer",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#E9E9EB",
    cursor: "pointer",
    // background:
    // 	'linear-gradient(90.06deg, rgb(0, 143, 251) 0.05%, rgb(0, 227, 150) 99.96%)',
    borderRadius: "20px", // Rounded corners of the scrollbar thumb
    border: "2px solid #F0F0F0", // Creates a border around the scrollbar thumb
  },
  "&::-webkit-scrollbar-button": {
    display: "none", // Optionally remove buttons at the end of the scrollbar
  },
}));
