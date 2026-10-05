import React, { useState } from 'react';
import { Sparkles, Layers, ShieldCheck, Calculator, HelpCircle, Scissors, ArrowRight } from 'lucide-react';
import { calculateFPB, toSuperscript } from '../utils/mathUtils';
import { sfx } from '../utils/audio';

export const ModuleFPB: React.FC = () => {
  const [numCount, setNumCount] = useState<2 | 3>(2);
  const [val1, setVal1] = useState<number>(18);
  const [val2, setVal2] = useState<number>(24);
  const [val3, setVal3] = useState<number>(36);
  const [method, setMethod] = useState<'prima' | 'daftar'>('prima');

  // Interactive Guess Tester
  const [testGuess, setTestGuess] = useState<string>('');
  const [testResult, setTestResult] = useState<string | null>(null);

  const numbers = numCount === 2 ? [val1, val2] : [val1, val2, val3];
  const result = calculateFPB(numbers);

  const presets = [
    { label: '18 & 24', nums: [18, 24] },
    { label: '20 & 30', nums: [20, 30] },
    { label: '24 & 36', nums: [24, 36] },
    { label: '12, 18, & 24', nums: [12, 18, 24] },
    { label: '20, 30, & 40', nums: [20, 30, 40] },
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
    if (g === result.fpb) {
      sfx.playFanfare();
      setTestResult('🎉 Hebat! Jawaban FPB kamu tepat sekali!');
    } else {
      sfx.playWrong();
      setTestResult(`Belum tepat. FPB dari ${numbers.join(' dan ')} adalah ${result.fpb}.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
            Tujuan Pembelajaran 4
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-display">
            FPB (Faktor Persekutuan Terbesar)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mencari angka pembagi bersama paling besar untuk membagi rata tanpa sisa
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
            Metode Faktorisasi Prima (Pangkat Terkecil)
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
            Metode Mendaftar Faktor
          </button>
        </div>
      </div>

      {/* Control Selector Bar */}
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
                  numCount === 2 ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
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
                  numCount === 3 ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                3 Bilangan
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Contoh Populer:</span>
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

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-amber-900">
              <span>Bilangan 1:</span>
              <span className="font-mono text-base">{val1}</span>
            </div>
            <input
              type="range"
              min="4"
              max="60"
              value={val1}
              onChange={(e) => {
                setVal1(parseInt(e.target.value));
                sfx.playPop();
              }}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-orange-900">
              <span>Bilangan 2:</span>
              <span className="font-mono text-base">{val2}</span>
            </div>
            <input
              type="range"
              min="4"
              max="60"
              value={val2}
              onChange={(e) => {
                setVal2(parseInt(e.target.value));
                sfx.playPop();
              }}
              className="w-full accent-orange-600 cursor-pointer"
            />
          </div>

          {numCount === 3 && (
            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-rose-900">
                <span>Bilangan 3:</span>
                <span className="font-mono text-base">{val3}</span>
              </div>
              <input
                type="range"
                min="4"
                max="60"
                value={val3}
                onChange={(e) => {
                  setVal3(parseInt(e.target.value));
                  sfx.playPop();
                }}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Solution Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {method === 'prima' ? (
            /* ================= METODE FAKTORISASI PRIMA (FPB) ================= */
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Metode 1: Faktorisasi Prima (Pohon Faktor)
                </h3>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  Hanya faktor prima yang SAMA, pangkat TERKECIL!
                </span>
              </div>

              {/* Step 1 */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Langkah 1: Tulis Bentuk Faktorisasi Prima Tiap Bilangan
                </span>
                <div className="space-y-2">
                  {result.primeBreakdowns.map((pb) => (
                    <div
                      key={pb.number}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 font-mono text-sm">
                        <span className="font-bold text-slate-900">{pb.number}</span>
                        <span className="text-slate-400">=</span>
                        <span className="font-bold text-amber-800">
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

              {/* Step 2 */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Langkah 2: Ambil Faktor Prima yang Ada di SEMUA Bilangan (Pangkat Terkecil)
                </span>
                {result.sharedPrimes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.sharedPrimes.map((p) => {
                      const exp = result.minPowerMap[p].exponent;
                      return (
                        <div
                          key={p}
                          className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs"
                        >
                          <div className="flex items-center justify-between font-bold text-emerald-950 mb-1">
                            <span>Faktor Prima Sekutu: {p}</span>
                            <span className="text-emerald-800 font-mono text-sm">
                              {p}
                              {toSuperscript(exp)}
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-800">
                            Faktor prima {p} ada pada semua bilangan. Pangkat terkecilnya adalah <strong>{exp}</strong>.
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-100 text-xs text-slate-600">
                    Tidak ada faktor prima yang sama selain angka 1. FPB = 1 (Bilangan relatif prima).
                  </div>
                )}
              </div>

              {/* Step 3 */}
              <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-sm">
                <span className="text-xs font-semibold text-amber-100 block mb-1">
                  Langkah 3: Kalikan Faktor Prima Persekutuan Pangkat Terkecil
                </span>
                <div className="text-2xl font-extrabold font-mono tracking-wide">
                  FPB = {result.multiplicationSteps}
                </div>
              </div>
            </div>
          ) : (
            /* ================= METODE MENDAFTAR FAKTOR ================= */
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-500" />
                  Metode 2: Mendaftar Faktor Pembagi
                </h3>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Cari faktor yang sama, pilih yang paling besar!
                </span>
              </div>

              <div className="space-y-3">
                {result.factorsList.map((item) => (
                  <div key={item.number} className="space-y-1">
                    <span className="text-xs font-bold text-slate-800">
                      Faktor dari {item.number}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.factors.map((f) => {
                        const isFPB = f === result.fpb;
                        const isCommon = result.commonFactors.includes(f);
                        return (
                          <span
                            key={f}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                              isFPB
                                ? 'bg-emerald-500 text-white font-bold ring-2 ring-emerald-300 shadow-xs scale-105'
                                : isCommon
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-50 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {f} {isFPB && '★ (Terbesar)'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-xs font-bold text-amber-950 block mb-1">
                  Hasil Irisan Faktor:
                </span>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Faktor persekutuan (faktor yang sama) adalah:{' '}
                  <span className="font-mono font-bold">{'{'} {result.commonFactors.join(', ')} {'}'}</span>. Faktor yang nilainya paling besar adalah{' '}
                  <strong className="text-sm font-bold text-amber-950 underline">{result.fpb}</strong>. Jadi FPB = {result.fpb}.
                </p>
              </div>
            </div>
          )}

          {/* Practical Application: Simplifying Fractions */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Scissors className="w-5 h-5 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900 font-display">
                Penerapan Hebat FPB: Menyederhanakan Pecahan Biasa
              </h4>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Tahukah kamu? Untuk menyederhanakan pecahan sampai ke bentuk paling sederhana dalam <strong>satu kali bagi</strong>, bagi pembilang dan penyebut dengan FPB-nya!
            </p>

            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-around font-mono text-center">
              <div>
                <span className="text-xs text-slate-500 block mb-1">Pecahan Asli</span>
                <div className="inline-flex flex-col text-base font-bold text-indigo-950">
                  <span>{val1}</span>
                  <div className="h-0.5 bg-slate-400 w-full my-0.5" />
                  <span>{val2}</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-sans">
                dibagi FPB ({result.fpb}) ➔
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-1">Pecahan Sederhana</span>
                <div className="inline-flex flex-col text-lg font-extrabold text-emerald-700">
                  <span>{val1 / result.fpb}</span>
                  <div className="h-0.5 bg-emerald-600 w-full my-0.5" />
                  <span>{val2 / result.fpb}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: FPB Big Display & Challenge */}
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl p-6 shadow-md text-center space-y-2">
            <span className="text-xs font-bold text-amber-200 tracking-wider">
              HASIL FPB AKHIR
            </span>
            <div className="text-5xl font-extrabold font-mono tracking-tight my-2">
              {result.fpb}
            </div>
            <p className="text-xs text-amber-100">
              FPB dari bilangan ({numbers.join(', ')})
            </p>
          </div>

          {/* Test Challenge */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 font-display flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-amber-600" />
              Uji Tebak Sendiri FPB ({numbers.join(', ')})
            </h4>
            <p className="text-[11px] text-slate-500">
              Uji ketelitianmu mencari faktor pembagi terbesar:
            </p>
            <form onSubmit={handleTestSubmit} className="space-y-2">
              <input
                type="number"
                placeholder="Tebakan FPB kamu..."
                value={testGuess}
                onChange={(e) => setTestGuess(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-amber-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Periksa Jawabanku
              </button>
            </form>
            {testResult && (
              <div
                className={`p-2.5 rounded-lg text-xs font-medium ${
                  testResult.includes('Hebat')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {testResult}
              </div>
            )}
          </div>

          {/* Golden Rule Comparison Reminder */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 space-y-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Ingat Perbedaan Emas:
            </span>
            <ul className="text-[11px] space-y-1 text-slate-600 list-disc list-inside">
              <li>
                <strong>KPK</strong>: Ambil <i>semua</i> faktor prima, cari pangkat <i>terbesar</i>.
              </li>
              <li>
                <strong>FPB</strong>: Ambil faktor prima yang <i>sama</i> saja, cari pangkat <i>terkecil</i>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
