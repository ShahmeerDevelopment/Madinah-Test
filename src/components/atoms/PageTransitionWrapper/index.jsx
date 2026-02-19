"use client";

import React from "react";
import PropTypes from "prop-types";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Dynamically import framer-motion to reduce initial bundle size (~150KB savings)
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false }
);

// Next
const PageTransitionWrapper = ({ children, uniqueKey = null }) => {
  const pathname = usePathname(); // Use Next.js's usePathname hook for App Router

  // Define your animation variants for the motion component
  const pageTransitionVariants = {
    initial: {
      opacity: 0,

      x: 100,
      width: "100%",
    },
    animate: {
      opacity: 1,

      x: 0,
      transition: { duration: 0.5 },
      width: "100%",
    },
    // Optionally define exit animations if needed
    // exit: {
    // 	opacity: 0,
    // 	x: -100,
    // 	transition: { duration: 0.5 },
    // },
  };

  return (
    <AnimatePresence mode="wait">
      <MotionDiv
        key={pathname || uniqueKey} // Use pathname as the key to trigger animations on route changes
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        // exit="exit" // Uncomment if exit animations are defined and needed
        // onAnimationComplete={() => setAnimationDone(true)}
      >
        {children}
      </MotionDiv>
    </AnimatePresence>
  );
};

PageTransitionWrapper.propTypes = {
  children: PropTypes.node, // It's better to specify node for children
  uniqueKey: PropTypes.any, // Adjust this if necessary based on how uniqueKey is used
};

export default PageTransitionWrapper;
