
import React, { useState, useRef, useEffect } from 'react';
import { TranslationStrings, Language, AspectRatio, ImageSize } from '../types';
import { ASPECT_RATIOS, IMAGE_SIZES } from '../constants';

interface PromptInputProps {
  t: TranslationStrings;
  language: Language;
  onGenerate: (prompt: string, aspectRatio: AspectRatio, size: ImageSize, imageUri?: string) => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ t, language, onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [showOptions, setShowOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt, aspectRatio, imageSize, selectedImage || undefined);
    }
  };

  const handleRatioSelect = (ratio: AspectRatio) => {
    setAspectRatio(ratio);
    setShowOptions(false);
  };

  const handleSizeSelect = (size: ImageSize) => {
    setImageSize(size);
    setShowOptions(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 mb-16 mt-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter leading-none">
           <span className="text-white">{language === 'ar' ? 'اصنع' : 'Create'}</span>
           <span className="gradient-text mx-3">{language === 'ar' ? 'خيالك' : 'Your Vision'}</span>
        </h1>
        <p className="text-gray-500 font-bold text-lg max-w-lg mx-auto leading-relaxed">
          {language === 'ar' 
            ? 'حول كلماتك إلى لوحات فنية مذهلة بدقة 4K' 
            : 'Transform your words into breathtaking 4K cinematic masterpieces.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        {selectedImage && (
          <div className={`absolute bottom-full mb-8 ${language === 'ar' ? 'right-6' : 'left-6'} animate-in fade-in slide-in-from-bottom-6 duration-500`}>
            <div className="relative group/preview">
              <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img 
                src={selectedImage} 
                alt="Reference" 
                className="relative w-32 h-32 object-cover rounded-[28px] border-2 border-purple-500 shadow-2xl"
              />
              <button 
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-xl hover:bg-red-600 transition-all border-4 border-[#050505] z-10"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}

        <div className="glass-morphism rounded-[36px] p-2.5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] border border-white/5 transition-all focus-within:ring-2 ring-purple-500/40 focus-within:border-purple-500/50 bg-black/50">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="flex-1 flex items-start px-5 py-4 gap-5">
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all flex-shrink-0 ${selectedImage ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/40' : 'bg-[#161616] text-gray-500 hover:bg-[#222] hover:text-white border border-white/5'}`}
              >
                <i className="fas fa-image text-2xl"></i>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
              <textarea
                ref={textareaRef}
                rows={1}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.placeholder}
                className="bg-transparent border-none focus:ring-0 text-2xl w-full placeholder-gray-700 font-bold resize-none py-2 max-h-[300px]"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            <div className="flex items-center gap-4 p-2 border-t md:border-t-0 md:border-l border-white/5">
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#161616] hover:bg-[#222] transition-all text-gray-300 border border-white/5 group"
              >
                <i className="fas fa-cog text-purple-500 group-hover:rotate-90 transition-transform"></i>
                <span className="text-sm font-black tracking-[0.2em]">{aspectRatio}</span>
              </button>

              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="bg-white text-black font-black px-12 py-4 rounded-[22px] hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black flex items-center justify-center gap-4 shadow-xl shadow-white/5 min-w-[180px]"
              >
                {isLoading ? (
                  <i className="fas fa-spinner fa-spin text-xl"></i>
                ) : (
                  <>
                    <span className="text-sm uppercase tracking-widest">{t.generate}</span>
                    <i className={`fas fa-wand-magic-sparkles text-lg ${language === 'ar' ? 'mr-1' : 'ml-1'}`}></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {showOptions && (
          <div className={`absolute top-full mt-8 glass-morphism rounded-[40px] p-10 shadow-3xl z-40 w-full md:w-[440px] ${language === 'ar' ? 'right-0' : 'left-0'} animate-in fade-in zoom-in-95 duration-200 border border-white/10`}>
            <div className="space-y-10">
              <div>
                <div className="flex items-center justify-between mb-5">
                   <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em]">{t.aspectRatio}</label>
                   <span className="text-[10px] text-purple-400 font-black px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">Pro Presets</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => handleRatioSelect(ratio)}
                      className={`py-4 text-sm font-black rounded-2xl border transition-all ${
                        aspectRatio === ratio 
                          ? 'bg-white text-black border-white shadow-xl shadow-white/10' 
                          : 'bg-[#0a0a0a] text-gray-500 border-white/5 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-5">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em]">{t.imageSize}</label>
                  <span className="text-[10px] text-pink-400 font-black px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">Hyper-Res</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {IMAGE_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeSelect(size)}
                      className={`py-4 text-sm font-black rounded-2xl border transition-all ${
                        imageSize === size 
                          ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white border-transparent shadow-xl shadow-purple-500/20' 
                          : 'bg-[#0a0a0a] text-gray-500 border-white/5 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PromptInput;
