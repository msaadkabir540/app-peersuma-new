interface DraftVideoInterface {
  url: string;
  name: string;
  s3Key: string;
  fileType: string;
  duration: number;
  thumbnailUrl: string;
  _id: string;
  handleChangeVideoName: ({
    value,
    videoDraftId,
    mediaId,
  }: {
    value: string;
    mediaId: string;
    videoDraftId: string;
  }) => void;
}

interface CommentInterface {
  comment: string;
  createdAt: string;
  userId: any;
  _id: string;
  name?: string;
}

interface VideoDraftInterface {
  _id: string;
  videoProjectId: string;
  clientId: string;
  draftVideo: DraftVideoInterface[];
  comments: CommentInterface[];
  createdAt: string;
  updatedAt: string;
}

interface CommentBoxInterface {
  videoProjectId: string;
  clientId: string;
  draftId: string;
  currentAllUser: any;
  currentUser: { name: string | undefined; userId: string | undefined };
  commentsData: CommentInterface[];
  handleAddComments: ({
    comment,
    videoProjectId,
    clientId,
    currentUser,
  }: {
    comment: string;
    videoProjectId: string;
    clientId: string;
    videoDraftId: string;
    currentUser: { name: string | undefined; userId: string | undefined };
  }) => void;
}

type DraftAction = "get-all-video-drafts" | "add-comment" | "update-draft-name";
type DataTypes = {
  selectedClient?: string;
  userId?: string;
  selectedClientId?: string;
  videoProjectId?: string;
  videoDraftId?: string;
  comment?: string;
  clientId?: string;
  bodyData?: {
    name: string;
    mediaId: string;
  };
  userData?: { name: string | undefined; userId: string | undefined };
};

export type {
  VideoDraftInterface,
  DraftVideoInterface,
  CommentInterface,
  CommentBoxInterface,
  DraftAction,
  DataTypes,
};
