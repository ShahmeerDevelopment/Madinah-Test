const BLOG_API_URL = "https://blog.madinah.com/wp-json/wp/v2";

/**
 * Helper function to extract featured image URL from post data
 * @param {Object} post - The blog post object
 * @returns {string} - The featured image URL or empty string
 */
const getFeaturedImageUrl = (post) => {
  // Try to get image from _embedded object
  if (post._embedded && post._embedded["wp:featuredmedia"] && post._embedded["wp:featuredmedia"].length > 0) {
    const media = post._embedded["wp:featuredmedia"][0];
    
    // Prefer medium_large size for better quality and performance
    if (media.media_details && media.media_details.sizes) {
      if (media.media_details.sizes.medium_large) {
        return media.media_details.sizes.medium_large.source_url;
      }
      if (media.media_details.sizes.large) {
        return media.media_details.sizes.large.source_url;
      }
      if (media.media_details.sizes.medium) {
        return media.media_details.sizes.medium.source_url;
      }
      if (media.media_details.sizes.full) {
        return media.media_details.sizes.full.source_url;
      }
    }
    
    // Fallback to source_url if sizes not available
    return media.source_url || "";
  }
  
  return "";
};

/**
 * Fetch blog posts from Madinah blog API
 * @param {number} perPage - Number of posts to fetch (default: 5)
 * @returns {Promise} - Promise that resolves to blog posts data
 */
export const getBlogPosts = async (perPage = 5) => {
  try {
    // Add _embed parameter to include featured media in the response
    const response = await fetch(`${BLOG_API_URL}/posts?per_page=${perPage}&_embed`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to only include the fields we need
    const transformedData = data.map((post) => ({
      id: post.id,
      title: post.title?.rendered || "",
      featured_image_url: getFeaturedImageUrl(post),
      reading_time: post.yoast_head_json?.twitter_misc?.["Est. reading time"] || "5 min read",
      link: post.link || "",
      excerpt: post.excerpt?.rendered || "",
      date: post.date || "",
    }));

    return {
      status: 200,
      data: {
        success: true,
        data: transformedData,
      },
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return {
      status: 500,
      data: {
        success: false,
        message: error.message || "Failed to fetch blog posts",
      },
    };
  }
};

/**
 * Fetch a single blog post by ID
 * @param {number} postId - The ID of the blog post to fetch
 * @returns {Promise} - Promise that resolves to blog post data
 */
export const getBlogPost = async (postId) => {
  try {
    // Add _embed parameter to include featured media in the response
    const response = await fetch(`${BLOG_API_URL}/posts/${postId}?_embed`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const post = await response.json();

    // Transform the data to only include the fields we need
    const transformedData = {
      id: post.id,
      title: post.title?.rendered || "",
      content: post.content?.rendered || "",
      featured_image_url: getFeaturedImageUrl(post),
      reading_time: post.yoast_head_json?.twitter_misc?.["Est. reading time"] || "5 min read",
      link: post.link || "",
      excerpt: post.excerpt?.rendered || "",
      date: post.date || "",
    };

    return {
      status: 200,
      data: {
        success: true,
        data: transformedData,
      },
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return {
      status: 500,
      data: {
        success: false,
        message: error.message || "Failed to fetch blog post",
      },
    };
  }
};
