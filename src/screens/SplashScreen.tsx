import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SvgXml } from "react-native-svg";

const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="100" fill="#000000" />
  <path d="M60,100 Q100,140 140,100 T220,100" stroke="#1ED760" stroke-width="12" fill="none" />
  <circle cx="60" cy="100" r="10" fill="#1ED760" />
  <circle cx="140" cy="100" r="10" fill="#1ED760" />
  <rect x="85" y="70" width="30" height="60" fill="#1ED760" />
  <rect x="125" y="85" width="30" height="45" fill="#1ED760" />
</svg>
`;

const SplashScreen = () => {
  return (
    <LinearGradient
      colors={["#000000", "#1ED760"]}
      className="flex-1 items-center justify-center"
    >
      <SvgXml xml={logoSvg} width={200} height={200} />
      <Text className="text-white text-2xl font-bold mt-4">Spoty.FM</Text>
    </LinearGradient>
  );
};

export default SplashScreen;
