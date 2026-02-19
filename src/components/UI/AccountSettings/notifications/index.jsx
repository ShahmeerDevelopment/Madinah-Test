"use client";

import React, { useEffect, useState } from "react";
import StackComponent from "@/components/atoms/StackComponent";
import SelectAbleFieldComp from "@/components/atoms/selectAbleField/SelectAbleFieldComp";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { theme } from "@/config/customTheme";
import { updateNotifications } from "@/api/update-api-service";
import { getNotifications } from "@/api/get-api-services";
import CardSkeleton from "../saveCards/CardSkeleton";

const Notifications = () => {
  const [selectedBox, setSelectedBox] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const { isSmallScreen } = useResponsiveScreen();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications().then((res) => {
      const result = res.data?.data?.preferences;
      if (result !== undefined) {
        setAllNotifications(result);
      }
      setLoading(false);
      const enabledIndices = result
        .map((item, index) => (item.isEnabled ? index : null))
        .filter((index) => index !== null); // Remove nulls, keep only indices of enabled items
      setSelectedBox(enabledIndices);
    });
  }, []);

  const handleBoxClick = (item, index) => {
    setSelectedBox((prevSelectedBox) => {
      const newSelectedBox = prevSelectedBox.includes(index)
        ? prevSelectedBox.filter((i) => i !== index)
        : [...prevSelectedBox, index];

      // Immediately construct the payload with newSelectedBox
      const payload = {
        notificationPreferences: allNotifications.map((notif, idx) => ({
          type: notif.type,
          isEnabled: newSelectedBox.includes(idx),
        })),
      };

      // Now, payload is based on the action we just took
      updateNotifications(payload);
      return newSelectedBox; // Update the state with the new selection
    });
  };

  const toggleSelectAllHandler = () => {
    setSelectedBox((prevSelectedBox) => {
      let newSelectedBox = [];
      let allOrNoneEnabled = true; // Determine if we're enabling or disabling all

      if (prevSelectedBox.length === allNotifications.length) {
        newSelectedBox = []; // Unselect all
        allOrNoneEnabled = false;
      } else {
        newSelectedBox = allNotifications.map((_, index) => index); // Select all
        allOrNoneEnabled = true;
      }

      // Construct the payload for API
      const payload = {
        notificationPreferences: allNotifications.map((item) => ({
          type: item.type,
          isEnabled: allOrNoneEnabled,
        })),
      };

      // API call with the constructed payload
      updateNotifications(payload);

      return newSelectedBox;
    });
  };

  // Determine if all notifications are selected
  const allSelected =
    selectedBox.length === allNotifications.length &&
    allNotifications.length > 0;

  return (
    <div>
      <BoxComponent
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: { xs: -4, sm: -8 },
          mb: 4,
          position: isSmallScreen ? "absolute" : "",
          top: isSmallScreen ? "140px" : "",
          right: isSmallScreen ? "0px" : "",
        }}
      >
        <ButtonComp
          onClick={toggleSelectAllHandler}
          variant={"text"}
          size="normal"
          sx={{ color: theme.palette.primary.darkGray }}
          fontSize={"14px"}
          lineHeight={"16px"}
          fontWeight={500}
        >
          {allSelected ? "Uncheck all" : "Check all"}
        </ButtonComp>
      </BoxComponent>
      {!loading ? (
        <StackComponent direction="column" spacing="8px">
          {allNotifications.map((item, index) => (
            <SelectAbleFieldComp
              notificationSelect
              key={index}
              isActive={selectedBox.includes(index)}
              onClick={() => handleBoxClick(item, index)}
              heading={item.title}
              title={item.description} // Pass the handleBoxClick function to onClick prop
            />
          ))}
        </StackComponent>
      ) : (
        <CardSkeleton />
      )}
    </div>
  );
};

export default Notifications;
