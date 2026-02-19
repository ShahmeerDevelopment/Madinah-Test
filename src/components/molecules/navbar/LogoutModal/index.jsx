"use client";

import React, { useState } from "react";
import CampaignHeading from "../../../../components/atoms/createCampaigns/CampaignHeading";
import { theme } from "../../../../config/customTheme";
import ButtonComp from "../../../../components/atoms/buttonComponent/ButtonComp";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";

const LogoutButtonWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 5,
  marginTop: "32px",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: 12,
  },
}));
const LogoutModal = ({ setOpenLogoutModal, logoutHandler }) => {
  const [isLogoutLoader, setIsLogoutLoader] = useState(false);
  const logoutButtonHandler = async () => {
    setIsLogoutLoader(true);
    await logoutHandler();
    setIsLogoutLoader(false);
  };

  return (
    <div>
      <CampaignHeading
        align={"center"}
        marginBottom={"8px"}
        sx={{ color: theme.palette.primary.dark }}
      >
        Are you sure you want to log out of your account?
      </CampaignHeading>

      <LogoutButtonWrapper>
        <ButtonComp size="normal" onClick={logoutButtonHandler} fullWidth>
          {isLogoutLoader ? "Logging out..." : "Log out"}
        </ButtonComp>
        <ButtonComp
          size="normal"
          variant="outlined"
          onClick={() => setOpenLogoutModal(false)}
          fullWidth
        >
          Close
        </ButtonComp>
      </LogoutButtonWrapper>
    </div>
  );
};

LogoutModal.propTypes = {
  setOpenLogoutModal: PropTypes.any,
  logoutHandler: PropTypes.func,
};
export default LogoutModal;
