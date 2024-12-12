import { Control, Field, UseFormRegister, UseFormSetValue } from "react-hook-form";

interface IsInvitesInterface {
  isInviteModal: boolean;
  isInviteEmailModal: boolean;
  isLoading: boolean;
  sendShotName: string;
  shotId: string;
  sendShotToUser: string;
  sendShotToUserId?: string | undefined;
  isEditLoading: boolean;
  isCopyLoading: boolean;
}

interface InviteModalInterface {
  register: UseFormRegister<Field>;
  control?: Control<Field>;
  albumshots?: any;
  setValue?: UseFormSetValue<Field>;
  shotsOption?: { value: string; label: string }[];
  editShotUrl?: any;
  isCopyLoading?: boolean;
  isEditLoading?: boolean;
  handleSendEmailInvite: ({
    userName,
    shotName,
    userId,
    shotId,
  }: {
    userName: string;
    shotName: string;
    userId?: string;
    shotId: string;
  }) => void;
  handleEditShotUrl: ({ isEdit }: { isEdit: boolean }) => void;
  handleUpdateShotUrl: ({ shotId, shotUrl }: { shotId: string; shotUrl: string }) => void;
  inviteSearch: string | undefined;
  shotLink: string | undefined;
  inviteShot: { value: string; label: string } | null | undefined;
}

export type { IsInvitesInterface, InviteModalInterface };
