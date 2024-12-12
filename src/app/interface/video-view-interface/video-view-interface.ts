import { Control, FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { UsersInterface } from "../user-interface/user-interface";

interface MediaDataInterface {
  _id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  videoUrl: string;
  assetId: string;
  shortLink: string;
  userId: UsersInterface;
  downloads: any;
  clientId: string;
  widgetUrl?: string;
  producers: any;
  active: boolean;
  shareable: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface Client {
  _id: string;
  name: string;
  website: string;
  vimeoFolderId: string;
  vimeoFolderName: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  status: boolean;
  S3Key: string;
  emailDomain: string;
  url: string;
}

interface UserInterface {
  _id: string;
  username: string;
  fullName?: string;
  email: string;
  password: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  token: string;
  status: boolean;
  clientId: any[];
}

interface Media {
  order: number;
  _id: MediaDataInterface;
}

interface ShowInterface {
  _id: string;
  name: string;
  description: string;
  clientId: Client;
  producers: string[];
  active: boolean;
  showTitle?: boolean;
  showDescription: boolean;
  showSubscribers: boolean;
  enableShare?: boolean;
  enableSubscribe: boolean;
  widgetTemplate: string;
  media?: Media[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  backgroundColor: string;
  buttonColor?: string;
  buttonTextColor: string;
  colorPalette: string;
  textColor: string;
  thumbnailColor: string;
  hyperTextColor: string;
  hyperTitleColor: string;
  shareColor: string;
  thumbnailTitleColor: string;
  titleColor: string;
  tryNowButtonColor: string;
  tryNowButtonTextColor: string;
}

interface VideoViewContextInterface {
  widget: ShowInterface | undefined;
  activeView: string;
  selectedVideo: MediaDataInterface | undefined;
  videoViewId: string;
  debouncedFindUser?: string | undefined;
  isPageLoading: boolean;
  searchParams: boolean;
  isVideoScreen: boolean;
  totalWidgetMedia?: number | undefined;
  contributors: { value: string; label: string }[];
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  control: Control<any> | undefined;
  handleVideoView: ({ id }: { id: string }) => void;
  handleActiveView: ({ active }: { active: string }) => void;
  handleVideoViewScreen: ({ value }: { value: boolean }) => void;
  handleSelectedVideo: ({ media }: { media: MediaDataInterface | undefined }) => void;
  handlePageLoading: ({ active }: { active: boolean }) => void;
  handleFromDate: ({ fromDate }: { fromDate: Date | null }) => void;
  handleToDate: ({ toDate }: { toDate: Date | null }) => void;
  handleSearchParams: ({ searchParams }: { searchParams: string }) => void;
  paginatedData: ShowInterface | undefined;
  widgetMediaData: any;
  filterContributor: any;
  nextPage: any;
  prevPage: any;
  currentPage: any;
  goToPage: any;
  limit: number;
  totalPages: any;
  handleApplyFilter: ({ fromDate, toDate }: { fromDate: Date | null; toDate: Date | null }) => void;
  handleStaticApplyFilter: ({ range }: { range: string }) => void;
  //
  startDate: any;
  setStartDate: any;
  toDate: any;
  setToDate: any;
}

export type { ShowInterface, VideoViewContextInterface, Media, MediaDataInterface, UserInterface };
