// contexts/PostsContext.tsx
"use client";
import React, { useContext, useState, useEffect, createContext, useCallback } from "react";

import { getAllUsers, getUserById } from "../app/api/users";
import { clientApi } from "../app/api/clients";

import { UsersInterface } from "../app/interface/user-interface/user-interface";
import { SelectedClientInterface } from "../app/interface/client-interface/client-interface";
import { updateReplaceVideoLibrary } from "../app/api/library-api";
interface ClientContextInterface {
  loggedInUser: any;
  isUserLoading?: boolean;
  selectedClientIds?: string | null;
  isToken?: string | null;
  libraryId?: string | null;
  storedOtp?: string | null;
  currentUserRole?: string | null;
  isUpateTrue?: string | null;
  userLoggedIn: string | null;
  selectedClient: string | undefined;
  allUser: UsersInterface[] | undefined;
  allClients: SelectedClientInterface[] | undefined;
  clientList: { value: string; label: string }[] | undefined;
  handleSelectedClient: ({ data }: { data: string }) => void;
  handleUpdateClient?: () => void;
  isShowLibraryProcessCard: boolean;
  handleHideLibraryProcessCard: () => void;
  handleShowLibraryProcessCard: () => void;
}

const ClientContext = createContext<ClientContextInterface | undefined>(undefined);

export const ContextCollection = ({ children }: { children: React.ReactNode }) => {
  const isToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const storedOtp = typeof window !== "undefined" ? localStorage.getItem("pin") : null;
  const currentUserRole = typeof window !== "undefined" ? localStorage.getItem("user-role") : null;
  const currentLoggedInUser = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const selectedClientIds =
    typeof window !== "undefined" ? localStorage.getItem("selectedClient") : null;
  const userLoggedIn = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const libraryId = typeof window !== "undefined" ? localStorage.getItem("libraryId") : null;
  const videoId = typeof window !== "undefined" ? localStorage.getItem("videoId") : null;

  const [isUpdate, setIsUpdate] = useState<any>();
  const [loggedInUser, setLoggedInUser] = useState<any>();
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [allUser, setAllUser] = useState<UsersInterface[] | undefined>();
  const [selectedClient, setSelectedClient] = useState<string | undefined>();
  const [allClients, setAllClients] = useState<SelectedClientInterface[] | undefined>();
  const [isShowLibraryProcessCard, setIsShowLibraryProcessCard] = useState<boolean>(false);
  const [clientList, setClientList] = useState<{ value: string; label: string }[] | undefined>();

  const handleShowLibraryProcessCard = () => {
    setIsShowLibraryProcessCard(true);
  };
  const handleHideLibraryProcessCard = () => {
    setIsShowLibraryProcessCard(false);
  };

  const handleUpdateClient = () => setIsUpdate(1 + 1);

  const handleSelectedClient = ({ data }: { data: string }) => {
    if (data != undefined) {
      const client = loggedInUser?.clientId?.find((client: any) => client?.clientId?._id === data);
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedClient", data);
        localStorage.setItem("user-role", client?.role);
        setSelectedClient(data);
      }
    }
  };

  const handleGetAllUser = async ({ selectedClientId }: { selectedClientId?: string | null }) => {
    const clientId = selectedClientId;
    setIsUserLoading(true);
    const userResponse = await getAllUsers({
      params: {
        clientId: clientId as string,
      },
    });
    if (userResponse?.status === 200) {
      setAllUser(userResponse?.data?.users);
    }
    setIsUserLoading(false);
  };

  const handleGetLoggedUser = useCallback(async () => {
    const loggedInUser = await getUserById({ userId: currentLoggedInUser as string });

    if (loggedInUser) {
      setLoggedInUser(loggedInUser?.data);
    }
    const loggedUserCLient = loggedInUser?.data?.clientId?.map(
      ({ clientId }: { clientId: { _id: string; name: string } }) => {
        return { label: clientId?.name, value: clientId?._id };
      },
    );
    const loggedClientData = loggedInUser?.data?.clientId?.map((data: any) => data?.clientId);

    setAllClients(loggedClientData);
    setClientList(loggedUserCLient);
  }, [setAllClients, setClientList, setLoggedInUser]);

  const handleUpdateReplace = useCallback(async () => {
    try {
      setIsShowLibraryProcessCard(true);
      const res = await updateReplaceVideoLibrary({
        id: libraryId!,
        videoId: videoId!,
      });
      if (res) {
        setIsShowLibraryProcessCard(false);
        localStorage.removeItem("videoId");
        localStorage.removeItem("libraryId");
      }
    } catch (error) {
      console.error(error);
    }
  }, [libraryId, videoId]);

  useEffect(() => {
    if (isToken) {
      handleGetAllUser({ selectedClientId: selectedClientIds });
    }
  }, [isToken, selectedClientIds]);

  useEffect(() => {
    if (libraryId && videoId) {
      handleUpdateReplace();
    }
  }, [libraryId, videoId, handleUpdateReplace]);

  useEffect(() => {
    if (isToken || isUpdate) {
      handleGetLoggedUser();
    }
  }, [isToken, isUpdate, handleGetLoggedUser]);

  const contextData = {
    isToken,
    allUser,
    storedOtp,
    libraryId,
    clientList,
    allClients,
    loggedInUser,
    userLoggedIn,
    isUserLoading,
    selectedClient,
    currentUserRole,
    selectedClientIds,
    handleUpdateClient,
    handleSelectedClient,
    isShowLibraryProcessCard,
    handleShowLibraryProcessCard,
    handleHideLibraryProcessCard,
  };

  return <ClientContext.Provider value={contextData}>{children}</ClientContext.Provider>;
};

export const useClients = (): ClientContextInterface | undefined => {
  const context = useContext(ClientContext);
  if (!context) {
    console.error("useClients must be used within a ClientContextProvider");
  }

  return context;
};
