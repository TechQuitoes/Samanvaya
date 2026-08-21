import apiNexus from "@/lib/api/apiNexusIntercepter";
import { PresignedUrlResponse, UploadProgress } from "@/types/media";

export interface S3UploadOptions {
  folder?: string;
  onProgress?: (progress: UploadProgress) => void;
}

/**
 * Uploads a file directly to AWS S3 using a Presigned URL
 * @param file The browser File object
 * @param options Upload options (target folder, progress callback)
 * @returns Object with the uploaded S3 key, publicUrl, and file metadata
 */
export async function uploadFileToS3(
  file: File,
  options?: S3UploadOptions
): Promise<{ key: string; publicUrl: string; fileName: string; fileType: string; fileSize: number }> {
  const folder = options?.folder || "uploads";
  const fileType = file.type || "application/octet-stream";

  // Step 1: Request Presigned URL from Backend
  const res = await apiNexus.call<PresignedUrlResponse>("POST_GENERATE_PRESIGNED_URL", {
    payload: {
      fileName: file.name,
      fileType,
      folder,
    },
  });

  if (!res.isSuccess || !res.data?.presignedUrl) {
    const errorMsg = res.message || "Failed to generate S3 upload authorization URL";
    throw new Error(errorMsg);
  }

  const { presignedUrl, key, publicUrl } = res.data;

  // Step 2: Upload Binary directly to S3 via PUT (with XMLHttpRequest for accurate progress tracking)
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", presignedUrl, true);
    xhr.setRequestHeader("Content-Type", fileType);

    if (xhr.upload && options?.onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          options.onProgress?.({
            loaded: event.loaded,
            total: event.total,
            percent,
          });
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`S3 direct upload failed with status ${xhr.status}: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during S3 upload. Check CORS and connection."));
    };

    xhr.send(file);
  });

  return {
    key,
    publicUrl,
    fileName: file.name,
    fileType,
    fileSize: file.size,
  };
}
