#!/usr/bin/env node

/**
 * Memory Diagnostic Script
 * Checks for potential memory issues in the Next.js build
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for Memory Issues...\n');

// Check Node version
const nodeVersion = process.version;
console.log(`✓ Node Version: ${nodeVersion}`);

// Check available memory
const totalMemory = Math.round(require('os').totalmem() / 1024 / 1024);
const freeMemory = Math.round(require('os').freemem() / 1024 / 1024);
console.log(`✓ Total Memory: ${totalMemory}MB`);
console.log(`✓ Free Memory: ${freeMemory}MB`);

// Check if .next directory exists
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  console.log('\n📦 Build Directory Found (.next)');
  
  // Calculate build size
  const getDirectorySize = (dir) => {
    let size = 0;
    try {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          size += getDirectorySize(filePath);
        } else {
          size += stats.size;
        }
      });
    } catch (error) {
      // Ignore errors
    }
    return size;
  };
  
  const buildSize = getDirectorySize(nextDir);
  const buildSizeMB = Math.round(buildSize / 1024 / 1024);
  console.log(`  Build Size: ${buildSizeMB}MB`);
  
  if (buildSizeMB > 300) {
    console.log('  ⚠️  WARNING: Build size is very large. Consider optimizing.');
  }
} else {
  console.log('\n📦 No build directory found. Run "npm run build" first.');
}

// Check package.json for memory settings
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  console.log('\n⚙️  Build Scripts:');
  if (packageJson.scripts) {
    const buildScript = packageJson.scripts.build || 'Not found';
    console.log(`  build: ${buildScript}`);
    
    if (!buildScript.includes('max-old-space-size')) {
      console.log('  ⚠️  WARNING: No memory limit set in build script');
      console.log('  💡 Consider adding NODE_OPTIONS="--max-old-space-size=2048"');
    }
  }
}

// Check for .npmrc
const npmrcPath = path.join(process.cwd(), '.npmrc');
if (fs.existsSync(npmrcPath)) {
  console.log('\n✓ .npmrc found');
} else {
  console.log('\n⚠️  No .npmrc found. Consider creating one for npm optimization.');
}

// Check for Procfile
const procfilePath = path.join(process.cwd(), 'Procfile');
if (fs.existsSync(procfilePath)) {
  console.log('✓ Procfile found');
  const procfileContent = fs.readFileSync(procfilePath, 'utf8');
  console.log(`  Content: ${procfileContent.trim()}`);
} else {
  console.log('⚠️  No Procfile found. Create one for Heroku deployment.');
}

// Check next.config.mjs
const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
if (fs.existsSync(nextConfigPath)) {
  const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  
  console.log('\n📋 Next.js Configuration:');
  
  // Check image optimization
  if (nextConfig.includes('image/avif')) {
    console.log('  ⚠️  AVIF format enabled (memory intensive)');
  }
  
  // Check source maps
  if (nextConfig.includes('productionBrowserSourceMaps: false')) {
    console.log('  ✓ Production source maps disabled');
  } else {
    console.log('  ⚠️  Production source maps may be enabled (increases memory)');
  }
  
  // Check splitChunks
  const splitChunksCount = (nextConfig.match(/test:/g) || []).length;
  console.log(`  Cache Groups: ~${splitChunksCount} detected`);
  
  if (splitChunksCount > 5) {
    console.log('  ⚠️  Too many cache groups may increase memory usage');
  }
}

// Recommendations
console.log('\n💡 Recommendations:');
console.log('  1. Use "npm run build:heroku" for Heroku deployments');
console.log('  2. Monitor memory with: heroku logs --tail');
console.log('  3. If OOM errors persist, upgrade dyno or disable image optimization');
console.log('  4. Use "npm run analyze" to check bundle sizes');

console.log('\n✅ Memory diagnostic complete!\n');
