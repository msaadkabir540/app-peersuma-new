import { MediaFileInterface } from "./showcase-interface";

interface MediaItem {
  order: number;
  _id: MediaFileInterface;
}
interface widgetInterface {
  _id: string | undefined;
  name: string;
  description?: string;
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
  titleColor?: string;
  hyperTextColor?: string;
  subscribers?: number;
  backgroundColor: string;
  colorPalette: string;
  textColor: string;
  thumbnailColor: string;
  show_statistic: string;
}

interface DownloadInterface {
  quality: string;
  link: string;
  _id: string;
}

interface AssetsInterface {
  _id: string;
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  videoUrl: string;
  assetId: string;
  shortLink: string;
  downloads?: DownloadInterface[] | [];
  clientId: string | undefined;
  producers?: [];
  active: boolean;
  shareable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface SlideShowTemplateInterface {
  cardsNumber: number;
  widget: widgetInterface;
  assets: AssetsInterface[];
  isAllowGetStartedModal?: boolean;
}

interface ReactPlayerRefInterface {
  slickNext: () => void | null;
  slickPrev: () => void | null;
}

export type { SlideShowTemplateInterface, ReactPlayerRefInterface };
