/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import TeamTable from "./TeamTable";
import SearchField from "./SearchField";
import { initialData } from "./constant";
import ReferralTable from "./ReferralTable";
import { theme } from "../../../config/customTheme";
import StackComponent from "../../atoms/StackComponent";
import Paragraph from "../../atoms/createCampaigns/Paragraph";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import PaginationComp from "../paginationComp/PaginationComp";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";
import FilterIcon from "../accordionTable/icons/FilterIcon";
import DonarsTable from "./donarsTable/DonarsTable";
import { useDispatch } from "react-redux";
import { ASSET_PATHS } from "@/utils/assets";

import {
  openAddDonorModalHandler,
  paymentTypeHandler,
} from "../../../store/slices/donorSlice";
import { format, parseISO } from "date-fns";
import { useSort } from "./hooks/useSort";
import { CSVLink } from "react-csv";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import FilterIconFilled from "../accordionTable/icons/FilterIconFilled";
import { formatNumberWithCommas } from "@/utils/helpers";
// import ResetIcon from "../accordionTable/icons/ResetIcon";
// import Tooltip from "@mui/material/Tooltip"; // Add this import

const TableContainer = ({
  tableTitle = "Team members",
  data = initialData,
  campaignId,
  tableName = "team_table",
  isFilterIcon = false,
  campaignToken = "",
  randomToken = "",
  setOpenDeleteModal,
  isExtraButtonOnHeading = false,
  resetPagination,
  selectedFilter = false,
  // setResetFilterButton,
}) => {
  const dispatch = useDispatch();
  const getStoredPaginationNumber = () => {
    try {
      const storedValue = localStorage.getItem(
        `${tableName}_pagination_number`
      );
      if (storedValue && tableName === "donors_table") {
        const parsed = JSON.parse(storedValue);
        if (parsed && parsed.value && parsed.name && parsed._id) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error loading pagination settings:", e);
    }
    return {
      _id: 1,
      name: "5 per page",
      value: 5,
    };
  };
  const { isSmallScreen } = useResponsiveScreen();
  const { sortedData, requestSort } = useSort(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [paginationNumber, setPaginationNumber] = useState(
    getStoredPaginationNumber
  );
  const [paginatedData, setPaginatedData] = useState(() => {
    try {
      const storedPage = localStorage.getItem(`${tableName}_page`);
      return storedPage && tableName === "donors_table"
        ? parseInt(storedPage, 10)
        : 1;
    } catch (e) {
      return 1;
    }
  });

  const savePaginationSettings = useCallback(
    (page, pageSize) => {
      try {
        if (page && tableName === "donors_table") {
          localStorage.setItem(`${tableName}_page`, String(page));
        }
        if (pageSize && tableName === "donors_table") {
          localStorage.setItem(
            `${tableName}_pagination_number`,
            JSON.stringify(pageSize)
          );
        }
      } catch (e) {
        console.error("Error saving pagination settings:", e);
      }
    },
    [tableName]
  );
  // const { toPDF, targetRef } = usePDF({ filename: 'Referrals.pdf' });

  const campaignsPerPage = paginationNumber.value;
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (tableName === "donors_table") {
      localStorage.setItem(`${tableName}_page`, paginatedData.toString());
    }
  }, [paginatedData, tableName]);

  useEffect(() => {
    if (tableName === "donors_table") {
      localStorage.setItem(
        `${tableName}_pagination_number`,
        JSON.stringify(paginationNumber)
      );
    }
  }, [paginationNumber, tableName]);

  useEffect(() => {
    setPaginatedData(1);
    if (tableName === "donors_table") {
      localStorage.setItem(`${tableName}_page`, "1");
    }
  }, [paginationNumber, searchTerm, tableName]);

  useEffect(() => {
    if (resetPagination) {
      resetPagination(() => {
        if (tableName === "donors_table") {
          localStorage.setItem(`${tableName}_page`, "1");
        }
        return 1;
      });
    }
  }, [resetPagination, tableName]);

  useEffect(() => {
    if (resetPagination) {
      resetPagination(setPaginatedData);
    }
  }, [resetPagination]);

  const paginateHandler = useCallback(
    (event, value) => {
      if (paginatedData === value) return;
      setPaginatedData(value);
      savePaginationSettings(value, null);
    },
    [paginatedData, savePaginationSettings]
  );

  // const paginateHandler = useCallback(
  //   (event, value) => {
  //     if (paginatedData === value) {
  //       return;
  //     }
  //     setPaginatedData(value);
  //   },
  //   [paginatedData]
  // );

  const filteredData = useMemo(() => {
    if (tableName === "referral_table") {
      return sortedData.filter(
        (item) =>
          item?.linkName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
          item?.owner?.toLowerCase().includes(searchTerm?.toLowerCase())
      );
    }
    if (tableName === "donors_table") {
      // First ensure unique _id entries
      const uniqueIdMap = new Map();
      sortedData.forEach((item) => {
        if (item._id) {
          uniqueIdMap.set(item._id, item);
        }
      });
      const uniqueData = Array.from(uniqueIdMap.values());

      // Then apply the search filter
      return uniqueData.filter(
        (item) =>
          item?.campaignTitle
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item?.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item?.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item?.donorEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (tableName === "team_table") {
      return sortedData.filter(
        (item) =>
          item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return sortedData;
  }, [sortedData, searchTerm, tableName, data]);

  const paginatedCampaigns = useMemo(() => {
    const pageSize = paginationNumber.value;
    const startIndex = (paginatedData - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = filteredData?.slice(startIndex, endIndex);
    return slicedData;
  }, [filteredData, paginatedData, paginationNumber.value]);

  const totalPage = Math.ceil(
    filteredData && filteredData.length / campaignsPerPage
  );

  const extraButtonHandler = () => {
    dispatch(openAddDonorModalHandler(true));
    dispatch(paymentTypeHandler({ paymentType: "offline", isEdit: false }));
  };

  const renderTable = () => {
    switch (tableName) {
      case "team_table":
        return (
          <TeamTable
            initialData={paginatedCampaigns}
            campaignId={campaignId}
            requestSort={requestSort}
          />
        );
      case "referral_table":
        return (
          <div>
            <ReferralTable
              initialData={paginatedCampaigns}
              campaignToken={campaignToken}
              randomToken={randomToken}
              requestSort={requestSort}
            />
          </div>
        );
      case "donors_table":
        return (
          <DonarsTable
            initialData={paginatedCampaigns}
            requestSort={requestSort}
          />
        );
      default:
        return (
          <TeamTable
            initialData={paginatedCampaigns}
            campaignId={campaignId}
            requestSort={requestSort}
          />
        );
    }
  };

  const generatePDFForReferrals = async () => {
    // Dynamic import for PDF generation
    const { default: jsPDF } = await import("jspdf");
    await import("jspdf-autotable");

    const doc = new jsPDF("landscape");

    const convertToBase64 = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = (error) => reject(error);
        img.src = url;
      });
    };

    // Assuming logo is required at the top of the PDF
    try {
      const logo = await convertToBase64(ASSET_PATHS.images.logo);
      const logoWidth = 30;
      const logoHeight = 10;
      const pageWidth = 297; // A4 size
      const xPosition = pageWidth / 2 - logoWidth / 2;

      doc.addImage(logo, "PNG", xPosition, 10, logoWidth, logoHeight);

      // Define the columns and the data keys from your referral data
      const columns = [
        { title: "Owner", dataKey: "owner" },
        { title: "Link Name", dataKey: "linkName" },
        { title: "Visits", dataKey: "visits" },
        { title: "Total Donations (USD)", dataKey: "totalDonation" },
        { title: "Donations", dataKey: "donation" },
        { title: "Average Donation (USD)", dataKey: "avgDonation" },
      ];

      const referralData = filteredData.map((item) => {
        return {
          owner:
            item.owner.length > 15
              ? `${item.owner.substring(0, 15)}...`
              : item.owner,
          linkName: item.linkName,
          visits: item.visits,
          totalDonation: item.sumOfDonations
            ? `$${formatNumberWithCommas(item.sumOfDonations?.toFixed(2))}`
            : "$0", // assuming you have these fields
          donation: item.numberOfDonations || "0",
          avgDonation:
            item?.numberOfDonations > 0 && item?.visits > 0
              ? `$${formatNumberWithCommas(
                (item.sumOfDonations / item.visits).toFixed(2)
              )}`
              : "$0",
        };
      });

      doc.autoTable({
        startY: 10 + logoHeight + 5,
        columns: columns,
        body: referralData,
        theme: "striped",
      });

      doc.save("Referral_Report.pdf");
    } catch (e) {
      console.error(e);
    }
  };

  const handlePaginationNumberChange = useCallback(
    (newValue) => {
      setPaginationNumber(newValue);
      setPaginatedData(1);
      savePaginationSettings(1, newValue);
    },
    [savePaginationSettings]
  );

  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A"; // or any default value you prefer
    }
    try {
      const date = parseISO(dateString);
      const nyDate = new Date(
        date.toLocaleString("en-US", {
          timeZone: "America/New_York",
        })
      );
      return format(nyDate, "MMM d, yyyy hh:mm:ss a") + " EST";
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid date"; // or any error message you prefer
    }
  };

  const generatePDFForDonors = async () => {
    // Dynamic import for PDF generation
    const { default: jsPDF } = await import("jspdf");
    await import("jspdf-autotable");

    const doc = new jsPDF("landscape");
    // Assuming logo is required at the top of the PDF

    const convertToBase64 = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = (error) => reject(error);
        img.src = url;
      });
    };
    try {
      const logo = await convertToBase64(ASSET_PATHS.images.logo); // Update path accordingly
      const logoWidth = 30;
      const logoHeight = 10;
      const pageWidth = doc.internal.pageSize.getWidth();
      const xPosition = pageWidth / 2 - logoWidth / 2;

      doc.addImage(logo, "PNG", xPosition, 10, logoWidth, logoHeight);
      const columns = [
        { title: "Invoice ID", dataKey: "invoiceId" },
        { title: "Invoice Number", dataKey: "invoiceNumber" },
        { title: "Date", dataKey: "date" },
        { title: "Name", dataKey: "name" },
        { title: "Campaign", dataKey: "campaign" },
        { title: "Amount (USD)", dataKey: "amount" },
        { title: "Net Amount (USD)", dataKey: "netAmount" },
        { title: "Stripe Fees (USD)", dataKey: "stripeFees" },
        // { title: "Amount", dataKey: "localAmount" },
        { title: "Giving Levels", dataKey: "givingLevels" },
        { title: "Email", dataKey: "email" },
        { title: "Donation Type", dataKey: "donationType" },
        { title: "UTM Parameters", dataKey: "utmParams" },
      ];

      const donorData = filteredData.map((item) => ({
        invoiceId: item.purchaseId || "",
        invoiceNumber: item.invoiceNumber || "",
        date: formatDate(item.createdAt),
        name: item.hidePublicVisibility ? "Anonymous" : item.donorName,
        campaign: item.campaignTitle,
        amount: `$${formatNumberWithCommas(item.usdAmount?.toFixed(2)) || ""}`,
        netAmount: `$${formatNumberWithCommas(item.netAmount?.toFixed(2)) || "0"
          }`,
        stripeFees: `$${formatNumberWithCommas(item.fees?.toFixed(2)) || "0"}`,
        // localAmount: `${item.currencySymbol}${item.amount?.toFixed(2) || 0} ${
        //   item.currencyCode
        // }`,
        givingLevels: item.givingLevelTitle,
        email: item.hidePublicVisibility ? "Anonymous" : item.donorEmail,
        donationType: item.status === "offline" ? "Offline" : item.donationType,
        utmParams: [
          item?.utmCampaign || "",
          item?.utmContent || "",
          item?.utmMedium || "",
          item?.utmSource || "",
          item?.utmTerm || "",
        ].join(","),
      }));

      doc.autoTable({
        startY: 10 + logoHeight + 5,
        columns: columns,
        body: donorData,
        theme: "striped",
        styles: { fontSize: 7, overflow: "linebreak" }, // Further reduced font size
        columnStyles: {
          invoiceId: { cellWidth: 22 },
          invoiceNumber: { cellWidth: 14 },
          date: { cellWidth: 22 },
          name: { cellWidth: 25 },
          campaign: { cellWidth: 35 },
          amount: { cellWidth: 22 },
          netAmount: { cellWidth: 22 },
          stripeFees: { cellWidth: 22 },
          // localAmount: { cellWidth: 22 },
          givingLevels: { cellWidth: 25 },
          email: { cellWidth: 30 },
          donationType: { cellWidth: 25 },
          utmParams: { cellWidth: 45 },
        },
        margin: { left: 5, right: 5 }, // Further reduced margins
      });

      doc.save("Donor_Report.pdf");
    } catch (e) {
      console.error(e);
    }
  };

  const flattenDataForCSV = filteredData.map((item) => ({
    invoiceId: item.purchaseId || "",
    invoiceNumber: item.invoiceNumber || "",
    date: item.createdAt ? formatDate(item.createdAt) : "N/A",
    name: item.hidePublicVisibility ? "Anonymous" : item.donorName,
    campaign: item.campaignTitle,
    announcenementTitle: item.announcementTitle || "",
    amount: `${item.usdAmount?.toFixed(2) || ""}`,
    netAmount: `${item.netAmount?.toFixed(2) || "0"}`,
    stripeFees: `${item.fees?.toFixed(2) || "0"}`,
    processingFees: `${item.usdPaymentProcessingFees?.toFixed(2) || "0"}`,
    localAmount: `${item.currencySymbol}${item.amount?.toFixed(2) || 0} ${item.currencyCode
      }`,
    donorType: item.donorType || "",
    givingLevels: item.givingLevelTitle,
    comment: item?.comment,
    feedback: item?.feedback?.replace(/"/g, "\"\""),
    referralToken:
      item.referralToken &&
        item.referralToken !== "null" &&
        item.referralToken !== "undefined"
        ? item.referralToken
        : "",
    sellTitle: item.sellTitle || "",
    email: item.hidePublicVisibility ? "Anonymous" : item.donorEmail,
    privacy: item.hidePublicVisibility ? "Anonymous" : "Public",
    donationType: item.donationType,
    subscriptionType: item.subscriptionType || "",
    status: item.status,
    utmCampaign: item?.utmCampaign,
    utmContent: item?.utmContent,
    utmMedium: item?.utmMedium,
    utmSource: item?.utmSource,
    utmTerm: item?.utmTerm,
    // givingLevels,
  }));

  const flattenTeamDataForCSV = filteredData.map((item) => ({
    _id: item._id || "",
    email: item.email || "",
    roleType: item.roleType || "",
    status: item.status || "",
  }));

  const teamHeaders = [
    { label: "ID", key: "_id" },
    { label: "Email", key: "email" },
    { label: "Role Type", key: "roleType" },
    { label: "Status", key: "status" },
  ];

  const headers = [
    { label: "Invoice ID", key: "invoiceId" },
    { label: "Invoice Number", key: "invoiceNumber" },
    { label: "Date", key: "date" },
    { label: "Name", key: "name" },
    { label: "Campaign", key: "campaign" },
    { label: "Announcement Title", key: "announcenementTitle" },
    { label: "Amount (USD)", key: "amount" },
    { label: "Net Amount (USD)", key: "netAmount" },
    { label: "Stripe Fees (USD)", key: "stripeFees" },
    { label: "Processing Fees (USD)", key: "processingFees" },
    { label: "Amount", key: "localAmount" },
    { label: "Giving Levels", key: "givingLevels" },
    { label: "Comment", key: "comment" },
    { label: "Feedback", key: "feedback" },
    { label: "Referral Token", key: "referralToken" },
    { label: "Upsell/Downsell", key: "sellTitle" },
    { label: "Email", key: "email" },
    { label: "User Type", key: "donorType" },
    { label: "Privacy", key: "privacy" },
    { label: "Donation Type", key: "donationType" },
    { label: "Subscriptionn Type", key: "subscriptionType" },
    { label: "Status", key: "status" },
    { label: "UTM Campaign", key: "utmCampaign" },
    { label: "UTM Content", key: "utmContent" },
    { label: "UTM Medium", key: "utmMedium" },
    { label: "UTM Source", key: "utmSource" },
    { label: "UTM Term", key: "utmTerm" },
  ];

  // const resetFilters = () => {
  //   if (tableName === "donors_table") {
  //     setPaginationNumber({ _id: 1, name: "5 per page", value: 5 });
  //     setPaginatedData(1);
  //     localStorage.removeItem(`${tableName}_pagination_number`);
  //     localStorage.removeItem(`${tableName}_page`);
  //   }
  //   setResetFilterButton(true);
  //   // localStorage.removeItem("donationFilters");
  // };

  return (
    <BoxComponent sx={{ mt: 4 }}>
      <>
        <StackComponent
          justifyContent="space-between"
          alignItems="center"
          sx={{
            padding: "8px 14px 8px 18px",
            height: "52px",
            borderRadius: "25px 25px 0px 0px",
            background: theme.palette.primary.mainLight,
          }}
        >
          <Paragraph
            sx={{ color: theme.palette.primary.darkGray, width: "100%" }}
          >
            {tableTitle}
          </Paragraph>
          {isExtraButtonOnHeading && (
            <ButtonComp
              onClick={extraButtonHandler}
              size="normal"
              height={"34px"}
              variant="outlined"
              padding="6px 14px 3px 14px"
              borderRadius="25px"
              sx={{ width: isSmallScreen ? "50px" : "300px" }}
            >
              {isSmallScreen ? "+" : "+ Offline Donation"}
            </ButtonComp>
          )}

          <SearchField searchValue={searchTerm} searchHandler={handleSearch} />
          {isFilterIcon && (
            <>
              <ButtonComp
                onClick={() => setOpenDeleteModal(true)}
                size="normal"
                height={"34px"}
                variant="outlined"
                padding="6px 14px"
                borderRadius="25px"
                sx={{ width: "48px", minWidth: "auto" }}
              >
                {selectedFilter ? <FilterIconFilled /> : <FilterIcon />}
              </ButtonComp>
              {/* <Tooltip title="Reset Filters" placement="top" arrow>
                <span>
                  <ButtonComp
                    onClick={() => resetFilters()}
                    size="normal"
                    height={"34px"}
                    variant="outlined"
                    padding="6px 14px"
                    borderRadius="25px"
                    sx={{ width: "48px", minWidth: "auto" }}
                  >
                    <ResetIcon />
                  </ButtonComp>
                </span>
              </Tooltip> */}
            </>
          )}
        </StackComponent>

        {renderTable()}
        <BoxComponent
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
          }}
        >
          {paginatedCampaigns && paginatedCampaigns.length > 0 ? (
            <PaginationComp
              totalPage={totalPage}
              marginTop="0px"
              page={paginatedData}
              onChange={paginateHandler}
              setPaginationNumber={handlePaginationNumberChange}
              paginationNumber={paginationNumber}
              resetPage={() => setPaginatedData(1)}
            />
          ) : null}
          {paginatedCampaigns && paginatedCampaigns?.length > 0 ? (
            <BoxComponent
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: { xs: "100%", sm: "auto" },

                mt: { xs: 2, sm: "auto" },
              }}
            >
              {tableName !== "referral_table" && (
                <CSVLink
                  data={
                    tableName === "team_table"
                      ? flattenTeamDataForCSV
                      : flattenDataForCSV
                  }
                  // eslint-disable-next-line quotes
                  enclosingCharacter={`"`}
                  headers={tableName === "team_table" ? teamHeaders : headers}
                  filename={
                    tableName === "team_table"
                      ? "team_members.csv"
                      : "donor_details.csv"
                  }
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: isSmallScreen ? "100%" : "auto",
                  }}
                >
                  <ButtonComp
                    variant="outlined"
                    size="normal"
                    height="34px"
                    fontSize="14px"
                    lineHeight="14px"
                    padding="10px 14px 8px 14px"
                    sx={{
                      width: { xs: "100%", sm: "130px" },
                      mr: { xs: 0, sm: 1.25 },
                    }}
                  >
                    {tableName === "team_table"
                      ? "Download Report"
                      : "Download CSV"}
                  </ButtonComp>
                </CSVLink>
              )}
              {tableName !== "team_table" && (
                <ButtonComp
                  variant="outlined"
                  size="normal"
                  height="34px"
                  fontSize="14px"
                  lineHeight="14px"
                  onClick={() => {
                    if (tableName === "donors_table") {
                      generatePDFForDonors();
                    } else if (tableName === "referral_table") {
                      generatePDFForReferrals();
                    }
                  }}
                  padding="10px 14px 8px 14px"
                  sx={{
                    width: { xs: "100%", sm: "130px" },
                  }}
                >
                  {tableName === "referral_table"
                    ? "Download Report"
                    : "Download PDF"}
                </ButtonComp>
              )}
            </BoxComponent>
          ) : null}
        </BoxComponent>
      </>
    </BoxComponent>
  );
};
TableContainer.propTypes = {
  tableTitle: PropTypes.string,
  data: PropTypes.any,
  campaignId: PropTypes.string,
  tableName: PropTypes.oneOf(["team_table", "referral_table", "donors_table"]),
  isFilterIcon: PropTypes.bool,
  campaignToken: PropTypes.any,
  randomToken: PropTypes.any,
  setOpenDeleteModal: PropTypes.func,
  isExtraButtonOnHeading: PropTypes.bool,
  resetPagination: PropTypes.func,
};

export default TableContainer;
