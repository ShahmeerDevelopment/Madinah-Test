"use client";

import { Modal } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import CrossIcon from "../../../assets/icons/CrossIcon";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import IconButtonComp from "@/components/atoms/buttonComponent/IconButtonComp";

// Next
const ModalComponent = ({
  open,
  onClose,
  children,
  width,
  padding = 3,
  responsivePadding,
  hideInMobileView = false,
  modalStyleOverrides,
  containerStyleOverrides,
  hideCloseBtn = false,
}) => {
  const { isSmallScreen } = useResponsiveScreen();
  const style = {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    width: width, // Dynamic width
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 6,
    padding: padding,
    "@media (min-width: 600px)": {
      top: "50%",
      transform: "translate(-50%, -50%)",
    },
    "@media (max-width: 1000px)": {
      width: "95vw",
    },
    "@media (max-width: 599px)": {
      bottom: 0,
      transform: "translateX(-50%)",
      width: "100vw",
      borderBottomLeftRadius: "0",
      borderBottomRightRadius: "0",
      padding: responsivePadding,
    },
    ...containerStyleOverrides,
  };

  return (
    <div>
      <Modal
        sx={{ ...modalStyleOverrides }}
        open={open}
        onClose={onClose}
        disableScrollLock={true}
        disableEnforceFocus={true}
        disableAutoFocus={false}
      >
        <BoxComponent sx={style}>
          {hideCloseBtn ? null : (
            <>
              {isSmallScreen ? null : hideInMobileView ? (
                <IconButtonComp
                  aria-label="close"
                  size="small"
                  onClick={onClose}
                  sx={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                  }}
                >
                  <CrossIcon />
                </IconButtonComp>
              ) : (
                <IconButtonComp
                  aria-label="close"
                  size="small"
                  onClick={onClose}
                  sx={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                  }}
                >
                  <CrossIcon />
                </IconButtonComp>
              )}
            </>
          )}

          {children}
        </BoxComponent>
      </Modal>
    </div>
  );
};

ModalComponent.propTypes = {
  children: PropTypes.node,
  containerStyleOverrides: PropTypes.any,
  hideCloseBtn: PropTypes.bool,
  hideInMobileView: PropTypes.bool,
  modalStyleOverrides: PropTypes.any,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  padding: PropTypes.any,
  responsivePadding: PropTypes.any,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ModalComponent;
