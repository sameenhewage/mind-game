/**
 * Young Thinker (9-12).
 *
 * Reasoning rather than recall: arithmetic used inside decisions, rule-based
 * patterns, spatial rotation, deduction and multi-step problems. One retry is
 * still allowed on reasoning tasks, because a second look is part of thinking.
 */

import type { Difficulty } from '../game/brain';
import type { PuzzleCard } from '../game/puzzle';
import { shuffle } from '../game/util';
import { choicePuzzle } from '../puzzles/choice';
import { memoryPuzzle } from '../puzzles/memory';
import { sequencePuzzle } from '../puzzles/sequence';
import { sortPuzzle, type SortPiece } from '../puzzles/sort';
import type { ShapeKind, Visual } from '../ui/visual';

/* ------------------------------------------------------- classify by result */

/** Work out each expression, then classify the answer. Two steps, one board. */
export function resultSortCard(difficulty: Difficulty): PuzzleCard {
  const threshold = 20 + difficulty * 5;
  const byParity = difficulty >= 4;

  const sums = [
    { text: `6 x ${2 + difficulty}`, value: 6 * (2 + difficulty) },
    { text: `${40 + difficulty} - 17`, value: 40 + difficulty - 17 },
    { text: `${9 * difficulty} + 8`, value: 9 * difficulty + 8 },
    { text: `${60 + difficulty * 2} / 4`, value: (60 + difficulty * 2) / 4 },
    { text: `3 x ${4 + difficulty}`, value: 3 * (4 + difficulty) },
    { text: `${100 - difficulty * 3} / 5`, value: (100 - difficulty * 3) / 5 },
  ];

  const pieces: SortPiece[] = sums.map((sum, index) => ({
    id: `s${index}`,
    bucketId: byParity
      ? sum.value % 2 === 0
        ? 'even'
        : 'odd'
      : sum.value >= threshold
        ? 'over'
        : 'under',
    label: sum.text,
    visual: { type: 'text', text: sum.text },
  }));

  const buckets = byParity
    ? [
        { id: 'even', label: 'Even answer' },
        { id: 'odd', label: 'Odd answer' },
      ]
    : [
        { id: 'under', label: `Under ${threshold}` },
        { id: 'over', label: `${threshold} or more` },
      ];

  return {
    id: `yt-result-${difficulty}`,
    title: 'Work it out, then sort',
    difficulty,
    domain: 'maths',
    skills: { logic: 0.4, problemSolving: 0.3, knowledge: 0.3 },
    parMs: pieces.length * 12_000,
    mount: sortPuzzle({
      instruction: byParity
        ? 'Work out each one. Is the answer even or odd?'
        : `Work out each one. Is the answer under ${threshold} or not?`,
      pieces: shuffle(pieces),
      buckets,
      showBucketLabels: true,
    }),
  };
}

/* ----------------------------------------------------------- rule patterns */

const RULES: Record<Difficulty, { seq: number[]; next: number; rule: string }> = {
  1: { seq: [2, 4, 8, 16], next: 32, rule: 'each number doubles' },
  2: { seq: [1, 4, 9, 16], next: 25, rule: 'they are square numbers: 1x1, 2x2, 3x3, 4x4' },
  3: { seq: [3, 6, 12, 24], next: 48, rule: 'each number doubles' },
  4: { seq: [1, 1, 2, 3, 5], next: 8, rule: 'each number is the two before it added together' },
  5: { seq: [2, 6, 12, 20, 30], next: 42, rule: 'the gaps grow by two each time: 4, 6, 8, 10, 12' },
};

export function rulePatternCard(difficulty: Difficulty): PuzzleCard {
  const rule = RULES[difficulty];
  const options = shuffle([
    { id: 'right', label: String(rule.next), visual: { type: 'text' as const, text: String(rule.next), strong: true } },
    { id: 'plus', label: String(rule.next + 2), visual: { type: 'text' as const, text: String(rule.next + 2), strong: true } },
    { id: 'minus', label: String(rule.next - 3), visual: { type: 'text' as const, text: String(rule.next - 3), strong: true } },
    { id: 'double', label: String(rule.next * 2), visual: { type: 'text' as const, text: String(rule.next * 2), strong: true } },
  ]);

  return {
    id: `yt-rule-${difficulty}`,
    title: 'Find the rule',
    difficulty,
    domain: 'maths',
    skills: { patternRecognition: 0.5, logic: 0.35, problemSolving: 0.15 },
    parMs: 40_000,
    mount: choicePuzzle({
      instruction: 'Find the rule, then pick what comes next.',
      stem: rule.seq.map((value) => ({ type: 'text' as const, text: String(value) })),
      options,
      correctId: 'right',
      allowRetry: true,
      showLabels: false,
      explain: `The rule: ${rule.rule}.`,
    }),
  };
}

/* --------------------------------------------------------- spatial rotation */

export function rotationCard(difficulty: Difficulty): PuzzleCard {
  const kinds: ShapeKind[] = ['triangle', 'heart', 'star'];
  const kind = kinds[difficulty % kinds.length] as ShapeKind;
  const other: ShapeKind = kind === 'star' ? 'heart' : 'star';
  const turn = [90, 180, 270][difficulty % 3] as number;
  const turned = (shape: ShapeKind, rotate: number): Visual => ({
    type: 'shape',
    kind: shape,
    colour: 'blue',
    rotate,
  });

  const options = shuffle([
    { id: 'right', label: `Turned ${turn} degrees`, visual: turned(kind, turn) },
    { id: 'other', label: 'A different turn', visual: turned(kind, turn + 45) },
    { id: 'flip', label: 'Another shape', visual: turned(other, turn) },
  ]);

  return {
    id: `yt-rotate-${difficulty}`,
    title: 'Turn the shape',
    difficulty,
    domain: 'core',
    skills: { patternRecognition: 0.4, problemSolving: 0.35, attention: 0.25 },
    parMs: 30_000,
    mount: choicePuzzle({
      instruction: `Which one is this shape turned ${turn} degrees?`,
      stem: [{ type: 'shape', kind, colour: 'blue' }],
      options,
      correctId: 'right',
      allowRetry: true,
      showLabels: false,
    }),
  };
}

/* ---------------------------------------------------------------- deduction */

const DEDUCTIONS = [
  {
    text: 'Ana, Ben and Cara each picked one fruit. Ana did not pick the apple. Ben picked the pear. Which fruit did Ana pick?',
    options: [
      { id: 'right', label: 'The plum' },
      { id: 'apple', label: 'The apple' },
      { id: 'pear', label: 'The pear' },
    ],
    explain: 'Ben took the pear and Ana refused the apple, so only the plum is left for Ana.',
  },
  {
    text: 'Three boxes hold a rope, a lamp and a map. The heaviest box is not the map. The rope box is lighter than the lamp box. Which box is heaviest?',
    options: [
      { id: 'right', label: 'The lamp box' },
      { id: 'rope', label: 'The rope box' },
      { id: 'map', label: 'The map box' },
    ],
    explain: 'The map is ruled out, and the rope is lighter than the lamp, so the lamp box is heaviest.',
  },
  {
    text: 'A train leaves before the bus. The bus leaves before the ferry. The ferry leaves at noon. Which one leaves first?',
    options: [
      { id: 'right', label: 'The train' },
      { id: 'bus', label: 'The bus' },
      { id: 'ferry', label: 'The ferry' },
    ],
    explain: 'Train before bus, bus before ferry, so the train is first.',
  },
];

export function deductionCard(difficulty: Difficulty): PuzzleCard {
  const item = DEDUCTIONS[Math.floor(Math.random() * DEDUCTIONS.length)];
  if (!item) throw new Error('deduction pool empty');

  return {
    id: `yt-deduce-${difficulty}`,
    title: 'Work out who',
    difficulty,
    domain: 'problem-solving',
    skills: { logic: 0.5, problemSolving: 0.3, memory: 0.2 },
    parMs: 45_000,
    mount: choicePuzzle({
      instruction: 'Read the clues, then answer.',
      text: item.text,
      options: shuffle(item.options),
      correctId: 'right',
      allowRetry: difficulty <= 2,
      explain: item.explain,
    }),
  };
}

/* ------------------------------------------------------- position in a list */

const POSITION_POOL = [
  { id: 'anchor', label: 'Anchor', char: '⚓' },
  { id: 'crown', label: 'Crown', char: '👑' },
  { id: 'gem', label: 'Gem', char: '💎' },
  { id: 'lock', label: 'Lock', char: '🔒' },
  { id: 'torch', label: 'Torch', char: '🔦' },
  { id: 'scroll', label: 'Scroll', char: '📜' },
];

export function positionMemoryCard(difficulty: Difficulty): PuzzleCard {
  const howMany = Math.min(POSITION_POOL.length, 3 + difficulty);
  const picked = shuffle(POSITION_POOL).slice(0, howMany);
  const target = 1 + Math.floor(Math.random() * howMany);
  const answer = picked[target - 1];
  if (!answer) throw new Error('position memory failed');

  const ordinal = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'][target - 1];

  return {
    id: `yt-position-${difficulty}`,
    title: 'Hold the order',
    difficulty,
    domain: 'core',
    skills: { memory: 0.7, attention: 0.2, planning: 0.1 },
    parMs: 28_000,
    mount: memoryPuzzle({
      studyInstruction: 'Remember the order these appear in.',
      question: `Which one was ${ordinal}?`,
      items: picked.map((item) => ({
        id: item.id,
        label: item.label,
        visual: { type: 'icon', char: item.char },
      })),
      showMs: Math.max(2400, 4600 - difficulty * 400),
      correctId: answer.id,
      allowRetry: false,
    }),
  };
}

/* ------------------------------------------------------------- life cycles */

const CYCLES = [
  {
    id: 'butterfly',
    instruction: 'Put the butterfly life cycle in order.',
    steps: [
      { id: 'egg', label: 'Egg', char: '🥚' },
      { id: 'caterpillar', label: 'Caterpillar', char: '🐛' },
      { id: 'cocoon', label: 'Cocoon', char: '🧶' },
      { id: 'butterfly', label: 'Butterfly', char: '🦋' },
    ],
    explain: 'Egg, caterpillar, cocoon, butterfly. This change of body shape is called metamorphosis.',
  },
  {
    id: 'water',
    instruction: 'Put the water cycle in order, starting at the sea.',
    steps: [
      { id: 'sea', label: 'Sea water', char: '🌊' },
      { id: 'sun', label: 'The sun heats it', char: '☀️' },
      { id: 'cloud', label: 'Cloud forms', char: '☁️' },
      { id: 'rain', label: 'Rain falls', char: '🌧️' },
      { id: 'river', label: 'River runs back', char: '🏞️' },
    ],
    explain: 'Water evaporates, becomes cloud, falls as rain, and flows back to the sea.',
  },
];

export function lifeCycleCard(difficulty: Difficulty): PuzzleCard {
  const cycle = CYCLES[Math.floor(Math.random() * CYCLES.length)];
  if (!cycle) throw new Error('cycle pool empty');
  const steps = difficulty <= 2 ? cycle.steps.slice(0, 4) : cycle.steps;

  return {
    id: `yt-cycle-${difficulty}`,
    title: 'Life cycle order',
    difficulty,
    domain: 'nature',
    skills: { knowledge: 0.4, planning: 0.3, logic: 0.3 },
    parMs: steps.length * 11_000,
    mount: sequencePuzzle({
      instruction: cycle.instruction,
      items: shuffle(steps).map((step) => ({
        id: step.id,
        label: step.label,
        visual: { type: 'icon', char: step.char },
      })),
      solution: steps.map((step) => step.id),
      fromLabel: 'first',
      toLabel: 'last',
      showLabels: true,
      explain: cycle.explain,
    }),
  };
}

export const YOUNG_THINKER_BUILDERS = [
  resultSortCard,
  rulePatternCard,
  rotationCard,
  deductionCard,
  positionMemoryCard,
  lifeCycleCard,
];
