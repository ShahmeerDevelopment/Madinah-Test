"use client";


import PropTypes from "prop-types";
import React from "react";
import CloseIcon from "./assets/CloseIcon";
import { IconButton } from "@mui/material";
import SearchIcon from "./assets/SearchIcon";
import { buildSimpleTypography } from "./../../../utils/helpers";

const TextFieldWithCross = ({
  value,
  handleChange = () => {},
  handleReset = () => {},
}) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "34px",
        alignItems: "center",
        paddingLeft: "18.25px",
        paddingRight: "8px",
      }}
    >
      <div style={{ marginRight: "8px" }}>
        <SearchIcon />
      </div>
      <input
        value={value}
        onChange={(e) => {
          handleChange(e);
        }}
        style={{
          border: "none",
          outline: "none",
          flexGrow: 1,
          ...buildSimpleTypography(400, 16, 20),
          color: "rgba(96, 96, 98, 1)",
        }}
        label=""
        alt="search"
      />
      {value ? (
        <IconButton
          onClick={() => {
            handleReset();
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </div>
  );
};

TextFieldWithCross.propTypes = {
  handleChange: PropTypes.func,
  handleReset: PropTypes.func,
  value: PropTypes.any,
};

export default TextFieldWithCross;
