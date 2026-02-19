"use client";

import React from "react";
import PropTypes from "prop-types";
import {
  CardButtonWrapper,
  CardIconButtonWrapper,
  CardWrapper,
} from "@/styles/CampaignDetails.style";
import SubHeading from "../../../../components/atoms/createCampaigns/SubHeading";
import { theme } from "../../../../config/customTheme";
import LimitedParagraph from "../../../../components/atoms/limitedParagraph/LimitedParagraph";
import ButtonComp from "../../../../components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "../../../../components/atoms/boxComponent/BoxComponent";
import EditIcon from "../../../../assets/iconComponent/EditIcon";
import DuplicateIcon from "../../../../assets/iconComponent/DuplicateIcon";
import DeleteIcon from "../../../../assets/iconComponent/DeleteIcon";
// import ThreeDotVertical from "../../../../assets/iconComponent/ThreeDotVertical";
import { useSelector } from "react-redux";
import { Draggable } from "@hello-pangea/dnd";
import useResponsiveScreen from "../../../../hooks/useResponsiveScreen";
import StackComponent from "@/components/atoms/StackComponent";
import { Chip } from "@mui/material";
import { AUTOMATIC_DONATION_DAYS } from "../../../../config/constant";

const LevelsCard = ({
  item,
  onClickHandler,
  onDeleteHandler,
  isLoader,
  onDuplicateHandler,
  index,
  isMostNeeded = false,
}) => {
  const currencySymbol = useSelector(
    (state) => state.mutateCampaign.currencySymbol
  );

  const currency = useSelector((state) => state.mutateCampaign.currency);

  const { isSmallScreen } = useResponsiveScreen();
  const editHandler = (value) => {
    onClickHandler(value, "edit");
  };
  const deleteHandler = (value) => {
    onDeleteHandler(value._id, "delete");
  };
  const duplicateHandler = (value) => {
    onDuplicateHandler(value, "duplicate");
  };

  const showCurrency = (amount) => {
    if (currencySymbol === "$") {
      return `${currency} ${currencySymbol}${amount} `;
    }
    return `${currencySymbol}${amount} `;
  };

  const getRecurringTypeTitle = (recurringType) => {
    const recurringTypeItem = AUTOMATIC_DONATION_DAYS.find(
      (item) => item.value === recurringType
    );
    return recurringTypeItem ? recurringTypeItem.label : "per month";
  };

  return (
    <Draggable draggableId={item._id} index={index} key={item._id}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div {...(isSmallScreen ? provided.dragHandleProps : {})}>
            <BoxComponent
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                // ml: 1,
              }}
            >
              <CardWrapper
                {...provided.dragHandleProps}
                onClick={(e) => {
                  // Prevent edit from triggering twice when clicking buttons
                  if (!e.target.closest("button")) {
                    editHandler(item);
                  }
                }}
                sx={{
                  cursor: "pointer",
                  "&:active": {
                    cursor: "grabbing",
                  },
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <BoxComponent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <SubHeading sx={{ color: "#606062", mb: 1, mt: 0.5 }}>
                    {showCurrency(item.amount)}
                    {/* {currencySymbol} */}
                    {/* {item.amount}{" "} */}
                    {item.donationType === "recurringDonation" &&
                      !isSmallScreen && (
                        <span style={{ fontSize: "16px" }}>
                          {getRecurringTypeTitle(item.recurringType)}
                        </span>
                      )}
                  </SubHeading>
                  <CardButtonWrapper>
                    <StackComponent direction="row" justifyContent="flex-end">
                      {isMostNeeded && (
                        <Chip
                          label="Most Needed"
                          size="small"
                          sx={{
                            backgroundColor: "#FFD700",
                            color: "black",
                            fontWeight: 500,
                            paddingTop: "2px",
                            height: "28px",
                            fontSize: "12px",
                            lineHeight: "16px",
                          }}
                        />
                      )}
                    </StackComponent>
                    <ButtonComp
                      padding="10px 19px"
                      height="34px"
                      sx={{ width: "60px" }}
                      variant={"outlined"}
                      size="normal"
                      onClick={() => editHandler(item)}
                    >
                      Edit
                    </ButtonComp>
                    <ButtonComp
                      padding="10px 19px"
                      height="34px"
                      sx={{ width: "90px" }}
                      size="normal"
                      variant={"outlined"}
                      onClick={() => duplicateHandler(item)}
                    >
                      Duplicate
                    </ButtonComp>
                    <ButtonComp
                      padding="10px 19px"
                      height="34px"
                      sx={{ width: "73px" }}
                      size="normal"
                      variant={"outlined"}
                      onClick={() => deleteHandler(item)}
                    >
                      {isLoader ? "Delete" : "Delete"}
                    </ButtonComp>
                  </CardButtonWrapper>
                  <CardIconButtonWrapper>
                    <ButtonComp
                      variant="outlined"
                      size="normal"
                      height="34px"
                      sx={{ width: "48px" }}
                      padding="6px 15px"
                      onClick={() => editHandler(item)}
                    >
                      <EditIcon />
                    </ButtonComp>
                    <ButtonComp
                      variant={"outlined"}
                      size="normal"
                      height="34px"
                      sx={{ width: "48px" }}
                      padding={"6px 15px"}
                      onClick={() => duplicateHandler(item)}
                    >
                      <DuplicateIcon />
                    </ButtonComp>
                    <ButtonComp
                      variant={"outlined"}
                      size="normal"
                      height="34px"
                      sx={{ width: "48px" }}
                      padding={("6px", "15px")}
                      onClick={() => deleteHandler(item)}
                    >
                      <DeleteIcon />
                    </ButtonComp>
                  </CardIconButtonWrapper>
                </BoxComponent>
                <StackComponent
                  direction="row"
                  justifyContent="space-between"
                  sx={{ marginTop: "5px" }}
                >
                  <LimitedParagraph
                    line={1}
                    align="left"
                    sx={{
                      fontWeight: 500,
                      fontSize: "18px",
                      color: theme.palette.primary.dark,
                      lineHeight: "22px",
                    }}
                  >
                    {item.title}
                  </LimitedParagraph>
                  {isSmallScreen ? (
                    <StackComponent
                      direction="column"
                      justifyContent="flex-end"
                    >
                      {isMostNeeded && (
                        <Chip
                          label="Most Needed"
                          size="small"
                          sx={{
                            backgroundColor: "#FFD700",
                            color: "black",
                            fontWeight: 500,
                            paddingTop: "2px",
                            height: "20px",
                            fontSize: "12px",
                            lineHeight: "16px",
                          }}
                        />
                      )}
                    </StackComponent>
                  ) : null}
                </StackComponent>
                <LimitedParagraph
                  line={1}
                  align="left"
                  sx={{
                    fontSize: "16px",
                    color: theme.palette.primary.gray,
                    lineHeight: "20px",
                  }}
                >
                  {item.description}
                </LimitedParagraph>
                {item.donationType === "recurringDonation" && isSmallScreen && (
                  <LimitedParagraph
                    line={1}
                    align="left"
                    sx={{
                      fontSize: "16px",
                      color: "#606062",
                      lineHeight: "20px",
                      mt: 1,
                    }}
                  >
                    {getRecurringTypeTitle(item.recurringType)}
                  </LimitedParagraph>
                )}
              </CardWrapper>
            </BoxComponent>
          </div>
        </div>
      )}
    </Draggable>
  );
};

LevelsCard.propTypes = {
  item: PropTypes.object,
  onClickHandler: PropTypes.func,
  onDeleteHandler: PropTypes.func,
  onDuplicateHandler: PropTypes.func,
  isLoader: PropTypes.bool,
  index: PropTypes.string,
};

export default LevelsCard;
