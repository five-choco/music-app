import { useState } from "react";
import { generateMusic } from "@/services/musicService";
import { PLACEHOLDER_IMAGE_URL } from "@/lib/constants";

export type GeneratedTrack = {
  musicUrl: string;
  coverUrl: string;
};

export const useMusicGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<GeneratedTrack | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startGeneration = async (
    title: string,
    genre: string,
    prompt: string
  ) => {
    const apiKey = import.meta.env.VITE_LOUDLY_API_KEY;

    if (!apiKey) {
      setError("APIキーが設定されていません");
      return;
    }

    setIsGenerating(true);
    setGeneratedTrack(null);
    setError(null);

    try {
      const musicUrl = await generateMusic(title, genre, prompt, apiKey);
      setGeneratedTrack({
        musicUrl,
        coverUrl: `${PLACEHOLDER_IMAGE_URL}${Date.now()}`,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("音楽生成に失敗しました");
      }
      console.error("エラー:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, generatedTrack, error, startGeneration };
};
