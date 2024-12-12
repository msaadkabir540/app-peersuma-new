"use client";

import Link from "next/link";
import React, { Fragment, useEffect, useMemo } from "react";

import Layout from "../layout/page";
import WidgetList from "./widget-list";
import Button from "@/src/components/button";
import Loader from "@/src/components/loader";
import CardsComponent from "./components/cards-component";
import SelectionSection from "./components/selection-section";

import { useClients } from "@/src/(context)/context-collection";
import { useLibrary } from "@/src/(context)/library-context-collection";

import style from "./index.module.scss";

const LibraryComponent = () => {
  const context = useLibrary();
  const library = context && context?.library;
  const isLoading = context && context?.isLoading;
  const showWidgetSlider = context && context?.showWidgetSlider;
  const isLibraryLoading = context && context?.isLibraryLoading;
  const handlePageRedirect = context && context?.handlePageRedirect;
  const handleUpdateThumbnail = context && context?.handleUpdateThumbnail;
  const handleSelectedClients = context && context?.handleSelectedClients;

  const clientContext = useClients();
  const libraryId = clientContext && clientContext?.libraryId;
  const isShowLibraryProcessCard = clientContext && clientContext?.isShowLibraryProcessCard;

  const isToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!isShowLibraryProcessCard && isToken != null && isToken != undefined) {
      handleUpdateThumbnail();
    }
  }, [isShowLibraryProcessCard, isToken]);

  const libraryMediaData = useMemo(() => {
    return library?.media?.filter(
      ({ _id, isUpdate }: { _id: string; isUpdate: boolean }) => _id !== libraryId && !isUpdate,
    );
  }, [library, libraryId]);

  return (
    <div>
      {isLoading ? (
        <Loader diffHeight={34} pageLoader={true} />
      ) : (
        <>
          <Layout
            handlePageRedirect={handlePageRedirect}
            handleSelectedClients={handleSelectedClients}
          >
            <div className="md:px-5 p-3 w-full">
              <div
                id="container"
                className={`grid grid-template-columns  ${showWidgetSlider ? "grid-cols-10" : "grid-cols-1"} gap-1`}
              >
                <div id="div1" className={` col-span-10 md:col-span-7 md:px-4 w-full`}>
                  {/* must have ti change the name */}
                  <div className="md:text-2xl text-xl font-medium">{`Library Videos (${libraryMediaData?.length || 0}) `}</div>
                  <SelectionSection />
                  <div
                    className={`${style.gridCardsHeight} ${isLibraryLoading ? "flex justify-center items-center" : ""}`}
                  >
                    {isLibraryLoading ? (
                      <Loader />
                    ) : (
                      <div
                        className={`${!showWidgetSlider ? style.cardContainer : style.cardContainerWidget} `}
                      >
                        {libraryMediaData?.map((data: any) => {
                          return (
                            <Fragment key={data?._id}>
                              <CardsComponent
                                mediaId={data?._id}
                                status={data?.active}
                                videoName={data?.name}
                                date={data?.updatedAt}
                                duration={data?.duration}
                                isUpdated={data?.isUpdate}
                                shortLink={data?.shortLink}
                                videoAssetId={data?.assetId}
                                imagePath={data?.thumbnailUrl}
                              />
                            </Fragment>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                {showWidgetSlider && (
                  <div
                    id="div2"
                    className={`${style.hiddenShow} md:col-span-3 pl-4 border-l-[1px] border-l-[#B8B8B8] transition-all duration-300 ease-in-out ${
                      showWidgetSlider ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                  >
                    <WidgetList />
                  </div>
                )}
                <div className={`${style.showHide}`}>
                  <div
                    className={`${style.backDropDiv} transition-all duration-300 ease-in-out ${
                      showWidgetSlider ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                  >
                    <WidgetList />
                  </div>
                </div>
              </div>
              <Link
                href={isShowLibraryProcessCard ? "#" : "/create-library"}
                onClick={(e) => {
                  if (isShowLibraryProcessCard) {
                    e.preventDefault();
                  }
                }}
              >
                <Button
                  type="button"
                  text="New"
                  disabled={isShowLibraryProcessCard ? false : true}
                  btnClass={` ${isShowLibraryProcessCard ? `!bg-[#B8B8B8] !cursor-default` : `!bg-[#ED1C24]`}  !rounded-md   !mt-[15px] !w-full !max-w-[none] md:!hidden !block`}
                  className={`!text-[#fff] !font-semibold `}
                />
              </Link>
            </div>
          </Layout>
        </>
      )}
    </div>
  );
};

export default LibraryComponent;
