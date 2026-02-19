"use client";

import React from "react";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import StackComponent from "@/components/atoms/StackComponent";
import PropTypes from "prop-types";
import { theme } from "@/config/customTheme";

const FilterButtons = ({ setStatus, status }) => {
  return (
    <StackComponent
      direction={"row"}
      spacing={1}
      mb={1}
      sx={{
        flexWrap: "wrap",
        gap: "8px",
        "& > button": {
          flexBasis: {
            xs: "calc(33.33% - 8px)", // 3 buttons per row on mobile
            sm: "auto", // default behavior on larger screens
          },
          minWidth: {
            xs: "100px",
            sm: "auto",
          },
        },
      }}
    >
      <ButtonComp
        size="normal"
        sx={{
          borderRadius: "25px",
          padding: "10px, 14px",
          height: "34px",
          background: "#F8F8F8",
          color: status === "all" ? "black" : theme.palette.primary.gray,
          "&:hover": { backgroundColor: "#F8F8F8", boxShadow: "none" },
        }}
        onClick={() => setStatus("all")}
      >
        All
      </ButtonComp>
      <ButtonComp
        onClick={() => setStatus("active")}
        sx={{
          borderRadius: "25px",
          padding: "10px, 14px",
          height: "34px",
          background: "#e1faf3",
          color: "#0CAB72",
          opacity: status === "active" ? 1 : 0.5,
          "&:hover": { backgroundColor: "#e1faf3", boxShadow: "none" },
        }}
      >
        Active
      </ButtonComp>
      <ButtonComp
        size="normal"
        sx={{
          borderRadius: "25px",
          padding: "10px, 14px",
          height: "34px",
          background: "#F7F7FF",
          color: "#6363E6",
          opacity: status === "drafts" ? 1 : 0.4,
          "&:hover": { backgroundColor: "#F7F7FF", boxShadow: "none" },
        }}
        onClick={() => setStatus("drafts")}
      >
        Drafts
      </ButtonComp>
      {/* <ButtonComp
				onClick={() => setStatus('drafts')}
				sx={{
					borderRadius: '25px',
					padding: '10px, 14px',
					height: '34px',
					background: '#F7F7FF',
					color: '#6363E6',
					opacity: status === 'drafts' ? 1 : 0.5,
					'&:hover': { backgroundColor: '#F7F7FF', boxShadow: 'none' },
				}}
			>
				Drafts
			</ButtonComp> */}
      <ButtonComp
        onClick={() => setStatus("inActive")}
        sx={{
          borderRadius: "25px",
          padding: "10px, 14px",
          height: "34px",
          background: "#F4F4F4",
          color: "#A0A0A0",
          opacity: status === "inActive" ? 1 : 0.5,
          "&:hover": { backgroundColor: "#F4F4F4", boxShadow: "none" },
        }}
      >
        Inactive
      </ButtonComp>
      <ButtonComp
        onClick={() => setStatus("pending-approval")}
        sx={{
          borderRadius: "25px",
          padding: "10px, 14px",
          height: "34px",
          background: "#FFF4D9",
          color: "#F0AD4E",
          opacity: status === "pending-approval" ? 1 : 0.5,
          "&:hover": { backgroundColor: "#FFF4D9", boxShadow: "none" },
        }}
      >
        Pending
      </ButtonComp>
      <ButtonComp
        onClick={() => setStatus("expired")}
        sx={{
          borderRadius: "25px",
          padding: "10px, 14px",
          height: "34px",
          background: "#FFE5E5",
          color: "#D9534F",
          opacity: status === "expired" ? 1 : 0.5,
          "&:hover": { backgroundColor: "#FFE5E5", boxShadow: "none" },
        }}
      >
        Expired
      </ButtonComp>
    </StackComponent>
  );
};
FilterButtons.propTypes = {
  setStatus: PropTypes.func,
  status: PropTypes.string,
};
export default FilterButtons;
