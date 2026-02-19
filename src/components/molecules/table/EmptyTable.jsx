"use client";

import React from "react";
import PropTypes from "prop-types";

import { theme } from "../../../config/customTheme";
// CDN-optimized: SVG served from /public/assets/ folder
const users = "/assets/svg/table/users.svg";
import Image from "../../atoms/imageComponent/Image";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import SubHeading1 from "../../atoms/createCampaigns/SubHeading1";
import TypographyComp from "../../atoms/typography/TypographyComp";
import { useRouter } from "next/navigation";

const EmptyTable = ({
  heading = "You have not added any team members",
  description = "When you add team members this information is displayed in this table",
  icon = users,
  isButton = false,
}) => {
  const router = useRouter();
  return (
    <BoxComponent
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "253px" }}
    >
      <Image source={icon} alt="user" width="48px" height={"48px"} />
      <SubHeading1 align="center" sx={{ paddingTop: "16px" }}>
        {heading}
      </SubHeading1>
      <TypographyComp
        sx={{
          marginTop: "5px !important",
          fontSize: "14px",
          lineHeight: "16px",
          textAlign: "center",
          color: theme.palette.primary.gray,
        }}
      >
        {description}
      </TypographyComp>
      {isButton && (
        <BoxComponent mt={2}>
          <ButtonComp size="normal" onClick={() => router.push("/")}>
            View current campaigns
          </ButtonComp>
        </BoxComponent>
      )}
    </BoxComponent>
  );
};
EmptyTable.propTypes = {
  heading: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.any,
  isButton: PropTypes.bool,
};
export default EmptyTable;
