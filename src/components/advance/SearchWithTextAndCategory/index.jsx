"use client";

import PropTypes from "prop-types";
import React from "react";
import { InputAdornment } from "@mui/material";
import useSearchWithTextAndCategory from "./hooks/useSearchWithTextAndCategory";
import StackComponent from "@/components/atoms/StackComponent";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import SearchIcon from "@/assets/iconComponent/SearchIcon";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import SelectAbleButton from "@/components/atoms/selectAbleField/SelectAbleButton";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { useRouter } from "next/navigation";

const SearchWithTextAndCategory = ({
  handleClose = () => {},
  dataHandler = () => {},
  isModalView = false,
  initialCategories = [],
}) => {
  const router = useRouter();
  const {
    categories,
    searchHandler,
    searchQuery,
    handleBoxClick,
    searchValue,
    selectedTag,
  } = useSearchWithTextAndCategory(isModalView, initialCategories);

  // const isOnlySpecialCharacters = (value) => {
  //   return /^[^a-zA-Z0-9]+$/.test(value.trim()); // Ensures only special characters
  // };
  const searchButtonHandler = () => {
    // const path = createSearchParams(searchQuery, "/category");
    if (searchValue.trim() === "" && selectedTag === null) {
      return; // Prevent search if search value is only '*' or empty without tag
    }
    handleClose();
    // navigate(path);
    // App Router: construct URL with query string
    const queryString = new URLSearchParams(searchQuery).toString();
    router.push(`/category${queryString ? `?${queryString}` : ""}`);
  };

  const boxClickHandler = (index, item) => {
    handleBoxClick(index);
    dataHandler(item);
  };

  return (
    <StackComponent spacing="24px" direction="column">
      <TextFieldComp
        forceHideHelper
        styleOverrides={{
          "& .MuiInputBase-root": {
            border: "1px solid rgba(233, 233, 235, 1)",
            borderRadius: "16px",
            height: "46px",
            paddingLeft: "18.25px",
          },
          "& .MuiInput-underline::before": {
            display: "none !important",
          },
          "& .MuiInput-underline::after": {
            display: "none !important",
          },
          "& input": {
            padding: "0 !important",
            paddingTop: "1px !important",
          },
        }}
        variant="standard"
        name="search"
        label={""}
        placeholder={"Search for inspiring campaigns"}
        fullWidth
        value={searchValue}
        onChange={searchHandler}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (searchValue.trim() === "" && selectedTag === null) {
              e.preventDefault(); // Prevent search if input is only special characters or empty without tag
            } else {
              e.preventDefault();
              searchButtonHandler();
            }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment
              sx={{ cursor: "pointer" }}
              position="start"
              onClick={searchButtonHandler}
            >
              <SearchIcon color={searchValue !== "" ? "#606062" : "#A1A1A8"} />
            </InputAdornment>
          ),
        }}
      />
      <BoxComponent sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {categories?.map((item, index) => (
          <SelectAbleButton
            key={index}
            isActive={selectedTag === index}
            onClick={() => boxClickHandler(index, item)}
            title={item.name}
          />
        ))}
      </BoxComponent>
      <ButtonComp
        disabled={searchValue.trim() === "" && selectedTag === null}
        sx={{ gap: "6px" }}
        onClick={searchButtonHandler}
      >
        <span>Search</span>
      </ButtonComp>
    </StackComponent>
  );
};

SearchWithTextAndCategory.propTypes = {
  handleClose: PropTypes.func,
  isModalView: PropTypes.bool,
  dataHandler: PropTypes.func,
};

export default SearchWithTextAndCategory;
