"use client";


import PropTypes from "prop-types";
import React from "react";
import StackComponent from "../../atoms/StackComponent";
import EditCampaignHeading from "../EditCampaignHeading";
import BasicText from "../BasicText";
import CustomSwitchButton from "../../atoms/buttonComponent/CustomSwitchButton";

const TitleWithSwitch = ({
  checked,
  onChange,
  heading = "Heading",
  subHeading,
  isDisabled = false,
}) => {
  return (
    <StackComponent justifyContent="space-between">
      <StackComponent direction="column">
        <EditCampaignHeading sx={{ opacity: isDisabled ? 0.4 : 1 }}>
          {heading}
        </EditCampaignHeading>
        {subHeading ? (
          <div style={{ marginTop: "0px" }}>
            <BasicText sx={{ opacity: isDisabled ? 0.4 : 1 }}>
              {subHeading}
            </BasicText>{" "}
          </div>
        ) : null}
      </StackComponent>
      <CustomSwitchButton
        withMargins={false}
        isDisabled={isDisabled}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        // name="allowRecurringDonations"
        // color="primary"
      />
    </StackComponent>
  );
};

TitleWithSwitch.propTypes = {
  checked: PropTypes.any,
  heading: PropTypes.any,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
};

export default TitleWithSwitch;
