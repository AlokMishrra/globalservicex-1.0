import { supabase } from "./supabase"

// Upload image with proper error handling and storage
export const uploadImage = async (file: File, bucket = "blog-images"): Promise<string> => {
  try {
    // Check if file is valid
    if (!file || !file.type.startsWith("image/")) {
      throw new Error("Please select a valid image file")
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image size should be less than 5MB")
    }

    // For demo purposes, always use base64 storage to avoid bucket permission issues
    return await storeImageAsBase64(file)

    // Uncomment below for actual Supabase storage when properly configured
    /*
    const fileExt = file.name.split(".").pop()?.toLowerCase()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    // Try to upload to Supabase Storage
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Supabase storage error:", error)
      return await storeImageAsBase64(file)
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath)

    if (!publicUrl) {
      console.error("Failed to get public URL")
      return await storeImageAsBase64(file)
    }

    return publicUrl
    */
  } catch (error) {
    console.error("Error uploading image:", error)
    // Store as base64 as fallback
    return await storeImageAsBase64(file)
  }
}

// Store image as base64 data URL (reliable fallback)
const storeImageAsBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Create bucket if it doesn't exist (disabled for demo to avoid permission issues)
const createBucketIfNotExists = async (bucketName: string) => {
  try {
    // Skip bucket creation for demo to avoid RLS policy errors
    console.log(`Skipping bucket creation for ${bucketName} - using base64 storage instead`)
    return

    // Uncomment below when Supabase storage is properly configured with RLS policies
    /*
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("Error listing buckets:", listError)
      return
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName)

    if (!bucketExists) {
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ["image/*"],
        fileSizeLimit: 5242880, // 5MB
      })

      if (error) {
        console.error("Error creating bucket:", error)
      } else {
        console.log("Bucket created successfully:", bucketName)
      }
    }
    */
  } catch (error) {
    console.error("Error in createBucketIfNotExists:", error)
  }
}

// Delete image from storage
export const deleteImage = async (url: string, bucket = "blog-images"): Promise<void> => {
  try {
    // Skip deletion for base64 URLs
    if (url.startsWith("data:")) {
      return
    }

    // Skip deletion for placeholder URLs
    if (url.includes("/placeholder.svg")) {
      return
    }

    // For actual Supabase storage URLs, extract and delete
    const urlParts = url.split("/")
    const fileName = urlParts[urlParts.length - 1]

    const { error } = await supabase.storage.from(bucket).remove([fileName])

    if (error) {
      console.error("Error deleting from storage:", error)
    }
  } catch (error) {
    console.error("Error deleting image:", error)
  }
}

// Create blob URL for immediate preview
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Check if storage is available (always return false for demo to use base64)
export const checkStorageAvailability = async (): Promise<boolean> => {
  try {
    // For demo purposes, always use base64 storage
    return false

    // Uncomment below when Supabase storage is properly configured
    /*
    const { data, error } = await supabase.storage.listBuckets()
    return !error
    */
  } catch (error) {
    console.error("Storage not available:", error)
    return false
  }
}

// Compress image before storing as base64 to reduce size
export const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality)
      resolve(compressedDataUrl)
    }

    img.src = URL.createObjectURL(file)
  })
}
