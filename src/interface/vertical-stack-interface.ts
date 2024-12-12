import { customEmbedWidgetThumbInterface } from "./embed-widget-thumb-interface";
import { MediaFileInterface } from "./showcase-interface";

interface MediaItem {
  order: number;
  _id: MediaFileInterface;
}
interface widgetInterface {
  _id: string | undefined;
  name: string;
  description?: string;
  titleColor?: string;
  thumbnailTitleColor?: string;
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
  // buttonColor?: string;
  buttonTextColor: string;
  video_name?: string;
  video_url?: string;
  subscribers: number;
  backgroundColor: string;
  colorPalette: string;
  textColor: string;
  thumbnailColor: string;
  thumbnailHeadingColor: string;
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

interface VerticalStackTemplateInterface {
  cardsNumber: number;
  widget: widgetInterface;
  assets: AssetsInterface[];
  isAllowGetStartedModal?: boolean;
  customStyle: CustomeStyleInterface;
  customEmbedStyle: customEmbedWidgetThumbInterface;
}
interface CustomeStyleInterface {
  maxHeightDescriptionHidden: string;
  maxHeightDescription: string;
  widgetContainer: string;
  widgetContainerNoDescription: string;
  mainContainer: string;
  iframStyle: string;
  showDescription: string;
  showGetStarted?: string;
  grid: string;
  description: string;
  leftDiv?: string;
  name: string;
  rightPane: string;
  main: string;
  uploadedNameClass: string;
  shareViewClass: string;
  uploadedTimeClass: string;
  uploadedheadingClass: string;
  viewAllClass: string;
  avatar: string;

  shareBox: string;
}

interface selectedInterface {
  _id: string;
  name: string;
  videoUrl: string;
  description: string;
  userId: { username?: string; fullName?: string };
  updatedAt: string;
}
export type { VerticalStackTemplateInterface, selectedInterface };
