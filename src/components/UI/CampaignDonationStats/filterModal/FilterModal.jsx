"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";

import PrivacyButton from "./PrivacyButton";
import { theme } from "@/config/customTheme";
import { StatusFilterButton } from "./StatusFilterButton";
import StackComponent from "@/components/atoms/StackComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import SearchAutoComplete from "@/components/advance/SearchAutoComplete";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import CircularLoader from "@/components/atoms/ProgressBarComponent/CircularLoader";

const FilterModal = ({
  loader,
  handleFilter,
  handleResetFilter,
  uniqueDonorNames,
  uniqueCampaigns,
  uniqueDonorEmails,
  // uniqueGivingLevels,
  closeFilterModal,
  filterValues,
}) => {
  const [isAnonymous, setIsAnonymous] = useState(
    filterValues?.isAnonymous || false
  );
  const [isPublic, setIsPublic] = useState(filterValues?.isPublic || false);
  const [isRefunded, setIsRefunded] = useState(
    filterValues?.isRefunded || false
  );
  const [isSuccessful, setIsSuccessful] = useState(
    filterValues?.isSuccessful || false
  );
  const [isFailed, setIsFailed] = useState(filterValues?.isFailed || false);
  const [campaignSource, setCampaignSource] = useState(
    filterValues?.campaignSource || null
  );
  const [donorName, setDonorName] = useState(filterValues?.donorName || null);
  const [donorEmail, setDonorEmail] = useState(
    filterValues?.donorEmail || null
  );
  // const [givingLevel, setGivingLevel] = useState(
  // 	filterValues?.givingLevel || null
  // );
  const [amount, setAmount] = useState({
    from: filterValues?.amount?.from || null,
    to: filterValues?.amount?.to || null,
  });

  const handleDonorNameDropDown = (value) => setDonorName(value);
  const handleDonorEmailDropDown = (value) => setDonorEmail(value);
  const handleCampaignDropDown = (value) => {
    // If value is null, empty string, or undefined, set campaignSource to null
    if (!value) {
      setCampaignSource(null);
      return;
    }

    // Check if value is just a string (campaign name) or a complete object
    if (typeof value === "string") {
      // Find the campaign object from formattedCampaigns that matches this name
      const campaignObj = formattedCampaigns.find(
        (campaign) => campaign.name === value
      );
      if (campaignObj) {
        setCampaignSource(campaignObj);
      } else {
        // If we can't find a matching campaign, store just the name
        setCampaignSource({ name: value });
      }
    } else {
      // It's already an object with id and name, store as is
      setCampaignSource(value);
    }
  };
  // const handleGivingLevelDropDown = (value) => setGivingLevel(value);

  const handleApplyFilter = () => {
    const filterData = {
      isAnonymous,
      isPublic,
      isRefunded,
      isSuccessful,
      isFailed,
      campaignSource,
      donorName,
      donorEmail,
      // givingLevel,
      amount,
    };
    handleFilter(filterData);
    closeFilterModal(); // Close the modal after applying filters
  };

  const handleClearFilter = () => {
    handleResetFilter();
    closeFilterModal();
  };

  // Format campaigns for display in dropdown ensuring uniqueness by ID
  const formattedCampaigns = uniqueCampaigns
    ? Array.from(
        new Map(
          uniqueCampaigns
            .filter((campaign) => campaign.id && campaign.title)
            .map((campaign) => [
              campaign.id,
              { id: campaign.id, name: campaign.title },
            ])
        ).values()
      )
    : [];

  return (
    <BoxComponent
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <CampaignHeading>Filters</CampaignHeading>
      <BoxComponent sx={{ textAlign: "right", width: "100%" }}>
        <TypographyComp
          sx={{
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "16px",
            color: theme.palette.primary.main,
          }}
        >
          * wildcard allowed
        </TypographyComp>
      </BoxComponent>
      <BoxComponent sx={{ textAlign: "left", width: "100%" }}>
        <TypographyComp
          sx={{
            fontSize: "14px",
            lineHeight: "16px",
            color: theme.palette.primary.gray,
          }}
        >
          Privacy
        </TypographyComp>
        <BoxComponent
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: { xs: 1, sm: 2 },
            mt: 0.5,
          }}
        >
          <PrivacyButton
            isActive={isAnonymous}
            onClickHandler={() => setIsAnonymous(!isAnonymous)}
            text={"Anonymous"}
          />

          <PrivacyButton
            isActive={isPublic}
            onClickHandler={() => setIsPublic(!isPublic)}
            text={"Public"}
          />
        </BoxComponent>
      </BoxComponent>
      <BoxComponent
        sx={{
          width: "100%",
          mt: 3,
          textAlign: "left",
        }}
      >
        <TypographyComp
          sx={{
            fontSize: "14px",
            lineHeight: "16px",
            color: theme.palette.primary.gray,
          }}
        >
          Status
        </TypographyComp>
        <BoxComponent
          sx={{
            mt: 0.5,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexWrap: "wrap",
            gap: { xs: 1, sm: 2 },
          }}
        >
          <StatusFilterButton
            color={theme.palette.primary.main}
            bgColor={"#F7F7FF"}
            onClickHandler={() => setIsRefunded(!isRefunded)}
            isActive={isRefunded}
            text={"Refunded"}
          />

          <StatusFilterButton
            color={"#0CAB72"}
            bgColor={"#E1FBF2"}
            onClickHandler={() => setIsSuccessful(!isSuccessful)}
            isActive={isSuccessful}
            text={"Successful"}
          />

          <StatusFilterButton
            color={"#E61D1D"}
            bgColor={"#FFEDED"}
            onClickHandler={() => setIsFailed(!isFailed)}
            isActive={isFailed}
            text={"Failed"}
          />
        </BoxComponent>
      </BoxComponent>
      <BoxComponent
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          gap: { xs: 0.5, sm: 1 },
          mt: 2,
        }}
      >
        <TextFieldComp
          height={"40px"}
          fullWidth
          type={"number"}
          id="Amount"
          name="Amount"
          label={"Amount"}
          autoComplete="Amount"
          placeholder={"From"}
          value={amount.from}
          // onChange={(e) => amountHandler('from', e.target.value)}
          onChange={(e) => setAmount({ ...amount, from: e.target.value })}
        />
        <TextFieldComp
          height={"40px"}
          fullWidth
          type={"number"}
          id="to"
          name="to"
          label={"-"}
          autoComplete="to"
          labelColor={"transparent"}
          placeholder={"To"}
          value={amount.to}
          onChange={(e) => setAmount({ ...amount, to: e.target.value })}
        />
      </BoxComponent>
      <SearchAutoComplete
        options={uniqueDonorNames}
        label="Name"
        fullWidth
        selectedValue={donorName}
        onChange={handleDonorNameDropDown}
        placeholder="Enter name"
      />
      <SearchAutoComplete
        options={formattedCampaigns}
        label="Campaign"
        fullWidth
        selectedValue={campaignSource}
        onChange={handleCampaignDropDown}
        placeholder="Enter campaign"
        // getOptionLabel={(option) => option.label || ""}
        // isOptionEqualToValue={(option, value) => option.id === value}
        // getOptionValue={(option) => option.id}
      />
      <SearchAutoComplete
        options={uniqueDonorEmails}
        label="Email"
        fullWidth
        selectedValue={donorEmail}
        onChange={handleDonorEmailDropDown}
        placeholder="Enter email"
      />
      {/* <SearchAutoComplete
				options={uniqueGivingLevels}
				label="Giving levels"
				fullWidth
				selectedValue={givingLevel}
				onChange={handleGivingLevelDropDown}
				placeholder="Enter giving level"
			/> */}
      <BoxComponent
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <ButtonComp
          height="46px"
          size="normal"
          sx={{ width: { xs: "100%", sm: "166px" }, mt: 1 }}
          onClick={handleApplyFilter}
        >
          {loader ? (
            <StackComponent alignItems="center" component="span">
              <CircularLoader color="white" size="20px" />
              <TypographyComp>Applying...</TypographyComp>
            </StackComponent>
          ) : (
            "Apply"
          )}
        </ButtonComp>
        <ButtonComp
          height="46px"
          size="normal"
          variant="outlined"
          sx={{ width: { xs: "100%", sm: "166px" }, mt: 1 }}
          onClick={handleClearFilter}
          disabled={!filterValues}
        >
          Clear All
        </ButtonComp>
      </BoxComponent>
    </BoxComponent>
  );
};
FilterModal.propTypes = {
  loader: PropTypes.bool,
  handleFilter: PropTypes.any,
  uniqueDonorNames: PropTypes.any,
  uniqueCampaigns: PropTypes.any,
  uniqueDonorEmails: PropTypes.any,
  uniqueGivingLevels: PropTypes.any,
  closeFilterModal: PropTypes.any,
  filterValues: PropTypes.any,
};
export default FilterModal;
