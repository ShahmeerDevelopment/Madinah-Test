import PropTypes from "prop-types";
import React from "react";
import Link from "next/link";
import { buildSimpleTypography } from "@/utils/helpers";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";

const IconText = ({ icon, text, href }) => {
  return (
    <Link
      href={href}
      style={{ textDecoration: "none", width: "100%" }}
      prefetch={false}
    >
      <StackComponent
        sx={{
          width: "100%",
          height: "164px",
          borderRadius: "20px",
          border: "1px solid rgba(233, 233, 235, 1)",
          cursor: "pointer",
        }}
        justifyContent="center"
        alignItems="center"
        spacing="16px"
        direction="column"
      >
        {icon}

        <TypographyComp
          sx={{
            ...buildSimpleTypography(500, 22, 28),
            color: "rgba(9, 9, 9, 1)",
            textAlign: "center",
          }}
        >
          {text}
        </TypographyComp>
      </StackComponent>
    </Link>
  );
};

IconText.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.any,
  text: PropTypes.any,
};

export default IconText;
