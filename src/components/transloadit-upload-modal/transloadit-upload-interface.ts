interface S3TransloaditUploadMapResultInterface {
  name: string;
  url?: string;
  fileType?: string;
  fileSize?: number;
  duration: number;
  s3Key?: string;
  thumbnailUrl?: string;
  thumbnailS3Key?: string;
}
interface TransloaditModalFieldInterface {
  prefix?: string;
  timeStamp?: string;
  fileName?: string;
  fields?: string;
}

interface TransloaditModalRespInterface {
  data?: any[];
  completed: boolean;
  abort?: boolean;
  response?: any;
}

interface TransloaditResultInterface {
  uploads: {
    name: string;
    url: string;
    fileType: string;
    fileSize: number;
    duration: number;
    s3Key: string;
    thumbnailUrl?: string;
    thumbnailS3Key?: string;
  }[];
}

interface TransloaditModalInterface {
  fieldName: boolean;
  setUploads: ({
    uploads,
  }: {
    uploads: Array<{
      name: string;
      url: string;
      fileType: string;
      fileSize: number;
      duration: number;
      s3Key: string;
      thumbnailUrl?: string;
      thumbnailS3Key?: string;
    }>;
  }) => void;
  mapUploads: (resp: any, fields?: any) => S3TransloaditUploadMapResultInterface[] | undefined;
  customName?: string;
  setFieldName?: (fieldName: boolean) => void;
  handleCloseModal?: () => void;
  customExtension?: string;
  setMediaListLoading?: (loading: boolean) => void;
  allowedFileTypes: string[] | null;
  maxNumberOfFiles?: number | null;
  minNumberOfFiles?: number | null;
  template_id?: string;
  fields?: TransloaditModalFieldInterface;
}

interface TransloaditModalInterface {
  fieldName: boolean;
  droppedFiles?: any;
  setUploads: ({
    uploads,
  }: {
    uploads: Array<{
      name: string;
      url: string;
      fileType: string;
      fileSize: number;
      duration: number;
      s3Key: string;
      thumbnailUrl?: string;
      thumbnailS3Key?: string;
    }>;
  }) => void;
  mapUploads: (resp: any, fields?: any) => S3TransloaditUploadMapResultInterface[] | undefined;
  customName?: string;
  setFieldName?: (fieldName: boolean) => void;
  handleCloseModal?: () => void;
  customExtension?: string;
  // completionCheck?: (res: s3TransloaditCompletionCheckInterface) => boolean;
  setMediaListLoading?: (loading: boolean) => void;
  allowedFileTypes: string[] | null;
  maxNumberOfFiles?: number | null;
  minNumberOfFiles?: number | null;
  template_id?: string;
  fields?: TransloaditModalFieldInterface;
}

interface UseUppyWithTransloaditInterface {
  customName?: string;
  droppedFiles?: any;
  onCloseModal: () => void;
  setMediaList: ({ result }: { result: ResultInterface }) => void;
  customExtension?: string;
  allowedFileTypes: string[] | null;
  maxNumberOfFiles?: number | null;
  minNumberOfFiles?: number | null;
  template_id?: string;
  fields?: TransloaditModalFieldInterface;
}

interface ResultInterface {
  failed?: any[];
  successful?: any[];
  transloadit?: any[];
  uploadID?: string;
}

export type {
  ResultInterface,
  TransloaditModalInterface,
  TransloaditModalFieldInterface,
  TransloaditModalRespInterface,
  TransloaditResultInterface,
  UseUppyWithTransloaditInterface,
};
