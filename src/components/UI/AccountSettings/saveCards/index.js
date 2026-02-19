"use client";

import React, { useEffect } from "react";
import Cards from "./Cards";
import PropTypes from "prop-types";
import { useGetCreditCardList } from "../../../../api";
import { useDispatch } from "react-redux";
import { updatePaymentCardLength } from "../../../../store/slices/mutateAuthSlice";

// const cardDetails = [
// 	{
// 		id: 1,
// 		heading: 4141414144141,
// 		icon: '',
// 		brand: 'Visa',
// 		nameOnCard: 'Ishtiaq ahmad',
// 		expiryDate: '12/34',
// 		cvv: 123,
// 		country: { name: 'pakistan' },
// 		postalCode: '123',
// 	},
// 	{
// 		id: 2,
// 		heading: 5252726782163,
// 		icon: '',
// 		brand: 'American Express',
// 	},
// 	{
// 		id: 3,
// 		heading: 8347389373933,
// 		icon: '',
// 		brand: 'Union Pay',
// 	},
// 	{
// 		id: 4,
// 		heading: 9584373837393,
// 		icon: '',
// 		brand: 'Discover',
// 	},
// ];
const SaveCards = ({ isEdit, openEditModal, setIsEdit, setOpenEditModal }) => {
	const dispatch = useDispatch();
	const {
		data: creditCardList,
		refetch,
		isLoading,
	} = useGetCreditCardList({ enabled: true });

	useEffect(() => {
		dispatch(
			updatePaymentCardLength(creditCardList?.data?.data?.cards?.length),
		);
	}, [creditCardList]);

	return (
		<div>
			<Cards
				isLoading={isLoading}
				refetch={refetch}
				isEdit={isEdit}
				openEditModal={openEditModal}
				setIsEdit={setIsEdit}
				setOpenEditModal={setOpenEditModal}
				cardDetails={creditCardList?.data?.data?.cards}
			/>
		</div>
	);
};

SaveCards.propTypes = {
	isEdit: PropTypes.any,
	openEditModal: PropTypes.any,
	setIsEdit: PropTypes.any,
	setOpenEditModal: PropTypes.any,
};

export default SaveCards;
