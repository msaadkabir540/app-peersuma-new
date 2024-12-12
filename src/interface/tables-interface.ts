interface UserTableRows {
  _id: string;
  id?: string;
  status: boolean;
  username: string;
  email: string;
  roles: string[];
  updatedAt: string;
  actions?: string;
}

type FileType = {
  label: string;
  value: string;
};
interface WedgetRowInterface {
  _id: string;
  actions?: string;
  updatedAt: string;
  description: string;
  templateName: string;
  mediaFilesCount: number;
  templateVideoUrl?: string;
  templateVideoThumbnailUrl?: string;
}

interface WidgetTableRows {
  name: string;
  active: boolean;
  _id: string;
  id?: string;
  status: boolean;
  role: string;
}

interface RowsInterface {
  _id: string;
  website?: string;
  id?: string;
  status?: boolean;
  username?: string;
  fullName?: string;
  email?: string;
  roles?: string[] | string;
  updatedAt?: string;
  actions?: string;
  name?: string;
  active?: boolean;
  count?: number;
  yourName?: string;
  projectName?: string;
  thumbnailUrl?: string;
  fileType?: string;
  categories?: FileType[] | string[];
  fileSize?: string;
  duration?: string | number;
  url?: string;
  s3Key?: string;
  themeName?: string;
  templateName?: string;
  description?: string;
  mediaFilesCount?: number;
  templateVideoUrl?: string;
  themesDescription?: string;
  templateVideoThumbnailUrl?: string;
  themeVideoThumbnailUrl?: string;
}

export type { UserTableRows, WidgetTableRows, RowsInterface, WedgetRowInterface };
