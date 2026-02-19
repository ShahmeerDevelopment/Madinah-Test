"use client";

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import FormRow from "./components/FormRow";
import FieldLabel from "./components/FieldLabel";
import CustomCheckBox from "@/components/atoms/checkBoxComp/CustomCheckBox";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import { theme } from "@/config/customTheme";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import MultiSelectInput from "@/components/molecules/multiSelectInput/MultiSelectInput";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

export const borderColor = "#E9E9EB !important";

const Gap16Column = ({ children }) => {
  return (
    <StackComponent direction="column" spacing={2}>
      {children}
    </StackComponent>
  );
};

Gap16Column.propTypes = {
  children: PropTypes.any,
};

const FilterModel = ({
  handleFilter,
  handleResetFilter,
  specificCampaignData,
  campaignData,
  sourceData,
  mediumData,
  termData,
  contentData,
  tableLoading,
  filterValues,
}) => {
  const storedFilters = localStorage.getItem("statFilters");
  const parsedFilters = JSON.parse(storedFilters);
  const { isSmallScreen } = useResponsiveScreen();
  const [specificCampaign, setSpecificCampaign] = useState(
    filterValues?.specificCampaign || parsedFilters?.specificCampaign || []
  );
  const [selectedSource, setSelectedSource] = useState(
    filterValues?.selectedSource || parsedFilters?.selectedSource || []
  );
  const [campaignSource, setCampaignSource] = useState(
    filterValues?.campaignSource || parsedFilters?.campaignSource || []
  );
  const [mediumSource, setMediumSource] = useState(
    filterValues?.mediumSource || parsedFilters?.mediumSource || []
  );
  const [termSource, setTermSource] = useState(
    filterValues?.termSource || parsedFilters?.termSource || []
  );

  const [contentSource, setContentSource] = useState(
    filterValues.contentSource || parsedFilters?.contentSource || []
  );

  const [donations, setDonations] = useState({
    from: filterValues?.donations?.from || parsedFilters?.donations?.from || "",
    to: filterValues?.donations?.to || parsedFilters?.donations?.to || "",
  });
  const [totalDonations, setTotalDonation] = useState({
    from:
      filterValues?.totalDonations?.from ||
      parsedFilters?.totalDonations?.from ||
      "",
    to:
      filterValues?.totalDonations?.to ||
      parsedFilters?.totalDonations?.to ||
      "",
  });
  const [averageDonations, setAverageDonations] = useState({
    from:
      filterValues?.averageDonations?.from ||
      parsedFilters?.averageDonations?.from ||
      "",
    to:
      filterValues?.averageDonations?.to ||
      parsedFilters?.averageDonations?.to ||
      "",
  });
  const [conversionRate, setConversionRate] = useState({
    from: filterValues?.conversionRate?.from || "",
    to: filterValues?.conversionRate?.to || "",
  });
  const [resetButton, setResetButton] = useState(false);
  const responsiveRowDirectionProp = isSmallScreen ? "column" : "row";
  const [checkBoxStatus, setCheckBoxStatus] = useState({
    utmSource: true,
    utmMedium: true,
    utmTerm: true,
    utmContent: true,
    utmCampaign: true,
  });
  const validTermData = termData.filter((item) => item.name.trim() !== "");

  const handleDropDownChange = (value) => setSpecificCampaign(value);
  const handleCampaignDropDown = (value) => setCampaignSource(value);
  const handleContentDropDown = (value) => setContentSource(value);
  const handleSourceDropDown = (value) => setSelectedSource(value);
  const handleMediumDropDown = (value) => setMediumSource(value);
  const handleTermDropDown = (value) => setTermSource(value);
  const handleApplyFilter = () => {
    const filterData = {
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
      groupByFilter: Object.keys(checkBoxStatus).filter(
        (key) => checkBoxStatus[key]
      ),
    };

    handleFilter(filterData);
  };

  const handleClearFilter = () => {
    setAverageDonations({ from: "", to: "" });
    setCampaignSource([]);
    setContentSource([]);
    setConversionRate({ from: "", to: "" });
    setDonations({ from: "", to: "" });
    setMediumSource([]);
    setSelectedSource([]);
    setSpecificCampaign([]);
    setTermSource([]);
    setTotalDonation({ from: "", to: "" });
    setResetButton(true);
  };

  const hasActiveFilters = () => {
    return (
      specificCampaign.length > 0 ||
      selectedSource.length > 0 ||
      campaignSource.length > 0 ||
      mediumSource.length > 0 ||
      termSource.length > 0 ||
      contentSource.length > 0 ||
      donations.from ||
      donations.to ||
      totalDonations.from ||
      totalDonations.to ||
      averageDonations.from ||
      averageDonations.to ||
      conversionRate.from ||
      conversionRate.to
    );
  };

  useEffect(() => {
    if (resetButton) {
      setResetButton(false);
      const filterData = {
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
        groupByFilter: Object.keys(checkBoxStatus).filter(
          (key) => checkBoxStatus[key]
        ),
      };
      handleResetFilter(filterData);
    }
  }, [resetButton]);

  useEffect(() => {
    // Simulated filterValues for example; replace with your actual state/context

    if (filterValues && filterValues?.groupByFilter) {
      const activeFilters = new Set(filterValues?.groupByFilter);

      const newCheckBoxStatus = {
        utmSource: activeFilters.has("utmSource"),
        utmMedium: activeFilters.has("utmMedium"),
        utmTerm: activeFilters.has("utmTerm"),
        utmContent: activeFilters.has("utmContent"),
        utmCampaign: activeFilters.has("utmCampaign"),
      };

      setCheckBoxStatus(newCheckBoxStatus);
    } else {
      // If groupByFilter is not provided, null, or empty, set all to true
      setCheckBoxStatus({
        utmSource: true,
        utmMedium: true,
        utmTerm: true,
        utmContent: true,
        utmCampaign: true,
      });
    }
  }, [filterValues?.groupByFilter]);

  const borderColor = "#E9E9EB !important";

  return (
    <StackComponent direction="column" alignItems="center">
      <CampaignHeading
        marginBottom={3}
        sx={{ color: theme.palette.primary.dark }}
      >
        Filters
      </CampaignHeading>
      <StackComponent direction="column" sx={{ width: "100%" }} spacing={1}>
        <TypographyComp
          sx={{
            fontSize: "14px",
            alignSelf: "flex-end",
            fontWeight: 500,
            color: theme.palette.primary.main,
          }}
        >
          * wildcard allowed
        </TypographyComp>
        <MultiSelectInput
          options={specificCampaignData}
          label="Campaign"
          onChange={handleDropDownChange}
          value={specificCampaign}
          placeholder=""
          textFieldProps={{
            size: "small",
            customBorderColor: borderColor,
          }}
        />

        {/* <BoxComponent width={{ xs: "100%", sm: "50%", mb: 0 }}>
          <SearchAutoComplete
            options={specificCampaignData}
            label="Specific Campaign"
            onChange={handleDropDownChange}
            selectedValue={specificCampaign}
          />
        </BoxComponent> */}

        <StackComponent
          sx={{ mt: -3, mb: 0 }}
          spacing={{ xs: 1, sm: 3 }}
          direction={{ xs: "column", sm: "row" }}
        >
          <StackComponent alignItems={"center"}>
            <TextFieldComp
              fullWidth
              id="donations"
              name="donations"
              autoComplete="donations"
              label={"Donations #"}
              placeholder={"From"}
              isRequired={false}
              value={donations.from}
              onChange={(e) =>
                setDonations({ ...donations, from: e.target.value })
              }
            />
            <TextFieldComp
              fullWidth
              id="-"
              name="-"
              autoComplete="-"
              label={"-"}
              labelColor={"transparent"}
              placeholder={"To"}
              isRequired={false}
              value={donations.to}
              onChange={(e) =>
                setDonations({ ...donations, to: e.target.value })
              }
            />
          </StackComponent>
          <StackComponent alignItems={"center"}>
            <TextFieldComp
              fullWidth
              id="total-donations"
              name="total-donations"
              autoComplete="total-donations"
              label={"Total Donations"}
              isRequired={false}
              value={totalDonations.from}
              placeholder={"From"}
              onChange={(e) =>
                setTotalDonation({ ...totalDonations, from: e.target.value })
              }
            />
            <TextFieldComp
              fullWidth
              id="-"
              name="-"
              autoComplete="-"
              label={"-"}
              labelColor={"transparent"}
              isRequired={false}
              value={totalDonations.to}
              placeholder={"To"}
              onChange={(e) =>
                setTotalDonation({ ...totalDonations, to: e.target.value })
              }
            />
          </StackComponent>
        </StackComponent>
        <StackComponent
          spacing={{ xs: 1, sm: 3 }}
          direction={{ xs: "column", sm: "row" }}
        >
          <StackComponent alignItems={"center"}>
            <TextFieldComp
              fullWidth
              id="average-donations"
              name="average-donations"
              autoComplete="average-donations"
              label={"Average Donations"}
              placeholder={"From"}
              isRequired={false}
              value={averageDonations.from}
              onChange={(e) =>
                setAverageDonations({
                  ...averageDonations,
                  from: e.target.value,
                })
              }
            />
            <TextFieldComp
              fullWidth
              id="-"
              name="-"
              autoComplete="-"
              label={"-"}
              labelColor={"transparent"}
              placeholder={"To"}
              isRequired={false}
              value={averageDonations.to}
              onChange={(e) =>
                setAverageDonations({
                  ...averageDonations,
                  to: e.target.value,
                })
              }
            />
          </StackComponent>
          <StackComponent alignItems={"center"}>
            <TextFieldComp
              fullWidth
              id="Conversion rate"
              name="Conversion rate"
              autoComplete="Conversion rate"
              label={"Conversion Rate"}
              isRequired={false}
              value={conversionRate.from}
              placeholder={"From"}
              onChange={(e) =>
                setConversionRate({ ...conversionRate, from: e.target.value })
              }
            />
            <TextFieldComp
              fullWidth
              id="-"
              name="-"
              autoComplete="-"
              label={"-"}
              labelColor={"transparent"}
              isRequired={false}
              value={conversionRate.to}
              placeholder={"To"}
              onChange={(e) =>
                setConversionRate({ ...conversionRate, to: e.target.value })
              }
            />
          </StackComponent>
        </StackComponent>

        <FieldLabel>UTM Parameters</FieldLabel>
        <FormRow direction={responsiveRowDirectionProp}>
          {/* <SearchAutoComplete
            options={sourceData}
            label="Sources"
            fullWidth
            selectedValue={selectedSource}
            onChange={handleSourceDropDown}
          /> */}
          <MultiSelectInput
            options={sourceData}
            label="UTM Sources"
            onChange={handleSourceDropDown}
            value={selectedSource}
            placeholder=""
            textFieldProps={{
              size: "small",
              customBorderColor: borderColor,
            }}
          />
          <MultiSelectInput
            options={mediumData}
            label="UTM Medium"
            onChange={handleMediumDropDown}
            placeholder=""
            value={mediumSource}
            textFieldProps={{
              size: "small",
              customBorderColor: borderColor,
            }}
          />
          {/* <SearchAutoComplete
            options={mediumData}
            label="Medium"
            fullWidth
            onChange={handleMediumDropDown}
            selectedValue={mediumSource}
          /> */}
        </FormRow>
        <FormRow direction={responsiveRowDirectionProp}>
          {/* <SearchAutoComplete
            options={validTermData}
            onChange={handleTermDropDown}
            label="Term"
            fullWidth
            selectedValue={termSource}
          /> */}

          <MultiSelectInput
            options={validTermData}
            label="UTM Term"
            onChange={handleTermDropDown}
            placeholder=""
            value={termSource}
            textFieldProps={{
              size: "small",
              customBorderColor: borderColor,
            }}
          />
          <MultiSelectInput
            options={contentData}
            label="UTM Content"
            onChange={handleContentDropDown}
            placeholder=""
            value={contentSource}
            textFieldProps={{
              size: "small",
              customBorderColor: borderColor,
            }}
          />
          {/* <SearchAutoComplete
            options={contentData}
            onChange={handleContentDropDown}
            label="Content"
            fullWidth
            selectedValue={contentSource}
          /> */}
        </FormRow>
        {/* <FormRow direction={responsiveRowDirectionProp}> */}
        {/* <SearchAutoComplete
            options={campaignData}
            label="Campaign"
            fullWidth
            selectedValue={campaignSource}
            onChange={handleCampaignDropDown}
          /> */}
        <MultiSelectInput
          options={campaignData}
          label="UTM Campaign"
          onChange={handleCampaignDropDown}
          placeholder=""
          value={campaignSource}
          textFieldProps={{
            size: "small",
            customBorderColor: borderColor,
          }}
        />
        {/* </FormRow> */}

        <TypographyComp
          sx={{
            fontSize: "14px",
            lineHeight: "16px",
            fontWeight: 500,
            mb: -2.5,
            color: theme.palette.primary.gray,
          }}
        >
          Group by
        </TypographyComp>
        <StackComponent
          mb={{ xs: 5, sm: 4 }}
          spacing={{ xs: 0.5, sm: 3 }}
          justifyContent="flex-start"
          sx={{ flexWrap: "wrap" }}
          useFlexGap
        >
          <CustomCheckBox
            labelStyling={{
              color: theme.palette.primary.gray,
            }}
            onChange={(e) =>
              setCheckBoxStatus({
                ...checkBoxStatus,
                utmSource: e.target.checked,
              })
            }
            checked={checkBoxStatus.utmSource}
            label="UTM Source"
          />
          <CustomCheckBox
            labelStyling={{
              color: theme.palette.primary.gray,
            }}
            onChange={(e) =>
              setCheckBoxStatus({
                ...checkBoxStatus,
                utmMedium: e.target.checked,
              })
            }
            checked={checkBoxStatus.utmMedium}
            label="UTM Medium "
          />
          <CustomCheckBox
            labelStyling={{
              color: theme.palette.primary.gray,
            }}
            onChange={(e) =>
              setCheckBoxStatus({
                ...checkBoxStatus,
                utmTerm: e.target.checked,
              })
            }
            checked={checkBoxStatus.utmTerm}
            label="UTM Term"
          />
          <CustomCheckBox
            labelStyling={{
              color: theme.palette.primary.gray,
            }}
            onChange={(e) =>
              setCheckBoxStatus({
                ...checkBoxStatus,
                utmContent: e.target.checked,
              })
            }
            checked={checkBoxStatus.utmContent}
            label="UTM Content "
          />
          <CustomCheckBox
            labelStyling={{
              color: theme.palette.primary.gray,
            }}
            onChange={(e) =>
              setCheckBoxStatus({
                ...checkBoxStatus,
                utmCampaign: e.target.checked,
              })
            }
            checked={checkBoxStatus.utmCampaign}
            label="UTM Campaign"
          />
        </StackComponent>
      </StackComponent>
      <BoxComponent
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <ButtonComp
          size="normal"
          onClick={handleApplyFilter}
          sx={{ width: { xs: "100%", sm: "166px" } }}
        >
          {tableLoading ? "Applying..." : "Apply"}
        </ButtonComp>
        <ButtonComp
          size="normal"
          sx={{ width: { xs: "100%", sm: "166px" } }}
          variant="outlined"
          onClick={handleClearFilter}
          disabled={!hasActiveFilters()}
        >
          Clear All
        </ButtonComp>
      </BoxComponent>
    </StackComponent>
  );
};

FilterModel.propTypes = {
  handleFilter: PropTypes.func.isRequired,
  specificCampaignData: PropTypes.any,
  sourceData: PropTypes.any,
  mediumData: PropTypes.any,
  termData: PropTypes.any,
  contentData: PropTypes.any,
  campaignData: PropTypes.any,
  tableLoading: PropTypes.bool,
  filterValues: PropTypes.any,
};

export default FilterModel;
