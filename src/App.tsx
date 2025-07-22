import React, { useState } from 'react';
import { Upload, Sparkles, Download, Search } from 'lucide-react';

interface GifItem {
  id: string;
  url: string;
  title: string;
}

function App() {
  const [userImage, setUserImage] = useState<File | null>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState<GifItem[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUserImage(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setUserImage(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const searchGifs = async () => {
    if (!searchQuery.trim()) return;
    
    // Demo GIFs for development
    const demoGifs: GifItem[] = [
      {
        id: '1',
        url: 'https://media.tenor.com/example1.gif',
        title: 'Demo GIF 1'
      },
      {
        id: '2',
        url: 'https://media.tenor.com/example2.gif',
        title: 'Demo GIF 2'
      }
    ];
    
    setGifs(demoGifs);
  };

  const processImages = async () => {
    if (!userImage || !selectedGif) return;
    
    setIsProcessing(true);
    
    // Demo processing - in real app, this would call the face swap API
    setTimeout(() => {
      setResult(selectedGif); // Demo: show selected GIF as result
      setIsProcessing(false);
    }, 3000);
  };

  const downloadResult = () => {
    if (!result) return;
    
    const link = document.createElement('a');
    link.href = result;
    link.download = 'face-swap-result.gif';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Face<span className="text-purple-400">GIF</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Advanced AI-powered face swap technology. Upload your photo and choose from thousands of GIFs.
          </p>
        </header>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Upload Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Upload className="mr-2" />
              Upload Your Photo
            </h2>
            
            <div
              className="border-2 border-dashed border-purple-400 rounded-xl p-8 text-center hover:border-purple-300 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              {userImage ? (
                <div className="space-y-4">
                  <img
                    src={URL.createObjectURL(userImage)}
                    alt="Uploaded"
                    className="max-w-full max-h-64 mx-auto rounded-lg"
                  />
                  <p className="text-green-400 font-medium">{userImage.name}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="mx-auto h-16 w-16 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Drop your image here</p>
                    <p className="text-gray-400">or click to browse</p>
                  </div>
                </div>
              )}
            </div>
            
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* GIF Selection Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Search className="mr-2" />
              Choose Target GIF
            </h2>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search GIFs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  onKeyPress={(e) => e.key === 'Enter' && searchGifs()}
                />
                <button
                  onClick={searchGifs}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Search
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                {gifs.map((gif) => (
                  <div
                    key={gif.id}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedGif === gif.url
                        ? 'border-purple-400 ring-2 ring-purple-400/50'
                        : 'border-transparent hover:border-purple-400/50'
                    }`}
                    onClick={() => setSelectedGif(gif.url)}
                  >
                    <div className="aspect-square bg-gray-800 flex items-center justify-center">
                      <p className="text-gray-400 text-sm">{gif.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Process Button */}
        <div className="text-center mt-8">
          <button
            onClick={processImages}
            disabled={!userImage || !selectedGif || isProcessing}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center mx-auto space-x-2"
          >
            <Sparkles className="h-5 w-5" />
            <span>
              {isProcessing ? 'Processing...' : 'Demo Face Swap'}
            </span>
          </button>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="mt-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-md mx-auto">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-white font-medium">Processing your face swap...</p>
              <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
            </div>
          </div>
        )}

        {/* Result Display */}
        {result && !isProcessing && (
          <div className="mt-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-white mb-4 text-center">
                Your Face Swap Result
              </h3>
              
              <div className="text-center space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400">Demo Result Preview</p>
                  <p className="text-sm text-gray-500 mt-2">
                    In production, this would show your processed face swap
                  </p>
                </div>
                
                <button
                  onClick={downloadResult}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center mx-auto space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Download Result</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;