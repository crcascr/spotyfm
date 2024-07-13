import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { setCurrentTrack, toggleFavorite } from "../redux/playerSlice";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getRandomColor, openLink } from "../utils/helpers";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MiniPlayer from "../components/MiniPlayer";
import BottomSheet from "@gorhom/bottom-sheet";

interface Track {
  id: string;
  name: string;
  artist: string;
  image: string;
  duration: string;
}

type FavoritesScreenRouteProp = RouteProp<RootStackParamList, "Favorites">;

type FavoritesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Favorites"
>;

type Props = {
  route: FavoritesScreenRouteProp;
  navigation: FavoritesScreenNavigationProp;
};

const FavoritesScreen: React.FC<Props> = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.player.favorites);
  const currentTrack = useSelector(
    (state: RootState) => state.player.currentTrack
  );

  // Bottom Sheet
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handlePlayTrack = (track: Track) => {
    dispatch(setCurrentTrack(track));
  };

  const handleToggleFavorite = (track: Track) => {
    dispatch(toggleFavorite(track));
  };

  const handlePlayerPress = () => {
    navigation.navigate("Player");
  };

  // Bottom sheet controls
  const handleOptionsPress = (track: Track) => {
    setSelectedTrack(track);
    bottomSheetRef.current?.expand();
  };

  const handleGoToDetails = () => {
    if (selectedTrack) {
      navigation.navigate("Details", { artist: selectedTrack.artist });
    }
    bottomSheetRef.current?.close();
  };

  const handleSheetChanges = useCallback((index: number) => {
    //console.log("handleSheetChanges", index);
  }, []);

  const renderTrackItem = ({ item }: { item: Track }) => (
    <TouchableOpacity
      className={`flex-row items-center justify-between py-3 px-4 border-b border-gray-700 ${
        currentTrack && currentTrack.name === item.name ? "bg-gray-900" : ""
      }`}
      onPress={() => handlePlayTrack(item)}
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/64" }}
        className="w-12 h-12 rounded-sm mr-4"
      />
      <View className="flex-1">
        <Text
          className={`text-base mb-1 ${
            currentTrack && currentTrack.name === item.name
              ? "text-green-500"
              : "text-white"
          }`}
        >
          {item.name}
        </Text>
        <Text className="text-gray-400 text-sm">{item.artist}</Text>
      </View>
      <TouchableOpacity onPress={() => handleToggleFavorite(item)}>
        <Ionicons name="heart" size={24} color="#1DB954" />
      </TouchableOpacity>
      <TouchableOpacity
        className="p-4"
        onPress={() => handleOptionsPress(item)}
      >
        <Ionicons name="ellipsis-vertical" size={24} color="gray" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View className={`flex-1 bg-black ${currentTrack && "pb-20"}`}>
      <LinearGradient
        colors={[getRandomColor(), "#000000"]}
        className="pt-20 pb-4"
      >
        <TouchableOpacity
          className="absolute top-8 left-4 p-1 bg-black/10 rounded-full"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>

        <Text className="text-white text-2xl font-bold mb-2 px-4">
          Your Favorites
        </Text>
        <Text className="text-gray-400 text-sm px-4 mb-4">
          {favorites.length} {favorites.length > 1 ? "songs" : "song"}
        </Text>
      </LinearGradient>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderTrackItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text className="text-gray-400 text-base text-center mt-6">
          You haven't added any favorites yet.
        </Text>
      )}
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
                  uri: selectedTrack?.image || "https://via.placeholder.com/64",
                }}
                className="w-16 h-16 rounded mr-4"
              />
              <View className="flex-1">
                <Text className="text-lg font-bold text-white">
                  {selectedTrack?.name}
                </Text>
                <Text className="text-sm text-gray-400">
                  {selectedTrack?.artist}
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
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default FavoritesScreen;
