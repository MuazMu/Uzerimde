import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import axios from 'axios';

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB
  },
});

// Define response types
type OverlayResponse = {
  resultUrl: string;
  success: boolean;
  message?: string;
  landmarks?: any;
};

// Middleware to handle file uploads with NextJS API routes
const runMiddleware = (
  req: NextApiRequest & { [key: string]: any },
  res: NextApiResponse,
  fn: any
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Handle the API request
const handler = async (
  req: NextApiRequest & { [key: string]: any },
  res: NextApiResponse<OverlayResponse>
) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      resultUrl: '',
    });
  }

  try {
    // Apply multer middleware
    await runMiddleware(req, res, upload.single('image'));

    const { selectedItems } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
        resultUrl: '',
      });
    }

    if (!selectedItems) {
      return res.status(400).json({
        success: false,
        message: 'No clothing items selected',
        resultUrl: '',
      });
    }

    // Parse the selectedItems JSON if it's a string
    const clothingItems = typeof selectedItems === 'string'
      ? JSON.parse(selectedItems)
      : selectedItems;

    // Get uploaded image buffer
    const imageBuffer = req.file.buffer;
    
    // Process image
    // In a production environment, this would call a body detection service
    // Like a TensorFlow.js or MediaPipe API endpoint
    
    // 1. Detect body landmarks
    let bodyLandmarks = null;
    try {
      // This would be a call to an actual body detection API
      // For this example, we'll use a simulated API call with axios
      /*
      const bodyDetectionResponse = await axios.post(
        'https://api.uzerimde.com/detect-body-landmarks',
        {
          image: imageBuffer.toString('base64')
        }
      );
      bodyLandmarks = bodyDetectionResponse.data.landmarks;
      */
      
      // For MVP, generate simulated landmarks based on image dimensions
      const imageData = await sharp(imageBuffer).metadata();
      const { width, height } = imageData;
      
      bodyLandmarks = {
        head: { x: width! * 0.5, y: height! * 0.12 },
        neck: { x: width! * 0.5, y: height! * 0.18 },
        shoulders: {
          left: { x: width! * 0.4, y: height! * 0.22 },
          right: { x: width! * 0.6, y: height! * 0.22 }
        },
        chest: { x: width! * 0.5, y: height! * 0.3 },
        waist: { x: width! * 0.5, y: height! * 0.45 },
        hips: { x: width! * 0.5, y: height! * 0.55 },
        knees: {
          left: { x: width! * 0.45, y: height! * 0.75 },
          right: { x: width! * 0.55, y: height! * 0.75 }
        },
        ankles: {
          left: { x: width! * 0.45, y: height! * 0.95 },
          right: { x: width! * 0.55, y: height! * 0.95 }
        }
      };
    } catch (error) {
      console.error('Error detecting body landmarks:', error);
      return res.status(500).json({
        success: false,
        message: 'Error processing body detection',
        resultUrl: '',
      });
    }

    // 2. Process each clothing item with the body landmarks
    // In a production app, this would use the landmarks to correctly position the clothing
    // This processing would typically happen with a specialized image processing service
    
    // Create a unique filename for the processed image
    const timestamp = Date.now();
    const userId = req.headers['x-user-id'] || 'anonymous';
    const filename = `overlay_${userId}_${timestamp}.jpg`;
    
    // In a real production environment, we'd save the processed image to a cloud storage
    // like AWS S3 or Azure Blob Storage, and return a URL to the processed image
    
    // Simulated URL to the processed image
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://uzerimde.com';
    const resultUrl = `${baseUrl}/api/processed-images/${filename}`;

    // Return the URL to the processed image along with body landmarks
    return res.status(200).json({
      success: true,
      resultUrl,
      landmarks: bodyLandmarks,
    });
  } catch (error) {
    console.error('Error processing image overlay:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing image overlay',
      resultUrl: '',
    });
  }
};

// Disable the default body parser to allow multer to handle the form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler; 