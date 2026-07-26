/**
 * Match.
 *
 * Pair each item with the one thing it belongs with: animal to home, number to
 * quantity, word to picture, object to period. This is the sort engine with a
 * one-to-one mapping, so the gesture the player already learned still applies.
 */

import type { PuzzleMount } from '../game/puzzle';
import { shuffle } from '../game/util';
import { sortPuzzle } from './sort';
import type { Visual } from '../ui/visual';

export interface MatchPair {
  id: string;
  /** The item the player moves. */
  from: { label: string; visual: Visual };
  /** Its partner, which stays put. */
  to: { label: string; visual?: Visual };
}

export interface MatchSpec {
  instruction: string;
  pairs: MatchPair[];
  showLabels?: boolean;
}

export function matchPuzzle(spec: MatchSpec): PuzzleMount {
  return sortPuzzle({
    instruction: spec.instruction,
    variant: 'match',
    showPieceLabels: spec.showLabels === true,
    showBucketLabels: true,
    pieces: shuffle(
      spec.pairs.map((pair) => ({
        id: pair.id,
        bucketId: pair.id,
        label: pair.from.label,
        visual: pair.from.visual,
      })),
    ),
    buckets: shuffle(
      spec.pairs.map((pair) => ({
        id: pair.id,
        label: pair.to.label,
        ...(pair.to.visual ? { visual: pair.to.visual } : {}),
      })),
    ),
  });
}
