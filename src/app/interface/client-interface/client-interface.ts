interface ClientInterface {
  _id: string;
  username: string;
  lastName: string;
  email: string;
  status: boolean;
  password: string;
  fullName?: string;
  roles: string[];
  clientId: string;
  createdAt: string;
  client: any;
}

interface SelectedClientInterface {
  _id: string;
  name: string;
  website: string;
  vimeoFolderId: string;
  vimeoFolderName: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

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

export type { ClientInterface, SelectedClientInterface, S3TransloaditUploadMapResultInterface };
