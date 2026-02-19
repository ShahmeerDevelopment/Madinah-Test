"use client";

import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";

import EmptyTable from "../EmptyTable";
import SortIcon from "../icons/SortIcon";
import ForwardIcon from "../icons/ForwardIcon";
// CDN-optimized: SVG served from /public/assets/ folder
const wallet = "/assets/svg/table/wallet.svg";
import BoxComponent from "../../../atoms/boxComponent/BoxComponent";

import {
  BORDER_COLOR,
  DONATION_TABLE_HEADER,
  PADDING,
  ROW_HEIGHT,
} from "./constant";
import { getCardIcon } from "../../../../config/constant";
import StackComponent from "../../../atoms/StackComponent";
import { formatDateMonthToYear } from "../../../../utils/helpers";
import useResponsiveScreen from "../../../../hooks/useResponsiveScreen";
import IconButtonComp from "../../../atoms/buttonComponent/IconButtonComp";
import CircularLoader from "../../../atoms/ProgressBarComponent/CircularLoader";
import { useRouter } from "next/navigation";
import Image from "next/image";

const RecurringTable = ({
  requestSort = () => {},
  initialData = [],
  isLoading,
}) => {
  const router = useRouter();
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

  const handleRowMouseEnter = (id) => setHoveredRowId(id);
  const handleRowMouseLeave = () => setHoveredRowId(null);

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
    [isAmountAscending, isDateDateAscending, requestSort, initialData]
  );

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
            {DONATION_TABLE_HEADER.map((header, idx) => (
              <td
                key={idx}
                style={{
                  padding: PADDING,
                  border: "1px solid black",
                  borderTop: "0",
                  borderBottom: "0",
                  borderLeft: idx === 0 ? "0" : `1px solid ${BORDER_COLOR}`,
                  borderRight:
                    DONATION_TABLE_HEADER.length - 1
                      ? "0"
                      : `1px solid ${BORDER_COLOR}`,
                  borderTopLeftRadius: idx === 0 ? "20px" : "0",
                  borderTopRightRadius:
                    idx === DONATION_TABLE_HEADER.length - 1 ? "20px" : "0",
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
                    width: { xs: idx === 0 ? "130px" : "auto", sm: "100%" },
                  }}
                >
                  {header.label}
                  {header.id !== DONATION_TABLE_HEADER.length - 1 && (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleSort(header.key)}
                    >
                      <SortIcon />
                    </span>
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
                    {detail.collectedAt &&
                      formatDateMonthToYear(detail.collectedAt)}
                  </td>
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
                    {detail?.subscriptionType}
                  </td>
                  <td
                    style={{
                      ...detailColumnStyle(),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <StackComponent>
                      {detail.cardType && (
                        <Image
                          width={33}
                          height={22}
                          borderRadius={"4px"}
                          src={
                            detail.cardType ? getCardIcon(detail?.cardType) : ""
                          }
                          alt={detail?.cardType}
                        />
                      )}
                      &nbsp; &nbsp;{detail.cardType && "****"}
                      {detail.lastFourDigits}
                    </StackComponent>
                    <IconButtonComp
                      onClick={() =>
                        router.push(`/your-donations/details?id=${detail._id}`)
                      }
                    >
                      <ForwardIcon />
                    </IconButtonComp>
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
RecurringTable.propTypes = {
  initialData: PropTypes.any,
  requestSort: PropTypes.func,
  isLoading: PropTypes.bool,
};
export default RecurringTable;
