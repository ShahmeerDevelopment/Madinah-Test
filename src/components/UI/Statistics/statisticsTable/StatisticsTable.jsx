"use client";

import React, { useState } from "react";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import AccordionTableContainer from "@/components/molecules/accordionTable/AccordionTableContainer";
import ModalComponent from "@/components/molecules/modal/ModalComponent";
import FilterModel from "./FilterModel";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { getFilterStatisticsDropDownData } from "@/api";
import { useSelector } from "react-redux";

const StatisticsTable = ({
  tableLoading,
  data,
  sendFilterData,
  handleResetFilter,
  filterValues,
  referralToken = null,
  setResetFilterButton,
}) => {
  const [showFilterModel, setShowFilterModel] = useState(false);
  const [sourceData, setSourceData] = useState([]);
  const [mediumData, setMediumData] = useState([]);
  // const [resetFilterButton, setResetFilterButton] = useState(false);
  const [termData, setTermData] = useState([]);
  const [contentData, setContentData] = useState([]);
  const [campaignData, setCampaignData] = useState([]);
  const [campaignTitles, setCampaignTitles] = useState([]);
  const campaignId = useSelector((state) => state.mutateCampaign.id);
  const campaignTitle = useSelector((state) => state.mutateCampaign.title);

  // Check if any filters are selected (excluding groupByFilter)
  const hasSelectedFilters = () => {
    if (!filterValues) return false;

    const {
      specificCampaign,
      campaignSource,
      selectedSource,
      mediumSource,
      termSource,
      contentSource,
      donations,
      totalDonations,
      averageDonations,
      conversionRate,
    } = filterValues;

    // Check arrays for non-empty values
    const hasArrayValues = [
      specificCampaign,
      campaignSource,
      selectedSource,
      mediumSource,
      termSource,
      contentSource,
    ].some((arr) => Array.isArray(arr) && arr.length > 0);

    // Check range objects for non-empty values
    const hasRangeValues = [
      donations,
      totalDonations,
      averageDonations,
      conversionRate,
    ].some((range) => range?.from || range?.to);

    return hasArrayValues || hasRangeValues;
  };

  const processedData = data.map((item) => ({
    ...item,
    _id: item._id || campaignId,
    campaignTitle: item.campaignTitle || campaignTitle,
  }));

  const resetPaginationFunc = (resetFunction) => {
    resetFunction(1); // Directly reset to the first page
  };

  const getUTMparamaters = async () => {
    try {
      const response = await getFilterStatisticsDropDownData();
      if (
        response.data.success === true &&
        response.data.message === "Success"
      ) {
        const data = response.data.data;

        setCampaignTitles(data.campaignTitles);

        const utm = data.utmSources
          .filter((item) => item) // Filter out empty values
          .map((item, index) => ({
            _id: index,
            name: item,
          }));

        const medium = data.utmMediums
          .filter((item) => item)
          .map((item, index) => ({
            _id: index + 1,
            name: item,
          }));

        const terms = data.utmTerms
          .filter((item) => item)
          .map((item, index) => ({
            _id: index + 2,
            name: item,
          }));

        const content = data.utmContents
          .filter((item) => item)
          .map((item, index) => ({
            _id: index + 3,
            name: item,
          }));

        const campaigns = data.utmCampaigns
          .filter((item) => item)
          .map((item, index) => ({
            _id: index + 4,
            name: item,
          }));

        setSourceData(utm);
        setMediumData(medium);
        setTermData(terms);
        setContentData(content);
        setCampaignData(campaigns);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  // useEffect(() => {
  //   if (resetFilterButton) {
  //     // setLoading(true);
  //     localStorage.removeItem("statFilters");
  //     // getDonorsData(true);
  //     setResetFilterButton(false);
  //   }
  // }, [resetFilterButton]);

  useEffect(() => {
    getUTMparamaters();
  }, []);

  return (
    <>
      <BoxComponent
        sx={{
          mt: 4,
          mb: 4,
          width: "100%",
          height: "100%",
          paddingBottom: 2,
          borderRadius: "26px",
          boxShadow: "0px 0px 100px 0px rgba(0, 0, 0, 0.06)",
        }}
      >
        <AccordionTableContainer
          handleFilterBtnClick={() => setShowFilterModel(true)}
          data={processedData}
          referralToken={referralToken}
          resetPagination={resetPaginationFunc} // Pass the function to reset pagination
          selectedFilter={hasSelectedFilters()}
          setResetFilterButton={setResetFilterButton}
        />
      </BoxComponent>
      {showFilterModel && (
        <ModalComponent
          width="802px"
          open={showFilterModel}
          padding={"48px 32px 24px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
          containerStyleOverrides={{
            maxHeight: "90vh",
            overflowY: "auto",
            "::-webkit-scrollbar": {
              width: "0px",
              background: "transparent",
            },
            "::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "::-webkit-scrollbar-thumb": {
              background: "transparent",
            },
          }}
          onClose={() => {
            setShowFilterModel(false);
          }}
        >
          <FilterModel
            specificCampaignData={campaignTitles}
            campaignData={campaignData}
            sourceData={sourceData}
            mediumData={mediumData}
            termData={termData}
            contentData={contentData}
            handleResetFilter={(value) => handleResetFilter(value)}
            handleFilter={(value) => sendFilterData(value)}
            tableLoading={tableLoading}
            filterValues={filterValues}
          />
        </ModalComponent>
      )}
    </>
  );
};

StatisticsTable.propTypes = {
  data: PropTypes.any,
  updateData: PropTypes.func,
  sendFilterData: PropTypes.func,
  tableLoading: PropTypes.bool,
  filterValues: PropTypes.any,
  filterData: PropTypes.any,
  referralToken: PropTypes.any,
};

export default StatisticsTable;
