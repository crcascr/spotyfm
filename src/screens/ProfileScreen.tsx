import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const ProfileScreen: React.FC = () => {
  const [recentTracks, setRecentTracks] = useState<string[]>([]);
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

  const renderTrackItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      className="p-4 border-b border-gray-200"
      onPress={() => navigation.navigate("Details", { artist: item })}
    >
      <Text className="text-lg">{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <Text className="text-2xl font-bold p-4">My Profile</Text>
      <Text className="text-xl font-semibold px-4 pb-2">Recent Tracks</Text>
      <FlatList
        data={recentTracks}
        renderItem={renderTrackItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text className="text-lg text-gray-500 p-4">No recent tracks</Text>
        }
      />
    </View>
  );
};

export default ProfileScreen;
