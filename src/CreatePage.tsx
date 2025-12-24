import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Textarea } from "./components/ui/textarea";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Music, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMusicGeneration } from "@/hooks/useMusicGeneration";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_MUSIC_KEY, FALLBACK_IMAGE_URL } from "@/lib/constants";

type Music = {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string;
};

function CreatePage() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const { isGenerating, generatedTrack, error, startGeneration } = useMusicGeneration();
  const [savedMusic, setSavedMusic] = useLocalStorage<Music[]>(LOCAL_STORAGE_MUSIC_KEY, []);

  const handleGenerate = () => {
    if (!title.trim() || !genre || !prompt.trim()) {
      alert("すべてのフィールドを入力してください");
      return;
    }
    startGeneration(title, genre, prompt);
  };

  const handleSave = () => {
    if (!generatedTrack || !title || !genre) {
      alert("音楽を生成してから保存してください");
      return;
    }

    const newMusic: Music = {
      id: Date.now().toString(),
      title: title,
      artist: "AI Generated",
      audioUrl: generatedTrack.musicUrl,
      coverUrl: generatedTrack.coverUrl,
    };

    setSavedMusic([...savedMusic, newMusic]);
    alert("音楽を保存しました！");
  };

  useEffect(() => {
    if (error) {
      // You might want a more sophisticated notification system
      alert(`エラー: ${error}`);
    }
  }, [error]);

  return (
    <div className="app-root">
      <div className="create-page-container">
        <header className="create-page-header">
          <div className="create-page-title-wrapper">
            <h1 className="page-title">音楽生成フォーム</h1>
            <button className="pop-button" onClick={() => navigate("/")}>
              一覧へ戻る
            </button>
          </div>
        </header>

        <div className="create-page-grid">
          <Card className="pop-card">
            <CardHeader>
              <CardTitle className="card-title">
                <Music className="icon-mr-2" />
                Music Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="form-section">
              <div>
                <Label htmlFor="title" className="form-label">
                  タイトル
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter song title..."
                  className="form-input"
                />
              </div>

              <div>
                <Label htmlFor="genre" className="form-label">
                  ジャンル
                </Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger className="form-select-trigger">
                    <SelectValue placeholder="Select genre..." />
                  </SelectTrigger>
                  <SelectContent className="dialog-content">
                    <SelectItem value="electronic">Electronic</SelectItem>
                    <SelectItem value="jazz">Jazz</SelectItem>
                    <SelectItem value="classical">Classical</SelectItem>
                    <SelectItem value="ambient">Ambient</SelectItem>
                    <SelectItem value="rock">Rock</SelectItem>
                    <SelectItem value="pop">Pop</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prompt" className="form-label">
                  詳細
                </Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the music you want to generate..."
                  className="form-textarea"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!title.trim() || !genre || !prompt.trim() || isGenerating}
                className="pop-button"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Music className="w-4 h-4 mr-2" />
                    作成する
                  </>
                )}
              </button>
            </CardContent>
          </Card>

          <Card className="pop-card">
            <CardHeader>
              <CardTitle className="card-title">プレビュー</CardTitle>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="preview-generating-placeholder">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="dialog-p dialog-text-center">
                    Generating your music...
                    <br />
                    <span className="dialog-p dialog-text-center">This may take a few moments</span>
                  </p>
                </div>
              ) : error ? (
                <div className="preview-empty-placeholder">
                  <AlertCircle className="w-12 h-12 text-destructive" />
                   <p className="dialog-p dialog-text-center text-destructive">
                    音楽の生成に失敗しました。
                    <br />
                    <span className="text-xs">{error}</span>
                  </p>
                </div>
              ) : generatedTrack ? (
                <div className="preview-generated-content">
                  <div className="preview-image-wrapper">
                    <img
                      src={generatedTrack.coverUrl}
                      alt="Generated album cover"
                      className="preview-image"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE_URL;
                      }}
                    />
                  </div>

                  <div className="dialog-text-center dialog-body">
                    <h3 className="dialog-h3">{title || "Untitled"}</h3>
                    <p className="dialog-p capitalize">
                      {genre ? `${genre} • AI Generated` : "AI Generated"}
                    </p>
                  </div>

                  <div className="form-section">
                    <audio controls className="preview-audio" key={generatedTrack.musicUrl}>
                      <source src={generatedTrack.musicUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>

                    <button onClick={handleSave} className="pop-button">
                      Save to Collection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="preview-empty-placeholder">
                  <div className="preview-empty-icon-wrapper">
                    <Music className="w-12 h-12 text-gray-600" />
                  </div>
                  <p className="dialog-p">生成する音楽の情報を入力してください</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
