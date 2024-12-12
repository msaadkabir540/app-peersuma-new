import React from "react";

const StatusCompoenet = ({
  activeStatusFilter,
  handleClickStatusChange,
}: {
  handleClickStatusChange: ({ status }: { status: string }) => void;
  activeStatusFilter: { label: string; value: string }[];
}) => {
  return (
    <div className=" absolute bottom-[30px] right-[0px] inline-flex flex-col items-start gap-1.25 p-1.25 rounded-md !shadow-[0px_0px_6px_0px_rgba(0,0,0,0.25)] bg-white  w-[170px]">
      <div className=" !text-[14px] font-medium !text-[#000] capitalize flex items-center gap-[5px] pt-2.5 pr-0 pb-0 pl-3.5">
        Status
      </div>
      {activeStatusFilter?.map((status) => (
        <Status
          key={status?.value}
          status={status}
          handleClickStatusChange={handleClickStatusChange}
        />
      ))}
    </div>
  );
};

export default StatusCompoenet;

const Status = ({
  status,
  handleClickStatusChange,
}: {
  status: { label: string; value: string };
  handleClickStatusChange: ({ status }: { status: string }) => void;
}) => {
  const circleColors: any = {
    pending: "#B8B8B8",
    "in-progress": "#f8ae00",
    accept: "#96C9F4",
    rejected: "#FF4C4C",
    completed: "#50B498",
  };

  const color = circleColors[status?.value] || "#B8B8B8";

  const handleClickEvent = () => handleClickStatusChange({ status: status?.value });

  return (
    <>
      <div
        className=" w-full !text-[14px] font-medium capitalize flex items-center gap-[10px] px-3 py-[5px] cursor-pointer  hover:bg-[#F2F2F2]"
        onClick={handleClickEvent}
      >
        <div style={{ background: color }} className={` rounded-full w-[12px] h-[12px]`}></div>
        <div className="!text-[#000]"> {status?.label}</div>
      </div>
    </>
  );
};
