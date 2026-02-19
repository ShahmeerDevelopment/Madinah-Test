"use client";

import React, { useState } from "react";
import Image from "next/image";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import PropTypes from "prop-types";
// CDN-optimized: SVG served from /public/assets/ folder
const dropDownIcon = "/assets/svg/table/dropDownIcon.svg";
import { formatNumberWithCommas } from "../../../utils/helpers";
import dayjs from "dayjs";

const borderColor = "#F8F8F8";
const rowHeight = "48px";
const detailColumnStyle = () => {
  return {
    border: `1px solid ${borderColor}`,
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "16px",
  };
};
const firstColumnStyle = {
  padding: "16px 8px",
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "22px",
  color: "#606062",
};

const OutstandingTable = ({ data }) => {
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleAccordion = (index) => {
    if (data?.payoutRecords.length > 0) {
      if (expandedItem === index) {
        setExpandedItem(null);
      } else {
        setExpandedItem(index);
      }
    }
  };

  return (
    <BoxComponent
      sx={{
        width: "100%",
        overflow: "hidden",
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
        <tbody>
          <React.Fragment>
            <tr
              onClick={() => toggleAccordion(0)}
              style={{
                height: rowHeight,
                background: "#F7F7FF",
                cursor: "pointer",
              }}
            >
              <td
                style={{
                  ...firstColumnStyle,
                }}
                colSpan={3}
              >
                Payouts
                <Image
                  src={dropDownIcon}
                  width={13}
                  height={13}
                  alt="dropdown"
                  style={{
                    marginLeft: "15px",
                    transform:
                      data?.payoutRecords.length > 0
                        ? expandedItem === 0
                          ? "rotate(180deg)"
                          : "rotate(0deg)"
                        : null,
                  }}
                />
              </td>
            </tr>
            {expandedItem === 0 ? (
              data?.payoutRecords.map((detail, detailIndex) => (
                <tr key={detailIndex} style={{ height: rowHeight }}>
                  <td
                    style={{
                      ...detailColumnStyle(),
                      color: "#606062",
                      padding: "16px 8px 16px 24px",
                      width: "50%",
                    }}
                  >
                    {dayjs(detail.createdAt).format("YYYY-MM-DD")}
                  </td>
                  <td
                    style={{
                      ...detailColumnStyle(),
                      color: "#A1A1A8",
                      padding: "16px 8px",
                    }}
                  >
                    ${formatNumberWithCommas(detail.usdAmount?.toFixed(2) || 0)}
                  </td>
                </tr>
              ))
            ) : (
              <tr style={{ height: rowHeight }}>
                <td
                  style={{
                    ...detailColumnStyle(),
                    color: "#606062",
                    padding: "16px 8px 16px 24px",
                    width: "50%",
                  }}
                >
                  Total
                </td>
                <td
                  style={{
                    ...detailColumnStyle(),
                    color: "#090909",
                    padding: "16px 8px",
                  }}
                >
                  $
                  {formatNumberWithCommas(data?.settledAmount?.toFixed(2) || 0)}
                </td>
              </tr>
            )}
          </React.Fragment>
        </tbody>
      </table>
    </BoxComponent>
  );
};
OutstandingTable.propTypes = {
  data: PropTypes.any,
};

export default OutstandingTable;
