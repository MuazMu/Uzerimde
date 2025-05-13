import type { NextApiRequest, NextApiResponse } from 'next';
import { generateAvatar } from '@/services/avatarService';
import { applyClothing } from '@/services/clothingService';
import { estimateBodyMeasurements, getSizeRecommendation } from '@/services/sizeEstimationService';
import axios from 'axios';

type TryOnRequest = {
  userImageUrl: string;
  clothingItems: Array<{
    id: string;
    category: 'upper' | 'lower' | 'shoes' | 'full';
    imageUrl: string;
  }>;
  callbackUrl?: string;
  includeBodyMeasurements?: boolean;
  includeSizeRecommendations?: boolean;
};

type TryOnResponse = {
  requestId?: string;
  status: 'processing' | 'completed' | 'failed';
  message: string;
  avatarUrl?: string;
  clothedAvatarUrl?: string;
  bodyMeasurements?: any;
  sizeRecommendations?: any;
  error?: string;
};

/**
 * API endpoint for virtual try-on integration with e-commerce platforms
 * @param req The request object
 * @param res The response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TryOnResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      status: 'failed',
      message: 'Method not allowed'
    });
  }
  
  const { 
    userImageUrl, 
    clothingItems, 
    callbackUrl,
    includeBodyMeasurements = false,
    includeSizeRecommendations = false
  } = req.body as TryOnRequest;
  
  // Validate request parameters
  if (!userImageUrl || !clothingItems || !Array.isArray(clothingItems)) {
    return res.status(400).json({ 
      status: 'failed',
      message: 'Missing or invalid required parameters'
    });
  }
  
  // Generate a unique request ID
  const requestId = `tryon-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  
  // Return an immediate response to indicate that the request is being processed
  res.status(202).json({ 
    requestId,
    status: 'processing',
    message: 'Processing try-on request'
  });
  
  // Process the try-on request asynchronously
  try {
    // Fetch the user image
    const userImageResponse = await axios.get(userImageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(userImageResponse.data, 'binary');
    const blob = new Blob([buffer]);
    const userImageFile = new File([blob], 'user-image.jpg', { type: 'image/jpeg' });
    
    // Generate 3D avatar
    const avatarUrl = await generateAvatar(userImageFile);
    
    // Estimate body measurements if requested
    let bodyMeasurements;
    if (includeBodyMeasurements) {
      bodyMeasurements = await estimateBodyMeasurements(userImageFile);
    }
    
    // Generate size recommendations if requested
    let sizeRecommendations = {};
    if (includeSizeRecommendations && bodyMeasurements) {
      for (const item of clothingItems) {
        const recommendation = await getSizeRecommendation(bodyMeasurements, item.id);
        sizeRecommendations[item.id] = recommendation;
      }
    }
    
    // Apply clothing items to avatar
    const clothedAvatarUrl = await applyClothing(avatarUrl, clothingItems);
    
    // Prepare the result
    const result: TryOnResponse = {
      requestId,
      status: 'completed',
      message: 'Try-on completed successfully',
      avatarUrl,
      clothedAvatarUrl,
      bodyMeasurements: includeBodyMeasurements ? bodyMeasurements : undefined,
      sizeRecommendations: includeSizeRecommendations ? sizeRecommendations : undefined
    };
    
    // Notify the callback URL if provided
    if (callbackUrl) {
      try {
        await axios.post(callbackUrl, result);
      } catch (callbackError) {
        console.error('Error notifying callback URL:', callbackError);
      }
    }
    
    // Store the result in a database or cache for later retrieval
    // This is not implemented here, but would be necessary in a production environment
    
  } catch (error) {
    console.error('Error processing try-on request:', error);
    
    // Prepare error result
    const errorResult: TryOnResponse = {
      requestId,
      status: 'failed',
      message: 'Error processing try-on request',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    // Notify the callback URL of the failure if provided
    if (callbackUrl) {
      try {
        await axios.post(callbackUrl, errorResult);
      } catch (callbackError) {
        console.error('Error notifying callback URL:', callbackError);
      }
    }
  }
}

// Increase the body size limit for the API route to handle large images
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}; 