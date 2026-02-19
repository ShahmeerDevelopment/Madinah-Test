"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { postTeamMember } from "../../../../api";
import React, { memo, useCallback, useState } from "react";

import DropDown from "../../../../components/atoms/inputFields/DropDown";
import StackComponent from "../../../../components/atoms/StackComponent";
import { addTeamMember } from "../../../../store/slices/mutateCampaignSlice";
import SubHeading from "../../../../components/atoms/createCampaigns/SubHeading";
import ButtonComp from "../../../../components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "../../../../components/atoms/boxComponent/BoxComponent";
import TextFieldComp from "../../../../components/atoms/inputFields/TextFieldComp";
import TypographyComp from "../../../../components/atoms/typography/TypographyComp";
import CircularLoader from "../../../../components/atoms/ProgressBarComponent/CircularLoader";

export const DROPDOWN_DATA = [
	{ _id: 1, name: "Admin", value: "admin" },
	{ _id: 2, name: "Content editor", value: "contentEditor" },
	{ _id: 3, name: "Financial manager", value: "financialManager" },
	{ _id: 3, name: "Referral manager", value: "referralManager" },
];

const AddNewMembers = memo(({ campaignId, currentUserRole }) => {
	const dispatch = useDispatch();
	const [countryList, setCountryList] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const userInformationSchema = Yup.object().shape({
		email: Yup.string()
			.email("Invalid email address.")
			.required("Please enter your email address."),
	});
	const formik = useFormik({
		initialValues: {
			email: "",
		},
		validationSchema: userInformationSchema,
		onSubmit: (values) => {
			setIsLoading(true);
			submitTeamMember(values);
		},
	});

	const submitTeamMember = async (values) => {
		try {
			const payload = {
				email: values.email,
				roleType: countryList.value,
			};

			const res = await postTeamMember(campaignId, payload);
			if (res.data.message === "Success" && res.data.success === true) {
				dispatch(addTeamMember(res.data?.data?.teamMember));
				toast.success(
					`${values.email} has been successfully invited to your team`,
				);
				formik.setFieldValue("email", "", false);
				setCountryList(null);
				setIsLoading(false);
			} else {
				toast.error(res.data.message);
				setIsLoading(false);
			}
		} catch (error) {
			console.error("error", error);
			toast.error(error);
			setIsLoading(false);
		}
	};

	const countryHandler = useCallback((value) => setCountryList(value), []);
	const isDisabled =
		!countryList || !formik.values.email || Boolean(formik.errors.email);

	return (
		<div>
			<form onSubmit={formik.handleSubmit}>
				<SubHeading>Add new members</SubHeading>
				<StackComponent
					spacing={{ xs: 0, sm: 3 }}
					alignItems="center"
					mt={3}
					direction={{ xs: "column", sm: "row" }}
					sx={{ width: "100%" }}
				>
					<TextFieldComp
						id="email"
						name="email"
						label={"Email address"}
						autoComplete="email"
						placeholder={"Enter email address"}
						value={formik.values.email}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.email && Boolean(formik.errors.email)}
						helperText={formik.touched.email && formik.errors.email}
						fullWidth
					/>
					<DropDown
						label="Role"
						isLabel={true}
						placeholder={"Select an option"}
						data={DROPDOWN_DATA}
						onChange={countryHandler}
						selectedValue={countryList}
						showError={false}
					/>
					<BoxComponent
						sx={{ width: { xs: "100%", sm: "auto" }, mt: { xs: 1, sm: 0 } }}
					>
						<ButtonComp
							type={"submit"}
							height="40px"
							sx={{ width: { xs: "100%", sm: "135px" } }}
							size="normal"
							disabled={currentUserRole === "admin" ? isDisabled : true}
						>
							{isLoading ? (
								<StackComponent alignItems="center" component="span">
									<CircularLoader color="white" size="20px" />
									<TypographyComp>Inviting...</TypographyComp>
								</StackComponent>
							) : (
								"Invite"
							)}
						</ButtonComp>
					</BoxComponent>
				</StackComponent>
			</form>
		</div>
	);
});
AddNewMembers.displayName = "AddNewMembers";
AddNewMembers.propTypes = {
	campaignId: PropTypes.string,
	currentUserRole: PropTypes.any,
};
export default AddNewMembers;
