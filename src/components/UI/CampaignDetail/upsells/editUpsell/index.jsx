import Grid from "@mui/material/Grid";
import React, { useCallback, useState } from "react";
import LeftCard from "./LeftCard";
import RightCard from "./RightCard";
import PropTypes from "prop-types";
import SubHeading from "../../../../../components/atoms/createCampaigns/SubHeading";
import { getYoutubeThumbnail } from "../../../../../utils/helpers";

const EditUpsell = React.memo(({ setShowEditUpsellCard, item, type }) => {
  const getImageSource = (imageUrl) => {
    if (imageUrl?.includes("youtube.com")) {
      return getYoutubeThumbnail(imageUrl);
    } else if (imageUrl?.includes("youtu.be")) {
      return getYoutubeThumbnail(imageUrl);
    } else {
      return imageUrl;
    }
  };

  const [imageHandler, setImageHandler] = useState(
    getImageSource(item.imageUrl)
  );
  const [data, setData] = useState(item);
  const leftSideValuesHandler = useCallback((values) => {
    setData(values);
  }, []);

  const getTitle = () => {
    if (item.type === "upSell") {
      return "Edit Upsell page";
    }
    if (item.type === "downSell") {
      return "Edit Downsell page";
    }
    return "Edit Donation bump page";
  };

  return (
    <div style={{ marginBottom: "25px", padding: "0px 32px" }}>
      <SubHeading sx={{ mb: { xs: "24px", sm: "6px" } }}>
        {getTitle()}
      </SubHeading>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} sx={{ order: { xs: 1, sm: 0 } }}>
          <LeftCard
            item={item}
            setShowEditUpsellCard={setShowEditUpsellCard}
            onImage={(url) => setImageHandler(getImageSource(url))}
            onPreviousValues={leftSideValuesHandler}
          />
        </Grid>
        {item.type !== "orderBump" ? (
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end", // Aligns RightCard to the right
              order: { xs: 0, sm: 1 },
            }}
          >
            <RightCard item={data} imageHandler={imageHandler} type={type} />
          </Grid>
        ) : null}
      </Grid>
    </div>
  );
});
EditUpsell.displayName = "EditUpsell";
EditUpsell.propTypes = {
  setShowEditUpsellCard: PropTypes.func,
  item: PropTypes.any,
};
export default EditUpsell;
