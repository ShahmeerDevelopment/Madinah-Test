"use client";

import PropTypes from "prop-types";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import { styles } from "./iconMenu.style";

const defaultMenuOptions = [
  {
    label: "Profile",
    name: "profile",
    icon: <Avatar />,
    clickSideEffects: () => {
      return;
    },
  },
  {
    label: "My account",
    name: "account",
    icon: <Avatar />,
    clickSideEffects: () => {
      return;
    },
  },
  {
    name: "divider",
  },
  {
    label: "Add New Account",
    name: "add",
    icon: <PersonAdd fontSize="small" />,
    clickSideEffects: () => {
      return;
    },
  },
];
export default function IconMenu({
  menuWidth = "auto",
  children,
  tooltipLabel,
  menuOptions = defaultMenuOptions,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  return (
    <React.Fragment>
      {tooltipLabel ? (
        <Tooltip title={tooltipLabel}>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: -1 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            {children}
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: -10 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          {children}
        </IconButton>
      )}

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: styles.menu({ menuWidth }),
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {menuOptions.map(({ label, name, icon, clickSideEffects }) => {
          if (name === "divider") {
            return <Divider key={name} />;
          } else {
            return (
              <MenuItem
                key={name}
                onClick={() => {
                  clickSideEffects(name);
                  handleClose();
                }}
                sx={label === "Delete" ? { color: "#E61D1D" } : ""}
              >
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                {label}
              </MenuItem>
            );
          }
        })}
      </Menu>
    </React.Fragment>
  );
}

IconMenu.propTypes = {
  children: PropTypes.any.isRequired,
  clickSideEffects: PropTypes.func,
  icon: PropTypes.any,
  label: PropTypes.string,
  menuOptions: PropTypes.array,
  name: PropTypes.string,
  menuWidth: PropTypes.string,
  tooltipLabel: PropTypes.string,
};
