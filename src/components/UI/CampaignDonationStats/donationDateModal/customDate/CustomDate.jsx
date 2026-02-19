"use client";

import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import React, { memo, useState, useEffect } from "react";

import CircularLoader from "@/components/atoms/ProgressBarComponent/CircularLoader";
import DatePickerComp from "@/components/molecules/datePicker/DatePickerComp";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { donationPresetsDateHandler } from "@/store/slices/donorSlice";
import StackComponent from "@/components/atoms/StackComponent";
import GridComp from "@/components/atoms/GridComp/GridComp";
import CalendarIcon from "@/assets/iconComponent/CalendarIcon";

const CustomDate = memo(({ customHandler, loading }) => {
	const dispatch = useDispatch();
	const calenderDate = useSelector((state) => state.donations.calenderDate);

	const endDate =
		calenderDate.endDate !== undefined
			? calenderDate.endDate
			: calenderDate.startDate;
	const [selectedStartDate, setSelectedStartDate] = useState(
		dayjs(calenderDate.startDate),
	);
	const [selectedEndDate, setSelectedEndDate] = useState(dayjs(endDate));

	useEffect(() => {
		dispatch(
			donationPresetsDateHandler({
				startDate: selectedStartDate.format("YYYY-MM-DD"),
				endDate: selectedEndDate.format("YYYY-MM-DD"),
				value: "",
			}),
		);
	}, [selectedStartDate, selectedEndDate, dispatch]);

	const handleStartDate = (newDate) => setSelectedStartDate(newDate);
	const handleEndDate = (newDate) => setSelectedEndDate(newDate);

	const updateButtonHandler = () => customHandler();

	const noop = () => { };

	return (
		<div>
			<GridComp
				container
				columnSpacing={3}
				rowSpacing={1}
				mb={{ xs: 15, sm: 4 }}
			>
				<GridComp item xs={12} sm={6}>
					<DatePickerComp
						value={selectedStartDate}
						onChange={handleStartDate}
						setIsError={noop}
						isError={false}
						label="From"
						format="MM/DD/YYYY"
						icon={CalendarIcon}
						isRequired={false}
						textColor={"#A1A1A8"}
						displayIsError={false}
						width="100%"
					/>
				</GridComp>
				<GridComp item xs={12} sm={6}>
					<DatePickerComp
						value={selectedEndDate}
						onChange={handleEndDate}
						setIsError={noop}
						isError={false}
						label="To"
						format="MM/DD/YYYY"
						icon={CalendarIcon}
						isRequired={false}
						textColor={"#A1A1A8"}
						displayIsError={false}
						width="100%"
					/>
				</GridComp>
			</GridComp>

			<BoxComponent
				sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 4 }}
			>
				<ButtonComp
					height="46px"
					size="normal"
					sx={{ width: { xs: "100%", sm: "166px" } }}
					onClick={updateButtonHandler}
				>
					{loading ? (
						<StackComponent alignItems="center" component="span">
							<CircularLoader color="white" size="20px" />
							<TypographyComp>Updating...</TypographyComp>
						</StackComponent>
					) : (
						"Update"
					)}
				</ButtonComp>
			</BoxComponent>
		</div>
	);
});
CustomDate.propTypes = {
	customHandler: PropTypes.func,
	loading: PropTypes.bool,
};
CustomDate.displayName = "CustomDate";
export default CustomDate;
