import React from "react";
import BoxComponent from "../atoms/boxComponent/BoxComponent";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Skeleton from "@mui/material/Skeleton";
import { ASSET_PATHS } from "@/utils/assets";
import Image from "next/image";
// Removed useResponsiveScreen - using CSS-only responsive design for better TBT

export default function NavbarSkeleton() {
  return (
    <BoxComponent sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          background: "#FFFFFF",
          transition: "none !important",
        }}
        elevation={0}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center", // Center the logo slot
            alignItems: "center",
            position: "relative", // Root for absolute positioning
            px: "0px !important",
            minHeight: "64px",
            "@media (max-width:600px)": {
              px: "16px !important",
            },
            "@media (min-width:600px)": {
              px: "40px !important",
            },
            "@media (min-width:900px)": {
              px: "151px !important",
            },
          }}
        >
          {/* Left Slot - Absolute on mobile, static on desktop */}
          <BoxComponent
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: { xs: "48px", sm: "100px" },
              position: { xs: "absolute", sm: "static" },
              left: { xs: "16px", sm: "auto" },
              zIndex: 1,
            }}
          >
            {/* Mobile: Circular */}
            <Skeleton
              variant="circular"
              width={34}
              height={34}
              sx={{
                display: { xs: "block", sm: "none" },
                borderRadius: "50%",
              }}
            />
            {/* Desktop: Rectangular */}
            <Skeleton
              variant="rectangular"
              width={86}
              height={34}
              sx={{
                display: { xs: "none", sm: "block" },
                borderRadius: "4px",
              }}
            />
          </BoxComponent>

          {/* Center Slot - Logo (Stable) */}
          <BoxComponent
            sx={{
              display: "flex",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <BoxComponent
              sx={{ width: "114px", height: "40px", position: "relative" }}
            >
              <Image
                src={ASSET_PATHS.images.logo}
                height={40}
                width={114}
                alt="logo"
                style={{ height: "auto" }}
                priority
              />
            </BoxComponent>
          </BoxComponent>

          {/* Right Slot - Absolute on mobile, static on desktop */}
          <BoxComponent
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1,
              width: { xs: "48px", md: "110px" },
              position: { xs: "absolute", md: "static" },
              right: { xs: "16px", md: "auto" },
              zIndex: 1,
            }}
          >
            {/* Desktop Only Piece */}
            <BoxComponent sx={{ display: { xs: "none", md: "block" } }}>
              <Skeleton variant="circular" width={34} height={34} />
            </BoxComponent>
            {/* Hamburger Placeholder (Always anchors the right edge on mobile) */}
            <Skeleton
              variant="rectangular"
              width={48}
              height={34}
              sx={{ borderRadius: "12px" }}
            />
          </BoxComponent>
        </Toolbar>
      </AppBar>
    </BoxComponent>
  );
}
