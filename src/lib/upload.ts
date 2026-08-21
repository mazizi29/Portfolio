import { getSupabaseClient } from './supabase'
import imageCompression from 'browser-image-compression'

/**
 * Uploads a file to Supabase Storage after compressing it.
 * @param file The original image file from the input
 * @param bucketName The name of the Supabase storage bucket (default: 'media')
 * @returns An object containing the `url` of the uploaded file and the `error` if any.
 */
export async function uploadImage(file: File, bucketName: string = 'media') {
  try {
    // 1. Compress the image
    const options = {
      maxSizeMB: 0.5, // 500 KB limit for web delivery
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp' // Convert to WebP for better compression if supported
    }
    
    // Fallback file type to original if webp conversion fails or isn't desired by some browsers
    const compressedFile = await imageCompression(file, options)
    
    // 2. Generate a unique filename
    const fileExt = compressedFile.type.split('/')[1] || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    
    const supabase = getSupabaseClient()
    
    // 3. Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(fileName, compressedFile, {
        cacheControl: '3600',
        upsert: false
      })
      
    if (error) {
      throw error
    }
    
    // 4. Get the public URL
    const { data: publicUrlData } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(data.path)
      
    return { url: publicUrlData.publicUrl, error: null }
  } catch (error: any) {
    console.error('Error in uploadImage:', error)
    return { url: null, error: error.message || 'Gagal mengunggah gambar' }
  }
}
