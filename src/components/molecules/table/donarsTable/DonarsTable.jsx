"use client";

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { format, parseISO } from "date-fns";
import { useDispatch, useSelector } from "react-redux";

import EmptyTable from "../EmptyTable";
import SortIcon from "../icons/SortIcon";
import EditIcon from "../icons/EditIcon";
import ModalComponent from "../../modal/ModalComponent";
// CDN-optimized: SVG served from /public/assets/ folder
const wallet = "/assets/svg/table/wallet.svg";
import ButtonComp from "../../../atoms/buttonComponent/ButtonComp";
import BoxComponent from "../../../atoms/boxComponent/BoxComponent";
import OutlinedIconButton from "../../../advance/OutlinedIconButton";
import useResponsiveScreen from "../../../../hooks/useResponsiveScreen";
import { Table, TableCell, TableHRow, TableHeadRow } from "../Table.style";
import {
  openAddDonorModalHandler,
  paymentTypeHandler,
  singleDonorDataHandler,
} from "../../../../store/slices/donorSlice";
import AddAndEditModal from "@/components/UI/Donations/addAndEditModal/AddAndEditModal";
import { formatNumberWithCommas } from "@/utils/helpers";

const getStatusStyles = (status) => {
  switch (status) {
    case "success":
      return { color: "#0CAB72", backgroundColor: "#E1FBF2" };
    case "failed":
      return { color: "#E61D1D", backgroundColor: "#FFEDED" };
    case "refunded":
      return { color: "#6363E6", backgroundColor: "#F7F7FF" };
    case "offline":
      return { color: "#5C3D99", backgroundColor: "#EAE6FF" };
    default:
      return { color: "#E61D1D", backgroundColor: "#FFEDED" }; // Default styles
  }
};

const DonarsTable = ({ initialData, requestSort }) => {
  const { isSmallScreen } = useResponsiveScreen();
  const dispatch = useDispatch();
  const [data, setData] = useState(initialData);

  const [hoveredRowId, setHoveredRowId] = useState(null);

  const openAddDonorModal = useSelector(
    (state) => state.donations.openAddDonorModal
  );

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // const formatDate = (dateString) => {
  //   return format(parseISO(dateString), "MMM d, yyyy");
  // };

  const formatDateEST = (dateString) => {
    const date = parseISO(dateString);
    const nyDate = new Date(
      date.toLocaleString("en-US", {
        timeZone: "America/New_York",
      })
    );
    return format(nyDate, "MMM d, yyyy, hh:mm a") + " EST";
  };

  const handleRowMouseEnter = (id) => {
    setHoveredRowId(id);
  };

  const handleRowMouseLeave = () => {
    setHoveredRowId(null);
  };

  const headers = [
    { label: "Date", key: "createdAt" },
    { label: "Name", key: "donorName" },
    { label: "Campaign", key: "campaignTitle" },
    { label: "Amount (USD)", key: "usdAmount" },
    // { label: "Giving levels", key: "givingLevelTitle" },
    { label: "Email", key: "donorEmail" },
    { label: "Donation Type", key: "donationType" },
    // { label: "Privacy", key: "hidePublicVisibility" },
    { label: "Status", key: "status" },
  ];
  return (
    <>
      <BoxComponent
        sx={{
          width: "100%",
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: "6px", // Thickness of the scrollbar
            backgroundColor: "#F8F8F8F8",
            cursor: "pointer",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#E9E9EB",
            cursor: "pointer",
            // background:
            // 	'linear-gradient(90.06deg, rgb(0, 143, 251) 0.05%, rgb(0, 227, 150) 99.96%)',
            borderRadius: "20px", // Rounded corners of the scrollbar thumb
            border: "2px solid #F0F0F0", // Creates a border around the scrollbar thumb
          },
          "&::-webkit-scrollbar-button": {
            display: "none", // Optionally remove buttons at the end of the scrollbar
          },
          // Hide scrollbar for Chrome, Safari and Opera
          // "&::-webkit-scrollbar": {
          //   display: "none",
          // },
          // Hide scrollbar for IE, Edge and Firefox
          // msOverflowStyle: "none", // IE and Edge
          // scrollbarWidth: "none", // Firefox
        }}
      >
        <Table>
          <thead>
            <TableHeadRow>
              {" "}
              {headers.map((header, idx) => (
                <td
                  key={idx}
                  style={{
                    padding: "16px 8px",
                    border: "1px solid #F7F7FF",
                    borderTop: "0px",
                    minWidth: [
                      "usdAmount",
                      "donationType",
                      // "givingLevelTitle",
                      "createdAt",
                    ].includes(header.key)
                      ? "120px"
                      : "auto",
                  }}
                >
                  <BoxComponent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => requestSort(header.key)}
                  >
                    {header.label}
                    {idx < headers.length - 1 && (
                      <span style={{ cursor: "pointer" }}>
                        <SortIcon />
                      </span>
                    )}
                  </BoxComponent>
                </td>
              ))}
            </TableHeadRow>
          </thead>
          <tbody style={{ boxSizing: "border-box" }}>
            {data.length > 0 ? (
              data.map((item) => (
                <TableHRow
                  key={item._id}
                  isClicked={hoveredRowId === item._id}
                  onMouseEnter={() => handleRowMouseEnter(item._id)}
                  onMouseLeave={handleRowMouseLeave}
                >
                  <TableCell width={"120px"}>
                    {formatDateEST(item.createdAt)}
                  </TableCell>
                  <TableCell fontWeight={500}>
                    {item.hidePublicVisibility ? "Anonymous" : item.donorName}
                  </TableCell>
                  <TableCell color="#090909" maxWidth={"170px"}>
                    {item.campaignTitle}
                  </TableCell>
                  <TableCell fontWeight={500}>
                    $
                    {item?.paymentType === "credit"
                      ? `${formatNumberWithCommas(item?.usdAmount?.toFixed(2))}`
                      : formatNumberWithCommas(item?.usdAmount?.toFixed(2))}
                  </TableCell>
                  {/* <TableCell color="#606062" width={"110px"}>
                    {item.givingLevelTitle}
                  </TableCell> */}
                  <TableCell color="#606062">
                    {item.hidePublicVisibility ? "Anonymous" : item.donorEmail}
                  </TableCell>
                  {hoveredRowId !== item._id && (
                    <TableCell color="#606062">{item.donationType}</TableCell>
                  )}
                  {/* {hoveredRowId !== item._id && (
                    <TableCell color="#606062">
                      {item.hidePublicVisibility == true
                        ? "Anonymous"
                        : "Public"}
                    </TableCell>
                  )} */}

                  {hoveredRowId !== item._id && (
                    <TableCell color="#606062">
                      <BoxComponent
                        sx={{
                          // background: '#E1FBF2',
                          width: "100%",
                          height: "34px",
                          borderRadius: "25px",
                          padding: "10px 14px 10px 14px",
                          // color: '#0CAB72',
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "16px",
                          textAlign: "center",
                          textTransform: "capitalize",
                          ...getStatusStyles(
                            item?.paymentType === "credit"
                              ? "success"
                              : item.status
                          ),
                        }}
                      >
                        {item.status}
                      </BoxComponent>
                    </TableCell>
                  )}
                  {hoveredRowId === item._id && (
                    <TableCell colSpan="2" color="#606062">
                      <BoxComponent
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          justifyContent: "flex-end",
                        }}
                      >
                        <ButtonComp
                          variant="text"
                          size="normal"
                          height="34px"
                          padding="10px 19px"
                          fontSize="14px"
                          lineHeight="16px"
                          sx={{
                            width: "91px",
                            textTransform: "capitalize",
                            ...getStatusStyles(
                              item?.paymentType === "credit"
                                ? "success"
                                : item.status
                            ),
                          }}
                        >
                          {item.status}
                        </ButtonComp>
                        <OutlinedIconButton
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent the event from bubbling up to the row
                            dispatch(openAddDonorModalHandler(true));
                            dispatch(singleDonorDataHandler(item));
                            dispatch(
                              paymentTypeHandler({
                                paymentType: item.isOfflinePayment
                                  ? "offline"
                                  : "online",
                                isEdit: true,
                              })
                            );
                          }}
                          sx={{
                            padding: "0px 0px 1px 3px",
                            textAlign: "center",
                          }}
                        >
                          <EditIcon />
                        </OutlinedIconButton>
                      </BoxComponent>
                    </TableCell>
                  )}
                </TableHRow>
              ))
            ) : (
              <tr>
                <td
                  colSpan={isSmallScreen ? 5 : 8}
                  style={{ textAlign: "center" }}
                >
                  <EmptyTable
                    icon={wallet}
                    heading="You have no donations"
                    description="When someone donates money to your company, it will be reflected in this table"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </BoxComponent>

      {openAddDonorModal && (
        <ModalComponent
          width={"802px"}
          open={openAddDonorModal}
          containerStyleOverrides={{
            maxHeight: "90vh",
            overflowY: "auto",
            "::-webkit-scrollbar": {
              width: "0px", // Set width to 0 to effectively hide the scrollbar
              background: "transparent", // Ensures scrollbar takes no visible space
            },
            "::-webkit-scrollbar-track": {
              background: "transparent", // Make the track transparent
            },
            "::-webkit-scrollbar-thumb": {
              background: "transparent", // Make the thumb transparent
            },
          }}
          padding={"48px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
          onClose={() => dispatch(openAddDonorModalHandler(false))}
        >
          <AddAndEditModal />
        </ModalComponent>
      )}
    </>
  );
};
DonarsTable.propTypes = {
  initialData: PropTypes.any,
  requestSort: PropTypes.func,
};
export default DonarsTable;
