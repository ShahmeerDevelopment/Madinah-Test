"use client";

/* eslint-disable indent */
import React from "react";
import PropTypes from "prop-types";

import StackComponent from "@/components/atoms/StackComponent";

const AuthModelForm = ({
  customSpacing,
  nospacing = false,
  dense = false,
  children,
  formAction = () => {},
  mt = "0px",
}) => {
  return (
    <StackComponent
      component="form"
      {...{
        direction: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      spacing={
        customSpacing
          ? customSpacing
          : nospacing
            ? "0px"
            : dense
              ? "12px"
              : "16px"
      }
      sx={{
        mt: `${mt} !important`,
      }}
      onSubmit={formAction}
    >
      {children}
    </StackComponent>
  );
};

AuthModelForm.propTypes = {
  children: PropTypes.bool,
  customSpacing: PropTypes.any,
  dense: PropTypes.bool,
  formAction: PropTypes.func,
  mt: PropTypes.string,
  nospacing: PropTypes.bool,
};

export default AuthModelForm;
