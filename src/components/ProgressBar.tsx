import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Slider from "@react-native-community/slider";

interface ProgressBarProps {
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  miniPlayer?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  duration,
  currentTime,
  onSeek,
  miniPlayer = false,
}) => {
  const [progress, setProgress] = useState(0);

  // Update progress bar value
  useEffect(() => {
    setProgress(currentTime / duration);
  }, [currentTime, duration]);

  // Format time
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View className="w-full">
      <Slider
        value={progress}
        onValueChange={(value) => onSeek(value * duration)}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#ffffff"
        maximumTrackTintColor="#b3b3b3"
        thumbTintColor={miniPlayer ? "transparent" : "#ffffff"}
      />
      {!miniPlayer && (
        <View className="flex-row justify-between">
          <Text className="text-[#b3b3b3]">{formatTime(currentTime)}</Text>
          <Text className="text-[#b3b3b3]">{formatTime(duration)}</Text>
        </View>
      )}
    </View>
  );
};

export default ProgressBar;
