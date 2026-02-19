"use client";

import React from "react";
import { CardWrapper } from "./Card.style";
import PropTypes from "prop-types";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";
import RightIcon from "../../../assets/iconComponent/RightIcon";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LimitedParagraph from "../../atoms/limitedParagraph/LimitedParagraph";

const Card = ({
  heading = "Share early and often to built momentum",
  title = "Fundraisers shared 6+ times within the first few days are 3x as likely to raise more donations",
  buttonTitle = "Manage your inner circle",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <CardWrapper>
      <div>
        <LimitedParagraph
          align="left"
          line={2}
          fontSize={isMobile ? "18px" : "32px"}
          fontWeight={500}
          sx={{ lineHeight: { xs: "22px", sm: "38px" }, mb: 3 }}
        >
          {heading}
        </LimitedParagraph>
        <LimitedParagraph
          align="left"
          fontSize={isMobile ? "14px" : "18px"}
          fontWeight={500}
          sx={{ lineHeight: { xs: "18px", sm: "22px" } }}
          line={2}
        >
          {title}
        </LimitedParagraph>
      </div>
      <ButtonComp
        variant={"text"}
        size="small"
        sx={{
          fontWeight: 500,
          fontSize: "14px",
          lineHeight: "16px",
          color: "#FFFFFF",
          letter: "-0.41px",
          padding: "2px 4px",
        }}
        endIcon={
          <div style={{ marginTop: "4px" }}>
            <RightIcon />
          </div>
        }
      >
        {buttonTitle}
      </ButtonComp>
    </CardWrapper>
  );
};
Card.propTypes = {
  heading: PropTypes.string,
  title: PropTypes.string,
  buttonTitle: PropTypes.string,
};

export default Card;
