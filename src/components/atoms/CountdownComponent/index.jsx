"use client";

import PropTypes from "prop-types";
import React from "react";
import Countdown from "react-countdown";
import { convertTimeToMilliseconds } from "../../../utils/helpers";

const defaultTimer = {
  hours: null,
  minutes: null,
  seconds: 10,
};

const CountdownComponent = ({ onComplete = () => { }, timer = defaultTimer }) => {
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      onComplete();
      return <></>;
    } else {
      // Render a countdown
      return (
        <span>
          {minutes}:{seconds}
        </span>
      );
    }
  };

  return (
    <Countdown
      date={Date.now() + convertTimeToMilliseconds(timer)}
      renderer={renderer}
    />
  );
};

CountdownComponent.propTypes = {
  children: PropTypes.any,
  hours: PropTypes.any,
  minutes: PropTypes.number,
  onComplete: PropTypes.func,
  seconds: PropTypes.number,
  timer: PropTypes.shape({
    hours: PropTypes.any,
    minutes: PropTypes.number,
    seconds: PropTypes.number,
  }),
};

export default CountdownComponent;
