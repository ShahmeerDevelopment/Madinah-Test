/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

import EmptyTable from "./EmptyTable";
// CDN-optimized: SVG served from /public/assets/ folder
const clip = "/assets/svg/table/clip.svg";
import SortIcon from "./icons/SortIcon";
import CopyIcon from "./icons/CopyIcon";
import StatsIcon from "./icons/StatsIcon";
import DeleteIcon from "./icons/DeleteIcon";
// import { theme } from "../../../config/customTheme";
// import LinkText from "../../atoms/linkText/LinkText";
import ModalComponent from "../modal/ModalComponent";
import { RANDOM_URL } from "../../../config/constant";
import DeleteModals from "../deleteModals/DeleteModals";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import OutlinedIconButton from "../../advance/OutlinedIconButton";
import useResponsiveScreen from "../../../hooks/useResponsiveScreen";
import { deleteReferralLink } from "../../../api/delete-api-services";
import { Table, TableCell, TableHRow, TableHeadRow } from "./Table.style";
import { useRouter } from "next/navigation";
import { theme } from "@/config/customTheme";
import LinkText from "@/components/atoms/linkText/LinkText";
import { formatNumberWithCommas } from "@/utils/helpers";

const ReferralTable = ({
  initialData,
  campaignToken,
  randomToken,
  requestSort,
}) => {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const { isSmallScreen } = useResponsiveScreen();

  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // const filteredData = useMemo(() => {
  // 	return data.filter(
  // 		(item) =>
  // 			item?.owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  // 			item?.linkName?.toLowerCase().includes(searchTerm.toLowerCase()),
  // 	);
  // }, [data, searchTerm]);

  const deleteItem = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const teamDeleteHandler = async () => {
    setIsLoading(true);
    try {
      const res = await deleteReferralLink(campaignToken, deleteId);
      if (res?.data?.success) {
        toast.success("Referral Link deleted successfully");
        const newData = data.filter((item) => item.referralToken !== deleteId);
        setData(newData);
      } else {
        toast.error("An error occurred. Please try again");
      }
    } catch {
      toast.error("An error occurred. Please try again");
    }
    setIsLoading(false);
    setOpenDeleteModal(false);
  };

  const copyLinkToClipboard = (item) => {
    navigator.clipboard
      .writeText(`${RANDOM_URL}${randomToken}?referral=${item.referralToken}`)
      .then(() => {
        toast.success("Link copied successfully!");
      })
      .catch((err) => {
        toast.error("Failed to copy: ", err);
      });
  };

  const headers = [
    { label: "Owner", key: "owner" },
    { label: "Link name", key: "linkName" },
    { label: "Visits", key: "visits" },
    { label: "Total Donations (USD)", key: "sumOfDonations" },
    { label: "Donations", key: "numberOfDonations" },
    { label: "Avg donation (USD)", key: "" },
    { label: "", key: "" },
  ];
  return (
    <>
      <BoxComponent sx={{ width: "100%", overflowX: "auto" }}>
        <Table>
          <TableHeadRow>
            {headers.map((header, idx) => (
              <td
                key={idx}
                style={{
                  padding: "16px 8px",
                  border: "1px solid #F7F7FF",
                  borderTop: "0px",
                  width:
                    idx === 0
                      ? "18%"
                      : idx === 3
                        ? "13%"
                        : idx === 5
                          ? "12%"
                          : "10%",
                }}
              >
                <BoxComponent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {header.label}
                  {idx < headers.length - 1 && ( // Check if current index is not the last
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => requestSort(header.key)}
                    >
                      <SortIcon />
                    </span>
                  )}
                </BoxComponent>
              </td>
            ))}
          </TableHeadRow>

          <tbody>
            {data.length > 0 ? (
              data.map((item) => {
                const averageDonation =
                  item.numberOfDonations > 0 && item.visits > 0
                    ? formatNumberWithCommas(
                        (item.sumOfDonations / item.visits).toFixed(2)
                      ) // Calculate average and format to 2 decimal places
                    : 0; // Handle cases with zero donations gracefully

                return (
                  <TableHRow key={item.id}>
                    <TableCell fontWeight={500}>
                      {" "}
                      {item.owner.length > 30
                        ? `${item.owner.substring(0, 30)}...`
                        : item.owner}
                    </TableCell>
                    <TableCell>
                      <LinkText
                        href={`${RANDOM_URL}${randomToken}?referral=${item.referralToken}`}
                        style={{ color: theme.palette.primary.main }}
                      >
                        {item.linkName}
                      </LinkText>
                    </TableCell>

                    <TableCell color="#090909">{item.visits}</TableCell>

                    <TableCell fontWeight={500}>
                      $
                      {formatNumberWithCommas(
                        item.sumOfDonations?.toFixed(2)
                      ) || 0}
                    </TableCell>

                    <TableCell color="#606062">
                      {item.numberOfDonations || 0}
                    </TableCell>
                    <TableCell color="#606062">
                      ${averageDonation || 0}
                    </TableCell>
                    <TableCell padding={"16px 2px"}>
                      <BoxComponent
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <OutlinedIconButton
                          width={38}
                          sx={{ padding: "0px 0px 2px 0px" }}
                          onClick={() => {
                            router.push(
                              `/statistics?id=${campaignToken}&referralToken=${item.referralToken}`
                            );
                          }}
                        >
                          <StatsIcon />
                        </OutlinedIconButton>
                        <OutlinedIconButton
                          width={38}
                          sx={{ padding: "0px 0px 0px 0px" }}
                          onClick={() => copyLinkToClipboard(item)} // Replace with your actual link
                        >
                          <CopyIcon />
                        </OutlinedIconButton>
                        <OutlinedIconButton
                          width={38}
                          sx={{ padding: "4px 0px 0px 0px" }}
                          onClick={() => deleteItem(item.referralToken)}
                        >
                          <DeleteIcon />
                        </OutlinedIconButton>
                      </BoxComponent>
                    </TableCell>
                  </TableHRow>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={isSmallScreen ? 2 : 6}
                  style={{ textAlign: "center" }}
                >
                  <EmptyTable
                    icon={clip}
                    heading="You have not added any Referral Links"
                    description="When you add links this information is displayed in this table"
                  />
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
            heading="Delete Referral Link"
            description={
              "Are you sure that you want to delete this referral link? All information about it will be deleted"
            }
          />
        </ModalComponent>
      )}
    </>
  );
};
ReferralTable.propTypes = {
  initialData: PropTypes.any,
  campaignToken: PropTypes.any,
  randomToken: PropTypes.string,
  requestSort: PropTypes.any,
};
export default ReferralTable;
