import React, { useState, useCallback, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Moon, 
  Sun, 
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Camera,
  Zap,
  Shield,
  Loader2,
  ExternalLink,
  X,
  Globe,
  ArrowRight,
  User,
  Play
} from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import GifSelector from './components/GifSelector';
import ProcessingStatus from './components/ProcessingStatus';
import ResultDisplay from './components/ResultDisplay';
import { LanguageSelector } from './components/LanguageSelector';
import { useTranslation } from './hooks/useTranslation';
import SupabaseAPI from './utils/SupabaseAPI';

interface ProcessingState {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  message: string;
  progress: number;
}

function App() {
  const { t, currentLanguage, changeLanguage, isLoading } = useTranslation();
  const [isDark, setIsDark] = useState(true);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    status: 'idle',
    message: '',
    progress: 0
  });
  const [result, setResult] = useState<string | null>(null);
  const [connectionTested, setConnectionTested] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleImageSelect = useCallback((file: File) => {
    setUserImage(file);
  }, []);

  const handleGifSelect = useCallback((gif: string) => {
    setSelectedGif(gif);
  }, []);

  // Test with your specific URLs
  const testSpecificUrls = async () => {
    const api = new SupabaseAPI();
    
    setProcessing({
      status: 'processing',
      message: 'Testando com URLs específicas...',
      progress: 50
    });

    try {
      const testResult = await api.testWithSpecificUrls();
      
      if (testResult.success && testResult.result) {
        setProcessing({
          status: 'completed',
          message: '🎉 Teste bem-sucedido! Face swap funcionando!',
          progress: 100
        });
        
        setTestResult(testResult.result);
        setConnectionTested(true);
        
        setTimeout(() => {
          setProcessing({ status: 'idle', message: '', progress: 0 });
        }, 3000);
      } else {
        setProcessing({
          status: 'error',
          message: `❌ Teste falhado: ${testResult.error}`,
          progress: 0
        });
      }
    } catch (error) {
      setProcessing({
        status: 'error',
        message: `❌ ${error instanceof Error ? error.message : 'Test failed'}`,
        progress: 0
      });
    }
  };

  // Process face swap
  const processImages = async () => {
    if (!userImage || !selectedGif) return;

    const api = new SupabaseAPI();

    setProcessing({
      status: 'uploading',
      message: 'Iniciando processo de face swap...',
      progress: 10
    });

    try {
      console.log('🚀 Initiating face swap with Segmind via Supabase...');
      console.log('📸 User image:', userImage.name, `(${(userImage.size / 1024).toFixed(1)} KB)`);
      console.log('🎭 Selected GIF:', selectedGif);

      const resultUrl = await api.createFaceSwap(
        userImage, 
        selectedGif,
        (progress, message) => {
          console.log(`📊 Progress: ${progress}% - ${message}`);
          setProcessing({
            status: 'processing',
            message: message,
            progress
          });
        }
      );

      console.log('✅ Face swap completed:', resultUrl);

      setProcessing({
        status: 'completed',
        message: '🎉 Seu GIF de face swap IA está pronto!',
        progress: 100
      });

      setResult(resultUrl);

    } catch (error) {
      console.error('❌ Face swap error:', error);
      
      let errorMessage = 'Face swap failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setProcessing({
        status: 'error',
        message: `❌ ${errorMessage}`,
        progress: 0
      });
    }
  };

  const resetProcess = () => {
    setUserImage(null);
    setSelectedGif(null);
    setTestResult(null);
    setProcessing({
      status: 'idle',
      message: '',
      progress: 0
    });
    setResult(null);
  };

  // Show result if available
  if (result) {
    return (
      <div className={`min-h-screen transition-all duration-500 ${isDark ? '' : 'light-mode'}`}>
        {/* Background Pattern */}
        <div className="fixed inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }}></div>
        </div>

        {/* Header */}
        <header className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  {t('header.title')}
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('header.subtitle')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <LanguageSelector isDark={isDark} />
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl glass-morphism hover:bg-white/10 transition-all duration-300 ${
                  isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Result Display */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
          <ResultDisplay 
            result={result} 
            onReset={resetProcess} 
            isDark={isDark} 
          />
        </main>
      </div>
    );
  }

  // Show processing if in progress
  if (processing.status !== 'idle') {
    return (
      <div className={`min-h-screen transition-all duration-500 ${isDark ? '' : 'light-mode'}`}>
        {/* Background Pattern */}
        <div className="fixed inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }}></div>
        </div>

        {/* Header */}
        <header className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  {t('header.title')}
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('header.subtitle')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <LanguageSelector isDark={isDark} />
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl glass-morphism hover:bg-white/10 transition-all duration-300 ${
                  isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Processing Status */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 pb-12 flex items-center justify-center min-h-[60vh]">
          <ProcessingStatus processing={processing} isDark={isDark} />
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? '' : 'light-mode'}`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                {t('header.title')}
              </h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('header.subtitle')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <LanguageSelector isDark={isDark} />
            
            <button
              onClick={testSpecificUrls}
              className={`p-3 rounded-xl glass-morphism hover:bg-white/10 transition-all duration-300 ${
                testResult ? 'text-purple-400' : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
              title="Testar com URLs específicas"
            >
              <Zap className="w-5 h-5" />
            </button>
            
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl glass-morphism hover:bg-white/10 transition-all duration-300 ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
        <div className="text-center py-8">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            {t('main.supabaseTitle')}
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('main.supabaseSubtitle')}
          </p>
        </div>

        {/* New Side-by-Side Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left Side - Image Upload */}
          <div className="glass-morphism rounded-2xl p-6">
            <ImageUploader onImageSelect={handleImageSelect} isDark={isDark} />
          </div>

          {/* Right Side - GIF Selection */}
          <div className="glass-morphism rounded-2xl p-6">
            <GifSelector onGifSelect={handleGifSelect} isDark={isDark} />
          </div>
        </div>

        {/* Process Button */}
        <div className="text-center">
          <button
            onClick={processImages}
            disabled={!userImage || !selectedGif || processing.status === 'processing'}
            className={`px-12 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 transform
                       ${userImage && selectedGif && processing.status !== 'processing'
                         ? 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white hover:scale-105 animate-pulse-glow'
                         : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                       }`}
          >
            <div className="flex items-center space-x-3">
              {processing.status === 'processing' ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>{t('process.button')}</span>
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </div>
          </button>
          
          {!userImage || !selectedGif ? (
            <p className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {!userImage && !selectedGif ? 'Selecione uma foto e um GIF para continuar' :
               !userImage ? 'Selecione uma foto para continuar' :
               'Selecione um GIF para continuar'}
            </p>
          ) : (
            <p className={`mt-4 text-sm text-green-400`}>
              ✅ Tudo pronto! Clique para criar seu face swap
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="glass-morphism rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold mb-2">{t('features.secure')}</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('features.secureDesc')}
            </p>
          </div>
          
          <div className="glass-morphism rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2">{t('features.edgeFunctions')}</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('features.edgeFunctionsDesc')}
            </p>
          </div>
          
          <div className="glass-morphism rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold mb-2">{t('features.segmindAI')}</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('features.segmindAIDesc')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;