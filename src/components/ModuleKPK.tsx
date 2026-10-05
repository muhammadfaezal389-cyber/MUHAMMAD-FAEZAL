import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Zap, Calculator, HelpCircle, Layers } from 'lucide-react';
import { calculateKPK, toSuperscript } from '../utils/mathUtils';
import { sfx } from '../utils/audio';

export const ModuleKPK: React.FC = () => {
  const [numCount, setNumCount] = useState<2 | 3>(2);
  const [val1, setVal1] = useState<number>(6);
  const [val2, setVal2] = useState<number>(8);
  const [val3, setVal3] = useState<number>(12);
  const [method, setMethod] = useState<'daftar' | 'prima'>('prima');

  // Mini quiz state inside KPK
  const [testGuess, setTestGuess] = useState<string>('');
  const [testResult, setTestResult] = useState<string | null>(null);

  const numbers = numCount === 2 ? [val1, val2] : [val1, val2, val3];
  const result = calculateKPK(numbers);

  const presets = [
    { label: '6 & 8', nums: [6, 8] },
    { label: '12 & 15', nums: [12, 15] },
    { label: '9 & 12', nums: [9, 12] },
    { label: '4, 6, & 8', nums: [4, 6, 8] },
    { label: '6, 8, & 12', nums: [6, 8, 12] },
  ];

  const applyPreset = (nums: number[]) => {
    sfx.playPop();
    if (nums.length === 2) {
      setNumCount(2);
      setVal1(nums[0]);
      setVal2(nums[1]);
    } else {
      setNumCount(3);
      setVal1(nums[0]);
      setVal2(nums[1]);
      setVal3(nums[2]);
    }
  };

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const g = parseInt(testGuess);
    if (g === result.kpk) {
      sfx.playFanfare();
      setTestResult('🎉 Tepat sekali! Jawabanmu benar 100%!');
    } else {
      sfx.playWrong();
      setTestResult(`Kurang tepat. KPK dari ${numbers.join(' dan ')} adalah ${result.kpk}. Yuk coba hitung lagi!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
            Tujuan Pembelajaran 3
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-display">
            KPK (Kelipatan Persekutuan Terkecil)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Menentukan titik temu kelipatan terkecil untuk 2 atau 3 bilangan
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              setMethod('prima');
              sfx.playPop();
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              method === 'prima'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Metode Faktorisasi Prima (Pangkat Terbesar)
          </button>
          <button
            onClick={() => {
              setMethod('daftar');
              sfx.playPop();
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              method === 'daftar'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Metode Mendaftar Kelipatan
          </button>
        </div>
      </div>

      {/* Input Selector Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Jumlah Bilangan:</span>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => {
                  setNumCount(2);
                  sfx.playPop();
                }}
                className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer ${
                  numCount === 2 ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                2 Bilangan
              </button>
              <button
                onClick={() => {
                  setNumCount(3);
                  sfx.playPop();
                }}
                className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer ${
                  numCount === 3 ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                3 Bilangan
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Contoh Cepat:</span>
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.nums)}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders / Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-blue-900">
              <span>Bilangan 1:</span>
              <span className="font-mono text-base">{val1}</span>
            </div>
            <input
              type="range"
              min="2"
              max="40"
              value={val1}
              onChange={(e) => {
                setVal1(parseInt(e.target.value));
                sfx.playPop();
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-indigo-900">
              <span>Bilangan 2:</span>
              <span className="font-mono text-base">{val2}</span>
            </div>
            <input
              type="range"
              min="2"
              max="40"
              value={val2}
              onChange={(e) => {
                setVal2(parseInt(e.target.value));
                sfx.playPop();
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {numCount === 3 && (
            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-purple-900">
                <span>Bilangan 3:</span>
                <span className="font-mono text-base">{val3}</span>
              </div>
              <input
                type="range"
                min="2"
                max="40"
                value={val3}
                onChange={(e) => {
                  setVal3(parseInt(e.target.value));
                  sfx.playPop();
                }}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Solution Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {method === 'prima' ? (
            /* ================= METODE FAKTORISASI PRIMA ================= */
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Metode 1: Faktorisasi Prima (Pohon Faktor)
                </h3>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Ambil SEMUA faktor prima, pangkat TERBESAR!
                </span>
              </div>

              {/* Step 1: Breakdown Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Langkah 1: Urai Tiap Bilangan ke Bentuk Pangkat
                </span>
                <div className="space-y-2">
                  {result.primeBreakdowns.map((pb, idx) => (
                    <div
                      key={pb.number}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 font-mono text-sm">
                        <span className="font-bold text-slate-900">{pb.number}</span>
                        <span className="text-slate-400">=</span>
                        <span className="font-bold text-blue-800">
                          {pb.factors.length > 0
                            ? pb.factors
                                .map((f) =>
                                  f.exponent > 1
                                    ? `${f.prime}${toSuperscript(f.exponent)}`
                                    : `${f.prime}`
                                )
                                .join(' × ')
                            : pb.number}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {pb.factors.map((f) => Array(f.exponent).fill(f.prime).join(' × ')).join(' × ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Selection Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Langkah 2: Pilih Faktor Prima dengan Pangkat Tertinggi
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {result.allPrimes.map((p) => {
                    const info = result.maxPowerMap[p];
                    return (
                      <div
                        key={p}
                        className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold text-amber-950 mb-1">
                          <span>Faktor Prima: {p}</span>
                          <span className="text-amber-800 font-mono text-sm">
                            {p}
                            {toSuperscript(info.exponent)}
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800">
                          Pangkat terbesar adalah <strong>{info.exponent}</strong> (berasal dari angka {info.sourceNumber}).
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Final Multiplication */}
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-sm">
                <span className="text-xs font-semibold text-blue-200 block mb-1">
                  Langkah 3: Kalikan Semua Faktor Prima Terpilih
                </span>
                <div className="text-2xl font-extrabold font-mono tracking-wide">
                  KPK = {result.multiplicationSteps}
                </div>
              </div>
            </div>
          ) : (
            /* ================= METODE MENDAFTAR KELIPATAN ================= */
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-500" />
                  Metode 2: Mendaftar Kelipatan
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Cari angka pertama yang sama!
                </span>
              </div>

              <div className="space-y-3">
                {result.multiplesList.map((item, idx) => (
                  <div key={item.number} className="space-y-1">
                    <span className="text-xs font-bold text-slate-800">
                      Kelipatan {item.number}:
                    </span>
                    <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
                      {item.multiples.map((m) => {
                        const isKPK = m === result.kpk;
                        const isCommon = result.commonMultiples.includes(m);
                        return (
                          <span
                            key={m}
                            className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                              isKPK
                                ? 'bg-amber-400 text-slate-950 font-bold ring-2 ring-amber-500 shadow-xs scale-105'
                                : isCommon
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-slate-50 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {m} {isKPK && '★'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-950 block mb-1">
                  Kesimpulan Penemuan:
                </span>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Kelipatan persekutuan yang ditemukan adalah{' '}
                  <span className="font-mono font-bold">{result.commonMultiples.slice(0, 3).join(', ')}...</span> Yang paling kecil (pertama kali bertemu) adalah{' '}
                  <strong className="text-sm font-bold text-emerald-950 underline">{result.kpk}</strong>. Jadi KPK = {result.kpk}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Summary Badge & Mini Challenge */}
        <div className="space-y-5">
          {/* Big Result Card */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-md text-center space-y-2">
            <span className="text-xs font-bold text-blue-200 tracking-wider">
              HASIL KPK AKHIR
            </span>
            <div className="text-5xl font-extrabold font-mono tracking-tight my-2">
              {result.kpk}
            </div>
            <p className="text-xs text-blue-100">
              KPK dari bilangan ({numbers.join(', ')})
            </p>
          </div>

          {/* Quick Interactive Guess / Challenge Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 font-display flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-600" />
              Uji Tebak Sendiri KPK ({numbers.join(', ')})
            </h4>
            <p className="text-[11px] text-slate-500">
              Coba ketikkan hasil perhitunganmu sebelum melihat kunci jawaban:
            </p>
            <form onSubmit={handleTestSubmit} className="space-y-2">
              <input
                type="number"
                placeholder="Tebakan KPK kamu..."
                value={testGuess}
                onChange={(e) => setTestGuess(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-blue-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Periksa Jawabanku
              </button>
            </form>
            {testResult && (
              <div
                className={`p-2.5 rounded-lg text-xs font-medium ${
                  testResult.includes('Tepat')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {testResult}
              </div>
            )}
          </div>

          {/* Rule Reminder */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-slate-700 space-y-1.5">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Tips Super KPK:
            </span>
            <p className="text-[11px] leading-relaxed">
              Ingat singkatan: <strong>KPK</strong> itu <i>Kelipatan</i> (nilainya biasanya <strong>lebih besar atau sama</strong> dengan bilangan terbesarnya).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
