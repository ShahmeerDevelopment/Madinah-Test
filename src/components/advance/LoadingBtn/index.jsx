"use client";


import PropTypes from "prop-types";
import React from "react";
import StackComponent from "../../atoms/StackComponent";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import { CircularProgress } from "@mui/material";
import TypographyComp from "../../atoms/typography/TypographyComp";

const LoadingBtn = ({
  btnProps,
  loadingState = false,
  disabled = false,
  children,
  variant = "contained",
  loadingLabel = "Saving",
  sx,
  loadingIcon = <CircularProgress color="inherit" size="16px" />,
  onClick = () => {},
}) => {
  return (
    <ButtonComp
      disabled={loadingState || disabled ? true : false}
      onClick={onClick}
      variant={variant}
      sx={sx}
      {...btnProps}
    >
      {loadingState && !disabled ? (
        <StackComponent alignItems="center" component="span">
          <BoxComponent
            component="span"
            sx={{ height: "100%", display: "flex", mb: "4px" }}
          >
            {loadingIcon}
          </BoxComponent>
          <TypographyComp component="span">{loadingLabel}</TypographyComp>
        </StackComponent>
      ) : (
        <>{children}</>
      )}
    </ButtonComp>
  );
};

LoadingBtn.propTypes = {
  btnProps: PropTypes.any,
  children: PropTypes.any,
  loadingIcon: PropTypes.any,
  loadingLabel: PropTypes.string,
  loadingState: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default LoadingBtn;
