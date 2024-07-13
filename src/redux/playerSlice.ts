import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Track {
  id: string;
  name: string;
  artist: string;
  image: string;
  duration: string;
}

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  isShuffled: boolean;
  repeatMode: "off" | "track" | "queue";
  favorites: Track[];
}

const initialState: PlayerState = {
  currentTrack: null,
  queue: [],
  isPlaying: false,
  isShuffled: false,
  repeatMode: "off",
  favorites: [],
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Track>) => {
      state.currentTrack = action.payload;
    },
    setQueue: (state, action: PayloadAction<Track[]>) => {
      state.queue = action.payload;
    },
    addToQueue: (state, action: PayloadAction<Track>) => {
      state.queue.push(action.payload);
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    nextTrack: (state) => {
      if (state.queue.length > 0) {
        state.currentTrack = state.queue.shift() || null;
      }
    },
    prevTrack: (state) => {
      if (state.currentTrack) {
        const index = state.queue.findIndex(
          (track) => track.id === state.currentTrack?.id
        );
        if (index > 0) {
          state.currentTrack = state.queue[index - 1];
        }
      }
    },
    setShuffle: (state) => {
      state.isShuffled = !state.isShuffled;
    },
    setRepeatMode: (
      state,
      action: PayloadAction<"off" | "track" | "queue">
    ) => {
      state.repeatMode = action.payload;
    },

    toggleFavorite: (state, action: PayloadAction<Track>) => {
      const index = state.favorites.findIndex(
        (track) => track.id === action.payload.id
      );
      if (index !== -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
      AsyncStorage.setItem("favorites", JSON.stringify(state.favorites));
    },
    setFavorites: (state, action: PayloadAction<Track[]>) => {
      state.favorites = action.payload;
    },
  },
});

export const {
  setCurrentTrack,
  setQueue,
  addToQueue,
  togglePlay,
  nextTrack,
  prevTrack,
  setShuffle,
  setRepeatMode,
  toggleFavorite,
  setFavorites,
} = playerSlice.actions;
export default playerSlice.reducer;
