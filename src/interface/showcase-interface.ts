interface MediaFileInterface {
  _id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  videoUrl: string;
  assetId: string;
  shortLink: string;
  downloads: any[];
  clientId: string;
  producers: any[];
  active: boolean;
  shareable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MediaItem {
  order: number;
  _id: MediaFileInterface;
}

interface ShowcaseDataInterface {
  _id: string;
  name: string;
  description?: string;
  clientId?: string;
  producers?: string[];
  active?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showSubscribers?: boolean;
  enableShare?: boolean;
  enableSubscribe?: boolean;
  widgetTemplate?: string;
  media?: MediaItem[];
  createdAt?: string;
  updatedAt?: string;
  buttonColor?: string;
  buttonTextColor: string;
  video_name?: string;
  video_url?: string;
}

interface ShowcaseResponse {
  data: ShowcaseDataInterface;
}

interface RouteParamsInterface {
  id: string;
  [key: string]: string;
}

export type { ShowcaseResponse, ShowcaseDataInterface, MediaFileInterface, RouteParamsInterface };
