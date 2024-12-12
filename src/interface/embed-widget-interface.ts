interface EmbedWidgetInterface {
  duration?: number;
  name: string;
  thumbnailUrl?: string;
  updatedAt?: string;
  userId?: {
    fullName?: string;
    username?: string;
  };
}

interface customEmbedWidgetThumbInterface {
  thumbMain: string;
  beforeClassPlayNows: string;
  playButton: string;
  thumbImage: string;
  thumbTimeContainer: string;
  thumbText: string;
  uploadedContainer: string;
  uploadedNameClass: string;
  avatar: string;
  uploadedheadingClass: string;
  uploadedTimeClass: string;
}

export type { EmbedWidgetInterface, customEmbedWidgetThumbInterface };
