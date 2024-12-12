import React, { useRef, useState } from "react";
import { writeText } from "clipboard-polyfill";

import Button from "../button";
import createNotification from "../create-notification";

import { useOutsideClickHook } from "@/src/helper/helper";

import style from "./share.module.scss";
import menuStyles from "./drop.module.scss";

interface ShareDropDownInterface {
  video_url: string;
  video_name: string;
  classNameModalProps?: string;
  isButton?: boolean;
}

const ShareDropDown: React.FC<ShareDropDownInterface> = ({
  isButton,
  video_url,
  video_name,
  classNameModalProps,
}) => {
  const clickRef = useRef<HTMLDivElement | null>(null);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  useOutsideClickHook(clickRef, () => {
    setShareMenuOpen(false);
  });

  const handleClickToClose = () => {
    setShareMenuOpen(false);
  };

  return (
    <>
      <div className={style.main} ref={clickRef}>
        <Button
          ref={clickRef}
          iconStart={isButton ? "/assets/share-red.svg" : "/assets/share-black.svg"}
          btnClass={isButton ? style.btnTransparent : style.btnClass}
          imgClass={isButton ? style.iconRedClass : style.iconClass}
          className={isButton ? style.btnColoredClass : ""}
          text={isButton && "Share"}
          toolTip={"share"}
          type="button"
          handleClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShareMenuOpen(!shareMenuOpen);
          }}
        />

        {shareMenuOpen && (
          <ShareDropDownMenu
            {...{ video_name, video_url, classNameModalProps, handleClickToClose }}
          />
        )}
      </div>
    </>
  );
};

export default ShareDropDown;

const ShareDropDownMenu = ({
  video_name,
  video_url,
  classNameModalProps,
  handleClickToClose,
}: {
  video_name: string;
  video_url: string;
  classNameModalProps?: string;
  handleClickToClose?: () => void;
}) => {
  const shareButtonData = shareData({ video_name, video_url, handleClickToClose });
  return (
    <div className={`${menuStyles.main} ${classNameModalProps}`}>
      {shareButtonData?.map((ele) => (
        <div
          key={ele.name}
          aria-hidden="true"
          aria-label={ele.name}
          onClick={ele.handleClick}
          className={menuStyles.flex}
        >
          {ele.icon}

          <p aria-label={ele.name}>{ele.name}</p>
        </div>
      ))}
    </div>
  );
};

const shareData = ({
  video_name,
  video_url,
  handleClickToClose,
}: {
  video_name: string;
  video_url: string;
  handleClickToClose?: () => void;
}) => [
  {
    name: "Copy link",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
      >
        <path
          d="M14.0546 10.9448C13.6768 10.567 13.2283 10.2672 12.7347 10.0627C12.2411 9.85819 11.7121 9.75293 11.1778 9.75293C10.6435 9.75293 10.1144 9.85819 9.62077 10.0627C9.12716 10.2672 8.67868 10.567 8.30093 10.9448L4.19119 15.0558C3.42837 15.8188 2.99989 16.8535 3 17.9324C3.00011 19.0113 3.42881 20.046 4.19179 20.8088C4.95477 21.5716 5.98953 22.0001 7.06844 22C8.14734 21.9999 9.18201 21.5712 9.94483 20.8082L10.33 20.4434M9.94483 15.0558C10.3226 15.4336 10.7711 15.7334 11.2647 15.9379C11.7583 16.1424 12.2873 16.2477 12.8216 16.2477C13.3559 16.2477 13.885 16.1424 14.3786 15.9379C14.8722 15.7334 15.3207 15.4336 15.6985 15.0558L19.807 10.9448C20.57 10.182 20.9987 9.14734 20.9988 8.06844C20.9989 6.98953 20.5704 5.95477 19.8076 5.19179C19.0448 4.42881 18.0101 4.00011 16.9312 4C15.8523 3.99989 14.8176 4.42837 14.0546 5.19119L12.821 6.34432"
          stroke="#ED1C24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    handleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      writeText(video_url);
      createNotification({
        type: "success",
        message: "Success!",
        description: "Video Url Copied Successfully.",
      });
      handleClickToClose?.();
    },
  },
  {
    name: "Whatsapp",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
      >
        <g clipPath="url(#clip0_2486_5977)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2.5C6.477 2.5 2 6.977 2 12.5C2 14.39 2.525 16.16 3.438 17.668L2.546 20.7C2.49478 20.8741 2.49141 21.0587 2.53624 21.2346C2.58107 21.4104 2.67245 21.5709 2.80076 21.6992C2.92907 21.8276 3.08958 21.9189 3.26542 21.9638C3.44125 22.0086 3.62592 22.0052 3.8 21.954L6.832 21.062C8.39068 22.0051 10.1782 22.5025 12 22.5C17.523 22.5 22 18.023 22 12.5C22 6.977 17.523 2.5 12 2.5ZM9.738 14.763C11.761 16.785 13.692 17.052 14.374 17.077C15.411 17.115 16.421 16.323 16.814 15.404C16.8636 15.2897 16.8816 15.1641 16.8661 15.0405C16.8507 14.9168 16.8023 14.7996 16.726 14.701C16.178 14.001 15.437 13.498 14.713 12.998C14.5618 12.8935 14.3761 12.8516 14.1947 12.881C14.0133 12.9105 13.8503 13.009 13.74 13.156L13.14 14.071C13.1085 14.1202 13.0593 14.1555 13.0026 14.1696C12.9459 14.1837 12.8859 14.1756 12.835 14.147C12.428 13.914 11.835 13.518 11.409 13.092C10.983 12.666 10.611 12.1 10.402 11.719C10.3761 11.6706 10.3686 11.6144 10.3809 11.5609C10.3932 11.5074 10.4245 11.4602 10.469 11.428L11.393 10.742C11.5249 10.6273 11.61 10.4682 11.6321 10.2949C11.6542 10.1215 11.6118 9.94611 11.513 9.802C11.065 9.146 10.543 8.312 9.786 7.759C9.68831 7.6882 9.57386 7.64406 9.45393 7.63091C9.334 7.61776 9.21271 7.63606 9.102 7.684C8.182 8.078 7.386 9.088 7.424 10.127C7.449 10.809 7.716 12.74 9.738 14.763Z"
            fill="#ED1C24"
          />
        </g>
        <defs>
          <clipPath id="clip0_2486_5977">
            <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
          </clipPath>
        </defs>
      </svg>
    ),
    handleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      const linkedinShareLink = `https://api.whatsapp.com/send?text=${video_name}:%0a${video_url}`;
      window.open(linkedinShareLink, "_blank");
      handleClickToClose?.();
    },
  },
  {
    name: "Twitter",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
      >
        <path
          d="M18.2453 2.75H21.5547L14.3266 11.0094L22.8297 22.25H16.1734L10.9562 15.4344L4.99375 22.25H1.67969L9.40937 13.4141L1.25781 2.75H8.08281L12.7937 8.97969L18.2453 2.75ZM17.0828 20.2719H18.9156L7.08437 4.625H5.11562L17.0828 20.2719Z"
          fill="#ED1C24"
        />
      </svg>
    ),
    handleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      const twitterShareLink = `https://twitter.com/intent/tweet?url=${video_url}`;
      window.open(twitterShareLink, "pop", "width=600, height=400, scrollbars=no");
      handleClickToClose?.();
    },
  },
  {
    name: "Facebook",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
      >
        <g clipPath="url(#clip0_2486_5987)">
          <path
            d="M23.9991 12.5735C23.9991 5.90454 18.6261 0.498535 11.9991 0.498535C5.36909 0.500035 -0.00390625 5.90454 -0.00390625 12.575C-0.00390625 18.6005 4.38509 23.5955 10.1211 24.5015V16.064H7.07609V12.575H10.1241V9.91253C10.1241 6.88704 11.9166 5.21603 14.6571 5.21603C15.9711 5.21603 17.3436 5.45154 17.3436 5.45154V8.42154H15.8301C14.3406 8.42154 13.8756 9.35303 13.8756 10.3085V12.5735H17.2026L16.6716 16.0625H13.8741V24.5C19.6101 23.594 23.9991 18.599 23.9991 12.5735Z"
            fill="#ED1C24"
          />
        </g>
        <defs>
          <clipPath id="clip0_2486_5987">
            <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
          </clipPath>
        </defs>
      </svg>
    ),
    handleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?u=${video_url}`;
      window.open(facebookShareLink, "pop", "width=600, height=400, scrollbars=no");
      handleClickToClose?.();
    },
  },
  {
    name: "Email",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
      >
        <path
          d="M19.875 4.25H4.125C3.42904 4.25074 2.76179 4.52755 2.26967 5.01967C1.77755 5.51179 1.50074 6.17904 1.5 6.875V18.125C1.50074 18.821 1.77755 19.4882 2.26967 19.9803C2.76179 20.4725 3.42904 20.7493 4.125 20.75H19.875C20.571 20.7493 21.2382 20.4725 21.7303 19.9803C22.2225 19.4882 22.4993 18.821 22.5 18.125V6.875C22.4993 6.17904 22.2225 5.51179 21.7303 5.01967C21.2382 4.52755 20.571 4.25074 19.875 4.25ZM19.2103 8.59203L12.4603 13.842C12.3287 13.9444 12.1667 13.9999 12 13.9999C11.8333 13.9999 11.6713 13.9444 11.5397 13.842L4.78969 8.59203C4.71038 8.53214 4.64377 8.45709 4.59372 8.37123C4.54367 8.28537 4.51118 8.19042 4.49815 8.0919C4.48511 7.99338 4.49179 7.89325 4.51778 7.79733C4.54378 7.70142 4.58858 7.61162 4.64958 7.53316C4.71058 7.45471 4.78656 7.38916 4.87312 7.34032C4.95967 7.29149 5.05506 7.26034 5.15376 7.24869C5.25245 7.23704 5.35248 7.24513 5.44802 7.27247C5.54357 7.29981 5.63272 7.34587 5.71031 7.40797L12 12.2998L18.2897 7.40797C18.447 7.2892 18.6447 7.23711 18.84 7.26296C19.0354 7.28881 19.2128 7.39053 19.3338 7.54612C19.4547 7.70171 19.5096 7.89866 19.4865 8.09439C19.4634 8.29011 19.3642 8.46888 19.2103 8.59203Z"
          fill="#ED1C24"
        />
      </svg>
    ),
    handleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      const linkedinShareLink = `mailto:?subject=Peersuma: ${video_name}&body=From Peersuma:%0A%0A${video_name}%0A%0A${video_url}`;
      window.open(linkedinShareLink, "_blank");
      handleClickToClose?.();
    },
  },
  {
    name: "LinkedIn",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
      >
        <path
          d="M19 3.5C19.5304 3.5 20.0391 3.71071 20.4142 4.08579C20.7893 4.46086 21 4.96957 21 5.5V19.5C21 20.0304 20.7893 20.5391 20.4142 20.9142C20.0391 21.2893 19.5304 21.5 19 21.5H5C4.46957 21.5 3.96086 21.2893 3.58579 20.9142C3.21071 20.5391 3 20.0304 3 19.5V5.5C3 4.96957 3.21071 4.46086 3.58579 4.08579C3.96086 3.71071 4.46957 3.5 5 3.5H19ZM18.5 19V13.7C18.5 12.8354 18.1565 12.0062 17.5452 11.3948C16.9338 10.7835 16.1046 10.44 15.24 10.44C14.39 10.44 13.4 10.96 12.92 11.74V10.63H10.13V19H12.92V14.07C12.92 13.3 13.54 12.67 14.31 12.67C14.6813 12.67 15.0374 12.8175 15.2999 13.0801C15.5625 13.3426 15.71 13.6987 15.71 14.07V19H18.5ZM6.88 9.06C7.32556 9.06 7.75288 8.883 8.06794 8.56794C8.383 8.25288 8.56 7.82556 8.56 7.38C8.56 6.45 7.81 5.69 6.88 5.69C6.43178 5.69 6.00193 5.86805 5.68499 6.18499C5.36805 6.50193 5.19 6.93178 5.19 7.38C5.19 8.31 5.95 9.06 6.88 9.06ZM8.27 19V10.63H5.5V19H8.27Z"
          fill="#ED1C24"
        />
      </svg>
    ),
    handleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      const linkedinShareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${video_url}`;
      window.open(linkedinShareLink, "pop", "width=600, height=400, scrollbars=no");
      handleClickToClose?.();
    },
  },
];
