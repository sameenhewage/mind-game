/**
 * Mind Vault (18+).
 *
 * The full set: abstract analogy, rule mutation under load, deduction from
 * constraints, working memory, and planning. Nothing here rewards fast reflexes;
 * everything rewards holding several things in mind at once.
 */

import type { Difficulty } from '../game/brain';
import type { PuzzleCard } from '../game/puzzle';
import { shuffle } from '../game/util';
import { choicePuzzle } from '../puzzles/choice';
import { memoryPuzzle } from '../puzzles/memory';
import { sequencePuzzle } from '../puzzles/sequence';
import { sortPuzzle, type SortPiece } from '../puzzles/sort';
import type { ShapeKind, Visual } from '../ui/visual';

/* --------------------------------------------------------- abstract analogy */

/**
 * A is to B as C is to ?. The transformation has to be extracted from the first
 * pair and applied to the second, which is reasoning with no knowledge attached.
 */
export function analogyCard(difficulty: Difficulty): PuzzleCard {
  const turn = [90, 180, 90, 270, 180][difficulty - 1] ?? 90;
  const left: ShapeKind = 'triangle';
  const right: ShapeKind = difficulty >= 3 ? 'heart' : 'star';

  const shape = (kind: ShapeKind, rotate = 0): Visual => ({
    type: 'shape',
    kind,
    colour: 'purple',
    ...(rotate ? { rotate } : {}),
  });

  const options = shuffle([
    { id: 'right', label: `${right} turned ${turn} degrees`, visual: shape(right, turn) },
    { id: 'unturned', label: `${right} not turned`, visual: shape(right) },
    { id: 'overturned', label: `${right} turned too far`, visual: shape(right, turn + 90) },
    { id: 'wrongshape', label: `${left} turned`, visual: shape(left, turn) },
  ]);

  return {
    id: `mv-analogy-${difficulty}`,
    title: 'Same change again',
    difficulty,
    domain: 'core',
    skills: { patternRecognition: 0.45, logic: 0.35, problemSolving: 0.2 },
    parMs: 45_000,
    mount: choicePuzzle({
      instruction: 'The first pair shows a change. Apply the same change to the third.',
      stem: [
        shape(left),
        { type: 'text', text: '→' },
        shape(left, turn),
        { type: 'text', text: '·' },
        shape(right),
        { type: 'text', text: '→' },
        { type: 'text', text: '?', strong: true },
      ],
      options,
      correctId: 'right',
      showLabels: false,
    }),
  };
}

/* ---------------------------------------------- rule mutation under pressure */

export function mutatingSortCard(difficulty: Difficulty): PuzzleCard {
  const values = shuffle([4, 9, 15, 16, 21, 25, 28, 33, 36, 49]).slice(0, difficulty >= 4 ? 8 : 6);
  const squares = new Set([4, 9, 16, 25, 36, 49]);

  const pieces: SortPiece[] = values.map((value) => ({
    id: `v${value}`,
    bucketId: squares.has(value) ? 'a' : 'b',
    label: String(value),
    visual: { type: 'text', text: String(value) },
  }));

  return {
    id: `mv-mutate-${difficulty}`,
    title: 'Rule mutation',
    difficulty,
    domain: 'maths',
    skills: { logic: 0.3, problemSolving: 0.35, attention: 0.35 },
    parMs: values.length * 12_000,
    mount: sortPuzzle({
      instruction: 'Vault A: square numbers. Vault B: everything else.',
      pieces,
      buckets: [
        { id: 'a', label: 'Vault A' },
        { id: 'b', label: 'Vault B' },
      ],
      showBucketLabels: true,
      ruleSwitch: {
        after: Math.floor(values.length / 2),
        instruction: 'Mutation. Vault A: multiples of three. Vault B: everything else.',
        bucketOf: (pieceId) => (Number(pieceId.slice(1)) % 3 === 0 ? 'a' : 'b'),
      },
    }),
  };
}

/* ------------------------------------------------------- constraint deduction */

const CONSTRAINTS = [
  {
    text: 'Four couriers - Rai, Sol, Tey and Vin - each took one route: north, south, east, west. Rai did not go north or south. Sol went west. Tey went south. Which route did Rai take?',
    options: [
      { id: 'right', label: 'East' },
      { id: 'a', label: 'North' },
      { id: 'b', label: 'West' },
      { id: 'c', label: 'South' },
    ],
    explain: 'Sol took west and Tey took south. Rai refuses north and south, so east is the only route left.',
  },
  {
    text: 'Three vaults open in a fixed order. The steel vault is not first. The glass vault opens immediately before the steel vault. The stone vault is not last. What is the order?',
    options: [
      { id: 'right', label: 'Stone, glass, steel' },
      { id: 'a', label: 'Glass, steel, stone' },
      { id: 'b', label: 'Steel, glass, stone' },
      { id: 'c', label: 'Glass, stone, steel' },
    ],
    explain: 'Glass must sit directly before steel. With steel not first and stone not last, only stone-glass-steel fits.',
  },
  {
    text: 'Every card with a vowel on one face has an even number on the other. You see four cards: A, K, 4, 7. Which two must you turn over to test the claim?',
    options: [
      { id: 'right', label: 'A and 7' },
      { id: 'a', label: 'A and 4' },
      { id: 'b', label: 'K and 7' },
      { id: 'c', label: 'A, 4 and 7' },
    ],
    explain: 'Turn A to check it hides an even number, and turn 7 in case it hides a vowel. Checking 4 can never break the rule.',
  },
];

export function constraintCard(difficulty: Difficulty): PuzzleCard {
  const item = CONSTRAINTS[Math.floor(Math.random() * CONSTRAINTS.length)];
  if (!item) throw new Error('constraint pool empty');

  return {
    id: `mv-constraint-${difficulty}`,
    title: 'Deduce the arrangement',
    difficulty,
    domain: 'problem-solving',
    skills: { logic: 0.5, problemSolving: 0.3, memory: 0.2 },
    parMs: 75_000,
    mount: choicePuzzle({
      instruction: 'Only one arrangement satisfies every clue.',
      text: item.text,
      options: shuffle(item.options),
      correctId: 'right',
      explain: item.explain,
    }),
  };
}

/* --------------------------------------------------------- working memory load */

const SYMBOLS = [
  { id: 'alpha', label: 'Circle', char: '◆' },
  { id: 'beta', label: 'Square', char: '■' },
  { id: 'gamma', label: 'Triangle', char: '▲' },
  { id: 'delta', label: 'Ring', char: '◉' },
  { id: 'epsilon', label: 'Cross', char: '✚' },
  { id: 'zeta', label: 'Star', char: '✦' },
];

export function symbolSpanCard(difficulty: Difficulty): PuzzleCard {
  const howMany = Math.min(SYMBOLS.length, 3 + difficulty);
  const picked = shuffle(SYMBOLS).slice(0, howMany);
  const target = 1 + Math.floor(Math.random() * howMany);
  const answer = picked[target - 1];
  if (!answer) throw new Error('symbol span failed');
  const ordinal = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'][target - 1];

  return {
    id: `mv-span-${difficulty}`,
    title: 'Symbol span',
    difficulty,
    domain: 'core',
    skills: { memory: 0.7, attention: 0.25, logic: 0.05 },
    parMs: 30_000,
    mount: memoryPuzzle({
      studyInstruction: 'Hold this sequence.',
      question: `Which symbol was ${ordinal}?`,
      items: picked.map((item) => ({
        id: item.id,
        label: item.label,
        visual: { type: 'icon', char: item.char },
      })),
      showMs: Math.max(1800, 4000 - difficulty * 450),
      correctId: answer.id,
    }),
  };
}

/* ------------------------------------------------------------ dependency plan */

const DEPENDENCIES = [
  {
    id: 'launch',
    instruction: 'Order the launch steps so no step runs before what it depends on.',
    steps: [
      { id: 'spec', label: 'Agree the spec', char: '📋' },
      { id: 'build', label: 'Build it', char: '🔧' },
      { id: 'test', label: 'Test it', char: '🧪' },
      { id: 'ship', label: 'Ship it', char: '🚀' },
      { id: 'measure', label: 'Measure the result', char: '📈' },
    ],
    explain: 'Nothing can be measured before it ships, nothing ships untested, and nothing is built before it is specified.',
  },
];

export function dependencyPlanCard(difficulty: Difficulty): PuzzleCard {
  const plan = DEPENDENCIES[0];
  if (!plan) throw new Error('dependency pool empty');
  const steps = difficulty <= 2 ? plan.steps.slice(0, 4) : plan.steps;

  return {
    id: `mv-plan-${difficulty}`,
    title: 'Order the plan',
    difficulty,
    domain: 'problem-solving',
    skills: { planning: 0.55, logic: 0.3, memory: 0.15 },
    parMs: steps.length * 12_000,
    mount: sequencePuzzle({
      instruction: plan.instruction,
      items: shuffle(steps).map((step) => ({
        id: step.id,
        label: step.label,
        visual: { type: 'icon', char: step.char },
      })),
      solution: steps.map((step) => step.id),
      fromLabel: 'first',
      toLabel: 'last',
      showLabels: true,
      attempts: 2,
      explain: plan.explain,
    }),
  };
}

export const MIND_VAULT_BUILDERS = [
  analogyCard,
  mutatingSortCard,
  constraintCard,
  symbolSpanCard,
  dependencyPlanCard,
];
