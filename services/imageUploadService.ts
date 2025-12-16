import { supabase } from './supabase'; // Assuming supabase client is exported from supabase.ts

export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

interface UploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Validates image file before upload
 */
function validateImageFile(
  file: File,
  options: UploadOptions = {}
): { valid: boolean; error?: string } {
  const maxSize = (options.maxSizeMB || DEFAULT_MAX_SIZE_MB) * 1024 * 1024;
  const allowedTypes = options.allowedTypes || DEFAULT_ALLOWED_TYPES;

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${options.maxSizeMB || DEFAULT_MAX_SIZE_MB}MB limit`,
    };
  }

  return { valid: true };
}

/**
 * Generates unique filename with timestamp
 */
function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${random}.${extension}`;
}

/**
 * Upload chef profile or cover image
 */
export async function uploadChefImage(
  file: File,
  type: 'profile' | 'cover',
  chefId?: string
): Promise<ImageUploadResponse> {
  try {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    const fileName = generateFileName(file.name);
    const folder = `chefs/${type}`;
    const filePath = `${folder}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return {
        success: false,
        error: `Upload failed: ${error.message}`,
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('images').getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Upload product/meal image
 */
export async function uploadProductImage(
  file: File
): Promise<ImageUploadResponse> {
  try {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    const fileName = generateFileName(file.name);
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return {
        success: false,
        error: `Upload failed: ${error.message}`,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('images').getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Upload meal box image
 */
export async function uploadBoxImage(file: File): Promise<ImageUploadResponse> {
  try {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    const fileName = generateFileName(file.name);
    const filePath = `boxes/${fileName}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return {
        success: false,
        error: `Upload failed: ${error.message}`,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('images').getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Upload special offer image
 */
export async function uploadOfferImage(
  file: File
): Promise<ImageUploadResponse> {
  try {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    const fileName = generateFileName(file.name);
    const filePath = `offers/${fileName}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return {
        success: false,
        error: `Upload failed: ${error.message}`,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('images').getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Upload bestseller image
 */
export async function uploadBestsellerImage(
  file: File
): Promise<ImageUploadResponse> {
  try {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    const fileName = generateFileName(file.name);
    const filePath = `bestsellers/${fileName}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return {
        success: false,
        error: `Upload failed: ${error.message}`,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('images').getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(publicUrl: string): Promise<boolean> {
  try {
    // Extract file path from public URL
    const urlParts = publicUrl.split('/storage/v1/object/public/images/');
    if (!urlParts[1]) {
      console.error('Invalid image URL');
      return false;
    }

    const filePath = decodeURIComponent(urlParts[1]);

    const { error } = await supabase.storage
      .from('images')
      .remove([filePath]);

    if (error) {
      console.error('Delete failed:', error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error during image deletion:', error);
    return false;
  }
}

/**
 * Export all service methods as object
 */
export const imageUploadService = {
  uploadChefImage,
  uploadProductImage,
  uploadBoxImage,
  uploadOfferImage,
  uploadBestsellerImage,
  deleteImage,
};

export default imageUploadService;
