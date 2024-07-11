import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
  const [recentTracks, setRecentTracks] = useState<RecentTrack[]>([]);
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useEffect(() => {
    loadRecentTracks();
  }, []);

  const loadRecentTracks = async () => {
    try {
      const storedTracks = await AsyncStorage.getItem("recentTracks");
      if (storedTracks) {
        setRecentTracks(JSON.parse(storedTracks));
      }
    } catch (error) {
      console.error("Error loading recent tracks:", error);
    }
  };

  const renderTrackItem = ({ item }: { item: RecentTrack }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-800"
      onPress={() => navigation.navigate("Details", { artist: item.artist })}
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/48" }}
        className="w-12 h-12 rounded-sm mr-4"
      />
      <View className="flex-1">
        <Text className="text-base font-semibold text-white">{item.name}</Text>
        <Text className="text-sm text-gray-400">{item.artist}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-black">
      <LinearGradient colors={["#1ed760", "#000000"]}>
        <View className="py-14 px-6 flex-row items-center">
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
    </View>
  );
};

export default ProfileScreen;
