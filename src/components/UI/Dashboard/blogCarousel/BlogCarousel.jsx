"use client";

import React, { useState, useEffect } from "react";
import { CarouselWrapper } from "../Dashboard.style";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import CardWithImage from "@/components/molecules/card/CardWithImage";
import SlickCarousel from "@/components/molecules/carousel/SlickCarousel";
import { getBlogPosts } from "@/api/blog-api-services";

const BlogCarousel = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const response = await getBlogPosts(4); // Fetch 4 posts

        if (response.data.success) {
          setBlogPosts(response.data.data);
          setError(null);
        } else {
          throw new Error(response.data.message);
        }
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load blog posts");
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div>
      <CarouselWrapper isCustom={true}>
        <TypographyComp
          align="left"
          sx={{
            fontWeight: 500,
            fontSize: "22px",
            lineHeight: "28px",
            mb: -3.5,
          }}
        >
          Our experts are here
        </TypographyComp>
        <SlickCarousel slidesToShow={3}>
          {loading ? (
            // Show loading placeholders
            Array.from({ length: 4 }).map((_, index) => (
              <CardWithImage
                key={`loading-${index}`}
                heading="Loading..."
                title="Loading..."
                image=""
              />
            ))
          ) : error ? (
            // Show error state
            <CardWithImage
              heading="Error loading posts"
              title="Please try again later"
              image=""
            />
          ) : blogPosts.length > 0 ? (
            // Show actual blog posts
            blogPosts.map((post) => (
              <CardWithImage
                key={post.id}
                heading={post.title}
                title={post.reading_time}
                image={post.featured_image_url}
                onClick={() => {
                  if (post.link) {
                    window.open(post.link, "_blank");
                  }
                }}
              />
            ))
          ) : (
            // Show no posts message
            <CardWithImage
              heading="No blog posts available"
              title="Check back later"
              image=""
            />
          )}
        </SlickCarousel>
      </CarouselWrapper>
    </div>
  );
};

export default BlogCarousel;
