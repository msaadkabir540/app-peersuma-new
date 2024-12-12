"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import Layout from "../layout/page";
import Table from "@/src/components/table";
import Modal from "@/src/components/modal";
import CreateWidget from "./create-widget";
import Loader from "@/src/components/loader";
import Button from "@/src/components/button";

import { getAllWidgets, updateWidget } from "@/src/app/api/widget";

import { RowsInterface } from "@/src/components/table/table-interface";
import { WidgetTableRows } from "@/src/interface/tables-interface";

import { useClients } from "@/src/(context)/context-collection";
import { Columns, TableActions } from "@/src/app/variable/widgets/columns-actions";

import styles from "./index.module.scss";
import createNotification from "@/src/components/create-notification";

const WidgetsComponent: React.FC = () => {
  const route = useRouter();
  const { control } = useForm({});

  const clientContext = useClients();
  const selectedClient = clientContext?.selectedClientIds;

  const [loader, setLoader] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<{
    rowId?: number;
    isModal: boolean;
    isUpdate: boolean;
    isCreate: boolean;
  }>({
    isModal: false,
    isUpdate: false,
    isCreate: false,
  });
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [widgetLists, setWidgetLists] = useState<WidgetTableRows[]>([]);
  const [deleteWidgetsId, setDeleteWidgetsId] = useState<string>("");

  const handleStatusChange = async ({ row }: { row: RowsInterface }) => {
    await updateWidget({
      _id: row._id,
      data: { active: !row?.active },
    });
  };

  const handleGetWidgets = async () => {
    setLoader(true);
    const response = await getAllWidgets({ params: { clientId: selectedClient as string } });

    if (response?.allWidgets) {
      setWidgetLists(
        response?.allWidgets?.map((x: any) => {
          return {
            name: x?.name || "",
            active: x?.active || false,
            updatedAt: x?.updatedAt || "",
            _id: x?._id,
            id: x?._id,
          };
        }),
      );
    } else if (response?.response?.status === 403) {
      setWidgetLists([]);
      localStorage.setItem("redirect_url", "/" as string);
      route.push("/");
      createNotification({
        type: "error",
        message: "Error!",
        description: response?.response?.data?.msg,
      });
    }
    setLoader(false);
    setPageLoading(false);
  };

  const handleCreateUpdate = () =>
    setOpenModal((prev) => ({ ...prev, isModal: true, isCreate: true }));

  const handlePageRedirect = () => {
    setPageLoading(true);
  };

  const handleCloseModal = () => {
    setOpenModal((prev) => ({
      ...prev,
      isModal: false,
      isCreate: false,
      isUpdate: false,
    }));
  };

  const handleUpdate = () => {
    setOpenModal((prev) => ({
      ...prev,
      rowId: 1 + 1,
    }));
  };

  useEffect(() => {
    (openModal?.rowId || selectedClient) && handleGetWidgets();
  }, [selectedClient, openModal?.rowId]);

  return (
    <>
      {pageLoading ? (
        <Loader diffHeight={34} pageLoader={true} />
      ) : (
        <Layout>
          <div className={styles.activeTab} style={{ width: "100%" }}>
            <div className={styles.create}>
              <div className="md:text-2xl text-xl font-medium">
                {`Widgets (${widgetLists?.length || 0}) `}
              </div>
              <Button text="Add Widget" type="button" handleClick={handleCreateUpdate} />
            </div>
            {loader ? (
              <Loader pageLoader={true} />
            ) : (
              <Table
                customTableClass={styles.customTableClassWidget}
                mainTableClass={styles.mainTableClassCustom}
                rows={widgetLists as []}
                columns={Columns({ handleStatusChange, control })}
                isLoading={loader}
                headingClassName={styles.headingClassNameWidget}
                actions={({ row }) => (
                  <TableActions
                    row={row}
                    setDeleteAction={({ id }) => {
                      setDeleteWidgetsId(id);
                    }}
                    handleSetLoading={handlePageRedirect}
                    deleteWidgetsId={deleteWidgetsId}
                    removeDeletedWidget={(id) => {
                      let widgetListsCopy = [...widgetLists];
                      widgetListsCopy = widgetListsCopy.filter((x) => x?._id !== id);
                      setWidgetLists(widgetListsCopy);
                    }}
                  />
                )}
              />
            )}
          </div>

          <Modal
            open={openModal?.isModal}
            handleClose={handleCloseModal}
            className={`${styles.tryNowModal} `}
            iconClassName={styles.iconClassName}
          >
            <CreateWidget handleClose={handleCloseModal} handleUpdate={handleUpdate} />
          </Modal>
        </Layout>
      )}
    </>
  );
};

export default WidgetsComponent;
