import * as Sentry from "@sentry/nextjs";
import {Client, Storage, Query} from "appwrite";

interface ImageData {
  id: string;
  title: string;
  description: string;
  src: {
    thumbnail: string;
    full: string;
  };
  alt: string;
  createdAt: string;
}

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://syd.cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

// Set CORS headers for client-side requests
if (typeof window !== "undefined") {
  const origin = process.env.NODE_ENV === "production"
    ? "https://gallery.crystallized.sh"
    : "http://localhost:3000";

  client.headers = {
    ...client.headers,
    "Access-Control-Allow-Origin": origin
  };
}

// Initialize Appwrite storage
export const storage = new Storage(client);

// Storage constants
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "";

// Get thumbnail preview URL
export const getThumbnail = (fileId: string): string => {
  return storage.getFilePreview(
    BUCKET_ID,
    fileId,
    600, // width
    0,   // height
    undefined,
    60, // quality
    0,   // border width
    "ffffff", // border color
    0,   // border radius
    undefined,
    undefined,
  );
};

// Get full image URL
export const getFullImage = (fileId: string): string => {
  return storage.getFilePreview(
    BUCKET_ID,
    fileId,
    3000, // width
    0,    // height
    undefined,
    100,  // quality
    0,   // border width
    "ffffff", // border color
    0,   // border radius
    undefined,
    undefined,
  );
};

// Fetch images from storage bucket
export const fetchImages = async (limit = 20, offset = 0): Promise<ImageData[]> => {
  const MAX_RETRIES = 3;
  let lastError: unknown = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Use proper Query objects instead of string queries
      const queries = [
        Query.limit(limit),
        Query.offset(offset)
      ];

      // Fetch files with Appwrite pagination through queries
      const response = await storage.listFiles(
        BUCKET_ID,
        queries
      );

      // Filter for only image files
      const imageFiles = response.files.filter(
        (file) => file.mimeType?.startsWith("image/")
      );

      // Map the response to include preview URLs
      return imageFiles.map((file) => ({
        id: file.$id,
        title: file.name || "Untitled",
        description: "",
        src: {
          thumbnail: getThumbnail(file.$id),
          full: getFullImage(file.$id),
        },
        alt: file.name || "Gallery image",
        createdAt: file.$createdAt,
      }));
    } catch (error) {
      // Error handling remains the same
      lastError = error;
      console.error(`Error fetching images (attempt ${attempt + 1}/${MAX_RETRIES}):`, error);

      // Rest of the error handling...
      const isNetworkError =
        error instanceof TypeError &&
        (error.message.includes("Failed to fetch") ||
          error.message.includes("Network request failed"));

      if (isNetworkError && attempt < MAX_RETRIES - 1) {
        const delay = 2 ** attempt * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        Sentry.captureException(error);
        throw error;
      }
    }
  }

  return [];
};
