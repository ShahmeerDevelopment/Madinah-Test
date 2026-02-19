"use client";

import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";
import { Modal } from "@mui/material";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import IconButtonComp from "../../atoms/buttonComponent/IconButtonComp";
import CloseIcon from "@mui/icons-material/Close";
import TypographyComp from "../../atoms/typography/TypographyComp";
// import Image from '../../atoms/imageComponent/Image';
import { ASSET_PATHS } from "@/utils/assets";

const InfoModal = ({ open, setOpen, width = 400 }) => {
  const style = {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    width: width,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 4,
    p: 3,
    // Responsive adjustments
    "@media (min-width: 600px)": {
      // For larger screens
      top: "50%",
      transform: "translate(-50%, -50%)",
    },
    "@media (max-width: 599px)": {
      // For smaller screens
      bottom: 0,
      transform: "translateX(-50%)",
    },
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Modal open={open}>
        <BoxComponent sx={style}>
          <IconButtonComp
            aria-label="close"
            size="small"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: "14px",
              right: "14px",
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButtonComp>
          <BoxComponent sx={{ display: "flex", flexDirection: "column" }}>
            <TypographyComp
              align="left"
              sx={{
                fontSize: "28px",
                fontWeight: 500,
                lineHeight: "38px",
                mb: 1,
              }}
            >
              The cover image will be displayed at the top of your campaign page
            </TypographyComp>

            <Image
              src={ASSET_PATHS.campaign.infoBlog}
              height={294}
              width={400}
              alt="info"
              style={{ width: "auto", height: "auto" }}
            />
            <ButtonComp
              fullWidth
              variant={"outlined"}
              size="normal"
              sx={{ mt: 2 }}
              onClick={handleClose}
            // fullWidth={isMobile ? true : false}
            >
              Close
            </ButtonComp>
          </BoxComponent>
        </BoxComponent>
      </Modal>
    </div>
  );
};
InfoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func,
  width: PropTypes.any,
  // onClose: PropTypes.func.isRequired,
  // children: PropTypes.node.isRequired,
};

export default InfoModal;
