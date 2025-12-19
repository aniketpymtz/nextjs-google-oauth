import { Storage } from '@google-cloud/storage';
import path from 'path';

const bucketName = process.env.GCS_BUCKET_NAME!;
const projectId = process.env.GCS_PROJECT_ID!;

if (!bucketName || !projectId) {
  throw new Error('Missing GCS environment variables: GCS_BUCKET_NAME, GCS_PROJECT_ID');
}

// Initialize GCS client with credentials
// Option 1 (Local): Use keyfile path
// Option 2 (Production): Use JSON string from environment
let storage: Storage;

if (process.env.GCS_KEYFILE_PATH) {
  // Local development: use file path
  storage = new Storage({
    projectId,
    keyFilename: process.env.GCS_KEYFILE_PATH,
  });
} else if (process.env.GCS_SERVICE_ACCOUNT_JSON) {
  // Production: use JSON from environment variable
  const credentials = JSON.parse(process.env.GCS_SERVICE_ACCOUNT_JSON);
  storage = new Storage({
    projectId,
    credentials,
  });
} else {
  throw new Error('Missing GCS credentials: provide either GCS_KEYFILE_PATH or GCS_SERVICE_ACCOUNT_JSON');
}

const bucket = storage.bucket(bucketName);

/**
 * Upload a file buffer to GCS
 * @param fileBuffer - The file buffer to upload
 * @param fileName - The name to save the file as
 * @param mimeType - The MIME type of the file
 * @returns Public URL of the uploaded file
 */
export async function uploadToGCS(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  // Generate unique filename with timestamp
  const timestamp = Date.now();
  const ext = path.extname(fileName);
  const baseName = path.basename(fileName, ext);
  const uniqueFileName = `avatars/${baseName}-${timestamp}${ext}`;

  const file = bucket.file(uniqueFileName);

  await file.save(fileBuffer, {
    metadata: {
      contentType: mimeType,
      cacheControl: 'public, max-age=31536000', // 1 year
    },
  });

  // Return public URL (file is automatically public due to bucket-level IAM)
  return `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`;
}

/**
 * Delete a file from GCS
 * @param fileUrl - The public URL of the file to delete
 */
export async function deleteFromGCS(fileUrl: string): Promise<void> {
  try {
    // Extract filename from URL
    const urlParts = fileUrl.split(`${bucketName}/`);
    if (urlParts.length < 2) return;

    const fileName = urlParts[1];
    const file = bucket.file(fileName);

    await file.delete();
  } catch (error) {
    console.error('Error deleting file from GCS:', error);
    // Don't throw - file might already be deleted
  }
}
