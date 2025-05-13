import axios from 'axios';

/**
 * Generate a 3D avatar from a 2D image using Avaturn API
 * @param imageFile The user's image file
 * @returns Promise resolving to the URL of the generated avatar
 */
export const generateAvatar = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    const response = await axios.post('https://api.avaturn.me/v1/generate', formData, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AVATURN_API_KEY}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.avatarUrl;
  } catch (error) {
    console.error('Error generating avatar:', error);
    throw new Error('Failed to generate 3D avatar');
  }
};

/**
 * Get the status of an avatar generation job
 * @param jobId The ID of the avatar generation job
 * @returns Promise resolving to the status of the job
 */
export const getAvatarStatus = async (jobId: string): Promise<any> => {
  try {
    const response = await axios.get(`https://api.avaturn.me/v1/status/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AVATURN_API_KEY}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking avatar status:', error);
    throw new Error('Failed to check avatar status');
  }
};

/**
 * Customize avatar parameters (facial features, body shape, etc.)
 * @param avatarUrl URL of the generated avatar
 * @param customizations Object containing customization parameters
 * @returns Promise resolving to the URL of the customized avatar
 */
export const customizeAvatar = async (avatarUrl: string, customizations: any): Promise<string> => {
  try {
    const response = await axios.post('https://api.avaturn.me/v1/customize', {
      avatarUrl,
      customizations
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AVATURN_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.avatarUrl;
  } catch (error) {
    console.error('Error customizing avatar:', error);
    throw new Error('Failed to customize avatar');
  }
}; 