import { Linking } from "react-native";

// Get random first color for linear gradient
const contrastColors = [
  "#1e90ff", // Dodger Blue
  "#ff4500", // Orange Red
  "#32cd32", // Lime Green
  "#ff1493", // Deep Pink
  "#4b0082", // Indigo
  "#008080", // Teal
  "#9400d3", // Dark Violet
  "#ff8c00", // Dark Orange
  "#00ced1", // Dark Turquoise
  "#8b0000", // Dark Red
  "#2f4f4f", // Dark Slate Gray
  "#9932cc", // Dark Orchid
  "#228b22", // Forest Green
  "#4682b4", // Steel Blue
  "#800000", // Maroon
];

export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * contrastColors.length);
  return contrastColors[randomIndex];
};

// Pase HTML to get text and link
interface ParsedHTML {
  text: string;
  link: string | null;
  linkText: string | null;
}

export const parseHTML = (html: string): ParsedHTML => {
  const parts = html.split('<a href="');

  if (parts.length === 1) {
    return {
      text: html,
      link: null,
      linkText: null,
    };
  }

  const text = parts[0];
  const linkParts = parts[1].split('">');
  const link = linkParts[0];
  const linkText = "Read more on Last.fm";

  return {
    text,
    link,
    linkText,
  };
};

export const openLink = (url: string) => {
  Linking.openURL(url).catch((err) =>
    console.error("Error opening link:", err)
  );
};

// Greeting message
export const getGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Good morning";
  } else if (currentHour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};
