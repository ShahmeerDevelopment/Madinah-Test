"use client";

import React, { useState } from "react";
import { formatDateMonthToYear } from "@/utils/helpers";
import YourDonationLayout from "@/Layouts/YourDonationLayout/YourDonationLayout";
import DonationInformation from "./DonationInformation";
import ContactDetail from "./ContactDetail";
import StackComponent from "@/components/atoms/StackComponent";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import SimpleTableContainer from "@/components/molecules/table/simpleTable/SimpleTableContainer";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import {
  cancelSubscription,
  getInvoiceList,
  getSpecificUserReceiptsList,
  updateRecurringDonation,
  useGetDonationDetails,
} from "@/api";
import { useSearchParams } from "next/navigation";
import ModalComponent from "@/components/molecules/modal/ModalComponent";
import EditDonationModal from "../EditDonationModal";
// import dayjs from "dayjs";
import { useQueryClient } from "react-query";
import CircularLoader from "@/components/atoms/ProgressBarComponent/CircularLoader";
import DeleteModals from "@/components/molecules/deleteModals/DeleteModals";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import toast from "react-hot-toast";

const DonationDetailsUI = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const id = searchParams.get("id");
  const guestUser = searchParams.get("guest-user");

  const [offSet, setOffSet] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("donation-date-desc");
  const [perPageLimit, setPerPageLimit] = useState(5);
  const [isReceiptDownload, setIsReceiptDownload] = useState(false);

  const adjustedOffset =
    offSet === 1 || offSet === 0 ? 0 : (offSet - 1) * perPageLimit;

  const {
    data: donationDetails,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetDonationDetails(
    { limit: perPageLimit, offset: adjustedOffset },
    sortBy,
    id
  );

  let donationDetailsData = donationDetails?.data.data.details;

  if (isError) return <p>Error: {error.message}</p>;

  const updateHandler = async (amount, tipAmount) => {
    setLoading(true);
    const payload = {
      donationAmount: +amount,
      // nextPayment: dayjs(nextPayment).format("YYYY-MM-DD"),
      tipAmount: +tipAmount,
    };

    try {
      const response = await updateRecurringDonation(id, payload);
      if (response.data.success) {
        queryClient.invalidateQueries([
          "donationDetails",
          perPageLimit,
          adjustedOffset,
          sortBy,
          id,
        ]);
        setOpenModal(false);
      } else {
        toast.error(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("error", error);
    }
  };

  const levelDeleteHandler = async () => {
    setLoading(true);
    try {
      const response = await cancelSubscription(id);
      if (response.data.success) {
        toast.success("Subscription cancelled successfully");
        setDeleteModal(false);
        refetch();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("error", error);
    }
  };
  const singleFileDownloader = async (invoice) => {
    try {
      const response = await getInvoiceList(invoice);

      if (response.data.success) {
        const fileUrl = response.data.data.url;
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const fullUrl = new URL(fileUrl, baseUrl).href;

        const link = document.createElement("a");
        link.href = fullUrl;
        link.setAttribute("download", "");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Ensure the element is removed
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const userReceiptsListHandler = async () => {
    setIsReceiptDownload(true);
    try {
      // Get the S3 link from the API response
      const response = await getSpecificUserReceiptsList(id);
      // Assuming response.data contains the direct S3 URL to the ZIP file
      const s3Url = response.data.data.url;
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = s3Url;
      a.download = "Receipts.zip";

      document.body.appendChild(a);
      a.click();

      // Clean up by removing the anchor tag from the document
      document.body.removeChild(a);
      setIsReceiptDownload(false);
    } catch (error) {
      setIsReceiptDownload(false);
      console.error("error", error);
    }
  };
  const heading = `${
    donationDetailsData?.isRecurring
      ? "Recurring donation starting"
      : "Donation carried out on"
  } ${formatDateMonthToYear(donationDetailsData?.createdAt)}`;

  return (
    <>
      <YourDonationLayout
        heading={heading}
        isLoading={isLoading}
        guestUser={guestUser}
      >
        {isLoading ? (
          <BoxComponent
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ height: "60vh" }}
          >
            <CircularLoader />
          </BoxComponent>
        ) : (
          <>
            <DonationInformation
              data={donationDetailsData}
              setOpenModal={setOpenModal}
              setDeleteModal={setDeleteModal}
            />
            <ContactDetail data={donationDetailsData} />
            <StackComponent
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <SubHeading sx={{ color: "#090909" }}>
                Donation history
              </SubHeading>
              <ButtonComp
                size="normal"
                variant="outlined"
                height="34px"
                padding="10px 19px 8px 19px"
                sx={{ width: "auto" }}
                onClick={userReceiptsListHandler}
              >
                {isReceiptDownload ? (
                  <StackComponent alignItems="center" component="span">
                    <CircularLoader color="primary" size="20px" />
                    <TypographyComp>Downloading...</TypographyComp>
                  </StackComponent>
                ) : (
                  "Receipts"
                )}
              </ButtonComp>
            </StackComponent>

            <SimpleTableContainer
              tableName="donation_history_table"
              data={donationDetailsData?.donationHistory?.records}
              totalRows={donationDetailsData?.donationHistory?.totalCount}
              downloadHandler={singleFileDownloader}
              setOffSet={setOffSet}
              setSortBy={setSortBy}
              setPerPageLimit={setPerPageLimit}
              donationInformation={true}
            />
            {donationDetailsData?.isRecurring &&
            (donationDetailsData?.status === "active" ||
              donationDetailsData?.status === "future") ? (
              <BoxComponent
                sx={{ display: { xs: "block", sm: "none" }, mt: 4 }}
              >
                <ButtonComp
                  color="error"
                  variant="outlined"
                  height="34px"
                  size="normal"
                  padding="10px 19px 10px 19px"
                  fontSize="14px"
                  lineHeight="16px"
                  fontWeight={500}
                  onClick={() => setDeleteModal(true)}
                  sx={{ color: "#E61D1D" }}
                >
                  Cancel subscription
                </ButtonComp>
              </BoxComponent>
            ) : null}
          </>
        )}
      </YourDonationLayout>
      {openModal && (
        <ModalComponent
          open={openModal}
          onClose={() => setOpenModal(false)}
          width={"422px"}
          padding={"48px 32px 24px 32px"}
          responsivePadding={"40px 16px 43px 16px"}
          containerStyleOverrides={{
            maxHeight: "95vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
        >
          <EditDonationModal
            data={donationDetailsData}
            updateHandler={updateHandler}
            loading={loading}
          />
        </ModalComponent>
      )}
      {deleteModal && (
        <ModalComponent
          open={deleteModal}
          onClose={() => setDeleteModal(false)}
          width={"422px"}
          padding={"48px 32px 24px 32px"}
          responsivePadding={"40px 16px 43px 16px"}
        >
          <DeleteModals
            isDeleteLoader={loading}
            setOpenDeleteMOdel={setDeleteModal}
            heading={"Cancel Subscription"}
            levelDeleteHandler={levelDeleteHandler}
            description={"Are you sure, you want to cancel your subscription?"}
            deleteButtonText="Yes"
            closeButtonText="No"
          />
        </ModalComponent>
      )}
    </>
  );
};

export default DonationDetailsUI;
