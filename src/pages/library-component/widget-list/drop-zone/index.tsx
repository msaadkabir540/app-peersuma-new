import React from "react";
import Image from "next/image";

import { useLibrary } from "@/src/(context)/library-context-collection";

import styles from "./index.module.scss";

const DropZone = ({ order }: { order?: number }) => {
  const context = useLibrary();
  const handleRemove = context && context?.handleRemove;
  const handleSetOrder = context && context?.handleSetOrder;
  const handleAddWidgetMediaOrder = context && context?.handleAddWidgetMediaOrder;
  const handleVideoModalOpen = context && context?.handleVideoModalOpen;
  const handleAddWidgetMediaNewOrder = context && context?.handleAddWidgetMediaNewOrder;

  const onDragOver = (e: React.DragEvent) => {
    // Prevent the default behavior (usually not allowing drops)
    e.preventDefault();
  };

  const onDrop = async (e: React.DragEvent) => {
    // Prevent the default behavior (usually open as a link)
    e.preventDefault();
    // Get the data that was transferred during the drag operation
    const dragMedia = JSON.parse(e.dataTransfer.getData("video_data"));
    const newOrder = order ? order : 1;
    if (!order) {
      handleAddWidgetMediaNewOrder && handleAddWidgetMediaNewOrder({ dragMedia, newOrder });
    } else {
      handleAddWidgetMediaOrder && handleAddWidgetMediaOrder({ dragMedia, newOrder });
    }
  };

  const handleEventRemove = () => {
    order && handleRemove?.({ order });
  };

  const handleClickEvent = () => {
    order && handleSetOrder?.({ orderNumber: order });
    handleVideoModalOpen?.();
  };

  const handleDragEnd = () => {
    document.getElementById("drag-player")?.remove();
  };

  return (
    <div
      className={order ? styles.dragOrderArea : styles.dragArea}
      {...{
        onDrop,
        onDragOver,
      }}
      onDragEnd={handleDragEnd}
    >
      <span className={`${styles.hiddenShowCustom} ${order ? "!w-full text-center " : ""}`}>
        Drop video here to add into this widget
      </span>
      <span
        className={`${styles.showHideCustom} ${order ? "!w-full text-center " : ""}`}
        onClick={handleClickEvent}
      >
        Select Video from Library
      </span>
      {order && (
        <Image
          style={{
            borderRadius: "10px",
            objectFit: "cover",
            cursor: "pointer",
          }}
          width="100"
          height="100"
          alt="removeIcon"
          onClick={handleEventRemove}
          data-testid="removeIcon"
          className={styles.removeBtn}
          src={"/assets/delete-red.svg"}
        />
      )}
    </div>
  );
};

export default DropZone;
