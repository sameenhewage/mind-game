/**
 * Which activities a player can meet.
 *
 * Age group chooses the pool; the brain engine chooses the level inside it. One
 * shared catalogue, not one application per age.
 */

import type { Difficulty } from '../game/brain';
import type { KnowledgeDomain, PuzzleCard } from '../game/puzzle';
import type { AgeGroup } from '../game/types';
import { LITTLE_EXPLORER_BUILDERS } from './little-explorer';

export type CardBuilder = (difficulty: Difficulty) => PuzzleCard;

const POOLS: Record<AgeGroup, CardBuilder[]> = {
  '3-5': LITTLE_EXPLORER_BUILDERS,
  '6-8': LITTLE_EXPLORER_BUILDERS,
  '9-12': LITTLE_EXPLORER_BUILDERS,
  '13-17': LITTLE_EXPLORER_BUILDERS,
  '18+': LITTLE_EXPLORER_BUILDERS,
};

export function buildersFor(ageGroup: AgeGroup): CardBuilder[] {
  return POOLS[ageGroup];
}

/**
 * Picks the next activity, avoiding the ones just played so a session does not
 * repeat itself. Presentation variety only; never a hidden difficulty change.
 */
export function pickCard(
  ageGroup: AgeGroup,
  difficulty: Difficulty,
  recentIds: readonly string[] = [],
  domain?: KnowledgeDomain,
): PuzzleCard {
  const builders = buildersFor(ageGroup);
  let cards = builders.map((build) => build(difficulty));

  if (domain) {
    const inDomain = cards.filter((card) => card.domain === domain);
    if (inDomain.length > 0) cards = inDomain;
  }

  const fresh = cards.filter((card) => !recentIds.includes(card.id));
  const pool = fresh.length > 0 ? fresh : cards;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  if (!chosen) throw new Error(`No puzzles available for ${ageGroup} at level ${difficulty}`);
  return chosen;
}
