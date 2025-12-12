import { useState, useEffect } from "react";
import { Play, Pause, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "./components/ui/dialog";
import { Card } from "./components/ui/card";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Link } from "react-router";

type Music = {
  id: number;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string;
};

function App() {
  const musicList = [
    {
      id: 1,
      title: "Synthwave Dreams",
      artist: "AI Composer",
      audioUrl:
        "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
      coverUrl:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 2,
      title: "Jazz Fusion",
      artist: "Neural Network",
      audioUrl:
        "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
      coverUrl:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 3,
      title: "Ambient Spaces",
      artist: "Deep Learning",
      audioUrl:
        "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3",
      coverUrl:
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop&crop=center",
    },
  ];

  const [generatedMusic, setGeneratedMusic] = useState<Music[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Music | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedMusic = JSON.parse(
      localStorage.getItem("generatedMusic") || "[]"
    );
    setGeneratedMusic(savedMusic);
  }, []);

  const handlePlayPause = () => {
    if (!selectedAlbum) return;

    if (!audio) {
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
      setAudio(newAudio);
      newAudio.play().catch(console.error);
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audio) {
      const seekTime = parseFloat(e.target.value);
      audio.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (audio && selectedAlbum) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setAudio(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAlbum?.id]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        setAudio(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio]);

  return (
    <div className="app-root">
      <header className="page-header">
        <div className="container">
          <div className="header-content">
            <h1 className="page-title">音楽生成AI</h1>
            <Link to="/create">
              <button className="pop-button">
                <Plus className="w-4 h-4 mr-2" />
                音楽を生成する
              </button>
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
                  className="pop-card"
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
                      <button className="pop-button dialog-small-button">
                        <Play className="w-4 h-4 ml-0.5" />
                      </button>
                    </div>
                  </div>
                  <div className="card-content">
                    <h4 className="card-title-text">{music.title}</h4>
                    <p className="card-artist-text">{music.artist}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="section">
          <h3 className="section-title">音楽サンプル</h3>
          <div className="music-grid">
            {musicList.map((album) => (
              <Card
                key={album.id}
                onClick={() => setSelectedAlbum(album)}
                className="pop-card"
              >
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
                    <button className="pop-button dialog-small-button">
                      <Play className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                </div>
                <div className="card-content">
                  <h4 className="card-title-text">{album.title}</h4>
                  <p className="card-artist-text">{album.artist}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Dialog open={!!selectedAlbum} onOpenChange={() => setSelectedAlbum(null)}>
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
                <button
                  onClick={handlePlayPause}
                  className="pop-button dialog-play-button"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>
              </div>
              <div className="music-slider-wrapper">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="music-slider-input"
                />
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
