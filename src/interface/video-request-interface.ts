interface VideoRequestInterface {
  _id: string;
  videoRequestName: string;
  clientId: string;
  description: string;
  category: string;
  dueDate: string;
  assignTo: string;
  status: string;
  themeId: string;
  url?: string;
  userId: {
    _id: string;
    username: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CreatedByUser {
  _id: string;
  username: string;
}

interface Album {
  _id: string;
  albumshots: string[];
}

interface Contributor {
  userId: string;
  videoProjectId: string;
  _id: string;
}

interface VideoProjectDataInterface {
  _id: string;
  name: string;
  clientId: string;
  status: string;
  createdByUser: CreatedByUser;
  albumId: Album;
  projectId: string;
  isEditingProcess: boolean;
  contributor: Contributor[];
  createdAt: string;
  updatedAt: string;
  description?: string;
  isDeleted?: boolean;
  __v: number;
}

export type { VideoRequestInterface, VideoProjectDataInterface };
