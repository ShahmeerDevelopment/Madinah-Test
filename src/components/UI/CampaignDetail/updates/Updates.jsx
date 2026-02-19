"use client";

import React, { memo, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { revalidateMultipleTags } from "@/utils/revalidateCache";
import useResponsiveScreen from "../../../../hooks/useResponsiveScreen";
import ButtonComp from "../../../../components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "../../../../components/atoms/boxComponent/BoxComponent";
import AddUpdates from "./AddUpdates";
import toast from "react-hot-toast";
import { postCampaignUpdate } from "@/api/post-api-services";
import { getCampaignUpdates } from "@/api/get-api-services";
import UpdatesCard from "./UpdatesCard";
import ModalComponent from "@/components/molecules/modal/ModalComponent";
import DeleteModals from "@/components/molecules/deleteModals/DeleteModals";
import { deleteUpdate } from "@/api/delete-api-services";
import { sortUpdates, updateAnnouncement } from "@/api/update-api-service";
import ConfirmationModal from "@/components/molecules/confirmationModal/ConfirmationModal";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

const Updates = memo(() => {
  const { isSmallScreen } = useResponsiveScreen();
  const id = useSelector((state) => state.mutateCampaign.id);
  const campaignSlug = useSelector(
    (state) => state.mutateCampaign.fundraiserCustomUrl,
  );
  const editRef = useRef(null);

  const [isLoader, setIsLoader] = useState(false);
  const [existingUpdates, setExistingUpdates] = useState([]);
  const [notifyHandler, setNotifyHandler] = useState(null);
  const [deletedValue, setDeletedValue] = useState(null);
  const [editedValue, setEditedValue] = useState(null);
  const [showAddButton, setShowAddButton] = useState(true);
  const [isDeleteLoader, setIsDeleteLoader] = useState(false);
  const [openDeleteMOdel, setOpenDeleteMOdel] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  //   const [isAllowedToSendOverEmail, setIsAllowedToSendOverEmail] =
  //     useState(false);
  const emailCount = useSelector((state) => state.mutateCampaign.emailCount);
  const [updatedValue, setUpdatedValue] = useState(null);
  const [isShowForm, setIsShowForm] = useState({
    add: false,
    edit: false,
    duplicate: false,
  });

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        // setIsLoading(true);
        const response = await getCampaignUpdates(id);
        setExistingUpdates(response?.data?.data?.announcements);
      } catch (error) {
        // setError(error.message);
        console.error("Error fetching updates:", error);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchUpdates();
  }, [id]);

  const fetchUpdatesNew = async () => {
    try {
      // setIsLoading(true);
      const response = await getCampaignUpdates(id);
      setExistingUpdates(response?.data?.data?.announcements);
    } catch (error) {
      // setError(error.message);
      console.error("Error fetching updates:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  const addUpdateModalHandler = (newLevel) => {
    setOpenUpdateModal(true);
    setUpdatedValue(newLevel);
  };

  const addUpdate = (isAllowedEmail) => {
    setIsLoader(true);
    setIsDeleteLoader(true);
    const payload = {
      title: updatedValue?.title,
      emailHeader: updatedValue?.emailHeader,
      emailFooter: updatedValue?.emailFooter,
      body: updatedValue?.body,
      isAllowedToSendOverEmail: isAllowedEmail === "yes" ? true : false,
    };
    if (notifyHandler === "edit") {
      //   const updatedPayload = { ...payload, givingLevelId: editedValue._id };
      updateAnnouncement(payload, id, editedValue._id)
        .then(async (res) => {
          const result = res?.data;
          if (result.success) {
            setExistingUpdates([]);
            fetchUpdatesNew();
            setOpenUpdateModal(false);
            toast.success("Update updated successfully");
            // const updatedData = result.data.givingLevels;
            // dispatch(buildGradingLevels(updatedData));
            setIsShowForm({ add: false, edit: false, duplicate: false });
            setEditedValue(null);
            setIsDeleteLoader(false);
            setShowAddButton(true);

            // Revalidate campaign updates cache
            if (campaignSlug) {
              await revalidateMultipleTags(
                campaignSlug,
                [`campaign-updates-{id}`],
                true,
              );
            }
          } else {
            toast.error(result.message);
            setOpenUpdateModal(false);
            setIsDeleteLoader(false);
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Something went wrong");
          setIsDeleteLoader(false);
        })
        .finally(() => {
          setIsDeleteLoader(false);
          setIsLoader(false);
        });
    } else {
      setIsLoader(true);
      postCampaignUpdate(id, payload)
        .then(async (res) => {
          const result = res?.data;
          if (result.success) {
            setIsDeleteLoader(false);
            setExistingUpdates([]);
            fetchUpdatesNew();
            setOpenUpdateModal(false);
            toast.success("Update created successfully");
            // const updatedData = result.data.givingLevels;
            // dispatch(buildGradingLevels(updatedData));
            setIsShowForm({ add: false, edit: false, duplicate: false });
            // setEditedValue(null);
            // setDuplicateData(null);
            // setShowAddButton(true);

            // Revalidate campaign updates cache
            if (campaignSlug) {
              await revalidateMultipleTags(
                campaignSlug,
                [`campaign-updates-{id}`],
                true,
              );
            }
          } else {
            setIsDeleteLoader(false);
            setOpenUpdateModal(false);
            toast.error(result.message);
          }
        })
        .catch((error) => {
          setIsDeleteLoader(false);
          console.error(error);
          toast.error("Something went wrong. Please try again later.");
        })
        .finally(() => {
          setIsDeleteLoader(false);
          setIsLoader(false);
        });
    }
  };

  const addGivingLevelHandler = () => {
    setIsShowForm({ add: true, edit: false, duplicate: false });
    setNotifyHandler("add");
  };

  const updatesDeleteHandler = async () => {
    setIsDeleteLoader(true);
    // const payload = {
    //   updateId: deletedValue,
    // };
    deleteUpdate(deletedValue, id)
      .then(async (res) => {
        const result = res?.data;
        if (result.success) {
          setExistingUpdates([]);
          fetchUpdatesNew();
          toast.success("Update deleted successfully");
          // const updatedData = result.data.givingLevels;
          // dispatch(buildGradingLevels(updatedData));

          setOpenDeleteMOdel(false);
          setIsDeleteLoader(false);

          // Revalidate campaign updates cache
          if (campaignSlug) {
            await revalidateMultipleTags(
              campaignSlug,
              [`campaign-updates-{id}`],
              true,
            );
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

  const deleteHandler = (value, notify) => {
    setNotifyHandler(notify);
    setDeletedValue(value);
    setOpenDeleteMOdel(true);
  };

  const editHandler = (value, notify) => {
    setIsShowForm({ add: false, edit: true, duplicate: false });
    setNotifyHandler(notify);
    setEditedValue(value);
    setShowAddButton(false);

    // Add setTimeout to ensure DOM is updated before scrolling
    setTimeout(() => {
      editRef.current?.scrollIntoView({ behavior: "auto", block: "center" });
    }, 0);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    if (source.index === destination.index) {
      return;
    }

    // Reorder the items immediately
    const reorderedItems = Array.from(existingUpdates);
    const [removed] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, removed);

    // Update the state immediately to show the new order
    setExistingUpdates(reorderedItems);

    // Prepare and make API call
    const updatedItems = reorderedItems.map((item, index) => ({
      announcementId: item._id,
      index: index,
    }));

    const payload = {
      announcements: updatedItems,
    };

    try {
      const res = await sortUpdates(payload, id);
      if (res?.data?.success) {
        toast.success("Updates reordered successfully");

        // Revalidate campaign updates cache
        if (campaignSlug) {
          await revalidateMultipleTags(
            campaignSlug,
            [`campaign-updates-{id}`],
            true,
          );
        }
      } else {
        // If API fails, revert to previous order
        toast.error(res?.data?.message);
        fetchUpdatesNew();
      }
    } catch (error) {
      // If API fails, revert to previous order
      toast.error("Failed to reorder updates");
      fetchUpdatesNew();
    }
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
                {existingUpdates?.map((item, index) => (
                  <div
                    key={index}
                    ref={editedValue?._id === item._id ? editRef : null}
                  >
                    {editedValue?._id === item._id && isShowForm.edit ? (
                      <AddUpdates
                        onAddUpdate={addUpdateModalHandler}
                        isLoader={isLoader}
                        setIsShowForm={setIsShowForm}
                        isShowForm={isShowForm}
                        editedValue={editedValue}
                        notifyHandler={"edit"}
                        setShowAddButton={setShowAddButton}
                      />
                    ) : (
                      <UpdatesCard
                        item={item}
                        campaignId={id}
                        onDeleteHandler={(id, action) =>
                          deleteHandler(id, action)
                        }
                        index={index}
                        onClickHandler={editHandler}
                        isLoader={isDeleteLoader}
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
          <AddUpdates
            onAddUpdate={addUpdateModalHandler}
            isLoader={isLoader}
            setIsShowForm={setIsShowForm}
            isShowForm={isShowForm}
            editedValue={editedValue}
            notifyHandler={"add"}
            setShowAddButton={setShowAddButton}
          />
        ) : (
          showAddButton && (
            <BoxComponent sx={{ display: "flex", mb: 2 }}>
              <ButtonComp
                size="large"
                fullWidth={isSmallScreen}
                onClick={addGivingLevelHandler}
              >
                Add updates
              </ButtonComp>
            </BoxComponent>
          )
        )}
      </div>
      {openUpdateModal && (
        <ModalComponent
          width={"422px"}
          open={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          padding={"48px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
        >
          <ConfirmationModal
            updateEmailHandler={addUpdate}
            isUpdateLoader={isDeleteLoader}
            setOpenUpdateModal={setOpenUpdateModal}
            description={`The update will be sent to all ${emailCount} donors. Do you want to send email?`}
            // heading="Delete Update"
            // description="Are you sure you want to delete this update?"
          />
        </ModalComponent>
      )}
      {openDeleteMOdel && (
        <ModalComponent
          width={"422px"}
          open={openDeleteMOdel}
          onClose={() => setOpenDeleteMOdel(false)}
          padding={"48px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
        >
          <DeleteModals
            levelDeleteHandler={updatesDeleteHandler}
            isDeleteLoader={isDeleteLoader}
            setOpenDeleteMOdel={setOpenDeleteMOdel}
            heading="Delete Update"
            description="Are you sure you want to delete this update?"
          />
        </ModalComponent>
      )}
    </>
  );
});
Updates.propTypes = {
  singleCampaignDetails: PropTypes.object,
};
Updates.displayName = "Updates";
export default Updates;
