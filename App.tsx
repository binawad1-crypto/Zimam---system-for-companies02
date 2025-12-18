
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
  const [language, setLanguage] = useState<Language>('ar');
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

  useEffect(() => {
    if (user) {
      const initial = Array.from({ length: 12 }).map((_, i) => ({
        id: `initial-${i}`,
        type: 'image' as const,
        url: `https://picsum.photos/seed/${i + 200}/1000/${i % 2 === 0 ? 1200 : 800}`,
        prompt: language === 'ar' ? "فن رقمي لمدينة مستقبلية في الليل" : "Digital art of a futuristic city at night",
        timestamp: Date.now() - i * 3600000,
        metadata: { aspectRatio: (i % 2 === 0 ? '3:4' : '1:1') as AspectRatio, size: '1K' as ImageSize }
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
        prompt: imageUri ? `(Reference) ${prompt}` : prompt,
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-purple-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-4 border-4 border-pink-500/10 rounded-full"></div>
          <div className="absolute inset-4 border-4 border-pink-500 border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login language={language} t={t} onLoginSuccess={setUser} />;
  }

  return (
    <div className={`min-h-screen bg-[#050505] flex ${language === 'ar' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar 
        t={t} 
        language={language} 
        setLanguage={setLanguage} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className={`flex-1 ${language === 'ar' ? 'mr-64' : 'ml-64'} min-h-screen p-6 md:p-12 relative`}>
        {/* Cinematic Background Accents */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/5 blur-[120px] pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto pt-4 relative z-10">
          <PromptInput 
            t={t} 
            language={language} 
            onGenerate={handleGenerate} 
            isLoading={isLoading} 
          />

          {isAdmin && (
            <div className="mb-12 flex justify-center">
              <div className="bg-[#0a0a0a] border border-purple-500/30 text-purple-400 px-8 py-3 rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-4 shadow-2xl shadow-purple-500/10 backdrop-blur-md">
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-ping"></span>
                {language === 'ar' ? 'وضع المسؤول المفعل' : 'Admin Core Activated'}
              </div>
            </div>
          )}

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-4 mb-16 justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
                  activeCategory === cat.id 
                    ? 'bg-white text-black border-white shadow-2xl shadow-white/10' 
                    : 'bg-[#0a0a0a] text-gray-500 border-white/5 hover:text-gray-200 hover:border-white/10'
                }`}
              >
                {language === 'ar' ? cat.ar : cat.en}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 animate-in fade-in zoom-in duration-700">
               <div className="relative w-32 h-32 mb-12">
                <div className="absolute inset-0 border-[8px] border-purple-500/10 rounded-full"></div>
                <div className="absolute inset-0 border-[8px] border-purple-500 border-t-transparent rounded-full animate-[spin_1s_linear_infinite]"></div>
                <div className="absolute inset-6 border-[8px] border-pink-500/10 rounded-full"></div>
                <div className="absolute inset-6 border-[8px] border-pink-500 border-b-transparent rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
                <i className="fas fa-microchip absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-white/80 animate-pulse"></i>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter mb-4">{loadingMsg}</h2>
              {loadingMsg === t.loadingVideo && (
                <div className="bg-purple-600/10 border border-purple-500/20 px-6 py-3 rounded-2xl flex items-center gap-3 animate-bounce">
                  <i className="fas fa-film text-purple-400"></i>
                  <p className="text-sm text-purple-200 font-bold">{t.videoNotice}</p>
                </div>
              )}
            </div>
          )}

          {/* Cinematic Columns Gallery */}
          {!isLoading && (
            <div className="columns-gallery pb-32">
              {history.map((media, idx) => (
                <div key={media.id} className={`gallery-item animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-${idx % 5 * 100}`}>
                  <ImageCard 
                    media={media} 
                    t={t} 
                    language={language}
                    onEdit={handleEditInit}
                    onAnimate={handleAnimate}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modern Professional Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-[#080808] border border-white/10 rounded-[48px] p-12 max-w-2xl w-full shadow-[0_64px_128px_-20px_rgba(139,92,246,0.4)]">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-[24px] flex items-center justify-center shadow-2xl shadow-purple-500/30">
                <i className="fas fa-magic text-2xl"></i>
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tighter">{t.edit}</h3>
                <p className="text-gray-500 font-bold text-lg">{language === 'ar' ? 'تعديل احترافي بالذكاء الاصطناعي' : 'Cinematic AI Refinement'}</p>
              </div>
            </div>
            
            <p className="text-lg text-gray-400 mb-8 font-medium leading-relaxed">
              {language === 'ar' 
                ? 'أدخل التعديلات التي ترغب في تطبيقها على هذا التصميم بدقة' 
                : 'Input the precise modifications you want Zimam to apply to this design.'}
            </p>
            
            <textarea
              autoFocus
              className="w-full bg-[#111] border border-white/10 rounded-[32px] p-8 text-white text-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none mb-10 min-h-[220px] transition-all placeholder-gray-800 font-bold"
              placeholder={language === 'ar' ? 'مثلاً: غير الإضاءة إلى ضوء شمس ذهبي' : 'e.g., Change lighting to golden hour sunlight'}
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
            
            <div className="flex gap-6">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-5 rounded-[24px] bg-[#111] hover:bg-[#1a1a1a] font-black text-gray-500 text-sm uppercase tracking-[0.2em] transition-all border border-white/5"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                onClick={handleApplyEdit}
                className="flex-1 py-5 rounded-[24px] bg-white text-black hover:bg-purple-600 hover:text-white font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl shadow-white/5"
              >
                {language === 'ar' ? 'تأكيد التعديل' : 'Confirm Edit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
