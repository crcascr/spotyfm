import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { togglePlay, nextTrack, updateCurrentTime } from "../redux/playerSlice";
import { RootState } from "../redux/store";
import ProgressBar from "./ProgressBar";

interface MiniPlayerProps {
  onPress: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ onPress }) => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying, repeatMode, currentTime } = useSelector(
    (state: RootState) => state.player
  );

  //const [currentTime, setCurrentTime] = React.useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        dispatch(updateCurrentTime(currentTime + 1));
        if (currentTime >= parseInt(currentTrack?.duration || "0") - 1) {
          clearInterval(interval);
          handleTrackEnd();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentTrack, isPlaying, currentTime]);

  const handleTrackEnd = () => {
    if (repeatMode === "track") {
      dispatch(updateCurrentTime(0));
      dispatch(togglePlay());
    } else {
      dispatch(nextTrack());
    }
  };

  const handleSeek = (time: number) => {
    dispatch(updateCurrentTime(time));
  };

  if (!currentTrack) return null;

  return (
    <View className="absolute bottom-2 left-1 right-1 bg-gray-900 px-4 pt-2 rounded-md flex-col">
      <TouchableOpacity
        className="flex-row items-center pb-1"
        onPress={onPress}
      >
        <Image
          source={{
            uri: currentTrack.image || "https://via.placeholder.com/64",
          }}
          className="w-10 h-10 rounded-sm mr-4"
        />
        <View className="flex-1">
          <Text className="text-white font-semibold" numberOfLines={1}>
            {currentTrack.name}
          </Text>
          <Text className="text-gray-400" numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>
        <TouchableOpacity
          className="ml-4"
          onPress={() => dispatch(togglePlay())}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <ProgressBar
        duration={parseInt(currentTrack.duration)}
        currentTime={currentTime}
        onSeek={handleSeek}
        miniPlayer={true}
      />
    </View>
  );
};

export default MiniPlayer;
