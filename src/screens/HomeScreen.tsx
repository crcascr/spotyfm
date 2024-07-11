import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getTopTracks } from "../services/lastfm";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

type RootStackParamList = {
  Home: undefined;
  Details: { artist: string };
};

type HomeSreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

interface Track {
  name: string;
  artist: {
    name: string;
  };
  image: Array<{
    "#text": string;
    size: string;
  }>;
  "@attr": {
    rank: string;
  };
  mbid?: string;
}

const HomeScreen: React.FC = () => {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Track | null>(null);
  const navigation = useNavigation<HomeSreenNavigationProp>();

  useEffect(() => {
    fetchTopTracks();
  }, []);

  const fetchTopTracks = async () => {
    try {
      const tracks = await getTopTracks("colombia");
      setTopTracks(tracks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
      setLoading(false);
    }
  };

  const saveRecentTrack = async (track: Track) => {
    try {
      const recentTrack = {
        name: track.name,
        artist: track.artist.name,
        image: track.image[1]["#text"] || "https://via.placeholder.com/64",
      };

      const storedTracks = await AsyncStorage.getItem("recentTracks");
      let recentTracks = storedTracks ? JSON.parse(storedTracks) : [];

      recentTracks.unshift(recentTrack);

      recentTracks = recentTracks.slice(0, 10);

      await AsyncStorage.setItem("recentTracks", JSON.stringify(recentTracks));
    } catch (error) {
      console.error("Error saving recent track:", error);
    }
  };

  const handleTrackPress = (track: Track) => {
    setCurrentlyPlaying(track);
    saveRecentTrack(track);
    navigation.navigate("Details", { artist: track.artist.name });
  };

  const renderTrackItem = ({ item }: { item: Track }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-800"
      onPress={() => handleTrackPress(item)}
    >
      <Image
        source={{
          uri: item.image[1]["#text"] || "https://via.placeholder.com/64",
        }}
        className="w-16 h-16 rounded-sm mr-4"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-white">{item.name}</Text>
        <Text className="text-sm text-gray-400">{item.artist.name}</Text>
      </View>
      <Text className="text-sm text-gray-400">
        #{parseInt(item["@attr"].rank) + 1}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
        <View className="flex-1 pt-14 justify-center items-center bg-black">
          <Text className="text-lg text-gray-300">Loading...</Text>
        </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <LinearGradient colors={["#1ED760", "#000000"]}>
        <View className="flex-row items-center px-4 py-14">
          <TouchableOpacity
            className="bg-[#1ed760] p-2 rounded-full"
            onPress={() => navigation.navigate("Profile")}
          >
            <Ionicons name="person" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl ml-4 font-bold text-white">
            Top Tracks in Colombia
          </Text>
        </View>
      </LinearGradient>
      <FlatList
        data={topTracks}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.mbid || item.name}
      />
      {currentlyPlaying && (
        <View className="absolute bottom-2 left-1 right-1 bg-gray-900 px-4 py-2 rounded-md flex-row items-center">
          <Image
            source={{
              uri:
                currentlyPlaying.image[1]["#text"] ||
                "https://via.placeholder.com/64",
            }}
            className="w-10 h-10 rounded-sm mr-4"
          />
          <View className="flex-1">
            <Text className="text-white font-semibold">
              {currentlyPlaying.name}
            </Text>
            <Text className="text-gray-400">
              {currentlyPlaying.artist.name}
            </Text>
          </View>
          <TouchableOpacity className="ml-4">
            <Ionicons name="pause" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
