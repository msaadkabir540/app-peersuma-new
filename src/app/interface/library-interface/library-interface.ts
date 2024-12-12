// import {
//   Control,
//   UseFormHandleSubmit,
//   UseFormRegister,
//   UseFormReset,
//   UseFormSetValue,
//   // UseFormSetValue,
//   UseFormWatch,
// } from "react-hook-form";

// interface LibraryContextInterface {
//   isLoading?: boolean;
//   showWidgetSlider?: boolean;
//   isAddingMedia?: boolean;
//   isMobileMediaList?: boolean;
//   isLibraryLoading?: boolean;
//   selectedWidget?: string;
//   library: LibraryMediaInterface;
//   selectedClient?: string | undefined;
//   handleCreated?: (() => void) | undefined;
//   handleAddMedia?: (() => void) | undefined;
//   handleUpdateMedia?: (() => void) | undefined;
//   handleCloseWidget?: (() => void) | undefined;
//   handleDiscard?: (() => void) | undefined;
//   handleCloseCreateUpdate?: (() => void) | undefined;
//   handleVideoModalClose?: (() => void) | undefined;
//   handleSetShowWidgetSlider?: (() => void) | undefined;
//   handleSelectedClients?: ({ data }: { data: string }) => void;
//   handleMediaDeleted?: (({ mediaId }: { mediaId: string }) => void) | undefined;
//   setSearchParams?: any;
//   createUpdateMedia: {
//     isModal: boolean;
//     isCreate?: boolean;
//     isUpdate?: boolean;
//     mediaId?: string;
//   };

//   handleSelectedWidget?:
//     | (({ selectedWidgetId }: { selectedWidgetId: string | any }) => void)
//     | undefined;
//   handleSelectedValue?: (({ value }: { value: string | number | any }) => void) | undefined;
//   register?: UseFormRegister<LibraryFormInterface>;
//   control?: Control<LibraryFormInterface>;
//   watch?: any;

//   handleAddWidgetMediaOrder?:
//     | (({ dragMedia, newOrder }: { dragMedia: any; newOrder: number }) => void)
//     | undefined;
//   handleAddWidgetMediaSelectedMedia?: (({ mediaId }: { mediaId: string[] }) => void) | undefined;
//   setValue?: UseFormSetValue<LibraryFormInterface>;
//   reset?: UseFormReset<LibraryFormInterface>;
//   handleSubmit: UseFormHandleSubmit<LibraryFormInterface>;

//   handleAddWidgetMediaNewOrder?:
//     | (({ dragMedia, newOrder }: { dragMedia: any; newOrder: number }) => void)
//     | undefined;
//   //
//   handleMoveWidgetMediaLibraryUp?: (({ order }: { order: number }) => void) | undefined;

//   handelSetLibrary?:
//     | (({ updatedWidget }: { updatedWidget: SelectedWidgetInterface }) => void)
//     | undefined;
//   handleRemoveWidgetMediaLibrary: ({ widgetID }: { widgetID: string }) => void;
//   handleMoveWidgetMediaLibrary: ({ order }: { order: number }) => void;
// }

// interface FormSchemaInterface {
//   shortLink?: any;
//   thumbnailUrl: string;
//   downloads: any;
//   name: string;
//   duration: number;
//   description: string;
//   producers: { value: string; label: string }[];
//   shareable: boolean;
//   active: boolean;
//   selectedWidget?: WidgetInterface | undefined;
//   videoURL?: string | undefined;
// }

// interface LibraryFormInterface {
//   control: Control<FormSchemaInterface>;
//   reset: UseFormReset<FormSchemaInterface>;
//   watch: UseFormWatch<FormSchemaInterface>;
//   register: UseFormRegister<FormSchemaInterface>;
//   handleSubmit: UseFormHandleSubmit<FormSchemaInterface>;
//   shortLink?: any;
//   thumbnailUrl: string;
//   downloads: any;
//   name: string;
//   duration: number;
//   description: string;
//   producers: { value: string; label: string }[];
//   shareable: boolean;
//   active: boolean;
//   selectedWidget?: WidgetInterface | undefined;
//   videoURL?: string | undefined;
// }

// interface WidgetInterface {
//   label: string;
//   value: string;
// }

// interface LibraryMediaInterface {
//   widgets: WidgetInterface[];
//   embedModal?: any;
//   media?: MediaInterface[];
//   selectedWidget: SelectedWidgetInterface;
// }

// interface SelectedMediaChildInterface {
//   _id: string;
//   name: string;
//   description: string;
//   thumbnailUrl: string;
//   duration: number;
//   videoUrl: string;
//   assetId: string;
//   shortLink?: string;
//   downloads: [];
//   clientId: string;
//   producers: [];
//   active: boolean;
//   shareable: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// interface SelectedMediaInterface {
//   order: number;
//   type?: string;
//   _id: SelectedMediaChildInterface;
// }

// interface SelectedWidgetInterface {
//   _id: string;
//   id?: string;
//   media: SelectedMediaInterface[];
// }

// interface MediaInterface {
//   _id: string;
//   name: string;
//   description: string;
//   thumbnailUrl: string;
//   duration: number;
//   videoUrl: string;
//   assetId: string;
//   shortLink?: string;
//   downloads: [];
//   clientId: string;
//   producers: [];
//   active: boolean;
//   shareable: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// interface uploadedTranscriptionMediaInterface {
//   id?: string;
//   name: string;
//   url?: string;
//   fileType?: string;
//   fileSize?: number;
//   duration: number;
//   s3Key?: string;
//   thumbnailUrl?: string | undefined;
//   thumbnailS3Key?: string | undefined;
// }

// interface uploadMediaInterface {
//   uploads: uploadedTranscriptionMediaInterface[];
// }

// interface VimeoPlayerInterface {
//   url: string;
//   handleSetVideoTime?: ({ value }: { value: number | null }) => void;
// }

// interface CustomErrorSchema {
//   message: string;
// }

// interface ReactPlayerRefInterface {
//   getCurrentTime: () => void;
// }

// export type {
//   CustomErrorSchema,
//   VimeoPlayerInterface,
//   uploadMediaInterface,
//   FormSchemaInterface,
//   LibraryFormInterface,
//   LibraryMediaInterface,
//   SelectedWidgetInterface,
//   LibraryContextInterface,
//   ReactPlayerRefInterface,
//   uploadedTranscriptionMediaInterface,
// };
