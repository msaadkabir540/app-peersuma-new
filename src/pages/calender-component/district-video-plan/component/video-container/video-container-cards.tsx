"use client";

import moment from "moment";
import Image from "next/image";
import React, { MouseEvent, useMemo, useRef, useState } from "react";
import { Droppable, DragDropContext, Draggable } from "react-beautiful-dnd-next";

import VideoCards from "../video-cards";
import Modal from "@/src/components/modal";
import Button from "@/src/components/button";
import Tooltip from "@/src/components/tooltip";

import { useOutsideClickHook } from "@/src/helper/helper";

import { useCalender } from "@/src/(context)/calender-context";
import { useClients } from "@/src/(context)/context-collection";

import { VideoRequestThemes } from "@/src/app/interface/calender-interface/calender-interface";

import style from "./index.module.scss";

const VideoContainerCards = ({
  onDrop,
  onDragOver,
  isDeleting,
  handleUpdate,
  handleOnDragEnd,
  videoThemesData,
  handleModalOpen,
  handleDeleteEvent,
  handleDeleteThemebyId,
}: {
  onDrop: any;
  onDragOver: any;
  handleOnDragEnd: any;
  isDeleting: boolean;
  videoThemesData: VideoRequestThemes[];
  handleUpdate: ({ themeId }: { themeId: string }) => void;
  handleModalOpen: ({ themeId }: { themeId: string }) => void;
  handleDeleteThemebyId: ({ themeId }: { themeId: string }) => void;
  handleDeleteEvent: ({ id, themeId }: { id: string; themeId: string }) => void;
}) => {
  const client = useClients();
  const currentUserRole = client && client?.currentUserRole;

  const clickRef = useRef<HTMLDivElement>(null);

  const [showMenu, setShowMenu] = useState<string>("");
  const [isModal, setIsModal] = useState<{
    isDeleteModal: boolean;
    isDeleteId: string | undefined;
  }>({
    isDeleteModal: false,
    isDeleteId: "",
  });

  const { onDragEnd } = useCalender();

  const hexToRgba = ({ hex, opacity }: { hex: string; opacity: number }) => {
    const normalizedHex = hex?.replace(/^#/, "");
    const r = parseInt(normalizedHex?.slice(0, 2), 16);
    const g = parseInt(normalizedHex?.slice(2, 4), 16);
    const b = parseInt(normalizedHex?.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const handleToggleEvents = (id: string) => {
    setShowMenu((prevId) => (prevId === id ? "" : id));
  };

  const handleDelete = ({
    e,
    themeId,
  }: {
    e?: MouseEvent<HTMLDivElement, globalThis.MouseEvent>;
    themeId: string;
  }) => {
    e?.preventDefault();
    e?.stopPropagation();
    setShowMenu("");
    setIsModal((prev) => ({ ...prev, isDeleteModal: true, isDeleteId: themeId }));
  };

  const handleClose = () => {
    setIsModal((prev) => ({ ...prev, isDeleteModal: false }));
  };

  useOutsideClickHook(clickRef, () => {
    setShowMenu("");
  });

  const getListStyle = useMemo(
    () =>
      ({ isDraggingOver, length }: { isDraggingOver: boolean; length: number }) => {
        return {
          padding: "15px 15px",
          transition: "1s ease",
          width: isDraggingOver && "calc(100% - 4px)",
          height: isDraggingOver && length <= 0 && "250px",
        };
      },
    [],
  );

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 py-3" ref={clickRef}>
          {videoThemesData?.map((themes: any) => {
            return (
              <span>
                <div
                  className="flex w-full md:max-w-[325px]  md:min-w-[325px] min-w-[300px] max-w-[300px] flex-col border flex-1 rounded-[15px] "
                  style={{
                    background: themes?.themeColor
                      ? hexToRgba({ hex: themes.themeColor, opacity: 0.4 })
                      : "transparent",
                  }}
                >
                  <div
                    style={{ background: themes?.themeColor }}
                    className="flex justify-between items-center w-full gap-1 rounded-tl-[15px] rounded-tr-[15px] p-4 cursor-pointer"
                  >
                    <div
                      className={`overflow-hidden text-[#0F0F0F] truncate whitespace-nowrap text-[16px] font-medium !hyphens-auto !break-words !break-all  ${style.dashClassThemes}`}
                    >
                      {themes?.themeName}
                    </div>
                    <div className="flex justify-end gap-1 items-center">
                      <div className="text-[#0F0F0F] text-[10px] font-medium whitespace-nowrap">
                        {`${moment(themes?.fromDate).format("MMM DD")} - ${moment(themes?.toDate).format("MMM DD")}`}
                      </div>
                      {currentUserRole != "producer" && (
                        <div className={`flex gap-1 relative`}>
                          <Tooltip backClass={style.tooltipMenuClass} text="Theme Menu">
                            <Image
                              data-testid="close-icon"
                              src={"/assets/threedots.png"}
                              alt="sortUp"
                              style={{
                                cursor: "pointer",
                              }}
                              className="!w-[20px] !h-[20px]"
                              height="100"
                              width="100"
                              onClick={() => handleToggleEvents(themes?._id)}
                            />
                          </Tooltip>
                          {showMenu === themes?._id && (
                            <div
                              className={`absolute bg-white  rounded-[5px] border border-[#B8B8B8] p-[7px] w-[90px] flex flex-col gap-[10px] top-6  z-50 right-0 `}
                            >
                              <DeleteTheme handleDelete={handleDelete} themeId={themes?._id} />
                              <EditImage handleUpdate={handleUpdate} themeId={themes?._id} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Droppable droppableId={`${themes?._id}`}>
                    {(provided: any, droppableSnapshot: any) => (
                      <div
                        onDragOver={onDragOver}
                        onDragEnd={handleOnDragEnd}
                        onDrop={(e) => onDrop({ e, id: themes?._id })}
                        {...provided.droppableProps}
                        style={
                          getListStyle({
                            isDraggingOver: droppableSnapshot?.isDraggingOver,
                            length: themes?.videoRequestIds?.length,
                          }) as React.CSSProperties
                        }
                        ref={provided.innerRef}
                        className={`flex flex-col gap-3 px-[15px] `}
                      >
                        {themes?.videoRequestIds?.map(
                          ({ videoRequestId: data }: any, index: number) => (
                            <Draggable draggableId={data?._id} index={index}>
                              {(provided: any) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <VideoCards
                                      id={data?._id}
                                      s3Key={data?.s3Key}
                                      videoUrl={data?.url}
                                      status={data?.status}
                                      videoRequestData={data}
                                      category={data?.category}
                                      audioUrl={data?.audioUrl}
                                      isDeleting={isDeleting}
                                      videoName={data?.videoName}
                                      name={data?.videoRequestName}
                                      assignTo={data?.assignTo?._id}
                                      assignToName={
                                        data?.assignTo?.username || data?.assignTo?.fullName
                                      }
                                      handleDeleteEvent={({ id }) =>
                                        handleDeleteEvent({ id, themeId: themes?._id })
                                      }
                                    />
                                  </div>
                                );
                              }}
                            </Draggable>
                          ),
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  <div className="flex justify-end items-end">
                    <Button
                      text="Create Request"
                      iconStart={"/assets/plus-black.svg"}
                      handleClick={() => handleModalOpen({ themeId: themes?._id })}
                      className={`!text-[#0F0F0F] text-sm !font-medium`}
                      btnClass="!rounded-md !bg-transparent !gap-[5px]"
                      imgClass="!h-[16px] !w-[16px]"
                    />
                  </div>

                  <Modal
                    open={isModal?.isDeleteModal}
                    handleClose={handleClose}
                    className={style.bodyModal}
                    modalWrapper={style.opacityModal}
                  >
                    <div className={style.deleteModal}>
                      <Image
                        data-testid="close-icon"
                        style={{
                          borderRadius: "10px",
                          textAlign: "center",
                          margin: "auto",
                        }}
                        className="!w-[60px] !h-[60px]"
                        src={"/assets/delete-red.svg"}
                        alt="sortUp"
                        height="100"
                        width="100"
                      />
                      <div className={style.deleteHeading}>
                        Are you sure you want to delete this theme?
                      </div>
                      <div className={style.text}>You will not be able to recover that theme.</div>

                      <div className="flex justify-end items-center gap-3 mt-5">
                        <Button
                          type="button"
                          text="Cancel"
                          handleClick={handleClose}
                          className={`!text-[#ED1C24] !font-semibold`}
                          btnClass={`!rounded-md ${style.redBorder} ${style.maxWidth}  !bg-transparent `}
                        />
                        <Button
                          type="button"
                          text="Yes, Delete"
                          isLoading={isDeleting}
                          handleClick={() =>
                            handleDeleteThemebyId({ themeId: isModal?.isDeleteId as string })
                          }
                          className={`!text-[#fff] !font-semibold`}
                          btnClass={` !rounded-md !bg-[#ED1C24]  ${style.maxWidth}   `}
                        />
                      </div>
                    </div>
                  </Modal>
                </div>
              </span>
            );
          })}
        </div>
      </DragDropContext>
    </>
  );
};

export default VideoContainerCards;

const EditImage = ({
  handleUpdate,
  themeId,
}: {
  themeId: string;
  handleUpdate: ({ themeId }: { themeId: string }) => void;
}) => {
  const handleUpdateTheme = () => {
    handleUpdate({ themeId });
  };
  return (
    <div className="flex gap-1  cursor-pointer" onClick={handleUpdateTheme}>
      <Image
        data-testid="close-icon"
        src={"/assets/pen-black.svg"}
        alt="sortUp"
        style={{
          cursor: "pointer",
        }}
        className="!w-[20px] !h-[20px]"
        height="100"
        width="100"
        onClick={handleUpdateTheme}
      />
      <div className="text-[14px]">Edit</div>
    </div>
  );
};

const DeleteTheme = ({
  handleDelete,
  themeId,
}: {
  themeId: string;
  handleDelete: ({ themeId }: { themeId: string }) => void;
}) => {
  const handleDeleteTheme = () => {
    handleDelete({ themeId });
  };
  return (
    <div className="flex gap-1 cursor-pointer" onClick={handleDeleteTheme}>
      <Image
        data-testid="close-icon"
        src={"/assets/delete-black.svg"}
        alt="sortUp"
        style={{
          cursor: "pointer",
        }}
        className="!w-[20px] !h-[20px]"
        height="100"
        width="100"
        onClick={handleDeleteTheme}
      />
      <div className="text-[14px]">Delete</div>
    </div>
  );
};
