"use client";

import { useEffect, startTransition } from "react";
import { useDispatch } from "react-redux";
import {
  configureCountries,
  configureCategories,
} from "@/store/slices/metaSlice";

/**
 * DiscoverDataHydrator - Client component
 *
 * Responsibilities:
 * - Hydrates Redux store with server-fetched cached data.
 * - Renders nothing (null).
 */
export default function DiscoverDataHydrator({ 
  initialCategories = [], 
  initialCountries = []
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    startTransition(() => {
      if (initialCategories.length > 0) {
        dispatch(configureCategories(initialCategories));
      }
      if (initialCountries.length > 0) {
        dispatch(configureCountries(initialCountries));
      }
    });
  }, [dispatch, initialCategories, initialCountries]);

  return null;
}
