/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography"; // Assuming TypographyComp is a wrapper for MUI Typography
import { useTheme } from "@mui/material/styles";
import UpArrow from "./icons/UpArrow";
import DownArrow from "./icons/DownArrow";
import PropTypes from "prop-types";
import UpSide from "./icons/UpSide";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import { menuItems } from "../../../config/constant";

const SortingMenu = ({
  data = menuItems,
  selectedLabel,
  onSortingChange,
  isIcon = true,
  width = "167px",
  padding = "8px",
  height = "34px",
}) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (id, label) => {
    const isCurrentlyUp =
      selectedLabel.label === label ? !selectedLabel.isUp : true;
    onSortingChange(id, label, isCurrentlyUp);
    handleClose();
  };

  const menuItemStyle = (label) => ({
    height: height,
    padding: padding,
    fontWeight: label === selectedLabel.label ? 500 : 400,
    fontSize: "14px",
    lineHeight: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    color:
      label === selectedLabel.label
        ? theme.palette.primary.dark
        : theme.palette.primary.gray,
  });

  const renderIcon = (label) => {
    const isSelected = label === selectedLabel.label;
    // Define default gray color for unselected icons
    const defaultColor = theme.palette.primary.gray;
    // Determine the color for each arrow based on the selected state and direction
    const upArrowColor =
      isSelected && selectedLabel.isUp
        ? theme.palette.primary.dark
        : defaultColor;
    const downArrowColor =
      isSelected && !selectedLabel.isUp
        ? theme.palette.primary.dark
        : defaultColor;

    return (
      <div>
        {isIcon ? (
          <>
            {" "}
            <UpArrow color={upArrowColor} />
            <DownArrow color={downArrowColor} />
          </>
        ) : (
          <UpSide />
        )}
      </div>
    );
  };

  return (
    <div>
      <BoxComponent
        onClick={handleClick}
        sx={{
          height: height,
          width: width,
          borderRadius: "47px",
          border: "1px solid #E9E9EB",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          padding: "9px 8px 9px 12px",
        }}
      >
        <Typography sx={{ ...menuItemStyle(), letter: "-0.41px" }}>
          {selectedLabel.label}
        </Typography>
        {renderIcon(selectedLabel.label)}
      </BoxComponent>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiMenu-paper": {
            width: width,
            height: "auto", // Adjusted for dynamic content
            borderRadius: "14px",
            boxShadow: "none",
            border: "1px solid #E9E9EB",
            mt: "2px",
            "& .MuiMenuItem-root:first-of-type": {
              marginTop: "-8px",
            },
            "& .MuiMenuItem-root:last-of-type": {
              marginBottom: "-8px",
            },
          },
        }}
      >
        {data?.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => handleMenuItemClick(item._id, item.label)}
            sx={menuItemStyle(item.label)}
            divider
          >
            {item.label}
            {isIcon && renderIcon(item.label)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

SortingMenu.propTypes = {
  data: PropTypes.any,
  selectedLabel: PropTypes.any,
  onSortingChange: PropTypes.func,
  isIcon: PropTypes.bool,
  width: PropTypes.string,
  padding: PropTypes.string,
  height: PropTypes.string,
};

export default SortingMenu;
