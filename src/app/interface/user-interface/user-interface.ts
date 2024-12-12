import { Control, FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface UsersInterface {
  id: string;
  _id: string;
  username: string;
  fullName?: string;
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;
  contactNumber?: string;
  roles: string[];
  clientId: {
    clientId: {
      _id: string;
      name: string;
      website: string;
      vimeoFolderId: string;
      vimeoFolderName: string;
      createdAt: string;
      updatedAt: string;
      status: boolean;
    };
    role: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface ResetPasswordStateInterface {
  password: string;
  confirmPassword: string;
  passwordError?: string;
  isLoading?: boolean;
}

interface CreateUserFormMainSchemaInterface {
  fullName: string;
  username: string;
  pageSize?: { value: number; label: number };
  totalCount?: number;
  page?: number;
  email: string;
  confirmPassword: string;
  contactNumber?: string;
  password: string;
  roles: string[];
}

interface CreateUserFormSchemaInterface {
  fullName: string;
  username: string;
  email: string;
  confirmPassword: string;
  contactNumber?: string;
  password: string;
  roles: string[];
}

interface GetAllUsersInterface {
  users: UsersInterface[];
  count: number;
  error?: any;
}

interface ColumnInterface {
  control: Control<FieldValues | any>;
  handleStatusChange: (data: { id: string; status?: boolean }) => void;
}

interface ActionInterface {
  isOpen: boolean;
  action: boolean;
  id: string;
  name: string;
}

interface FormSchema {
  password: string;
  confirmPassword: string;
}
interface ResetPasswordModalInterface {
  userId: string;
  isOpen: boolean;
  handleEventClose: () => void;
}

interface InfoInterface {
  handleClose: () => void;
  handleSelectedRole: ({ role }: { role: string }) => void;
  isSubmitting: boolean;
  role?: string;
  register: UseFormRegister<CreateUserFormSchemaInterface>;
  errors: FieldErrors<CreateUserFormSchemaInterface>;
  isEditInfo: boolean;
  errorMessage?: string;
}

type RoleInterface = "producer" | "executive-producer" | "backend";

export type {
  FormSchema,
  RoleInterface,
  InfoInterface,
  UsersInterface,
  ActionInterface,
  ColumnInterface,
  GetAllUsersInterface,
  BeforeInstallPromptEvent,
  ResetPasswordStateInterface,
  ResetPasswordModalInterface,
  CreateUserFormSchemaInterface,
  CreateUserFormMainSchemaInterface,
};
