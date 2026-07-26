/**
 * Little Explorer (3-5) content. Almost no reading, large targets, gentle
 * feedback. Built entirely from the shared puzzle engines.
 */

import type { PuzzleMount } from '../game/puzzle';
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

/** Sort shapes into the bucket showing the same shape. */
export function shapeSort(kinds: ShapeKind[], perKind = 2): PuzzleMount {
  const pieces: SortPiece[] = [];
  for (const kind of kinds) {
    for (let n = 0; n < perKind; n += 1) {
      pieces.push({
        id: `${kind}-${n}`,
        bucketId: kind,
        label: SHAPE_LABEL[kind],
        visual: { type: 'shape', kind, tone: SHAPE_TONE[kind] },
      });
    }
  }

  return sortPuzzle({
    instruction: 'Put each shape in the box that matches it.',
    pieces: shuffle(pieces),
    buckets: kinds.map((kind) => ({
      id: kind,
      label: SHAPE_LABEL[kind],
      visual: { type: 'shape', kind, tone: SHAPE_TONE[kind] },
    })),
  });
}
