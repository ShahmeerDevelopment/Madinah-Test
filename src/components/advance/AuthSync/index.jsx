"use client";


import { syncFromStorage, isAdminLogin as setAdminLogin } from "@/store/slices/authSlice";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

const AuthSync = () => {
  const dispatch = useDispatch();
  const lastUpdate = useRef(null);
  const syncTimeoutRef = useRef(null);

  useEffect(() => {
    // Initial load from storage
    try {
      const storedState = localStorage.getItem("auth_state");
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        lastUpdate.current = JSON.stringify(parsedState);
        dispatch(syncFromStorage(parsedState));
        dispatch(setAdminLogin(parsedState.isAdminLogin));
      }
    } catch (error) {
      console.error("Error loading initial state:", error);
    }

    const handleStorageChange = (e) => {
      if (e.key === "auth_state" && e.newValue !== lastUpdate.current) {
        try {
          const newState = JSON.parse(e.newValue);

          // Clear any pending sync
          if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
          }

          // Debounce the sync
          syncTimeoutRef.current = setTimeout(() => {
            lastUpdate.current = e.newValue;
            dispatch(syncFromStorage(newState));
            dispatch(setAdminLogin(newState.isAdminLogin));
          }, 100);

        } catch (error) {
          console.error("Error parsing storage change:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [dispatch]);

  return null;
};

export default AuthSync;