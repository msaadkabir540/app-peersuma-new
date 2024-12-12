interface AssetsInterface {
  id: string;
  order: number;
  asset: {
    id: string;
    public_name: string;
    public_description: string;
    public_social_share: boolean;
    public_plays: boolean;
    version: {
      external_id: string;
      video_status: string;
      video_duration: number;
      plays: number;
      thumbnails: ThumbnailInterface[];
    };
  };
}
interface ThumbnailInterface {
  width: number;
  height: number;
  url_image: string;
}

export type { AssetsInterface };
