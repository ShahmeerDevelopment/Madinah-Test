"use client";

import * as React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from '@mui/material/ListItemIcon';
import DashboardIcon from "./icons/DashboardIcon";
import DashboardIconBlack from "./icons/DashboardIconBlack";
import DonationIcon from "./icons/DonationIcon";
import DonationsIconBlack from "./icons/DonationsIconBlack";
// import TransferIcon from './icons/TransferIcon';
// import TransferIconBlack from './icons/TransferIconBlack';
// import UpdatesIcon from './icons/UpdatesIcon';
// import { UpdatesIconBlack } from './icons/UpdatesIconBlack';
import StaticsIconBlack from "./icons/StaticsIconBlack";
import StaticsIcon from "./icons/StaticsIcon";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import TypographyComp from "../../atoms/typography/TypographyComp";
import LinearText from "../../atoms/typography/LinearText";
import SummaryIcon from "../../../assets/iconComponent/SummaryIcon";
import { useDispatch } from "react-redux";
import { resetValues } from "../../../store/slices/mutateCampaignSlice";
import { SIDEBAR_WIDTH } from "../../../config/constant";
import { ListItemIcon } from "@mui/material";
import { theme } from "../../../config/customTheme";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import SummaryIconBlack from "@/assets/iconComponent/SummaryIconBlack";
import NotificationsIconBlack from "@/assets/iconComponent/NotificationsIconBlack";
import NotificationsIcon from "@/assets/iconComponent/NotificationsIcon";
// import { theme } from '../../../config/customTheme';

// const activeStyle = {
// 	backgroundColor: 'pink',
// 	borderRadius: '50px',
// 	color: theme.palette.primary.main, // Adjust text color here if needed
// };

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  // const [selectedIndex, setSelectedIndex] = React.useState(0);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <DashboardIconBlack />,
      selectedIcon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      name: "Donations",
      icon: <DonationsIconBlack />,
      selectedIcon: <DonationIcon />,
      path: "/donations",
    },
    // {
    // 	name: 'Transfers',
    // 	icon: <TransferIconBlack />,
    // 	selectedIcon: <TransferIcon />,
    // 	path: '/transfers',
    // },
    // {
    // 	name: 'Updates',
    // 	icon: <UpdatesIconBlack />,
    // 	selectedIcon: <UpdatesIcon />,
    // 	path: '/updates',
    // },
    {
      name: "Statistics",
      icon: <StaticsIconBlack />,
      selectedIcon: <StaticsIcon />,
      path: "/statistics",
    },
    {
      name: "Summary",
      icon: <SummaryIconBlack />,
      selectedIcon: <SummaryIcon />,
      path: "/summary",
    },
    {
      name: "Notifications",
      icon: <NotificationsIconBlack />,
      selectedIcon: <NotificationsIcon />,
      path: "/notifications",
    },
  ];

  const findSelectedIndex = () =>
    menuItems.findIndex((item) => pathname?.includes(item.path));
  const [selectedIndex, setSelectedIndex] = React.useState(findSelectedIndex());

  // Update selectedIndex when location changes
  React.useEffect(() => {
    setSelectedIndex(findSelectedIndex());
  }, [pathname]);

  const listItemButtonHandler = () => dispatch(resetValues());

  return (
    <Drawer
      variant="permanent"
      // elevation={0}
      sx={{
        width: SIDEBAR_WIDTH,
        // background: 'transparent',
        flexShrink: 1,

        display: { xs: "none", sm: "block" },
        "& .MuiDrawer-paper": {
          background: "transparent",
          // width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          marginTop: "64px",
          left: "auto",
          // marginLeft: CUSTOM_LAYOUT_MARGIN,
          border: "none",
          height: "60%",
        },
      }}
    >
      <BoxComponent
        role="presentation"
        sx={{
          height: "100%",
          mt: 4,
          overflowX: "auto",
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          msOverflowStyle: "none", // IE and Edge
          scrollbarWidth: "none", // Firefox
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                // selected={selectedIndex === index}
                onClick={(event) => listItemButtonHandler(event, index)}
                component={Link}
                to={item.path}
                sx={() => ({
                  backgroundColor:
                    selectedIndex === index
                      ? theme.palette.white.light
                      : "inherit",
                  borderRadius: "50px",
                  mb: 1,
                })}
              >
                <ListItemIcon sx={{ color: "red" }}>
                  {selectedIndex === index ? item.selectedIcon : item.icon}
                </ListItemIcon>

                {selectedIndex === index ? (
                  <LinearText
                    style={{
                      fontWeight: 500,
                      fontSize: "18px",
                      marginLeft: "-16px",
                    }}
                  >
                    {item.name}
                  </LinearText>
                ) : (
                  <TypographyComp
                    sx={{
                      fontWeight: 400,
                      fontSize: "18px",
                      ml: -2,
                    }}
                  >
                    {item.name}
                  </TypographyComp>
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </BoxComponent>
    </Drawer>
  );
}
