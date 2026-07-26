/** Contract every puzzle mechanic implements. Kept deliberately small. */

import type { Difficulty, SkillWeights } from './brain';

/** `core` is pure cognitive work with no subject attached. */
export type KnowledgeDomain =
  | 'core'
  | 'maths'
  | 'nature'
  | 'problem-solving'
  | 'language'
  | 'history';

/** One playable puzzle, already built for a specific difficulty. */
export interface PuzzleCard {
  id: string;
  /** Short chamber subtitle, e.g. "Shape sort". */
  title: string;
  difficulty: Difficulty;
  domain: KnowledgeDomain;
  skills: SkillWeights;
  /** Time a competent player of this age needs. Used for pacing, never shown as a timer. */
  parMs: number;
  mount: PuzzleMount;
}

export interface AttemptResult {
  /** Did the player reach the correct end state at all? */
  solved: boolean;
  /** Wrong actions taken on the way there. */
  mistakes: number;
  hintsUsed: number;
  msElapsed: number;
}

export interface PuzzleContext {
  /** Where the puzzle draws itself. */
  area: HTMLElement;
  /** Single-line task text, owned by the chamber. */
  setInstruction: (text: string) => void;
  /** Short progress text, e.g. "2 of 6 sorted". */
  setProgress: (text: string) => void;
  reduceMotion: boolean;
  /** Called once, when the puzzle is finished. */
  onDone: (result: AttemptResult) => void;
}

/** Mounts a puzzle and returns its cleanup function. */
export type PuzzleMount = (ctx: PuzzleContext) => () => void;

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
