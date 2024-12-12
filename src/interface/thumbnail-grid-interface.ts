import { MediaFileInterface } from "./showcase-interface";

interface MediaItem {
  order: number;
  _id: MediaFileInterface;
}

interface AssetsInterface {
  _id: string;
  id: string;
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
  buttonTextColor?: string;
  video_name?: string;
  video_url?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}
interface widgetInterface {
  _id: string | undefined;
  name: string;
  description?: string;
  assetId?: string;
  titleColor?: string;
  thumbnailTitleColor: string;
  clientId?: string;
  producers?: string[];
  active?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showGetStarted?: boolean;
  showSubscribers?: boolean;
  enableShare?: boolean;
  enableSubscribe?: boolean;
  widgetTemplate?: string | undefined;
  media?: MediaItem[];
  createdAt?: string;
  updatedAt?: string;
  buttonColor?: string;
  buttonTextColor: string;
  video_name?: string;
  video_url?: string;
  videoUrl?: string;
  subscribers: number;
  backgroundColor: string;
  colorPalette: string;
  textColor: string;
  thumbnailColor: string;
  show_statistic: string;
}

interface ThumbnailGridTemplateInterface {
  height?: string;
  widget: widgetInterface;
  assets: AssetsInterface[];
  cardsNumber: number;
  isAllowGetStartedModal?: boolean;
}

export type { ThumbnailGridTemplateInterface, widgetInterface };
