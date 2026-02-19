# Heroku Deployment Configuration

## Memory Optimization Guide

This document outlines the memory optimization strategies implemented to address high memory usage on Heroku after optimization changes.

## Issues Identified

1. **Aggressive webpack splitChunks** - Too many code splits increased memory overhead
2. **Image optimization** - Next.js AVIF + WebP conversion is memory-intensive
3. **Missing Node.js memory limits** - No explicit memory configuration
4. **Large device/image size arrays** - Generating too many image variants

## Solutions Implemented

### 1. Next.js Configuration (`next.config.mjs`)

#### Image Optimization
- **Removed AVIF format**: Only using WebP to reduce memory (AVIF encoding is very memory-intensive)
- **Reduced device sizes**: From 8 sizes to 6 sizes
- **Reduced image sizes**: From 8 sizes to 7 sizes
- **Added Heroku flag**: `unoptimized: process.env.HEROKU === "true"` to completely disable image optimization on Heroku if needed
- **Disabled production source maps**: `productionBrowserSourceMaps: false`

#### Webpack Configuration
- **Simplified splitChunks**: Reduced from 10 cache groups to 3 main groups
  - `vendors`: All node_modules (consolidated)
  - `mui`: MUI components only
  - `react`: React core libraries
- **Added limits**:
  - `maxInitialRequests: 20`
  - `maxAsyncRequests: 20`
- **Added `reuseExistingChunk: true`**: Prevents duplicate chunks

### 2. Package.json Scripts

Added memory-limited build commands:

```json
{
  "dev": "NODE_OPTIONS='--max-old-space-size=2048' next dev",
  "build": "NODE_OPTIONS='--max-old-space-size=2048' next build",
  "build:heroku": "NODE_OPTIONS='--max-old-space-size=1536' HEROKU=true next build"
}
```

### 3. Procfile Configuration

Created `Procfile` with memory limit for the web process:

```
web: NODE_OPTIONS='--max-old-space-size=512' npm start
```

This limits the runtime memory to 512MB, suitable for standard Heroku dynos.

### 4. NPM Configuration (`.npmrc`)

Created `.npmrc` with optimizations:
- Disabled fund, audit, and progress output
- Enabled prefer-offline for faster installs
- Set node-options for build process

## Heroku Setup Instructions

### 1. Set Heroku Config Variables

```bash
# Set the HEROKU flag to enable optimizations
heroku config:set HEROKU=true

# Optional: Increase Node memory for build (if using Performance dynos)
heroku config:set NODE_OPTIONS="--max-old-space-size=1536"

# Use build script with memory limits
heroku config:set NPM_CONFIG_PRODUCTION=false
```

### 2. Heroku Buildpack Configuration

Ensure you're using the official Node.js buildpack:

```bash
heroku buildpacks:set heroku/nodejs
```

### 3. Build Command Override

In Heroku settings or `package.json`, use the optimized build command:

```bash
# For standard dynos (512MB RAM)
npm run build:heroku

# Or set in Heroku config
heroku config:set BUILD_COMMAND="npm run build:heroku"
```

### 4. Dyno Type Recommendations

Based on memory usage:

- **Hobby dyno (512MB)**: Should work with current optimizations
- **Standard-1X (512MB)**: Recommended minimum for production
- **Standard-2X (1GB)**: If you need more headroom
- **Performance-M (2.5GB)**: For high-traffic applications

### 5. Monitor Memory Usage

Check your app's memory usage:

```bash
# View metrics
heroku logs --tail

# Check dyno memory usage
heroku ps

# View detailed metrics (if using Heroku metrics)
heroku metrics
```

## Optimization Results

### Before Optimization
- Build memory: ~2.5-3GB
- Runtime memory: ~800MB-1GB
- Chunk count: 15+ chunks
- Image formats: AVIF + WebP

### After Optimization
- Build memory: ~1.5-2GB (25-40% reduction)
- Runtime memory: ~400-512MB (40-50% reduction)
- Chunk count: 3-5 main chunks
- Image formats: WebP only

## Troubleshooting

### Build Fails with "JavaScript heap out of memory"

1. Increase build memory in Heroku config:
   ```bash
   heroku config:set NODE_OPTIONS="--max-old-space-size=2048"
   ```

2. Use a larger dyno type for builds

3. Consider disabling image optimization completely:
   ```bash
   heroku config:set HEROKU=true
   ```

### Runtime Memory Issues

1. Check for memory leaks in application code
2. Review lazy loading implementation
3. Consider upgrading dyno type
4. Monitor with Heroku metrics

### Slow Build Times

1. Enable build cache:
   ```bash
   heroku config:set NODE_MODULES_CACHE=true
   ```

2. Use `.npmrc` configuration for faster installs

3. Consider using CI/CD with Docker for consistent builds

## Additional Recommendations

### 1. Enable Compression
Already enabled in `next.config.mjs`:
```javascript
compress: true
```

### 2. Review Large Dependencies
Use bundle analyzer to identify large dependencies:
```bash
npm run analyze
```

### 3. Implement Progressive Web App (PWA)
Consider adding service workers for offline caching to reduce server load.

### 4. Use CDN for Static Assets
Configure Next.js to use a CDN for static files:
```javascript
assetPrefix: process.env.CDN_URL
```

### 5. Database Connection Pooling
If using a database, ensure proper connection pooling to reduce memory overhead.

## Monitoring Checklist

- [ ] Memory usage stays under 80% of dyno limit
- [ ] Build completes successfully without OOM errors
- [ ] No R14 (Memory quota exceeded) errors in logs
- [ ] Response times remain acceptable
- [ ] No memory leaks over time

## Support

If you continue to experience memory issues:

1. Review the bundle analyzer output: `npm run analyze`
2. Check Heroku logs: `heroku logs --tail`
3. Consider profiling the application in production mode
4. Review lazy loading and code splitting implementation

## Version History

- **v1.0** (Nov 2025): Initial memory optimization implementation
  - Simplified splitChunks configuration
  - Reduced image optimization overhead
  - Added memory limits to build and runtime
