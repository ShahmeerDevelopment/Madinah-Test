"use client";

import PropTypes from "prop-types";
import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const TransitionGroupComponent = ({ children, ...otherProps }) => {
  return (
    <TransitionGroup {...otherProps}>
      {React.Children.map(children, (child) => (
        <CSSTransition
          key={child.key}
          timeout={500} // Adjust this according to your transition duration
          classNames="fade" // Make sure to define appropriate classes in your CSS
        >
          {child}
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

TransitionGroupComponent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TransitionGroupComponent;
