"use client";

import React from "react";
import PropTypes from "prop-types";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";

const InputFieldComp = ({
  label,
  value,
  onChange,
  error = false,
  helperText = "",
  ...props
}) => {
  return (
    <div>
      <FormControl fullWidth sx={{ m: 1 }} variant="filled" error={error}>
        <InputLabel htmlFor="input-field">{label}</InputLabel>
        <Input id="input-field" value={value} onChange={onChange} {...props} />
        {error && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </div>
  );
};

InputFieldComp.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

export default InputFieldComp;
