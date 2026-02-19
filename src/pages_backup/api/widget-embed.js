// API route to serve the widget embed script with proper headers
export default function handler(req, res) {
  // Set proper headers for JavaScript
  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 24 hours
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow from any domain
  res.setHeader("Access-Control-Allow-Methods", "GET");

  // Widget script content with proper escaping
  const widgetScript = `(function() {
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
        const containers = document.querySelectorAll(".madinah-embed:not([data-loaded])");
        console.log("Found " + containers.length + " containers to process");
        
        containers.forEach(function(container, index) {
            console.log("Processing container " + index);
            
            const url = container.getAttribute("data-url");
            const width = container.getAttribute("data-width") || "400px";
            const height = container.getAttribute("data-height") || "500px";
            
            console.log("Container data - URL:", url, "Width:", width, "Height:", height);
            
            if (!url) {
                console.error("Madinah Widget: No URL specified for container " + index);
                return;
            }

            // Create iframe
            const iframe = document.createElement("iframe");
            iframe.src = url;
            iframe.width = width;
            iframe.height = height;
            iframe.frameBorder = "0";
            iframe.style.borderRadius = "8px";
            iframe.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            iframe.style.border = "none";
            iframe.style.display = "block";
            iframe.style.maxWidth = "100%";
            iframe.title = "Madinah Campaign Widget";
            iframe.setAttribute("allowtransparency", "true");
            iframe.setAttribute("scrolling", "no");
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
})();`;

  res.status(200).send(widgetScript);
}

export const config = {
  api: {
    responseLimit: false,
  },
};
