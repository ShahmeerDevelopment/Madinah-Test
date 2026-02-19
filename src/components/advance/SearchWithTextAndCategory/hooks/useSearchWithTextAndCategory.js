/* eslint-disable indent */
"use client";

import useTransitionNavigate from "@/hooks/useTransitionNavigate";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCategoriesList } from "@/api";
import { configureCategories } from "@/store/slices/metaSlice";

const useSearchWithTextAndCategory = (isModalView, initialCategories = []) => {
  const navigate = useTransitionNavigate();
  const dispatch = useDispatch();

  const reduxCategories = useSelector((state) => state.meta?.categories || []);
  const [localCategories, setLocalCategories] = useState(initialCategories);

  // Use Redux categories if available, otherwise use locally fetched ones
  const categories =
    reduxCategories.length > 0 ? reduxCategories : localCategories;

  // Fetch categories if not in Redux
  useEffect(() => {
    if (reduxCategories.length === 0 && localCategories.length === 0) {
      getCategoriesList()
        .then((res) => {
          const fetchedCategories = res?.data?.data?.categories || [];
          setLocalCategories(fetchedCategories);
          // Also update Redux for other components
          dispatch(configureCategories(fetchedCategories));
        })
        .catch((err) => {
          console.error("Failed to fetch categories:", err);
        });
    }
  }, [reduxCategories.length, dispatch]);

  const [searchValue, setSearchValue] = useState("");
  const [selectedTag, setSelectedTag] = useState(isModalView ? null : 0);

  const searchHandler = (e) => setSearchValue(e.target.value);

  const resetSearch = () => setSearchValue("");

  const handleBoxClick = (index) => {
    setSelectedTag((prevSelected) => (prevSelected === index ? null : index));
  };

  let categoryId;

  if (selectedTag || selectedTag === 0) {
    categoryId = categories && categories[selectedTag]?._id;
  }

  let searchQuery = {};

  if (searchValue) {
    searchQuery.search = searchValue;
  }

  if (categoryId) {
    searchQuery.category = categoryId;
  }

  return {
    categories,
    searchHandler,
    searchQuery,
    navigate,
    handleBoxClick,
    searchValue,
    selectedTag,
    resetSearch,
  };
};

export default useSearchWithTextAndCategory;
