
import React, { useState, useRef } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt, aspectRatio, imageSize, selectedImage || undefined);
    }
  };

  const handleRatioSelect = (ratio: AspectRatio) => {
    setAspectRatio(ratio);
    setShowOptions(false); // Close menu after selection
  };

  const handleSizeSelect = (size: ImageSize) => {
    setImageSize(size);
    setShowOptions(false); // Close menu after selection
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

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 tracking-tight">
        {t.title}
      </h1>

      <form onSubmit={handleSubmit} className="relative group">
        {/* Image Preview Area */}
        {selectedImage && (
          <div className={`absolute bottom-full mb-4 ${language === 'ar' ? 'right-0' : 'left-0'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className="relative group/preview">
              <img 
                src={selectedImage} 
                alt="Reference" 
                className="w-24 h-24 object-cover rounded-2xl border-2 border-purple-500 shadow-xl"
              />
              <button 
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition-colors"
                title={t.removeImage}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}

        <div className="glass-morphism rounded-3xl p-2 shadow-2xl transition-all group-focus-within:ring-2 ring-purple-500/30">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
            <div className="flex-1 flex items-center px-4 py-2 gap-3">
              <button 
                type="button" 
                onClick={triggerUpload}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedImage ? 'bg-purple-600 text-white' : 'bg-[#222] text-gray-400 hover:bg-[#333] hover:text-white'}`}
                title={t.uploadImage}
              >
                <i className="fas fa-image"></i>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.placeholder}
                className="bg-transparent border-none focus:ring-0 text-lg w-full placeholder-gray-500"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            <div className="flex items-center gap-2 p-1 border-t md:border-t-0 md:border-l border-[#333]">
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#222] hover:bg-[#333] transition-colors"
              >
                <i className="fas fa-cog text-gray-400"></i>
                <span className="text-xs font-semibold">{aspectRatio}</span>
              </button>

              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="bg-white text-black font-bold px-8 py-3 rounded-2xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading && <i className="fas fa-spinner fa-spin"></i>}
                {t.generate}
              </button>
            </div>
          </div>
        </div>

        {showOptions && (
          <div className={`absolute top-full mt-4 glass-morphism rounded-2xl p-6 shadow-2xl z-30 w-full md:w-80 ${language === 'ar' ? 'right-0' : 'left-0'} animate-in fade-in zoom-in-95 duration-200`}>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">{t.aspectRatio}</label>
                <div className="grid grid-cols-3 gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => handleRatioSelect(ratio)}
                      className={`py-2 text-xs rounded-lg border transition-all ${
                        aspectRatio === ratio ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] text-gray-400 border-[#333] hover:border-gray-500'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">{t.imageSize}</label>
                <div className="grid grid-cols-3 gap-2">
                  {IMAGE_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeSelect(size)}
                      className={`py-2 text-xs rounded-lg border transition-all ${
                        imageSize === size ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] text-gray-400 border-[#333] hover:border-gray-500'
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
