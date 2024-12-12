"use client";

import moment from "moment";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";
import React, { useMemo, useState } from "react";

import CommentBox from "./comment-box";
import Input from "@/src/components/input";
import ImageComponent from "@/src/components/image-component";

import {
  CommentBoxInterface,
  CommentInterface,
} from "@/src/app/interface/draft-interface/draft-interface";

import styles from "./index.module.scss";

const Comments = ({
  commentsData,
  draftId,
  currentUser,
  videoProjectId,
  clientId,

  handleAddComments,
}: CommentBoxInterface) => {
  const isMobile = useMediaQuery("(max-width: 500px)");

  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleAddComment = async ({ comment, id }: { comment: string; id: string }) => {
    if (comment.trim().length === 0) {
      setError("Enter the Comment");
    } else {
      setError("");
      await handleAddComments({
        comment,
        videoProjectId,
        clientId,
        currentUser,
        videoDraftId: id,
      });
      setComment("");
    }
  };

  const commentsResult = useMemo(() => {
    return (
      commentsData?.map((comment: CommentInterface) => {
        let name = "";
        let color;
        if (comment?.userId?._id === currentUser?.userId) {
          color = styles.colorPink;
          name = comment?.userId?.username || comment?.userId?.fullName || "Unknown";
        } else {
          name = comment?.userId?.username || comment?.userId?.fullName || "Unknown";
          color = styles.colorSkyblue;
        }
        const date = moment(comment?.createdAt).format("YYYY-MM-DD | hh:mm A");
        const description = comment?.comment ?? "";

        return { id: comment?._id, name, date, description, color };
      }) || []
    );
  }, [commentsData, currentUser?.userId]);

  return (
    <div
      className={`rounded-[10px] border border-[#B8B8B8] bg-[#FFF] relative shadow-[0px_0px_6px_0px_rgba(0,0,0,0.25)] flex
         p-[15px] flex-col justify-end items-center gap-[15px] flex-[1_0_0] self-stretch`}
    >
      <div className={`w-full mt-3  md:gap-6 !overflow-auto  ${styles.heightCommentClass}`}>
        <div className=" mt-[10px] overflow-x-scroll">
          <div className="text-[#0F0F0F] text-[18px] font-medium leading-normal absolute bg-[#fff] w-full left-0 top-0 rounded-t-[10px] px-[15px] pt-[15px]">
            Chat:
          </div>
          {commentsResult?.length === 0 ? (
            <div className={`h-full flex justify-center items-center ${styles.imagesClass}`}>
              <Image
                data-testid="close-icon"
                style={{
                  borderRadius: "10px",
                }}
                src={"/assets/no-comment.png"}
                alt="Close Nav Bar"
                height="100"
                width="100"
              />
            </div>
          ) : (
            commentsResult?.map(({ name, date, description, id, color }) => {
              return (
                <>
                  <div className="flex justify-start border-b-[1px] md:p-3 p-2" key={id}>
                    <CommentBox time={date} name={name} comment={description} color={color} />
                  </div>
                </>
              );
            })
          )}
        </div>
      </div>

      <div className="relative w-full">
        <Input
          errorClass={styles.errorClass}
          errorMessage={error}
          name="comment"
          value={comment}
          placeholder="Type message here"
          inputField={styles.inputField}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />

        <div className="absolute md:top-[13px] md:right-5 top-[13px] right-3 !cursor-pointer">
          <ImageComponent
            src={"/assets/arrow-top.svg"}
            alt="send comment icon"
            style={{
              transform: "rotate(271deg)",
            }}
            containerHeight={!isMobile ? "24px" : " 24px"}
            containerWidth={!isMobile ? "24px" : " 24px"}
            onClick={() => handleAddComment({ comment, id: draftId })}
          />
        </div>
      </div>
    </div>
  );
};

export default Comments;
