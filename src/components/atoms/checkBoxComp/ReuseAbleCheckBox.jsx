"use client";

import React from "react";
import PropTypes from "prop-types";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";

const ReuseAbleCheckBox = ({
	label,
	checked,
	onChange,
	labelStyling,
	size = "small",
	disabled = false,
	mt = 2,
	sx,
	color = "#0CAB72",
}) => {
	return (
		<FormGroup sx={{ mb: -1.5, mt: mt, ...sx }}>
			<FormControlLabel
				margin="dense"
				control={
					<Checkbox
						disabled={disabled}
						checked={checked}
						onChange={onChange}
						size={size}
						sx={{
							color: color,
							"&.Mui-checked": {
								color: color,
							},
							"&.MuiCheckbox-root": {
								borderRadius: "20px",
								marginTop: "-5px",
							},
						}}
					/>
				}
				label={label}
				sx={labelStyling}
			/>
		</FormGroup>
	);
};

ReuseAbleCheckBox.propTypes = {
	label: PropTypes.string.isRequired,
	checked: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
	labelStyling: PropTypes.object,
	size: PropTypes.string,
	disabled: PropTypes.bool,
	mt: PropTypes.number,
	sx: PropTypes.object,
	color: PropTypes.string,
};

export default ReuseAbleCheckBox;
