"use client";

import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";

const ExternalLink = ({ children, to = "/", ...otherProps }) => {
  return (
    <Link
      prefetch={false}
      href={to}
      style={{
        color: "#6363E6",
        fontWeight: 500,
        fontSize: "14px",
        lineHeight: "16px",
        letterSpacing: "-0.41px",
        textDecoration: "none",
      }}
      {...otherProps}
    >
      {children}
    </Link>
  );
};

ExternalLink.propTypes = {
  children: PropTypes.any,
  href: PropTypes.string,
};

export default ExternalLink;
