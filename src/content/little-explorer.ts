/**
 * Little Explorer (3-5) content. Almost no reading, large targets, gentle
 * feedback, generous pacing. Built entirely from the shared puzzle engines.
 */

import type { Difficulty } from '../game/brain';
import type { PuzzleCard } from '../game/puzzle';
import { shuffle } from '../game/util';
import { sortPuzzle, type SortPiece } from '../puzzles/sort';
import type { ShapeKind, Tone } from '../ui/visual';

const SHAPE_LABEL: Record<ShapeKind, string> = {
  circle: 'Circle',
  triangle: 'Triangle',
  square: 'Square',
};

const SHAPE_TONE: Record<ShapeKind, Tone> = {
  circle: 'one',
  triangle: 'two',
  square: 'three',
};

/**
 * Difficulty comes from how much there is to hold and tell apart, never from
 * heavier graphics. Level 4 removes the colour cue so the shape itself is the
 * only thing left to reason about.
 */
const SHAPE_STEPS: Record<Difficulty, { kinds: ShapeKind[]; each: number; colour: boolean }> = {
  1: { kinds: ['circle', 'square'], each: 2, colour: true },
  2: { kinds: ['circle', 'triangle', 'square'], each: 2, colour: true },
  3: { kinds: ['circle', 'triangle', 'square'], each: 3, colour: true },
  4: { kinds: ['circle', 'triangle', 'square'], each: 3, colour: false },
  5: { kinds: ['circle', 'triangle', 'square'], each: 4, colour: false },
};

export function shapeSortCard(difficulty: Difficulty): PuzzleCard {
  const step = SHAPE_STEPS[difficulty];
  const toneOf = (kind: ShapeKind): Tone => (step.colour ? SHAPE_TONE[kind] : 'plain');

  const pieces: SortPiece[] = [];
  for (const kind of step.kinds) {
    for (let n = 0; n < step.each; n += 1) {
      pieces.push({
        id: `${kind}-${n}`,
        bucketId: kind,
        label: SHAPE_LABEL[kind],
        visual: { type: 'shape', kind, tone: toneOf(kind) },
      });
    }
  }

  return {
    id: `le-shape-sort-${difficulty}`,
    title: 'Shape sort',
    difficulty,
    domain: 'core',
    skills: { patternRecognition: 0.45, attention: 0.35, knowledge: 0.2 },
    // Deliberately generous: a young player should never feel rushed.
    parMs: pieces.length * 5000,
    mount: sortPuzzle({
      instruction: step.colour
        ? 'Put each shape in the box that matches it.'
        : 'Same colour now. Look at the shape.',
      pieces: shuffle(pieces),
      buckets: step.kinds.map((kind) => ({
        id: kind,
        label: SHAPE_LABEL[kind],
        visual: { type: 'shape', kind, tone: toneOf(kind) },
      })),
    }),
  };
}
