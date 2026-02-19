"use client";

import React, { memo, useCallback, useState } from "react";
import BoxComponent from "../../../../components/atoms/boxComponent/BoxComponent";
import { getCardIcon } from "../../../../config/constant";
import SelectAbleSavedCard from "../../../../components/atoms/selectAbleField/SelectAbleSavedCard";
import ModalComponent from "../../../../components/molecules/modal/ModalComponent";
import DeleteModal from "./addModel/DeleteModal";
import ButtonComp from "../../../../components/atoms/buttonComponent/ButtonComp";
import { theme } from "../../../../config/customTheme";
import AddandEditModel from "./addModel/AddandEditModel";
import CardSkeleton from "./CardSkeleton";
import PropTypes from "prop-types";
import useResponsiveScreen from "../../../../hooks/useResponsiveScreen";
import { deletePaymentCard } from "../../../../api/delete-api-services";
import toast from "react-hot-toast";

const Cards = memo(
  ({
    cardDetails,
    isEdit,
    openEditModal,
    setIsEdit,
    setOpenEditModal,
    refetch,
    isLoading,
  }) => {
    const [isSavedCardSelected, setIsSavedCardSelected] = useState(null);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const { isSmallScreen } = useResponsiveScreen();
    const [cardData, setCardData] = useState({});

    const cardHandler = useCallback((item, index) => {
      setIsSavedCardSelected((previousSelected) => {
        const isSelected = previousSelected !== index;
        return isSelected ? index : null;
      });
    }, []);

    const editCardHandler = useCallback(
      (event, cardItem, index) => {
        if (isSavedCardSelected === index) {
          event.stopPropagation();
        }
        setIsEdit(true);
        setOpenEditModal(true);
        setCardData(cardItem);
      },
      [isSavedCardSelected],
    );

    const deleteCardHandler = useCallback(
      (event, cardItem, index) => {
        if (isSavedCardSelected === index) {
          event.stopPropagation();
        }
        setOpenDeleteModel(true);
      },
      [isSavedCardSelected],
    );

    const deleteCardDataHandler = useCallback(() => {
      deletePaymentCard()
        .then((res) => {
          const result = res?.data;
          result?.success === true;
          if (result.success) {
            refetch();
            toast.success("Card successfully deleted");
          }
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
      setOpenDeleteModel(false);
    }, []);

    const addNewCardDataHandler = useCallback(() => {
      setIsEdit(false);
      setOpenEditModal(true);
    }, []);

    return (
      <div>
        {!isSmallScreen ? (
          <BoxComponent
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: { xs: -4, sm: -8 },
              mb: 4,
            }}
          >
            <ButtonComp
              onClick={addNewCardDataHandler}
              variant={"text"}
              size="normal"
              sx={{ color: theme.palette.primary.darkGray }}
              fontSize={"14px"}
              lineHeight={"16px"}
              fontWeight={500}
              disabled={cardDetails?.length > 0}
            >
              Add new card
            </ButtonComp>
          </BoxComponent>
        ) : null}
        {isLoading ? (
          <CardSkeleton />
        ) : (
          <BoxComponent sx={{ mt: 2, mb: 4 }}>
            {cardDetails?.map((item, index) => {
              return (
                <div key={item.id}>
                  <SelectAbleSavedCard
                    isStoredCard={false}
                    isActive={isSavedCardSelected === index}
                    onClick={() => cardHandler(item, index)}
                    heading={`Saved visa card ****${item.lastFour}`}
                    icon={getCardIcon(item?.brand)}
                    onEdit={(event) => editCardHandler(event, item, index)}
                    onDelete={(event) => deleteCardHandler(event, item, index)}
                  />
                </div>
              );
            })}
          </BoxComponent>
        )}
        {openDeleteModel && (
          <ModalComponent
            open={openDeleteModel}
            onClose={() => setOpenDeleteModel(false)}
            width={"422px"}
            padding={"48px 32px"}
            responsivePadding={"40px 16px 56px 16px"}
          >
            <DeleteModal
              deleteHandler={deleteCardDataHandler}
              setOpenDeleteModel={setOpenDeleteModel}
            />
          </ModalComponent>
        )}

        {openEditModal && (
          <ModalComponent
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            width={"650px"}
            padding={"48px 32px 24px 32px"}
            responsivePadding={"40px 16px 43px 16px"}
          >
            <AddandEditModel
              isEdit={isEdit}
              setOpenEditModal={setOpenEditModal}
              cardData={cardData}
              refetch={refetch}
            />
          </ModalComponent>
        )}
      </div>
    );
  },
);
Cards.propTypes = {
  cardDetails: PropTypes.array.isRequired,
  isEdit: PropTypes.any,
  openEditModal: PropTypes.any,
  setIsEdit: PropTypes.any,
  setOpenEditModal: PropTypes.any,
  refetch: PropTypes.any,
  isLoading: PropTypes.any,
};
Cards.displayName = "Cards";
export default Cards;
