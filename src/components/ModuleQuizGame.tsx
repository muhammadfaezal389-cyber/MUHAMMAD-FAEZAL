import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Star,
  Play,
  ArrowRight,
  Flame,
  Volume2,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { QuizQuestion } from '../types/math';
import { sfx } from '../utils/audio';

interface ModuleQuizGameProps {
  onEarnStars: (amount: number) => void;
}

export const ModuleQuizGame: React.FC<ModuleQuizGameProps> = ({ onEarnStars }) => {
  const [activeTab, setActiveTab] = useState<'kuis' | 'game-katak'>('kuis');

  /* ================= KUIS STATE ================= */
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      sfx.playCorrect();
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
      onEarnStars(2);
      // Small celebratory confetti burst
      try {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    } else {
      sfx.playWrong();
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    sfx.playPop();
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      setIsFinished(true);
      sfx.playFanfare();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  const resetQuiz = () => {
    sfx.playPop();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setShowHint(false);
    setIsFinished(false);
  };

  /* ================= GAME KATAK STATE ================= */
  const [frogRound, setFrogRound] = useState<number>(1);
  const [frogScore, setFrogScore] = useState<number>(0);
  const [frogTargetMultiple, setFrogTargetMultiple] = useState<number>(4);
  const [leaves, setLeaves] = useState<number[]>([14, 16, 18, 22]);
  const [frogStatusMsg, setFrogStatusMsg] = useState<string>('Pilih daun yang merupakan kelipatan yang benar!');
  const [frogJumping, setFrogJumping] = useState<boolean>(false);

  // Generate leaves for Frog Game
  const generateFrogRound = (round: number) => {
    const multiples = [3, 4, 5, 6, 7, 8, 9];
    const target = multiples[Math.floor(Math.random() * multiples.length)];
    setFrogTargetMultiple(target);

    // 1 correct multiple, 3 wrong
    const correctVal = target * (Math.floor(Math.random() * 8) + 2);
    const wrongVals: number[] = [];
    while (wrongVals.length < 3) {
      const candidate = target * (Math.floor(Math.random() * 8) + 2) + (Math.random() > 0.5 ? 1 : 2);
      if (candidate % target !== 0 && !wrongVals.includes(candidate)) {
        wrongVals.push(candidate);
      }
    }

    const shuffled = [correctVal, ...wrongVals].sort(() => Math.random() - 0.5);
    setLeaves(shuffled);
    setFrogStatusMsg(`Bantu katak melompat ke kelipatan ${target}!`);
  };

  useEffect(() => {
    if (activeTab === 'game-katak') {
      generateFrogRound(1);
    }
  }, [activeTab]);

  const handleLeafClick = (val: number) => {
    if (frogJumping) return;
    setFrogJumping(true);
    sfx.playJump();

    const isCorrect = val % frogTargetMultiple === 0;
    if (isCorrect) {
      sfx.playCorrect();
      setFrogScore((prev) => prev + 1);
      onEarnStars(1);
      setFrogStatusMsg(`Hebat! ${val} adalah kelipatan ${frogTargetMultiple} (${frogTargetMultiple} × ${val / frogTargetMultiple} = ${val})!`);
      setTimeout(() => {
        setFrogJumping(false);
        setFrogRound((prev) => prev + 1);
        generateFrogRound(frogRound + 1);
      }, 1200);
    } else {
      sfx.playWrong();
      setFrogStatusMsg(`Aduh! ${val} bukan kelipatan ${frogTargetMultiple} (ada sisa ${val % frogTargetMultiple}). Coba cari lagi!`);
      setTimeout(() => {
        setFrogJumping(false);
      }, 800);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
            Arena Uji & Tantangan
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-display">
            Kuis Animasi & Game Matematika Seru
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Latih ketangkasan berpikir, kumpulkan bintang prestasi, dan asah pemahamanmu
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              setActiveTab('kuis');
              sfx.playPop();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'kuis'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏆 Kuis Juara KPK & FPB
          </button>
          <button
            onClick={() => {
              setActiveTab('game-katak');
              sfx.playPop();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'game-katak'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🐸 Mini Game: Lompat Katak
          </button>
        </div>
      </div>

      {activeTab === 'kuis' ? (
        /* ================= KUIS ANIMASI ================= */
        <div className="max-w-4xl mx-auto space-y-6">
          {!isFinished ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {/* Progress & Stats Bar */}
              <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                <span className="text-slate-500">
                  Pertanyaan <strong className="text-slate-900 text-sm font-mono">{currentIdx + 1}</strong> dari{' '}
                  <span className="font-mono">{QUIZ_QUESTIONS.length}</span>
                </span>

                <div className="flex items-center gap-3">
                  {streak >= 2 && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-800 rounded-full font-bold animate-bounce">
                      <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600" />
                      <span>{streak}x Beruntun!</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span className="font-mono tabular-nums font-bold">{score} Poin</span>
                  </div>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  className="h-full bg-amber-500 transition-all duration-300"
                />
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                {currentQ.context && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                    {currentQ.context}
                  </span>
                )}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold shadow-sm ring-2 ring-emerald-200';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500 text-white border-rose-600 font-bold shadow-sm';
                    } else {
                      btnStyle = 'bg-slate-50 text-slate-400 border-slate-100 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-4 rounded-2xl border text-left text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-white/40 flex items-center justify-center font-bold text-xs shrink-0 border border-current">
                          {['A', 'B', 'C', 'D'][idx]}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-white" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-white" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Hint Box */}
              {isAnswered && (
                <div
                  className={`p-4 rounded-2xl border text-xs leading-relaxed animate-fadeIn ${
                    selectedOption === currentQ.correctIndex
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
                    {selectedOption === currentQ.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Jawabanmu Tepat Sekali!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Penjelasan Cara Menjawab:</span>
                      </>
                    )}
                  </div>
                  <p>{currentQ.explanation}</p>
                </div>
              )}

              {/* Bottom Action Deck */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {!isAnswered ? (
                  <button
                    onClick={() => {
                      setShowHint(!showHint);
                      sfx.playPop();
                    }}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>{showHint ? 'Tutup Petunjuk' : 'Minta Petunjuk Kiki'}</span>
                  </button>
                ) : (
                  <div />
                )}

                {isAnswered && (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>{currentIdx + 1 === QUIZ_QUESTIONS.length ? 'Lihat Hasil Akhir' : 'Lanjut Soal Berikutnya'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Hint Content */}
              {showHint && !isAnswered && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <span className="text-base">💡</span>
                  <div>
                    <span className="font-bold block">Bisikan Petunjuk dari Kiki:</span>
                    <p>{currentQ.hint}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ================= SCORE REPORT CARD ================= */
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center max-w-lg mx-auto space-y-6">
              <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-400 text-amber-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
                <Award className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Rapor Hasil Petualangan
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
                  Selamat, Kamu Juara Matematika!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kamu telah menyelesaikan seluruh soal latihan KPK dan FPB Kelas 5 SD
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-around">
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">Total Skor</span>
                  <span className="text-3xl font-extrabold font-mono text-amber-600 tabular-nums">
                    {score}
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">Bintang Diperoleh</span>
                  <span className="text-3xl font-extrabold font-mono text-amber-500 tabular-nums">
                    ★ {Math.round(score / 5)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={resetQuiz}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Ulangi Kuis untuk Nilai Sempurna
                </button>
                <button
                  onClick={() => {
                    setActiveTab('game-katak');
                    sfx.playJump();
                  }}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Mainkan Game Katak</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================= GAME LOMPAT KATAK KELIPATAN ================= */
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-gradient-to-b from-teal-500 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-6">
            {/* Header game bar */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Ronde {frogRound}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display mt-1">
                  Misi Kelipatan: Angka {frogTargetMultiple}
                </h3>
              </div>

              <div className="flex items-center gap-2 bg-emerald-700/60 px-4 py-2 rounded-2xl border border-emerald-400/30">
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span className="font-mono font-bold text-sm">Skor Lompat: {frogScore}</span>
              </div>
            </div>

            {/* Pond visual with frog and leaves */}
            <div className="min-h-[260px] bg-teal-800/40 rounded-2xl border border-teal-300/30 p-6 flex flex-col items-center justify-between relative overflow-hidden">
              {/* Animated Frog Mascot */}
              <div
                className={`text-5xl transition-all duration-300 transform ${
                  frogJumping ? '-translate-y-6 scale-110' : 'translate-y-0'
                }`}
              >
                🐸
              </div>

              {/* Status Speech Bubble */}
              <div className="bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-xl shadow-sm text-center max-w-md my-3 border border-teal-200">
                {frogStatusMsg}
              </div>

              {/* Floating Lotus Leaves Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-3">
                {leaves.map((leafVal, i) => (
                  <button
                    key={`${leafVal}-${i}`}
                    disabled={frogJumping}
                    onClick={() => handleLeafClick(leafVal)}
                    className="group bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white p-4 rounded-2xl border-2 border-emerald-300 shadow-md flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden"
                  >
                    <span className="text-2xl mb-1">🪷</span>
                    <span className="text-2xl font-extrabold font-mono tracking-tight group-hover:scale-110 transition-transform">
                      {leafVal}
                    </span>
                    <span className="text-[10px] text-emerald-100 font-semibold mt-0.5">
                      Daun Teratai
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom info */}
            <div className="flex items-center justify-between text-xs text-teal-100 pt-2">
              <span>Klik daun teratai yang nilainya habis dibagi {frogTargetMultiple}!</span>
              <button
                onClick={() => generateFrogRound(frogRound)}
                className="hover:underline font-bold text-white cursor-pointer"
              >
                Acak Soal Baru ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
