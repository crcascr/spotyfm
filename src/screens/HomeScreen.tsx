import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getTopTracks } from "../services/lastfm";
import { StatusBar } from "expo-status-bar";

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
  const navigation = useNavigation<HomeSreenNavigationProp>();

  useEffect(() => {
    fetchTopTracks();
  });

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

  const renderTrackItem = ({ item }: { item: Track }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-200"
      onPress={() =>
        navigation.navigate("Details", { artist: item.artist.name })
      }
    >
      <Image
        source={{
          uri: item.image[1]["#text"] || "https://via.placeholder.com/64",
        }}
        className="w-16 h-16 rounded-md mr-4"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-sm text-gray-600">{item.artist.name}</Text>
      </View>
      <Text className="text-sm text-gray-500">
        #{parseInt(item["@attr"].rank) + 1}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <FlatList
        data={topTracks}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.mbid || item.name}
        ListHeaderComponent={
          <Text className="text-2xl font-bold text-gray-800 p-4">
            Top Tracks in Colombia
          </Text>
        }
      />
    </View>
  );
};

export default HomeScreen;
