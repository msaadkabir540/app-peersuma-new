type showWidget = {
  _id: string;
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

type ViewAllInterface = {
  widget: showWidget;
};

export type { ViewAllInterface };
