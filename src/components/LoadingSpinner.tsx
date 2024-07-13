import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

const LoadingSpinner = () => {
  return (
    <View className="flex-1 justify-center items-center bg-black">
      <ActivityIndicator size="large" color="#1ED760" />
      <Text className="text-lg text-gray-300 mt-4">
        Loading amazing music...
      </Text>
    </View>
  );
};

export default LoadingSpinner;
