"use client";

import React, { memo } from "react";
import Image from "next/image";
import { theme } from "@/config/customTheme";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import { formatNumberWithCommas } from "@/utils/helpers";
import GridComp from "@/components/atoms/GridComp/GridComp";
import { selectedCardHandler } from "@/store/slices/statisticsSlice";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";

const boxStyle = (selectedBox, index) => ({
  width: "100%",
  height: "80px",
  borderRadius: "24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.06)",
  padding: "16px 16px 16px 18px",
  cursor: "pointer",
  border: `1px solid ${
    selectedBox === index ? theme.palette.primary.main : "transparent"
  }`,
});

const textStyle = (selectedBox, index) => ({
  fontSize: "14px",
  lineHeight: "16px",
  mb: "4px",
  color: selectedBox === index ? "#C1C1F5" : theme.palette.primary.gray,
});

const getStatisticsValue = (index, statistics) => {
  const mapping = {
    0: statistics?.visitsCount,
    1: statistics?.donationsCount,
    2: statistics?.totalDonations?.toFixed(2),
    3: statistics?.averageDonationValue?.toFixed(2),
    4: statistics?.donationPerVisit?.toFixed(2),
    5: `${
      statistics?.conversionRate
        ? (statistics?.conversionRate * 100).toFixed(2)
        : 0
    }%`,
  };
  return mapping[index] || 0;
};

const StatisticsCard = memo(({ data, statistics }) => {
  const dispatch = useDispatch();

  const selectedDate = useSelector((state) => state.statistics.selectedCard);
  // const [selectedBox, setSelectedBox] = useState(0);

  const cardHandler = (index, value) => {
    // setSelectedBox(index);
    dispatch(selectedCardHandler({ value, index }));
  };

  return (
    <GridComp container spacing={1} mt={1} mb={2}>
      {data.map((item, index) => (
        <GridComp item xs={12} sm={4} key={item._id}>
          <BoxComponent
            sx={boxStyle(selectedDate.index, index)}
            onClick={() => cardHandler(index, item.value)}
          >
            <BoxComponent sx={{ display: "flex", flexDirection: "column" }}>
              <TypographyComp sx={textStyle(selectedDate.index, index)}>
                {item.name}
              </TypographyComp>
              <SubHeading
                sx={{
                  color:
                    selectedDate.index === index
                      ? theme.palette.primary.main
                      : theme.palette.primary.dark,
                }}
              >
                {item.currencyUnit} {item.currencySymbol}
                {formatNumberWithCommas(getStatisticsValue(index, statistics))}
              </SubHeading>
            </BoxComponent>
            <Image
              src={item.icon}
              alt={`${item.name} icon`}
              width={40}
              height={40}
            />
          </BoxComponent>
        </GridComp>
      ))}
    </GridComp>
  );
});

StatisticsCard.propTypes = {
  data: PropTypes.any,
  statistics: PropTypes.object.isRequired,
};
StatisticsCard.displayName = "StatisticsCard";
export default StatisticsCard;
