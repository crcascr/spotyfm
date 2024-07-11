import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { getArtistInfo } from "../services/lastfm";

type DetailsScreenRouteProp = RouteProp<RootStackParamList, "Details">;

type DetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Details"
>;

type Props = {
  route: DetailsScreenRouteProp;
  navigation: DetailsScreenNavigationProp;
};

const DetailsScreen: React.FC<Props> = ({ route }) => {
  const [artistInfo, setArtistInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistInfo = async () => {
      try {
        const info = await getArtistInfo(route.params.artist);
        setArtistInfo(info);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching artist info:", error);
        setLoading(false);
      }
    };

    fetchArtistInfo();
  }, [route.params.artist]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!artistInfo) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-red-500">
          Failed to load artist information
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-3xl font-bold mb-4">{artistInfo.name}</Text>

      <Text className="text-xl font-semibold mb-2">About</Text>
      <Text className="mb-4">{artistInfo.bio.summary}</Text>

      <Text className="text-xl font-semibold mb-2">Tags</Text>
      <View className="flex-row flex-wrap mb-4">
        {artistInfo.tags.tag.map((tag: { name: string }, index: number) => (
          <Text
            key={index}
            className="mr-2 mb-2 px-2 py-1 bg-gray-200 rounded-full"
          >
            {tag.name}
          </Text>
        ))}
      </View>

      <Text className="text-xl font-semibold mb-2">Stats</Text>
      <Text className="mb-1">Listeners: {artistInfo.stats.listeners}</Text>
      <Text className="mb-4">Playcount: {artistInfo.stats.playcount}</Text>

      <Text className="text-xl font-semibold mb-2">Similar Artist</Text>
      {artistInfo.similar.artist.map(
        (similarArtisit: { name: string }, index: number) => (
          <Text key={index} className="mb-1">
            {similarArtisit.name}
          </Text>
        )
      )}
    </ScrollView>
  );
};

export default DetailsScreen;
