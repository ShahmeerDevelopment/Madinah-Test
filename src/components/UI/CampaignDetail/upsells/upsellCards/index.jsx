/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import EditUpsell from "../editUpsell";
import { deleteUpSellCard, sortUpSellData } from "../../../../../api";
import { addUpSellLevel } from "../../../../../store/slices/mutateCampaignSlice";
import ModalComponent from "../../../../../components/molecules/modal/ModalComponent";
import DeleteModals from "../../../../../components/molecules/deleteModals/DeleteModals";
import BoxComponent from "../../../../../components/atoms/boxComponent/BoxComponent";
import UpSellCard from "./UpSellCards";
import PreviewUpsell from "./PreviewUpsell";
import { modalHeightAdjustAble } from "@/config/constant";

const UpsellsCards = React.memo(() => {
  const dispatch = useDispatch();

  const levelsData = useSelector((state) => state.mutateCampaign.upSellLevel);
  const { currencySymbol } = useSelector((state) => state.mutateCampaign);
  const id = useSelector((state) => state.mutateCampaign.id);

  const [showEditUpsellCard, setShowEditUpsellCard] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteAbleData, setDeleteAbleData] = useState(null);
  const [editAbleData, setEditAbleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const onEditHandler = (value) => {
    setEditAbleData(value);
    setShowEditUpsellCard(true);
  };

  const onDeleteHandler = (value) => {
    setDeleteAbleData(value._id);
    setOpenDeleteModal(true);
  };

  const onPreviewHandler = (value) => {
    setPreviewData(value);
    setOpenPreview(true);
  };

  const handleDragEnd = (result) => {
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
    reorderedItems?.splice(destination.index, 0, removed); // Insert the item at the new position
    const updatedItems = reorderedItems?.map((item, index) => ({
      sellConfigId: item._id,
      index: index,
    }));
    const payload = {
      sellConfigs: updatedItems,
    };

    sortUpSellData(id, payload);
    dispatch(addUpSellLevel(reorderedItems));
  };

  const upselCardDeleteHandler = () => {
    setIsLoading(true);
    deleteUpSellCard(id, { sellConfigId: deleteAbleData })
      .then((res) => {
        if (res.data.message === "Success" && res.data.success === true) {
          dispatch(addUpSellLevel(res.data.data.sellConfigs));
          setOpenDeleteModal(false);
        }
      })
      .catch((err) => {
        console.error("error", err);
        setOpenDeleteModal(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      {showEditUpsellCard ? (
        <EditUpsell
          setShowEditUpsellCard={setShowEditUpsellCard}
          item={editAbleData}
          type={editAbleData?.type}
        />
      ) : (
        <BoxComponent
          sx={{
            height: {
              xs: "100%",
              sm:
                levelsData?.length === 3
                  ? "455px"
                  : levelsData?.length === 2
                    ? "300px"
                    : "100%",
            },
          }}
        >
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {levelsData?.map((item, index) => (
                    <div key={index}>
                      <UpSellCard
                        item={item}
                        onEdit={onEditHandler}
                        index={index}
                        onDelete={onDeleteHandler}
                        currencySymbol={currencySymbol}
                        onPreview={onPreviewHandler}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </BoxComponent>
      )}
      {openDeleteModal && (
        <ModalComponent
          width={"422px"}
          open={openDeleteModal}
          padding={"48px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
          onClose={() => setOpenDeleteModal(false)}
        >
          <DeleteModals
            levelDeleteHandler={upselCardDeleteHandler}
            isDeleteLoader={isLoading}
            setOpenDeleteMOdel={setOpenDeleteModal}
            heading="Delete Upsell card"
            description={
              "Are you sure that you want to delete this Upsell card? All information about it will be deleted"
            }
          />
        </ModalComponent>
      )}
      {openPreview && (
        <ModalComponent
          width={"582px"}
          open={openPreview}
          padding={"48px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
          onClose={() => setOpenPreview(false)}
          containerStyleOverrides={modalHeightAdjustAble}
        >
          <PreviewUpsell data={previewData} />
        </ModalComponent>
      )}
    </div>
  );
});

UpsellsCards.displayName = "UpsellsCards";
export default UpsellsCards;
