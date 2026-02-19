/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { TABLE_HEAD_DATA } from "./constantData";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import { formatNumberWithCommas } from "../../../utils/helpers";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
// CDN-optimized: SVG served from /public/assets/ folder
const dropDownIcon = "/assets/svg/table/dropDownIcon.svg";

const borderColor = "#F8F8F8";
const rowHeight = "48px";

const CustomTable = memo(({ data }) => {
  const { isSmallScreen } = useResponsiveScreen();
  const [expandedItem, setExpandedItem] = useState(
    data?.summaryTableDetails?.length > 0 ? 0 : null
  );

  const toggleAccordion = (index) => {
    if (expandedItem === index) {
      setExpandedItem(null);
    } else {
      setExpandedItem(index);
    }
  };

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
    position: "relative",
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
        <thead>
          <tr style={{ height: "38px" }}>
            {TABLE_HEAD_DATA.map((header, idx) => (
              <td
                key={idx}
                style={{
                  padding: isSmallScreen ? "10px 2px 10px 4px" : "10px 4px 10px 8px",
                  border: "1px solid black",
                  borderTop: "0",
                  borderBottom: "0",
                  borderLeft: idx === 0 ? "0" : `1px solid ${borderColor}`,
                  borderRight:
                    TABLE_HEAD_DATA.length - 1
                      ? "0"
                      : `1px solid ${borderColor}`,
                  borderTopLeftRadius: idx === 0 ? "20px" : "0",
                  borderTopRightRadius:
                    idx === TABLE_HEAD_DATA.length - 1 ? "20px" : "0",
                  fontWeight: 500,
                  fontSize: isSmallScreen ? "12px" : "14px",
                  lineHeight: "16px",
                  color: "#A1A1A8",
                  width: idx === 0 ? "40%" : "30%",
                  wordBreak: "break-word",
                  whiteSpace: isSmallScreen ? "normal" : "nowrap",
                }}
              >
                {header.label}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <React.Fragment>
            <tr
              onClick={() =>
                data?.summaryTableDetails?.length > 0 && toggleAccordion(0)
              }
              style={{
                height: rowHeight,
                background: "#F7F7FF",
                cursor: data?.summaryTableDetails?.length > 0 && "pointer",
              }}
            >
              <td
                style={{
                  ...firstColumnStyle,
                }}
                colSpan={3}
              >
                Online
                <Image
                  src={dropDownIcon}
                  width={13}
                  height={13}
                  alt="dropdown"
                  style={{
                    position: "absolute",
                    top: "39%",
                    marginLeft: "15px",
                    transform:
                      expandedItem === 0 ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </td>
            </tr>
            {expandedItem === 0 ? (
              data?.summaryTableDetails.map((detail, detailIndex) => (
                <tr key={detailIndex} style={{ height: rowHeight }}>
                  <td
                    style={{
                      ...detailColumnStyle(),
                      color: "#606062",
                      padding: "16px 8px 16px 24px",
                    }}
                  >
                    {detail.campaignTitle}
                  </td>
                  <td
                    style={{
                      ...detailColumnStyle(),
                      color: "#A1A1A8",
                      padding: "16px 8px",
                    }}
                  >
                    $
                    {formatNumberWithCommas(
                      detail.totalUsdAmount?.toFixed(2) || 0
                    )}
                  </td>
                  <td
                    style={{
                      ...detailColumnStyle(),
                      color: "#A1A1A8",
                      padding: "16px 8px",
                    }}
                  >
                    $
                    {formatNumberWithCommas(
                      detail.totalTransferAmount?.toFixed(2) || 0
                    )}
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
                  }}
                >
                  Total Raised
                </td>
                <td
                  style={{
                    ...detailColumnStyle(),
                    color: "#090909",
                    padding: isSmallScreen ? "16px 4px" : "16px 8px",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  $
                  {formatNumberWithCommas(
                    data?.grossFundsRaised?.toFixed(2) || 0
                  )}{" "}
                </td>
                <td
                  style={{
                    ...detailColumnStyle(),
                    color: "#090909",
                    padding: isSmallScreen ? "16px 4px" : "16px 8px",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  $
                  {formatNumberWithCommas(data?.settledAmount?.toFixed(2) || 0)}
                </td>
              </tr>
            )}
          </React.Fragment>

          <React.Fragment>
            <tr
              //   onClick={() => toggleAccordion(1)}
              style={{
                height: rowHeight,
                background: "#F7F7FF",
                // cursor: "pointer",
              }}
            >
              <td
                style={{
                  ...firstColumnStyle,
                }}
                colSpan={3}
              >
                Fees
              </td>
            </tr>
            {expandedItem === 1 ? (
              data?.fees.map((detail, detailIndex) => (
                <tr key={detailIndex} style={{ height: rowHeight }}>
                  <td
                    style={{
                      ...detailColumnStyle(),
                      color: "#606062",
                      padding: "16px 8px 16px 24px",
                    }}
                  >
                    {detail.name}
                  </td>
                  <td
                    style={{
                      ...detailColumnStyle(),
                      color: "#A1A1A8",
                      padding: "16px 8px",
                    }}
                  >
                    ${formatNumberWithCommas(detail.amount?.toFixed(2) || 0)}
                  </td>
                  <td
                    style={{
                      ...detailColumnStyle(),
                      color: "#A1A1A8",
                      padding: "16px 8px",
                    }}
                  ></td>
                </tr>
              ))
            ) : (
              <tr style={{ height: rowHeight }}>
                <td
                  style={{
                    ...detailColumnStyle(),
                    color: "#606062",
                    padding: "16px 8px 16px 24px",
                  }}
                >
                  Total Fees
                </td>
                <td
                  style={{
                    ...detailColumnStyle(),
                    color: "#090909",
                    padding: "16px 8px",
                  }}
                >
                  $
                  {formatNumberWithCommas(
                    data?.feeTotalCampaignAmount?.toFixed(2) || 0
                  )}
                </td>
                <td></td>
              </tr>
            )}
          </React.Fragment>

          <tr style={{ height: rowHeight }}>
            <td
              style={{
                ...firstColumnStyle,
                border: `1px solid ${borderColor}`,
              }}
            >
              Net
            </td>
            <td
              style={{
                ...firstColumnStyle,
                color: "#090909",
                border: `1px solid ${borderColor}`,
              }}
            >
              ${formatNumberWithCommas(data?.netAmount?.toFixed(2) || 0)}
            </td>
            <td
              style={{
                ...firstColumnStyle,
                color: "#090909",
                border: `1px solid ${borderColor}`,
              }}
            ></td>
          </tr>
          <tr style={{ height: rowHeight }}>
            <td
              style={{
                ...firstColumnStyle,
                border: `1px solid ${borderColor}`,
              }}
            >
              Paid
            </td>
            <td
              style={{
                ...firstColumnStyle,
                color: "#090909",
                border: `1px solid ${borderColor}`,
              }}
            >
              {" "}
              ${formatNumberWithCommas(data?.paidAmount?.toFixed(2) || 0)}
            </td>
            <td></td>
          </tr>
          <tr style={{ height: rowHeight }}>
            <td
              style={{
                ...firstColumnStyle,
                border: `1px solid ${borderColor}`,
              }}
            >
              Total Due
            </td>
            <td></td>
            <td
              style={{
                ...firstColumnStyle,
                color: "#090909",
                border: `1px solid ${borderColor}`,
              }}
            >
              {" "}
              ${formatNumberWithCommas(data?.totalDueAmount?.toFixed(2) || 0)}
            </td>
          </tr>
        </tbody>
      </table>
    </BoxComponent>
  );
});
CustomTable.displayName = "CustomTable";
CustomTable.propTypes = {
  data: PropTypes.any,
};
export default CustomTable;
