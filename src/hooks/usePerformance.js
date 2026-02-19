import { useEffect, useRef, useCallback } from "react";

/**
 * Hook to defer operations until the browser is idle
 * This helps improve LCP by not blocking the main thread during initial render
 */
export const useDeferredExecution = () => {
  const deferredTasks = useRef([]);
  const isExecuted = useRef(false);

  const addDeferredTask = useCallback((task, priority = "normal") => {
    deferredTasks.current.push({ task, priority });
  }, []);

  const executeDeferredTasks = useCallback(() => {
    if (isExecuted.current) return;
    isExecuted.current = true;

    // Sort tasks by priority (high priority first)
    const sortedTasks = deferredTasks.current.sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    // Execute tasks in batches to avoid blocking the main thread
    const executeTaskBatch = (tasks, batchSize = 3) => {
      if (tasks.length === 0) return;

      const batch = tasks.splice(0, batchSize);
      batch.forEach(({ task }) => {
        try {
          task();
        } catch (error) {
          console.error("Error executing deferred task:", error);
        }
      });

      if (tasks.length > 0) {
        // Use requestIdleCallback for remaining tasks
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => executeTaskBatch(tasks, batchSize));
        } else {
          setTimeout(() => executeTaskBatch(tasks, batchSize), 0);
        }
      }
    };

    executeTaskBatch(sortedTasks);
  }, []);

  useEffect(() => {
    // Wait for the page to become interactive before executing deferred tasks
    const handlePageInteractive = () => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(executeDeferredTasks, { timeout: 5000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(executeDeferredTasks, 1000);
      }
    };

    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      handlePageInteractive();
    } else {
      window.addEventListener("load", handlePageInteractive);
      return () => window.removeEventListener("load", handlePageInteractive);
    }
  }, [executeDeferredTasks]);

  return { addDeferredTask };
};

/**
 * Hook to optimize image loading
 * Uses intersection observer to load images only when they're about to be visible
 */
export const useOptimizedImageLoading = (ref, options = {}) => {
  const { rootMargin = "50px", threshold = 0.1 } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.removeAttribute("data-src");
              observer.unobserve(img);
            }
          }
        });
      },
      { rootMargin, threshold }
    );

    const images = element.querySelectorAll("img[data-src]");
    images.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, [ref, rootMargin, threshold]);
};
