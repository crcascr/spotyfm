# Spoty.fm

## Description

Spoty.fm is a mobile app developed with React Native and Expo that emulates the Spotify interface while using the Last.fm API to provide information about songs and artists. The app focuses on displaying the most popular songs in Colombia and offers additional functionalities such as favorites management and a functional music player.

## Try it yourself

- [Try it on Android](https://appetize.io/app/b_f3b6tq62tkvjv7qoqseibalyea)
- [Try it on iOS](https://appetize.io/app/b_uhbx4kdahckxpjfz7fr4l6g5xq)

## Table of Contents

- [Spoty.fm](#spotyfm)
  - [Description](#description)
  - [Try it yourself](#try-it-yourself)
  - [Table of Contents](#table-of-contents)
  - [Main features](#main-features)
  - [Technologies used](#technologies-used)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributions](#contributions)
  - [Acknowledgements](#acknowledgements)

## Main features

- Spotify-like interface: Intuitive and familiar design for users.
- Top Tracks: Displays the most popular songs in Colombia using Last.fm API.
- Artist Info: Allows users to view details about selected artists.
- Favorites Management: Users can bookmark and manage their favorite songs.
- User profile: Includes a profile screen that displays the last 10 songs played, while stores them locally for offline viewing.
- Music Player: Incorporates a fully functional player for music enjoyment.

## Technologies used

- React Native
- Expo
- Redux (for state management)
- React Navigation (for navigation between screens)
- Axios (for API calls)
- AsyncStorage (for local data storage)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/crcascr/spotyfm.git
   ```
2. Go the project directory:
   ```bash
   cd spotyfm
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the app:
   ```bash
   npm start
   ```

## Usage

The application consists of several main screens:

1. **Home:** Shows a list of the most popular songs in Colombia. Users can play songs, view artist details and add songs to their favorites.
2. **Artist Details:** Provides detailed information about the selected artist, including biography, genres and similar artists.
3. **Favorites:** Allows users to view and manage their favorite songs.
4. **Profile:** Displays the last 10 songs played by the user.
5. **Player:** Provides full playback controls, including play/pause, skip songs, repeat, shuffle and queue display.

## Contributions

Contributions are welcome. Please open an issue to discuss important changes you would like to make.

## Acknowledgements

I would like to express my gratitude for the following libraries and tools, which have been used in the development of Spoty.fm:

- [Last.fm API](https://www.last.fm/api): For providing access to the Last.fm API.
- [Expo](https://docs.expo.dev/): For providing a robust framework and set of tools to streamline the development of React Native apps.
- [React](https://react.dev/): For the powerful and flexible JavaScript library for building user interfaces.
- [React Native](https://reactnative.dev/): For enabling the development of native mobile apps using React.
- [React Navigation](https://reactnavigation.org/): For providing a set of navigation components that simplify the development of React Native apps.
- [Redux Toolkit](https://redux-toolkit.js.org/): For providing a state management library that simplifies the development of React Native apps.
- [Axios](https://axios-http.com/): For making HTTP requests in React Native apps.
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/): For storing data locally in React Native apps.
- [NativeWind](https://www.nativewind.dev/): For providing a set of utilities to simplify the development of React Native apps.
- [expo/vector-icons](https://github.com/expo/vector-icons): For supplying a wide range of customizable icons.
- [gorhom/bottom-sheet](https://ui.gorhom.dev/components/bottom-sheet/): For the bottom sheet component which greatly enhanced the UI/UX.
- [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/): For providing a set of utilities to simplify the development of React Native apps.
- [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler), [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/), [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context), [react-native-screens](https://github.com/software-mansion/react-native-screens), and [react-native-svg](https://github.com/software-mansion/react-native-svg): For their invaluable contributions to the functionality and user experience of the app.
- [expo-updates](https://www.npmjs.com/package/expo-updates): For ensuring that our app stays up to date with the latest features and improvements.

Special thanks to the creators and maintainers of these libraries and tools for their continuous efforts and contributions to the open-source community. Your work has been instrumental in the development of SpotyFM.


Developed with ❤️ by Cristian Castillo
