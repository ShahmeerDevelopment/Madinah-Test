"use client";

import * as React from "react";
import PropTypes from "prop-types";
import Autocomplete from "@mui/material/Autocomplete";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import { Chip, Popper, styled, Tooltip } from "@mui/material";

const DEFAULT_OPTIONS = [
  { name: "City of God", year: 2002 },
  { name: "Se7en", year: 1995 },
  { name: "The Silence of the Lambs", year: 1991 },
  { name: "It's a Wonderful Life", year: 1946 },
];

export default function MultiSelectInput({
  placeholder = "placeholder",
  label = "label",
  options = DEFAULT_OPTIONS,
  textFieldProps,
  onChange = () => {},
  value = [],
}) {
  const dropDownOptionHandler = (event, value) => {
    onChange(value);
  };

  const CustomPopper = styled(Popper)({
    "& .MuiAutocomplete-listbox": {
      // maxHeight: "200px", // Adjust as needed
      // overflowY: "auto",
      // scrollbarWidth: "none", // For Firefox: thinner scrollbar
      // scrollbarColor: "#A1A1A8 transparent", // Custom color for scrollbar in Firefox

      "&::-webkit-scrollbar": {
        width: "4px",
        backgroundColor: "#fff",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#E9E9EB", // Custom color for the scrollbar thumb
        borderRadius: "8px", // Rounded corners
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent", // Transparent track
      },
      // Completely hide the scrollbar buttons (up and down arrows)
      "&::-webkit-scrollbar-button": {
        display: "none", // Hide the scrollbar buttons
      },
    },
  });

  const getDisplayName = (name) => {
    return name?.length > 20 ? `${name.substring(0, 19)}...` : name;
  };

  return (
    <Autocomplete
      fullWidth
      multiple
      freeSolo
      PopperComponent={CustomPopper}
      id="tags-standard"
      options={options}
      value={value}
      onChange={dropDownOptionHandler}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        if (option && typeof option === "object") {
          return option.name || "";
        }
        return "";
      }}
      isOptionEqualToValue={(option, value) => {
        if (typeof option === "string" && typeof value === "string") {
          return option === value;
        }
        if (typeof option === "object" && typeof value === "string") {
          return option.name === value;
        }
        if (typeof option === "string" && typeof value === "object") {
          return option === value.name;
        }
        if (typeof option === "object" && typeof value === "object") {
          return option._id === value._id;
        }
        return false;
      }}
      ChipProps={{ size: "small" }} // Reduce chip size
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const name = option?.name || option;
          const displayName = getDisplayName(name);

          return (
            <Tooltip title={name?.length > 20 ? name : ""} key={index}>
              <Chip
                variant="outlined"
                size="small"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "& .MuiChip-label": {
                    padding: "2px 5px 0px 5px",
                  },
                }}
                {...getTagProps({ index })}
                label={displayName}
              />
            </Tooltip>
          );
        })
      }
      renderInput={(params) => {
        return (
          <TextFieldComp
            {...params}
            {...textFieldProps}
            label={label}
            placeholder={placeholder}
          />
        );
      }}
    />
  );
}
MultiSelectInput.propTypes = {
  placeholder: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.any,
  textFieldProps: PropTypes.any,
  onChange: PropTypes.func,
};
