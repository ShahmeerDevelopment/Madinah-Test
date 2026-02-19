"use client";

import React from "react";
import PropTypes from "prop-types";
import Pagination from "@mui/material/Pagination";
import StackComponent from "../../atoms/StackComponent";
import { theme } from "../../../config/customTheme";

const SimplePaginationComp = ({
  totalPage = 5,
  page,
  onChange,
  marginTop = 2,
}) => {
  return (
    <StackComponent
      mt={marginTop}
      justifyContent="flex-start"
      alignItems="center"
      sx={{ width: "100%" }}
    >
      <Pagination
        count={totalPage}
        page={page}
        onChange={onChange}
        sx={{
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
    </StackComponent>
  );
};

SimplePaginationComp.propTypes = {
  totalPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  marginTop: PropTypes.number,
};

export default SimplePaginationComp;
