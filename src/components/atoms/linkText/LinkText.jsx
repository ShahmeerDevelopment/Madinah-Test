"use client";

import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import TypographyComp from "../typography/TypographyComp";

const LinkText = ({
  href,
  children,
  typographyVariant = "subtitle2",
  style = { color: "black" },
  target = "_self",
  ...props
}) => {
  return (
    <Link
      href={href}
      target={target}
      style={{ textDecoration: "none", ...style }}
      prefetch={false}
    >
      <TypographyComp variant={typographyVariant} {...props}>
        {children}
      </TypographyComp>
    </Link>
  );
};

LinkText.propTypes = {
  href: PropTypes.string.isRequired,
  target: PropTypes.string,
  children: PropTypes.node.isRequired,
  typographyVariant: PropTypes.oneOfType([
    PropTypes.oneOf([
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "subtitle1",
      "subtitle2",
      "body1",
      "body2",
      "caption",
      "button",
      "overline",
      "srOnly",
      "inherit",
    ]),
    PropTypes.string,
  ]),
  style: PropTypes.object,
};

export default LinkText;
