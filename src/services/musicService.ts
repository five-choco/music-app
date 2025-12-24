import axios from "axios";
import { LOUDLY_API_ENDPOINT } from "@/lib/constants";

/**
 * Generates music using the Loudly API.
 * @param title - The title of the song.
 * @param genre - The genre of the song.
 * @param prompt - The detailed prompt for the music style.
 * @param apiKey - The Loudly API key.
 * @returns The URL of the generated music file.
 * @throws Will throw an error if the API call fails or the response is invalid.
 */
export const generateMusic = async (
  title: string,
  genre: string,
  prompt: string,
  apiKey: string
): Promise<string> => {
  const formData = new FormData();
  const musicPrompt = `Create a ${genre} song titled "${title}". Musical style: ${prompt}. High quality production with clear melody and rhythm.`;
  formData.append("prompt", musicPrompt);
  formData.append("duration", "30"); // Or make this a parameter if needed

  const response = await axios.post(
    LOUDLY_API_ENDPOINT,
    formData,
    {
      headers: {
        "API-KEY": apiKey,
      },
    }
  );

  if (response.data && response.data.music_file_path) {
    return response.data.music_file_path;
  } else {
    throw new Error("音楽ファイルパスが取得できませんでした");
  }
};
