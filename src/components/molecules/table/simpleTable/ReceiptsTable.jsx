/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";

import {
	BORDER_COLOR,
	PADDING,
	RECEIPTS_TABLE_HEADER,
	ROW_HEIGHT,
} from "./constant";
import SortIcon from "../icons/SortIcon";
import BoxComponent from "../../../atoms/boxComponent/BoxComponent";
import useResponsiveScreen from "../../../../hooks/useResponsiveScreen";
import EmptyTable from "../EmptyTable";
import OutlinedIconButton from "../../../advance/OutlinedIconButton";
// CDN-optimized: SVG served from /public/assets/ folder
const wallet = "/assets/svg/table/wallet.svg";
import DropIcon from "../icons/DropIcon";
import IconButtonComp from "../../../atoms/buttonComponent/IconButtonComp";
import { formatDateMonthToYear } from "../../../../utils/helpers";
import CircularLoader from "../../../atoms/ProgressBarComponent/CircularLoader";

// import { dateFormat, formatDate } from '../../../../utils/helpers';

const ReceiptsTable = ({
	initialData = [],
	requestSort,
	downloadHandler,
	isLoading,
}) => {
	const { isSmallScreen } = useResponsiveScreen();
	const [hoveredRowId, setHoveredRowId] = useState(null);
	const [isAmountAscending, setIsAmountAscending] = useState(false);
	const [isDateDateAscending, setIsDateDateAscending] = useState(false);

	const detailColumnStyle = () => {
		return {
			border: `1px solid ${BORDER_COLOR}`,
			fontWeight: 500,
			fontSize: "14px",
			lineHeight: "16px",
			padding: PADDING,
			color: "#606062",
		};
	};

	const toggleSort = useCallback(
		(key) => {
			if (initialData.length > 1) {
				if (key === "amount") {
					setIsAmountAscending(!isAmountAscending);
					requestSort(key, isAmountAscending);
				} else {
					setIsDateDateAscending(!isDateDateAscending);
					requestSort(key, isDateDateAscending);
				}
			}
		},
		[isAmountAscending, isDateDateAscending, requestSort],
	);
	const handleRowMouseEnter = (id) => setHoveredRowId(id);
	const handleRowMouseLeave = () => setHoveredRowId(null);

	return (
		<BoxComponent
			sx={{
				width: "100%",
				overflowX: "auto",
				borderRadius: "20px",
				border: "1px solid #F8F8F8",
			}}
		>
			<table
				style={{
					width: "100%",
					borderCollapse: "collapse",
					boxSizing: "border-box",
				}}
			>
				<thead>
					<tr style={{ height: ROW_HEIGHT }}>
						{RECEIPTS_TABLE_HEADER.map((header, idx) => (
							<td
								key={idx}
								style={{
									padding: PADDING,
									border: "1px solid black",
									borderTop: "0",
									borderBottom: "0",
									borderLeft: idx === 0 ? "0" : `1px solid ${BORDER_COLOR}`,
									borderRight:
										RECEIPTS_TABLE_HEADER.length - 1
											? "0"
											: `1px solid ${BORDER_COLOR}`,
									borderTopLeftRadius: idx === 0 ? "20px" : "0",
									borderTopRightRadius:
										idx === RECEIPTS_TABLE_HEADER.length - 1 ? "20px" : "0",
									fontWeight: 500,
									fontSize: "14px",
									lineHeight: "16px",
									color: "#A1A1A8",
								}}
							>
								<BoxComponent
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										// width: { xs: idx === 0 ? '130px' : 'auto', sm: '100%' },
									}}
								>
									{header.label}
									{header.id !== RECEIPTS_TABLE_HEADER.length - 1 && (
										<IconButtonComp
											onClick={() => toggleSort(header.key)}
											sx={{ padding: "1px 1px" }}
										>
											<SortIcon />
										</IconButtonComp>
									)}
								</BoxComponent>
							</td>
						))}
					</tr>
				</thead>
				<tbody>
					{isLoading ? (
						<tr>
							<td
								colSpan={isSmallScreen ? 3 : 6}
								style={{ textAlign: "center", height: "260px" }}
							>
								<CircularLoader />
							</td>
						</tr>
					) : initialData.length > 0 ? (
						initialData.map((detail) => (
							<React.Fragment key={detail._id}>
								<tr
									onMouseEnter={() => handleRowMouseEnter(detail._id)}
									onMouseLeave={handleRowMouseLeave}
									style={{
										height: ROW_HEIGHT,
										background:
											hoveredRowId === detail._id ? "#E3E3FD" : "none",
									}}
								>
									<td
										style={{
											...detailColumnStyle(),
										}}
									>
										{detail.currencySymbol} {detail.totalAmount}
									</td>
									<td
										style={{
											...detailColumnStyle(),
										}}
									>
										{detail.collectedAt &&
											formatDateMonthToYear(detail.collectedAt)}
									</td>

									<td
										style={{
											...detailColumnStyle(),
											display: "flex",
											alignItems: "center",
											justifyContent: detail.invoiceNumber
												? "space-between"
												: "flex-end",
										}}
									>
										{detail.collectedAt &&
											formatDateMonthToYear(detail.collectedAt)}

										<OutlinedIconButton
											disabled={detail.invoiceNumber ? false : true}
											height={"30px"}
											width={isSmallScreen ? "42px" : "56px"}
											sx={{ padding: "0px 0px" }}
											onClick={() => {
												downloadHandler(detail.invoiceNumber);
											}}
											borderColor={detail.invoiceNumber ? "#C1C1F5" : "#E9E9EB"}
										>
											<DropIcon
												color={detail.invoiceNumber ? "#6363E6" : "#E9E9EB"}
											/>
										</OutlinedIconButton>
									</td>
								</tr>
							</React.Fragment>
						))
					) : (
						<tr>
							<td
								colSpan={isSmallScreen ? 3 : 6}
								style={{ textAlign: "center" }}
							>
								<EmptyTable
									icon={wallet}
									heading="You have not made any donations yet"
									description="You haven't made a single donation. Let's help those in need!"
									isButton={true}
								/>
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</BoxComponent>
	);
};

ReceiptsTable.propTypes = {
	initialData: PropTypes.any,
	requestSort: PropTypes.func,
	downloadHandler: PropTypes.func,
	isLoading: PropTypes.bool,
};
export default ReceiptsTable;
