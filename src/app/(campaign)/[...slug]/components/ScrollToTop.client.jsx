"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollToTop - Comprehensive scroll reset for campaign pages
 * 
 * This component ensures ALL possible scroll containers are reset to top
 * when navigating to a campaign page.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Reset all possible scroll containers immediately
    const resetScroll = () => {
      // 1. Window scroll
      window.scrollTo({ top: 0, behavior: "instant" });
      
      // 2. Document elements
      if (typeof document !== "undefined") {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // 3. Find and reset any elements with overflow scrolling
        const scrollableElements = document.querySelectorAll('[style*="overflow"]');
        scrollableElements.forEach(element => {
          if (element.scrollTop) {
            element.scrollTop = 0;
          }
        });
        
        // 4. Reset any sticky positioned elements that might have scroll
        const stickyElements = document.querySelectorAll('[style*="sticky"]');
        stickyElements.forEach(element => {
          if (element.scrollTop) {
            element.scrollTop = 0;
          }
        });
      }
    };

    // Execute immediately
    resetScroll();
    
    // Also execute after a brief delay to catch any dynamically created elements
    const timer = setTimeout(resetScroll, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
