"use client";
import React from "react";
import { toast } from "react-toastify";
import { AiFillWarning } from "react-icons/ai";

import styles from "./index.module.scss";

// Define the types of notification types
type NotificationType = "success" | "error" | "info" | "warn";

// Map notification types to corresponding icons
const iconMap: Record<any, JSX.Element> = {
  warn: <AiFillWarning className={styles.iconClass} color="#eed202" />,
};
// Function to create and display a notification
const createNotification = ({
  type,
  message,
  duration,
  description,
}: {
  message?: string;
  duration?: number;
  description?: string;
  type: NotificationType;
}) => {
  // Display the notification using toastify
  const toastId = toast(
    <>
      <div className={styles.notificationContainer}>
        <div className={`${styles.messageContainer} ${styles.messageContainer}`}>
          <div className={styles.toasterContainer}>
            <div className={styles.iconContainer}>{iconMap[type]}</div>
            <div className={styles.text}>
              <div className={`${styles.message}  ${styles?.[type]}`}>{message}</div>
              <div className={styles.description}>{description}</div>
            </div>
          </div>
        </div>
      </div>
    </>,
    {
      type: type as any,
    },
  );

  // Automatically close the notification after a certain duration
  setTimeout(
    () => {
      toast.dismiss(toastId);
    },
    duration ? duration : 3000,
  ); // Adjust duration as needed (e.g., 3000 milliseconds for 3 seconds)
};

export default createNotification;
