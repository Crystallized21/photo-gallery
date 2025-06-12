import * as Sentry from "@sentry/nextjs";
import {Client, Storage} from "appwrite"

// initialize Appwrite client
const client = new Client()
  .setEndpoint("https://syd.cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")

const productionUrl = "https://gallery.crystallized.sh"
const developmentUrl = "http://localhost:3000"

if (typeof window !== "undefined") {
  client.headers = {
    ...client.headers,
    "Access-Control-Allow-Origin": process.env.NODE_ENV === "production"
      ? productionUrl
      : developmentUrl
  }
}

// initialize Appwrite storage
export const storage = new Storage(client)

// storage constants
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || ""

// get image preview URL with width/height parameters
export const getImagePreview = (fileId: string, width = 300): string => {
  return storage.getFilePreview(
    BUCKET_ID,
    fileId,
    width,
    0,
    undefined,
    100,
    0,
    "ffffff",
    0,
    undefined,
    undefined,
  )
}

// get full image URL for the carousel
export const getFullImage = (fileId: string, width = 1200): string => {
  return storage.getFilePreview(
    BUCKET_ID,
    fileId,
    width,
    0,
    undefined,
    90,
    0,
    "ffffff",
    0,
    undefined,
    undefined,
  )
}

// fetch images from storage bucket
export const fetchImages = async (limit = 20, offset = 0) => {
  const MAX_RETRIES = 3;
  let lastError: unknown = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // fetch files from storage bucket
      const response = await storage.listFiles(BUCKET_ID)

      // filter for only image files
      const imageFiles = response.files.filter((file) => file.mimeType?.startsWith("image/"))

      const paginatedFiles = imageFiles.slice(offset, offset + limit)

      // map the response to include preview URLs
      return paginatedFiles.map((file) => {
        // Try to determine aspect ratio from file metadata if available
        let aspectRatio = "4/3" // Default fallback

        // check if we can access width and height from file
        const fileWidth = (file as { width?: number }).width
        const fileHeight = (file as { height?: number }).height

        if (fileWidth && fileHeight) {
          aspectRatio = `${fileWidth}/${fileHeight}`
        }

        return {
          id: file.$id,
          fileId: file.$id,
          title: file.name || "Untitled",
          description: "",
          aspectRatio,
          src: {
            thumbnail: getImagePreview(file.$id, 600), // thumbnail
            medium: getImagePreview(file.$id, 1800), // medium size for initial carousel view
            full: getFullImage(file.$id, 3000), // full size for zoomed view
          },
          alt: file.name || "Gallery image",
          createdAt: file.$createdAt,
        }
      })
    } catch (error) {
      lastError = error;
      console.error(`Error fetching images (attempt ${attempt + 1}/${MAX_RETRIES}):`, error)

      // Only retry on network-related fetch errors
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        if (attempt < MAX_RETRIES - 1) {
          // Exponential backoff: 1s, 2s, 4s, ...
          // biome-ignore lint/style/useExponentiationOperator: why, it just makes it unreadable
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          Sentry.captureException(lastError);
          throw lastError; // Re-throw after final retry failure
        }
      } else {
        // Non-retryable error, capture and re-throw immediately
        Sentry.captureException(error);
        throw error;
      }
    }
  }
}
