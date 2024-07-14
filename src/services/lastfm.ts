import axios from "axios";
import { API_KEY, BASE_URL } from "../config/api";

// Get top tracks service start
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

export const getTopTracks = async (country: string): Promise<Track[]> => {
  try {
    const response = await axios.get<{ tracks: { track: Track[] } }>(BASE_URL, {
      params: {
        method: "geo.getTopTracks",
        country: country,
        api_key: API_KEY,
        format: "json",
      },
    });
    return response.data.tracks.track;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    throw error;
  }
};

// Get top tracks service end

// Get artist info service start
interface ArtistInfo {
  name: string;
  image: Array<{
    "#text": string;
    size: string;
  }>;
  bio: {
    summary: string;
    content: string;
  };
  tags: {
    tag: Array<{ name: string }>;
  };
  stats: {
    listeners: string;
    playcount: string;
  };
  similar: {
    artist: Array<{
      name: string;
      image: Array<{ "#text": string; size: string }>;
    }>;
  };
}

export const getArtistInfo = async (artist: string): Promise<ArtistInfo> => {
  try {
    const response = await axios.get<{ artist: ArtistInfo }>(BASE_URL, {
      params: {
        method: "artist.getInfo",
        artist,
        api_key: API_KEY,
        format: "json",
      },
    });
    return response.data.artist;
  } catch (error) {
    console.error("Error fetching artist info:", error);
    throw error;
  }
};

// Get artist info service end
