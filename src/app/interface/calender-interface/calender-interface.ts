import { MouseEvent } from "react";

interface VideoRequestThemes {
  _id: string;
  themeName: string;
  clientId: string;
  fromDate: string;
  toDate: string;
  themeColor: string;
  videoRequestIds: [];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface updatedDataInterface {
  themeColor: string;
  userId: string;
  clientId: string | undefined;
  themeName: string;
  toDate: any;
  fromDate: any;
}

interface DetailModalVideoRequestInterface {
  isOpenModal: boolean;
  currentUserRole?: string;
  handleOpen: (e: MouseEvent<HTMLDivElement>) => void;
  handleClickSampleVideoModal: () => void;
  handleClickAudioModal: () => void;
  handleUpdateVideoRequest: (e: MouseEvent<HTMLDivElement>) => void;
  hanldeIndiviualMailOpen: (e: MouseEvent<HTMLDivElement>) => void;
  handleClickStatusChange: ({ status }: { status: string }) => void;
  loggedInUserId: string;
  videoRequestData: {
    instructions: string;
    description: string;
    videoUrl: string;
    audioUrl?: string;
    category: string;
    level: string;
    dueDate: any;
    createdAt: string;
    status: string;
    _id: string;

    assignTo: { username: string; _id: string };
    userId: { username: string; _id: string };
    videoRequestName: string;
    sampleThumbnailUrl?: string;
    url?: string;
  };
  handleCloseModal: () => void;
}

interface DetailModalInterface {
  level: string;
  videoUrl: string;
  category: string;
  complexity: string;
  imageUrl?: string;
  audioUrl?: string;
  description: string;
  instructions: string;
  isOpenModal: boolean;
  inventoryName: string;
  handleCloseModal: () => void;
}

interface IsInventoryDetailInterface {
  isOpenModal: boolean;
}

interface InventoryCardInterface {
  name: string;
  level: string;
  complexity: string;
  color: string;
  imageUrl: string;
  category: string;
  videoUrl: string;
  audioUrl?: string;
  instructions: string;
  description: string;
  inventoryId: string;
  currentSongPlaying: any;
  handlePlayAndPause: ({ currentId }: { currentId: string }) => void;
  handleAudioPause: () => void;
}

interface InventoryMapInterface {
  _id: string;
  url: string;
  name: string;
  complexity: string;
  color: string;
  level: string;
  category: string;
  audioUrl?: string;
  description: string;
  thumbnailUrl: string;
  instructions: string;
  customeThumbnailUrl: string;
}

export type {
  VideoRequestThemes,
  updatedDataInterface,
  InventoryMapInterface,
  DetailModalInterface,
  InventoryCardInterface,
  IsInventoryDetailInterface,
  DetailModalVideoRequestInterface,
};
