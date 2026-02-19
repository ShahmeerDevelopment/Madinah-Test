/**
 * Utility for deferring non-critical work to reduce main thread blocking
 * Uses requestIdleCallback when available, with fallback to setTimeout
 */

/**
 * Schedule a task to run when the browser is idle
 * @param {Function} callback - The function to execute
 * @param {Object} options - Options for requestIdleCallback
 * @param {number} options.timeout - Max wait time in ms before forcing execution
 * @returns {number} - ID that can be used to cancel the scheduled task
 */
export const scheduleIdleTask = (callback, options = { timeout: 2000 }) => {
  if (typeof window === "undefined") {
    // SSR fallback - execute immediately
    callback();
    return 0;
  }

  if ("requestIdleCallback" in window) {
    return window.requestIdleCallback(callback, options);
  }

  // Fallback for Safari and older browsers
  return setTimeout(callback, 1);
};

/**
 * Cancel a scheduled idle task
 * @param {number} id - The ID returned by scheduleIdleTask
 */
export const cancelIdleTask = (id) => {
  if (typeof window === "undefined") return;

  if ("cancelIdleCallback" in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};

/**
 * Schedule multiple tasks to run in sequence during idle periods
 * @param {Function[]} tasks - Array of functions to execute
 * @param {number} batchSize - Number of tasks per idle callback
 * @param {number} timeout - Max wait time between batches
 */
export const scheduleIdleTasks = (tasks, batchSize = 5, timeout = 1000) => {
  if (typeof window === "undefined" || tasks.length === 0) return;

  let index = 0;

  const executeBatch = () => {
    const endIndex = Math.min(index + batchSize, tasks.length);

    for (let i = index; i < endIndex; i++) {
      try {
        tasks[i]();
      } catch (error) {
        console.error("Idle task error:", error);
      }
    }

    index = endIndex;

    if (index < tasks.length) {
      scheduleIdleTask(executeBatch, { timeout });
    }
  };

  scheduleIdleTask(executeBatch, { timeout });
};

/**
 * Defer a heavy computation until the browser is idle
 * Returns a promise that resolves with the result
 * @param {Function} compute - The computation function
 * @param {number} timeout - Max wait time before forcing execution
 * @returns {Promise} - Resolves with the computation result
 */
export const deferComputation = (compute, timeout = 2000) => {
  return new Promise((resolve, reject) => {
    scheduleIdleTask(
      () => {
        try {
          const result = compute();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      },
      { timeout }
    );
  });
};

/**
 * Create a debounced version of a function that runs during idle time
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Minimum delay between calls
 * @returns {Function} - Debounced function
 */
export const idleDebounce = (fn, delay = 200) => {
  let timeoutId = null;
  let idleId = null;

  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    if (idleId) cancelIdleTask(idleId);

    timeoutId = setTimeout(() => {
      idleId = scheduleIdleTask(() => fn(...args), { timeout: 1000 });
    }, delay);
  };
};

export default {
  scheduleIdleTask,
  cancelIdleTask,
  scheduleIdleTasks,
  deferComputation,
  idleDebounce,
};
