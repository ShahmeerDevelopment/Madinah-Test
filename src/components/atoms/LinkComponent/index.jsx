"use client";

import PropTypes from "prop-types";
import React from "react";
import Link from "next/link";

// Next
const LinkComponent = ({
  styleOverrides: styleoverrides,
  color = "inherit",
  to = "/",
  children,
  clickHandler = () => {},
  target,
  rel,
  ...otherProps
}) => {
  return (
    <Link
      href={to}
      prefetch={false}
      style={{
        textDecoration: "none",
        fontSize: "inherit",
        color: color,
        fontWeight: "inherit",
        ...styleoverrides,
      }}
      onClick={clickHandler}
      target={target}
      rel={rel}
      {...otherProps}
    >
      {children}
    </Link>
  );
};

LinkComponent.propTypes = {
  children: PropTypes.any,
  color: PropTypes.string,
  styleOverrides: PropTypes.object,
  href: PropTypes.string,
  clickHandler: PropTypes.func,
  target: PropTypes.string,
  rel: PropTypes.string,
};

export default LinkComponent;
