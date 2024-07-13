import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "../redux/store";
import {
  togglePlay,
  nextTrack,
  prevTrack,
  setShuffle,
  setRepeatMode,
  toggleFavorite,
  setFavorites,
} from "../redux/playerSlice";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import ProgressBar from "../components/ProgressBar";

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
  const { currentTrack, isPlaying, isShuffled, repeatMode, favorites } =
    useSelector((state: RootState) => state.player);
  const [currentTime, setCurrentTime] = React.useState(0);

  useEffect(() => {
    loadFavorites();
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= parseInt(currentTrack?.duration || "0")) {
            clearInterval(interval);
            handleTrackEnd();
            return 0;
          }
          return prevTime + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentTrack, isPlaying]);

  const handleTrackEnd = () => {
    if (repeatMode === "track") {
      setCurrentTime(0);
      dispatch(togglePlay());
    } else {
      dispatch(nextTrack());
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleArtistPress = () => {
    if (currentTrack) {
      navigation.navigate("Details", { artist: currentTrack.artist });
    }
  };

  // Load favorites from AsyncStorage
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites !== null) {
        dispatch(setFavorites(JSON.parse(storedFavorites)));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  // Favorite press handler
  const handleFavoritePress = () => {
    if (currentTrack) {
      dispatch(toggleFavorite(currentTrack));
    }
  };

  // Favorite verification
  const isFavorite = currentTrack
    ? favorites.some((track) => track.id === currentTrack.id)
    : false;

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
      <TouchableOpacity
        className="absolute top-10 left-8"
        onPress={() => navigation.goBack()}
      >
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
        <ProgressBar
          duration={parseInt(currentTrack.duration)}
          currentTime={currentTime}
          onSeek={handleSeek}
        />
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
        <View className="flex-row items-center justify-between w-full max-w-md">
          <TouchableOpacity onPress={handleFavoritePress}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={28}
              color={isFavorite ? "#1DB954" : "white"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default PlayerScreen;
