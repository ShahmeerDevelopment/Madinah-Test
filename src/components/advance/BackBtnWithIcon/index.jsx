"use client";


import PropTypes from "prop-types";
import React from "react";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";
import BackIcon from "../../../assets/icons/BackIcon";

const BackBtnWithIcon = ({
  onClick = () => {},
  sx,
  children,
  ...otherProps
}) => {
  return (
    <ButtonComp
      color="inherit"
      variant="text"
      onClick={onClick}
      startIcon={
        <div style={{ marginTop: "3px" }}>
          <BackIcon />
        </div>
      }
      sx={{
        fontSize: "14px",
        fontWeight: 400,
        pt: "5px",
        color: "#606062",
        padding: "10px, 0px",

        ...sx,
      }}
      {...otherProps}
    >
      {children}
    </ButtonComp>
  );
};

BackBtnWithIcon.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
  sx: PropTypes.object,
};

export default BackBtnWithIcon;
