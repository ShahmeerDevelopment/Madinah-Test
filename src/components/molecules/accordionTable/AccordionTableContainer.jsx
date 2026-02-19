/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import StackComponent from "../../atoms/StackComponent";
import { theme } from "../../../config/customTheme";
import Paragraph from "../../atoms/createCampaigns/Paragraph";
import SearchField from "../table/SearchField";
import PaginationComp from "../paginationComp/PaginationComp";
import PropTypes from "prop-types";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";
import FilterIcon from "./icons/FilterIcon";
import AccordionTable from "./AccordionTable";
import { BODY_DATA } from "./constantData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ASSET_PATHS } from "@/utils/assets";
import { CSVLink } from "react-csv";
import { useSelector } from "react-redux";
import FilterIconFilled from "./icons/FilterIconFilled";
import { formatNumberWithCommas } from "@/utils/helpers";
// import ResetIcon from "./icons/ResetIcon";
// import Tooltip from "@mui/material/Tooltip"; // Add this import

const AccordionTableContainer = ({
  tableTitle = "Statistics for all campaigns",
  data = BODY_DATA,
  handleFilterBtnClick = () => { },
  referralToken = null,
  selectedFilter = false,
  resetPagination,
  // setResetFilterButton,
}) => {
  const getStoredPaginationNumber = () => {
    try {
      const storedValue = localStorage.getItem(`${"stats"}_pagination_number`);
      if (storedValue) {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [paginatedData, setPaginatedData] = useState(() => {
    try {
      const storedPage = localStorage.getItem(`${"stats"}_page`);
      return storedPage ? parseInt(storedPage, 10) : 1;
    } catch (e) {
      return 1;
    }
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  const [paginationNumber, setPaginationNumber] = useState(
    getStoredPaginationNumber
  );

  const savePaginationSettings = useCallback((page, pageSize) => {
    try {
      if (page) {
        localStorage.setItem(`${"stats"}_page`, String(page));
      }
      if (pageSize) {
        localStorage.setItem(
          `${"stats"}_pagination_number`,
          JSON.stringify(pageSize)
        );
      }
    } catch (e) {
      console.error("Error saving pagination settings:", e);
    }
  }, []);

  const campaignTitle = useSelector((state) => state.mutateCampaign.title);
  const campaignsPerPage = paginationNumber.value;

  useEffect(() => {
    localStorage.setItem(`${"stats"}_page`, paginatedData.toString());
  }, [paginatedData]);

  useEffect(() => {
    localStorage.setItem(
      `${"stats"}_pagination_number`,
      JSON.stringify(paginationNumber)
    );
  }, [paginationNumber]);

  useEffect(() => {
    setPaginatedData(1);
    localStorage.setItem(`${"stats"}_page`, "1");
  }, [paginationNumber, searchTerm]);

  useEffect(() => {
    if (resetPagination) {
      resetPagination(() => {
        localStorage.setItem(`${"stats"}_page`, "1");

        return 1;
      });
    }
  }, [resetPagination]);

  useEffect(() => {
    resetPagination(setPaginatedData);
  }, [resetPagination]);

  // useEffect(() => {
  //   // Save pagination size to localStorage whenever it changes
  //   localStorage.setItem("paginationNumber", JSON.stringify(paginationNumber));
  // }, [paginationNumber]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const getCampaignValue = (campaign, key) => {
    const details = campaign.campaignDetails;
    if (!details || details.length === 0) return 0;

    switch (key) {
      case "visitCount":
        return details.reduce(
          (sum, detail) => sum + (parseFloat(detail.visitCount) || 0),
          0
        );
      case "donationCount":
        return details.reduce(
          (sum, detail) => sum + (parseFloat(detail.donationCount) || 0),
          0
        );
      case "totalDonationValue":
        return details.reduce(
          (sum, detail) => sum + (parseFloat(detail.totalDonationValue) || 0),
          0
        );
      case "averageDonationValue": {
        const totalDonations = details.reduce(
          (sum, detail) => sum + (parseFloat(detail.totalDonationValue) || 0),
          0
        );
        const totalCount = details.reduce(
          (sum, detail) => sum + (parseFloat(detail.donationCount) || 0),
          0
        );
        return totalCount > 0 ? totalDonations / totalCount : 0;
      }
      case "donationsPerClick": {
        const totalDonations = details.reduce(
          (sum, detail) => sum + (parseFloat(detail.totalDonationValue) || 0),
          0
        );
        const totalVisits = details.reduce(
          (sum, detail) => sum + (parseFloat(detail.visitCount) || 0),
          0
        );
        return totalVisits > 0 ? totalDonations / totalVisits : 0;
      }
      case "conversionRate": {
        const totalVisits = details.reduce(
          (sum, detail) => sum + (parseFloat(detail.visitCount) || 0),
          0
        );
        const totalDonations = details.reduce(
          (sum, detail) => sum + (parseFloat(detail.donationCount) || 0),
          0
        );
        return totalVisits > 0 ? (totalDonations / totalVisits) * 100 : 0;
      }
      case "utmSource":
      case "utmMedium":
      case "utmCampaign":
      case "utmTerm":
      case "utmContent":
        return details.find((detail) => detail[key])?.[key] || "";
      default:
        return "";
    }
  };

  const sortData = useCallback((dataToSort, sortKey, sortDirection) => {
    if (!sortKey) return dataToSort;

    return [...dataToSort]
      .sort((a, b) => {
        const aValue = getCampaignValue(a, sortKey);
        const bValue = getCampaignValue(b, sortKey);

        if (typeof aValue === "string") {
          return sortDirection === "ascending"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortDirection === "ascending"
          ? aValue - bValue
          : bValue - aValue;
      })
      .map((campaign) => ({
        ...campaign,
        campaignDetails: [...campaign.campaignDetails].sort((a, b) => {
          const aValue = parseFloat(a[sortKey]) || 0;
          const bValue = parseFloat(b[sortKey]) || 0;
          return sortDirection === "ascending"
            ? aValue - bValue
            : bValue - aValue;
        }),
      }));
  }, []);

  // First sort the data
  const sortedData = useMemo(() => {
    return sortConfig.key
      ? sortData(data, sortConfig.key, sortConfig.direction)
      : data;
  }, [data, sortConfig, sortData]);

  // Then filter the sorted data
  const filteredData = useMemo(() => {
    return sortedData.filter((item) =>
      item?.campaignTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedData, searchTerm]);

  // Finally paginate the filtered data
  const paginatedCampaigns = useMemo(() => {
    const startIndex = (paginatedData - 1) * paginationNumber.value;
    const endIndex = startIndex + paginationNumber.value;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, paginatedData, paginationNumber.value]);

  const handleSort = useCallback((key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  }, []);

  const paginateHandler = useCallback(
    (event, value) => {
      if (paginatedData === value) return;
      setPaginatedData(value);
      savePaginationSettings(value, null);
    },
    [paginatedData, savePaginationSettings]
  );

  const flattenDataForCSV = (campaigns) => {
    return campaigns.reduce((acc, campaign) => {
      const campaignDetails = campaign.campaignDetails.map((detail) => ({
        campaignTitle: referralToken ? campaignTitle : campaign.campaignTitle,
        visitCount: detail.visitCount,
        donationCount: detail.donationCount,
        totalDonationValue: detail.totalDonationValue?.toFixed(2),
        averageDonation:
          detail.donationCount > 0
            ? (detail.totalDonationValue / detail.donationCount).toFixed(2)
            : 0, // Calculate average and format
        donationsPerClick:
          detail.visitCount > 0
            ? (detail?.totalDonationValue / detail?.visitCount).toFixed(2)
            : 0,
        conversionRate:
          detail.visitCount === 0
            ? 0
            : ((detail.donationCount / detail.visitCount) * 100).toFixed(2),
        utmSource: detail.utmSource,
        utmMedium: detail.utmMedium,
        utmTerm: detail.utmTerm || "", // Handle null values
        utmContent: detail.utmContent || "",
        utmCampaign: detail.utmCampaign || "",
      }));
      return [...acc, ...campaignDetails];
    }, []);
  };

  const flattenDataForPDF = (campaigns) => {
    return campaigns.reduce((acc, campaign) => {
      const campaignDetails = campaign.campaignDetails.map((detail) => ({
        campaignTitle: referralToken ? campaignTitle : campaign.campaignTitle,
        visitCount: detail.visitCount,
        donationCount: detail.donationCount,
        totalDonationValue: `$${formatNumberWithCommas(
          detail.totalDonationValue?.toFixed(2)
        )}`,
        averageDonation:
          detail.donationCount > 0
            ? `$${formatNumberWithCommas(
              (detail.totalDonationValue / detail.donationCount).toFixed(2)
            )}`
            : "$0", // Calculate average and format
        donationsPerClick:
          detail.visitCount > 0
            ? `$${formatNumberWithCommas(
              (detail?.totalDonationValue / detail?.visitCount).toFixed(2)
            )}`
            : "$0",
        conversionRate:
          detail.visitCount === 0
            ? 0
            : ((detail.donationCount / detail.visitCount) * 100).toFixed(2),
        utmParams: [
          detail?.utmCampaign || "",
          detail?.utmContent || "",
          detail?.utmMedium || "",
          detail?.utmSource || "",
          detail?.utmTerm || "",
        ].join(","),
      }));
      return [...acc, ...campaignDetails];
    }, []);
  };

  const flattenedData = flattenDataForCSV(data);
  const flatthenedPdf = flattenDataForPDF(data);

  const headers = [
    { label: "Campaign Title", key: "campaignTitle" },
    { label: "Visit Count", key: "visitCount" },
    { label: "Donation Count", key: "donationCount" },
    { label: "Total Donation Value (USD)", key: "totalDonationValue" },
    { label: "Average Donation (USD)", key: "averageDonation" },
    { label: "Donation per Visitor (USD)", key: "donationsPerClick" },
    { label: "Conversion Rate%", key: "conversionRate" },
    { label: "UTM Source", key: "utmSource" },
    { label: "UTM Medium", key: "utmMedium" },
    { label: "UTM Term", key: "utmTerm" },
    { label: "UTM Content", key: "utmContent" },
    { label: "UTM Campaign", key: "utmCampaign" },
  ];

  const generatePDF = async (data) => {
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
    try {
      const logo = await convertToBase64(ASSET_PATHS.images.logo); // Update path accordingly
      const logoWidth = 30; // Width of the logo in mm
      const logoHeight = 10; // Height of the logo in mm
      // const pageWidth = 420; // Width of an A4 paper in landscape in mm
      const pageWidth = doc.internal.pageSize.getWidth();

      const xPosition = pageWidth / 2 - logoWidth / 2; // Center the logo
      doc.addImage(logo, "JPEG", xPosition, 10, logoWidth, logoHeight);
      // Define columns header for the PDF table
      const columns = [
        { title: "Campaign Title", dataKey: "campaignTitle" },
        { title: "Visit Count", dataKey: "visitCount" },
        { title: "Donation Count", dataKey: "donationCount" },
        { title: "Total Donation Value (USD)", dataKey: "totalDonationValue" },
        { title: "Average Donation (USD)", dataKey: "averageDonation" },
        { title: "Donation per Visitor (USD)", dataKey: "donationsPerClick" },
        { title: "Conversion Rate", dataKey: "conversionRate" },
        { title: "UTM Params", dataKey: "utmParams" },
      ];

      doc.autoTable({
        startY: 30, // Start table below the logo
        columns: columns,
        headStyles: { fillColor: [52, 152, 219] }, // Optional: customize header color
        styles: { fontSize: 9, overflow: "linebreak" }, // Adjust font size
        columnStyles: {
          campaignTitle: { cellWidth: 40 }, // Set width for the title column
          visitCount: { cellWidth: 20 },
          donationCount: { cellWidth: 25 },
          totalDonationValue: { cellWidth: 20 },
          averageDonation: { cellWidth: 20 },
          donationsPerClick: { cellWidth: 20 },
          utmSource: { cellWidth: 15 },
          utmMedium: { cellWidth: 15 },
          utmTerm: { cellWidth: 30 },
          utmContent: { cellWidth: 30 },
          utmCampaign: { cellWidth: 30 },
          conversionRate: { cellWidth: 20 },
        },
        body: data,
      });

      // Save the PDF
      doc.save("campaign_statistics.pdf");
    } catch (e) {
      console.error(e);
    }
  };

  // const resetFilters = () => {
  //   setPaginationNumber({ _id: 1, name: "5 per page", value: 5 });
  //   setPaginatedData(1);
  //   localStorage.removeItem(`${"stats"}_pagination_number`);
  //   localStorage.removeItem(`${"stats"}_page`);

  //   setResetFilterButton(true);
  //   // localStorage.removeItem("donationFilters");
  // };

  const totalPage = Math.ceil(filteredData.length / campaignsPerPage);
  return (
    <>
      <StackComponent
        justifyContent="space-between"
        alignItems="center"
        sx={{
          padding: "8px 14px 8px 18px",
          height: "52px",
          borderRadius: "25px 25px 0px 0px",
        }}
      >
        <Paragraph
          sx={{ color: theme.palette.primary.darkGray, width: "100%" }}
        >
          {referralToken ? `Statistics for ${campaignTitle}` : tableTitle}
        </Paragraph>

        <SearchField searchValue={searchTerm} searchHandler={handleSearch} />
        <ButtonComp
          onClick={() => handleFilterBtnClick()}
          size="normal"
          height={"34px"}
          variant="outlined"
          padding="6px 14px"
          borderRadius="25px"
          sx={{
            width: "48px",
            minWidth: "auto",
            // backgroundColor: selectedFilter
            //   ? "rgba(82, 109, 249, 0.1)"
            //   : "transparent",
            // borderColor: selectedFilter ? "rgb(82, 109, 249)" : "inherit",
          }}
        >
          {selectedFilter ? <FilterIconFilled /> : <FilterIcon />}
        </ButtonComp>
        {/* <Tooltip title="Reset Filters" placement="top" arrow>
          <span>
            <ButtonComp
              onClick={() => resetFilters()}
              size="normal"
              height="34px"
              variant="outlined"
              padding="6px 14px"
              borderRadius="25px"
              sx={{
                width: "48px",
                minWidth: "auto",
              }}
            >
              <ResetIcon />
            </ButtonComp>
          </span>
        </Tooltip> */}
      </StackComponent>

      <AccordionTable
        searchTerm={searchTerm}
        initialData={paginatedCampaigns}
        onSort={handleSort}
        sortConfig={sortConfig}
      />

      <BoxComponent
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          mt: 2,
        }}
      >
        <PaginationComp
          totalPage={totalPage}
          page={paginatedData}
          onChange={paginateHandler}
          setPaginationNumber={setPaginationNumber}
          paginationNumber={paginationNumber}
          marginTop={0}
          resetPage={() => setPaginatedData(1)}
        />
        <BoxComponent
          sx={{
            display: "flex",
            paddingRight: { xs: 0, sm: 2 },
            width: { xs: "100%", sm: "auto" },
            mt: { xs: 2, sm: "auto" },
          }}
        >
          <ButtonComp
            variant="outlined"
            size="normal"
            height="34px"
            fontSize="14px"
            lineHeight="14px"
            // onClick={() => toPDF()}
            padding="10px 14px 8px 14px"
            sx={{
              width: { xs: "100%", sm: "130px" },

              mr: 1.25,
            }}
          >
            <CSVLink
              data={flattenedData}
              headers={headers}
              filename="campaign_statistics.csv"
              style={{ textDecoration: "none", color: "inherit" }} // Inline styles to remove underline and inherit text color
            >
              Download CSV
            </CSVLink>
          </ButtonComp>
          <ButtonComp
            variant="outlined"
            size="normal"
            height="34px"
            fontSize="14px"
            lineHeight="14px"
            // onClick={() => toPDF()}
            onClick={() => generatePDF(flatthenedPdf)}
            padding="10px 14px 8px 14px"
            sx={{ width: { xs: "100%", sm: "130px" } }}
          >
            Download PDF
          </ButtonComp>
        </BoxComponent>
      </BoxComponent>
    </>
  );
};

AccordionTableContainer.propTypes = {
  data: PropTypes.any,
  handleFilterBtnClick: PropTypes.func,
  tableTitle: PropTypes.string,
  referralToken: PropTypes.any,
  resetPagination: PropTypes.func,
};

export default AccordionTableContainer;
