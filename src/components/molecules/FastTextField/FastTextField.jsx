"use client";

import { FastField, useFormikContext } from "formik";
import React, { memo } from "react";
import PropTypes from "prop-types";
import TextFieldComp from "../../atoms/inputFields/TextFieldComp";

const FastTextField = memo(({ name, ...otherProps }) => {
	const { errors, touched, setFieldValue, setFieldTouched } =
		useFormikContext();
	return (
		<FastField name={name}>
			{({ field }) => (
				<TextFieldComp
					{...field}
					{...otherProps}
					error={Boolean(touched[name] && errors[name])}
					helperText={
						touched[name] && errors[name] ? errors[name] : otherProps.helperText
					}
					onChange={(event) => {
						setFieldValue(name, event.target.value);
					}}
					onBlur={() => {
						setFieldTouched(name, true, true);
					}}
				/>
			)}
		</FastField>
	);
});

FastTextField.displayName = "FastTextField";
FastTextField.propTypes = {
	name: PropTypes.string,
};

export default FastTextField;
