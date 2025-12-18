
import React, { useState } from 'react';
import { GeneratedMedia, TranslationStrings, Language } from '../types';

interface ImageCardProps {
  media: GeneratedMedia;
  t: TranslationStrings;
  onEdit: (media: GeneratedMedia) => void;
  onAnimate: (media: GeneratedMedia) => void;
  language: Language;
}

const ImageCard: React.FC<ImageCardProps> = ({ media, t, onEdit, onAnimate, language }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const link = document.createElement('a');
    link.href = media.url;
    
    // Determine file extension
    const extension = media.type === 'video' ? 'mp4' : 'png';
    
    // Create a filename from the prompt (sanitized)
    const sanitizedPrompt = media.prompt
      .slice(0, 30)
      .replace(/[^a-z0-9\u0600-\u06FF]/gi, '_')
      .toLowerCase();
    
    link.download = `${sanitizedPrompt || 'visionary_ai'}.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="relative rounded-2xl overflow-hidden group bg-[#111] transition-all hover:scale-[1.02] hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {media.type === 'image' ? (
        <img 
          src={media.url} 
          alt={media.prompt} 
          className="w-full h-auto object-cover min-h-[200px]" 
          loading="lazy"
        />
      ) : (
        <video 
          src={media.url} 
          className="w-full h-auto object-cover min-h-[200px]" 
          autoPlay 
          loop 
          muted 
          playsInline
        />
      )}

      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-xs text-gray-200 line-clamp-2 mb-3" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {media.prompt}
          </p>
          
          <div className="flex gap-2">
            {media.type === 'image' && (
              <>
                <button 
                  onClick={() => onEdit(media)}
                  className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[10px] font-bold py-2 rounded-lg transition-all"
                >
                  <i className="fas fa-pen-nib mr-1"></i> {t.edit}
                </button>
                <button 
                  onClick={() => onAnimate(media)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold py-2 rounded-lg transition-all"
                >
                  <i className="fas fa-video mr-1"></i> {t.animate}
                </button>
              </>
            )}
            <button 
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white w-10 h-10 rounded-lg flex items-center justify-center transition-all active:scale-90"
              onClick={handleDownload}
              title="Download"
            >
              <i className="fas fa-download"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Type badge */}
      <div className="absolute top-3 right-3 flex gap-2">
        {media.type === 'video' && (
          <div className="bg-purple-600 text-[10px] font-bold px-2 py-1 rounded text-white flex items-center gap-1">
            <i className="fas fa-film"></i> VIDEO
          </div>
        )}
        <div className="bg-black/60 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded text-white border border-white/10">
          {media.metadata?.size || '720p'}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
