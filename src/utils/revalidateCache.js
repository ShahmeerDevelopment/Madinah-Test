/**
 * Utility function to revalidate Next.js cache tags
 * Used after campaign updates to ensure fresh data is served
 */

/**
 * Revalidate campaign cache by slug or ID
 * @param {string} campaignSlugOrId - Campaign slug or ID
 * @returns {Promise<boolean>} - Returns true if successful
 */
export async function revalidateCampaignCache(campaignSlugOrId) {
  
  if (!campaignSlugOrId) {
    console.error('[Revalidate] Campaign slug or ID is required for cache revalidation');
    return false;
  }

  try {
    const secret = process.env.NEXT_PUBLIC_REVALIDATION_SECRET;
    
    if (!secret) {
      return false;
    }

    // Revalidate specific campaign tag
    const campaignTag = `campaign-${campaignSlugOrId}`;
    const url = `/api/revalidate?tag=${campaignTag}&secret=${secret}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });


    if (!response.ok) {
      const error = await response.json();
      console.error('[Revalidate] Cache revalidation failed:', error);
      return false;
    }

    const result = await response.json();
    return true;
  } catch (error) {
    console.error('[Revalidate] Error revalidating cache:', error);
    return false;
  }
}

/**
 * Revalidate multiple campaign-related cache tags
 * @param {string} campaignSlugOrId - Campaign slug or ID
 * @param {string[]} additionalTags - Additional tags to revalidate (e.g., ['supporters', 'campaign-updates'])
 * @returns {Promise<boolean>} - Returns true if all successful
 */
export async function revalidateMultipleTags(campaignSlugOrId, additionalTags = []) {
  const secret = process.env.NEXT_PUBLIC_REVALIDATION_SECRET;
  
  if (!secret) {
    console.error('REVALIDATION_SECRET is not configured');
    return false;
  }

  const tags = [
    `campaign-${campaignSlugOrId}`,
    ...additionalTags.map(tag => tag.includes('{id}') ? tag.replace('{id}', campaignSlugOrId) : tag)
  ];

  try {
    const results = await Promise.all(
      tags.map(async (tag) => {
        const url = `/api/revalidate?tag=${tag}&secret=${secret}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return response.ok;
      })
    );

    const allSuccessful = results.every(result => result);
    return allSuccessful;
  } catch (error) {
    console.error('Error revalidating multiple tags:', error);
    return false;
  }
}
