# LCP (Largest Contentful Paint) Optimization Guide

## Overview
Your LCP is being driven by campaign cover images. This guide provides solutions to optimize LCP performance.

## Current Issue
- **LCP Element**: Campaign cover images from S3 buckets
- **Current LCP**: Over 2.5s (target: under 2.5s)
- **Primary Issue**: Images are not being preloaded, causing delayed fetch

## Solutions Implemented

### 1. Document-Level Optimizations (`_document.js`)
```javascript
// Added preconnect to development S3 bucket
<link rel="preconnect" href="https://madinah-development.s3.us-east-1.amazonaws.com" />

// Added preconnect to Next.js image optimization
<link rel="preconnect" href="/_next/image" />

// Added DNS prefetch for faster domain resolution
<link rel="dns-prefetch" href="https://madinah-development.s3.us-east-1.amazonaws.com" />

// Added preload for image optimization service
<link rel="preload" as="fetch" href="/_next/image" crossOrigin="anonymous" />
```

### 2. Dynamic LCP Image Optimization (`LCPImageOptimizer.js`)
Created a component that:
- Preloads critical images with high priority
- Generates optimized image URLs for different screen sizes
- Adds proper `fetchpriority` and `importance` attributes
- Prevents duplicate preload links

### 3. Usage in Components

#### For Campaign Detail Pages:
```javascript
import { LCPImageOptimizer } from "@/components/performance/LCPImageOptimizer";

// In your component
<LCPImageOptimizer 
  campaignImage={campaign?.coverImage}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
  fetchPriority="high"
/>

<Image
  src={campaign?.coverImage}
  alt={campaign?.title}
  width={1200}
  height={800}
  priority={true}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
/>
```

#### For Campaign Cards:
```javascript
import { useLCPImageOptimization } from "@/components/performance/LCPImageOptimizer";

const CampaignCard = ({ campaign }) => {
  useLCPImageOptimization(campaign?.coverImage);
  
  return (
    <Image
      src={campaign?.coverImage}
      alt={campaign?.title}
      width={400}
      height={300}
      priority={true}
      sizes="(max-width: 768px) 100vw, 400px"
    />
  );
};
```

### 4. Next.js Image Optimization (Already Configured)
Your `next.config.mjs` already has good settings:
- Modern image formats (AVIF, WebP)
- Proper device sizes
- Responsive image sizes
- Optimized caching

## Implementation Steps

### Step 1: Identify LCP Elements
1. Check which pages have campaign images as LCP elements
2. Common pages: Home, Campaign Detail, Campaign Listing

### Step 2: Add LCP Optimization
```javascript
// In pages with campaign images
import { LCPImageOptimizer } from "@/components/performance/LCPImageOptimizer";

// Add before the main image
<LCPImageOptimizer campaignImage={imageUrl} />
```

### Step 3: Update Image Components
```javascript
// Always use priority={true} for above-the-fold images
<Image
  src={imageUrl}
  priority={true}
  sizes="(max-width: 768px) 100vw, ..."
  fetchPriority="high"
/>
```

### Step 4: Monitor Performance
- Use Lighthouse to check LCP improvements
- Monitor Core Web Vitals in production
- Test on different devices and connections

## Best Practices

### 1. Image Sizing
- Use appropriate `sizes` attribute
- Match image dimensions to display size
- Use responsive images

### 2. Priority Loading
- Only mark above-the-fold images as `priority={true}`
- Use `fetchPriority="high"` for LCP candidates
- Limit the number of priority images per page

### 3. Preloading Strategy
- Preload only the most critical images
- Use different priorities for different image types
- Avoid preloading too many images (causes congestion)

### 4. Image Optimization
- Use Next.js Image component for automatic optimization
- Serve modern formats (AVIF, WebP)
- Use appropriate quality settings

## Monitoring

### 1. Development
```javascript
// Add to _app.js for development monitoring
if (process.env.NODE_ENV === "development") {
  new PerformanceObserver((list) => {
    const lcpEntries = list.getEntries();
    lcpEntries.forEach((entry) => {
      console.log("LCP:", entry.startTime, entry.element);
    });
  }).observe({ entryTypes: ["largest-contentful-paint"] });
}
```

### 2. Production
- Use Google Analytics or similar for Core Web Vitals
- Monitor LCP scores in PageSpeed Insights
- Set up alerts for performance regressions

## Expected Results
- **LCP Reduction**: 20-40% improvement
- **Target**: Under 2.5s for LCP
- **User Experience**: Faster perceived loading
- **SEO**: Better Core Web Vitals scores

## Additional Optimizations

### 1. Image Loading Strategy
```javascript
// Prioritize above-the-fold images
<Image priority={true} />

// Lazy load below-the-fold images
<Image loading="lazy" />
```

### 2. Placeholder Strategy
```javascript
// Use blur placeholders for better UX
<Image
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 3. Progressive Loading
```javascript
// Load different quality images progressively
const [imageLoaded, setImageLoaded] = useState(false);

<Image
  src={imageLoaded ? highQualityUrl : lowQualityUrl}
  onLoadingComplete={() => setImageLoaded(true)}
/>
```
