import { useState } from "react";
import { Play, Pause, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Link } from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { LOCAL_STORAGE_MUSIC_KEY, FALLBACK_IMAGE_URL } from "./lib/constants";

// This could also be moved to a constants file if it grows
const musicSamples = [
  {
    id: "1",
    title: "Synthwave Dreams",
    artist: "AI Composer",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center",
  },
  {
    id: "2",
    title: "Jazz Fusion",
    artist: "Neural Network",
    audioUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
    coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop&crop=center",
  },
  {
    id: "3",
    title: "Ambient Spaces",
    artist: "Deep Learning",
    audioUrl: "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop&crop=center",
  },
];

type Music = {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string;
};

function App() {
  const [generatedMusic, setGeneratedMusic] = useLocalStorage<Music[]>(LOCAL_STORAGE_MUSIC_KEY, []);
  const [selectedAlbum, setSelectedAlbum] = useState<Music | null>(null);

  const {
    isPlaying,
    currentTime,
    duration,
    formattedCurrentTime,
    formattedDuration,
    playPause,
    seek,
    progress,
  } = useAudioPlayer(selectedAlbum?.audioUrl ?? null);

  const handleDeleteMusic = (idToDelete: string) => {
    const updatedMusicList = generatedMusic.filter((music) => music.id !== idToDelete);
    setGeneratedMusic(updatedMusicList);
    // If the deleted music is the one currently selected, close the player
    if (selectedAlbum?.id === idToDelete) {
      setSelectedAlbum(null);
    }
  };

  const handleOpenDialog = (album: Music) => {
    if (selectedAlbum?.id === album.id) {
      // If the same album is clicked, toggle play/pause
      playPause();
    } else {
      // If a new album is clicked, select it (the useAudioPlayer hook will handle playback)
      setSelectedAlbum(album);
    }
  };

  return (
    <div className="app-root">
      <header className="page-header">
        <div className="container">
          <div className="header-content">
            <h1 className="page-title">音楽生成AI</h1>
            <Link to="/create">
              <Button className="dialog-button-base">
                <Plus className="w-4 h-4 mr-2" />
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
                <Card key={`generated-${music.id}`} className="group relative">
                   <div className="card-image-wrapper" onClick={() => handleOpenDialog(music)}>
                    <img src={music.coverUrl} alt={music.title} className="card-image" onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE_URL; }} />
                    <div className="card-play-button-overlay">
                      <Button className="dialog-button-base dialog-small-button">
                        {isPlaying && selectedAlbum?.id === music.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </Button>
                    </div>
                  </div>
                  <h4 className="card-title-text">{music.title}</h4>
                  <p className="card-artist-text">{music.artist}</p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMusic(music.id);
                    }}
                    className="delete-button"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="section">
          <h3 className="section-title">音楽サンプル</h3>
          <div className="music-grid">
            {musicSamples.map((album) => (
              <Card key={album.id} onClick={() => handleOpenDialog(album)} className="group">
                <div className="card-image-wrapper">
                  <img src={album.coverUrl} alt={album.title} className="card-image" onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE_URL; }} />
                  <div className="card-play-button-overlay">
                     <Button className="dialog-button-base dialog-small-button">
                        {isPlaying && selectedAlbum?.id === album.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
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

      <Dialog open={!!selectedAlbum} onOpenChange={(isOpen) => !isOpen && setSelectedAlbum(null)}>
        <DialogContent className="dialog-content">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">Now Playing</DialogTitle>
          </DialogHeader>
          {selectedAlbum && (
            <div className="dialog-body">
              <img src={selectedAlbum.coverUrl} alt={selectedAlbum.title} className="dialog-image" />
              <div className="dialog-text-center">
                <h3 className="dialog-h3">{selectedAlbum.title}</h3>
                <p className="dialog-p">{selectedAlbum.artist}</p>
              </div>
              <div className="dialog-button-container">
                <Button onClick={playPause} className="dialog-button-base dialog-play-button">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </Button>
              </div>
              <div className="music-slider-wrapper">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={(e) => seek(parseFloat(e.target.value))}
                    className="music-slider-input"
                    style={{ background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${progress}%, #4b5563 ${progress}%, #4b5563 100%)` }}
                  />
                </div>
                <div className="music-slider-info">
                  <span>{formattedCurrentTime}</span>
                  <span>{formattedDuration}</span>
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
