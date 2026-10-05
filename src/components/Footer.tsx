import React from 'react';
import { BookOpen, Award, RotateCcw } from 'lucide-react';
import { sfx } from '../utils/audio';

interface FooterProps {
  onSelectModule: (id: string) => void;
  onResetProgress: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectModule, onResetProgress }) => {
  return (
    <footer className="mt-16 bg-white border-t border-slate-200 py-10 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                M5
              </div>
              <span className="font-bold text-slate-900 font-display text-base">
                Matematika Juara SD · Kelas 5
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              Aplikasi interaktif pembelajaran konsep kelipatan, faktor, bilangan prima, pohon faktor, KPK, FPB, serta pemecahan masalah kontekstual yang disesuaikan dengan Capaian Pembelajaran Matematika SD.
            </p>
            <div className="text-[11px] text-slate-400">
              Mendukung Kurikulum Merdeka (Fase C) & Kurikulum 2013 Matematika Sekolah Dasar.
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Modul Pembelajaran
            </span>
            <ul className="text-xs space-y-1.5">
              <li>
                <button
                  onClick={() => {
                    onSelectModule('kelipatan-faktor');
                    sfx.playPop();
                  }}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  Kelipatan & Faktor Bilangan
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectModule('prima-pohon');
                    sfx.playPop();
                  }}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  Bilangan Prima & Pohon Faktor
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectModule('kpk');
                    sfx.playPop();
                  }}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  KPK (Kelipatan Persekutuan Terkecil)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectModule('fpb');
                    sfx.playPop();
                  }}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  FPB (Faktor Persekutuan Terbesar)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectModule('aplikasi');
                    sfx.playPop();
                  }}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  Aplikasi Soal Cerita
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Actions & Learning Tools */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Aktivitas Siswa
            </span>
            <ul className="text-xs space-y-1.5">
              <li>
                <button
                  onClick={() => {
                    onSelectModule('kuis-game');
                    sfx.playPop();
                  }}
                  className="hover:text-slate-900 cursor-pointer font-semibold text-amber-700"
                >
                  ★ Kuis Interaktif Berhadiah Bintang
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectModule('kuis-game');
                    sfx.playPop();
                  }}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  🐸 Game Lompat Katak Kelipatan
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => {
                    onResetProgress();
                    sfx.playPop();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Bintang & Kemajuan</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>&copy; {new Date().getFullYear()} Matematika Juara SD · Untuk Guru & Siswa Indonesia</span>
          <span className="text-slate-400">Belajar Matematika Jadi Mudah & Menyenangkan!</span>
        </div>
      </div>
    </footer>
  );
};
