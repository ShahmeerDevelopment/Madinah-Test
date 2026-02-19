/* eslint-disable indent */
"use client";

import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import Draggable from "react-draggable";

import {
  CarouselItemWitImgTitleDescCard,
  CarouselItemWithImageDescriptionInsideCard,
  CarouselItemWithImgTitleDescription,
  CarouselItemWithOnlyImage,
  CountryCard,
} from "../CarouselItemTypes";

// Next
const CarouselController = ({ type, clickAction, ...otherProps }) => {
  switch (type) {
    case "image-title-desc":
      return (
        <CarouselItemWithImgTitleDescription
          {...otherProps}
          clickAction={clickAction}
        />
      );
    case "image-title-desc-card":
      return (
        <CarouselItemWitImgTitleDescCard
          {...otherProps}
          clickAction={clickAction}
        />
      );
    case "image-title-desc-insidecard":
      return (
        <CarouselItemWithImageDescriptionInsideCard
          clickAction={clickAction}
          {...otherProps}
        />
      );
    case "country-card":
      return <CountryCard {...otherProps} clickAction={clickAction} />;
    case "only-image":
      return (
        <CarouselItemWithOnlyImage {...otherProps} clickAction={clickAction} />
      );
    default:
      return <></>;
  }
};
// add comment
CarouselController.propTypes = {
  type: PropTypes.any,
};

const DraggableSlider = ({
  arr,
  type,
  clickAction = () => {},
  categories = false,
}) => {
  const containerRef = useRef();
  const parentRef = useRef();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerWidth = containerRef.current
    ? containerRef.current.offsetWidth
    : 0;

  const itemWidth = 163 + 15.67;
  const totalWidth = arr.length * itemWidth;
  const boundsRight = 0;
  const boundsLeft = -(totalWidth - containerWidth);

  const onDrag = (e, ui) => {
    const { x } = position; // Current position
    const newPositionX = x + ui.deltaX; // Potential new position

    // Stop dragging if the last item is reached
    if (newPositionX < boundsLeft) {
      // Prevent dragging beyond the left bound
      setPosition({ x: boundsLeft, y: 0 });
      return false; // Stops the drag event
    } else {
      setPosition({ x: newPositionX, y: 0 });
    }
  };

  return (
    <div ref={parentRef} style={{ width: "100%", overflow: "hidden" }}>
      <Draggable
        axis="x"
        handle=".handle"
        position={position}
        defaultPosition={{
          x: 0,
          y: 0,
        }}
        grid={[1, 1]}
        scale={1}
        // onStart={onStart}
        onDrag={onDrag}
        // onStop={onStop}
        bounds={{
          // left: -containerRef?.current?.offsetWidth,
          left: categories ? boundsLeft : -5.2 * (223 + 15.67),
          top: 0,
          right: categories ? boundsRight : 0,
          bottom: 0,
        }}
        cancel=".cancel-drag" // Cancel dragging when elements with this class are interacted with
      >
        <div
          ref={containerRef}
          className="handle"
          style={{ width: "100%", display: "flex", gap: "15.67px" }}
        >
          {arr.map((eachItem) => {
            return (
              <div
                style={{ cursor: "grab", width: itemWidth }}
                key={eachItem.id}
              >
                <CarouselController
                  clickAction={(e) => {
                    clickAction(e);
                  }}
                  type={type}
                  {...eachItem}
                />
              </div>
            );
          })}
        </div>
      </Draggable>
    </div>
  );
};

DraggableSlider.propTypes = {
  arr: PropTypes.array,
  clickAction: PropTypes.func,
  type: PropTypes.any,
  categories: PropTypes.bool,
};

export default DraggableSlider;
