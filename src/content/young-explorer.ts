/**
 * Young Explorer (6-8).
 *
 * First real arithmetic, sequences, categories and simple logic. Reading is
 * short and concrete. Retries stay on: at this age a second try teaches more
 * than a closed door.
 */

import type { Difficulty } from '../game/brain';
import type { PuzzleCard } from '../game/puzzle';
import { shuffle } from '../game/util';
import { choicePuzzle } from '../puzzles/choice';
import { matchPuzzle } from '../puzzles/match';
import { memoryPuzzle } from '../puzzles/memory';
import { sequencePuzzle } from '../puzzles/sequence';
import { sortPuzzle, type SortPiece } from '../puzzles/sort';

/* --------------------------------------------------------- sums into answers */

/** Sort simple sums under their answer: arithmetic used as classification. */
export function sumSortCard(difficulty: Difficulty): PuzzleCard {
  const top = 5 + difficulty * 2;
  const useSubtraction = difficulty >= 3;
  const answers = [top - 2, top - 1, top];

  const pieces: SortPiece[] = [];
  answers.forEach((answer, ai) => {
    const howMany = difficulty >= 4 ? 2 : 1;
    for (let n = 0; n < howMany; n += 1) {
      const split = 1 + ((ai + n) % Math.max(1, answer - 1));
      const text =
        useSubtraction && n % 2 === 1
          ? `${answer + split} - ${split}`
          : `${split} + ${answer - split}`;
      pieces.push({
        id: `${answer}-${n}`,
        bucketId: `a${answer}`,
        label: text,
        visual: { type: 'text', text },
      });
    }
  });

  return {
    id: `ye-sums-${difficulty}`,
    title: 'Sums and answers',
    difficulty,
    domain: 'maths',
    skills: { logic: 0.4, knowledge: 0.35, attention: 0.25 },
    parMs: pieces.length * 9000,
    mount: sortPuzzle({
      instruction: useSubtraction
        ? 'Work out each one. Some add, some take away.'
        : 'Work out each sum and put it under the answer.',
      pieces: shuffle(pieces),
      buckets: answers.map((answer) => ({
        id: `a${answer}`,
        label: String(answer),
        visual: { type: 'text', text: String(answer), strong: true },
      })),
      showBucketLabels: false,
    }),
  };
}

/* --------------------------------------------------------- number sequences */

const NUMBER_RULES: Record<Difficulty, { start: number; step: number; label: string }> = {
  1: { start: 2, step: 2, label: 'counting in twos' },
  2: { start: 5, step: 5, label: 'counting in fives' },
  3: { start: 3, step: 3, label: 'counting in threes' },
  4: { start: 20, step: -3, label: 'counting back in threes' },
  5: { start: 4, step: 7, label: 'counting in sevens' },
};

export function numberNextCard(difficulty: Difficulty): PuzzleCard {
  const rule = NUMBER_RULES[difficulty];
  const shown = [0, 1, 2, 3].map((i) => rule.start + rule.step * i);
  const answer = rule.start + rule.step * 4;
  const options = shuffle([
    { id: 'right', label: String(answer), visual: { type: 'text' as const, text: String(answer), strong: true } },
    { id: 'near', label: String(answer + rule.step), visual: { type: 'text' as const, text: String(answer + rule.step), strong: true } },
    { id: 'off', label: String(answer - 1), visual: { type: 'text' as const, text: String(answer - 1), strong: true } },
  ]);

  return {
    id: `ye-numnext-${difficulty}`,
    title: 'Next number',
    difficulty,
    domain: 'maths',
    skills: { patternRecognition: 0.5, logic: 0.3, knowledge: 0.2 },
    parMs: 25_000,
    mount: choicePuzzle({
      instruction: 'What number comes next?',
      stem: shown.map((value) => ({ type: 'text' as const, text: String(value) })),
      options,
      correctId: 'right',
      allowRetry: true,
      showLabels: false,
      explain: `The list is ${rule.label}.`,
    }),
  };
}

/* -------------------------------------------------------------- order numbers */

export function numberOrderCard(difficulty: Difficulty): PuzzleCard {
  const howMany = Math.min(6, 3 + difficulty);
  const pool = shuffle(Array.from({ length: 40 }, (_, i) => i + 1)).slice(0, howMany);
  const sorted = [...pool].sort((a, b) => a - b);

  return {
    id: `ye-order-${difficulty}`,
    title: 'Smallest to biggest',
    difficulty,
    domain: 'maths',
    skills: { logic: 0.45, planning: 0.3, knowledge: 0.25 },
    parMs: howMany * 8000,
    mount: sequencePuzzle({
      instruction: 'Put the numbers in order.',
      items: shuffle(pool).map((value) => ({
        id: `n${value}`,
        label: String(value),
        visual: { type: 'text', text: String(value), strong: true },
      })),
      solution: sorted.map((value) => `n${value}`),
      fromLabel: 'smallest',
      toLabel: 'biggest',
    }),
  };
}

/* ------------------------------------------------------------- category sort */

const CATEGORIES = [
  { id: 'animals', label: 'Animals', items: ['🐘', '🐧', '🦊', '🐢'] },
  { id: 'vehicles', label: 'Vehicles', items: ['🚌', '🚲', '✈️', '🚂'] },
  { id: 'food', label: 'Food', items: ['🍞', '🍇', '🥕', '🧀'] },
  { id: 'clothes', label: 'Clothes', items: ['👕', '🧦', '🧢', '🥾'] },
];

export function categorySortCard(difficulty: Difficulty): PuzzleCard {
  const groups = CATEGORIES.slice(0, Math.min(CATEGORIES.length, difficulty >= 3 ? 3 : 2));
  const each = difficulty >= 4 ? 3 : 2;

  const pieces: SortPiece[] = [];
  for (const group of groups) {
    for (let n = 0; n < each; n += 1) {
      pieces.push({
        id: `${group.id}-${n}`,
        bucketId: group.id,
        label: `${group.label} item`,
        visual: { type: 'icon', char: group.items[n] as string },
      });
    }
  }

  return {
    id: `ye-category-${difficulty}`,
    title: 'Sort by group',
    difficulty,
    domain: 'core',
    skills: { logic: 0.35, knowledge: 0.4, attention: 0.25 },
    parMs: pieces.length * 6000,
    mount: sortPuzzle({
      instruction: 'Put each thing with its group.',
      pieces: shuffle(pieces),
      buckets: groups.map((group) => ({ id: group.id, label: group.label })),
      showBucketLabels: true,
    }),
  };
}

/* -------------------------------------------------------------- what changed */

const CHANGE_POOL = [
  { id: 'star', label: 'Star', char: '⭐' },
  { id: 'moon', label: 'Moon', char: '🌙' },
  { id: 'leaf', label: 'Leaf', char: '🍀' },
  { id: 'key', label: 'Key', char: '🔑' },
  { id: 'bell', label: 'Bell', char: '🔔' },
  { id: 'drum', label: 'Drum', char: '🥁' },
];

export function whatWasThereCard(difficulty: Difficulty): PuzzleCard {
  const howMany = Math.min(CHANGE_POOL.length, 3 + difficulty);
  const picked = shuffle(CHANGE_POOL).slice(0, howMany);
  const items = picked.map((item) => ({
    id: item.id,
    label: item.label,
    visual: { type: 'icon' as const, char: item.char },
  }));
  const gone = items[Math.floor(Math.random() * items.length)];
  if (!gone) throw new Error('memory pool empty');

  return {
    id: `ye-memory-${difficulty}`,
    title: 'What is missing',
    difficulty,
    domain: 'core',
    skills: { memory: 0.6, attention: 0.3, knowledge: 0.1 },
    parMs: 24_000,
    mount: memoryPuzzle({
      studyInstruction: 'Remember these.',
      question: 'Which one has gone?',
      items,
      showMs: Math.max(2200, 4200 - difficulty * 400),
      recallShow: items.filter((item) => item.id !== gone.id).map((item) => item.id),
      correctId: gone.id,
      allowRetry: true,
      showLabels: false,
    }),
  };
}

/* ------------------------------------------------------------- plan the steps */

const PLANS = [
  {
    id: 'toast',
    instruction: 'Put the steps in order to make toast.',
    steps: [
      { id: 'bread', label: 'Take the bread', char: '🍞' },
      { id: 'toaster', label: 'Put it in the toaster', char: '🔌' },
      { id: 'wait', label: 'Wait for it to pop up', char: '⏲️' },
      { id: 'eat', label: 'Eat it', char: '😋' },
    ],
  },
  {
    id: 'plant',
    instruction: 'Put the steps in order to grow a plant.',
    steps: [
      { id: 'dig', label: 'Dig a hole', char: '🕳️' },
      { id: 'seed', label: 'Drop in the seed', char: '🌰' },
      { id: 'water', label: 'Water it', char: '💧' },
      { id: 'grow', label: 'It grows', char: '🌿' },
    ],
  },
  {
    id: 'letter',
    instruction: 'Put the steps in order to send a letter.',
    steps: [
      { id: 'write', label: 'Write the letter', char: '✍️' },
      { id: 'fold', label: 'Fold it into an envelope', char: '✉️' },
      { id: 'stamp', label: 'Add a stamp', char: '🏷️' },
      { id: 'post', label: 'Post it', char: '📮' },
    ],
  },
];

export function planOrderCard(difficulty: Difficulty): PuzzleCard {
  const plan = PLANS[Math.floor(Math.random() * PLANS.length)];
  if (!plan) throw new Error('plan pool empty');
  const steps = difficulty <= 2 ? plan.steps.slice(0, 3) : plan.steps;

  return {
    id: `ye-plan-${difficulty}`,
    title: 'Plan the steps',
    difficulty,
    domain: 'problem-solving',
    skills: { planning: 0.5, logic: 0.3, knowledge: 0.2 },
    parMs: steps.length * 10_000,
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
    }),
  };
}

/* --------------------------------------------------------------- word to thing */

const WORD_PAIRS = [
  { id: 'rain', word: 'Umbrella', char: '☂️' },
  { id: 'music', word: 'Guitar', char: '🎸' },
  { id: 'time', word: 'Clock', char: '🕐' },
  { id: 'read', word: 'Book', char: '📖' },
  { id: 'cold', word: 'Snowflake', char: '❄️' },
];

export function wordPictureCard(difficulty: Difficulty): PuzzleCard {
  const howMany = Math.min(WORD_PAIRS.length, 2 + difficulty);
  const chosen = shuffle(WORD_PAIRS).slice(0, howMany);

  return {
    id: `ye-word-${difficulty}`,
    title: 'Word and picture',
    difficulty,
    domain: 'language',
    skills: { knowledge: 0.45, memory: 0.2, attention: 0.35 },
    parMs: chosen.length * 8000,
    mount: matchPuzzle({
      instruction: 'Match each picture to its word.',
      showLabels: false,
      pairs: chosen.map((pair) => ({
        id: pair.id,
        from: { label: pair.word, visual: { type: 'icon', char: pair.char } },
        to: { label: pair.word },
      })),
    }),
  };
}

export const YOUNG_EXPLORER_BUILDERS = [
  sumSortCard,
  numberNextCard,
  numberOrderCard,
  categorySortCard,
  whatWasThereCard,
  planOrderCard,
  wordPictureCard,
];
