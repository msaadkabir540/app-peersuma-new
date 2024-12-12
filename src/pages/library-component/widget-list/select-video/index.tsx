import React, { useState } from "react";

import Input from "@/src/components/input";
import Modal from "@/src/components/modal";
import Button from "@/src/components/button";
import Loader from "@/src/components/loader";
import DropDownMenu from "@/src/components/drop-down-menu";
import CardsComponent from "../../components/cards-component";

import { useLibrary } from "@/src/(context)/library-context-collection";

import style from "./index.module.scss";

const SelectVideo = ({
  handleVideoModalClose,
  isMobileMediaList,
}: {
  isMobileMediaList: boolean | undefined;
  handleVideoModalClose: (() => void) | undefined;
}) => {
  const [selectedMediaId, setSelectedMediaId] = useState<string[]>([]);

  const context = useLibrary();
  const library = context && context?.library;
  const setSearchParams = context && context?.setSearchParams;
  const handleSelectedValue = context && context?.handleSelectedValue;
  const selectedWidget = context && context?.selectedWidget;
  const isLibraryLoading = context && context?.isLibraryLoading;
  const handleAddWidgetMediaSelectedMedia = context && context?.handleAddWidgetMediaSelectedMedia;

  const selectedWidgetName = library?.widgets?.find(
    (widget: { value: string; label: string }) => widget?.value === selectedWidget,
  );

  const handleSetEvent = (e: any) => setSearchParams(e.target.value);

  const handleGetAllValues = ({ mediaId }: { mediaId: string }) => {
    setSelectedMediaId((prev) =>
      prev.includes(mediaId) ? prev.filter((id) => id !== mediaId) : [...prev, mediaId],
    );
  };

  const handleClickEvent = () => {
    handleAddWidgetMediaSelectedMedia?.({ mediaId: selectedMediaId });
    handleVideoModalClose?.();
  };

  return (
    <Modal
      // showCross={true}
      open={isMobileMediaList}
      className={style.modalCustomWrapperCustomClass}
      handleClose={handleVideoModalClose}
      modalWrapper={style.modalWrapperCustomModal}
    >
      <div className={style.seleteVideoContainer}>
        <div className="text-xl font-semibold text-[#0F0F0F] ">Select Video</div>

        <div className={style.widgetNameContainer}>
          widget
          <div className={style.widgetNameClass}>{selectedWidgetName?.label}</div>
        </div>
        <div>
          <Input
            type="text"
            name={"searchTerm"}
            showSearchIcon={true}
            searchIcon=" !top-[13px]"
            onChange={handleSetEvent}
            placeholder="Type and search"
            inputField={style.inputSearch}
            container={style.inputSearchContainer}
          />
        </div>
        <div className="my-[10px] w-fit">
          <DropDownMenu
            placeholder={"Type"}
            option={statusOptions as []}
            menuCustomClass=" !mt-[10px]"
            handleSelectedValue={handleSelectedValue as any}
          />
        </div>

        <div
          className={`flex flex-col gap-[15px] ${style.cardContainer}  ${isLibraryLoading ? "flex justify-center items-center" : ""}`}
        >
          {isLibraryLoading ? (
            <Loader />
          ) : (
            library?.media?.map((data: any) => {
              return (
                <React.Fragment key={data?._id}>
                  <CardsComponent
                    isMobile={true}
                    mediaId={data?._id}
                    status={data?.active}
                    videoName={data?.name}
                    date={data?.updatedAt}
                    duration={data?.duration}
                    isUpdated={data?.isUpdate}
                    shortLink={data?.shortLink}
                    imagePath={data?.thumbnailUrl}
                    handleGetAllValues={handleGetAllValues}
                    selectedMediaId={selectedMediaId} // Pass selectedMediaId to the Card component
                  />
                </React.Fragment>
              );
            })
          )}
        </div>
        <Button
          type="button"
          text="Save"
          handleClick={handleClickEvent}
          btnClass={`!rounded-md ${style.redBorder} ${style.maxWidth}  !bg-[#ED1C24] mt-[20px]`}
        />
      </div>
    </Modal>
  );
};
export default SelectVideo;

const statusOptions = [
  { label: "Active Videos", value: true },
  { label: "Archived Videos", value: false },
  { label: "All Videos", value: "" },
];
