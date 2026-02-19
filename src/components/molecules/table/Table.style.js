import { styled } from "@mui/material/styles";
import { theme } from "../../../config/customTheme";

export const Table = styled("table")(() => ({
  width: "100%",
  borderCollapse: "collapse",
  boxSizing: "border-box",
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
}));

export const TableHeadRow = styled("tr")(() => ({
  color: theme.palette.primary.gray,
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "16px",
  height: "48px",
}));
export const TableHRow = styled("tr")(({ isClicked = false }) => ({
  boxSizing: "border-box",
  fontSize: "14px",
  lineHeight: "16px",
  height: "66px",
  border: isClicked ? "2px solid #C0C0F5" : "none",
}));

export const TableCell = styled("td")(
  ({ color, fontWeight, padding = "16px 8px", minWidth }) => ({
    color: color,
    fontWeight: fontWeight,
    lineHeight: "16px",
    padding: padding,
    border: "1px solid #F7F7FF ",
    minWidth: minWidth,
    boxSizing: "border-box",
    textAlign: "center",
  })
);
export const TableCellButton = styled("td")(({ color, fontWeight }) => ({
  color: color,
  fontWeight: fontWeight,
  lineHeight: "16px",
  padding: "16px 8px",
  border: "1px solid #F7F7FF ",
  textAlign: "center",
}));
