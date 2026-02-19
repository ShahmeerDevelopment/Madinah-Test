"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

import { Main } from "./style";
import { getDonationData } from "@/api";
import FilterModal from "./filterModal/FilterModal";
import DonationCard from "./donationCard/DonationCard";
import DonationDateModal from "./donationDateModal/DonationDateModal";
import TableContainer from "@/components/molecules/table/TableContainer";
import ModalComponent from "@/components/molecules/modal/ModalComponent";
import TableSkeleton from "@/components/advance/TableSkeleton";
import { updateDonationTable } from "@/store/slices/donationTableSlice";
import { useDispatch } from "react-redux";
import { getAllVisits } from "@/api/get-api-services";

const DonationsUI = () => {
  const dispatch = useDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [filterValues, setFilterValues] = useState(null);
  const utmParameters = useSelector((state) => state.utmParameters);
  const [resetFilterButton, setResetFilterButton] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isFilterStatus, setIsFilterStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllVisits(
      utmParameters.utmSource,
      utmParameters.utmMedium,
      utmParameters.utmCampaign,
      utmParameters.utmTerm,
      utmParameters.utmContent,
      utmParameters.referral
    );
  }, []);

  const [data, setData] = useState({
    tableData: [],
    totalAmount: 0,
    numberOfDonations: 0,
  });

  const selectedDate = useSelector(
    (state) => state.donations.donationPresetsDate
  );
  const singleDonorAddedData = useSelector(
    (state) => state.donations.singleDonorData
  );
  const isEdit = useSelector((state) => state.donations.isEdit);

  const processData = useCallback((rawData) => {
    const tableData = rawData.donations;
    return {
      tableData,
      numberOfDonations: rawData.donationsCount,
      totalAmount: rawData.totalDonationAmount,
      uniqueDonorNames: Array.from(
        new Set(tableData.map((donation) => donation.donorName).filter(Boolean))
      ),
      uniqueCampaigns: Array.from(
        new Set(
          tableData
            .map((donation) =>
              donation.campaignId
                ? { id: donation.campaignId, title: donation.campaignTitle }
                : null
            )
            .filter(Boolean)
        ),
        JSON.stringify
      ).map(JSON.parse),
      uniqueDonorEmails: Array.from(
        new Set(
          tableData.map((donation) => donation.donorEmail).filter(Boolean)
        )
      ),
      uniqueGivingLevels: Array.from(
        new Set(
          tableData
            .map((donation) =>
              donation.givingLevelId && donation.givingLevelTitle
                ? donation.givingLevelTitle
                : null
            )
            .filter(Boolean)
        )
      ),
    };
  }, []);

  const applyFilters = useCallback((filters, tableData) => {
    if (!filters || !tableData) return tableData;

    return tableData.filter((item) => {
      const matchesVisibility =
        (filters.isAnonymous && item.hidePublicVisibility) ||
        (filters.isPublic && !item.hidePublicVisibility) ||
        (!filters.isAnonymous && !filters.isPublic);

      const matchesStatus =
        (filters.isRefunded && item.status === "refunded") ||
        (filters.isSuccessful && item.status === "successful") ||
        (filters.isFailed && item.status === "failed") ||
        (!filters.isRefunded && !filters.isSuccessful && !filters.isFailed);

      // Filter campaign only by ID - not by name
      const matchesCampaign =
        !filters.campaignSource ||
        (filters.campaignSource &&
          filters.campaignSource.id &&
          item.campaignId === filters.campaignSource.id);

      const matchesDonorName =
        !filters.donorName ||
        item?.donorName?.toLowerCase().includes(filters.donorName?.toLowerCase());

      const matchesDonorEmail =
        !filters.donorEmail ||
        item.donorEmail
          ?.toLowerCase()
          .includes(filters.donorEmail?.toLowerCase());

      const matchesGivingLevel =
        !filters.givingLevel ||
        (item.givingLevelTitle &&
          item.givingLevelTitle
            ?.toLowerCase()
            .includes(filters.givingLevel?.toLowerCase()));

      const matchesAmountFrom =
        !filters.amount.from || item.amount >= parseInt(filters.amount.from);

      const matchesAmountTo =
        !filters.amount.to || item.amount <= parseInt(filters.amount.to);

      return (
        matchesVisibility &&
        matchesStatus &&
        matchesCampaign &&
        matchesDonorName &&
        matchesDonorEmail &&
        matchesGivingLevel &&
        matchesAmountFrom &&
        matchesAmountTo
      );
    });
  }, []);

  useEffect(() => {
    if (!isEdit && singleDonorAddedData) {
      // Add singleDonorAddedData to the beginning of the tableData array
      setData((prevData) => ({
        ...prevData,
        tableData: [singleDonorAddedData, ...prevData.tableData],
      }));
    }
  }, [singleDonorAddedData]);

  const updateDataWithFilters = useCallback(
    (processedData, filters = null) => {
      if (!filters) {
        return processedData;
      }
      return {
        ...processedData,
        tableData: applyFilters(filters, processedData.tableData),
      };
    },
    [applyFilters]
  );

  const getDonorsData = useCallback(
    async (shouldResetFilter = false) => {
      const endDate = selectedDate.endDate
        ? selectedDate.endDate
        : selectedDate.startDate;

      try {
        const response = await getDonationData(selectedDate.startDate, endDate);

        if (
          response.data.success === true ||
          response.data.message === "Success"
        ) {
          const processedData = processData(response.data.data);
          dispatch(updateDonationTable(processedData.tableData));

          // Store the original unfiltered data
          setOriginalData(processedData);

          // Always set the unfiltered data
          setData(processedData);

          if (shouldResetFilter) {
            setFilterValues(null);
            setIsFilterStatus(false);
            localStorage.removeItem("donationFilters");
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    },
    [selectedDate, dispatch, processData]
  );

  useEffect(() => {
    const init = async () => {
      await getDonorsData();

      // Get stored filters for display in modal but don't apply them yet
      const storedFilters = localStorage.getItem("donationFilters");
      if (storedFilters) {
        const parsedFilters = JSON.parse(storedFilters);
        setFilterValues(parsedFilters);
        // Don't set isFilterStatus to true - filters aren't applied yet
      }
    };
    init();
  }, [getDonorsData]);

  useEffect(() => {
    if (!isEdit && singleDonorAddedData && originalData) {
      const updatedOriginalData = {
        ...originalData,
        tableData: [singleDonorAddedData, ...originalData.tableData],
      };
      setOriginalData(updatedOriginalData);

      // Reapply filters if they exist
      // if (filterValues) {
      //   handleFilter(filterValues);
      // } else {
      setData((prevData) => ({
        ...prevData,
        tableData: [singleDonorAddedData, ...prevData.tableData],
      }));
      // }
    }
  }, [singleDonorAddedData]);

  const handleFilter = useCallback(
    (filters) => {
      if (!filters || !originalData?.tableData?.length) return;

      localStorage.setItem("donationFilters", JSON.stringify(filters));
      // Always apply filters to the original data, not the potentially already filtered data
      const updatedData = updateDataWithFilters(originalData, filters);
      setData(updatedData);
      setFilterValues(filters);
      setIsFilterStatus(true); // Now filters are applied
    },
    [originalData, updateDataWithFilters]
  );

  const handleResetFilter = () => {
    localStorage.removeItem("donationFilters");
    setFilterValues(null);
    setIsFilterStatus(false);
    if (originalData) {
      setData(originalData);
    } else {
      getDonorsData(true); // Fallback to fetch fresh data if originalData is not available
    }
  };

  const resetPaginationFunc = (resetFunction) => {
    resetFunction(1); // Directly reset to the first page
  };

  useEffect(() => {
    getDonorsData(false);
  }, [getDonorsData]);

  const modalHandler = (isTrue) => {
    setIsFilterStatus(false);
    setCalendarModal(isTrue);
  };

  // useEffect(() => {
  //   if (filterValues && !isFilterStatus) {
  //     handleFilter(filterValues);
  //   }
  // }, [data]);

  const hasSelectedFilters = () => {
    // Return false if filters are from localStorage or if no filters exist
    if (!filterValues || !isFilterStatus) return false;

    // Only check filter values if they're not from localStorage
    const {
      isAnonymous,
      isPublic,
      isRefunded,
      isSuccessful,
      isFailed,
      campaignSource,
      donorName,
      donorEmail,
      givingLevel,
      amount,
    } = filterValues;

    return (
      isAnonymous ||
      isPublic ||
      isRefunded ||
      isSuccessful ||
      isFailed ||
      campaignSource ||
      donorName ||
      donorEmail ||
      givingLevel ||
      amount?.from ||
      amount?.to
    );
  };

  useEffect(() => {
    if (resetFilterButton) {
      setLoading(true);
      localStorage.removeItem("donationFilters");
      getDonorsData(true);
      setResetFilterButton(false);
    }
  }, [resetFilterButton, getDonorsData]);

  // Make sure filter values are loaded from localStorage when filter modal opens
  const openFilterModal = () => {
    // Load filters from localStorage if they exist and no filters are currently set
    if (!filterValues) {
      const storedFilters = localStorage.getItem("donationFilters");
      if (storedFilters) {
        setFilterValues(JSON.parse(storedFilters));
      }
    }
    setOpenDeleteModal(true);
  };

  if (!initialLoadComplete) {
    return <TableSkeleton />;
  }

  return (
    <>
      <Main>
        <DonationCard
          isFilterStatus={isFilterStatus}
          data={data}
          handleCalendarModal={modalHandler}
        />
        {loading ? (
          <TableSkeleton />
        ) : (
          <TableContainer
            data={data.tableData}
            tableName="donors_table"
            tableTitle="Donations & donors table"
            isFilterIcon={true}
            setOpenDeleteModal={openFilterModal} // Changed to our custom handler
            isExtraButtonOnHeading={true}
            resetPagination={resetPaginationFunc} // Pass the function to reset pagination
            selectedFilter={hasSelectedFilters()}
            setResetFilterButton={setResetFilterButton}
          />
        )}
      </Main>
      {openDeleteModal && (
        <ModalComponent
          width={"422px"}
          open={openDeleteModal}
          padding={"48px 32px 24px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
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
          onClose={() => setOpenDeleteModal(false)}
        >
          <FilterModal
            uniqueDonorNames={data?.uniqueDonorNames}
            uniqueCampaigns={data?.uniqueCampaigns}
            uniqueDonorEmails={data?.uniqueDonorEmails}
            uniqueGivingLevels={data?.uniqueGivingLevels}
            handleFilter={handleFilter}
            handleResetFilter={handleResetFilter}
            closeFilterModal={() => setOpenDeleteModal(false)}
            filterValues={filterValues}
          />
        </ModalComponent>
      )}

      {calendarModal && (
        <ModalComponent
          open={calendarModal}
          onClose={() => setCalendarModal(false)}
          width={"612px"}
          padding={"48px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
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
          <DonationDateModal
            setCalendarModal={setCalendarModal}
            setData={setData}
            loading={loading}
            setLoading={setLoading}
          />
        </ModalComponent>
      )}
    </>
    // </PageTransitionWrapper>
  );
};

export default DonationsUI;
