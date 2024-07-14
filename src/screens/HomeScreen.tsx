import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getTopTracks } from "../services/lastfm";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  setCurrentTrack,
  setFavorites,
  setQueue,
  toggleFavorite,
  togglePlay,
} from "../redux/playerSlice";
import MiniPlayer from "../components/MiniPlayer";
import BottomSheet from "@gorhom/bottom-sheet";
import { getGreeting, openLink } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";

type RootStackParamList = {
  Home: undefined;
  Details: { artist: string };
  Profile: undefined;
  Player: undefined;
  Favorites: undefined;
};

type HomeSreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

interface Track {
  name: string;
  artist: {
    name: string;
    url: string;
  };
  image: Array<{
    "#text": string;
    size: string;
  }>;
  "@attr": {
    rank: string;
  };
  mbid?: string;
  duration: string;
}

const HomeScreen: React.FC = () => {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<HomeSreenNavigationProp>();
  const dispatch = useDispatch();
  const { currentTrack, favorites } = useSelector(
    (state: RootState) => state.player
  );
  const isPlaying = useSelector((state: RootState) => state.player.isPlaying);

  // Bottom sheet
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    //console.log("handleSheetChanges", index);
  }, []);

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

  // Load favorites from AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("favorites");
        if (storedFavorites) {
          dispatch(setFavorites(JSON.parse(storedFavorites)));
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };
    loadFavorites();
  }, [dispatch]);

  // Track press handler
  const handleTrackPress = (track: Track) => {
    const formattedTrack = {
      id: track.mbid || track.name,
      name: track.name,
      artist: track.artist.name,
      image: track.image[1]["#text"] || "https://via.placeholder.com/64",
      duration: track.duration,
    };
    dispatch(setCurrentTrack(formattedTrack));
    if (!isPlaying) dispatch(togglePlay());

    const trackIndex = topTracks.findIndex(
      (t) => t.mbid === track.mbid || t.name === track.name
    );
    const newQueue = [
      ...topTracks.slice(trackIndex).map((t) => ({
        id: t.mbid || t.name,
        name: t.name,
        artist: t.artist.name,
        image: t.image[1]["#text"] || "https://via.placeholder.com/64",
        duration: t.duration,
      })),
      ...topTracks.slice(0, trackIndex).map((t) => ({
        id: t.mbid || t.name,
        name: t.name,
        artist: t.artist.name,
        image: t.image[1]["#text"] || "https://via.placeholder.com/64",
        duration: t.duration,
      })),
    ];
    dispatch(setQueue(newQueue));
  };

  // Favorite press handler
  const handleFavoritePress = (track: Track) => {
    const formattedFavorite = {
      id: track.mbid || track.name,
      name: track.name,
      artist: track.artist.name,
      image: track.image[1]["#text"] || "https://via.placeholder.com/64",
      duration: track.duration,
    };
    dispatch(toggleFavorite(formattedFavorite));
  };

  // Favorite verification
  const isFavorite = (track: Track) => {
    return favorites.some((favorite) => favorite.id === track.mbid);
  };

  // Bottom sheet controls
  const handleOptionsPress = (track: Track) => {
    setSelectedTrack(track);
    bottomSheetRef.current?.expand();
  };

  const handleGoToDetails = () => {
    if (selectedTrack) {
      navigation.navigate("Details", { artist: selectedTrack.artist.name });
    }
    bottomSheetRef.current?.close();
  };

  const renderTrackItem = ({ item }: { item: Track }) => (
    <TouchableOpacity
      className={`flex-row items-center p-4 border-b border-gray-800 ${
        currentTrack && currentTrack.name === item.name ? "bg-gray-900" : ""
      }`}
      onPress={() => handleTrackPress(item)}
    >
      <Text
        className={`text-sm pr-4 ${
          currentTrack && currentTrack.name === item.name
            ? "text-green-500"
            : "text-white"
        }`}
      >
        {parseInt(item["@attr"].rank) + 1}
      </Text>
      <Image
        source={{
          uri: item.image[1]["#text"] || "https://via.placeholder.com/64",
        }}
        className="w-16 h-16 rounded-sm mr-4"
      />
      <View className="flex-1">
        <Text
          className={`text-lg font-medium ${
            currentTrack && currentTrack.name === item.name
              ? "text-green-500"
              : "text-white"
          }`}
        >
          {item.name}
        </Text>
        <Text className="text-sm text-gray-400">{item.artist.name}</Text>
      </View>
      <TouchableOpacity
        className="p-4"
        onPress={() => handleFavoritePress(item)}
      >
        <Ionicons
          name={isFavorite(item) ? "heart" : "heart-outline"}
          size={20}
          color={isFavorite(item) ? "#1DB954" : "white"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        className="p-4"
        onPress={() => handleOptionsPress(item)}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="gray" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handlePlayerPress = () => {
    navigation.navigate("Player");
  };

  const handleFavoritesPress = () => {
    navigation.navigate("Favorites");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View className={`flex-1 bg-black ${currentTrack && "pb-20"}`}>
      <LinearGradient colors={["#1ED760", "#000000"]}>
        <View className="flex-row items-center px-4 pt-14 pb-8">
          <TouchableOpacity
            className="bg-[#1ed760] p-2 rounded-full"
            onPress={() => navigation.navigate("Profile")}
          >
            <Ionicons name="person" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl ml-4 font-bold text-white">
            {getGreeting()}
          </Text>
        </View>
        <TouchableOpacity
          className="flex-row items-center bg-black/70 ml-4 rounded-lg w-[45%] mb-4"
          onPress={handleFavoritesPress}
        >
          <LinearGradient
            colors={["#4508f3", "#ffffff"]}
            className="p-4 items-center rounded-l-lg"
          >
            <Ionicons name="heart" size={24} color="white" />
          </LinearGradient>
          <Text className="text-base font-extrabold ml-4 text-white">
            Favorites
          </Text>
        </TouchableOpacity>
        <Text className="text-2xl ml-4 mb-4 font-bold text-white">
          Top Tracks in Colombia
        </Text>
      </LinearGradient>
      <FlatList
        data={topTracks}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.mbid || item.name}
      />
      {currentTrack && <MiniPlayer onPress={handlePlayerPress} />}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backgroundStyle={{
          backgroundColor: "#242424",
        }}
        handleIndicatorStyle={{
          backgroundColor: "#b3b3b3",
        }}
      >
        <View className="flex-1 py-4 bg-[#242424]">
          <View className="flex-row items-center pb-4 border-b border-b-gray-400">
            <View className="pl-4 flex-row items-center">
              <Image
                source={{
                  uri:
                    selectedTrack?.image[1]["#text"] ||
                    "https://via.placeholder.com/64",
                }}
                className="w-16 h-16 rounded-sm mr-4"
              />
              <View className="flex-1 ">
                <Text className="text-lg font-bold text-white">
                  {selectedTrack?.name}
                </Text>
                <Text className="text-sm text-gray-400">
                  {selectedTrack?.artist.name}
                </Text>
              </View>
            </View>
          </View>
          <View className="px-4">
            <TouchableOpacity
              className="py-4 flex-row items-center"
              onPress={handleGoToDetails}
            >
              <Ionicons name="person-add" size={24} color="white" />
              <Text className="text-white text-xl ml-4">View Artist</Text>
            </TouchableOpacity>
            {selectedTrack?.artist.url && (
              <TouchableOpacity
                className="py-4 flex-row items-center"
                onPress={() => openLink(selectedTrack.artist.url)}
              >
                <Ionicons name="link-outline" size={24} color="white" />
                <Text className="text-white text-xl ml-4">
                  Discover more on Last.fm
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default HomeScreen;
