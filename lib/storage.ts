import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export interface UploadProgressCallback {
  (progress: number): void;
}

/**
 * Uploads a product image directly to Firebase Storage bucket.
 * Destination path: `products/{timestamp}_{filename}`
 * Returns public download URL.
 */
export async function uploadProductImage(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> {
  if (!storage) {
    throw new Error("Firebase Storage is not initialized.");
  }

  // Validate image type
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files (JPEG, PNG, WebP) are allowed.");
  }

  // Sanitize filename
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `products/${Date.now()}_${sanitizedName}`;
  const storageRef = ref(storage, filePath);

  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    customMetadata: {
      uploadedAt: new Date().toISOString(),
    },
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(Math.round(progress));
      },
      (error) => {
        console.error("Firebase Storage upload error:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}
