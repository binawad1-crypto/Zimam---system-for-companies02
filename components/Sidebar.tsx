
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
    <aside className={`w-64 bg-[#111] border-${language === 'ar' ? 'l' : 'r'} border-[#222] flex flex-col h-screen fixed ${language === 'ar' ? 'right-0' : 'left-0'} top-0 z-20`}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <i className="fas fa-bolt text-white"></i>
        </div>
        <span className="text-xl font-bold tracking-tight">VISIONARY</span>
      </div>

      <nav className="flex-1 px-4 mt-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                }`}
              >
                <i className={`fas ${item.icon} w-5`}></i>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#222] space-y-4">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <i className="fas fa-globe"></i>
          <span>{t.language}</span>
        </button>

        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-2xl p-4">
          <p className="text-xs text-purple-200 mb-2">12 credits remaining</p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 rounded-lg transition-all">
            {t.upgrade}
          </button>
        </div>

        <div className="flex items-center gap-3 px-4 py-2">
          <img src="https://picsum.photos/32/32" className="w-8 h-8 rounded-full border border-[#333]" alt="Avatar" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">User_2024</p>
          </div>
          <i className="fas fa-chevron-up text-gray-500 text-xs"></i>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
