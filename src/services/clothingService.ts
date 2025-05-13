import axios from 'axios';

interface ClothingItem {
  id: string;
  name: string;
  category: 'upper' | 'lower' | 'shoes' | 'full';
  imageUrl: string;
  modelUrl?: string;
}

/**
 * Apply clothing items to an avatar using FASHN AI API
 * @param avatarUrl URL of the 3D avatar
 * @param clothingItems Array of clothing items to apply
 * @returns Promise resolving to the URL of the avatar with clothing applied
 */
export const applyClothing = async (
  avatarUrl: string, 
  clothingItems: ClothingItem[]
): Promise<string> => {
  try {
    const response = await axios.post('https://api.fashn.ai/v1/try-on', {
      avatarUrl,
      clothingItems: clothingItems.map(item => ({
        id: item.id,
        imageUrl: item.imageUrl,
        category: item.category
      }))
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FASHN_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.resultUrl;
  } catch (error) {
    console.error('Error applying clothing:', error);
    throw new Error('Failed to apply clothing to avatar');
  }
};

/**
 * Get detailed information about a clothing item from its image
 * @param imageUrl URL of the clothing item image
 * @returns Promise resolving to detailed information about the clothing item
 */
export const getClothingDetails = async (imageUrl: string): Promise<any> => {
  try {
    const response = await axios.post('https://api.fashn.ai/v1/analyze', {
      imageUrl
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FASHN_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing clothing:', error);
    throw new Error('Failed to analyze clothing item');
  }
};

/**
 * Get a list of recommended clothing items based on user preferences
 * @param preferences User preferences for clothing recommendations
 * @returns Promise resolving to an array of recommended clothing items
 */
export const getRecommendations = async (preferences: any): Promise<ClothingItem[]> => {
  try {
    const response = await axios.post('https://api.fashn.ai/v1/recommend', {
      preferences
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FASHN_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.recommendations;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw new Error('Failed to get clothing recommendations');
  }
}; 