/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import SortIcon from "./icons/SortIcon";
import RoleSelector from "./RoleSelector";
import DeleteIcon from "./icons/DeleteIcon";
import { deleteTeamMember } from "../../../api";
import { theme } from "../../../config/customTheme";
import ModalComponent from "../modal/ModalComponent";
import DeleteModals from "../deleteModals/DeleteModals";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import useResponsiveScreen from "../../../hooks/useResponsiveScreen";
import { addTeamMember } from "../../../store/slices/mutateCampaignSlice";
import {
	Table,
	TableCell,
	TableCellButton,
	TableHRow,
	TableHeadCell,
	TableHeadRow,
} from "./Table.style";
import EmptyTable from "./EmptyTable";

const TeamTable = ({ initialData, campaignId, requestSort }) => {
	const dispatch = useDispatch();
	const { isSmallScreen } = useResponsiveScreen();

	const [data, setData] = useState(initialData);

	const [isLoading, setIsLoading] = useState(false);
	const [teamMemberId, setTeamMemberId] = useState("");
	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	useEffect(() => {
		setData(initialData); // Update the local state whenever initialData changes
	}, [initialData]);

	const deleteItem = (id) => {
		setTeamMemberId(id);
		setOpenDeleteModal(true);
	};

	const teamDeleteHandler = () => {
		setIsLoading(true);
		deleteTeamMember(campaignId, { teamMemberId: teamMemberId })
			.then((res) => {
				if (res.data.message === "Success" && res.data.success === true) {
					dispatch(addTeamMember(res.data.data?.teamMembers));
					setOpenDeleteModal(false);
				}
			})
			.catch((err) => {
				console.error("error", err);
				setOpenDeleteModal(false);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<>
			<BoxComponent sx={{ width: "100%", overflowX: "auto" }}>
				<Table>
					<thead>
						<TableHeadRow>
							{[
								"Name",
								"Role",
								...(isSmallScreen ? [] : ["Email", "Status", ""]),
							].map((header, idx, arr) => (
								<TableHeadCell key={idx}>
									<BoxComponent
										sx={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
										}}
									>
										{header}{" "}
										{idx !== arr.length - 1 && ( // Check if current index is not the last
											<span
												style={{ cursor: "pointer" }}
												onClick={() => requestSort(header.toLowerCase())}
											>
												<SortIcon />
											</span>
										)}
									</BoxComponent>
								</TableHeadCell>
							))}
						</TableHeadRow>
					</thead>
					<tbody>
						{data.length > 0 ? (
							data.map((item) => (
								<TableHRow key={item.id}>
									<TableCell fontWeight={500}>{item.name}</TableCell>
									<TableCell>
										<RoleSelector initialData={item} />
									</TableCell>

									{!isSmallScreen && (
										<TableCell color="#606062">{item.email}</TableCell>
									)}

									{!isSmallScreen && (
										<TableCell>
											<BoxComponent
												sx={{
													width: "81px",
													height: "34px",
													padding: "10px 14px",
													borderRadius: "25px",
													fontWeight: 500,
													textAlign: "center",
													textTransform: "capitalize",
													color:
														item.status === "pending"
															? theme.palette.primary.main
															: "#0CAB72",
													backgroundColor:
														item.status === "pending" ? "#F7F7FF" : "#E1FBF2",
												}}
											>
												{item.status}
											</BoxComponent>
										</TableCell>
									)}
									<TableCellButton>
										<ButtonComp
											height="34px"
											borderRadius="25px"
											padding={
												isSmallScreen
													? "6px 11px 0px 11px"
													: "6px 19px 0px 19px"
											}
											sx={{
												width: { xs: "20px", sm: "56px" },
											}}
											size="normal"
											variant="outlined"
											onClick={() => deleteItem(item._id)}
										>
											<DeleteIcon />
										</ButtonComp>
									</TableCellButton>
								</TableHRow>
							))
						) : (
							<tr>
								<td
									colSpan={isSmallScreen ? 2 : 4}
									style={{ textAlign: "center" }}
								>
									<EmptyTable />
								</td>
							</tr>
						)}
					</tbody>
				</Table>
			</BoxComponent>
			{openDeleteModal && (
				<ModalComponent
					width={"422px"}
					open={openDeleteModal}
					padding={"48px 32px"}
					responsivePadding={"40px 16px 56px 16px"}
					onClose={() => setOpenDeleteModal(false)}
				>
					<DeleteModals
						levelDeleteHandler={teamDeleteHandler}
						isDeleteLoader={isLoading}
						setOpenDeleteMOdel={setOpenDeleteModal}
						heading="Delete Team Member"
						description={
							"Are you sure that you want to delete this Team Member? All information about it will be deleted"
						}
					/>
				</ModalComponent>
			)}
		</>
	);
};

TeamTable.propTypes = {
	initialData: PropTypes.any,
	campaignId: PropTypes.string,
	requestSort: PropTypes.func,
};
export default TeamTable;
