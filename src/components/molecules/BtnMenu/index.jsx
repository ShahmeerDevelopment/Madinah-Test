"use client";

import PropTypes from "prop-types";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import { styles } from "./BtnMenu";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";
import OutlinedIconButton from "../../advance/OutlinedIconButton";
import CloseIcon from "./icons/CloseIcon";
import { buildSimpleTypography } from "./../../../utils/helpers";

const MENU_OPTION = [
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

const BtnMenu = ({
  menuWidth = "auto",
  children,
  tooltipLabel,
  menuOptions = MENU_OPTION,
  btnProps,
  size = "small",
  iconBtn = false,
  closeIcon = <CloseIcon />,
  paperStyleOverrides = {},
  menuItemStyleOverrides = {},
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const commonProps = {
    onClick: handleClick,
    size: size,
    ["aria-controls"]: open ? "account-menu" : undefined,
    ["aria-haspopup"]: "true",
    ["aria-expanded"]: open ? "true" : undefined,
    ...btnProps,
  };

  return (
    <>
      {iconBtn ? (
        <>
          {tooltipLabel ? (
            <Tooltip title={tooltipLabel}>
              <OutlinedIconButton {...commonProps}>
                {open ? (closeIcon ? closeIcon : children) : children}
              </OutlinedIconButton>
            </Tooltip>
          ) : (
            <OutlinedIconButton {...commonProps}>{children}</OutlinedIconButton>
          )}
        </>
      ) : (
        <>
          {tooltipLabel ? (
            <Tooltip title={tooltipLabel}>
              <ButtonComp {...commonProps}>{children}</ButtonComp>
            </Tooltip>
          ) : (
            <ButtonComp {...commonProps}>{children}</ButtonComp>
          )}
        </>
      )}

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        disableScrollLock={true}
        slotProps={{
          paper: {
            elevation: 0,
            sx: { ...styles.menu({ menuWidth }), ...paperStyleOverrides },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {menuOptions.map(
          ({ label, name, icon, clickSideEffects, red }, index) => {
            const itemKey = name || label || index;

            if (name === "divider") {
              return <Divider key={itemKey} />;
            } else {
              return (
                <MenuItem
                  key={itemKey}
                  onClick={() => {
                    clickSideEffects(name);
                    handleClose();
                  }}
                  sx={{
                    ...buildSimpleTypography(500, 14, 16),
                    color: red ? "rgba(230, 29, 29, 1)" : "rgba(96, 96, 98, 1)",
                    ...menuItemStyleOverrides,
                  }}
                >
                  {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                  {label}
                </MenuItem>
              );
            }
          },
        )}
      </Menu>
    </>
  );
};

BtnMenu.propTypes = {
  btnProps: PropTypes.any,
  children: PropTypes.any.isRequired,
  clickSideEffects: PropTypes.func,
  closeIcon: PropTypes.any,
  icon: PropTypes.any,
  iconBtn: PropTypes.bool,
  label: PropTypes.string,
  menuOptions: PropTypes.array,
  menuWidth: PropTypes.string,
  name: PropTypes.string,
  paperStyleOverrides: PropTypes.object,
  menuItemStyleOverrides: PropTypes.object,
  size: PropTypes.string,
  tooltipLabel: PropTypes.string,
};

export default BtnMenu;
