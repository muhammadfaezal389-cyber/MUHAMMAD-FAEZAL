import React from 'react';
import { Volume2, VolumeX, Sparkles, Star } from 'lucide-react';
import { sfx } from '../utils/audio';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stars: number;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stars,
  isMuted,
  setIsMuted,
}) => {
  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sfx.isMuted = next;
    if (!next) {
      sfx.playPop();
    }
  };

  const navLinks = [
    { id: 'kelipatan-faktor', label: 'Kelipatan & Faktor' },
    { id: 'prima-pohon', label: 'Prima & Pohon Faktor' },
    { id: 'kpk', label: 'KPK' },
    { id: 'fpb', label: 'FPB' },
    { id: 'aplikasi', label: 'Aplikasi Cerita' },
    { id: 'kuis-game', label: 'Kuis & Game' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            setActiveTab('home');
            sfx.playPop();
          }}
          className="text-left group flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            M5
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight font-display">
              Matematika Juara SD
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:block">
              Kelas 5 · KPK & FPB Ceria
            </span>
          </div>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  sfx.playPop();
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-100 text-amber-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Star Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
            <span className="text-xs font-bold font-mono tabular-nums">{stars} Bintang</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Aktifkan Suara' : 'Matikan Suara'}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-amber-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-slate-100 px-3 py-2 overflow-x-auto flex items-center gap-2 no-scrollbar bg-slate-50/80">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                sfx.playPop();
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
