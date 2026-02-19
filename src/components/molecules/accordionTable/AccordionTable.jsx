/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import {
  MainContainer,
  Table,
  TableCell,
  TableHeadCell,
  TableHeadRow,
} from "./AccordionTable.style";
import useResponsiveScreen from "../../../hooks/useResponsiveScreen";
import SortIcon from "../table/icons/SortIcon";
import PropTypes from "prop-types";
import { TABLE_HEAD_DATA } from "./constantData";
import SubHeading1 from "../../atoms/createCampaigns/SubHeading1";
// CDN-optimized: SVG served from /public/assets/ folder
const dropDownIcon = "/assets/svg/table/dropDownIcon.svg";
import { theme } from "../../../config/customTheme";
import NoDataTable from "./NoDataTable";
import { formatNumberWithCommas } from "@/utils/helpers";

const columnWidths = {
  utmSource: "100px",
  visits: "80px",
  donations: "100px",
  totalDonations: "140px",
  averageDonations: "140px",
  donationPerClick: "140px",
  conversionRate: "120px",
  utmMedium: "100px",
  utmCampaign: "100px",
  utmTerm: "100px",
  utmContent: "100px",
};

const AccordionTable = ({ initialData, onSort }) => {
  const { isSmallScreen } = useResponsiveScreen();

  // const [data, setData] = useState(initialData);
  const [expandedItem, setExpandedItem] = useState(null);
  // const [sortConfig, setSortConfig] = useState(null);

  // useEffect(() => {
  //   setData(initialData); // Update the local state whenever initialData changes
  // }, [initialData]);

  const toggleAccordion = (index) => {
    if (expandedItem === index) {
      setExpandedItem(null);
    } else {
      setExpandedItem(index);
    }
  };

  const getColumnWidth = (index) => {
    switch (index) {
      case 0:
        return columnWidths.utmSource;
      case 1:
        return columnWidths.visits;
      case 2:
        return columnWidths.donations;
      case 3:
        return columnWidths.totalDonations;
      case 4:
        return columnWidths.averageDonations;
      case 5:
        return columnWidths.donationPerClick;
      case 6:
        return columnWidths.conversionRate;
      case 7:
        return columnWidths.utmMedium;
      case 8:
        return columnWidths.utmCampaign;
      case 9:
        return columnWidths.utmTerm;
      case 10:
        return columnWidths.utmContent;
      default:
        return "auto";
    }
  };

  const cumulatedData = useMemo(() => {
    return initialData.map((item) => {
      let visits = 0;
      let donation = 0;
      let totalDonation = 0;

      const singleCampaign =
        item.campaignDetails.length === 1 ? item.campaignDetails[0] : null;

      item.campaignDetails.forEach((detail) => {
        visits += parseFloat(detail.visitCount) || 0;
        donation += parseFloat(detail.donationCount) || 0;
        totalDonation += parseFloat(detail.totalDonationValue) || 0;
      });

      const getUtmValue = (value) => {
        if (
          !value ||
          value === "null" ||
          value === "undefined" ||
          value === ""
        ) {
          return "...";
        }
        return value;
      };

      return {
        Utm_source: singleCampaign
          ? getUtmValue(singleCampaign.utmSource)
          : "...",
        Visits: visits,
        Donations: donation,
        Total_Donations: totalDonation,
        Average_Donations: donation > 0 ? totalDonation / donation : 0,
        Donations_Per_Click: visits > 0 ? totalDonation / visits : 0,
        Conversion_rate: visits > 0 ? (donation / visits) * 100 : 0,
        Utm_medium: singleCampaign
          ? getUtmValue(singleCampaign.utmMedium)
          : "...",
        Utm_campaign: singleCampaign
          ? getUtmValue(singleCampaign.utmCampaign)
          : "...",
        Utm_term: singleCampaign ? getUtmValue(singleCampaign.utmTerm) : "...",
        Utm_content: singleCampaign
          ? getUtmValue(singleCampaign.utmContent)
          : "...",
      };
    });
  }, [initialData]);

  return (
    <MainContainer dataLength={initialData.length}>
      <Table>
        <thead>
          <TableHeadRow>
            {TABLE_HEAD_DATA.map((header, idx) => (
              <TableHeadCell key={idx}>
                <BoxComponent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: getColumnWidth(idx),
                    cursor: "pointer",
                  }}
                  onClick={() => onSort(header.key)}
                >
                  {header.label}{" "}
                  <span
                    style={{
                      cursor: "pointer",
                      marginTop: "5px",
                      marginLeft: "5px",
                    }}
                  >
                    <SortIcon />
                  </span>
                </BoxComponent>
              </TableHeadCell>
            ))}
          </TableHeadRow>
        </thead>
        <tbody>
          {initialData.length > 0 ? (
            initialData.map((item, index) => (
              <React.Fragment key={item._id}>
                <tr
                  onClick={() =>
                    item?.campaignDetails?.length > 1 && toggleAccordion(index)
                  }
                  style={{ position: "relative" }}
                >
                  <td colSpan={11}>
                    <BoxComponent
                      sx={{
                        background: "#F7F7FF",
                        height: "40px",
                        padding: "8px 14px 8px 18px ",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <SubHeading1
                        sx={{ color: theme.palette.primary.darkGray }}
                      >
                        {item.campaignTitle.length > 30 && isSmallScreen
                          ? `${item.campaignTitle.substring(0, 30)}...`
                          : item.campaignTitle}
                      </SubHeading1>
                      {/* dropdown icon */}
                      {item?.campaignDetails?.length > 1 ? (
                        <Image
                          src={dropDownIcon}
                          width={16}
                          height={16}
                          alt="dropdown"
                          style={{
                            position: "sticky",
                            right: "20px",
                            // top: "47%",
                            zIndex: 1,

                            transform:
                              expandedItem === index
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                          }}
                        />
                      ) : null}
                    </BoxComponent>
                  </td>
                </tr>
                {expandedItem === index ? (
                  <tr>
                    <td colSpan={11}>
                      <BoxComponent
                        sx={{
                          maxHeight: "250px",
                          overflowY: "auto",
                          overflowX: "hidden",
                        }}
                      >
                        {item.campaignDetails.map((detail, detailIndex) => (
                          <tr key={detailIndex}>
                            <TableCell>
                              <BoxComponent
                                sx={{
                                  width: columnWidths.utmSource,
                                  wordWrap: "break-word",
                                }}
                              >
                                {detail.utmSource === "null" ||
                                  detail.utmSource === "undefined"
                                  ? "-"
                                  : detail.utmSource}
                              </BoxComponent>
                            </TableCell>
                            <TableCell>
                              <BoxComponent sx={{ width: columnWidths.visits }}>
                                {formatNumberWithCommas(detail.visitCount)}
                              </BoxComponent>
                            </TableCell>
                            <TableCell>
                              <BoxComponent
                                sx={{ width: columnWidths.donations }}
                              >
                                {formatNumberWithCommas(detail.donationCount)}
                              </BoxComponent>
                            </TableCell>
                            <TableCell>
                              <BoxComponent
                                sx={{ width: columnWidths.totalDonations }}
                              >
                                $
                                {formatNumberWithCommas(
                                  detail.totalDonationValue.toFixed(2)
                                )}
                              </BoxComponent>
                            </TableCell>
                            <TableCell>
                              <BoxComponent
                                sx={{ width: columnWidths.averageDonations }}
                              >
                                $
                                {detail.donationCount === 0
                                  ? 0
                                  : formatNumberWithCommas(
                                    (
                                      detail.totalDonationValue /
                                      detail.donationCount
                                    ).toFixed(2)
                                  )}
                              </BoxComponent>
                            </TableCell>
                            <TableCell>
                              <BoxComponent
                                sx={{ width: columnWidths.donationPerClick }}
                              >
                                $
                                {detail.visitCount === 0
                                  ? 0
                                  : formatNumberWithCommas(
                                    (
                                      detail.totalDonationValue /
                                      detail.visitCount
                                    ).toFixed(2)
                                  )}
                              </BoxComponent>
                            </TableCell>
                            <TableCell>
                              <BoxComponent
                                sx={{ width: columnWidths.conversionRate }}
                              >
                                {(detail.conversionRate * 100).toFixed(2)}%
                              </BoxComponent>
                            </TableCell>
                            <TableCell>
                              <BoxComponent
                                sx={{
                                  width: columnWidths.utmMedium,
                                  wordWrap: "break-word",
                                }}
                              >
                                {detail.utmMedium === "null" ||
                                  detail.utmMedium === "undefined"
                                  ? "-"
                                  : detail.utmMedium}
                              </BoxComponent>
                            </TableCell>
                            <TableCell>
                              <BoxComponent
                                sx={{
                                  width: columnWidths.utmCampaign,
                                  wordWrap: "break-word",
                                }}
                              >
                                {detail.utmCampaign === "null" ||
                                  detail.utmCampaign === "undefined"
                                  ? " - "
                                  : detail.utmCampaign}
                              </BoxComponent>
                            </TableCell>
                            <TableCell>
                              <BoxComponent
                                sx={{
                                  width: columnWidths.utmTerm,
                                  wordWrap: "break-word",
                                }}
                              >
                                {detail.utmTerm === "null" ||
                                  detail.utmTerm === "undefined"
                                  ? "-"
                                  : detail.utmTerm}
                              </BoxComponent>
                            </TableCell>
                            <TableCell>
                              <BoxComponent
                                sx={{
                                  width: columnWidths.utmContent,
                                  wordWrap: "break-word",
                                  marginRight: "10px",
                                }}
                              >
                                {detail.utmContent === "null" ||
                                  detail.utmContent === "undefined"
                                  ? "-"
                                  : detail.utmContent}
                              </BoxComponent>
                            </TableCell>
                          </tr>
                        ))}
                      </BoxComponent>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={11}>
                      <BoxComponent>
                        <tr>
                          <TableCell>
                            <BoxComponent
                              sx={{
                                width: columnWidths.utmSource,
                                wordWrap: "break-word",
                              }}
                            >
                              {cumulatedData[index].Utm_source}
                            </BoxComponent>
                          </TableCell>
                          <TableCell>
                            <BoxComponent sx={{ width: columnWidths.visits }}>
                              {formatNumberWithCommas(
                                cumulatedData[index].Visits
                              )}
                            </BoxComponent>
                          </TableCell>
                          <TableCell>
                            <BoxComponent
                              sx={{ width: columnWidths.donations }}
                            >
                              {formatNumberWithCommas(
                                cumulatedData[index].Donations
                              )}
                            </BoxComponent>
                          </TableCell>
                          <TableCell>
                            <BoxComponent
                              sx={{ width: columnWidths.totalDonations }}
                            >
                              $
                              {formatNumberWithCommas(
                                cumulatedData[index].Total_Donations.toFixed(2)
                              )}
                            </BoxComponent>
                          </TableCell>
                          <TableCell>
                            <BoxComponent
                              sx={{ width: columnWidths.averageDonations }}
                            >
                              $
                              {cumulatedData[index].Average_Donations.toFixed(
                                2
                              ) !== "NaN"
                                ? formatNumberWithCommas(
                                  cumulatedData[
                                    index
                                  ].Average_Donations.toFixed(2)
                                )
                                : 0}
                            </BoxComponent>
                          </TableCell>
                          <TableCell>
                            <BoxComponent
                              sx={{ width: columnWidths.donationPerClick }}
                            >
                              $
                              {cumulatedData[index].Donations_Per_Click.toFixed(
                                2
                              ) !== "NaN"
                                ? formatNumberWithCommas(
                                  cumulatedData[
                                    index
                                  ].Donations_Per_Click.toFixed(2)
                                )
                                : 0}
                            </BoxComponent>
                          </TableCell>
                          <TableCell>
                            <BoxComponent
                              sx={{ width: columnWidths.conversionRate }}
                            >
                              {cumulatedData[index].Conversion_rate.toFixed(2)}%
                            </BoxComponent>
                          </TableCell>
                          <TableCell>
                            <BoxComponent
                              sx={{
                                width: columnWidths.utmMedium,
                                wordWrap: "break-word",
                              }}
                            >
                              {cumulatedData[index].Utm_medium}
                            </BoxComponent>
                          </TableCell>
                          <TableCell>
                            <BoxComponent
                              sx={{
                                width: columnWidths.utmCampaign,
                                wordWrap: "break-word",
                              }}
                            >
                              {cumulatedData[index].Utm_campaign}
                            </BoxComponent>
                          </TableCell>
                          <TableCell>
                            <BoxComponent
                              sx={{
                                width: columnWidths.utmTerm,
                                wordWrap: "break-word",
                              }}
                            >
                              {cumulatedData[index].Utm_term}
                            </BoxComponent>
                          </TableCell>
                          <TableCell>
                            <BoxComponent
                              sx={{
                                width: columnWidths.utmContent,
                                wordWrap: "break-word",
                                marginRight: "10px",
                              }}
                            >
                              {cumulatedData[index].Utm_content}
                            </BoxComponent>
                          </TableCell>
                        </tr>
                      </BoxComponent>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td
                colSpan={isSmallScreen ? 3 : 7}
                style={{ textAlign: "center" }}
              >
                <NoDataTable />
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </MainContainer>
  );
};

AccordionTable.propTypes = {
  searchTerm: PropTypes.any,
  initialData: PropTypes.any,
};
export default AccordionTable;
