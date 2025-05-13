import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';
import axios from 'axios';

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB
  },
});

// Define response types
type AvatarResponse = {
  avatarUrl: string;
  success: boolean;
  message?: string;
  avatarId?: string;
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
  res: NextApiResponse<AvatarResponse>
) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      avatarUrl: '',
    });
  }

  try {
    // Apply multer middleware
    await runMiddleware(req, res, upload.single('image'));

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
        avatarUrl: '',
      });
    }

    // Get user information
    const userId = req.headers['x-user-id'] || `user_${Date.now()}`;
    
    // Generate an avatar from the uploaded image
    // In a production environment, we would:
    // 1. Upload the image to Ready Player Me API or our own avatar generation service
    // 2. Process the result and generate a 3D avatar
    
    // Get the image buffer
    const imageBuffer = req.file.buffer;
    const imageBase64 = imageBuffer.toString('base64');
    
    let avatarUrl = '';
    let avatarId = '';
    
    try {
      // This would be a call to the Ready Player Me API or similar service
      // For demonstration, we're showing what the API call would look like
      /*
      const avatarApiResponse = await axios.post(
        'https://api.readyplayer.me/v1/avatars',
        {
          image: imageBase64,
          user_id: userId,
          options: {
            selfie_mode: true,
            mesh_type: 'fullbody',
            texture_size: 1024,
            lod: 0
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.RPM_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      avatarUrl = avatarApiResponse.data.avatar_url;
      avatarId = avatarApiResponse.data.avatar_id;
      */
      
      // For MVP, we'll simulate the API response with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Generate a simulated avatar URL
      // In a real implementation, we would get this from the API response
      avatarId = `avatar_${userId}_${Date.now()}`;
      
      // Normally this would be a URL to the avatar on the Ready Player Me CDN
      // For demo purposes, we're using a local file
      avatarUrl = '/models/avatars/standard-male-fullbody.glb';
      
      // Consider the user's gender if provided in the request
      const userGender = req.body.gender || 'neutral';
      if (userGender === 'female') {
        avatarUrl = '/models/avatars/standard-female-fullbody.glb';
      }
      
      // Log avatar creation
      console.log(`Generated avatar ${avatarId} for user ${userId}`);
    } catch (error) {
      console.error('Error calling avatar API:', error);
      return res.status(500).json({
        success: false,
        message: 'Error generating avatar with external API',
        avatarUrl: '',
      });
    }

    return res.status(200).json({
      success: true,
      avatarUrl,
      avatarId,
    });
  } catch (error) {
    console.error('Error generating avatar:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating avatar',
      avatarUrl: '',
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