"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import PropTypes from "prop-types";
// import toast from 'react-hot-toast';
// import { useDispatch } from 'react-redux';
// import { postTeamMember } from '../../../../api';
import React, { memo, useCallback, useState } from "react";

import StackComponent from "../../../../components/atoms/StackComponent";
// import { addTeamMember } from '../../../../store/slices/mutateCampaignSlice';
import SubHeading from "../../../../components/atoms/createCampaigns/SubHeading";
import ButtonComp from "../../../../components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "../../../../components/atoms/boxComponent/BoxComponent";
import TextFieldComp from "../../../../components/atoms/inputFields/TextFieldComp";
import TypographyComp from "../../../../components/atoms/typography/TypographyComp";
import CircularLoader from "../../../../components/atoms/ProgressBarComponent/CircularLoader";
import CustomDropDown from "../../../../components/molecules/customDropDown/CustomDropDown";
// import { useDispatch } from 'react-redux';
// import { addTeamMember } from '../../../../store/slices/mutateCampaignSlice';
import toast from "react-hot-toast";
import { postReferralLink } from "../../../../api/post-api-services";

const AddNewReferrals = memo(({ campaignId, ownersList, onAddNewReferral }) => {
	// const dispatch = useDispatch();
	const [countryList, setCountryList] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const userInformationSchema = Yup.object().shape({
		link: Yup.string().required("Please enter link name."),
	});
	const formik = useFormik({
		initialValues: {
			link: "",
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
				linkName: values.link,
				owner: countryList.title ? countryList.title : countryList,
			};

			const res = await postReferralLink(campaignId, payload);
			if (res.data.message === "Success" && res.data.success === true) {
				// dispatch(addTeamMember(res.data?.data?.teamMember));
				const newReferral = res.data.data.referral;
				onAddNewReferral(newReferral); // Update referral data in parent
				toast.success(`${payload.linkName} has been successfully added`);
				// formik.setFieldValue('link', '', false);
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

	const countryHandler = useCallback((value) => {
		setCountryList(value);
	}, []);
	const isDisabled =
		!countryList ||
		!formik.values.link ||
		Boolean(formik.errors.link) ||
		isLoading;

	return (
		<div>
			<form onSubmit={formik.handleSubmit}>
				<SubHeading>Add referral links</SubHeading>
				<StackComponent
					spacing={{ xs: 0, sm: 3 }}
					alignItems="center"
					mt={3}
					direction={{ xs: "column", sm: "row" }}
					sx={{ width: "100%" }}
				>
					<TextFieldComp
						id="link"
						name="link"
						label={"Link name"}
						autoComplete="link"
						placeholder={"Enter link name"}
						value={formik.values.link}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.link && Boolean(formik.errors.link)}
						helperText={formik.touched.link && formik.errors.link}
						fullWidth
					/>

					<CustomDropDown
						label="Owner"
						placeholder={"Select owner"}
						onChange={countryHandler}
						data={ownersList}
						showError={true}
					/>
					<BoxComponent
						sx={{ width: { xs: "100%", sm: "auto" }, mt: { xs: 1, sm: 0 } }}
					>
						<ButtonComp
							type={"submit"}
							height="40px"
							sx={{ width: { xs: "100%", sm: "135px" } }}
							size="normal"
							disabled={isDisabled}
						>
							{isLoading ? (
								<StackComponent alignItems="center" component="span">
									<CircularLoader color="white" size="20px" />
									<TypographyComp>Adding...</TypographyComp>
								</StackComponent>
							) : (
								"Add"
							)}
						</ButtonComp>
					</BoxComponent>
				</StackComponent>
			</form>
		</div>
	);
});
AddNewReferrals.displayName = "AddNewReferrals";
AddNewReferrals.propTypes = {
	campaignId: PropTypes.string,
	ownersList: PropTypes.any,
	onAddNewReferral: PropTypes.any,
};
export default AddNewReferrals;
