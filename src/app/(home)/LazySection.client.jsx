"use client";

/**
 * LazySection - Wrapper that lazy loads children when scrolled into view
 * Uses Intersection Observer to defer rendering until visible
 */
import { useEffect, useRef, useState } from "react";

export default function LazySection({
  children,
  rootMargin = "200px",
  minHeight = "200px",
  placeholder = null,
}) {
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
        rootMargin,
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", minHeight: isVisible ? "auto" : minHeight }}
    >
      {isVisible
        ? children
        : placeholder || (
            <div
              style={{
                width: "100%",
                height: minHeight,
                background: "linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%)",
                borderRadius: "40px",
              }}
            />
          )}
    </div>
  );
}
