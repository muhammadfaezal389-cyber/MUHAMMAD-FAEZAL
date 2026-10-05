import React from 'react';
import { ArrowRight, BookOpen, Sparkles, CheckCircle2, Play, Award, Compass, Calculator } from 'lucide-react';
import { sfx } from '../utils/audio';

// Verified generated assets
const HERO_BANNER = '/src/assets/images/hero_math_adventure_1791202445180.jpg';
const MASCOT_IMG = '/src/assets/images/mascot_math_explorer_1791202465780.jpg';

interface HeroSectionProps {
  onSelectModule: (moduleId: string) => void;
  stars: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectModule, stars }) => {
  const learningGoals = [
    {
      id: 'kelipatan-faktor',
      title: '1. Kelipatan & Faktor Bilangan',
      desc: 'Pahami kelipatan, kelipatan persekutuan, faktor pembagi, dan faktor persekutuan lewat tabel interaktif 1-100 & balok persegi.',
      tag: 'Dasar Konsep',
      color: 'bg-emerald-500',
    },
    {
      id: 'prima-pohon',
      title: '2. Bilangan Prima & Pohon Faktor',
      desc: 'Saring bilangan prima lewat Saringan Eratosthenes dan susun ranting pohon faktor untuk menemukan faktorisasi prima.',
      tag: 'Eksplorasi Ranting',
      color: 'bg-indigo-500',
    },
    {
      id: 'kpk',
      title: '3. KPK (Kelipatan Persekutuan Terkecil)',
      desc: 'Tentukan KPK dari 2 atau 3 bilangan dengan metode mendaftar kelipatan lompat dan metode faktorisasi prima pangkat terbesar.',
      tag: 'Pangkat Terbesar',
      color: 'bg-blue-500',
    },
    {
      id: 'fpb',
      title: '4. FPB (Faktor Persekutuan Terbesar)',
      desc: 'Kuasai FPB dari 2 atau 3 bilangan dengan tabel pasangan faktor dan faktorisasi prima pangkat terkecil untuk menyederhanakan pecahan.',
      tag: 'Pangkat Terkecil',
      color: 'bg-amber-500',
    },
    {
      id: 'aplikasi',
      title: '5. Aplikasi Kontekstual KPK & FPB',
      desc: 'Simulasi jadwal berulang (bus bersamaan) dan pembagian paket bingkisan adil dengan 3 tingkat kesulitan bertingkat (Pemula, Menengah, Mahir).',
      tag: 'Dunia Nyata',
      color: 'bg-rose-500',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner Area */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={HERO_BANNER}
            alt="Petualangan Matematika Kelas 5 SD"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-400/30 rounded-full text-amber-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Matematika Interaktif Kelas 5 Sekolah Dasar</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white leading-tight">
            Kuasai Perkalian & Pembagian Lewat Petualangan KPK & FPB!
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Selamat datang di laboratorium matematika interaktif! Bersama <strong className="text-amber-300">Kiki si Kancil Cerdas</strong>, kamu akan membedah konsep kelipatan, mengurai pohon faktor yang bercahaya, serta memecahkan misteri jadwal bus dan bingkisan kado yang adil.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                sfx.playJump();
                onSelectModule('kelipatan-faktor');
              }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              Mulai Petualangan Belajar
            </button>

            <button
              onClick={() => {
                sfx.playPop();
                onSelectModule('kuis-game');
              }}
              className="px-6 py-3 bg-slate-800/90 hover:bg-slate-700/90 text-white font-semibold text-sm rounded-xl border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              Tantangan Kuis & Game
            </button>
          </div>
        </div>
      </div>

      {/* Mascot Guidance Callout */}
      <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden bg-amber-100 border-2 border-amber-300 shadow-xs relative">
          <img
            src={MASCOT_IMG}
            alt="Kiki si Kancil Pintar"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900 font-display">Pesan Hangat dari Kiki</h2>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Sahabat Belajarmu</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            "Hai teman juara! Jangan takut dengan KPK dan FPB. Matematika itu seperti bermain teka-teki logika yang sangat seru. Di sini kamu bisa mencoba memasukkan angka favoritmu sendiri, melihat pohon faktor bergoyang, dan menguji kemampuanmu di arena kuis berhadiah bintang!"
          </p>
        </div>
        <div className="shrink-0 flex sm:flex-col items-center gap-2">
          <div className="text-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs text-slate-500 font-medium">Bintang Terkumpul</div>
            <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">★ {stars}</div>
          </div>
        </div>
      </div>

      {/* 5 Kurikulum Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Tujuan Pembelajaran Kurikulum</h2>
            <p className="text-xs text-slate-500">Pilih modul di bawah untuk langsung belajar dan berlatih secara interaktif</p>
          </div>
          <span className="text-xs font-semibold text-slate-400 hidden sm:block">5 Modul Lengkap</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningGoals.map((item, index) => (
            <div
              key={item.id}
              onClick={() => {
                sfx.playPop();
                onSelectModule(item.id);
              }}
              className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                    {item.tag}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Modul 0{index + 1}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors font-display mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-amber-600">
                <span>Buka Simulasi</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}

          {/* Special Game Module Card */}
          <div
            onClick={() => {
              sfx.playFanfare();
              onSelectModule('kuis-game');
            }}
            className="group bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-md">
                  Tantangan Seru
                </span>
                <Award className="w-5 h-5 text-amber-200" />
              </div>
              <h3 className="text-base font-bold text-white font-display mb-2">
                6. Arena Kuis Animasi & Game Katak
              </h3>
              <p className="text-xs text-amber-50 leading-relaxed">
                Uji pemahamanmu dengan kuis interaktif beranimasi, raih skor tinggi, dan mainkan game lompat katak kelipatan!
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
              <span>Mulai Kuis & Game</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
