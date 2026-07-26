/** Contract every puzzle mechanic implements. Kept deliberately small. */

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
