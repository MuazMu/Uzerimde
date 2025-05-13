import axios from 'axios';

/**
 * Body measurements interface
 */
export interface BodyMeasurements {
  height: number;
  chest: number;
  waist: number;
  hips: number;
  shoulders: number;
  inseam: number;
  neckCircumference: number;
  armLength: number;
  thighCircumference: number;
  calfCircumference: number;
  ankleCircumference: number;
  // Additional measurements as needed
}

/**
 * Size recommendation interface
 */
export interface SizeRecommendation {
  upperSize: string;
  lowerSize: string;
  shoeSize: string;
  fit: 'tight' | 'regular' | 'loose';
  confidence: number;
  brandSpecific?: {
    [brandName: string]: {
      upperSize: string;
      lowerSize: string;
    }
  };
}

/**
 * Estimate body measurements from an image
 * @param imageFile The user's image file
 * @returns Promise resolving to the user's body measurements
 */
export const estimateBodyMeasurements = async (imageFile: File): Promise<BodyMeasurements> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    const response = await axios.post('https://api.sizer.me/v1/measurements', formData, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SIZER_API_KEY}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.measurements;
  } catch (error) {
    console.error('Error estimating measurements:', error);
    throw new Error('Failed to estimate body measurements');
  }
};

/**
 * Get size recommendations based on body measurements
 * @param measurements The user's body measurements
 * @param productId The ID of the product to get size recommendations for
 * @returns Promise resolving to size recommendations
 */
export const getSizeRecommendation = async (
  measurements: BodyMeasurements, 
  productId: string
): Promise<SizeRecommendation> => {
  try {
    const response = await axios.post('https://api.sizer.me/v1/recommendations', {
      measurements,
      productId
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SIZER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.recommendation;
  } catch (error) {
    console.error('Error getting size recommendation:', error);
    throw new Error('Failed to get size recommendation');
  }
};

/**
 * Get size recommendations for multiple products
 * @param measurements The user's body measurements
 * @param productIds Array of product IDs to get size recommendations for
 * @returns Promise resolving to size recommendations for each product
 */
export const getBatchSizeRecommendations = async (
  measurements: BodyMeasurements,
  productIds: string[]
): Promise<{[productId: string]: SizeRecommendation}> => {
  try {
    const response = await axios.post('https://api.sizer.me/v1/batch-recommendations', {
      measurements,
      productIds
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SIZER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.recommendations;
  } catch (error) {
    console.error('Error getting batch size recommendations:', error);
    throw new Error('Failed to get batch size recommendations');
  }
}; 