"use client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import Input from "@/src/components/input";
import Loader from "@/src/components/loader";
import Button from "@/src/components/button";
import InventoryCards from "./inventory-card";
import Selection from "@/src/components/selection";
import createNotification from "@/src/components/create-notification";

import { useDebounce } from "@/src/app/custom-hook/debounce";

import { getAllInventoryData } from "@/src/app/api/inventory";

import { categoryOptions } from "@/src/helper/helper";

import { InventoryMapInterface } from "@/src/app/interface/calender-interface/calender-interface";

import { useCalender } from "@/src/(context)/calender-context";
import { useClients } from "@/src/(context)/context-collection";

import styles from "./index.module.scss";

const InventoryComponent = ({ handleActive }: { handleActive?: () => void }) => {
  const route = useRouter();
  const { control, watch } = useForm<{
    category?: { label: string; value: string };
    sortOrder?: { label: string; value: string };
  }>({
    defaultValues: {
      sortOrder: { label: "Alphabetical Order (A-Z)", value: "alphabetical-ascending" },
    },
  });

  const clientContext = useClients();
  const selectedClient = clientContext && clientContext?.selectedClient;
  const selectedClientIds = clientContext && clientContext?.selectedClientIds;
  const selectedClientId = selectedClientIds || selectedClient;

  const [videoPlanMenu, setVideoPlanMenu] = useState<{
    isMenuOpen: boolean;
  }>({
    isMenuOpen: false,
  });

  const [currentSongPlaying, setCurrentSongPlaying] = useState<{
    currentSongId: string;
    play: boolean;
  }>({
    currentSongId: "",
    play: false,
  });

  const [Loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<string>("");
  const [inventoriesCollection, setInventoriesCollection] = useState([]);

  const { handleAddIntoVideoPlan, invontriesId, videoThemesData } = useCalender();

  const searchParamsValue = useDebounce({ value: searchParams, milliSeconds: 2000 });
  const handleSearchEvent = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchParams(e.target.value);
  const handleSetEventCross = () => setSearchParams("");

  const handleAddIntoVideoPlanEvent = ({ themeId }: { themeId: string }) => {
    setVideoPlanMenu((prev) => ({ ...prev, isMenuOpen: true }));
    handleAddIntoVideoPlan({ themeId, invontriesId: invontriesId });
  };

  // video project api call here
  const sortOrder = useMemo(() => {
    const selectedSortOrder = watch("sortOrder");

    switch (selectedSortOrder?.value) {
      case "alphabetical-descending":
        return { sortBy: "name", sortOrder: "desc" };
      case "alphabetical-ascending":
        return { sortBy: "name", sortOrder: "asc" };
      case "level-ascending":
        return { sortBy: "level", sortOrder: "asc" };
      case "level-descending":
        return { sortBy: "level", sortOrder: "desc" };
      case "complexity-ascending":
        return { sortBy: "complexity", sortOrder: "asc" };
      case "complexity-descending":
        return { sortBy: "complexity", sortOrder: "desc" };
      default:
        return { sortBy: "name", sortOrder: "asc" };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("sortOrder")]);

  const handleGetAllInventory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllInventoryData({
        clientId: selectedClientId as string,
        search: searchParamsValue,
        category: watch("category")?.value as any,
        sortOrder,
      });

      if (res?.status === 200) {
        setInventoriesCollection(res?.data?.allInventory);
      } else if (res?.response?.status === 403) {
        route.push("/");
        localStorage.setItem("redirect_url", "/" as string);
        createNotification({
          type: "error",
          message: "Error!",
          description: res?.response?.data?.msg,
        });
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParamsValue, watch("category"), selectedClientId, sortOrder]);

  useEffect(() => {
    handleGetAllInventory();
  }, [searchParamsValue, watch("category"), handleGetAllInventory]);

  const handleMenuVideoPlan = () => {
    setVideoPlanMenu((prev) => ({ ...prev, isMenuOpen: !videoPlanMenu?.isMenuOpen }));
  };

  const handlePlayAndPause = ({ currentId }: { currentId: string }) => {
    const previous = { ...currentSongPlaying };
    if (previous?.currentSongId === currentId) {
      setCurrentSongPlaying({ ...previous, play: !(previous?.play || false) });
    } else {
      setCurrentSongPlaying({ currentSongId: currentId, play: true });
    }
  };

  const handleAudioPause = () => {
    setCurrentSongPlaying({ currentSongId: "", play: false });
  };

  return (
    <div className="w-full max-w-full">
      <div className="overflow-hidden text-[#0F0F0F] truncate text-[16px] font-medium  flex gap-3 items-center">
        <div className="md:hidden block">
          <Image
            data-testid="close-icon"
            src={"/assets/arrow-top.svg"}
            style={{ cursor: "pointer", transform: "rotate(90deg)" }}
            alt="sortUp"
            className="!w-[24px] !h-[24px]"
            height="100"
            width="100"
            onClick={handleActive}
          />
        </div>
        Inventory
      </div>
      <div className="my-3">
        <Input
          type="text"
          crossIcons={true}
          name={"searchTerm"}
          value={searchParams}
          showSearchIcon={true}
          searchIcon=" !top-[13px]"
          onChange={handleSearchEvent}
          placeholder="Type and search"
          inputField={styles.inputSearch}
          handleClickCross={handleSetEventCross}
          container={styles.inputSearchContainer}
        />
      </div>
      <div className="flex justify-end items-end gap-2 flex-col">
        <div className="w-full max-w-fit min-w-fit">
          <Selection
            control={control}
            name={"sortOrder"}
            isClearable={true}
            customPadding={true}
            isSearchable={false}
            options={sortOptions}
            placeholder="Apply Sort"
            boderCustomeStyle={true}
            iconClass={"!top-[8px]"}
            customMenuWidth={"250px"}
            customPaddingRight={"2px"}
            customBorder={"1px solid #B8B8B8"}
          />
        </div>
        <div className="w-full max-w-fit min-w-fit">
          <Selection
            control={control}
            name={"category"}
            isClearable={true}
            isSearchable={false}
            customPadding={true}
            boderCustomeStyle={true}
            iconClass={"!top-[10px]"}
            options={categoryOptions}
            placeholder="Select category"
            customBorder={"1px solid #B8B8B8"}
          />
        </div>
      </div>
      <div>
        <div className=" text-[#0F0F0F] truncate text-[16px] font-normal ">
          {inventoriesCollection?.length} items
        </div>
        <div
          className={`w-full !overflow-y-scroll overflow-x-hidden md:h-[calc(100vh-337px)] h-[calc(100vh-255px)] ${Loading ? "flex justify-center items-center" : ""} `}
        >
          {Loading ? (
            <Loader pageLoader={false} loaderClass={styles.loaderClassInventory} />
          ) : (
            inventoriesCollection?.map(
              ({
                url,
                _id,
                name,
                color,
                level,
                audioUrl,
                category,
                complexity,
                description,
                instructions,
                thumbnailUrl,
                customeThumbnailUrl,
              }: InventoryMapInterface) => {
                return (
                  <InventoryCards
                    key={_id}
                    name={name}
                    level={level}
                    color={color}
                    videoUrl={url}
                    inventoryId={_id}
                    category={category}
                    description={description}
                    complexity={complexity}
                    instructions={instructions}
                    audioUrl={audioUrl}
                    handleAudioPause={handleAudioPause}
                    handlePlayAndPause={handlePlayAndPause}
                    currentSongPlaying={currentSongPlaying}
                    imageUrl={customeThumbnailUrl ? customeThumbnailUrl : thumbnailUrl}
                  />
                );
              },
            )
          )}
        </div>

        {videoPlanMenu?.isMenuOpen && invontriesId && (
          <div className="md:hidden absolute max-w-[90%] right-[5%] bottom-14 flex w-full z-10 items-start gap-[5px] rounded-[5px] bg-white shadow-[0px_0px_6px_0px_rgba(0,0,0,0.25)]">
            <div
              className={`flex flex-col justify-start items-start h-[150px] !overflow-scroll w-full ${styles.scrollbarThin}`}
            >
              {videoThemesData?.map((data) => {
                return (
                  <MenuList
                    id={data?._id}
                    key={data?._id}
                    name={data?.themeName}
                    handleAddIntoVideoPlanEvent={handleAddIntoVideoPlanEvent}
                  />
                );
              })}
            </div>
          </div>
        )}
        <div className="md:hidden block absolute w-full left-0 p-2.5 z-10 bottom-0  px-5">
          <Button
            type="button"
            text="Add to"
            handleClick={handleMenuVideoPlan}
            disabled={invontriesId != "" ? false : true}
            className={`!text-[#fff] !font-semibold `}
            btnClass={` !rounded-md !bg-[#ED1C24] ${invontriesId ? "!bg-[#ED1C24]" : "!bg-[#d1d1d1]"} !mt-[15px] !w-full !max-w-[none] md:!hidden !block`}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryComponent;

const MenuList = ({
  name,
  id,
  handleAddIntoVideoPlanEvent,
}: {
  name: string;
  id: string;
  handleAddIntoVideoPlanEvent: ({ themeId }: { themeId: string }) => void;
}) => {
  const handleClickEvent = () => handleAddIntoVideoPlanEvent({ themeId: id });
  return (
    <div className="w-full p-[10px] cursor-pointer" onClick={handleClickEvent}>
      {name}
    </div>
  );
};

const sortOptions = [
  { label: "Alphabetical Order (A-Z)", value: "alphabetical-ascending" },
  { label: "Alphabetical Order (Z-A)", value: "alphabetical-descending" },
  { label: "Levels (Ascending)", value: "level-ascending" },
  { label: "Levels (Descending)", value: "level-descending" },
  { label: "Complexity (Ascending)", value: "complexity-ascending" },
  { label: "Complexity (Descending) ", value: "complexity-descending" },
];
