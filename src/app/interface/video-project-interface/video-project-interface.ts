import { Control, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { UsersInterface } from "../user-interface/user-interface";

interface SortColumnInterface {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface VideoProjectFormInterface {
  name: string;
  description?: string;
}

interface RowInterface {
  _id: string;
  name: string;
  clientId: string;
  description: string;
  videoProjectShot: string[];
  status: string;
  createdByUser: string;
  createdAt: string;
  updatedAt: string;
}
interface ContributorInterface {
  value: string;
  label: string;
}

interface UserIdInterface {
  _id: string;
  fullName?: string;
  username: string;
}

interface VideoProjectInterface {
  _id: string;
  name: string;
  status: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  createdByUser: {
    fullName: string;
    username: string;
    _id: string;
  };
  media: MediaInterface[];
  isEditingProcess?: boolean;
  albumId: AlbumMediaInterface;
  contributor?: ContributorInterface[];
}

interface MediaInterface {
  userId?: UserIdInterface;
}

interface AlbumMediaInterface {
  _id: string;
  name: string;
  clientId: string;
  description: string;
  status: string;
  createdByUser: string;
  createdAt: string;
  updatedAt: string;
  userId?: UserIdInterface;
  albumshots: AlbumShotInterface[];
}

interface AlbumInterface {
  _id: string;
  isEditingProcess?: boolean;
  name: string;
}

interface AlbumShotInterface {
  _id: string;
  name: string;
  album: AlbumInterface;
  shotUrl: string;
  isDefault: boolean;
  media: ShotMediaInterface[];
  invites: [];
  createdAt: string;
  updatedAt: string;
}

interface ShotMediaInterface {
  url: string;
  thumbnailUrl?: string;
  username?: string;
  fullName?: string;
  name: string;
  s3Key: string;
  fileType: string;
  duration: number;
  isVisible: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId?: UserIdInterface;
  updated_by?: string | undefined;
}

interface VideoProjectShotInterface {
  _id: string;
  name: string;
  videoProject: string;
  shotUrl: string;
  description?: string;
  isDefault: boolean;
  dueDate: string;
  media: ShotMediaInterface[];
  invites: string[];
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  updated_by?: string;
  index?: number;
}

interface UploadsMediaInterface {
  name: string;
  url: string;
  fileType: string;
  fileSize: number;
  duration: number;
  s3Key: string;
  thumbnailUrl?: string | undefined;
  thumbnailS3Key?: string | undefined;
}

interface VideoProjectButtonInterface {
  handleSearchEvent: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSetEventCross: () => void;
  handleUpdateShotUrlModalOpen: () => void;
  handleSendReminderMail: ({ userName, userId }: { userName: string; userId: string }) => void;
  handleDeleteShotById: () => void;
  searchParams?: string;

  searchParamsValue?: string;
  mediaLength?: number;
  projectName: string;
  description?: string;
  isEditingProcess?: boolean;
  isDeletingScenes?: boolean;
  dueDate?: any;
  startDate: any;
  setStartDate: (date: any) => void;
  videoProjectId: string;
  selectedShot: OptionInterface;
  shotsOption: { value: string; label: string }[];
  watchContributor: OptionInterface;
  activeView: string;
  handleSubmit: UseFormHandleSubmit<VideoHookFromInterface>;
  control: Control<VideoHookFromInterface>;
  onSubmit: (data: any) => Promise<boolean | undefined>;
  setValue: UseFormSetValue<VideoHookFromInterface>;
  register: UseFormRegister<VideoHookFromInterface>;
  handleUploadMedia: ({ id, uploads }: { id: string; uploads: UploadsMediaInterface[] }) => void;
  setActiveView: any;
  handleInvitesModal: () => void;
  shotMedia?: VideoProjectShotInterface[];
  isProcessing: boolean;
  isContributor?: boolean | undefined;
  invitedUser?: UsersInterface[];
  contributorOption: ContributorInterface[] | undefined;
}

interface RowDataInterface {
  _id: string;
  createdByUser: UsersInterface | undefined;
}

interface VideoProjectHeaderInterface {
  isOpen: boolean;
  name: string;
  status: string;
  videoProjectId: string;
  onSubmit: any;
  isUpdate: boolean;
  activeList: string;
  description: string;
  producerName: string;
  createdDate: string;
  isStatusUpdate: boolean;
  isEditingProcess?: boolean;
  handleDraftsList: () => void;
  setIsOpen: (argu: boolean) => void;
  isContributor?: boolean | undefined;
  control: Control<VideoHookFromInterface>;
  register: UseFormRegister<VideoHookFromInterface>;
  setValue?: UseFormSetValue<VideoHookFromInterface>;
  handleStatusChange?: (obj: { status: string }) => void;
  handleSubmit: UseFormHandleSubmit<VideoHookFromInterface>;
}

interface GetVideoProjectResponse {
  _id: string;
  name: string;
  clientId: string;
  description: string;
  videoProjectShot: string[];
  status: string;
  createdByUser: string;
  albumId: string;
  defaultAlbumShot: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type OptionInterface =
  | {
      value: string;
      label: string;
    }
  | null
  | undefined;

interface VideoHookFromInterface {
  shotName: string;
  inviteSearch?: string;
  isInvites?: { value: number; label: string };
  emailAddNote?: string;
  contributor: OptionInterface;
  inviteShot?: OptionInterface;
  shotLink?: string;
  renameFile?: string;
  shotDescription?: string;
  projectStatus: OptionInterface;
  status?: string | undefined;
  selectedShot?: OptionInterface;
  sortMedia?: OptionInterface;
  videoProjectName?: string | undefined;
  description?: string | undefined;
  type?: OptionInterface;
}

interface SelectionViewTabInterface {
  control: Control<VideoHookFromInterface>;
  setActiveView?: any;
  handleSearchEvent: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSetEventCross: () => void;
  mediaLength?: number;
  searchParams?: string;
  searchParamsValue?: string;
  activeView: string;
  isContributor?: boolean | undefined;
  contributorOption: ContributorInterface[] | undefined;
}

interface ViewComponentInterface {
  isEditingProcess: boolean;
  register: UseFormRegister<VideoHookFromInterface>;
  handleRenameFile: ({ shotId, s3Key }: { shotId: string; s3Key: string }) => Promise<boolean>;
  setValue: UseFormSetValue<VideoHookFromInterface>;
  handleMoveMediaShot: ({
    selectedShot,
    moveShot,
    media,
  }: {
    selectedShot: string;
    moveShot: string;
    media: any;
  }) => void;
  selectedShot: any;
  shotsOption: any;
  activeView: string;
  isProcessing: boolean;
  isContributor: boolean | undefined;
  mediaType: string | undefined;
  allMediaShot: VideoProjectShotInterface[];
  sortColumn: { sortBy: string; sortOrder: "asc" | "desc" };
  handleSort: ({ sort }: { sort: { sortBy: string; sortOrder: "asc" | "desc" } }) => void;
  handleDeleteShots: ({ shotId }: { shotId: string }) => Promise<boolean>;
}

interface ShotInterface {
  media?: any;
  shortName?: any;
  shotIds?: string;
  s3key?: string;
  shortName2?: any;
  isMove?: boolean;
  isShotOpen?: boolean;
  isRenameOpen?: boolean;
}

export type {
  RowInterface,
  ShotInterface,
  RowDataInterface,
  ShotMediaInterface,
  AlbumShotInterface,
  AlbumMediaInterface,
  SortColumnInterface,
  VideoProjectInterface,
  UploadsMediaInterface,
  ViewComponentInterface,
  VideoHookFromInterface,
  GetVideoProjectResponse,
  VideoProjectShotInterface,
  SelectionViewTabInterface,
  VideoProjectFormInterface,
  VideoProjectButtonInterface,
  VideoProjectHeaderInterface,
};
