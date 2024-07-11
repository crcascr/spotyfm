import axios from "axios";
import { API_KEY, BASE_URL } from "../config/api";

interface Track {
  name: string;
  artist: {
    name: string;
  };
  image: Array<{
    "#text": string;
    size: string;
  }>;
  "@attr": {
    rank: string;
  };
  mbid?: string;
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
