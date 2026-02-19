"use client";

import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { revalidateCampaignCache } from "@/utils/revalidateCache";

import { updateLevel } from "../../../../api/update-api-service";
import { addLevels, deleteLevel, sortLevels } from "../../../../api";
import useResponsiveScreen from "../../../../hooks/useResponsiveScreen";
import ButtonComp from "../../../../components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "../../../../components/atoms/boxComponent/BoxComponent";
import { buildGradingLevels } from "../../../../store/slices/mutateCampaignSlice";
import ModalComponent from "../../../../components/molecules/modal/ModalComponent";
import DeleteModals from "../../../../components/molecules/deleteModals/DeleteModals";
import AddLevels from "./AddLevels";
import LevelsCard from "./LevelsCard";

const Levels = memo(() => {
  const dispatch = useDispatch();
  const { isSmallScreen } = useResponsiveScreen();
  const levelsData = useSelector(
    (state) => state?.mutateCampaign?.gradingLevelsList,
  );
  const id = useSelector((state) => state?.mutateCampaign?.id);
  const campaignSlug = useSelector(
    (state) => state?.mutateCampaign?.fundraiserCustomUrl,
  );

  const [isLoader, setIsLoader] = useState(false);
  const [editedValue, setEditedValue] = useState(null);
  const [deletedValue, setDeletedValue] = useState(null);
  const [notifyHandler, setNotifyHandler] = useState(null);
  const [duplicateData, setDuplicateData] = useState(null);
  const [showAddButton, setShowAddButton] = useState(true);
  const [isDeleteLoader, setIsDeleteLoader] = useState(false);
  const [openDeleteMOdel, setOpenDeleteMOdel] = useState(false);
  const [isShowForm, setIsShowForm] = useState({
    add: false,
    edit: false,
    duplicate: false,
  });

  const updatePreviousMostNeeded = async () => {
    const previousMostNeeded = levelsData.find((level) => level.isMostNeeded);
    if (previousMostNeeded) {
      const payload = {
        title: previousMostNeeded.title,
        amount: previousMostNeeded.amount,
        isLimited: previousMostNeeded.isLimited,
        description: previousMostNeeded.description,
        quantity: previousMostNeeded.quantity,
        isMostNeeded: false,
        index: previousMostNeeded.index,
        donationType: previousMostNeeded.donationType,
        givingLevelId: previousMostNeeded._id,
      };
      try {
        await updateLevel(payload, id);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to update previous most needed level");
      }
    }
  };
  const addLevel = (
    newLevel,
    levels,
    donationOption,
    specialDays,
    specialDaysEndDate,
  ) => {
    setIsLoader(true);

    // Only use the manually checked value, ignore automatic determination
    const isMostNeeded = newLevel.isMostNeeded || false;
    const formatDateForAPI = (date) => {
      if (!date) return null;
      try {
        // Check if it's a Day.js object
        if (date.$isDayjsObject) {
          // Use Day.js format method
          return date.format("YYYY-MM-DD");
        }

        // Check if it's a native Date object
        if (date instanceof Date && !isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }

        console.warn("Invalid date provided to formatDateForAPI:", date);
        return null;
      } catch (error) {
        console.warn("Error formatting date for API:", error);
        return null;
      }
    };
    const payload = {
      title: newLevel?.title,
      amount: newLevel?.amount,
      isLimited: levels === "unlimited" ? false : true,
      description: newLevel?.description,
      quantity: newLevel?.level,
      isMostNeeded: isMostNeeded, // Only use manual selection
      index: notifyHandler === "edit" ? newLevel?.index : levelsData?.length,
      donationType: donationOption,
      recurringType: donationOption === "oneTimeDonation" ? null : specialDays,
      recurringEndDate:
        donationOption === "oneTimeDonation"
          ? null
          : formatDateForAPI(specialDaysEndDate),
    };

    if (isMostNeeded) {
      // Update previous most needed only if new level is marked as most needed
      updatePreviousMostNeeded()
        .then(() => {
          // Then proceed with the regular add/edit
          if (notifyHandler === "edit") {
            return updateLevel(
              { ...payload, givingLevelId: editedValue._id },
              id,
            );
          } else {
            return addLevels(payload, id);
          }
        })
        .then(async (res) => {
          const result = res?.data;
          if (result.success) {
            toast.success(
              notifyHandler === "edit"
                ? "Level updated successfully"
                : "Level created successfully",
            );
            dispatch(buildGradingLevels(result.data.givingLevels));
            setIsShowForm({ add: false, edit: false, duplicate: false });
            setEditedValue(null);
            setDuplicateData(null);
            setShowAddButton(true);
            setNotifyHandler(notifyHandler === "edit" ? "add" : notifyHandler);

            // Revalidate campaign cache
            if (campaignSlug) {
              await revalidateCampaignCache(campaignSlug);
            }
          } else {
            toast.error(result.message);
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Something went wrong");
        })
        .finally(() => {
          setIsLoader(false);
        });
    } else {
      // Regular flow without updating previous most needed
      if (notifyHandler === "edit") {
        const updatedPayload = { ...payload, givingLevelId: editedValue._id };
        updateLevel(updatedPayload, id)
          .then(async (res) => {
            const result = res?.data;
            if (result.success) {
              toast.success("level updated successfully");
              dispatch(buildGradingLevels(result.data.givingLevels));
              setIsShowForm({ add: false, edit: false, duplicate: false });
              setEditedValue(null);
              setShowAddButton(true);
              setNotifyHandler("add");

              // Revalidate campaign cache
              if (campaignSlug) {
                await revalidateCampaignCache(campaignSlug);
              }
            } else {
              toast.error(result.message);
            }
          })
          .catch((error) => {
            console.error(error);
            toast.error("Something went wrong");
          })
          .finally(() => {
            setIsLoader(false);
          });
      } else
        addLevels(payload, id)
          .then(async (res) => {
            const result = res?.data;
            if (result.success) {
              toast.success("Level created successfully");
              let finalUpdatedData;
              if (newLevel?.isMostNeeded) {
                // Set isMostNeeded to false for all existing levels
                finalUpdatedData = result.data.givingLevels.map(
                  (level, index) => ({
                    ...level,
                    isMostNeeded: index === result.data.givingLevels.length - 1, // true only for the newly added level
                  }),
                );
              } else {
                finalUpdatedData = result.data.givingLevels;
              }
              dispatch(buildGradingLevels(finalUpdatedData));
              setIsShowForm({ add: false, edit: false, duplicate: false });
              setEditedValue(null);
              setDuplicateData(null);
              setShowAddButton(true);

              // Revalidate campaign cache
              if (campaignSlug) {
                await revalidateCampaignCache(campaignSlug);
              }
            } else {
              toast.error(result.message);
            }
          })
          .catch((error) => {
            console.error(error);
            toast.error("Something went wrong");
          })
          .finally(() => {
            setIsLoader(false);
          });
    }
  };

  const editHandler = (value, notify) => {
    setIsShowForm({ add: false, edit: true, duplicate: false });
    setNotifyHandler(notify);
    setEditedValue(value);
    setShowAddButton(false);
    setDuplicateData(null);
  };
  const duplicateHandler = (value, notify) => {
    setIsShowForm({ add: false, edit: false, duplicate: true });
    setNotifyHandler(notify);
    setShowAddButton(false);
    setEditedValue(value);
    setDuplicateData(value);
  };

  const deleteHandler = (value, notify) => {
    setNotifyHandler(notify);
    setDeletedValue(value);
    setOpenDeleteMOdel(true);
  };
  const levelDeleteHandler = async () => {
    setIsDeleteLoader(true);
    const payload = {
      givingLevelId: deletedValue,
    };
    deleteLevel(payload, id)
      .then(async (res) => {
        const result = res?.data;
        if (result.success) {
          toast.success("Giving level deleted successfully");
          const updatedData = result.data.givingLevels;
          dispatch(buildGradingLevels(updatedData));
          setOpenDeleteMOdel(false);
          setIsDeleteLoader(false);

          // Revalidate campaign cache
          if (campaignSlug) {
            await revalidateCampaignCache(campaignSlug);
          }
        } else {
          setIsDeleteLoader(false);
          toast.error(result.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong");
      });
  };

  const addGivingLevelHandler = () => {
    setIsShowForm({ add: true, edit: false, duplicate: false });
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return; // Dragged outside the droppable area
    }

    const { source, destination } = result;

    // If the item was dropped in the same position
    if (source.index === destination.index) {
      return;
    }

    // Reorder the items in the levelsData array according to the drag result
    const reorderedItems = Array.from(levelsData);
    const [removed] = reorderedItems.splice(source.index, 1); // Remove the dragged item
    reorderedItems.splice(destination.index, 0, removed); // Insert the item at the new position
    const updatedItems = reorderedItems.map((item, index) => ({
      givingLevelId: item._id,
      index: index,
    }));
    const payload = {
      givingLevels: updatedItems,
    };
    dispatch(buildGradingLevels(reorderedItems));
    const res = await sortLevels(payload, id);
    if (res?.data?.success) {
      toast.success("Giving levels reordered successfully.");

      // Revalidate campaign cache
      if (campaignSlug) {
        await revalidateCampaignCache(campaignSlug);
      }
    } else {
      toast.error(res?.data?.message || "Failed to reorder giving levels.");
    }
  };

  const isHighestClaimed = (currentClaimed) => {
    if (!levelsData || levelsData.length === 0 || !currentClaimed) return false;

    const allClaimed = levelsData.map((level) => level.usedCount || 0);
    const highestClaimed = Math.max(...allClaimed);

    // Only return true if this is the highest claimed amount and it's greater than 0
    return (
      currentClaimed === highestClaimed &&
      highestClaimed > 0 &&
      allClaimed.filter((count) => count === highestClaimed).length === 1
    );
  };

  return (
    <>
      <div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  width: isSmallScreen ? "100%" : "98%",
                }}
              >
                {levelsData?.map((item, index) => (
                  <div key={index}>
                    {editedValue?._id === item._id ||
                    duplicateData?._id === item._id ? (
                      <AddLevels
                        // data={item}
                        onAddLevel={addLevel}
                        isLoader={isLoader}
                        notifyHandler={notifyHandler}
                        editedValue={editedValue}
                        duplicateData={duplicateData}
                        setIsShowForm={setIsShowForm}
                        isShowForm={isShowForm}
                        existingLevels={levelsData} // Pass existing levels here
                      />
                    ) : (
                      <LevelsCard
                        item={item}
                        onClickHandler={editHandler}
                        campaignId={id}
                        onDeleteHandler={(id, action) =>
                          deleteHandler(id, action)
                        }
                        onDuplicateHandler={duplicateHandler}
                        isLoader={isDeleteLoader}
                        index={index}
                        isMostNeeded={item?.isMostNeeded}
                        isHighestClaimed={isHighestClaimed(item?.usedCount)}
                        claimed={item?.usedCount}
                      />
                    )}
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {isShowForm.add ? (
          <AddLevels
            onAddLevel={addLevel}
            isLoader={isLoader}
            notifyHandler={notifyHandler}
            editedValue={editedValue}
            duplicateData={duplicateData}
            setIsShowForm={setIsShowForm}
            isShowForm={isShowForm}
            existingLevels={levelsData} // Pass existing levels here too
            setShowAddButton={setShowAddButton}
            setEditedValue={setEditedValue}
            setDuplicateData={setDuplicateData}
          />
        ) : (
          showAddButton && (
            <BoxComponent sx={{ display: "flex", mb: 2 }}>
              <ButtonComp
                size="large"
                fullWidth={isSmallScreen}
                onClick={addGivingLevelHandler}
              >
                Add giving level
              </ButtonComp>
            </BoxComponent>
          )
        )}
      </div>
      {openDeleteMOdel && (
        <ModalComponent
          width={"422px"}
          open={openDeleteMOdel}
          onClose={() => setOpenDeleteMOdel(false)}
          padding={"48px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
        >
          <DeleteModals
            levelDeleteHandler={levelDeleteHandler}
            isDeleteLoader={isDeleteLoader}
            setOpenDeleteMOdel={setOpenDeleteMOdel}
          />
        </ModalComponent>
      )}
    </>
  );
});
Levels.propTypes = {
  singleCampaignDetails: PropTypes.object,
};
Levels.displayName = "Levels";
export default Levels;
