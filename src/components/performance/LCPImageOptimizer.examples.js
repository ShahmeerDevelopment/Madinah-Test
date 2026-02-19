/**
 * Usage examples for LCP Image Optimization
 */

import Image from "next/image";
import { LCPImageOptimizer, useLCPImageOptimization } from "@/components/performance/LCPImageOptimizer";

// Example 1: Using the LCPImageOptimizer component
export const CampaignHero = ({ campaign }) => {
  const campaignImageUrl = campaign?.coverImage || campaign?.images?.[0];

  return (
    <div>
      {/* Add LCP optimizer for the main campaign image */}
      <LCPImageOptimizer 
        campaignImage={campaignImageUrl}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        fetchPriority="high"
      />
      
      {/* Your main campaign image */}
      <Image
        src={campaignImageUrl}
        alt={campaign?.title || "Campaign image"}
        width={1200}
        height={800}
        priority={true} // Mark as priority for LCP
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </div>
  );
};

// Example 2: Using the hook for custom optimization
export const CampaignCard = ({ campaign }) => {
  const imageUrl = campaign?.coverImage;
  
  // Use the hook to optimize this image
  useLCPImageOptimization(imageUrl);

  return (
    <div>
      <Image
        src={imageUrl}
        alt={campaign?.title}
        width={400}
        height={300}
        priority={true} // If this is above the fold
        sizes="(max-width: 768px) 100vw, 400px"
      />
    </div>
  );
};

// Example 3: For campaign detail pages
export const CampaignDetailPage = ({ campaign }) => {
  const mainImageUrl = campaign?.coverImage;
  const additionalImages = campaign?.images || [];

  return (
    <div>
      {/* Optimize the main LCP image */}
      <LCPImageOptimizer 
        campaignImage={mainImageUrl}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        fetchPriority="high"
      />
      
      {/* Main campaign image with high priority */}
      <Image
        src={mainImageUrl}
        alt={campaign?.title}
        width={1200}
        height={800}
        priority={true}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
      
      {/* Additional images without priority */}
      {additionalImages.map((imageUrl, index) => (
        <Image
          key={index}
          src={imageUrl}
          alt={`${campaign?.title} - Image ${index + 1}`}
          width={600}
          height={400}
          priority={false}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      ))}
    </div>
  );
};
