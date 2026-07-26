/**
 * Which activities a player can meet.
 *
 * Age group chooses the pool; the brain engine chooses the level inside it. One
 * shared catalogue, not one application per age.
 */

import type { Difficulty } from '../game/brain';
import type { KnowledgeDomain, PuzzleCard } from '../game/puzzle';
import type { AgeGroup } from '../game/types';
import { CHALLENGER_BUILDERS } from './challenger';
import { LITTLE_EXPLORER_BUILDERS } from './little-explorer';
import { MIND_VAULT_BUILDERS } from './mind-vault';
import { YOUNG_EXPLORER_BUILDERS } from './young-explorer';
import { YOUNG_THINKER_BUILDERS } from './young-thinker';

export type CardBuilder = (difficulty: Difficulty) => PuzzleCard;

/**
 * Each pool leads with its own age's work and borrows a little from the group
 * below, so a session has range without ever handing a child adult content or an
 * adult a toddler's board.
 */
const POOLS: Record<AgeGroup, CardBuilder[]> = {
  '3-5': LITTLE_EXPLORER_BUILDERS,
  '6-8': [...YOUNG_EXPLORER_BUILDERS, ...LITTLE_EXPLORER_BUILDERS.slice(4)],
  '9-12': [...YOUNG_THINKER_BUILDERS, ...YOUNG_EXPLORER_BUILDERS.slice(2)],
  '13-17': [...CHALLENGER_BUILDERS, ...YOUNG_THINKER_BUILDERS.slice(1)],
  '18+': [...MIND_VAULT_BUILDERS, ...CHALLENGER_BUILDERS.slice(2)],
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
