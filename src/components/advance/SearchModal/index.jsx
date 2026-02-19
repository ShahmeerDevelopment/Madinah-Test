"use client";


import PropTypes from "prop-types";
import React from "react";
import ModalComponent from "../../molecules/modal/ModalComponent";
import SearchWithTextAndCategory from "../SearchWithTextAndCategory";
import useResponsiveScreen from "../../../hooks/useResponsiveScreen";
import SmallScreenSearch from "./SmallScreenSearch";

const SearchModal = ({ state, handleClose }) => {
	const { isSmallScreen } = useResponsiveScreen();
	return (
		<>
			{isSmallScreen ? (
				<SmallScreenSearch {...{ state, handleClose }} />
			) : (
				<ModalComponent
					open={state}
					onClose={handleClose}
					hideCloseBtn
					modalStyleOverrides={{
						"& .MuiBackdrop-root": {
							background: "rgba(30, 30, 30, 0.22)",
							backdropFilter: "blur(10px)",
						},
					}}
					containerStyleOverrides={{
						top: "200px !important",
						width: "725px",
						"@media (max-width:900px)": {
							width: "calc(100% - 2 * 16px)",
							top: "160px !important",
						},
						p: "16px !important",
					}}
				>
					<SearchWithTextAndCategory
						isModalView={true}
						handleClose={handleClose}
					/>
				</ModalComponent>
			)}
		</>
	);
};

SearchModal.propTypes = {
	handleClose: PropTypes.any,
	handleOpen: PropTypes.any,
	state: PropTypes.any,
};

export default SearchModal;
