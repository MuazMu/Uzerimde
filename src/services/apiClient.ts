import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

interface AvatarResponse {
  success: boolean;
  avatarUrl: string;
  message?: string;
}

interface OverlayResponse {
  success: boolean;
  resultUrl: string;
  message?: string;
}

/**
 * Generate a 3D avatar from a user's image
 */
export const generateAvatar = async (imageFile: File): Promise<AvatarResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const { data } = await apiClient.post<AvatarResponse>('/generateAvatar', formData);
    return data;
  } catch (error) {
    console.error('Error generating avatar:', error);
    return {
      success: false,
      avatarUrl: '',
      message: 'Failed to generate avatar',
    };
  }
};

/**
 * Process a 2D image overlay with clothing items
 */
export const processImageOverlay = async (
  imageFile: File,
  selectedItems: any[]
): Promise<OverlayResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('selectedItems', JSON.stringify(selectedItems));

    const { data } = await apiClient.post<OverlayResponse>('/overlay2d', formData);
    return data;
  } catch (error) {
    console.error('Error processing image overlay:', error);
    return {
      success: false,
      resultUrl: '',
      message: 'Failed to process image overlay',
    };
  }
};

/**
 * Store the user image in localStorage (for demo purposes)
 * In a real app, this would be handled differently
 */
export const storeUserImage = (imageFile: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      localStorage.setItem('userImage', dataUrl);
      resolve(dataUrl);
    };
    reader.readAsDataURL(imageFile);
  });
};

export default {
  generateAvatar,
  processImageOverlay,
  storeUserImage,
}; 