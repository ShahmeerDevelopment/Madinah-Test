"use client";

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Parallax = ({ children, strength = 100 }) => {
  const [offset, setOffset] = useState(0);

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    setOffset((scrollY * strength) / 1000);
  };

  useEffect(() => {
    // Add event listener only on the client side
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return <div style={{ transform: `translateY(${offset}px)` }}>{children}</div>;
};

Parallax.propTypes = {
  children: PropTypes.any,
  strength: PropTypes.any,
};

export default Parallax;
