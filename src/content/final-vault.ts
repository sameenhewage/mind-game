/**
 * The Final Vault.
 *
 * Built from the keys the player collected during this run, so it is different
 * every time and cannot be solved by memorising a puzzle. It is pure skill:
 * whoever paid attention to the keys can do it, and nothing is randomly gated.
 */

import type { Difficulty } from '../game/brain';
import type { PuzzleCard } from '../game/puzzle';
import { expectedKeyOrder, finalPrompt, type RunState } from '../game/run';
import { shuffle } from '../game/util';
import { choicePuzzle } from '../puzzles/choice';
import { sequencePuzzle } from '../puzzles/sequence';

export function finalVaultCard(run: RunState, difficulty: Difficulty): PuzzleCard {
  const instruction = finalPrompt(run.shape.finalTask);
  const base = {
    id: 'final-vault',
    title: 'Final Vault',
    difficulty,
    domain: 'core' as const,
    // The final always leans on holding information across the whole run.
    skills: { memory: 0.5, attention: 0.2, logic: 0.15, planning: 0.15 },
  };

  if (run.shape.finalTask === 'first-key') {
    const first = run.keys[0];
    if (!first) throw new Error('final vault needs at least one key');

    return {
      ...base,
      parMs: 25_000,
      mount: choicePuzzle({
        instruction,
        options: shuffle(
          run.keys.map((key) => ({
            id: key.id,
            label: `Key ${key.symbol}`,
            visual: { type: 'text' as const, text: key.symbol, strong: true },
          })),
        ),
        correctId: first.id,
        allowRetry: true,
        showLabels: false,
        explain: `The first door gave you ${first.symbol}.`,
      }),
    };
  }

  const order = expectedKeyOrder(run);
  const byNumber = run.shape.finalTask !== 'discovery-order';

  return {
    ...base,
    parMs: run.keys.length * 12_000,
    mount: sequencePuzzle({
      instruction,
      items: shuffle(run.keys).map((key) => ({
        id: key.id,
        label: `Key ${key.symbol}`,
        // Numbers are withheld here: the player has to have kept them.
        visual: { type: 'text', text: key.symbol, strong: true },
      })),
      solution: order.map((key) => key.id),
      fromLabel: byNumber ? (run.shape.finalTask === 'number-ascending' ? 'smallest' : 'largest') : 'found first',
      toLabel: byNumber ? (run.shape.finalTask === 'number-ascending' ? 'largest' : 'smallest') : 'found last',
      attempts: 2,
      explain: byNumber
        ? `The keys were ${run.keys.map((key) => `${key.symbol}${key.number}`).join(', ')}.`
        : `You found them in this order: ${run.keys.map((key) => key.symbol).join(' ')}.`,
    }),
  };
}
