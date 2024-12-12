export interface TryNowModalInterface {
  openModal: boolean;
  widgetName: string;
  clientId: string;
  setOpenModal: (argu: boolean) => void;
  buttonColor?: string;
  buttonTextColor?: string;
}

interface TryNowFormInterface {
  email: string;
  contactNumber: string;
  name: string;
}

export type { TryNowFormInterface };
