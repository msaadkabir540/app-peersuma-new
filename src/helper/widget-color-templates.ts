interface WidgetColorTemplateInterface {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  thumbnailColor: string;
  buttonColor?: string;
  buttonTextColor: string;
  thumbnailHeadingColor?: string;
  leafColor?: string;
  thumbnailTextColor?: string;
  hyperTextColor?: string;
  hyperTitleColor?: string;
  shareColor: string;
  titleColor: string;
  tryNowButtonTextColor: string;
  tryNowButtonColor: string;
  thumbnailTitleColor?: string;
}

export const palettes: WidgetColorTemplateInterface[] = [
  {
    id: "0",
    name: "Custom",
    backgroundColor: "",
    textColor: "",
    thumbnailColor: "",
    buttonColor: "",
    buttonTextColor: "",
    tryNowButtonColor: "",
    tryNowButtonTextColor: "",
    shareColor: "",
    titleColor: "",
  },
  {
    id: "1",
    name: "Orange",
    backgroundColor: "#E57402",
    textColor: "#FFFFFF",
    thumbnailColor: "#FFFFFF",
    buttonColor: "#FFFFFF",
    buttonTextColor: "#E57402",
    hyperTitleColor: "#000000",
    hyperTextColor: "#F5F5F5",
    shareColor: "#E57402",
    titleColor: "#FFFFFF",
    tryNowButtonColor: "#E57402", // Set to backgroundColor
    tryNowButtonTextColor: "#FFFFFF", // Set to textColor
    thumbnailTitleColor: "#FFFFFF",
  },
  {
    id: "2",
    name: "Black",
    backgroundColor: "#191717",
    textColor: "#FFA500",
    thumbnailColor: "#FFA500",
    buttonColor: "#FFA500",
    buttonTextColor: "#191717",
    hyperTextColor: "#FFA500",
    hyperTitleColor: "#F5F5F5",
    shareColor: "#FFA500",
    titleColor: "#FFA500",
    tryNowButtonColor: "#191717", // Set to backgroundColor
    tryNowButtonTextColor: "#FFA500", // Set to textColor
    thumbnailTitleColor: "#FFA500",
  },
  {
    id: "3",
    name: "Beige",
    thumbnailTitleColor: "#9932CC",
    backgroundColor: "#F5F5DC",
    textColor: "#9932CC",
    thumbnailColor: "#9932CC",
    buttonColor: "#9932CC",
    shareColor: "#9932CC",
    buttonTextColor: "#F5F5DC",
    hyperTextColor: "#9932CC",
    hyperTitleColor: "#333333",
    titleColor: "#9932CC",
    tryNowButtonColor: "#F5F5DC", // Set to backgroundColor
    tryNowButtonTextColor: "#9932CC", // Set to textColor
  },
  {
    id: "4",
    name: "Red",
    backgroundColor: "#BB2528",
    shareColor: "#BB2528",
    textColor: "#FFFFFF",
    thumbnailColor: "#FFFFFF",
    buttonColor: "#FFFFFF",
    buttonTextColor: "#BB2528",
    hyperTextColor: "#FFFFFF",
    hyperTitleColor: "#FFFFFF",
    titleColor: "#FFFFFF",
    tryNowButtonColor: "#BB2528", // Set to backgroundColor
    tryNowButtonTextColor: "#FFFFFF", // Set to textColor
    thumbnailTitleColor: "#FFFFFF",
  },
  {
    id: "5",
    name: "Light Blue",
    backgroundColor: "#5A8DC3",
    shareColor: "#5A8DC3",
    textColor: "#FFD700",
    thumbnailColor: "#FFD700",
    buttonColor: "#FFD700",
    buttonTextColor: "#5A8DC3",
    hyperTextColor: "#FFD700",
    hyperTitleColor: "#FFD700",
    titleColor: "#FFD700",
    tryNowButtonColor: "#5A8DC3", // Set to backgroundColor
    tryNowButtonTextColor: "#FFD700", // Set to textColor
    thumbnailTitleColor: "#FFD700",
  },
  {
    id: "6",
    name: "White",
    backgroundColor: "#FFF",
    textColor: "#69C9D0",
    thumbnailColor: "#69C9D0",
    buttonColor: "#69C9D0",
    shareColor: "#69C9D0",
    buttonTextColor: "#69C9D0",
    hyperTextColor: "#69C9D0",
    hyperTitleColor: "#69C9D0",
    titleColor: "#69C9D0",
    tryNowButtonColor: "#FFF", // Set to backgroundColor
    tryNowButtonTextColor: "#69C9D0", // Set to textColor
    thumbnailTitleColor: "#69C9D0",
  },
  {
    id: "7",
    name: "Brown",
    backgroundColor: "#562C2C",
    shareColor: "#562C2C",
    textColor: "#F5DFBB",
    thumbnailColor: "#F5DFBB",
    buttonColor: "#F5DFBB",
    buttonTextColor: "#562C2C",
    hyperTextColor: "#F5DFBB",
    hyperTitleColor: "#F5DFBB",
    titleColor: "#F5DFBB",
    tryNowButtonColor: "#562C2C", // Set to backgroundColor
    tryNowButtonTextColor: "#F5DFBB", // Set to textColor
    thumbnailTitleColor: "#F5DFBB",
  },
  {
    id: "8",
    name: "Gray",
    backgroundColor: "#333333",
    shareColor: "#333333",
    textColor: "#FF9898",
    thumbnailColor: "#FF9898",
    buttonColor: "#FF9898",
    buttonTextColor: "#333333",
    hyperTextColor: "#FF9898",
    hyperTitleColor: "#FF9898",
    titleColor: "#FF9898",
    tryNowButtonColor: "#333333", // Set to backgroundColor
    tryNowButtonTextColor: "#FF9898", // Set to textColor
    thumbnailTitleColor: "#FF9898",
  },
  {
    id: "9",
    name: "Navy Blue",
    backgroundColor: "#2A324B",
    shareColor: "#2A324B",
    textColor: "#FFE4B5",
    thumbnailColor: "#FFE4B5",
    buttonColor: "#FFE4B5",
    buttonTextColor: "#2A324B",
    hyperTextColor: "#FFE4B5",
    hyperTitleColor: "#FFE4B5",
    titleColor: "#FFE4B5",
    tryNowButtonColor: "#2A324B", // Set to backgroundColor
    tryNowButtonTextColor: "#FFE4B5", // Set to textColor
    thumbnailTitleColor: "#FFE4B5",
  },
  {
    id: "10",
    name: "Pink",
    backgroundColor: "#FFB6C1",
    shareColor: "#FFB6C1",
    textColor: "#0A68B6",
    thumbnailColor: "#0A68B6",
    buttonColor: "#0A68B6",
    buttonTextColor: "#FFFFFF",
    hyperTextColor: "#0A68B6",
    hyperTitleColor: "#0A68B6",
    titleColor: "#0A68B6",
    tryNowButtonColor: "#FFB6C1", // Set to backgroundColor
    tryNowButtonTextColor: "#0A68B6", // Set to textColor
    thumbnailTitleColor: "#0A68B6",
  },
  {
    id: "11",
    name: "Tan",
    backgroundColor: "#D49C6B",
    shareColor: "#D49C6B",
    textColor: "#FFFFFF",
    thumbnailColor: "#FFFFFF",
    buttonColor: "#FFFFFF",
    buttonTextColor: "#000000",
    hyperTextColor: "#FFFFFF",
    hyperTitleColor: "#FFFFFF",
    titleColor: "#FFFFFF",
    tryNowButtonColor: "#D49C6B", // Set to backgroundColor
    tryNowButtonTextColor: "#FFFFFF", // Set to textColor
    thumbnailTitleColor: "#FFFFFF",
  },
  {
    id: "12",
    name: "Yellow",
    backgroundColor: "#FFFF94",
    textColor: "#000000",
    thumbnailColor: "#000000",
    buttonColor: "#000000",
    shareColor: "#000000",
    buttonTextColor: "#000000",
    hyperTextColor: "#000000",
    hyperTitleColor: "#000000",
    titleColor: "#000000",
    tryNowButtonColor: "#FFFF94", // Set to backgroundColor
    tryNowButtonTextColor: "#000000", // Set to textColor
    thumbnailTitleColor: "#000000",
  },
  {
    id: "13",
    name: "Parrot",
    backgroundColor: "#4CAF50",
    shareColor: "#4CAF50",
    textColor: "#FFFFFF",
    thumbnailColor: "#FFFFFF",
    buttonColor: "#FFFFFF",
    buttonTextColor: "#FFFFFF",
    hyperTextColor: "#FFFFFF",
    hyperTitleColor: "#FFFFFF",
    titleColor: "#FFFFFF",
    tryNowButtonColor: "#4CAF50", // Set to backgroundColor
    tryNowButtonTextColor: "#FFFFFF", // Set to textColor
    thumbnailTitleColor: "#FFFFFF",
  },
  {
    id: "14",
    name: "Light Gray",
    backgroundColor: "#E2E2E2",
    shareColor: "#000000",
    textColor: "#000000",
    thumbnailColor: "#000000",
    buttonColor: "#000000",
    buttonTextColor: "#000000",
    hyperTextColor: "#000000",
    hyperTitleColor: "#000000",
    titleColor: "#000000",
    tryNowButtonColor: "#E2E2E2", // Set to backgroundColor
    tryNowButtonTextColor: "#000000", // Set to textColor
    thumbnailTitleColor: "#000000",
  },
];
