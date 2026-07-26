/**
 * Rules-only tests for the scoring and difficulty logic. No DOM, no framework:
 * `npm test` runs these through Node's built-in test runner and type stripping.
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  attemptQuality,
  createBrain,
  envelopeFor,
  skillTarget,
  type AttemptMeta,
} from './brain.ts';
import type { AttemptResult } from './puzzle.ts';

const attempt = (over: Partial<AttemptResult> = {}): AttemptResult => ({
  solved: true,
  mistakes: 0,
  hintsUsed: 0,
  msElapsed: 10_000,
  ...over,
});

const meta = (over: Partial<AttemptMeta> = {}): AttemptMeta => ({
  difficulty: 2,
  skills: { logic: 0.6, patternRecognition: 0.4 },
  parMs: 20_000,
  ...over,
});

test('a clean solve inside par scores full quality', () => {
  assert.equal(attemptQuality(attempt(), 20_000), 1);
});

test('an unsolved attempt scores zero regardless of speed', () => {
  assert.equal(attemptQuality(attempt({ solved: false, msElapsed: 1 }), 20_000), 0);
});

test('mistakes and hints reduce quality, and the penalties are capped', () => {
  assert.equal(attemptQuality(attempt({ mistakes: 1 }), 20_000), 0.85);
  assert.equal(attemptQuality(attempt({ mistakes: 2 }), 20_000), 0.7);
  // 0.15 * 20 would go negative; the cap keeps it at 1 - 0.6
  assert.equal(attemptQuality(attempt({ mistakes: 20 }), 20_000), 0.4);
  assert.equal(attemptQuality(attempt({ hintsUsed: 1 }), 20_000), 0.85);
  assert.equal(attemptQuality(attempt({ hintsUsed: 9 }), 20_000), 0.7);
});

test('pace only trims the edges, so thinking slowly is not punished hard', () => {
  // twice par costs 0.1, ten times par is capped at 0.2
  assert.equal(attemptQuality(attempt({ msElapsed: 40_000 }), 20_000), 0.9);
  assert.equal(attemptQuality(attempt({ msElapsed: 200_000 }), 20_000), 0.8);
});

test('harder puzzles aim skills higher than easy ones', () => {
  assert.equal(skillTarget(1, 1), 52);
  assert.equal(skillTarget(1, 5), 100);
  assert.ok(skillTarget(1, 3) > skillTarget(1, 2));
  assert.equal(skillTarget(0, 5), 0);
});

test('difficulty rises by exactly one step after three strong attempts', () => {
  const brain = createBrain('9-12');
  assert.equal(brain.difficulty, 2);

  assert.equal(brain.record(attempt(), meta()).difficultyDelta, 0);
  assert.equal(brain.record(attempt(), meta()).difficultyDelta, 0);
  const third = brain.record(attempt(), meta());
  assert.equal(third.difficultyDelta, 1);
  assert.equal(third.difficulty, 3);

  // the window resets, so the next single strong attempt does not stack
  assert.equal(brain.record(attempt(), meta()).difficultyDelta, 0);
  assert.equal(brain.difficulty, 3);
});

test('difficulty eases by one step after two weak attempts', () => {
  const brain = createBrain('9-12');
  const weak = attempt({ solved: false });

  assert.equal(brain.record(weak, meta()).difficultyDelta, 0);
  const second = brain.record(weak, meta());
  assert.equal(second.difficultyDelta, -1);
  assert.equal(second.difficulty, 1);
});

test('mixed results hold difficulty steady', () => {
  const brain = createBrain('9-12');
  const sequence = [attempt(), attempt({ solved: false }), attempt(), attempt({ mistakes: 3 })];
  for (const item of sequence) {
    assert.equal(brain.record(item, meta()).difficultyDelta, 0);
  }
  assert.equal(brain.difficulty, 2);
});

test('difficulty never leaves the age envelope', () => {
  const little = createBrain('3-5');
  const envelope = envelopeFor('3-5');
  for (let i = 0; i < 40; i += 1) little.record(attempt(), meta({ difficulty: 1 }));
  assert.equal(little.difficulty, envelope.max);

  for (let i = 0; i < 40; i += 1) little.record(attempt({ solved: false }), meta({ difficulty: 1 }));
  assert.equal(little.difficulty, envelope.min);
});

test('an adult session starts mid-ladder and cannot drop to level 1', () => {
  const brain = createBrain('18+');
  assert.equal(brain.difficulty, 3);
  for (let i = 0; i < 20; i += 1) brain.record(attempt({ solved: false }), meta());
  assert.equal(brain.difficulty, 2);
});

test('only the weighted skills move, and values stay inside 0-100', () => {
  const brain = createBrain('13-17');
  const before = { ...brain.skills };
  const outcome = brain.record(attempt(), meta({ difficulty: 5, skills: { logic: 1 } }));

  assert.ok(brain.skills.logic > before.logic);
  assert.equal(brain.skills.memory, before.memory);
  assert.equal(outcome.deltas.memory, undefined);
  assert.ok((outcome.deltas.logic ?? 0) > 0);

  for (let i = 0; i < 100; i += 1) brain.record(attempt(), meta({ difficulty: 5, skills: { logic: 1 } }));
  assert.ok(brain.skills.logic <= 100);

  for (let i = 0; i < 100; i += 1) {
    brain.record(attempt({ solved: false }), meta({ difficulty: 1, skills: { logic: 1 } }));
  }
  assert.ok(brain.skills.logic >= 0);
});

test('a weak attempt pulls a skill down, not just up', () => {
  const brain = createBrain('18+');
  brain.record(attempt(), meta({ difficulty: 5, skills: { memory: 1 } }));
  const peak = brain.skills.memory;
  brain.record(attempt({ solved: false }), meta({ difficulty: 5, skills: { memory: 1 } }));
  assert.ok(brain.skills.memory < peak);
});

test('a fresh session starts below the level-1 ceiling so early play shows movement', () => {
  const brain = createBrain('3-5');
  const start = brain.skills.patternRecognition;
  assert.ok(start < skillTarget(1, 1), 'there must be headroom at level 1');

  const outcome = brain.record(attempt(), meta({ difficulty: 1, skills: { patternRecognition: 1 } }));
  assert.ok((outcome.deltas.patternRecognition ?? 0) >= 5, 'the first clean solve should be visible');
});

test('attempt count tracks every recorded attempt', () => {
  const brain = createBrain('6-8');
  assert.equal(brain.hasHistory, false);
  brain.record(attempt(), meta());
  assert.equal(brain.hasHistory, true);
  brain.record(attempt(), meta());
  assert.equal(brain.attempts, 2);
});
