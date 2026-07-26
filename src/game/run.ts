/**
 * Vault Run: a short, replayable set of chambers ending in a final challenge.
 *
 * Every chamber the player clears hands over one vault key, shown plainly with a
 * warning that the vault will ask about it. The final challenge is built from
 * exactly those keys, so the run genuinely prepares the player for its ending
 * rather than bolting on an unrelated quiz.
 *
 * All of this is session state held in memory. Nothing is persisted: reloading
 * starts a fresh run, which is the accepted trade for this milestone.
 */

import type { AttemptResult, KnowledgeDomain } from './puzzle';
import type { AgeGroup } from './types';
import { shuffle } from './util';

export interface VaultKey {
  id: string;
  symbol: string;
  /** Shown when the key is awarded, hidden in the final challenge. */
  number: number;
}

/** How the final challenge interrogates the keys. */
export type FinalTask = 'first-key' | 'discovery-order' | 'number-ascending' | 'number-descending';

export interface RunShape {
  chambers: number;
  finalTask: FinalTask;
}

/**
 * Shorter runs and gentler endings for younger players; older players are asked
 * to hold the numbers rather than the order they appeared in.
 */
const SHAPES: Record<AgeGroup, RunShape> = {
  '3-5': { chambers: 3, finalTask: 'first-key' },
  '6-8': { chambers: 4, finalTask: 'discovery-order' },
  '9-12': { chambers: 5, finalTask: 'discovery-order' },
  '13-17': { chambers: 5, finalTask: 'number-ascending' },
  '18+': { chambers: 5, finalTask: 'number-descending' },
};

const SYMBOLS = ['◆', '■', '▲', '✦', '◉', '✚', '❖'];

export interface RunState {
  ageGroup: AgeGroup;
  shape: RunShape;
  /** Chambers cleared so far. */
  cleared: number;
  keys: VaultKey[];
  results: AttemptResult[];
  /** Domains already used, so a run spreads across subjects. */
  domains: KnowledgeDomain[];
  /** The order this run tries to visit subjects in, shuffled so runs differ. */
  domainOrder: KnowledgeDomain[];
  /** Ids already played in this run, so nothing repeats. */
  playedIds: string[];
  inFinal: boolean;
  finalResult: AttemptResult | null;
}

export function runShape(ageGroup: AgeGroup): RunShape {
  return SHAPES[ageGroup];
}

/** Subjects a run tries to cover. Shuffled per run so no two open the same way. */
const DOMAINS: KnowledgeDomain[] = [
  'maths',
  'problem-solving',
  'nature',
  'language',
  'history',
  'core',
];

export function createRun(ageGroup: AgeGroup): RunState {
  return {
    ageGroup,
    shape: runShape(ageGroup),
    cleared: 0,
    keys: [],
    results: [],
    domains: [],
    domainOrder: shuffle(DOMAINS),
    playedIds: [],
    inFinal: false,
    finalResult: null,
  };
}

/** A key the run has not handed out yet. */
export function mintKey(run: RunState): VaultKey {
  const usedSymbols = new Set(run.keys.map((key) => key.symbol));
  const usedNumbers = new Set(run.keys.map((key) => key.number));
  const symbol = SYMBOLS.filter((candidate) => !usedSymbols.has(candidate));
  const numbers = [2, 3, 4, 5, 6, 7, 8, 9].filter((candidate) => !usedNumbers.has(candidate));

  const pickedSymbol = symbol[Math.floor(Math.random() * symbol.length)] ?? '◆';
  const pickedNumber = numbers[Math.floor(Math.random() * numbers.length)] ?? 1;

  return { id: `key-${run.keys.length}`, symbol: pickedSymbol, number: pickedNumber };
}

/** Keys in the order the final challenge expects them. */
export function expectedKeyOrder(run: RunState): VaultKey[] {
  switch (run.shape.finalTask) {
    case 'number-ascending':
      return [...run.keys].sort((a, b) => a.number - b.number);
    case 'number-descending':
      return [...run.keys].sort((a, b) => b.number - a.number);
    default:
      return [...run.keys];
  }
}

export function finalPrompt(task: FinalTask): string {
  switch (task) {
    case 'first-key':
      return 'Which key opened the very first door?';
    case 'discovery-order':
      return 'Place the keys in the order you found them.';
    case 'number-ascending':
      return 'Place the keys by their numbers, smallest first. The numbers are hidden now.';
    case 'number-descending':
      return 'Place the keys by their numbers, largest first. The numbers are hidden now.';
  }
}

/**
 * How far the run actually got: chambers genuinely solved, plus the final if it
 * opened. Attempting a chamber is not the same as clearing it.
 */
export function runDepth(run: RunState): number {
  return run.results.filter((result) => result.solved).length + (run.finalResult?.solved ? 1 : 0);
}

export function runTotal(run: RunState): number {
  return run.shape.chambers + 1;
}
