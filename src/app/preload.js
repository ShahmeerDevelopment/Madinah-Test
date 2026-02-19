/**
 * Preload critical resources for better performance
 * Used in conjunction with streaming for optimal loading
 */

// Preload hints for critical resources
export const preloadResources = [
  // Critical fonts
  {
    href: "/fonts/LeagueSpartan-VariableFont_wght.ttf",
    as: "font",
    type: "font/ttf",
    crossOrigin: "anonymous",
  },
  // Critical API endpoint (campaigns)
  {
    href: `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_API_VERSION}user/campaigns`,
    as: "fetch",
    crossOrigin: "anonymous",
  },
];

// Generate preload link elements
export function generatePreloadLinks() {
  return preloadResources.map((resource, index) => ({
    key: `preload-${index}`,
    rel: "preload",
    ...resource,
  }));
}
