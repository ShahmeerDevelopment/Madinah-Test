const fs = require("fs");
const path = require("path");

// Simple bundle size analysis script
function analyzeBundleSize() {
  const buildDir = path.join(__dirname, "..", ".next");
  
  if (!fs.existsSync(buildDir)) {
    console.log("❌ Build directory not found. Please run `npm run build` first.");
    return;
  }

  console.log("📊 Bundle Size Analysis");
  console.log("=".repeat(50));
  
  try {
    // Check if static folder exists
    const staticDir = path.join(buildDir, "static");
    if (fs.existsSync(staticDir)) {
      const chunks = path.join(staticDir, "chunks");
      if (fs.existsSync(chunks)) {
        const files = fs.readdirSync(chunks);
        
        console.log("\n📦 Main Chunks:");
        files
          .filter(file => file.endsWith(".js"))
          .map(file => {
            const filePath = path.join(chunks, file);
            const stats = fs.statSync(filePath);
            return {
              name: file,
              size: stats.size,
              sizeKB: Math.round(stats.size / 1024),
              sizeMB: (stats.size / (1024 * 1024)).toFixed(2)
            };
          })
          .sort((a, b) => b.size - a.size)
          .slice(0, 10) // Top 10 largest files
          .forEach(file => {
            console.log(`  ${file.name}: ${file.sizeKB} KB (${file.sizeMB} MB)`);
          });
      }
    }

    // Check pages folder
    const pagesDir = path.join(buildDir, "static", "chunks", "pages");
    if (fs.existsSync(pagesDir)) {
      const pageFiles = fs.readdirSync(pagesDir);
      console.log("\n📄 Page Bundles:");
      pageFiles
        .filter(file => file.endsWith(".js"))
        .map(file => {
          const filePath = path.join(pagesDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            sizeKB: Math.round(stats.size / 1024)
          };
        })
        .sort((a, b) => b.sizeKB - a.sizeKB)
        .slice(0, 5)
        .forEach(file => {
          console.log(`  ${file.name}: ${file.sizeKB} KB`);
        });
    }

  } catch (error) {
    console.error("Error analyzing bundle:", error.message);
  }
  
  console.log("\n💡 Tips:");
  console.log("  - Run `npm run analyze` to open interactive bundle analyzer");
  console.log("  - Files over 244 KB may impact performance");
  console.log("  - Consider code splitting for large components");
}

analyzeBundleSize();
