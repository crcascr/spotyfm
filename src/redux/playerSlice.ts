import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Track {
  id: string;
  name: string;
  artist: string;
  image: string;
  duration: string;
}

const DEFAULT_DURATION = "180";

const validateTrack = (track: Track): Track => {
  if (parseInt(track.duration) <= 0) {
    return { ...track, duration: DEFAULT_DURATION };
  }
  return track;
};

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  isShuffled: boolean;
  repeatMode: "off" | "track" | "queue";
  favorites: Track[];
  recentTracks: Track[];
  currentTime: number;
}

const initialState: PlayerState = {
  currentTrack: null,
  queue: [],
  isPlaying: false,
  isShuffled: false,
  repeatMode: "off",
  favorites: [],
  recentTracks: [],
  currentTime: 0,
};

const saveToAsyncStorage = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to AsyncStorage:`, error);
  }
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Track>) => {
      const validatedTrack = validateTrack(action.payload);
      state.currentTrack = validatedTrack;
      addToRecentTracks(state, validatedTrack);
      state.currentTime = 0;
      const trackIndex = state.queue.findIndex(
        (track) => track.id === validatedTrack.id
      );
      if (trackIndex === -1) {
        state.queue = [
          ...state.queue.slice(trackIndex),
          ...state.queue.slice(0, trackIndex),
        ];
      }
    },
    setQueue: (state, action: PayloadAction<Track[]>) => {
      state.queue = action.payload.map(validateTrack);
    },
    addToQueue: (state, action: PayloadAction<Track>) => {
      state.queue.push(validateTrack(action.payload));
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    nextTrack: (state) => {
      if (state.currentTrack) {
        if (state.repeatMode === "track") {
          addToRecentTracks(state, validateTrack(state.currentTrack));
        } else {
          state.queue.shift();

          let nextTrack: Track | undefined;

          if (state.queue.length > 0) {
            nextTrack = state.queue[0];
          } else if (
            state.repeatMode === "queue" &&
            state.recentTracks.length > 0
          ) {
            state.queue = [...state.recentTracks];
            nextTrack = state.queue[0];
          }

          if (nextTrack) {
            state.currentTrack = validateTrack(nextTrack);
            addToRecentTracks(state, state.currentTrack);
          } else {
            state.currentTrack = null;
            state.isPlaying = false;
          }
        }
      }
    },
    prevTrack: (state) => {
      if (state.currentTrack) {
        if (state.repeatMode === "track") {
          addToRecentTracks(state, validateTrack(state.currentTrack));
        } else {
          let prevTrack: Track | undefined;

          if (state.recentTracks.length > 1) {
            prevTrack = state.recentTracks[1];
            state.recentTracks = state.recentTracks.slice(1);
          } else if (state.repeatMode === "queue" && state.queue.length > 0) {
            prevTrack = state.queue[state.queue.length - 1];
          }
          if (prevTrack) {
            state.currentTrack = validateTrack(prevTrack);
            state.queue.unshift(state.currentTrack);
          }
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
    setRecentTracks: (state, action: PayloadAction<Track[]>) => {
      state.recentTracks = action.payload;
    },
    updateCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
  },
});

const addToRecentTracks = (state: PlayerState, track: Track) => {
  const validatedTrack = validateTrack(track);
  const index = state.recentTracks.findIndex((t) => t.id === validatedTrack.id);
  if (index !== -1) {
    state.recentTracks.splice(index, 1);
  }
  state.recentTracks.unshift(validatedTrack);
  state.recentTracks = state.recentTracks.slice(0, 10);
  saveToAsyncStorage("recentTracks", state.recentTracks);
};

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
  setRecentTracks,
  updateCurrentTime,
} = playerSlice.actions;
export default playerSlice.reducer;
