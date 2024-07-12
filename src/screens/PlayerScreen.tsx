import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  togglePlay,
  nextTrack,
  prevTrack,
  setShuffle,
  setRepeatMode,
} from "../redux/playerSlice";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

type RootStackParamList = {
  Home: undefined;
  Details: { artist: string };
  Profile: undefined;
  Player: undefined;
};

type PlayerScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Player"
>;

const PlayerScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<PlayerScreenNavigationProp>();
  const { currentTrack, isPlaying, isShuffled, repeatMode } = useSelector(
    (state: RootState) => state.player
  );

  const handleArtistPress = () => {
    if (currentTrack) {
      navigation.navigate("Details", { artist: currentTrack.artist });
    }
  };

  if (!currentTrack) {
    return (
      <LinearGradient
        className="flex-1 justify-center items-center "
        colors={["#1ed760", "#000000"]}
      >
        <Text className="text-white text-lg">No track selected</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#1ed760", "#000000"]} className="p-10 flex-1">
      
        <TouchableOpacity className="absolute top-10 left-8" onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-down" size={32} color="white" />
        </TouchableOpacity>
        <View className="flex-col justify-center items-center">
          <Text className="text-white text-sm text-center">PLAYING FROM</Text>
          <TouchableOpacity onPress={handleArtistPress}>
          <Text className="text-white text-sm text-center">
            {currentTrack.artist}
          </Text>
          </TouchableOpacity>
        </View>
      
      <View className="flex-1 items-center justify-center">
        <Image
          source={{ uri: currentTrack.image }}
          className="w-full h-[45%] rounded-md mb-8"
        />
        <View className="items-center mb-8">
          <Text className="text-white text-2xl font-bold mb-2">
            {currentTrack.name}
          </Text>
          <TouchableOpacity onPress={handleArtistPress}>
            <Text className="text-[#b3b3b3] text-lg">
              {currentTrack.artist}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center justify-between w-full max-w-md">
          <TouchableOpacity onPress={() => dispatch(setShuffle())}>
            <Ionicons
              name={isShuffled ? "shuffle" : "shuffle-outline"}
              size={24}
              color={isShuffled ? "#1DB954" : "#b3b3b3"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch(prevTrack())}>
            <Ionicons name="play-skip-back" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch(togglePlay())}>
            <Ionicons
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={72}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch(nextTrack())}>
            <Ionicons name="play-skip-forward" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              dispatch(
                setRepeatMode(
                  repeatMode === "off"
                    ? "queue"
                    : repeatMode === "queue"
                    ? "track"
                    : "off"
                )
              )
            }
          >
            <Ionicons
              name={repeatMode === "track" ? "repeat" : "repeat-outline"}
              size={24}
              color={repeatMode !== "off" ? "#1DB954" : "#b3b3b3"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default PlayerScreen;
