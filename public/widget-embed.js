(function () {
  "use strict";

  console.log("Madinah embed script loaded");

  // Prevent multiple executions
  if (window.madinahEmbedLoaded) {
    console.log("Madinah embed already loaded, skipping");
    return;
  }
  window.madinahEmbedLoaded = true;

  function createWidget() {
    console.log("Creating Madinah widgets...");

    // Find all Madinah embed containers
    const containers = document.querySelectorAll(
      ".madinah-embed:not([data-loaded])"
    );

    console.log("Found " + containers.length + " containers to process");

    containers.forEach((container, index) => {
      console.log("Processing container " + index);

      const url = container.getAttribute("data-url");
      const width = container.getAttribute("data-width") || "400px";
      const height = container.getAttribute("data-height") || "500px";

      console.log(
        "Container data - URL:",
        url,
        "Width:",
        width,
        "Height:",
        height
      );

      if (!url) {
        console.error(
          "Madinah Widget: No URL specified for container " + index
        );
        return;
      }

      // Create iframe
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.width = width;
      iframe.height = height;
      iframe.frameBorder = "0";
      iframe.style.cssText = `
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                border: none;
                display: block;
                max-width: 100%;
            `;
      iframe.title = "Madinah Campaign Widget";
      iframe.setAttribute("allowtransparency", "true");
      iframe.setAttribute("scrolling", "yes");
      iframe.setAttribute("allow", "payment");

      console.log("Created iframe for container " + index);

      // Clear container and add iframe
      container.innerHTML = "";
      container.appendChild(iframe);

      // Mark as loaded
      container.setAttribute("data-loaded", "true");

      console.log("Added iframe to container " + index);

      // Handle responsive behavior
      if (width.includes("%") || container.style.width.includes("%")) {
        iframe.style.width = "100%";
      }

      // Post message communication (optional for future features)
      window.addEventListener("message", function (event) {
        if (event.origin !== new URL(url).origin) {
          return;
        }

        // Handle height adjustments from iframe
        if (event.data && event.data.type === "madinah-widget-resize") {
          iframe.style.height = event.data.height + "px";
        }
      });
    });

    console.log("Finished processing all containers");
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    console.log("DOM still loading, adding event listener");
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    console.log("DOM already loaded, creating widgets immediately");
    createWidget();
  }

  // Also initialize immediately for dynamic content
  createWidget();

  // Expose function for manual initialization
  window.initMadinahWidgets = createWidget;

  console.log("Madinah embed script initialization complete");
})();
