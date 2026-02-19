"use client";

import React from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";

// Next
const IconButtonComp = ({
  ariaLabel = "button",
  onClick = () => {},
  children,
  size = "small",
  id = "",
  ...props
}) => {
  return (
    <IconButton
      id={id}
      disableFocusRipple={true}
      disableRipple={false}
      aria-label={ariaLabel}
      onClick={(e) => {
        onClick(e);
      }}
      size={size}
      {...props}
    >
      {children}
    </IconButton>
  );
};

// PropTypes
IconButtonComp.propTypes = {
  ariaLabel: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  size: PropTypes.string,
  id: PropTypes.string,
};

export default IconButtonComp;
