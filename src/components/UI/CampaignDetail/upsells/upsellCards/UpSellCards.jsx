/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from "react";
import Image from "next/image";
import BoxComponent from "../../../../../components/atoms/boxComponent/BoxComponent";
import ThreeDotVertical from "../../../../../assets/iconComponent/ThreeDotVertical";
import SubHeading from "../../../../../components/atoms/createCampaigns/SubHeading";
import ButtonComp from "../../../../../components/atoms/buttonComponent/ButtonComp";
import EditIcon from "../../../../../assets/iconComponent/EditIcon";
import DeleteIcon from "../../../../../assets/iconComponent/DeleteIcon";
import LimitedParagraph from "../../../../../components/atoms/limitedParagraph/LimitedParagraph";
import { theme } from "../../../../../config/customTheme";
import { Draggable } from "@hello-pangea/dnd";
import PropTypes from "prop-types";
import {
  UpSellText,
  UpsellButtonWrapper,
  UpsellCardWrapper,
  UpsellIconButtonWrapper,
} from "./style";
import StackComponent from "../../../../../components/atoms/StackComponent";
import useResponsiveScreen from "../../../../../hooks/useResponsiveScreen";
import { getVideoThumbnail } from "../../../../../utils/helpers";
import ImageComponent from "@/components/atoms/imageComponent/Image";
import { DEFAULT_AVATAR } from "@/config/constant";

const style = {
  background: "#F8F8F8",
  position: "absolute",
  top: { xs: 67, sm: 48 },
  left: -23,
  width: "36px",
  borderRadius: "0px 0px 8px 8px",
  mr: 2,
  transform: "rotate(90deg)",
  display: { xs: "none", sm: "flex" },
  alignItems: "center",
  justifyContent: "space-evenly",
};

const UpSellCard = React.memo(
  ({ item, onEdit, index, onDelete, currencySymbol, onPreview }) => {
    const { isSmallScreen } = useResponsiveScreen();
    const [thumbnailUrl, setThumbnailUrl] = useState(DEFAULT_AVATAR);

    const editHandler = (value) => onEdit(value, "edit");
    const deleteHandler = (value) => onDelete(value);
    const previewHandler = (value) => onPreview(value);

    useEffect(() => {
      const fetchThumbnail = async (imageOrVideoUrl) => {
        if (
          imageOrVideoUrl.includes("youtube.com") ||
          imageOrVideoUrl.includes("youtu.be") ||
          imageOrVideoUrl.includes("vimeo.com")
        ) {
          const thumbnail = await getVideoThumbnail(imageOrVideoUrl);
          setThumbnailUrl(thumbnail);
        } else {
          setThumbnailUrl(imageOrVideoUrl);
        }
      };

      {
        item.type !== "orderBump" && fetchThumbnail(item.imageUrl);
      }
    }, [item.imageUrl]);

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
                <BoxComponent sx={style}>
                  <div {...provided.dragHandleProps}>
                    <ThreeDotVertical />
                  </div>
                </BoxComponent>
                <UpsellCardWrapper type={item.type}>
                  {item.type !== "orderBump" && (
                    <BoxComponent
                      sx={{
                        minWidth: "134px",
                        maxWidth: "134px",
                        height: "88px",
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      <ImageComponent
                        source={thumbnailUrl}
                        width={"100%"}
                        height={"100%"}
                        borderRadius="9px"
                        objectFit="cover"
                        alt="upsell thumbnail"
                      />
                    </BoxComponent>
                  )}

                  <BoxComponent
                    sx={{
                      width: "100%",
                    }}
                  >
                    <StackComponent
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: { xs: "10px", sm: "inherit" } }}
                    >
                      <SubHeading sx={{ color: "#606062" }}>
                        {currencySymbol} {item.amount}
                      </SubHeading>
                      <UpsellButtonWrapper>
                        <UpSellText type={item.type}>
                          {item.type === "upSell"
                            ? "Upsell"
                            : item.type === "downSell"
                              ? "Downsell"
                              : "Order bump"}
                        </UpSellText>
                        <ButtonComp
                          borderRadius="25px"
                          fontSize="14px"
                          fontWeight={500}
                          lineHeight="16px"
                          padding="10px 19px"
                          height="34px"
                          sx={{
                            width: "80px",
                            textAlign: "center",
                          }}
                          size="normal"
                          variant={"outlined"}
                          onClick={() => editHandler(item)}
                        >
                          Edit
                        </ButtonComp>
                        {item.type !== "orderBump" && (
                          <ButtonComp
                            borderRadius="25px"
                            fontSize="14px"
                            fontWeight={500}
                            lineHeight="16px"
                            padding="10px 19px"
                            height="34px"
                            sx={{
                              width: "80px",
                              textAlign: "center",
                            }}
                            size="normal"
                            variant={"outlined"}
                            onClick={() => previewHandler(item)}
                          >
                            Preview
                          </ButtonComp>
                        )}
                        <ButtonComp
                          borderRadius="25px"
                          padding="10px 19px"
                          height="34px"
                          sx={{ width: "80px" }}
                          size="normal"
                          variant={"outlined"}
                          onClick={() => deleteHandler(item)}
                        >
                          Delete
                        </ButtonComp>
                      </UpsellButtonWrapper>

                      <UpsellIconButtonWrapper>
                        <ButtonComp
                          borderRadius="25px"
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
                      </UpsellIconButtonWrapper>
                    </StackComponent>
                    {item.type !== "orderBump" && (
                      <BoxComponent
                        sx={{
                          minWidth: "139px",
                          maxWidth: "139px",
                          height: "88px",
                          mb: "11px",
                          display: { xs: "block", sm: "none" },
                        }}
                      >
                        <Image
                          src={thumbnailUrl}
                          width={139}
                          height={88}
                          alt="upsell thumbnail"
                          style={{ borderRadius: "9px", objectFit: "cover" }}
                        />
                      </BoxComponent>
                    )}
                    <LimitedParagraph
                      line={isSmallScreen ? 2 : 1}
                      align="left"
                      sx={{
                        fontWeight: 500,
                        fontSize: "18px",
                        color: theme.palette.primary.dark,
                        lineHeight: "22px",
                        mb: "4px",
                        marginTop: "10px",
                      }}
                    >
                      {item.title}
                    </LimitedParagraph>
                    <LimitedParagraph
                      line={isSmallScreen ? 2 : 1}
                      align="left"
                      sx={{
                        fontWeight: 400,
                        fontSize: "16px",
                        color: theme.palette.primary.gray,
                        lineHeight: "20px",
                        wordBreak:
                          item?.description?.length > 100
                            ? "break-all"
                            : undefined,
                      }}
                    >
                      {item.description}
                    </LimitedParagraph>
                  </BoxComponent>
                </UpsellCardWrapper>
              </BoxComponent>
            </div>
          </div>
        )}
      </Draggable>
    );
  }
);

UpSellCard.displayName = "UpSellCard";

UpSellCard.propTypes = {
  item: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  isLoader: PropTypes.bool,
  index: PropTypes.string,
  currencySymbol: PropTypes.string,
};
export default UpSellCard;
