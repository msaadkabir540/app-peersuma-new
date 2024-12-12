import React, { useState } from "react";
import { writeText } from "clipboard-polyfill";

import Tooltip from "@/src/components/tooltip";

import createNotification from "@/src/components/create-notification";

import style from "./share.module.scss";
import menuStyles from "./drop.module.scss";

interface ShareDropDownInterface {
  allow?: boolean;
  video_url: string;
  video_name: string;
  shareColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  classNameModalProps?: string;
}

const ShareDropDown: React.FC<ShareDropDownInterface> = ({
  video_url,
  video_name,
  shareColor,
  buttonTextColor,
  classNameModalProps,
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };
  return (
    <>
      {open && (
        <div
          aria-hidden="true"
          onClick={() => setOpen((prev) => !prev)}
          className={style.backdrop}
        ></div>
      )}
      <div className={style.main}>
        <Tooltip text="Share" backClass={style.tooltipClass}>
          <div className=" !cursor-pointer z-10" onClick={handleClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9.472 13.708L14.936 16.892M14.928 8.108L9.472 11.292M19.4 6.9C19.4 8.22548 18.3255 9.3 17 9.3C15.6745 9.3 14.6 8.22548 14.6 6.9C14.6 5.57452 15.6745 4.5 17 4.5C18.3255 4.5 19.4 5.57452 19.4 6.9ZM9.8 12.5C9.8 13.8255 8.72548 14.9 7.4 14.9C6.07452 14.9 5 13.8255 5 12.5C5 11.1745 6.07452 10.1 7.4 10.1C8.72548 10.1 9.8 11.1745 9.8 12.5ZM19.4 18.1C19.4 19.4255 18.3255 20.5 17 20.5C15.6745 20.5 14.6 19.4255 14.6 18.1C14.6 16.7745 15.6745 15.7 17 15.7C18.3255 15.7 19.4 16.7745 19.4 18.1Z"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke={buttonTextColor}
              />
            </svg>
          </div>
        </Tooltip>

        {open && (
          <ShareDropDownMenu {...{ video_name, video_url, classNameModalProps, shareColor }} />
        )}
      </div>
    </>
  );
};

export default ShareDropDown;

const ShareDropDownMenu = ({
  video_name,
  video_url,
  shareColor,
  classNameModalProps,
}: {
  video_name: string;
  video_url: string;
  shareColor?: string;
  classNameModalProps?: string;
}) => {
  return (
    <div className={`${menuStyles.main} ${classNameModalProps}`}>
      {shareData({ video_name, video_url, shareColor })?.map((ele, index) => (
        <div
          style={{ color: shareColor }}
          className={menuStyles.flex}
          aria-label={ele?.name}
          key={index}
          onClick={ele.handleClick}
          aria-hidden="true"
        >
          {ele?.icon}

          <p aria-label={ele?.name}>{ele?.name}</p>
        </div>
      ))}
    </div>
  );
};

const shareData = ({
  video_name,
  video_url,
  shareColor,
}: {
  video_name: string;
  video_url: string;
  shareColor?: string;
}) => [
  {
    name: "Copy link",
    icon: (
      <svg
        stroke="currentColor"
        fill={shareColor}
        strokeWidth="0"
        viewBox="0 0 512 512"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={"Copy link Icons"}
      >
        <path
          fill={shareColor}
          d="M280 341.1l-1.2.1c-3.6.4-7 2-9.6 4.5l-64.6 64.6c-13.7 13.7-32 21.2-51.5 21.2s-37.8-7.5-51.5-21.2c-13.7-13.7-21.2-32-21.2-51.5s7.5-37.8 21.2-51.5l68.6-68.6c3.5-3.5 7.3-6.6 11.4-9.3 4.6-3 9.6-5.6 14.8-7.5 4.8-1.8 9.9-3 15-3.7 3.4-.5 6.9-.7 10.2-.7 1.4 0 2.8.1 4.6.2 17.7 1.1 34.4 8.6 46.8 21 7.7 7.7 13.6 17.1 17.1 27.3 2.8 8 11.2 12.5 19.3 10.1.1 0 .2-.1.3-.1.1 0 .2 0 .2-.1 8.1-2.5 12.8-11 10.5-19.1-4.4-15.6-12.2-28.7-24.6-41-15.6-15.6-35.9-25.8-57.6-29.3-1.9-.3-3.8-.6-5.7-.8-3.7-.4-7.4-.6-11.1-.6-2.6 0-5.2.1-7.7.3-5.4.4-10.8 1.2-16.2 2.5-1.1.2-2.1.5-3.2.8-6.7 1.8-13.3 4.2-19.5 7.3-10.3 5.1-19.6 11.7-27.7 19.9l-68.6 68.6C58.9 304.4 48 330.8 48 359c0 28.2 10.9 54.6 30.7 74.4C98.5 453.1 124.9 464 153 464c28.2 0 54.6-10.9 74.4-30.7l65.3-65.3c10.4-10.5 2-28.3-12.7-26.9z"
        ></path>
        <path
          fill={shareColor}
          d="M433.3 78.7C413.5 58.9 387.1 48 359 48s-54.6 10.9-74.4 30.7l-63.7 63.7c-9.7 9.7-3.6 26.3 10.1 27.4 4.7.4 9.3-1.3 12.7-4.6l63.8-63.6c13.7-13.7 32-21.2 51.5-21.2s37.8 7.5 51.5 21.2c13.7 13.7 21.2 32 21.2 51.5s-7.5 37.8-21.2 51.5l-68.6 68.6c-3.5 3.5-7.3 6.6-11.4 9.3-4.6 3-9.6 5.6-14.8 7.5-4.8 1.8-9.9 3-15 3.7-3.4.5-6.9.7-10.2.7-1.4 0-2.9-.1-4.6-.2-17.7-1.1-34.4-8.6-46.8-21-7.3-7.3-12.8-16-16.4-25.5-2.9-7.7-11.1-11.9-19.1-9.8-8.9 2.3-14.1 11.7-11.3 20.5 4.5 14 12.1 25.9 23.7 37.5l.2.2c16.9 16.9 39.4 27.6 63.3 30.1 3.7.4 7.4.6 11.1.6 2.6 0 5.2-.1 7.8-.3 6.5-.5 13-1.6 19.3-3.2 6.7-1.8 13.3-4.2 19.5-7.3 10.3-5.1 19.6-11.7 27.7-19.9l68.6-68.6c19.8-19.8 30.7-46.2 30.7-74.4s-11.1-54.6-30.9-74.4z"
        ></path>
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
    },
  },
  {
    name: "Whatsapp",
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="whatsapp"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        aria-label={"Whatsapp Icon"}
      >
        <path
          aria-label={"Whatsapp Icon"}
          fill="currentColor"
          d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
        ></path>
      </svg>
    ),
    handleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      const linkedinShareLink = `https://api.whatsapp.com/send?text=${video_name}:%0a${video_url}`;
      window.open(linkedinShareLink, "_blank");
    },
  },
  {
    name: "Twitter",
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="twitter"
        role="img"
        aria-label={"Twitter Icon"}
        xmlns="http://www.w3.org/2000/svg"
        enableBackground="new 0 0 72 72"
        viewBox="0 0 72 72"
        id="twitter-x"
      >
        <switch>
          <g>
            <path
              aria-label={"Twitter Icon"}
              fill="currentColor"
              d="M42.5,31.2L66,6h-6L39.8,27.6L24,6H4l24.6,33.6L4,66
			h6l21.3-22.8L48,66h20L42.5,31.2z M12.9,10h8l38.1,52h-8L12.9,10z"
            ></path>
          </g>
        </switch>
      </svg>
    ),
    handleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      const twitterShareLink = `https://twitter.com/intent/tweet?url=${video_url}`;
      window.open(twitterShareLink, "pop", "width=600, height=400, scrollbars=no");
    },
  },
  {
    name: "Facebook",
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="facebook"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        aria-label={"Facebook Icon"}
      >
        <path
          aria-label={"Facebook Icon"}
          fill="currentColor"
          d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
        ></path>
      </svg>
    ),
    handleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?u=${video_url}`;
      window.open(facebookShareLink, "pop", "width=600, height=400, scrollbars=no");
    },
  },
  {
    name: "Email",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 512 512"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={"Email Icon"}
      >
        <path d="M460.6 147.3L353 256.9c-.8.8-.8 2 0 2.8l75.3 80.2c5.1 5.1 5.1 13.3 0 18.4-2.5 2.5-5.9 3.8-9.2 3.8s-6.7-1.3-9.2-3.8l-75-79.9c-.8-.8-2.1-.8-2.9 0L313.7 297c-15.3 15.5-35.6 24.1-57.4 24.2-22.1.1-43.1-9.2-58.6-24.9l-17.6-17.9c-.8-.8-2.1-.8-2.9 0l-75 79.9c-2.5 2.5-5.9 3.8-9.2 3.8s-6.7-1.3-9.2-3.8c-5.1-5.1-5.1-13.3 0-18.4l75.3-80.2c.7-.8.7-2 0-2.8L51.4 147.3c-1.3-1.3-3.4-.4-3.4 1.4V368c0 17.6 14.4 32 32 32h352c17.6 0 32-14.4 32-32V148.7c0-1.8-2.2-2.6-3.4-1.4z"></path>
        <path d="M256 295.1c14.8 0 28.7-5.8 39.1-16.4L452 119c-5.5-4.4-12.3-7-19.8-7H79.9c-7.5 0-14.4 2.6-19.8 7L217 278.7c10.3 10.5 24.2 16.4 39 16.4z"></path>
      </svg>
    ),
    handleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      const linkedinShareLink = `mailto:?subject=Peersuma: ${video_name}&body=From Peersuma:%0A%0A${video_name}%0A%0A${video_url}`;
      window.open(linkedinShareLink, "_blank");
    },
  },
  {
    name: "LinkedIn",
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="linkedin"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        aria-label={"LinkedIn Icon"}
      >
        <path
          aria-label={"LinkedIn Icon"}
          fill="currentColor"
          d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
        ></path>
      </svg>
    ),
    handleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      const linkedinShareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${video_url}`;
      window.open(linkedinShareLink, "pop", "width=600, height=400, scrollbars=no");
    },
  },
];
