"use client";


import { CircularProgress } from "@mui/material";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

const ThreeDSecureAuthentication = ({ isLoading, children }) => {
  return (
    <BoxComponent sx={{ position: "relative", width: "100%", height: "100%" }}>
      {isLoading && (
        <BoxComponent
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            zIndex: (theme) => theme.zIndex.modal,
          }}
        >
          <CircularProgress />
        </BoxComponent>
      )}
      <BoxComponent
        sx={{
          opacity: isLoading ? 0.5 : 1,
          pointerEvents: isLoading ? "none" : "auto",
        }}
      >
        {children}
      </BoxComponent>
    </BoxComponent>
  );
};

export default ThreeDSecureAuthentication;
