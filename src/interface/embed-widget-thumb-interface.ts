interface EmbedWidgetThumbInterface {
  thumbnailTitleColor: string;
  item: EmbedWidgetInterface;
  selected: boolean;
  handleSelect: ({ item }: { item: EmbedWidgetInterface }) => void;
}

interface EmbedWidgetInterface {
  duration?: number;
  updatedAt?: string | undefined;
  name: string;
  thumbnailUrl?: string;
  userId?: {
    fullName?: string;
    username?: string;
  };
}

interface customEmbedWidgetThumbInterface {
  thumbMain: string;
  thumbImage: string;
  thumbTimeContainer: string;
  thumbText: string;
}

export type { EmbedWidgetInterface, EmbedWidgetThumbInterface, customEmbedWidgetThumbInterface };
