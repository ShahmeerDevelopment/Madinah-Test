"use client";

/**
 * Client Component wrapper for HelpHappensHere Animation
 * Uses Intersection Observer to lazy load animation when scrolled into view
 * The animation component and JSON are only loaded when visible
 */
import { useEffect, useRef, useState, lazy, Suspense } from "react";

// Lazy import - component code won't load until actually rendered
const HelpHappensHereAnimation = lazy(
  () => import("@/components/UI/Home/HelpHappensHere/HelpHappensHereAnimation")
);

const Placeholder = () => (
  <div
    style={{
      width: "100%",
      height: "430px",
      background: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
      borderRadius: "12px",
    }}
    className="help-happens-placeholder"
  />
);

export default function HelpHappensHereAnimationWrapper() {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .help-happens-container {
          width: 100%;
          min-height: 430px;
        }
        @media (max-width: 768px) {
          .help-happens-container {
            min-height: auto;
          }
          .help-happens-placeholder {
            height: 300px !important;
          }
        }
      `}</style>
      <div ref={containerRef} className="help-happens-container">
        {isVisible ? (
          <Suspense fallback={<Placeholder />}>
            <HelpHappensHereAnimation />
          </Suspense>
        ) : (
          <Placeholder />
        )}
      </div>
    </>
  );
}
