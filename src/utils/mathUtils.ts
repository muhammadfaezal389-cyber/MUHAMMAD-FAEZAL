import {
  FactorPair,
  FactorTreeNode,
  FPBResult,
  KPKResult,
  PrimeFactorExponent,
} from '../types/math';

/**
 * Returns true if n is prime (> 1 and divisible only by 1 and itself)
 */
export function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

/**
 * List primes up to max
 */
export function getPrimesUpTo(max: number): number[] {
  const primes: number[] = [];
  for (let i = 2; i <= max; i++) {
    if (isPrime(i)) primes.push(i);
  }
  return primes;
}

/**
 * Get the first `count` multiples of `n`
 */
export function getMultiples(n: number, count: number = 10): number[] {
  const multiples: number[] = [];
  for (let i = 1; i <= count; i++) {
    multiples.push(n * i);
  }
  return multiples;
}

/**
 * Get all factors of n in ascending order
 */
export function getFactors(n: number): number[] {
  if (n <= 0) return [];
  const factors: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) factors.push(i);
  }
  return factors;
}

/**
 * Get pairs of factors: a * b = n
 */
export function getFactorPairs(n: number): FactorPair[] {
  const pairs: FactorPair[] = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      pairs.push({ a: i, b: n / i });
    }
  }
  return pairs;
}

/**
 * Common factors of multiple numbers
 */
export function getCommonFactors(numbers: number[]): number[] {
  if (numbers.length === 0) return [];
  const factorLists = numbers.map(getFactors);
  return factorLists[0].filter((f) =>
    factorLists.every((list) => list.includes(f))
  );
}

/**
 * Prime factorization: returns array of { prime, exponent }
 */
export function getPrimeFactorization(n: number): PrimeFactorExponent[] {
  if (n <= 1) return [];
  let temp = n;
  const result: PrimeFactorExponent[] = [];

  for (let d = 2; d * d <= temp; d++) {
    if (temp % d === 0) {
      let count = 0;
      while (temp % d === 0) {
        count++;
        temp /= d;
      }
      result.push({ prime: d, exponent: count });
    }
  }
  if (temp > 1) {
    result.push({ prime: temp, exponent: 1 });
  }

  return result;
}

/**
 * Format prime factors into readable exponential string e.g. "2³ × 3²"
 */
export function formatPrimeFactorization(factors: PrimeFactorExponent[]): string {
  if (factors.length === 0) return '1';
  return factors
    .map((f) => (f.exponent > 1 ? `${f.prime}${toSuperscript(f.exponent)}` : `${f.prime}`))
    .join(' × ');
}

export function toSuperscript(num: number): string {
  const map: { [key: string]: string } = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
  };
  return num
    .toString()
    .split('')
    .map((c) => map[c] || c)
    .join('');
}

/**
 * Builds a visual factor tree data structure
 */
let nodeIdCounter = 0;
export function buildFactorTree(n: number): FactorTreeNode {
  nodeIdCounter++;
  const id = `node-${nodeIdCounter}-${n}`;
  if (isPrime(n) || n <= 3) {
    return { id, value: n, isPrime: true };
  }

  // Find the smallest prime divisor
  let primeDivisor = 2;
  while (n % primeDivisor !== 0) {
    primeDivisor++;
  }

  const remainder = n / primeDivisor;

  return {
    id,
    value: n,
    isPrime: false,
    left: {
      id: `node-${++nodeIdCounter}-${primeDivisor}`,
      value: primeDivisor,
      isPrime: true,
    },
    right: buildFactorTree(remainder),
  };
}

/**
 * Greatest Common Divisor (GCD / FPB) of 2 numbers
 */
function gcd2(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

/**
 * Least Common Multiple (LCM / KPK) of 2 numbers
 */
function lcm2(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd2(a, b));
}

/**
 * Calculates KPK for 2 or 3 numbers with comprehensive educational steps
 */
export function calculateKPK(numbers: number[]): KPKResult {
  const validNumbers = numbers.filter((n) => n > 0);
  const kpkValue = validNumbers.reduce((acc, curr) => lcm2(acc, curr), validNumbers[0] || 1);

  // Listing method (multiples)
  // Ensure we list up to at least the KPK + a few steps
  const maxMultipleCount = Math.min(20, Math.max(8, Math.ceil(kpkValue / Math.min(...validNumbers))));
  const multiplesList = validNumbers.map((num) => ({
    number: num,
    multiples: Array.from({ length: maxMultipleCount }, (_, i) => num * (i + 1)),
  }));

  const commonMultiples = [kpkValue, kpkValue * 2, kpkValue * 3];

  // Prime factorization method
  const primeBreakdowns = validNumbers.map((num) => ({
    number: num,
    factors: getPrimeFactorization(num),
    factorTree: buildFactorTree(num),
  }));

  // Find all distinct prime factors present across numbers
  const allPrimesSet = new Set<number>();
  primeBreakdowns.forEach((pb) => {
    pb.factors.forEach((f) => allPrimesSet.add(f.prime));
  });
  const allPrimes = Array.from(allPrimesSet).sort((a, b) => a - b);

  // Maximum exponent for each prime
  const maxPowerMap: { [prime: number]: { exponent: number; sourceNumber: number } } = {};
  allPrimes.forEach((p) => {
    let maxExp = 0;
    let source = validNumbers[0];
    primeBreakdowns.forEach((pb) => {
      const match = pb.factors.find((f) => f.prime === p);
      if (match && match.exponent > maxExp) {
        maxExp = match.exponent;
        source = pb.number;
      }
    });
    maxPowerMap[p] = { exponent: maxExp, sourceNumber: source };
  });

  const stepParts: string[] = [];
  allPrimes.forEach((p) => {
    const exp = maxPowerMap[p].exponent;
    stepParts.push(exp > 1 ? `${p}${toSuperscript(exp)}` : `${p}`);
  });
  const multiplicationSteps = `${stepParts.join(' × ')} = ${kpkValue}`;

  return {
    numbers: validNumbers,
    kpk: kpkValue,
    multiplesList,
    commonMultiples,
    primeBreakdowns,
    allPrimes,
    maxPowerMap,
    multiplicationSteps,
  };
}

/**
 * Calculates FPB for 2 or 3 numbers with comprehensive educational steps
 */
export function calculateFPB(numbers: number[]): FPBResult {
  const validNumbers = numbers.filter((n) => n > 0);
  const fpbValue = validNumbers.reduce((acc, curr) => gcd2(acc, curr), validNumbers[0] || 1);

  // Listing method
  const factorsList = validNumbers.map((num) => ({
    number: num,
    factors: getFactors(num),
    factorPairs: getFactorPairs(num),
  }));

  const commonFactors = getCommonFactors(validNumbers);

  // Prime factorization method
  const primeBreakdowns = validNumbers.map((num) => ({
    number: num,
    factors: getPrimeFactorization(num),
    factorTree: buildFactorTree(num),
  }));

  // Find primes shared by ALL numbers
  const sharedPrimes: number[] = [];
  const minPowerMap: { [prime: number]: { exponent: number; sourceNumbers: number[] } } = {};

  if (primeBreakdowns.length > 0) {
    const firstNumPrimes = primeBreakdowns[0].factors.map((f) => f.prime);
    firstNumPrimes.forEach((p) => {
      const appearsInAll = primeBreakdowns.every((pb) =>
        pb.factors.some((f) => f.prime === p)
      );
      if (appearsInAll) {
        sharedPrimes.push(p);
        let minExp = Infinity;
        primeBreakdowns.forEach((pb) => {
          const match = pb.factors.find((f) => f.prime === p);
          if (match && match.exponent < minExp) {
            minExp = match.exponent;
          }
        });
        minPowerMap[p] = {
          exponent: minExp,
          sourceNumbers: validNumbers,
        };
      }
    });
  }

  const stepParts: string[] = [];
  sharedPrimes.forEach((p) => {
    const exp = minPowerMap[p].exponent;
    stepParts.push(exp > 1 ? `${p}${toSuperscript(exp)}` : `${p}`);
  });
  const multiplicationSteps =
    sharedPrimes.length > 0
      ? `${stepParts.join(' × ')} = ${fpbValue}`
      : `Tidak ada faktor prima persekutuan selain 1 = ${fpbValue}`;

  return {
    numbers: validNumbers,
    fpb: fpbValue,
    factorsList,
    commonFactors,
    primeBreakdowns,
    sharedPrimes,
    minPowerMap,
    multiplicationSteps,
  };
}
