import React, { memo } from "react";

import ImageComponent from "../image-component";

import { ModalInterface } from "@/src/app/interface/modal-interface/modal-interface";

import style from "./modal.module.scss";

const Modal = ({
  open,
  children,
  className,
  bodyClass,
  showCross,
  handleClose,
  bodyPadding,
  modalWrapper,
  iconClassName,
  showIconClass,
}: ModalInterface) => {
  return (
    <>
      {open && (
        <div
          className={`${style.modalWrapper} ${modalWrapper}`}
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation();
            handleClose?.();
          }}
        >
          <div
            className={`${style.modalContentWrapper} ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {showCross && (
              <div className={`${style.showCrossCSS} ${iconClassName}`}>
                <ImageComponent
                  alt="cross"
                  src={"/assets/cross.png"}
                  className={showIconClass}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleClose?.()}
                />
              </div>
            )}
            <div
              className={`${style.body} ${bodyClass}`}
              {...(bodyPadding && { style: { padding: bodyPadding } })}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Modal);
