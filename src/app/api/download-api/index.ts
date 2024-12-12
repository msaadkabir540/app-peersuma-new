import createNotification from "@/src/components/create-notification";

import axios from "axios";

export const downloadApi = {
  performAction: async ({ action, data }: { action: string; data: any }) => {
    if (action === "download-file") {
      try {
        const response: any = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}utils/download?Key=${data?.s3Key}&fileName=${data?.finalFileName}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const blob = await response.blob();

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");

          link.href = url;
          link.download = data?.finalFileName;
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(url);
        } else {
          // Handle error
          console.error("Failed to download file");
        }
      } catch (error) {
        console.error("Error:", error);
        createNotification({
          type: "error",
          message: "Internal Server Error",
        });
        return { error: "Internal Server Error" };
      }
    }
  },
};

export const handleDownload = async ({
  s3Key,
  name,
  finalFileName,
}: {
  s3Key?: string;
  name?: string;
  finalFileName?: string;
}) => {
  const response: any = await axios({
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}utils/download`,
    params: { Key: s3Key, fileName: finalFileName || name },
    responseType: "blob",
  });

  const link = document.createElement("a");
  const href = URL.createObjectURL(response.data);
  link.href = href;
  link.download =
    finalFileName || name?.split(`_${new Date().getFullYear()}`)[0] + `.${name?.split(".").pop()}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
  if (response.status === 200) {
    createNotification({
      type: "success",
      message: "Success!",
      description: "Ready for Downloading!",
    });
  }
};
