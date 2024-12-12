interface S3TransloaditFiledInterface {
  ssl_url?: string | undefined;
  type?: string | undefined;
  original_id?: string | undefined;
  ext?: string | undefined;
  size?: number | undefined;
  meta?: { duration?: number | undefined };
  data?: any[] | undefined;
  completed?: boolean | undefined;
  abort?: boolean | undefined;
  response?: any[] | undefined;
}

// vimeo Transload  interface
interface VimeoTransloaditUploadMapInterface {
  data?: {
    results?: {
      [key: string]: Array<{ ssl_url?: string; meta?: { duration?: number } }>;
    };
  };
}

interface VideoInfo {
  id: string | undefined;
  duration?: number;
  name?: string;
}

export type { S3TransloaditFiledInterface, VimeoTransloaditUploadMapInterface, VideoInfo };
