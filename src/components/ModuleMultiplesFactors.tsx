import React, { useState } from 'react';
import { Sparkles, Check, Info, HelpCircle, Layers, Grid, Compass, ArrowRight } from 'lucide-react';
import { getMultiples, getFactors, getFactorPairs, getCommonFactors } from '../utils/mathUtils';
import { sfx } from '../utils/audio';

export const ModuleMultiplesFactors: React.FC = () => {
  const [subTab, setSubTab] = useState<'kelipatan' | 'faktor'>('kelipatan');

  // Kelipatan State
  const [numA, setNumA] = useState<number>(3);
  const [numB, setNumB] = useState<number>(4);
  const [gridLimit, setGridLimit] = useState<number>(60);
  const [frogStep, setFrogStep] = useState<number>(1);

  // Faktor State
  const [factorTarget, setFactorTarget] = useState<number>(24);
  const [testDivisor, setTestDivisor] = useState<number>(4);
  const [compareFactorA, setCompareFactorA] = useState<number>(18);
  const [compareFactorB, setCompareFactorB] = useState<number>(24);

  // Computed for Kelipatan
  const multiplesA = getMultiples(numA, Math.floor(gridLimit / numA));
  const multiplesB = getMultiples(numB, Math.floor(gridLimit / numB));
  const commonMultiples = multiplesA.filter((m) => multiplesB.includes(m));

  // Computed for Faktor
  const factorsTarget = getFactors(factorTarget);
  const factorPairs = getFactorPairs(factorTarget);
  const isDivisorAFactor = factorTarget % testDivisor === 0;
  const remainder = factorTarget % testDivisor;
  const quotient = Math.floor(factorTarget / testDivisor);

  // Computed Common Factors
  const factorsA = getFactors(compareFactorA);
  const factorsB = getFactors(compareFactorB);
  const commonFactors = getCommonFactors([compareFactorA, compareFactorB]);

  return (
    <div className="space-y-6">
      {/* Module Title & Tab Selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            Tujuan Pembelajaran 1
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-display">
            Kelipatan & Faktor Bilangan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fondasi utama operasi perkalian berulang dan pembagian habis tanpa sisa
          </p>
        </div>

        {/* Sub-tab segmented control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              setSubTab('kelipatan');
              sfx.playPop();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'kelipatan'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Kelipatan & Persekutuan
          </button>
          <button
            onClick={() => {
              setSubTab('faktor');
              sfx.playPop();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'faktor'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Faktor & Pembagi Habis
          </button>
        </div>
      </div>

      {subTab === 'kelipatan' ? (
        /* ================= KELIPATAN SECTION ================= */
        <div className="space-y-6">
          {/* Concept Card */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-200/80">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
                💡
              </div>
              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-bold text-sm text-emerald-950 font-display">
                  Apa itu Kelipatan dan Kelipatan Persekutuan?
                </p>
                <p>
                  <strong>Kelipatan</strong> suatu bilangan adalah hasil kali bilangan tersebut dengan bilangan bulat positif ($1, 2, 3, 4, ...$). Ibaratnya seperti langkah lompatan kelinci atau katak yang panjangnya selalu sama!
                </p>
                <p>
                  <strong>Kelipatan Persekutuan</strong> adalah kelipatan yang dimiliki oleh dua atau lebih bilangan secara bersama-sama (titik di mana lompatan mereka mendarat di angka yang sama).
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Controls & Number Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                Atur Angka Kelipatan
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Bilangan Pertama (Warna Biru): <span className="font-bold text-blue-600 text-sm">{numA}</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        setNumA(n);
                        sfx.playPop();
                      }}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        numA === n
                          ? 'bg-blue-500 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Bilangan Kedua (Warna Oranye): <span className="font-bold text-orange-600 text-sm">{numB}</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        setNumB(n);
                        sfx.playPop();
                      }}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        numB === n
                          ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Batas Tabel Angka: <span className="font-mono">{gridLimit}</span>
                </label>
                <div className="flex gap-2">
                  {[40, 60, 100].map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setGridLimit(l);
                        sfx.playPop();
                      }}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                        gridLimit === l
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      1 – {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <span className="font-bold text-slate-700 block">Keterangan Warna Tabel:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-500" />
                  <span className="text-slate-600">Kelipatan {numA}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-orange-100 border-2 border-orange-500" />
                  <span className="text-slate-600">Kelipatan {numB}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-500 border-2 border-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    ★
                  </div>
                  <span className="font-bold text-emerald-800">
                    Kelipatan Persekutuan (Keduanya!)
                  </span>
                </div>
              </div>

              {/* Discovery Summary */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-900 block mb-1">
                  Kelipatan Persekutuan Ditemukan:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {commonMultiples.length > 0 ? (
                    commonMultiples.slice(0, 6).map((m, idx) => (
                      <span
                        key={m}
                        className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                          idx === 0
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {m} {idx === 0 && '(Terkecil/KPK)'}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">Tidak ada dalam batas tabel saat ini</span>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Grid Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Tabel Interaktif Bilangan (1 – {gridLimit})
                  </h3>
                  <span className="text-xs text-slate-500">Klik angka untuk menguji</span>
                </div>

                <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
                  {Array.from({ length: gridLimit }, (_, i) => i + 1).map((val) => {
                    const isMultA = val % numA === 0;
                    const isMultB = val % numB === 0;
                    const isBoth = isMultA && isMultB;

                    let bgClass = 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60';
                    if (isBoth) {
                      bgClass = 'bg-emerald-500 text-white font-bold border-2 border-emerald-600 shadow-sm scale-105';
                    } else if (isMultA) {
                      bgClass = 'bg-blue-100 text-blue-900 font-semibold border-2 border-blue-400';
                    } else if (isMultB) {
                      bgClass = 'bg-orange-100 text-orange-900 font-semibold border-2 border-orange-400';
                    }

                    return (
                      <button
                        key={val}
                        onClick={() => {
                          if (isBoth) {
                            sfx.playFanfare();
                          } else if (isMultA || isMultB) {
                            sfx.playCorrect();
                          } else {
                            sfx.playPop();
                          }
                        }}
                        className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-mono transition-all cursor-pointer relative ${bgClass}`}
                      >
                        {val}
                        {isBoth && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-300 rounded-full flex items-center justify-center text-[7px] text-slate-900">
                            ★
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Number Line Visualizer */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  Visual Garis Lompatan Bilangan:
                </span>
                <div className="overflow-x-auto pb-2">
                  <div className="min-w-[500px] flex items-center gap-1 text-[11px] font-mono">
                    <span className="w-12 text-blue-700 font-bold shrink-0">Lompat {numA}:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {multiplesA.slice(0, 10).map((m) => (
                        <span
                          key={m}
                          className={`px-2 py-0.5 rounded ${
                            multiplesB.includes(m)
                              ? 'bg-emerald-500 text-white font-bold ring-2 ring-emerald-300'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          +{numA} ➔ {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= FAKTOR SECTION ================= */
        <div className="space-y-6">
          {/* Concept Card */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200/80">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 font-bold">
                💡
              </div>
              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-bold text-sm text-amber-950 font-display">
                  Apa itu Faktor dan Faktor Persekutuan?
                </p>
                <p>
                  <strong>Faktor</strong> adalah semua bilangan yang dapat membagi habis suatu bilangan tanpa meninggalkan sisa ($sisa = 0$). Misalnya kue atau kelereng yang bisa dibagikan rata ke sejumlah anak!
                </p>
                <p>
                  <strong>Faktor Persekutuan</strong> adalah faktor pembagi yang sama yang dimiliki oleh dua atau lebih bilangan.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Block/Dot Array Explorer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Divisibility Testing Box */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <Grid className="w-4 h-4 text-amber-600" />
                Uji Pembagian & Balok Persegi
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Pilih Bilangan Target:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[12, 16, 18, 20, 24, 30, 36].map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        setFactorTarget(n);
                        sfx.playPop();
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        factorTarget === n
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Uji Pembagi (Jumlah Kolom): <span className="font-bold text-amber-700">{testDivisor}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max={Math.min(factorTarget, 12)}
                  value={testDivisor}
                  onChange={(e) => {
                    setTestDivisor(parseInt(e.target.value));
                    sfx.playPop();
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Status Box */}
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isDivisorAFactor
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="font-bold text-sm flex items-center gap-1.5 mb-1">
                  {isDivisorAFactor ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{testDivisor} adalah FAKTOR dari {factorTarget}!</span>
                    </>
                  ) : (
                    <>
                      <span>✕</span>
                      <span>{testDivisor} BUKAN faktor dari {factorTarget}</span>
                    </>
                  )}
                </div>
                <div>
                  Perhitungan: <span className="font-mono font-bold">{factorTarget} ÷ {testDivisor} = {quotient}</span>
                  {remainder > 0 ? (
                    <span className="text-rose-600 font-bold"> (Ada sisa {remainder})</span>
                  ) : (
                    <span className="text-emerald-700 font-bold"> (Sisa 0, habis dibagi rata!)</span>
                  )}
                </div>
              </div>

              {/* Factor Pairs (T-Table) */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  Tabel Pasangan Faktor (Tabel T):
                </span>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="grid grid-cols-2 text-center text-xs font-bold pb-1 border-b border-slate-300 text-slate-700">
                    <span>Faktor A</span>
                    <span>Faktor B</span>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {factorPairs.map((p) => (
                      <div
                        key={`${p.a}-${p.b}`}
                        className={`grid grid-cols-2 text-center text-xs py-1 font-mono ${
                          p.a === testDivisor || p.b === testDivisor
                            ? 'bg-amber-100 font-bold text-amber-900 rounded'
                            : 'text-slate-700'
                        }`}
                      >
                        <span>{p.a}</span>
                        <span>{p.b}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-center text-[11px] text-slate-500">
                    Semua Faktor {factorTarget}: {'{'} {factorsTarget.join(', ')} {'}'}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Dot/Block Arrangement Stage */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Simulasi Susunan Balok ({factorTarget} Balok diatur dalam {testDivisor} Kolom)
                  </h3>
                  <span className="text-xs text-slate-500">
                    {isDivisorAFactor ? 'Tersusun Persegi Rapi!' : 'Ada Balok yang Tidak Pas!'}
                  </span>
                </div>

                {/* Grid Visual */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 min-h-[220px] flex items-center justify-center">
                  <div className="flex flex-col gap-1.5 items-center">
                    {/* Render rows */}
                    {Array.from({ length: quotient }, (_, rIndex) => (
                      <div key={rIndex} className="flex gap-1.5">
                        {Array.from({ length: testDivisor }, (_, cIndex) => (
                          <div
                            key={cIndex}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs"
                          >
                            {rIndex * testDivisor + cIndex + 1}
                          </div>
                        ))}
                      </div>
                    ))}

                    {/* Render remainder row if any */}
                    {remainder > 0 && (
                      <div className="flex gap-1.5 pt-1.5 border-t border-dashed border-rose-300">
                        {Array.from({ length: remainder }, (_, remIndex) => (
                          <div
                            key={remIndex}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-400 text-white font-bold text-xs flex items-center justify-center animate-pulse"
                            title="Balok Sisa"
                          >
                            Sisa
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Common Factors Finder Tool */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  Eksplorasi Faktor Persekutuan (Irisan Pembagi):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="font-bold text-blue-900 block mb-1">
                      Faktor dari {compareFactorA}:
                    </span>
                    <span className="font-mono text-blue-800">
                      {factorsA.join(', ')}
                    </span>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                    <span className="font-bold text-purple-900 block mb-1">
                      Faktor dari {compareFactorB}:
                    </span>
                    <span className="font-mono text-purple-800">
                      {factorsB.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-emerald-950 block">
                      Faktor Persekutuan ({compareFactorA} & {compareFactorB}):
                    </span>
                    <span className="font-mono font-bold text-emerald-800">
                      {'{'} {commonFactors.join(', ')} {'}'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Yang Terbesar (FPB):</span>
                    <span className="text-base font-extrabold text-emerald-700 font-mono">
                      {Math.max(...commonFactors)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
