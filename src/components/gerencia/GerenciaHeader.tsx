import React from 'react';
import { Sun, Moon, ArrowLeft, LogOut } from 'lucide-react';
import logoImg from '../../assets/images/logo.png';

interface Props {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  handleLogout: () => void;
}

export const GerenciaHeader: React.FC<Props> = ({ isDarkMode, toggleDarkMode, handleLogout }) => {
  return (
    <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoImg.src} alt="New Route Logo" className="h-12 sm:h-16 w-auto object-contain" />
          <div className="hidden sm:block">
            <span className="font-bold text-base font-display text-white">GERENCIA & OPERACIONES</span>
            <p className="text-[11px] text-stone-400 font-light">New Route Chile · Central de Despacho 24/7</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button onClick={toggleDarkMode} className="p-1.5 sm:p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors" title="Cambiar tema">
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a href="/" className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] sm:text-xs font-medium transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Ver Web
          </a>
          <button onClick={handleLogout} className="flex items-center gap-1 px-2 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] sm:text-xs font-bold transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Salir
          </button>
        </div>
      </div>
    </header>
  );
};