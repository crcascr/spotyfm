import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import DetailsScreen from "./src/screens/DetailsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import PlayerScreen from "./src/screens/PlayerScreen";
import SplashScreen from "./src/screens/SplashScreen";
import { RootStackParamList } from "./src/types/navigation";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "./global.css";
import FavoritesScreen from "./src/screens/FavoritesScreen";
//import 'react-native-gesture-handler';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Player" component={PlayerScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
