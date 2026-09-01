import apiNexus from "@/lib/api/apiNexusIntercepter";
import DataManager from "@/lib/data-manager";
import { PresignedUrlResponse, UploadProgress } from "@/types/media";

export interface S3UploadOptions {
  folder?: string;
  onProgress?: (progress: UploadProgress) => void;
}

/**
 * Uploads a file directly to Cloudflare R2 / AWS S3 using a Presigned URL,
 * with an automatic fallback to server-side upload if direct browser CORS is not yet configured.
 */
export async function uploadFileToS3(
  file: File,
  options?: S3UploadOptions
): Promise<{ key: string; publicUrl: string; fileName: string; fileType: string; fileSize: number }> {
  const folder = options?.folder || "avatars";
  const fileType = file.type || "application/octet-stream";

  try {
    // ─── ATTEMPT 1: DIRECT PRESIGNED URL UPLOAD ───
    const res = await apiNexus.call<PresignedUrlResponse>("POST_GENERATE_PRESIGNED_URL", {
      payload: {
        fileName: file.name,
        fileType,
        folder,
      },
    });

    if (res.isSuccess && res.data?.presignedUrl) {
      const { presignedUrl, key, publicUrl } = res.data;

      // Upload Binary directly to R2 / S3 via PUT
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
            reject(new Error(`Direct storage upload returned status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Direct R2 upload CORS/Network blocked, falling back to server upload"));
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
  } catch (directUploadErr) {
    console.warn("Direct presigned upload failed, initiating server-side upload fallback:", directUploadErr);
  }

  // ─── ATTEMPT 2: FALLBACK SERVER-SIDE PROXY UPLOAD ───
  return uploadFileViaServer(file, folder, options?.onProgress);
}

/**
 * Uploads file via NestJS backend proxy to Cloudflare R2 / AWS S3
 */
async function uploadFileViaServer(
  file: File,
  folder: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ key: string; publicUrl: string; fileName: string; fileType: string; fileSize: number }> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api";
  const uploadUrl = `${baseUrl.replace(/\/+$/, "")}/media/upload`;
  const token = DataManager.getToken();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl, true);

    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percent,
          });
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText);
          const data = json?.data || json;
          resolve({
            key: data.key,
            publicUrl: data.publicUrl,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          });
        } catch (e) {
          reject(new Error("Failed to parse server upload response"));
        }
      } else {
        reject(new Error(`Server upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during file upload"));
    };

    xhr.send(formData);
  });
}
