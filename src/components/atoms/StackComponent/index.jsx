"use client";

import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import React from "react";

const StackComponent = ({
  direction = "row",
  useFlexGap = false,
  spacing = 1,
  children,
  ...otherProps
}) => {
  return (
    // <Suspense fallback={<div></div>}>
    <Stack
      useFlexGap={useFlexGap}
      spacing={spacing}
      direction={direction}
      {...otherProps}
    >
      {children}
    </Stack>
    // </Suspense>
  );
};

StackComponent.propTypes = {
  children: PropTypes.any,
  direction: PropTypes.any,
  spacing: PropTypes.number,
  useFlexGap: PropTypes.bool,
};

export default StackComponent;
