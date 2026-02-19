import PropTypes from "prop-types";
import React from "react";
import StackComponent from "../../../../components/atoms/StackComponent";
import { useSelector } from "react-redux";
import { updateProfile } from "../../../../api/update-api-service";
import toast from "react-hot-toast";
import { getProfile } from "../../../../api/get-api-services";
import { useDispatch } from "react-redux";
import { addUserDetails } from "../../../../store/slices/authSlice";
import { updateAuthValues } from "../../../../store/slices/mutateAuthSlice";

const DetailsFormSubmit = ({
	setLoading,
	children,
	setIsSubmittedAttempted,
}) => {
	const allValues = useSelector((state) => state.mutateAuth);
	const dispatch = useDispatch();
	const handleSubmit = () => {
		const payload = {
			profileImage: allValues.profileImage,
			firstName: allValues.firstName,
			lastName: allValues.lastName,
			countryId: allValues.countryId,
			city: allValues.city,
			state: allValues.state,
			preferredLanguage: "en",
			phoneNumber: allValues.phoneNumber,
			// email: allValues.email,
		};

		updateProfile(payload)
			.then((res) => {
				const result = res?.data;
				if (result.success) {
					toast.success("Profile Updated Successfully");
					getProfile().then((res) => {
						const profileDetails = res?.data?.data;
						if (profileDetails) {
							dispatch(addUserDetails(profileDetails));
							dispatch(updateAuthValues(profileDetails));
						}
					});
					// dispatch(updateStartingAmount(0));
					// navigate('/dashboard');
				} else {
					toast.error(result.message);
				}
			})
			.catch((error) => {
				console.error(error);
				toast.error("Something went wrong");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	// const dispatch = useDispatch();
	return (
		<StackComponent
			component="form"
			onSubmit={(e) => {
				e.preventDefault();
				setLoading(true);
				handleSubmit();
				setIsSubmittedAttempted(true);
			}}
			direction="column"
			spacing="16px"
		>
			{children}
		</StackComponent>
	);
};

DetailsFormSubmit.propTypes = {
	children: PropTypes.any,
	setIsSubmittedAttempted: PropTypes.func,
	setLoading: PropTypes.func,
};

export default DetailsFormSubmit;
