interface SelectedMediaChildInterface {
  _id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  videoUrl: string;
  assetId: string;
  shortLink?: string;
  downloads: [];
  clientId: string;
  producers: [];
  active: boolean;
  shareable: boolean;
  createdAt: string;
  updatedAt: string;
  textColor: string;
  backgroundColor: string;
  isUpdate: boolean;
}

export type { SelectedMediaChildInterface };
