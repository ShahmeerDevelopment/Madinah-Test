"use client";

import React, { useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// import { UpdatesIconBlack } from './icons/UpdatesIconBlack';
import DashboardIcon from "./icons/DashboardIcon";
import DashboardIconBlack from "./icons/DashboardIconBlack";
import DonationsIconBlack from "./icons/DonationsIconBlack";
import DonationIcon from "./icons/DonationIcon";
// import TransferIcon from './icons/TransferIcon';
// import TransferIconBlack from './icons/TransferIconBlack';
// import UpdatesIcon from './icons/UpdatesIcon';
import StaticsIcon from "./icons/StaticsIcon";
import StaticsIconBlack from "./icons/StaticsIconBlack";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import UpArrow from "../../../assets/iconComponent/UpArrow";
import DownArrow from "../../../assets/iconComponent/DownArrow";
import LinearText from "../../atoms/typography/LinearText";
import SummaryIcon from "./icons/SummaryIcon";
import SummaryIconBlack from "./icons/SummaryIconBlack";
import NotificationsIcon from "@/assets/iconComponent/NotificationsIcon";
import NotificationsIconBlack from "@/assets/iconComponent/NotificationsIconBlack";

function MobileSidebar() {
  const [anchorEl, setAnchorEl] = useState(null);

  // const initialMenu = {
  //   name: "Dashboard",
  //   icon: <DashboardIcon />,
  //   activeIcon: <DashboardIconBlack />,
  // };

  const menuItems = [
    {
      id: 1,
      name: "Dashboard",
      icon: <DashboardIconBlack />,
      activeIcon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Donations",
      icon: <DonationsIconBlack />,
      activeIcon: <DonationIcon />,
      path: "/donations",
    },
    // {
    //  id:0,
    // 	name: 'Transfers',
    // 	icon: <TransferIcon />,
    // 	activeIcon: <TransferIconBlack />,
    // },
    // {
    //  id:0,
    // 	name: 'Updates',
    // 	icon: <UpdatesIcon />,
    // 	activeIcon: <UpdatesIconBlack />,
    // },
    {
      id: 3,
      name: "Statistics",
      icon: <StaticsIconBlack />,
      activeIcon: <StaticsIcon />,
      path: "/statistics",
    },
    {
      id: 4,
      name: "Summary",
      icon: <SummaryIconBlack />,
      activeIcon: <SummaryIcon />,
      path: "/summary",
    },
    {
      id: 5,
      name: "Notifications",
      icon: <NotificationsIconBlack />,
      activeIcon: <NotificationsIcon />,
      path: "/notifications",
    },
  ];

  const currentMenu =
    menuItems.find((item) => location.pathname === item.path) || menuItems[0];

  const [selectedMenu, setSelectedMenu] = useState(menuItems[0]);

  useEffect(() => {
    setSelectedMenu(currentMenu);
  }, [location]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (menu) => {
    setSelectedMenu(menu);
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);

  return (
    <>
      <BoxComponent
        onClick={handleClick}
        display="flex"
        alignItems="center"
        gap={1}
        sx={{
          width: "100%",
          height: "48px",
          borderRadius: "50px",
          padding: "12px 16px",
          background: "#F8F8F8",
          mt: 2,
        }}
      >
        {selectedMenu.activeIcon}
        <LinearText
          fontSize="18px"
          fontWeight={500}
          lineHeight={"22px"}
          style={{ marginTop: "px" }}
        >
          {selectedMenu.name}
        </LinearText>
        <BoxComponent>
          {isOpen ? (
            <UpArrow />
          ) : (
            <div style={{ marginTop: "3px" }}>
              <DownArrow />
            </div>
          )}
        </BoxComponent>
      </BoxComponent>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={isOpen}
        onClose={() => handleClose(selectedMenu)}
        PaperProps={{
          style: {
            width: "100%",
            borderRadius: "10px",
          },
        }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            onClick={() => handleClose(item)}
            component="a"
            href={item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default MobileSidebar;
