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
}

const initialState: PlayerState = {
  currentTrack: null,
  queue: [],
  isPlaying: false,
  isShuffled: false,
  repeatMode: "off",
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
  },
});

export const{
  setCurrentTrack,
  setQueue,
  addToQueue,
  togglePlay,
  nextTrack,
  prevTrack,
  setShuffle,
  setRepeatMode
}= playerSlice.actions;
export default playerSlice.reducer;
