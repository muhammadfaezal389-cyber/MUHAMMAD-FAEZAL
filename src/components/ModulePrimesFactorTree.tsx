import React, { useState } from 'react';
import {
  Sparkles,
  TreePine,
  Filter,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  isPrime,
  getPrimeFactorization,
  formatPrimeFactorization,
  buildFactorTree,
} from '../utils/mathUtils';
import { FactorTreeNode } from '../types/math';
import { sfx } from '../utils/audio';

export const ModulePrimesFactorTree: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'saringan' | 'pohon'>('pohon');

  // Saringan Eratosthenes State
  const [eliminated, setEliminated] = useState<{ [num: number]: string }>({ 1: 'Angka 1 bukan prima' });
  const [lastFilterMsg, setLastFilterMsg] = useState<string>('Mulai menyaring bilangan komposit');

  // Pohon Faktor State
  const [selectedNumber, setSelectedNumber] = useState<number>(24);
  const [customInput, setCustomInput] = useState<string>('24');
  const [treeStep, setTreeStep] = useState<number>(10); // 10 means fully expanded

  const primeFactors = getPrimeFactorization(selectedNumber);
  const formattedFactorization = formatPrimeFactorization(primeFactors);
  const factorTree = buildFactorTree(selectedNumber);

  // Saringan actions
  const eliminateMultiplesOf = (prime: number, colorName: string) => {
    sfx.playPop();
    const updated = { ...eliminated };
    let count = 0;
    for (let i = prime * 2; i <= 100; i += prime) {
      if (!updated[i]) {
        updated[i] = `Kelipatan ${prime}`;
        count++;
      }
    }
    setEliminated(updated);
    setLastFilterMsg(`Menyaring ${count} angka kelipatan ${prime} (${colorName})`);
  };

  const resetSaringan = () => {
    sfx.playPop();
    setEliminated({ 1: 'Angka 1 bukan prima' });
    setLastFilterMsg('Tabel saringan direset kembali ke awal.');
  };

  const handleApplyNumber = (val: number) => {
    if (val >= 4 && val <= 200) {
      setSelectedNumber(val);
      setCustomInput(val.toString());
      setTreeStep(10);
      sfx.playJump();
    }
  };

  // Render Factor Tree Node Recursively
  const renderTreeNode = (node: FactorTreeNode, depth: number = 0): React.ReactNode => {
    if (!node) return null;

    if (node.isPrime) {
      return (
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-mono font-bold text-sm flex items-center justify-center shadow-md ring-4 ring-emerald-100 animate-bounce">
            {node.value}
          </div>
          <span className="text-[10px] font-bold text-emerald-700 mt-1">Prima!</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        {/* Composite Node */}
        <div className="w-11 h-11 rounded-xl bg-amber-500 text-white font-mono font-bold text-sm flex items-center justify-center shadow-sm">
          {node.value}
        </div>

        {/* Tree Branches (SVG Connectors) */}
        {node.left && node.right && (
          <div className="flex flex-col items-center w-full">
            <svg className="w-32 h-8" viewBox="0 0 120 32">
              <line x1="60" y1="0" x2="25" y2="32" stroke="#cbd5e1" strokeWidth="2.5" />
              <line x1="60" y1="0" x2="95" y2="32" stroke="#cbd5e1" strokeWidth="2.5" />
            </svg>
            <div className="flex items-start justify-between gap-6 sm:gap-10">
              <div className="flex flex-col items-center">
                {renderTreeNode(node.left, depth + 1)}
              </div>
              <div className="flex flex-col items-center">
                {renderTreeNode(node.right, depth + 1)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title & Segmented Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
            Tujuan Pembelajaran 2
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-display">
            Bilangan Prima & Pohon Faktor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Menemukan "unsur pembangun dasar" bilangan melalui pohon ranting faktorisasi
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              setActiveTab('pohon');
              sfx.playPop();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pohon'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Pohon Faktor Interaktif
          </button>
          <button
            onClick={() => {
              setActiveTab('saringan');
              sfx.playPop();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'saringan'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Saringan Eratosthenes (1-100)
          </button>
        </div>
      </div>

      {activeTab === 'pohon' ? (
        /* ================= POHON FAKTOR ================= */
        <div className="space-y-6">
          {/* Concept Banner */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-200/80">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold">
                🌱
              </div>
              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-bold text-sm text-indigo-950 font-display">
                  Bagaimana Pohon Faktor Bekerja?
                </p>
                <p>
                  Setiap bilangan komposit dapat dipecah menjadi perkalian dua bilangan yang lebih kecil. Kita membaginya terus dengan <strong>bilangan prima terkecil</strong> (2, 3, 5, 7, ...) hingga semua ujung rantingnya menghasilkan <strong>bilangan prima</strong> (lingkaran hijau)!
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Number Selector Control */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <TreePine className="w-4 h-4 text-indigo-600" />
                Pilih Bilangan untuk Dibuat Pohonnya
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Pilihan Bilangan Populer:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[12, 18, 24, 30, 36, 48, 60, 72, 84].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleApplyNumber(num)}
                      className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                        selectedNumber === num
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Atau Masukkan Bilangan Sendiri (4 – 200):
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="4"
                    max="200"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-indigo-500"
                  />
                  <button
                    onClick={() => {
                      const parsed = parseInt(customInput);
                      if (!isNaN(parsed)) handleApplyNumber(parsed);
                    }}
                    className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Terapkan
                  </button>
                </div>
              </div>

              {/* Factorization Result Card */}
              <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-3">
                <span className="text-xs font-bold text-indigo-950 block">
                  Hasil Faktorisasi Prima {selectedNumber}:
                </span>

                <div className="bg-white p-3 rounded-lg border border-indigo-100 text-center">
                  <div className="text-[11px] text-slate-500 mb-1">Perkalian Faktor Prima:</div>
                  <div className="font-mono text-base font-bold text-indigo-900 tracking-wide">
                    {primeFactors.map((f) => Array(f.exponent).fill(f.prime).join(' × ')).join(' × ')}
                  </div>
                </div>

                <div className="bg-emerald-500 text-white p-3 rounded-lg shadow-xs text-center">
                  <div className="text-[11px] text-emerald-100 mb-0.5">Bentuk Pangkat (Eksponen):</div>
                  <div className="font-mono text-xl font-extrabold tracking-wider">
                    {selectedNumber} = {formattedFactorization}
                  </div>
                </div>
              </div>

              {/* Information Tip */}
              <div className="text-xs text-slate-500 flex items-start gap-2 pt-1">
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Lingkaran hijau di ujung ranting adalah <strong>faktor prima</strong>. Angka inilah yang dikumpulkan untuk faktorisasi prima!
                </span>
              </div>
            </div>

            {/* Tree Canvas */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between overflow-x-auto">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Pohon Faktor dari Bilangan {selectedNumber}
                  </h3>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="w-3 h-3 rounded bg-amber-500 inline-block" /> Komposit
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Prima (Ujung)
                    </span>
                  </div>
                </div>

                {/* Tree Diagram Rendering */}
                <div className="min-h-[300px] flex items-center justify-center p-6 bg-slate-50/60 rounded-xl border border-slate-200/80">
                  <div className="scale-95 sm:scale-100 transition-all">
                    {renderTreeNode(factorTree)}
                  </div>
                </div>
              </div>

              {/* Bottom Step Guide */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                <span>
                  Langkah pembagian:{' '}
                  <strong className="text-slate-900">
                    Bagi berulang dengan bilangan prima terkecil (2, 3, 5, 7...) sampai bersisa 1.
                  </strong>
                </span>
                <button
                  onClick={() => sfx.playFanfare()}
                  className="px-3 py-1 bg-amber-100 text-amber-900 hover:bg-amber-200 rounded-lg font-bold text-xs cursor-pointer"
                >
                  Bagus Sekali! ✨
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= SARINGAN ERATOSTHENES ================= */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-5 border border-teal-200/80">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold">
                🏺
              </div>
              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-bold text-sm text-teal-950 font-display">
                  Saringan Eratosthenes (Penemu Bilangan Prima Berusia 2200 Tahun)
                </p>
                <p>
                  Eratosthenes, matematikawan Yunani Kuno, menemukan cara cerdas: coret semua angka kelipatan dari bilangan prima (kelipatan 2, 3, 5, 7). Angka yang tersisa dan tidak tercoret adalah <strong>bilangan prima</strong> sejati!
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filter Control Deck */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <Filter className="w-4 h-4 text-teal-600" />
                Langkah Penyaringan
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => eliminateMultiplesOf(2, 'Merah')}
                  className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold text-left flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span>1. Saring Kelipatan 2 (Genap &gt; 2)</span>
                  <span className="font-mono text-[11px] bg-rose-200 px-1.5 py-0.5 rounded">4, 6, 8...</span>
                </button>

                <button
                  onClick={() => eliminateMultiplesOf(3, 'Biru')}
                  className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold text-left flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span>2. Saring Kelipatan 3 (&gt; 3)</span>
                  <span className="font-mono text-[11px] bg-blue-200 px-1.5 py-0.5 rounded">9, 15, 21...</span>
                </button>

                <button
                  onClick={() => eliminateMultiplesOf(5, 'Kuning')}
                  className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold text-left flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span>3. Saring Kelipatan 5 (&gt; 5)</span>
                  <span className="font-mono text-[11px] bg-amber-200 px-1.5 py-0.5 rounded">25, 35, 55...</span>
                </button>

                <button
                  onClick={() => eliminateMultiplesOf(7, 'Ungu')}
                  className="w-full py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold text-left flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span>4. Saring Kelipatan 7 (&gt; 7)</span>
                  <span className="font-mono text-[11px] bg-purple-200 px-1.5 py-0.5 rounded">49, 77, 91...</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={resetSaringan}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Tabel Saringan
                </button>
              </div>

              {/* Status Message */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                <span className="font-bold text-slate-800 block mb-1">Status Saringan:</span>
                <p>{lastFilterMsg}</p>
              </div>

              {/* Prime Numbers Summary */}
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-950 block mb-1.5">
                  25 Bilangan Prima Antara 1 – 100:
                </span>
                <p className="font-mono text-xs text-emerald-900 leading-relaxed font-semibold">
                  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
                </p>
              </div>
            </div>

            {/* 1-100 Grid Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Tabel 1 – 100 (Saringan Eratosthenes)
                </h3>
                <span className="text-xs font-bold text-emerald-700">
                  Kotak Hijau Berkilau = Bilangan Prima
                </span>
              </div>

              <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
                {Array.from({ length: 100 }, (_, i) => i + 1).map((val) => {
                  const isEliminated = Boolean(eliminated[val]);
                  const prime = isPrime(val);

                  let itemStyle = 'bg-emerald-500 text-white font-bold shadow-xs scale-105 ring-2 ring-emerald-300';
                  if (val === 1) {
                    itemStyle = 'bg-slate-100 text-slate-400 line-through';
                  } else if (isEliminated) {
                    itemStyle = 'bg-slate-100 text-slate-400 opacity-40 line-through';
                  }

                  return (
                    <div
                      key={val}
                      title={isEliminated ? eliminated[val] : prime ? 'Bilangan Prima' : ''}
                      className={`aspect-square flex items-center justify-center rounded-lg text-xs font-mono transition-all ${itemStyle}`}
                    >
                      {val}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
