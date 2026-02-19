import LinkComponent from "@/components/atoms/LinkComponent";
import StackComponent from "@/components/atoms/StackComponent";
import { styled } from "@mui/material/styles";

export const StyledForm = styled(StackComponent)(() => ({
  marginTop: "20px !important",
}));
export const LinkWrapper = styled("div")(({ invalidCredentialsError }) => ({
  width: "100%",
  display: "flex",
  marginTop: "16px !important",
  justifyContent: invalidCredentialsError ? "space-between" : "flex-end",
  marginBottom: "40px",
  alignItems: "center",
}));
export const RequiredSign = styled("span")(
  ({ theme, defaultColor = false }) => ({
    color: defaultColor ? "#606062" : theme.palette.primary.gray,
  }),
);

export const LinkSpan = styled(LinkComponent)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "inherit",
  fontWeight: "inherit",
  cursor: "pointer",
}));
