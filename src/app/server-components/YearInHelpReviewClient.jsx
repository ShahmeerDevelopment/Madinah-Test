"use client";

/**
 * Client Component - Blog Data Fetcher
 * Fetches blog post client-side since WordPress blocks server requests
 */
import { useState, useEffect } from "react";
import Image from "next/image";
import { getBlogPosts } from "@/api/blog-api-services";

// Help icon SVG
const HelpIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="40"
      height="40"
      rx="12"
      fill="url(#paint0_linear_3390_138859)"
    />
    <path
      d="M25.726 21.02L22 24H17V23H21.065C21.1554 23 21.2442 22.9754 21.3218 22.9289C21.3993 22.8824 21.4629 22.8157 21.5055 22.736C21.5482 22.6563 21.5685 22.5664 21.5642 22.4761C21.5598 22.3858 21.5311 22.2983 21.481 22.223L20.593 20.891C20.4108 20.6168 20.1636 20.392 19.8735 20.2365C19.5833 20.081 19.2592 19.9998 18.93 20H11C10.7348 20 10.4804 20.1054 10.2929 20.2929C10.1054 20.4804 10 20.7348 10 21V27C10 27.5304 10.2107 28.0391 10.5858 28.4142C10.9609 28.7893 11.4696 29 12 29H21.639C22.0666 29.0001 22.4893 28.9088 22.8787 28.7322C23.2682 28.5556 23.6153 28.2977 23.897 27.976L30 21L28.548 20.516C28.073 20.3576 27.5658 20.3208 27.0729 20.4089C26.5799 20.4969 26.1169 20.707 25.726 21.02ZM27.258 15.39C27.709 14.925 27.988 14.282 27.988 13.572C27.988 12.862 27.709 12.219 27.258 11.754C27.0299 11.516 26.7561 11.3265 26.453 11.1969C26.1498 11.0674 25.8237 11.0004 25.494 11C25.494 11 24.25 10.997 23 12.286C21.75 10.997 20.506 11 20.506 11C20.1764 11.0004 19.8504 11.0673 19.5473 11.1967C19.2442 11.3261 18.9703 11.5153 18.742 11.753C18.291 12.219 18.012 12.861 18.012 13.571C18.012 14.281 18.291 14.925 18.742 15.389L23 20L27.258 15.39Z"
      fill="#6363E6"
    />
    <defs>
      <linearGradient
        id="paint0_linear_3390_138859"
        x1="20"
        y1="0"
        x2="20"
        y2="40"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E9E9FF" />
        <stop offset="1" stopColor="#C9EEFF" />
      </linearGradient>
    </defs>
  </svg>
);

// Strip HTML tags from excerpt
function stripHtmlTags(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function YearInHelpReviewClient() {
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await getBlogPosts(1);
        if (response.data.success && response.data.data.length > 0) {
          setBlogPost(response.data.data[0]);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, []);

  // Fallback content
  const title = loading
    ? "Loading..."
    : blogPost?.title || "Latest from Madinah";
  const excerpt = loading
    ? "Please wait while we load the latest content..."
    : blogPost
      ? stripHtmlTags(blogPost.excerpt)
      : "Stay tuned for our latest updates.";
  const imageUrl =
    blogPost?.featured_image_url || "/assets/images/placeholder.png";
  const link = blogPost?.link || "https://blog.madinah.com";

  return (
    <div className="blog-container">
      {/* Left content */}
      <div className="blog-content">
        <div className="blog-header">
          <HelpIcon />
          <h2 className="blog-title">{title}</h2>
        </div>

        <p className="blog-excerpt">{excerpt}</p>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="blog-button"
          style={{
            pointerEvents: loading || error ? "none" : "auto",
            opacity: loading || error ? 0.6 : 1,
          }}
        >
          {loading ? "Loading..." : "Read more"}
        </a>
      </div>

      {/* Right image */}
      <div className="blog-image-wrapper">
        <div className="blog-image-container">
          {!loading && (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 600px) 100vw, 435px"
              style={{
                objectFit: "cover",
                borderRadius: "32px",
              }}
              unoptimized // WordPress images may come from various CDN domains
            />
          )}
          {loading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "#f5f5f5",
                borderRadius: "32px",
              }}
            />
          )}
        </div>
      </div>

      <style>{`
        .blog-container {
          display: flex;
          justify-content: space-between;
          width: 100%;
          gap: 32px;
        }
        
        .blog-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          flex: 1;
          max-width: 516px;
        }
        
        .blog-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .blog-title {
          font-family: var(--font-league-spartan);
          font-size: 32px;
          font-weight: 500;
          line-height: 38px;
          letter-spacing: -0.41px;
          color: #090909;
          margin: 0;
        }
        
        .blog-excerpt {
          color: #A1A1A8;
          font-weight: 500;
          font-size: 22px;
          line-height: 28px;
          letter-spacing: -0.41px;
          margin: 0 0 24px 0;
        }
        
        .blog-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #6363E6;
          color: white;
          border: none;
          border-radius: 48px;
          padding: 13px 24px;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
          min-width: 135px;
        }
        
        .blog-button:hover {
          background-color: #5252c9;
        }
        
        .blog-image-wrapper {
          max-width: 421px;
          width: 100%;
        }
        
        .blog-image-container {
          width: 100%;
          height: 0;
          padding-bottom: 56.25%;
          position: relative;
          border-radius: 32px;
          overflow: hidden;
          background: #f5f5f5;
        }
        
        @media (max-width: 900px) {
          .blog-container {
            flex-direction: column-reverse;
          }
          
          .blog-content {
            max-width: 100%;
          }
          
          .blog-image-wrapper {
            max-width: 100%;
            margin-bottom: 24px;
          }
          
          .blog-button {
            width: 100%;
          }
        }
        
        @media (max-width: 600px) {
          .blog-title {
            font-size: 24px;
            line-height: 28px;
          }
          
          .blog-excerpt {
            font-size: 18px;
            line-height: 24px;
          }
        }
      `}</style>
    </div>
  );
}
