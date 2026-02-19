"use client";

import PropTypes from "prop-types";
import React from "react";
import OverlayComponent from "../../atoms/OverlayComponent/index.";
import PaperComponent from "../../atoms/PaperComponent";
import TextFieldWithCross from "../TextFieldWithCross";
import StackComponent from "../../atoms/StackComponent";
import { createSearchParams } from "../../../utils/helpers";
import useSearchWithTextAndCategory from "../SearchWithTextAndCategory/hooks/useSearchWithTextAndCategory";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import SelectAbleButton from "../../atoms/selectAbleField/SelectAbleButton";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";

const SmallScreenSearch = ({ state, handleClose }) => {
	const {
		categories,
		searchHandler,
		searchQuery,
		navigate,
		handleBoxClick,
		searchValue,
		selectedTag,
		resetSearch,
	} = useSearchWithTextAndCategory(true);
	return (
		<OverlayComponent
			sx={{
				"&.MuiBackdrop-root": {
					background: "rgba(30, 30, 30, 0.22) !important",
					backdropFilter: "blur(10px) !important",
				},
			}}
			open={state}
			handleClose={handleClose}
		>
			<StackComponent
				spacing="8px"
				direction="column"
				sx={{
					position: "absolute",
					top: "11px",
					left: "16px",
					right: "16px",
				}}
			>
				<PaperComponent
					sx={{
						borderRadius: "16px",
						border: "1px solid rgba(99, 99, 230, 1)",
					}}
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<TextFieldWithCross
						value={searchValue}
						handleReset={() => resetSearch()}
						handleChange={(e) => searchHandler(e)}
					/>
				</PaperComponent>
				<PaperComponent
					onClick={(e) => {
						e.stopPropagation();
					}}
					spacing="24px"
					component={StackComponent}
					direction="column"
					sx={{
						p: "12px 8px !important",
						border: "none",
						borderRadius: "24px",
					}}
				>
					<BoxComponent sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
						{categories?.map((item, index) => (
							<SelectAbleButton
								key={index}
								isActive={selectedTag === index}
								onClick={() => handleBoxClick(index)}
								title={item.name}
							/>
						))}
					</BoxComponent>
					<ButtonComp
						disabled={searchValue === "" && !selectedTag && selectedTag !== 0}
						sx={{ gap: "6px" }}
						onClick={() => {
							const path = createSearchParams(searchQuery, "/category");
							handleClose();
							navigate(path);
						}}
					>
						<span>Search</span>
					</ButtonComp>
				</PaperComponent>
			</StackComponent>
		</OverlayComponent>
	);
};

SmallScreenSearch.propTypes = {
	handleClose: PropTypes.any,
	state: PropTypes.any,
};

export default SmallScreenSearch;
