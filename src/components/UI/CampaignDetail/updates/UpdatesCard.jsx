"use client";

import React from "react";
import PropTypes from "prop-types";
import {
  CardButtonWrapper,
  CardIconButtonWrapper,
  CardWrapper,
} from "@/styles/CampaignDetails.style";
import { theme } from "../../../../config/customTheme";
import LimitedParagraph from "../../../../components/atoms/limitedParagraph/LimitedParagraph";
import BoxComponent from "../../../../components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import { Draggable } from "@hello-pangea/dnd";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
// import ThreeDotVertical from "@/assets/iconComponent/ThreeDotVertical";
import EditIcon from "@/assets/iconComponent/EditIcon";
import DeleteIcon from "@/assets/iconComponent/DeleteIcon";

const styles = {
  contentContainer: {
    maxWidth: "100%",
    marginBottom: "8px",
  },
  singleLine: {
    "& .single-line-content": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      display: "block",
      fontSize: "16px",
      lineHeight: "20px",
      color: theme.palette.primary.gray,
      "& *": {
        // This will affect all child elements
        display: "inline",
        whiteSpace: "nowrap",
      },
    },
  },
};

const UpdatesCard = ({ item, onDeleteHandler, onClickHandler, index }) => {
  const { isSmallScreen } = useResponsiveScreen();
  // Get the text content only from HTML
  const getTextContent = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const deleteHandler = (value) => {
    onDeleteHandler(value._id, "delete");
  };

  const editHandler = (value) => {
    onClickHandler(value, "edit");
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
              }}
            >
              {/* <div > */}
              {/* <BoxComponent
                sx={{
                  background: "#F8F8F8",
                  // padding: '8px 4px 0px 0px',
                  position: "absolute",
                  top: { xs: 67, sm: 39 },
                  left: -23,
                  width: "36px",
                  // height: '16px',
                  borderRadius: "0px 0px 8px 8px",
                  mr: 2,
                  transform: "rotate(90deg)",
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <div {...provided.dragHandleProps}>
                  <ThreeDotVertical />
                </div>
              </BoxComponent> */}
              <CardWrapper
                {...provided.dragHandleProps}
                onClick={(e) => {
                  // Stop click propagation from buttons
                  if (e.target.closest("button")) {
                    e.stopPropagation();
                    return;
                  }
                  editHandler(item);
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
                        wordBreak: "break-word",
                      }}
                    >
                      {item.title}
                    </LimitedParagraph>
                  </StackComponent>
                  <CardButtonWrapper>
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
                      sx={{ width: "73px" }}
                      size="normal"
                      variant={"outlined"}
                      onClick={() => deleteHandler(item)}
                    >
                      Delete
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
                  <BoxComponent
                    sx={{
                      ...styles.contentContainer,
                      ...styles.singleLine,
                    }}
                  >
                    <div
                      className="single-line-content"
                      dangerouslySetInnerHTML={{
                        __html: getTextContent(item.body),
                      }}
                    />
                  </BoxComponent>
                </StackComponent>
              </CardWrapper>
              {/* </div> */}
            </BoxComponent>
          </div>
        </div>
      )}
    </Draggable>
  );
};

UpdatesCard.propTypes = {
  item: PropTypes.object,
  onClickHandler: PropTypes.func,
  onDeleteHandler: PropTypes.func,
  onDuplicateHandler: PropTypes.func,
  isLoader: PropTypes.bool,
  index: PropTypes.string,
};

export default UpdatesCard;
