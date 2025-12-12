import { useState, useEffect, useRef } from "react";
import { Play, Pause, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "./components/ui/dialog";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Link } from "react-router"; // Corrected import to react-router

type Music = {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string;
};

function App() {
  const musicList = [
    {
      id: "1",
      title: "Synthwave Dreams",
      artist: "AI Composer",
      audioUrl:
        "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
      coverUrl:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: "2",
      title: "Jazz Fusion",
      artist: "Neural Network",
      audioUrl:
        "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
      coverUrl:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: "3",
      title: "Ambient Spaces",
      artist: "Deep Learning",
      audioUrl:
        "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3",
      coverUrl:
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop&crop=center",
    },
  ];

  const [generatedMusic, setGeneratedMusic] = useState<Music[]>(() => {
    const savedMusic = JSON.parse(
      localStorage.getItem("generatedMusic") || "[]"
    );
    return savedMusic;
  });
  const [selectedAlbum, setSelectedAlbum] = useState<Music | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleDeleteMusic = (idToDelete: string) => {
    const updatedMusicList = generatedMusic.filter(
      (music) => music.id !== idToDelete
    );
    setGeneratedMusic(updatedMusicList);
    localStorage.setItem("generatedMusic", JSON.stringify(updatedMusicList));
  };

  const handlePlayPause = () => {
    if (!selectedAlbum) return;

    if (!audioRef.current) {
      const newAudio = new Audio(selectedAlbum.audioUrl);
      newAudio.addEventListener("loadedmetadata", () => {
        setDuration(newAudio.duration);
      });
      newAudio.addEventListener("timeupdate", () => {
        setCurrentTime(newAudio.currentTime);
      });
      newAudio.addEventListener("ended", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      audioRef.current = newAudio;
      newAudio.play().catch(console.error);
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = parseFloat(e.target.value);
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (audioRef.current && selectedAlbum) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [selectedAlbum]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="app-root">
      <header className="page-header">
        <div className="container">
          <div className="header-content">
            <h1 className="page-title">音楽生成AI</h1>
            <Link to="/create">
              <Button className="dialog-button-base">
                <Plus className="w-4 h-4 mr-2" /> {/* Plus icon styles kept */}
                音楽を生成する
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        {generatedMusic.length > 0 && (
          <section className="section">
            <h3 className="section-title">作成した音楽</h3>
            <div className="music-grid">
              {generatedMusic.map((music) => (
                <Card
                  key={`generated-${music.id}`}
                  onClick={() => setSelectedAlbum(music)}
                >
                  <div className="card-image-wrapper">
                    <img
                      src={music.coverUrl}
                      alt={music.title}
                      className="card-image"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://picsum.photos/400/400?random=1";
                      }}
                    />
                    <div className="card-play-button-overlay">
                      <Button className="dialog-button-base dialog-small-button">
                        <Play className="w-4 h-4 ml-0.5" />
                      </Button>
                    </div>
                  </div>
                  <h4 className="card-title-text">{music.title}</h4>
                  <p className="card-artist-text">{music.artist}</p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // Card の onClick イベントが発火しないようにする
                      handleDeleteMusic(music.id);
                    }}
                    className="delete-button" // スタイルは後で調整
                  >
                    削除
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="section">
          <h3 className="section-title">音楽サンプル</h3>
          <div className="music-grid">
            {musicList.map((album) => (
              <Card key={album.id} onClick={() => setSelectedAlbum(album)}>
                <div className="card-image-wrapper">
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="card-image"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://picsum.photos/400/400?random=1";
                    }}
                  />
                  <div className="card-play-button-overlay">
                    <Button className="dialog-button-base dialog-small-button">
                      <Play className="w-4 h-4 ml-0.5" />
                    </Button>
                  </div>
                </div>
                <h4 className="card-title-text">{album.title}</h4>
                <p className="card-artist-text">{album.artist}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Dialog
        open={!!selectedAlbum}
        onOpenChange={() => setSelectedAlbum(null)}
      >
        <DialogContent className="dialog-content">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">Now Playing</DialogTitle>
          </DialogHeader>
          {selectedAlbum && (
            <div className="dialog-body">
              <img
                src={selectedAlbum.coverUrl}
                alt={selectedAlbum.title}
                className="dialog-image"
              />
              <div className="dialog-text-center">
                <h3 className="dialog-h3">{selectedAlbum.title}</h3>
                <p className="dialog-p">{selectedAlbum.artist}</p>
              </div>
              <div className="dialog-button-container">
                <Button
                  onClick={handlePlayPause}
                  className="dialog-button-base dialog-play-button"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </Button>
              </div>
              <div className="music-slider-wrapper">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="music-slider-input"
                    style={{
                      background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${
                        (currentTime / (duration || 1)) * 100
                      }%, #4b5563 ${
                        (currentTime / (duration || 1)) * 100
                      }%, #4b5563 100%)`,
                    }}
                  />
                  <style>{`
                    .music-slider-input::-webkit-slider-thumb {
                      appearance: none;
                      width: 16px;
                      height: 16px;
                      border-radius: 50%;
                      background: var(--primary);
                      cursor: pointer;
                      border: 2px solid var(--primary);
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    }
                    .music-slider-input::-moz-range-thumb {
                      width: 16px;
                      height: 16px;
                      border-radius: 50%;
                      background: var(--primary);
                      cursor: pointer;
                      border: 2px solid var(--primary);
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    }
                  `}</style>
                </div>
                <div className="music-slider-info">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
