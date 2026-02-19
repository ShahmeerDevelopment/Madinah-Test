"use client";

import React, { useState } from "react";

import {
  getAllReceiptsListZip,
  getCsvAllList,
  getInvoiceList,
  useGetReceiptsList,
} from "@/api";
import YourDonationLayout from "@/Layouts/YourDonationLayout/YourDonationLayout";
import { saveAs } from "file-saver";
import SimpleTableContainer from "@/components/molecules/table/simpleTable/SimpleTableContainer";

const ReceiptsUI = () => {
  const [offSet, setOffSet] = useState(0);
  const [sortBy, setSortBy] = useState("donation-date-desc");
  const [perPageLimit, setPerPageLimit] = useState(5);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const adjustedOffset =
    offSet === 1 || offSet === 0 ? 0 : (offSet - 1) * perPageLimit;
  const {
    data: receiptsList,
    isLoading,
    isError,
    error,
  } = useGetReceiptsList(
    { limit: perPageLimit, offset: adjustedOffset },
    sortBy
  );

  let receiptsTableData = receiptsList?.data.data;

  if (isError) return <p>Error: {error.message}</p>;

  const singleFileDownloader = async (invoice) => {
    try {
      const response = await getInvoiceList(invoice);

      if (response.data.success) {
        const fileUrl = response.data.data.url;

        // Fetch the file as a blob
        const fetchResponse = await fetch(fileUrl);
        const blob = await fetchResponse.blob();

        // Create a URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create link and trigger download
        const link = document.createElement("a");
        link.href = blobUrl;

        // Get filename from URL or set a default
        const fileName = fileUrl.split("/").pop() || "invoice.pdf";
        link.download = fileName; // This is important for forcing download

        // Append, click, and cleanup
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl); // Free up memory
      }
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const downloadAllReceipts = async () => {
    setIsDownloadingAll(true);
    try {
      // Get the S3 link from the API response
      const response = await getAllReceiptsListZip();
      // Assuming response.data contains the direct S3 URL to the ZIP file
      const s3Url = response.data.data.url;
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = s3Url;
      a.download = "invoices.zip";

      document.body.appendChild(a);
      a.click();

      // Clean up by removing the anchor tag from the document
      document.body.removeChild(a);
      setIsDownloadingAll(false);
    } catch (error) {
      setIsDownloadingAll(false);
      console.error("error", error);
    }
  };

  const csvButtonHandler = async () => {
    try {
      const response = await getCsvAllList();
      const csvContent = response.data;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "donation-receipt.csv");
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };
  return (
    <YourDonationLayout
      heading="Receipts"
      isDownloadButton={true}
      buttonHandler={downloadAllReceipts}
      isDownloadingAll={isDownloadingAll}
      csvButtonHandler={csvButtonHandler}
    >
      <SimpleTableContainer
        tableName="receipt_table"
        data={receiptsTableData?.payments}
        setOffSet={setOffSet}
        totalRows={receiptsTableData?.totalPaymentsCount}
        setSortBy={setSortBy}
        setPerPageLimit={setPerPageLimit}
        downloadHandler={singleFileDownloader}
        isLoading={isLoading}
        isDownloadingAll={isDownloadingAll}
      />
    </YourDonationLayout>
  );
};

export default ReceiptsUI;
