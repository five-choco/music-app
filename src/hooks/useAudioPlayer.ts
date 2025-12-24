import { useEffect, useRef, useReducer } from "react";

export const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

type PlayerState = {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
};

type PlayerAction =
  | { type: "SET_PLAYING"; payload: boolean }
  | { type: "SET_DURATION"; payload: number }
  | { type: "SET_CURRENT_TIME"; payload: number }
  | { type: "RESET" };

const initialState: PlayerState = {
  isPlaying: false,
  duration: 0,
  currentTime: 0,
};

const playerReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case "SET_PLAYING":
      return { ...state, isPlaying: action.payload };
    case "SET_DURATION":
      return { ...state, duration: action.payload };
    case "SET_CURRENT_TIME":
      return { ...state, currentTime: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export const useAudioPlayer = (audioUrl: string | null) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const { isPlaying, duration, currentTime } = state;

  useEffect(() => {
    if (!audioUrl) {
      dispatch({ type: "RESET" });
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    const newAudio = new Audio(audioUrl);
    audioRef.current = newAudio;

    const setAudioData = () => dispatch({ type: "SET_DURATION", payload: newAudio.duration });
    const handleTimeUpdate = () => dispatch({ type: "SET_CURRENT_TIME", payload: newAudio.currentTime });
    const handleEnded = () => dispatch({ type: "SET_PLAYING", payload: false });

    newAudio.addEventListener("loadedmetadata", setAudioData);
    newAudio.addEventListener("timeupdate", handleTimeUpdate);
    newAudio.addEventListener("ended", handleEnded);

    newAudio.play()
      .then(() => dispatch({ type: "SET_PLAYING", payload: true }))
      .catch(console.error);

    return () => {
      newAudio.pause();
      newAudio.removeEventListener("loadedmetadata", setAudioData);
      newAudio.removeEventListener("timeupdate", handleTimeUpdate);
      newAudio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const playPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        dispatch({ type: "SET_PLAYING", payload: false });
      } else {
        audioRef.current.play().catch(console.error);
        dispatch({ type: "SET_PLAYING", payload: true });
      }
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      dispatch({ type: "SET_CURRENT_TIME", payload: time });
    }
  };

  return {
    isPlaying,
    currentTime,
    duration,
    formattedCurrentTime: formatTime(currentTime),
    formattedDuration: formatTime(duration),
    playPause,
    seek,
    progress: duration > 0 ? (currentTime / duration) * 100 : 0,
  };
};
