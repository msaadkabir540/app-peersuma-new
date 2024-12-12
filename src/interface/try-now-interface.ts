export interface TryNowModalInterface {
  openModal: boolean;
  widgetName: string;
  clientId: string;
  buttonTextColor?: string;
  buttonColor?: string;
  setOpenModal: (argu: boolean) => void;
}

interface TryNowFormInterface {
  email: string;
  contactNumber: string;
  name: string;
}

type showWidget = {
  name: string;
  buttonColor?: string;
  textColor: string;
  hyperTextColor: string;
  buttonTextColor?: string;
  enableShare?: boolean;
  widgetTemplate: string;
  hyperTitleColor: string;
  clientId: string;
  tryNowButtonColor: string;
  tryNowButtonTextColor: string;
};

type TryNowType = {
  widget: showWidget;
};

export type { TryNowFormInterface, TryNowType };
