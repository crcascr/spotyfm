import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { getArtistInfo } from "../services/lastfm";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import MiniPlayer from "../components/MiniPlayer";
import { getRandomColor, openLink, parseHTML } from "../utils/helpers";

type DetailsScreenRouteProp = RouteProp<RootStackParamList, "Details">;

type DetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Details"
>;

type Props = {
  route: DetailsScreenRouteProp;
  navigation: DetailsScreenNavigationProp;
};

const DetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const [artistInfo, setArtistInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const currentTrack = useSelector(
    (state: RootState) => state.player.currentTrack
  );

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
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  const handlePlayerPress = () => {
    navigation.navigate("Player");
  };

  if (!artistInfo) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-white">
          Failed to load artist information
        </Text>
      </View>
    );
  }

  const{ text, link, linkText}=parseHTML(artistInfo.bio.summary);

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 bg-black">
        <LinearGradient
          colors={[getRandomColor(), "#000000"]}
          className="py-4 pb-4 pt-14"
        >
          <TouchableOpacity
            className="absolute top-8 left-4 p-1 bg-black/10 rounded-full"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={32} color="white" />
          </TouchableOpacity>
          <Image
            source={{
              uri:
                artistInfo.image[3]["#text"] ||
                "https://via.placeholder.com/300",
            }}
            className="w-48 h-48 rounded-full self-center mb-4"
          />
          <Text className="text-3xl font-bold text-white text-center mb-2">
            {artistInfo.name}
          </Text>
          <Text className="text-sm text-gray-300 text-center mb-4">
            {Number(artistInfo.stats.listeners).toLocaleString()} monthly
            listeners
          </Text>
          <View className="flex-row justify-center mb-4">
            <TouchableOpacity className="bg-[#1ed760] px-6 py-2 rounded-full mr-2">
              <Text className="text-white font-semibold">Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border border-white px-6 py-2 rounded-full">
              <Text className="text-white">Share</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View className="p-4">
          <Text className="text-xl font-semibold text-white mb-2">About</Text>          
          <Text className="text-gray-300 ">{text}</Text>
          {link && linkText &&(
            <TouchableOpacity onPress={()=>openLink(link)}>
              <Text className="text-blue-500 underline mb-4">{linkText}</Text>
            </TouchableOpacity>
          )}

          <Text className="text-xl font-semibold text-white mb-2">Tags</Text>
          <View className="flex-row flex-wrap mb-4">
            {artistInfo.tags.tag.map((tag: { name: string }, index: number) => (
              <Text
                key={index}
                className="mr-2 mb-2 px-3 py-1 bg-gray-800 rounded-full text-gray-300 capitalize"
              >
                {tag.name}
              </Text>
            ))}
          </View>

          <Text className="text-xl font-semibold text-white mb-2">
            Similar Artist
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-20"
          >
            {artistInfo.similar.artist.map((similarArtist, index) => (
              <TouchableOpacity
                key={index}
                className="mr-4 items-center"
                onPress={() =>
                  navigation.push("Details", { artist: similarArtist.name })
                }
              >
                <Image
                  source={{
                    uri:
                      similarArtist.image[2]["#text"] ||
                      "https://via.placeholder.com/100",
                  }}
                  className="w-24 h-24 rounded-full mb-2"
                />
                <Text
                  className="text-gray-300 text-left w-24"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {similarArtist.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      {currentTrack && <MiniPlayer onPress={handlePlayerPress} />}
    </View>
  );
};

export default DetailsScreen;
