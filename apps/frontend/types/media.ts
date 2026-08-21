export interface PresignedUrlResponse {
  presignedUrl: string;
  key: string;
  publicUrl: string;
  fileType: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}
