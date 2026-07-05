import React, { useState } from 'react';
import { ImageIcon, Wand2, AlertCircle, Loader2 } from 'lucide-react';
import { useFlavor } from './hooks/useFlavor';

function App() {
  const { processImage, isLoading, result, error } = useFlavor();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      processImage({
        id: crypto.randomUUID(), // Benzersiz ID ataması
        file: selectedFile,
        style: 'modern-futuristic' // Şimdilik varsayılan stil
      });
    }
  };

  return (
    <div className="w-full h-screen p-6 bg-slate-900 flex flex-col gap-6">
      
      {/* Header Alanı */}
      <header className="w-full p-4 bg-slate-800/80 rounded-2xl flex items-center justify-between border border-slate-700">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Wand2 className="text-indigo-400" />
          FlavorFrame AI
        </h1>
        <div className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm font-semibold tracking-wide">
          v1.0.0-master
        </div>
      </header>

      {/* Ana İçerik Alanı (Bölünmüş Ekran) */}
      <main className="w-full flex-1 flex gap-6 overflow-hidden">
        
        {/* SOL PANEL (Kontroller) */}
        <section className="w-1/3 h-full p-6 bg-slate-800/50 rounded-2xl border border-slate-700 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-slate-100">Görsel Yükleme</h2>
            <p className="text-sm text-slate-400">Restoran görsellerini (JPG, PNG) buraya yükleyin.</p>
          </div>

          <label className="w-full flex-1 border-2 border-dashed border-slate-600 rounded-xl bg-slate-900/50 hover:bg-slate-800 transition-colors flex flex-col items-center justify-center gap-4 cursor-pointer p-6">
            <input 
              type="file" 
              className="hidden" 
              accept="image/jpeg, image/png, image/webp" 
              onChange={handleFileChange}
            />
            {selectedFile ? (
              <p className="text-indigo-400 font-medium text-center">{selectedFile.name}</p>
            ) : (
              <>
                <ImageIcon className="w-10 h-10 text-slate-500" />
                <span className="text-slate-400 font-medium text-center">Tıklayın veya Sürükleyin</span>
              </>
            )}
          </label>

          {error && (
            <div className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button 
            onClick={handleSubmit}
            disabled={!selectedFile || isLoading}
            className="w-full p-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            {isLoading ? 'İşleniyor...' : 'Stili Uygula'}
          </button>
        </section>

        {/* SAĞ PANEL (Önizleme) */}
        <section className="w-2/3 h-full p-6 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-slate-700 text-xs font-medium text-slate-300">
            Canlı Önizleme
          </div>

          {result ? (
            <img 
              src={result.generatedImageUrl} 
              alt="Oluşturulan Görsel" 
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-slate-600">
              <ImageIcon className="w-16 h-16 opacity-20" />
              <p>Oluşturulan görsel burada görüntülenecektir.</p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default App;