"use client";

import React, { memo } from "react";
import { InputAdornment } from "@mui/material";
import PropTypes from "prop-types";
import TextFieldComp from "../../atoms/inputFields/TextFieldComp";
import SearchIcon from "../../../assets/iconComponent/SearchIcon";

const SearchField = memo(({ searchValue, searchHandler }) => {
  return (
    <div>
      <TextFieldComp
        forceHideHelper
        styleOverrides={{
          "& .MuiInputBase-root": {
            border: "1px solid #E9E9EB",
            borderRadius: "16px",
            height: "36px",
            padding: "8px 16px 8px 8px",
          },
          "& .MuiInput-underline::before": {
            display: "none !important",
          },
          "& .MuiInput-underline::after": {
            display: "none !important",
          },
          "& input": {
            padding: "0 !important",
            paddingTop: "1px !important",
          },
        }}
        variant="standard"
        name="search"
        label={""}
        placeholder={"Search"}
        fullWidth
        value={searchValue}
        onChange={searchHandler}
        InputProps={{
          startAdornment: (
            <InputAdornment
              sx={{ cursor: "pointer" }}
              position="start"
              // onClick={searchButtonHandler}
            >
              <SearchIcon color={searchValue !== "" ? "#606062" : "#A1A1A8"} />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
});
SearchField.propTypes = {
  searchValue: PropTypes.string,
  searchHandler: PropTypes.func,
};

SearchField.displayName = "SearchField";
export default SearchField;
