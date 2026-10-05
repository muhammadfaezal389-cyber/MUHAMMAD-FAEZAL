import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  Gift,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  Gauge,
  Sliders,
  Calculator,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react';
import { calculateKPK, calculateFPB, toSuperscript } from '../utils/mathUtils';
import { sfx } from '../utils/audio';

const KPK_STORY_IMG = '/src/assets/images/story_kpk_scheduling_1791202480657.jpg';
const FPB_STORY_IMG = '/src/assets/images/story_fpb_gift_sharing_1791202493047.jpg';

export type DifficultyLevel = 'pemula' | 'menengah' | 'mahir';

interface DifficultyPreset {
  id: DifficultyLevel;
  name: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  desc: string;
  kpk: {
    optionsA: number[];
    optionsB: number[];
    defaultA: number;
    defaultB: number;
    maxTimeline: number;
  };
  fpb: {
    optionsA: number[];
    optionsB: number[];
    defaultA: number;
    defaultB: number;
    maxBags: number;
  };
}

const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyPreset> = {
  pemula: {
    id: 'pemula',
    name: 'Tingkat 1: Pemula (Mudah)',
    badge: 'Dasar',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    desc: 'Bilangan kecil & ramah (interval 3-10 menit, barang 8-20 buah) untuk membangun pemahaman awal.',
    kpk: {
      optionsA: [3, 4, 6, 8],
      optionsB: [4, 6, 8, 10],
      defaultA: 4,
      defaultB: 6,
      maxTimeline: 60,
    },
    fpb: {
      optionsA: [8, 12, 16, 18],
      optionsB: [12, 16, 18, 20],
      defaultA: 12,
      defaultB: 16,
      maxBags: 16,
    },
  },
  menengah: {
    id: 'menengah',
    name: 'Tingkat 2: Menengah (Standar Kelas 5)',
    badge: 'Standar Kurikulum',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    desc: 'Bilangan standar kurikulum SD (interval 10-24 menit, barang 24-42 buah) melatih kelancaran hitung.',
    kpk: {
      optionsA: [10, 12, 15, 20],
      optionsB: [12, 15, 20, 24],
      defaultA: 15,
      defaultB: 20,
      maxTimeline: 120,
    },
    fpb: {
      optionsA: [18, 20, 24, 30],
      optionsB: [24, 30, 36, 40],
      defaultA: 24,
      defaultB: 36,
      maxBags: 24,
    },
  },
  mahir: {
    id: 'mahir',
    name: 'Tingkat 3: Mahir (Tantangan Pengayaan)',
    badge: 'Tantangan Juara',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
    desc: 'Bilangan lebih besar & kompleks (interval 18-45 menit, barang 48-120 buah) menguji analisis faktorisasi prima.',
    kpk: {
      optionsA: [18, 20, 24, 30, 36],
      optionsB: [24, 30, 36, 40, 45],
      defaultA: 24,
      defaultB: 36,
      maxTimeline: 240,
    },
    fpb: {
      optionsA: [36, 48, 60, 72],
      optionsB: [48, 60, 72, 84],
      defaultA: 48,
      defaultB: 72,
      maxBags: 48,
    },
  },
};

export const ModuleContextualApp: React.FC = () => {
  const [activeStory, setActiveStory] = useState<'kpk-jadwal' | 'fpb-bingkisan'>('kpk-jadwal');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('menengah');

  const curConfig = DIFFICULTY_CONFIGS[difficulty];

  // KPK Scheduling State
  const [busAInterval, setBusAInterval] = useState<number>(curConfig.kpk.defaultA);
  const [busBInterval, setBusBInterval] = useState<number>(curConfig.kpk.defaultB);
  const [simTime, setSimTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showKPKSteps, setShowKPKSteps] = useState<boolean>(false);
  const [kpkStepMethod, setKpkStepMethod] = useState<'prima' | 'daftar'>('prima');

  const kpkData = calculateKPK([busAInterval, busBInterval]);
  const kpkSolution = kpkData.kpk;

  // FPB Gift Bags State
  const [itemACount, setItemACount] = useState<number>(curConfig.fpb.defaultA);
  const [itemBCount, setItemBCount] = useState<number>(curConfig.fpb.defaultB);
  const [bagChoice, setBagChoice] = useState<number>(6);
  const [showFPBSteps, setShowFPBSteps] = useState<boolean>(false);
  const [fpbStepMethod, setFpbStepMethod] = useState<'prima' | 'daftar'>('prima');

  const fpbData = calculateFPB([itemACount, itemBCount]);
  const fpbSolution = fpbData.fpb;
  const isAValid = itemACount % bagChoice === 0;
  const isBValid = itemBCount % bagChoice === 0;
  const isAllValid = isAValid && isBValid;
  const isMaxBags = isAllValid && bagChoice === fpbSolution;

  // Handle difficulty switch
  const handleDifficultyChange = (newLevel: DifficultyLevel) => {
    sfx.playPop();
    setDifficulty(newLevel);
    const cfg = DIFFICULTY_CONFIGS[newLevel];

    // Reset KPK
    setBusAInterval(cfg.kpk.defaultA);
    setBusBInterval(cfg.kpk.defaultB);
    setSimTime(0);
    setIsPlaying(false);

    // Reset FPB
    setItemACount(cfg.fpb.defaultA);
    setItemBCount(cfg.fpb.defaultB);
    const newFpb = calculateFPB([cfg.fpb.defaultA, cfg.fpb.defaultB]).fpb;
    setBagChoice(Math.max(1, Math.floor(newFpb / 2) || newFpb));
  };

  // KPK Timer Animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setSimTime((prev) => {
          if (prev >= curConfig.kpk.maxTimeline) {
            setIsPlaying(false);
            return curConfig.kpk.maxTimeline;
          }
          const next = prev + 1;
          if (next === kpkSolution) {
            sfx.playFanfare();
          } else if (next % busAInterval === 0 || next % busBInterval === 0) {
            sfx.playPop();
          }
          return next;
        });
      }, 90);
    }
    return () => clearInterval(timer);
  }, [isPlaying, kpkSolution, busAInterval, busBInterval, curConfig.kpk.maxTimeline]);

  return (
    <div className="ModuleContextualApp space-y-6">
      {/* Title & Segmented Story Selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
            Tujuan Pembelajaran 5
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-display">
            Aplikasi Kontekstual KPK & FPB
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Menganalisis dan memecahkan soal cerita kehidupan sehari-hari
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              setActiveStory('kpk-jadwal');
              sfx.playPop();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeStory === 'kpk-jadwal'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🚌 Kasus 1: Penjadwalan Bersama (KPK)
          </button>
          <button
            onClick={() => {
              setActiveStory('fpb-bingkisan');
              sfx.playPop();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeStory === 'fpb-bingkisan'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎁 Kasus 2: Pembagian Bingkisan Adil (FPB)
          </button>
        </div>
      </div>

      {/* Difficulty Level Selector Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Tingkat Kesulitan Soal Cerita
              </h3>
              <p className="text-xs text-slate-500">
                Pilih rentang angka untuk menyesuaikan tantangan belajar siswa
              </p>
            </div>
          </div>

          {/* Segmented Difficulty Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {(['pemula', 'menengah', 'mahir'] as DifficultyLevel[]).map((lvl) => {
              const isSelected = difficulty === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => handleDifficultyChange(lvl)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      lvl === 'pemula'
                        ? 'bg-emerald-500'
                        : lvl === 'menengah'
                        ? 'bg-blue-500'
                        : 'bg-purple-500'
                    }`}
                  />
                  <span>
                    {lvl === 'pemula'
                      ? 'Pemula'
                      : lvl === 'menengah'
                      ? 'Menengah (Kelas 5)'
                      : 'Mahir (Tantangan)'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Difficulty Summary Note */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded ${curConfig.badgeBg} ${curConfig.badgeText}`}
            >
              {curConfig.badge}
            </span>
            <span className="text-slate-700 font-medium">{curConfig.desc}</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px] shrink-0">
            {activeStory === 'kpk-jadwal'
              ? `Timeline: 0–${curConfig.kpk.maxTimeline} m`
              : `Batas Kantong: s.d ${curConfig.fpb.maxBags}`}
          </span>
        </div>
      </div>

      {activeStory === 'kpk-jadwal' ? (
        /* ================= KASUS 1: PENJADWALAN BERSAMA (KPK) ================= */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Story Card & Illustration */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-[4/3] relative">
                <img
                  src={KPK_STORY_IMG}
                  alt="Cerita Jadwal Bus Bersamaan"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Soal Cerita Nyata
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${curConfig.badgeBg} ${curConfig.badgeText}`}>
                    {curConfig.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display mt-1">
                  Jadwal Keberangkatan Bus Sekolah
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Bus Merah berangkat setiap <strong>{busAInterval} menit</strong> sekali. Bus Kuning berangkat setiap <strong>{busBInterval} menit</strong> sekali. Jika pukul 07:00 kedua bus berangkat bersama-sama, setelah berapa menitkah kedua bus akan berangkat bersamaan lagi untuk pertama kali?
                </p>
              </div>

              {/* Interval Controls from current difficulty range */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Jadwal Bus Merah (Interval): <span className="font-bold text-rose-600 font-mono">{busAInterval} menit</span>
                  </label>
                  <div className="flex gap-1.5 flex-wrap">
                    {curConfig.kpk.optionsA.map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setBusAInterval(m);
                          setSimTime(0);
                          sfx.playPop();
                        }}
                        className={`flex-1 min-w-[42px] py-1 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                          busAInterval === m
                            ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Jadwal Bus Kuning (Interval): <span className="font-bold text-amber-600 font-mono">{busBInterval} menit</span>
                  </label>
                  <div className="flex gap-1.5 flex-wrap">
                    {curConfig.kpk.optionsB.map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setBusBInterval(m);
                          setSimTime(0);
                          sfx.playPop();
                        }}
                        className={`flex-1 min-w-[42px] py-1 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                          busBInterval === m
                            ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Interactive Timeline Simulator */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Simulasi Garis Waktu Keberangkatan (0 s.d {curConfig.kpk.maxTimeline} Menit)
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsPlaying(!isPlaying);
                        sfx.playPop();
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {isPlaying ? 'Jeda Waktu' : 'Jalankan Waktu'}
                    </button>
                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        setSimTime(0);
                        sfx.playPop();
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg cursor-pointer"
                      title="Reset Waktu"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Clock Gauge Header */}
                <div className="my-4 p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Waktu Berjalan Sekarang:</span>
                    <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                      {simTime} <span className="text-sm font-normal text-slate-500">menit</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-medium block">Titik Temu Pertama (KPK):</span>
                    <span className="text-2xl font-bold font-mono text-blue-600">
                      {kpkSolution} menit
                    </span>
                  </div>
                </div>

                {/* Bus A Track */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-rose-700">🚌 Bus Merah (Setiap {busAInterval} m)</span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      Jadwal: {Array.from({ length: 6 }, (_, i) => (i + 1) * busAInterval).join(', ')}m...
                    </span>
                  </div>
                  <div className="h-9 bg-slate-100 rounded-lg relative overflow-hidden border border-slate-200">
                    {/* Tick markers */}
                    {Array.from({ length: Math.floor(curConfig.kpk.maxTimeline / busAInterval) }, (_, i) => {
                      const pos = (i + 1) * busAInterval;
                      const isReached = simTime >= pos;
                      const isSync = pos % kpkSolution === 0;
                      return (
                        <div
                          key={pos}
                          style={{ left: `${(pos / curConfig.kpk.maxTimeline) * 100}%` }}
                          className={`absolute top-0 bottom-0 w-1 flex flex-col items-center justify-center transform -translate-x-1/2 ${
                            isSync
                              ? 'bg-amber-400 z-20'
                              : isReached
                              ? 'bg-rose-500'
                              : 'bg-rose-300'
                          }`}
                        >
                          <span
                            className={`text-[8px] font-mono font-bold px-1 rounded absolute -top-0.5 ${
                              isSync ? 'bg-amber-400 text-slate-950 font-extrabold' : 'text-slate-700'
                            }`}
                          >
                            {pos}
                          </span>
                        </div>
                      );
                    })}
                    {/* Time Head */}
                    <div
                      style={{ left: `${(simTime / curConfig.kpk.maxTimeline) * 100}%` }}
                      className="absolute top-0 bottom-0 w-0.5 bg-blue-600 z-30 transform -translate-x-1/2 shadow-md"
                    />
                  </div>
                </div>

                {/* Bus B Track */}
                <div className="space-y-1 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-amber-700">🚎 Bus Kuning (Setiap {busBInterval} m)</span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      Jadwal: {Array.from({ length: 6 }, (_, i) => (i + 1) * busBInterval).join(', ')}m...
                    </span>
                  </div>
                  <div className="h-9 bg-slate-100 rounded-lg relative overflow-hidden border border-slate-200">
                    {Array.from({ length: Math.floor(curConfig.kpk.maxTimeline / busBInterval) }, (_, i) => {
                      const pos = (i + 1) * busBInterval;
                      const isReached = simTime >= pos;
                      const isSync = pos % kpkSolution === 0;
                      return (
                        <div
                          key={pos}
                          style={{ left: `${(pos / curConfig.kpk.maxTimeline) * 100}%` }}
                          className={`absolute top-0 bottom-0 w-1 flex flex-col items-center justify-center transform -translate-x-1/2 ${
                            isSync
                              ? 'bg-amber-400 z-20'
                              : isReached
                              ? 'bg-amber-500'
                              : 'bg-amber-300'
                          }`}
                        >
                          <span
                            className={`text-[8px] font-mono font-bold px-1 rounded absolute -top-0.5 ${
                              isSync ? 'bg-amber-400 text-slate-950 font-extrabold' : 'text-slate-700'
                            }`}
                          >
                            {pos}
                          </span>
                        </div>
                      );
                    })}
                    {/* Time Head */}
                    <div
                      style={{ left: `${(simTime / curConfig.kpk.maxTimeline) * 100}%` }}
                      className="absolute top-0 bottom-0 w-0.5 bg-blue-600 z-30 transform -translate-x-1/2 shadow-md"
                    />
                  </div>
                </div>

                {/* Slider bar for manual scrub */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-600">
                      Geser Waktu Manual:
                    </label>
                    <span className="text-slate-400 font-mono text-[11px]">
                      0 s.d {curConfig.kpk.maxTimeline} Menit
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={curConfig.kpk.maxTimeline}
                    value={simTime}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setSimTime(val);
                      if (val === kpkSolution) sfx.playFanfare();
                    }}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Status Outcome with Tunjukkan Langkah Button */}
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed transition-all space-y-3 ${
                  simTime === kpkSolution
                    ? 'bg-amber-100 border-amber-300 text-amber-950 ring-2 ring-amber-400'
                    : simTime > 0 && (simTime % kpkSolution === 0)
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Kesimpulan Masalah Jadwal ({curConfig.name}):</span>
                  </div>
                  <p>
                    Kedua bus akan berangkat bersamaan pada menit ke-
                    <strong className="text-base text-blue-700 font-mono mx-1 font-bold">
                      {kpkSolution}
                    </strong>
                    karena {kpkSolution} adalah <strong>KPK</strong> dari {busAInterval} dan {busBInterval}.
                    {simTime === kpkSolution && (
                      <span className="block mt-1 text-emerald-800 font-bold">
                        🎉 BINGGO! Waktu sekarang pas di menit ke-{kpkSolution}, kedua bus membunyikan klakson bersamaan!
                      </span>
                    )}
                  </p>
                </div>

                {/* Tunjukkan Langkah Button */}
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-600">
                    Ingin melihat bagaimana angka {kpkSolution} dihitung secara matematis?
                  </span>
                  <button
                    onClick={() => {
                      setShowKPKSteps(!showKPKSteps);
                      sfx.playPop();
                    }}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>{showKPKSteps ? 'Tutup Langkah' : 'Tunjukkan Langkah'}</span>
                    {showKPKSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Step-by-Step Educational Solution Drawer */}
              {showKPKSteps && (
                <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-2xl border-2 border-blue-200 space-y-4 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-200">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-700" />
                      <h4 className="text-sm font-bold text-blue-950 font-display">
                        Langkah Perhitungan KPK ({busAInterval} & {busBInterval})
                      </h4>
                    </div>

                    {/* Method Selector */}
                    <div className="flex items-center gap-1 p-1 bg-white/80 rounded-lg border border-blue-200">
                      <button
                        onClick={() => {
                          setKpkStepMethod('prima');
                          sfx.playPop();
                        }}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                          kpkStepMethod === 'prima'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Faktorisasi Prima (Pohon Faktor)
                      </button>
                      <button
                        onClick={() => {
                          setKpkStepMethod('daftar');
                          sfx.playPop();
                        }}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                          kpkStepMethod === 'daftar'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Mendaftar Kelipatan
                      </button>
                    </div>
                  </div>

                  {kpkStepMethod === 'prima' ? (
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block mb-1.5">
                          1. Bentuk Faktorisasi Prima (Pohon Faktor):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {kpkData.primeBreakdowns.map((pb) => (
                            <div
                              key={pb.number}
                              className="p-2.5 bg-white rounded-xl border border-blue-100 font-mono flex items-center justify-between"
                            >
                              <span className="font-bold text-slate-900">{pb.number}</span>
                              <span className="text-blue-700 font-bold">
                                ={' '}
                                {pb.factors
                                  .map((f) =>
                                    f.exponent > 1
                                      ? `${f.prime}${toSuperscript(f.exponent)}`
                                      : `${f.prime}`
                                  )
                                  .join(' × ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-800 block mb-1">
                          2. Ambil Semua Faktor Prima dengan Pangkat Tertinggi:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {kpkData.allPrimes.map((p) => {
                            const info = kpkData.maxPowerMap[p];
                            return (
                              <span
                                key={p}
                                className="px-2.5 py-1 bg-blue-100 text-blue-900 rounded-lg font-mono font-bold border border-blue-200"
                              >
                                {p}
                                {toSuperscript(info.exponent)} (dari {info.sourceNumber})
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="p-3 bg-blue-600 text-white rounded-xl shadow-xs">
                        <span className="text-[11px] text-blue-200 block mb-0.5">
                          3. Kalikan Semua Faktor Terpilih:
                        </span>
                        <div className="font-mono text-base font-extrabold tracking-wide">
                          KPK({busAInterval}, {busBInterval}) = {kpkData.multiplicationSteps} menit
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs">
                      <span className="font-bold text-slate-800 block">
                        Daftar Kelipatan Waktu Keberangkatan:
                      </span>
                      <div className="space-y-2">
                        <div className="p-2.5 bg-white rounded-xl border border-blue-100 font-mono">
                          <span className="font-bold text-rose-700 block mb-1">
                            Kelipatan {busAInterval}:
                          </span>
                          <span className="text-slate-700 break-words">
                            {Array.from({ length: 8 }, (_, i) => (i + 1) * busAInterval).map((m) => (
                              <span
                                key={m}
                                className={`mr-1.5 px-1.5 py-0.5 rounded ${
                                  m === kpkSolution ? 'bg-amber-300 text-slate-900 font-bold' : ''
                                }`}
                              >
                                {m}
                              </span>
                            ))}
                            ...
                          </span>
                        </div>

                        <div className="p-2.5 bg-white rounded-xl border border-blue-100 font-mono">
                          <span className="font-bold text-amber-700 block mb-1">
                            Kelipatan {busBInterval}:
                          </span>
                          <span className="text-slate-700 break-words">
                            {Array.from({ length: 8 }, (_, i) => (i + 1) * busBInterval).map((m) => (
                              <span
                                key={m}
                                className={`mr-1.5 px-1.5 py-0.5 rounded ${
                                  m === kpkSolution ? 'bg-amber-300 text-slate-900 font-bold' : ''
                                }`}
                              >
                                {m}
                              </span>
                            ))}
                            ...
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                        <p className="font-medium">
                          Titik temu kelipatan terkecil yang pertama kali sama adalah{' '}
                          <strong className="font-mono font-bold text-emerald-800 text-sm">{kpkSolution} menit</strong>.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ================= KASUS 2: PEMBAGIAN BINGKISAN ADIL (FPB) ================= */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Story Card & Illustration */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-[4/3] relative">
                <img
                  src={FPB_STORY_IMG}
                  alt="Cerita Bingkisan Hadiah FPB"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Soal Cerita Nyata
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${curConfig.badgeBg} ${curConfig.badgeText}`}>
                    {curConfig.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display mt-1">
                  Membagi Paket Hadiah Ulang Tahun
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Ibu menyiapkan <strong>{itemACount} pensil warna</strong> dan <strong>{itemBCount} buku gambar</strong>. Ibu ingin memasukkannya ke dalam kantong bingkisan dengan jumlah pensil dan buku sama rata tanpa sisa. Berapa kantong terbanyak yang dapat dibuat?
                </p>
              </div>

              {/* Adjust Item Quantities from current difficulty range */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Jumlah Pensil Warna: <span className="font-bold text-indigo-600 font-mono">{itemACount} buah</span>
                  </label>
                  <div className="flex gap-1.5 flex-wrap">
                    {curConfig.fpb.optionsA.map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setItemACount(q);
                          sfx.playPop();
                        }}
                        className={`flex-1 min-w-[42px] py-1 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                          itemACount === q
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Jumlah Buku Gambar: <span className="font-bold text-emerald-600 font-mono">{itemBCount} buah</span>
                  </label>
                  <div className="flex gap-1.5 flex-wrap">
                    {curConfig.fpb.optionsB.map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setItemBCount(q);
                          sfx.playPop();
                        }}
                        className={`flex-1 min-w-[42px] py-1 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                          itemBCount === q
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Packing Workshop */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                    <Gift className="w-4 h-4 text-amber-600" />
                    Uji Jumlah Kantong Bingkisan
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    Target FPB: <strong className="text-emerald-700 font-mono text-sm">{fpbSolution} Kantong</strong>
                  </span>
                </div>

                {/* Slider for bag count */}
                <div className="my-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">
                      Coba buat sebanyak: <strong className="text-base text-amber-700 font-mono">{bagChoice} Kantong</strong>
                    </span>
                    <span className="text-slate-500">Geser slider (1 s.d {curConfig.fpb.maxBags}):</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={curConfig.fpb.maxBags}
                    value={bagChoice}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setBagChoice(val);
                      if (val === fpbSolution) {
                        sfx.playFanfare();
                      } else {
                        sfx.playPop();
                      }
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Distribution Math Check */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <div
                    className={`p-3 rounded-xl border text-xs ${
                      isAValid
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-950'
                        : 'bg-rose-50 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between mb-1">
                      <span>Pensil: {itemACount} ÷ {bagChoice}</span>
                      <span>{isAValid ? '✓ Pas Rata' : '✕ Ada Sisa'}</span>
                    </div>
                    <p>
                      Masing-masing kantong dapat{' '}
                      <strong>{Math.floor(itemACount / bagChoice)} pensil</strong>
                      {!isAValid && ` (sisa ${itemACount % bagChoice} buah tidak terbagi)`}
                    </p>
                  </div>

                  <div
                    className={`p-3 rounded-xl border text-xs ${
                      isBValid
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between mb-1">
                      <span>Buku: {itemBCount} ÷ {bagChoice}</span>
                      <span>{isBValid ? '✓ Pas Rata' : '✕ Ada Sisa'}</span>
                    </div>
                    <p>
                      Masing-masing kantong dapat{' '}
                      <strong>{Math.floor(itemBCount / bagChoice)} buku</strong>
                      {!isBValid && ` (sisa ${itemBCount % bagChoice} buah tidak terbagi)`}
                    </p>
                  </div>
                </div>

                {/* Visual Preview of Bags */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    Visualisasi {Math.min(bagChoice, 12)} Kantong Bingkisan {bagChoice > 12 && `(dari total ${bagChoice} kantong)`}:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {Array.from({ length: Math.min(bagChoice, 12) }, (_, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center shadow-xs transition-all ${
                          isAllValid
                            ? 'bg-amber-50 border-amber-300'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <span className="text-xl mb-0.5">🎁</span>
                        <span className="text-[10px] font-bold text-slate-700">Kantong {i + 1}</span>
                        {isAllValid ? (
                          <div className="text-[9px] text-slate-600 font-mono mt-0.5">
                            <div>✏️ {itemACount / bagChoice} pensil</div>
                            <div>📚 {itemBCount / bagChoice} buku</div>
                          </div>
                        ) : (
                          <span className="text-[9px] text-rose-600 font-bold mt-0.5">Tidak rata</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Outcome with Tunjukkan Langkah Button */}
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed transition-all space-y-3 ${
                  isMaxBags
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 ring-2 ring-emerald-400'
                    : isAllValid
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div>
                  <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Kesimpulan Masalah Bingkisan ({curConfig.name}):</span>
                  </div>
                  {isMaxBags ? (
                    <p>
                      🎉 <strong>LUAR BIASA!</strong> {bagChoice} adalah <strong>jumlah kantong terbanyak (FPB)</strong> yang bisa dibuat tanpa sisa sedikit pun! Setiap kantong berisi tepat {itemACount / fpbSolution} pensil dan {itemBCount / fpbSolution} buku.
                    </p>
                  ) : isAllValid ? (
                    <p>
                      {bagChoice} kantong memang terbagi rata, tetapi <strong>masih belum yang paling banyak</strong>. Ingat, kita mencari kantong <i>terbanyak</i> (FPB = {fpbSolution}). Coba perbesar lagi slidernya!
                    </p>
                  ) : (
                    <p>
                      {bagChoice} kantong tidak bisa digunakan karena meninggalkan sisa barang. Pilihlah angka yang merupakan faktor persekutuan dari {itemACount} dan {itemBCount}!
                    </p>
                  )}
                </div>

                {/* Tunjukkan Langkah Button */}
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-600">
                    Ingin melihat bagaimana FPB = {fpbSolution} dihitung dengan rumus matematika?
                  </span>
                  <button
                    onClick={() => {
                      setShowFPBSteps(!showFPBSteps);
                      sfx.playPop();
                    }}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>{showFPBSteps ? 'Tutup Langkah' : 'Tunjukkan Langkah'}</span>
                    {showFPBSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Step-by-Step Educational Solution Drawer for FPB */}
              {showFPBSteps && (
                <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-2xl border-2 border-amber-200 space-y-4 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-200">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-700" />
                      <h4 className="text-sm font-bold text-amber-950 font-display">
                        Langkah Perhitungan FPB ({itemACount} & {itemBCount})
                      </h4>
                    </div>

                    {/* Method Selector */}
                    <div className="flex items-center gap-1 p-1 bg-white/80 rounded-lg border border-amber-200">
                      <button
                        onClick={() => {
                          setFpbStepMethod('prima');
                          sfx.playPop();
                        }}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                          fpbStepMethod === 'prima'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Faktorisasi Prima (Pangkat Terkecil)
                      </button>
                      <button
                        onClick={() => {
                          setFpbStepMethod('daftar');
                          sfx.playPop();
                        }}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                          fpbStepMethod === 'daftar'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Mendaftar Faktor Pembagi
                      </button>
                    </div>
                  </div>

                  {fpbStepMethod === 'prima' ? (
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block mb-1.5">
                          1. Bentuk Faktorisasi Prima (Pohon Faktor):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {fpbData.primeBreakdowns.map((pb) => (
                            <div
                              key={pb.number}
                              className="p-2.5 bg-white rounded-xl border border-amber-100 font-mono flex items-center justify-between"
                            >
                              <span className="font-bold text-slate-900">{pb.number}</span>
                              <span className="text-amber-700 font-bold">
                                ={' '}
                                {pb.factors
                                  .map((f) =>
                                    f.exponent > 1
                                      ? `${f.prime}${toSuperscript(f.exponent)}`
                                      : `${f.prime}`
                                  )
                                  .join(' × ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-800 block mb-1">
                          2. Ambil Hanya Faktor Prima yang SAMA di Kedua Bilangan (Pangkat Terkecil):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {fpbData.sharedPrimes.map((p) => {
                            const exp = fpbData.minPowerMap[p].exponent;
                            return (
                              <span
                                key={p}
                                className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg font-mono font-bold border border-amber-200"
                              >
                                {p}
                                {toSuperscript(exp)} (Pangkat terkecil)
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="p-3 bg-amber-500 text-white rounded-xl shadow-xs">
                        <span className="text-[11px] text-amber-100 block mb-0.5">
                          3. Kalikan Faktor Prima Sekutu Terpilih:
                        </span>
                        <div className="font-mono text-base font-extrabold tracking-wide">
                          FPB({itemACount}, {itemBCount}) = {fpbData.multiplicationSteps} kantong
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-amber-200 text-slate-700">
                        <span className="font-bold text-amber-950 block mb-1">
                          Pembagian Isi Tiap Kantong:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 font-mono">
                          <li>Pensil: {itemACount} ÷ {fpbSolution} = <strong>{itemACount / fpbSolution} pensil</strong></li>
                          <li>Buku: {itemBCount} ÷ {fpbSolution} = <strong>{itemBCount / fpbSolution} buku</strong></li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs">
                      <span className="font-bold text-slate-800 block">
                        Daftar Pasangan Faktor Pembagi:
                      </span>
                      <div className="space-y-2">
                        {fpbData.factorsList.map((item) => (
                          <div key={item.number} className="p-2.5 bg-white rounded-xl border border-amber-100 font-mono">
                            <span className="font-bold text-amber-800 block mb-1">
                              Faktor dari {item.number}:
                            </span>
                            <span className="text-slate-700 break-words">
                              {item.factors.map((f) => (
                                <span
                                  key={f}
                                  className={`mr-1.5 px-1.5 py-0.5 rounded ${
                                    f === fpbSolution ? 'bg-emerald-300 text-slate-900 font-bold' : ''
                                  }`}
                                >
                                  {f}
                                </span>
                              ))}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                        <p className="font-medium">
                          Faktor persekutuan yang ditemukan adalah{' '}
                          <span className="font-mono font-bold">{'{'} {fpbData.commonFactors.join(', ')} {'}'}</span>.
                          Nilai pembagi sekutu yang paling besar adalah{' '}
                          <strong className="font-mono font-bold text-emerald-800 text-sm">{fpbSolution} kantong</strong>.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Clue Detective Guide: KPK vs FPB in Story Problems */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
          🕵️ Tabel Detektif: Cara Membedakan Kapan Memakai KPK vs FPB
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Gunakan kata-kata kunci rahasia ini untuk langsung mengenali jenis soal cerita matematika!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* KPK Column */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                K
              </span>
              <span>Kapan Menggunakan KPK?</span>
            </div>
            <p className="text-xs text-slate-700">
              Gunakan KPK saat soal berkaitan dengan <strong>waktu, pengulangan, atau pertemuan kembali secara serentak</strong>.
            </p>
            <div className="pt-2 border-t border-blue-100">
              <span className="text-[11px] font-bold text-blue-800 block mb-1">
                Kata Kunci Khas Soal KPK:
              </span>
              <div className="flex flex-wrap gap-1">
                {[
                  'Bersama-sama lagi',
                  'Bersamaan',
                  'Setiap ... sekali',
                  'Lampu berkedip bersama',
                  'Berpapasan kembali',
                  'Jadwal berulang',
                ].map((kw) => (
                  <span
                    key={kw}
                    className="text-[11px] px-2 py-0.5 bg-white text-blue-800 border border-blue-200 rounded font-medium"
                  >
                    "{kw}"
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* FPB Column */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">
                F
              </span>
              <span>Kapan Menggunakan FPB?</span>
            </div>
            <p className="text-xs text-slate-700">
              Gunakan FPB saat soal berkaitan dengan <strong>pembagian barang, kelompok, atau wadah terbanyak yang sama rata</strong>.
            </p>
            <div className="pt-2 border-t border-amber-100">
              <span className="text-[11px] font-bold text-amber-800 block mb-1">
                Kata Kunci Khas Soal FPB:
              </span>
              <div className="flex flex-wrap gap-1">
                {[
                  'Paling banyak / terbanyak',
                  'Sama rata / sama banyak',
                  'Jumlah kantong maksimal',
                  'Dibagi tanpa sisa',
                  'Bungkusan sejenis',
                  'Ukuran potongan terbesar',
                ].map((kw) => (
                  <span
                    key={kw}
                    className="text-[11px] px-2 py-0.5 bg-white text-amber-800 border border-amber-200 rounded font-medium"
                  >
                    "{kw}"
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


