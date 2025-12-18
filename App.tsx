
import React, { useState, useEffect } from 'react';
import { Language, GeneratedMedia, AspectRatio, ImageSize } from './types';
import { TRANSLATIONS, CATEGORIES } from './constants';
import Sidebar from './components/Sidebar';
import PromptInput from './components/PromptInput';
import ImageCard from './components/ImageCard';
import Login from './components/Login';
import { GeminiService } from './services/geminiService';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('ar'); // Default to Arabic for Zamam
  const [activeTab, setActiveTab] = useState('explore');
  const [history, setHistory] = useState<GeneratedMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loadingMsg, setLoadingMsg] = useState('');
  const [editingMedia, setEditingMedia] = useState<GeneratedMedia | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');

  const t = TRANSLATIONS[language];
  const isAdmin = user?.email === 'binawad1@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Mock initial gallery data
  useEffect(() => {
    if (user) {
      const initial = Array.from({ length: 12 }).map((_, i) => ({
        id: `initial-${i}`,
        type: 'image' as const,
        url: `https://picsum.photos/seed/${i + 50}/800/1000`,
        prompt: language === 'ar' ? "لوحة سينمائية لرجل آلي في حديقة نيون" : "Cinematic portrait of a robot in a neon garden",
        timestamp: Date.now() - i * 3600000,
        metadata: { aspectRatio: '3:4' as AspectRatio, size: '1K' as ImageSize }
      }));
      setHistory(initial);
    }
  }, [user, language]);

  const handleGenerate = async (prompt: string, aspectRatio: AspectRatio, size: ImageSize, imageUri?: string) => {
    setIsLoading(true);
    setLoadingMsg(t.loadingImage);
    try {
      const url = await GeminiService.generateImage(prompt, aspectRatio, size, imageUri);
      const newMedia: GeneratedMedia = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'image',
        url,
        prompt: imageUri ? `(Ref) ${prompt}` : prompt,
        timestamp: Date.now(),
        metadata: { aspectRatio, size }
      };
      setHistory(prev => [newMedia, ...prev]);
    } catch (error: any) {
      alert(error.message || "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnimate = async (media: GeneratedMedia) => {
    setIsLoading(true);
    setLoadingMsg(t.loadingVideo);
    try {
      const videoUrl = await GeminiService.generateVideo(media.url, media.prompt, media.metadata?.aspectRatio || '16:9');
      const newMedia: GeneratedMedia = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'video',
        url: videoUrl,
        prompt: `Animated: ${media.prompt}`,
        timestamp: Date.now(),
        metadata: { parentImageId: media.id }
      };
      setHistory(prev => [newMedia, ...prev]);
    } catch (error: any) {
      alert(error.message || "Failed to animate");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditInit = (media: GeneratedMedia) => {
    setEditingMedia(media);
    setIsEditModalOpen(true);
  };

  const handleApplyEdit = async () => {
    if (!editingMedia || !editPrompt) return;
    setIsLoading(true);
    setLoadingMsg(t.loadingImage);
    setIsEditModalOpen(false);
    try {
      const editedUrl = await GeminiService.editImage(editingMedia.url, editPrompt);
      const newMedia: GeneratedMedia = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'image',
        url: editedUrl,
        prompt: `Edited: ${editPrompt}`,
        timestamp: Date.now(),
        metadata: { parentImageId: editingMedia.id }
      };
      setHistory(prev => [newMedia, ...prev]);
    } catch (error: any) {
      alert(error.message || "Failed to edit");
    } finally {
      setIsLoading(false);
      setEditPrompt('');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login language={language} t={t} onLoginSuccess={setUser} />;
  }

  return (
    <div className={`min-h-screen flex ${language === 'ar' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar 
        t={t} 
        language={language} 
        setLanguage={setLanguage} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className={`flex-1 ${language === 'ar' ? 'mr-64' : 'ml-64'} min-h-screen p-8`}>
        <div className="max-w-7xl mx-auto pt-10">
          <PromptInput 
            t={t} 
            language={language} 
            onGenerate={handleGenerate} 
            isLoading={isLoading} 
          />

          {/* Admin Tag */}
          {isAdmin && (
            <div className="mb-8 flex justify-center">
              <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 px-4 py-1 rounded-full text-xs font-bold">
                <i className="fas fa-crown mr-2"></i> {language === 'ar' ? 'وضع المسؤول' : 'Admin Mode'}
              </span>
            </div>
          )}

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 mb-8 justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                {language === 'ar' ? cat.ar : cat.en}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-xl font-medium text-gray-300">{loadingMsg}</p>
              {loadingMsg === t.loadingVideo && (
                <p className="text-sm text-gray-500 mt-2">{t.videoNotice}</p>
              )}
            </div>
          )}

          {/* Masonry Gallery */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {history.map(media => (
              <ImageCard 
                key={media.id} 
                media={media} 
                t={t} 
                language={language}
                onEdit={handleEditInit}
                onAnimate={handleAnimate}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#333] rounded-3xl p-8 max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-4">{t.edit}</h3>
            <p className="text-sm text-gray-400 mb-6">
              {language === 'ar' ? 'صف التعديلات التي تريد إجراؤها على هذه الصورة (مثلاً: "أضف شمس في الخلفية")' : 'Describe the changes you want to make to this image (e.g. "Add a sun in the background")'}
            </p>
            <textarea
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl p-4 text-white focus:ring-purple-500 focus:border-purple-500 mb-6 min-h-[120px]"
              placeholder={t.placeholder}
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
            />
            <div className="flex gap-4">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[#222] hover:bg-[#333] font-bold"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                onClick={handleApplyEdit}
                className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold"
              >
                {t.generate}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
