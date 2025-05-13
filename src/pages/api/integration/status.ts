import type { NextApiRequest, NextApiResponse } from 'next';

type StatusResponse = {
  requestId: string;
  status: 'processing' | 'completed' | 'failed';
  message: string;
  avatarUrl?: string;
  clothedAvatarUrl?: string;
  bodyMeasurements?: any;
  sizeRecommendations?: any;
  error?: string;
  progress?: number;
};

/**
 * API endpoint for checking the status of try-on requests
 * @param req The request object
 * @param res The response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatusResponse | { error: string }>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { requestId } = req.query;
  
  // Validate request parameters
  if (!requestId || typeof requestId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid request ID' });
  }
  
  // In a real implementation, you would retrieve the status from a database or cache
  // For demonstration purposes, we'll return a simulated status
  
  // Simulate a 50% chance of the request being completed and 50% still processing
  const isComplete = Math.random() > 0.5;
  
  if (isComplete) {
    return res.status(200).json({
      requestId,
      status: 'completed',
      message: 'Try-on completed successfully',
      avatarUrl: `https://example.com/avatars/${requestId}.glb`,
      clothedAvatarUrl: `https://example.com/clothed-avatars/${requestId}.glb`,
      bodyMeasurements: {
        height: 175,
        chest: 95,
        waist: 82,
        hips: 98,
        shoulders: 45,
        inseam: 82
      },
      sizeRecommendations: {
        'item-123': {
          upperSize: 'M',
          lowerSize: 'L',
          shoeSize: '',
          fit: 'regular',
          confidence: 0.85
        }
      }
    });
  } else {
    return res.status(200).json({
      requestId,
      status: 'processing',
      message: 'Processing try-on request',
      progress: Math.floor(Math.random() * 100) // Random progress between 0 and 99
    });
  }
} 