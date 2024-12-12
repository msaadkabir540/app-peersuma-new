import React from "react";
import { useRouter } from "next/navigation";

import Table from "@/src/components/table";
import Button from "@/src/components/button";

import Columns from "@/src/app/variable/video-view/column";
import ShareDropDown from "@/src/components/share-dropdown";

import { useVideoView } from "@/src/(context)/video-context-collection";

import { RowsInterface, TableColumns } from "@/src/components/table/table-interface";
import { MediaDataInterface } from "@/src/app/interface/video-view-interface/video-view-interface";

import styles from "./index.module.scss";

const VideoTableView = () => {
  const route = useRouter();
  const context = useVideoView();
  const widgetMediaData = context && context?.widgetMediaData;
  const widget = context && context?.widget;
  const handlePageLoading = context && context?.handlePageLoading;
  const handleSearchParams = context && context?.handleSearchParams;
  const handleSelectedVideo = context && context?.handleSelectedVideo;
  const handleVideoViewScreen = context && context?.handleVideoViewScreen;

  const handleRedirectVideoPlayer = ({ media }: { media: MediaDataInterface }) => {
    handleSelectedVideo?.({ media: media });
    handleVideoViewScreen?.({ value: true });
    handleSearchParams?.({ searchParams: media?._id });
    handlePageLoading?.({ active: true });
    route.push(`/video-detail/${widget?._id}?videoplayerId=${media?.assetId}`);
  };

  const handleRowClick = (row: RowsInterface) => handleRedirectVideoPlayer({ media: row as any });

  const videoUrl = ({ assetId }: { assetId: string }) =>
    `${process.env.NEXT_PUBLIC_APP_URL}video-detail/${widget?._id}?videoplayerId=${assetId}`;
  return (
    <div>
      <Table
        rows={widgetMediaData as any}
        handleRowClick={handleRowClick}
        trClassName={"cursor-pointer hover:bg-[#e5e7eb] ml-2"}
        columns={Columns as TableColumns[]}
        noDataClass={styles.noVideoDataClass}
        isLoading={false}
        mainTableClass={styles.mainVideoTableClass}
        headingClassName={styles.headingClassName}
        actions={({ row }) => {
          return (
            <td className="flex justify-center items-center gap-2  relative" key={row?._id}>
              <div className="md:flex flex justify-center items-center gap-3 h-12">
                {row?.shareable && (
                  <ShareDropDown
                    video_name={row?.name}
                    video_url={videoUrl({ assetId: row?.assetId })}
                  />
                )}
                <Button
                  iconStart={"/assets/new-tab.svg"}
                  btnClass={styles.btnClass}
                  imgClass={styles.iconClass}
                  toolTip={"Edit media"}
                  type="button"
                  handleClick={() => {
                    handleRedirectVideoPlayer?.({ media: row } as any);
                  }}
                />
              </div>
            </td>
          );
        }}
      />
    </div>
  );
};
export default VideoTableView;
