
import React from 'react';
import { TranslationStrings, Language } from '../types';

interface SidebarProps {
  t: TranslationStrings;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ t, language, setLanguage, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'explore', icon: 'fa-compass', label: t.explore },
    { id: 'creations', icon: 'fa-images', label: t.myCreations },
    { id: 'canvas', icon: 'fa-paint-brush', label: t.canvas },
    { id: 'batch', icon: 'fa-layer-group', label: t.batch },
    { id: 'characters', icon: 'fa-user-astronaut', label: t.characters },
  ];

  return (
    <aside className={`w-64 bg-[#0a0a0a] border-${language === 'ar' ? 'l' : 'r'} border-[#1a1a1a] flex flex-col h-screen fixed ${language === 'ar' ? 'right-0' : 'left-0'} top-0 z-20`}>
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
          <span className="text-white font-black text-xl">Z</span>
        </div>
        <span className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          {language === 'ar' ? 'زمام' : 'ZIMAM'}
        </span>
      </div>

      <nav className="flex-1 px-4 mt-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-[#161616] text-white shadow-inner border border-white/5' 
                    : 'text-gray-500 hover:bg-[#111] hover:text-gray-200'
                }`}
              >
                <i className={`fas ${item.icon} text-lg ${activeTab === item.id ? 'text-purple-500' : 'text-gray-600'}`}></i>
                <span className="text-sm font-bold">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 border-t border-[#1a1a1a] space-y-5">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-medium"
        >
          <i className="fas fa-language text-lg"></i>
          <span>{t.language}</span>
        </button>

        <div className="bg-gradient-to-br from-[#161616] to-[#0a0a0a] border border-white/5 rounded-[24px] p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Credits</span>
            <span className="text-[10px] font-bold text-purple-400">12 / 50</span>
          </div>
          <div className="h-1.5 w-full bg-[#222] rounded-full overflow-hidden mb-4">
            <div className="h-full bg-gradient-to-r from-purple-600 to-pink-500 w-[24%]"></div>
          </div>
          <button className="w-full bg-white text-black hover:bg-gray-200 text-xs font-black py-2.5 rounded-xl transition-all shadow-lg">
            {t.upgrade}
          </button>
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="relative">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-10 h-10 rounded-full border border-white/10 p-0.5" alt="Avatar" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-gray-200 truncate leading-tight">Mohammed_A</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">Pro Member</p>
          </div>
          <i className="fas fa-ellipsis-v text-gray-600 text-[10px]"></i>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
