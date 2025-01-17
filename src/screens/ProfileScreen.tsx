import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import MiniPlayer from "../components/MiniPlayer";
import { setRecentTracks } from "../redux/playerSlice";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

interface RecentTrack {
  name: string;
  artist: string;
  image: string;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { currentTrack, recentTracks } = useSelector(
    (state: RootState) => state.player
  );
  const dispatch = useDispatch();

  useEffect(() => {
    loadRecentTracks();
  }, []);


  // Load recent tracks from AsyncStorage
  const loadRecentTracks = async () => {
    try {
      const storedTracks = await AsyncStorage.getItem("recentTracks");
      if (storedTracks) {
        dispatch(setRecentTracks(JSON.parse(storedTracks)));
      }
    } catch (error) {
      console.error("Error loading recent tracks:", error);
    }
  };

  // Handle player press
  const handlePlayerPress = () => {
    navigation.navigate("Player");
  };

  const renderTrackItem = ({ item }: { item: RecentTrack }) => (
    <TouchableOpacity
      className={`flex-row items-center p-4 border-b border-gray-800 ${
        currentTrack && currentTrack.name === item.name ? "bg-gray-900" : ""
      }`}
      onPress={() => navigation.navigate("Details", { artist: item.artist })}
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/48" }}
        className="w-12 h-12 rounded-sm mr-4"
      />
      <View className="flex-1">
        <Text
          className={`text-base font-semibold ${
            currentTrack && currentTrack.name === item.name
              ? "text-green-500"
              : "text-white"
          }`}
        >
          {item.name}
        </Text>
        <Text className="text-sm text-gray-400">{item.artist}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-black">
      <LinearGradient
        colors={["#1ED760", "#000000"]}
        className="pb-14 pt-20 px-6 "
      >
        <TouchableOpacity
          className="absolute top-8 left-4 p-1 bg-black/10 rounded-full"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Ionicons name="person-circle-outline" size={80} color="white" />
          <Text className="text-3xl font-bold text-white ml-4">My Profile</Text>
        </View>
      </LinearGradient>
      <View className="p-4">
        <Text className="text-xl font-semibold text-white">Recent Tracks</Text>
      </View>
      <FlatList
        data={recentTracks}
        renderItem={renderTrackItem}
        className="mb-20"
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-lg text-gray-400">No recent tracks</Text>
            <TouchableOpacity
              className="mt-4 bg-green-500 px-6 py-3 rounded-full"
              onPress={() => navigation.navigate("Home")}
            >
              <Text className="text-white font-semibold">Discover Music</Text>
            </TouchableOpacity>
          </View>
        }
      />
      {currentTrack && <MiniPlayer onPress={handlePlayerPress} />}
    </View>
  );
};

export default ProfileScreen;
