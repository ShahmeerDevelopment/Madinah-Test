#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const FONTS_DIR = path.join(__dirname, "..", "public", "fonts");
const REQUIRED_FONTS = [
  "league-spartan-latin.woff2",
  "league-spartan-latin.woff",
  "noto-sans-arabic.woff2",
];

function checkFontFiles() {
  console.log("🔍 Checking font files...\n");

  if (!fs.existsSync(FONTS_DIR)) {
    console.error("❌ Fonts directory not found:", FONTS_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(FONTS_DIR);
  console.log("📁 Found font files:", files);

  let allPresent = true;

  REQUIRED_FONTS.forEach((font) => {
    const fontPath = path.join(FONTS_DIR, font);
    if (fs.existsSync(fontPath)) {
      const stats = fs.statSync(fontPath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`✅ ${font} (${sizeKB} KB)`);
    } else {
      console.log(`❌ Missing: ${font}`);
      allPresent = false;
    }
  });

  console.log("\n" + "=".repeat(50));

  if (allPresent) {
    console.log("✅ All required fonts are present!");
    console.log("🚀 Self-hosted font setup is complete.");

    // Check total font size
    const totalSize = files.reduce((total, file) => {
      const filePath = path.join(FONTS_DIR, file);
      if (fs.existsSync(filePath)) {
        return total + fs.statSync(filePath).size;
      }
      return total;
    }, 0);

    const totalSizeKB = Math.round(totalSize / 1024);
    console.log(`📊 Total font size: ${totalSizeKB} KB`);

    if (totalSizeKB > 200) {
      console.log(
        "⚠️  Font size is quite large. Consider subsetting for production."
      );
    } else {
      console.log("✅ Font size is optimized for web delivery.");
    }
  } else {
    console.log("❌ Some fonts are missing. Please run font download script.");
    process.exit(1);
  }
}

if (require.main === module) {
  checkFontFiles();
}

module.exports = { checkFontFiles };
