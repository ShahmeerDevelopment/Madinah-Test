"use client";

import PropTypes from "prop-types";
import React, { memo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import Navbar from "@/components/molecules/navbar/Navbar";
import Sidebar from "@/components/molecules/sidebar/Sidebar";
import MobileSidebar from "@/components/molecules/sidebar/MobileSidebar";
import Footer from "@/components/molecules/footer/Footer";
import { scrollToTop } from "@/utils/helpers";
import { useDispatch } from "react-redux";
import { deleteCookie } from "cookies-next";
import {
  isAdminLogin,
  isLoginHandler,
  isLoginModalOpen,
  logout,
  resetUserDetails,
} from "@/store/slices/authSlice";
import { resetValues } from "@/store/slices/mutateCampaignSlice";
import { resetActiveStepper } from "@/store/slices/campaignSlice";

const PrivateComponent = ({
  children,
  withSidebar = true,
  withFooter = false,
}) => {
  const auth = useAuth();
  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth) {
      // Redirect to the login page if not authenticated
      // Clear all cookies and reset store state
      deleteCookie("token");
      deleteCookie("madinah_refresh");
      deleteCookie("name");
      dispatch(logout());
      dispatch(isAdminLogin(false));
      dispatch(isLoginHandler(false));
      dispatch(resetValues());
      dispatch(resetActiveStepper(0));
      dispatch(resetUserDetails());
      dispatch(isLoginModalOpen(true));
      // Redirect to the login page
      router.push("/");
    }
    if (typeof window !== "undefined") {
      scrollToTop();
    }
  }, [auth, router]);

  if (!auth) {
    // Optionally show a loading or a blank page while redirecting
    return null;
  }

  return (
    <BoxComponent
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <div style={{ height: "56px" }}>&nbsp;</div>
      <BoxComponent
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          minHeight: "calc(100vh - 236px - 60px)",
          width: "100%",
          margin: "0 auto",
          maxWidth: "1120px",
        }}
      >
        {withSidebar ? (
          <>
            <Sidebar />
            <BoxComponent sx={{ display: { xs: "block", sm: "none" }, mx: 2 }}>
              <MobileSidebar />
            </BoxComponent>
          </>
        ) : null}
        <BoxComponent
          component="main"
          sx={{
            width: {
              xs: "100%",
              sm: `calc(100% - ${withSidebar ? "144px" : "0px"})`,
            },
            pl: { xs: 0, sm: 1 },
          }}
        >
          {children}
        </BoxComponent>
      </BoxComponent>
      {withFooter ? <Footer withSidebar={withSidebar} /> : null}
    </BoxComponent>
  );
};

PrivateComponent.propTypes = {
  withSidebar: PropTypes.bool,
  withFooter: PropTypes.bool,
  children: PropTypes.node,
};

const Private = memo(PrivateComponent);

export default Private;
