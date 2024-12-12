"use client";

import React, { useEffect, useState } from "react";

import Button from "@/src/components/button";

import styles from "./index.module.scss";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
const CustomInstallPWA = () => {
  const [isShow, setIsShow] = useState<boolean>(true);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent>();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as any);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt?.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("PWA installed");
      } else {
        console.log("PWA installation dismissed");
      }
      setDeferredPrompt(undefined);
      setIsShow(false); // Hide the button after the user responds
    }
  };

  return (
    <>
      {deferredPrompt && isShow && (
        <div className="md:hidden block  shadow-xl fixed w-full top-[0%]   p-3 z-[999] bg-[#ed1c24]">
          <div className="flex  justify-between items-center gap-1">
            <div className="sm:text-sm text-xs text-center text-cyan-50">
              Install the Peersuma App?
            </div>
            <div className="flex gap-1 items-baseline">
              {deferredPrompt && (
                <Button
                  btnClass={styles.installBtn}
                  className={styles.installBtnText}
                  iconEnd={"/assets/download-white.png"}
                  text={"Install"}
                  handleClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleInstallClick();
                  }}
                />
              )}
              <Button
                btnClass={styles.installBtnCross}
                className={styles.installBtnText}
                imgClass={styles.imgClassCross}
                iconEnd={"/assets/corss-white.png"}
                handleClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsShow(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomInstallPWA;
