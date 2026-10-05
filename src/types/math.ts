/**
 * Data structures and types for Grade 5 Math (Kelipatan, Faktor, Prima, KPK, FPB)
 */

export interface PrimeFactorExponent {
  prime: number;
  exponent: number;
}

export interface FactorTreeNode {
  id: string;
  value: number;
  isPrime: boolean;
  left?: FactorTreeNode;
  right?: FactorTreeNode;
}

export interface FactorPair {
  a: number;
  b: number;
}

export interface KPKResult {
  numbers: number[];
  kpk: number;
  multiplesList: { number: number; multiples: number[] }[];
  commonMultiples: number[];
  primeBreakdowns: {
    number: number;
    factors: PrimeFactorExponent[];
    factorTree: FactorTreeNode;
  }[];
  allPrimes: number[];
  maxPowerMap: { [prime: number]: { exponent: number; sourceNumber: number } };
  multiplicationSteps: string;
}

export interface FPBResult {
  numbers: number[];
  fpb: number;
  factorsList: { number: number; factors: number[]; factorPairs: FactorPair[] }[];
  commonFactors: number[];
  primeBreakdowns: {
    number: number;
    factors: PrimeFactorExponent[];
    factorTree: FactorTreeNode;
  }[];
  sharedPrimes: number[];
  minPowerMap: { [prime: number]: { exponent: number; sourceNumbers: number[] } };
  multiplicationSteps: string;
}

export interface QuizQuestion {
  id: string;
  category: 'kelipatan-faktor' | 'prima-pohon' | 'kpk' | 'fpb' | 'kontekstual';
  question: string;
  context?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'mudah' | 'sedang' | 'tantangan';
  hint: string;
}

export interface UserProgress {
  stars: number;
  badges: string[];
  completedModules: string[];
  quizHighScore: number;
}
