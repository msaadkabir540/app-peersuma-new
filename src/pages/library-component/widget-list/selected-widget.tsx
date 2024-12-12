"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd-next";

import DropZone from "./drop-zone";
import EmbedCode from "./embed-code";
import SelectVideo from "./select-video";
import Loader from "@/src/components/loader";
import Selection from "@/src/components/selection";
import SelectedMediaCard from "./selected-media-card";

import { useLibrary } from "@/src/(context)/library-context-collection";

import { OptionType } from "@/src/components/selection/selection-interface";

import style from "./index.module.scss";

const SelectedWidget = () => {
  const [embedModal, setEmbedModal] = useState<{
    embedCodeModal: boolean;
    embedIframe: string;
  }>({
    embedCodeModal: false,
    embedIframe: "",
  });

  const context = useLibrary();
  const library = context && context?.library;
  const control = context && context?.control;
  const setValue = context && context?.setValue;
  const highlightIndex = context && context?.highlightIndex;
  const handleDragEnd = context && context?.handleDragEnd;
  const selectedWidget = context && context?.selectedWidget;
  const handelSetLibrary = context && context?.handelSetLibrary;
  const isLibraryLoading = context && context?.isLibraryLoading;
  const isMobileMediaList = context && context?.isMobileMediaList;
  const handleHighlightIndex = context && context?.handleHighlightIndex;
  const handleVideoModalClose = context && context?.handleVideoModalClose;
  const handleAddWidgetMediaOrder = context && context?.handleAddWidgetMediaOrder;

  useEffect(() => {
    const selectedValue = library?.widgets?.find((widget: any) => {
      return widget?.value === selectedWidget;
    }) || { value: "", label: "" };
    setValue?.("selectedWidget", selectedValue);
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  const onDragEnd = async (result: any) => {
    handleHighlightIndex({ value: null });
    if (!result.destination) return;
    const updatedWidget = { ...library.selectedWidget };
    const newMedia = [...updatedWidget.media];
    const [draggedItem] = newMedia.splice(result.source.index, 1);
    newMedia.splice(result.destination.index, 0, draggedItem);

    for (let i = 0; i < newMedia.length; i++) {
      newMedia[i].order = i + 1;
    }

    updatedWidget.media = newMedia?.filter((item) => item.type !== "mediaDrop");

    handelSetLibrary?.({ updatedWidget });
  };

  const handleEventEmbedModalClose = () => {
    setEmbedModal((prev) => ({ ...prev, embedCodeModal: false }));
  };

  const handleDragEnds = () => {
    handleDragEnd();
    handleHighlightIndex({ value: null });
  };

  const selectedWidgetResult = library?.selectedWidget?.media?.sort(
    (a: any, b: any) => a?.order - b?.order,
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    // Prevent the default behavior (usually not allowing drops)
    const dropContainer = e.currentTarget as HTMLElement;

    const scrollTop = dropContainer.scrollTop;

    const mouseY = e.clientY + scrollTop;

    // Calculate the index of the drop location
    const cards = Array.from(dropContainer.children);
    let dropIndex = cards.length; // Default to the end of the list

    for (const [index, card] of cards?.entries() as any) {
      const cardRect = card.getBoundingClientRect();
      const cardTop = cardRect.top + scrollTop;
      const cardMiddle = cardTop + cardRect.height / 2;

      if (mouseY < cardMiddle) {
        dropIndex = index;
        handleHighlightIndex({ value: dropIndex });
        e.preventDefault();
        break;
      }
    }

    // If the mouse is below all cards, set dropIndex to after the last card
    if (mouseY > cards[cards.length - 1]?.getBoundingClientRect().bottom) {
      handleHighlightIndex({ value: cards.length });
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dragMedia = JSON.parse(e.dataTransfer.getData("video_data"));
    const dropContainer = e.currentTarget as HTMLElement;
    const scrollTop = dropContainer.scrollTop;
    const mouseY = e.clientY + scrollTop;

    const cards = Array.from(dropContainer.children);
    let dropIndex = cards.length;

    for (const [index, card] of cards?.entries() as any) {
      const cardRect = card.getBoundingClientRect();
      const cardTop = cardRect.top + scrollTop;
      const cardMiddle = cardTop + cardRect.height / 2;
      if (mouseY < cardMiddle) {
        dropIndex = index;
        break;
      }
    }
    handleHighlightIndex({ value: null });
    handleAddWidgetMediaOrder &&
      handleAddWidgetMediaOrder({
        dragMedia,
        newOrder: dropIndex,
      });
  };

  return (
    <div>
      <Selection
        name="selectedWidget"
        isSearchable={false}
        customHeight={"44px"}
        control={control as any}
        boderCustomeStyle={true}
        placeholder="Select widget"
        iconClass={style.iconCustomClass}
        customIcon="/assets/down-gray.svg"
        customBorder={"1px solid #B8B8B8"}
        placeholderWidth="200px !important"
        imageClass={style.imageCustomClass}
        customBackgroundColor={"white !important"}
        options={library?.widgets as OptionType[]}
      />
      {isLibraryLoading ? (
        <div className={style.widgetHeightVideo}>
          <Loader pageLoader={false} loaderClass="!w-[70px] !h-[70px]" />
        </div>
      ) : (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="widget-media-list">
              {(provided: any) => (
                <div
                  {...{
                    onDrop,
                    onDragOver,
                  }}
                  onDragEnd={handleDragEnds}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={style.widgetHeight}
                >
                  {selectedWidgetResult?.map(({ _id }: any, index: any) => {
                    return (
                      <React.Fragment key={_id?._id || index}>
                        {selectedWidgetResult?.length != 0 && highlightIndex === index && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "10px",
                              textAlign: "center",
                              gap: "5px",
                            }}
                          >
                            <div className={style.stroke} />
                            <div className={style.plus}>
                              <Image
                                data-testid="close-icon"
                                className="!w-[24px] !h-[24px]"
                                src={"/assets/circle-plus.svg"}
                                alt="sortUp"
                                height="500"
                                width="500"
                              />
                            </div>
                            <div className={style.stroke} />
                          </div>
                        )}

                        <Draggable key={_id?._id} draggableId={_id?._id} index={index}>
                          {(provided: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <SelectedMediaCard
                                name={_id?.name}
                                mediaId={_id?._id}
                                duration={_id?.duration}
                                imagePath={_id?.thumbnailUrl}
                                selectedWidget={selectedWidget as string}
                              />
                            </div>
                          )}
                        </Draggable>
                      </React.Fragment>
                    );
                  })}
                  {selectedWidgetResult?.length != 0 &&
                    highlightIndex >= selectedWidgetResult?.length && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "10px",
                          textAlign: "center",
                          gap: "5px",
                        }}
                      >
                        <div className={style.stroke} />
                        <div className={style.plus}>
                          <Image
                            data-testid="close-icon"
                            className="!w-[24px] !h-[24px]"
                            src={"/assets/circle-plus.svg"}
                            alt="sortUp"
                            height="500"
                            width="500"
                          />
                        </div>
                        <div className={style.stroke} />
                      </div>
                    )}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </>
      )}
      {embedModal?.embedCodeModal && (
        <EmbedCode
          selectedWidget={selectedWidget}
          embedCodeModal={embedModal?.embedCodeModal}
          handleEventEmbedModalClose={handleEventEmbedModalClose}
        />
      )}
      <SelectVideo
        handleVideoModalClose={handleVideoModalClose}
        isMobileMediaList={isMobileMediaList}
      />
    </div>
  );
};

export default SelectedWidget;
