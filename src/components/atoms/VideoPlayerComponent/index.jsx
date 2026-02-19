"use client";

import PropTypes from "prop-types";
import React from "react";
import ReactPlayer from "react-player";
import LazyReactPlayer from "react-player/lazy";

const VideoPlayerComponent = ({
  width = "100%",
  height = "100%",
  lazyLoad = true,
  url = "https://www.youtube.com/watch?v=5-XwPX0Uwnc&pp=ygUOcGFsZXN0aW5lIGtpZHM%3D",
  controls = true,
  ...otherProps
}) => {
  let playerProps = {
    url,
    width,
    height,
    controls,
    ...otherProps,
  };
  if (lazyLoad) {
    return <LazyReactPlayer {...playerProps} />;
  }
  return <ReactPlayer {...playerProps} />;
};

VideoPlayerComponent.propTypes = {
  controls: PropTypes.bool,
  height: PropTypes.string,
  lazyLoad: PropTypes.bool,
  url: PropTypes.string,
  width: PropTypes.string,
};

export default VideoPlayerComponent;
