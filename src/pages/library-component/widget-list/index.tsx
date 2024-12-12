import Link from "next/link";
import Image from "next/image";
import React, { Fragment, useState } from "react";

import EmbedCode from "./embed-code";
import Tooltip from "@/src/components/tooltip";
import SelectedWidget from "./selected-widget";
import WidgetListCard from "../components/widget-list-card";

import { useLibrary } from "@/src/(context)/library-context-collection";

import style from "../index.module.scss";

const WidgetList = () => {
  const [embedModal, setEmbedModal] = useState<{ embedCodeModal: boolean; embedIframe: string }>({
    embedCodeModal: false,
    embedIframe: "",
  });

  const context = useLibrary();
  const library = context && context?.library;
  const selectedWidget = context && context?.selectedWidget;
  const handleCloseWidget = context && context?.handleCloseWidget;

  const handleEmbedModal = () => setEmbedModal((prev) => ({ ...prev, embedCodeModal: true }));

  const handleEventEmbedModalClose = () => {
    setEmbedModal((prev) => ({ ...prev, embedCodeModal: false }));
  };

  const showList = [
    {
      name: "Preview",
      imagePath: "/assets/eye.svg",
      link: `/embed/${selectedWidget}`,
    },
    {
      name: "Showcase Link",
      imagePath: "/assets/video-playlist.png",
      link: `/showcase/${selectedWidget}`,
    },
    { name: "Embed Code", imagePath: "/assets/code.svg", handleEvent: handleEmbedModal },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-8 md:text-2xl text-xl font-medium text-[#000]">
          <div className="md:hidden block">
            <Image
              data-testid="close-icon"
              style={{
                borderRadius: "10px",
                cursor: "pointer",
              }}
              className="!w-[24px] !h-[24px]"
              src={"/assets/arrow-right-w.svg"}
              alt="sortUp"
              height="100"
              width="100"
              onClick={handleCloseWidget}
            />
          </div>
          Widget
        </div>
        <div className="flex justify-center items-center gap-1">
          {selectedWidget &&
            showList?.map((showList) => {
              return (
                <Link
                  key={showList?.name}
                  href={showList?.link ? showList?.link : ""}
                  target={showList?.name === "Embed Code" ? "" : "_blank"}
                >
                  <ShowLink
                    name={showList?.name}
                    imagePath={showList?.imagePath}
                    handleEvent={showList?.handleEvent}
                  />
                </Link>
              );
            })}
        </div>
      </div>
      {selectedWidget ? (
        <SelectedWidget />
      ) : (
        <>
          <div className="text-base font-normal text-[#0F0F0F] mb-3">
            Please click a widget below to select
          </div>
          <div className={style.widgetHeight}>
            {library?.widgets?.map((widget: any) => {
              return (
                <Fragment key={widget?.label}>
                  <WidgetListCard widgetName={widget?.label} widgetId={widget?.value} />
                </Fragment>
              );
            })}
          </div>
        </>
      )}

      {embedModal?.embedCodeModal && (
        <EmbedCode
          selectedWidget={selectedWidget}
          embedCodeModal={embedModal?.embedCodeModal}
          handleEventEmbedModalClose={handleEventEmbedModalClose}
        />
      )}
    </>
  );
};
export default WidgetList;

const ShowLink = ({
  name,
  imagePath,
  handleEvent,
}: {
  name: string;
  imagePath: string;
  handleEvent: (() => void) | undefined;
}) => {
  return (
    <Tooltip backClass="" text={name}>
      <div className={style.widgetLinkDiv} onClick={handleEvent}>
        <Image
          data-testid="close-icon"
          style={{
            cursor: "pointer",
          }}
          className="!w-[24px] !h-[24px]"
          src={imagePath}
          alt="sortUp"
          height="100"
          width="100"
        />
      </div>
    </Tooltip>
  );
};
