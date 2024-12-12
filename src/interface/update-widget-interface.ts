type DownloadType = {
  quality: string;
  link: string;
  _id: string;
};

type MediaDataType = {
  _id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  videoUrl: string;
  assetId: string;
  shortLink: string;
  downloads: DownloadType;
  clientId: string;
  producers: [];
  active: boolean;
  shareable: boolean;
  createdAt: string;
  updatedAt: string;
  showTitle?: boolean;
  showDescription?: boolean;
  showSubscribers?: boolean;
  enableShare?: boolean;
  enableSubscribe?: boolean;
  widgetTemplate?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  video_name?: string;
  video_url?: string;
};

type MediaType = {
  order: number;
  _id: MediaDataType;
};

type WidgetDataType = {
  _id?: string;
  name: string;
  description: string;
  clientId: string;
  producers: string[];
  active: boolean;
  showTitle?: boolean;
  showDescription: boolean;
  showSubscribers: boolean;
  enableShare?: boolean;
  enableSubscribe: boolean;
  widgetTemplate: boolean;
  media: MediaType;
  backgroundColor: string;
  buttonColor?: string;
  buttonTextColor: string;
  colorPalette: any;
  textColor: string;
  thumbnailColor: string;
  subscribers: number;
  hyperTextColor?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
};

interface WidgetInterface {
  active: number;
  data: WidgetDataType;
}

interface TabComponentInterface {
  0: React.ReactElement;
  1: React.ReactElement;
  2: React.ReactElement;
}

interface widgetTemplateInterface {
  carousel: React.ReactElement;
  slideshow: React.ReactElement;
  thumbnailGrid: React.ReactElement;
  verticalStack: React.ReactElement;
}

export type { WidgetInterface, WidgetDataType, TabComponentInterface, widgetTemplateInterface };
