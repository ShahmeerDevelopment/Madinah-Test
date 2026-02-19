"use client";

import React from "react";
import PropTypes from "prop-types";
import Pagination from "@mui/material/Pagination";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import { theme } from "../../../config/customTheme";
import DropDown from "../../atoms/inputFields/DropDown";
import StackComponent from "../../atoms/StackComponent";
import { PAGINATION_DATA } from "../../../config/constant";

const PaginationComp = ({
  totalPage = 5,
  page,
  onChange,
  setPaginationNumber,
  paginationNumber,
  marginTop = 2,
  resetPage,
}) => {
  const handleDropDownChange = (value) => {
    // setSelectedCountry(value);
    setPaginationNumber(value);
    resetPage();
  };
  return (
    <StackComponent
      mt={marginTop}
      justifyContent={{ xs: "space-between", sm: "flex-start" }}
      alignItems={"center"}
      spacing={{ xs: 0.5, sm: 2 }}
      sx={{ width: { xs: "100%", sm: "auto" } }}
    >
      <Pagination
        count={totalPage}
        page={page}
        onChange={onChange}
        sx={{
          width: { xs: "100%", sm: "auto" },
          "& .MuiPaginationItem-root": {
            borderRadius: "12px",
            "&.Mui-selected": {
              background: theme.palette.gradients.primary,
              color: theme.palette.primary.light,
              width: "32px",
              height: "32px",
            },
          },
        }}
      />
      <BoxComponent
        sx={{
          width: { xs: "180px", sm: "127px" },
          height: "32px",
        }}
      >
        <DropDown
          disableClearable={true}
          isLabel={false}
          placeholder={"5 per page"}
          data={PAGINATION_DATA}
          onChange={handleDropDownChange}
          selectedValue={paginationNumber}
          isHeightCustomizable={true}
          customPadding="3px 5px 2px 5px"
          isDisabledText={true}
          isPagination
        />
      </BoxComponent>
    </StackComponent>
  );
};

PaginationComp.propTypes = {
  totalPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  setPaginationNumber: PropTypes.func,
  paginationNumber: PropTypes.any,
  marginTop: PropTypes.number,
  resetPage: PropTypes.func,
};

export default PaginationComp;
