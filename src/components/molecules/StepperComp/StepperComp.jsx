/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import Stepper from "@mui/material/Stepper";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StepperCard from "../stepperCard/StepperCard";
import { BANK_STEPPER } from "@/config/constant";
import Draggable from "react-draggable";
import { useEffect } from "react";

const StepperComp = ({
  activeStep,
  children,
  currentIndex,
  STEPPER_DATA = BANK_STEPPER,
  isCardResponsive,
  isStepperResponsive = false,
  isDragAble = false,
  previousStep,
  overflowProp = "hidden",
  newDonation = false,
}) => {
  const { isSmallerThan } = useResponsiveScreen();
  //   const moveLeft = +activeStep * -221;
  const containerRef = useRef();

  const parentRef = useRef();
  const isSmallerThan800 = isSmallerThan("800");
  // const moveLeft = +activeStep * -221;
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Dynamic calculation for step translation based on screen size and step count
  const getTranslatedPixels = () => {
    // Dynamic translation based on step count
    const stepCount = STEPPER_DATA?.length || 0;

    // For screens with more than 6 steps, apply translation logic
    if (stepCount >= 6) {
      // Calculate progressive translation based on step position

      if (activeStep >= stepCount - 1) {
        // Last step - maximum translation to ensure full visibility
        return -(stepCount - 1.8) * 140; // Ensure last step is fully visible
      } else if (activeStep >= 7) {
        // Step 7 and beyond - strong translation
        return -(activeStep - 2.2) * 150; // Increased translation for steps 7+ to show fully
      } else if (activeStep >= 5) {
        // After step 5 - start translating to show remaining steps
        return -(activeStep - 3.5) * 180; // Progressive translation for steps 5-6
      }
    }

    return 0;
  };

  const translatedPixelsForSixthStep = getTranslatedPixels();

  const itemWidth = 110;
  const totalWidth = STEPPER_DATA.length * itemWidth;
  const boundsRight = 0;
  const boundsLeft = -(totalWidth - 200); // Increased visible area to ensure last step is accessible

  const onDrag = (e, ui) => {
    const { x } = position; // Current position
    const newPositionX = x + ui.deltaX; // Potential new position

    // Stop dragging if the last item is reached
    if (newPositionX < boundsLeft) {
      setPosition({ x: boundsLeft, y: 0 });
      return false;
    } else if (newPositionX > boundsRight) {
      setPosition({ x: boundsRight, y: 0 });
      return false;
    } else {
      setPosition({ x: newPositionX, y: 0 });
    }
  };
  useEffect(() => {
    const stepCount = STEPPER_DATA?.length || 0;
    let moveLeft;

    if (activeStep >= stepCount - 2) {
      // For the last two steps, ensure they're fully visible
      moveLeft = -(stepCount - 2.5) * itemWidth;
    } else {
      moveLeft = +activeStep * -itemWidth;
    }

    // Ensure we don't exceed bounds
    const clampedX = Math.max(Math.min(moveLeft, boundsRight), boundsLeft);
    setPosition({ x: clampedX, y: 0 });
  }, [activeStep, boundsLeft, boundsRight, STEPPER_DATA?.length]);

  return (
    <BoxComponent sx={{ overflow: overflowProp }}>
      {isDragAble && isSmallerThan800 ? (
        <div ref={parentRef} style={{ width: "100%", overflow: "hidden" }}>
          <Draggable
            axis="x"
            handle=".handle"
            position={position}
            nodeRef={containerRef}
            defaultPosition={{
              x: 0,
              y: 0,
            }}
            grid={[1, 1]}
            scale={1}
            onDrag={onDrag}
            bounds={{
              left: boundsLeft,
              right: boundsRight,
            }}
          >
            <div
              ref={containerRef}
              className="handle"
              style={{ width: "100%", display: "flex", gap: "15.67px" }}
            >
              <BoxComponent
                sx={{
                  display: "flex",
                  flexWrap: "no-wrap",
                  alignItems: "center",

                  mx: { xs: 1, sm: 0 },
                  my: 3,
                  gap: 1,
                  width: "100%",
                  transform: isStepperResponsive
                    ? null
                    : `translateX(${position.x}px)`,
                }}
              >
                {STEPPER_DATA.map((item, index) => {
                  return (
                    <BoxComponent key={index} sx={{ width: "100%" }}>
                      <StepperCard
                        heading={item.heading}
                        title={item.title}
                        icon={
                          activeStep === index ? item.activeIcon : item.icon
                        }
                        isActive={activeStep === index ? true : false}
                        currentIndex={currentIndex >= index}
                        isCardResponsive={isCardResponsive}
                        isStepperResponsive={isStepperResponsive}
                      />
                    </BoxComponent>
                  );
                })}
              </BoxComponent>
            </div>
          </Draggable>
        </div>
      ) : (
        <BoxComponent
          sx={{
            display: "flex",
            flexWrap: "no-wrap",
            alignItems: "center",
            mx: { xs: 1, sm: 0 },
            my: newDonation ? 0 : 3,
            gap: newDonation ? 0 : 1,
            width: "100%",
            // boxShadow: BOX_SHADOW_STYLE,
            transform: isStepperResponsive
              ? null
              : `translateX(${translatedPixelsForSixthStep}px)`,
            "@media (max-width: 1154px)": {
              transform: isStepperResponsive
                ? null
                : `translateX(${(() => {
                    const stepCount = STEPPER_DATA?.length || 0;
                    if (activeStep >= stepCount - 1) {
                      // Last step - maximum translation for full visibility
                      return `${-(stepCount - 1.5) * 145}`;
                    } else if (activeStep >= 7) {
                      // Step 7 and beyond - strong progressive translation
                      return `${-(activeStep - 2.2) * 160}`;
                    } else if (activeStep >= 5) {
                      // After step 5 - progressive translation
                      return `${-(activeStep - 3.5) * 140}`;
                    }
                    return "0";
                  })()}px)`,
            },
          }}
        >
          {STEPPER_DATA.map((item, index) => {
            return (
              <BoxComponent key={index} sx={{ width: "100%" }}>
                <StepperCard
                  heading={item.heading}
                  title={item.title}
                  icon={activeStep === index ? item.activeIcon : item.icon}
                  isActive={activeStep === index ? true : false}
                  currentIndex={currentIndex >= index}
                  isCardResponsive={isCardResponsive}
                  isPrevious={index === previousStep}
                  isStepperResponsive={isStepperResponsive}
                />
              </BoxComponent>
            );
          })}
        </BoxComponent>
      )}
      <Stepper
        activeStep={activeStep}
        sx={{
          width: "100%",
          overflow: "hidden",
        }}
      ></Stepper>
      {children}
    </BoxComponent>
  );
};

StepperComp.propTypes = {
  activeStep: PropTypes.number,
  children: PropTypes.node, // children can be anything renderable
  currentIndex: PropTypes.number,
  STEPPER_DATA: PropTypes.arrayOf(
    PropTypes.shape({
      heading: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired, // Assuming icon is a React node (e.g., JSX)
      activeIcon: PropTypes.node.isRequired,
    }),
  ).isRequired,
  isCardResponsive: PropTypes.bool,
  isStepperResponsive: PropTypes.bool,
};

export default StepperComp;
