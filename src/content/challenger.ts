/**
 * Challenger (13-17).
 *
 * Multi-rule logic, planning, optimisation and rules that change while you are
 * still working. Retries are off on reasoning tasks: at this level committing to
 * an answer is part of the challenge.
 */

import type { Difficulty } from '../game/brain';
import type { PuzzleCard } from '../game/puzzle';
import { shuffle } from '../game/util';
import { choicePuzzle } from '../puzzles/choice';
import { sequencePuzzle } from '../puzzles/sequence';
import { sortPuzzle, type SortPiece } from '../puzzles/sort';

/* ----------------------------------------------------------- two rules at once */

/** Both conditions have to be held in mind for every card. */
export function twoRuleSortCard(difficulty: Difficulty): PuzzleCard {
  const limit = 30 + difficulty * 4;
  const values = shuffle([7, 12, 18, 24, 31, 36, 42, 45, 50, 56]).slice(0, difficulty >= 4 ? 8 : 6);

  const pieces: SortPiece[] = values.map((value) => ({
    id: `v${value}`,
    bucketId: value % 2 === 0 ? (value >= limit ? 'even-big' : 'even-small') : 'odd',
    label: String(value),
    visual: { type: 'text', text: String(value) },
  }));

  return {
    id: `ch-tworule-${difficulty}`,
    title: 'Two rules at once',
    difficulty,
    domain: 'maths',
    skills: { logic: 0.4, attention: 0.3, problemSolving: 0.3 },
    parMs: pieces.length * 9000,
    mount: sortPuzzle({
      instruction: `Even and ${limit} or more, even and smaller, or odd.`,
      pieces,
      buckets: [
        { id: 'even-big', label: `Even, ${limit}+` },
        { id: 'even-small', label: `Even, under ${limit}` },
        { id: 'odd', label: 'Odd' },
      ],
      showBucketLabels: true,
    }),
  };
}

/* ------------------------------------------------------------- rule mutation */

/**
 * The rule flips halfway through. Noticing the change and re-planning is the
 * whole point, so the instruction updates and the board flags the switch.
 */
export function ruleSwitchCard(difficulty: Difficulty): PuzzleCard {
  const count = difficulty >= 4 ? 8 : 6;
  const values = shuffle([3, 8, 11, 14, 19, 22, 27, 30, 35, 40]).slice(0, count);
  const half = Math.floor(count / 2);

  const pieces: SortPiece[] = values.map((value) => ({
    id: `v${value}`,
    bucketId: value % 2 === 0 ? 'a' : 'b',
    label: String(value),
    visual: { type: 'text', text: String(value) },
  }));

  const byMagnitude = (pieceId: string) => {
    const value = Number(pieceId.slice(1));
    return value >= 20 ? 'a' : 'b';
  };

  return {
    id: `ch-ruleswitch-${difficulty}`,
    title: 'The rule changes',
    difficulty,
    domain: 'core',
    skills: { logic: 0.3, attention: 0.3, problemSolving: 0.4 },
    parMs: count * 11_000,
    mount: sortPuzzle({
      instruction: 'Left box: even. Right box: odd. Watch for a change.',
      pieces,
      buckets: [
        { id: 'a', label: 'Left box' },
        { id: 'b', label: 'Right box' },
      ],
      showBucketLabels: true,
      ruleSwitch: {
        after: half,
        instruction: 'Rule changed. Left box: 20 or more. Right box: under 20.',
        bucketOf: byMagnitude,
      },
    }),
  };
}

/* -------------------------------------------------------- practical reasoning */

const PRACTICAL = [
  {
    text: 'A jacket costs 80. It is reduced by 25%, then 10 is taken off at the till. What do you pay?',
    options: [
      { id: 'right', label: '50' },
      { id: 'a', label: '46' },
      { id: 'b', label: '54' },
      { id: 'c', label: '45' },
    ],
    explain: '25% of 80 is 20, leaving 60. Then 10 off gives 50.',
  },
  {
    text: 'Two taps fill a tank. Alone, one takes 6 hours and the other takes 3 hours. Roughly how long together?',
    options: [
      { id: 'right', label: '2 hours' },
      { id: 'a', label: '4 hours 30' },
      { id: 'b', label: '9 hours' },
      { id: 'c', label: '3 hours' },
    ],
    explain: 'In one hour they fill 1/6 + 1/3 = 1/2 of the tank, so two hours in total.',
  },
  {
    text: 'A bus is late 3 days out of every 12. Out of 40 days, about how many late days would you expect?',
    options: [
      { id: 'right', label: '10' },
      { id: 'a', label: '3' },
      { id: 'b', label: '12' },
      { id: 'c', label: '15' },
    ],
    explain: '3 in 12 is one quarter, and a quarter of 40 is 10.',
  },
];

export function practicalMathsCard(difficulty: Difficulty): PuzzleCard {
  const item = PRACTICAL[Math.floor(Math.random() * PRACTICAL.length)];
  if (!item) throw new Error('practical pool empty');

  return {
    id: `ch-practical-${difficulty}`,
    title: 'Work out the cost',
    difficulty,
    domain: 'maths',
    skills: { problemSolving: 0.4, logic: 0.35, knowledge: 0.25 },
    parMs: 60_000,
    mount: choicePuzzle({
      instruction: 'One answer. Work it through first.',
      text: item.text,
      options: shuffle(item.options),
      correctId: 'right',
      explain: item.explain,
    }),
  };
}

/* ------------------------------------------------------------- optimisation */

const OPTIMISE = [
  {
    text: 'You must visit the bank, the market and the library, then come home. The bank is next to home, the market is next to the bank, and the library is across town from all of them. Which route is shortest?',
    options: [
      { id: 'right', label: 'Bank, market, library, home' },
      { id: 'a', label: 'Library, bank, market, home' },
      { id: 'b', label: 'Market, library, bank, home' },
    ],
    explain: 'Group the three near stops together and make the single long trip once, at the far end.',
  },
  {
    text: 'A lift carries 3 crates per trip. You have 11 crates. What is the fewest trips?',
    options: [
      { id: 'right', label: '4' },
      { id: 'a', label: '3' },
      { id: 'b', label: '5' },
    ],
    explain: '3 trips carry 9 crates, so a fourth trip is needed for the last 2.',
  },
];

export function optimiseCard(difficulty: Difficulty): PuzzleCard {
  const item = OPTIMISE[Math.floor(Math.random() * OPTIMISE.length)];
  if (!item) throw new Error('optimise pool empty');

  return {
    id: `ch-optimise-${difficulty}`,
    title: 'Fewest moves',
    difficulty,
    domain: 'problem-solving',
    skills: { planning: 0.45, problemSolving: 0.35, logic: 0.2 },
    parMs: 55_000,
    mount: choicePuzzle({
      instruction: 'Pick the most efficient option.',
      text: item.text,
      options: shuffle(item.options),
      correctId: 'right',
      explain: item.explain,
    }),
  };
}

/* -------------------------------------------------------- constrained ordering */

const CONSTRAINED = [
  {
    id: 'schedule',
    instruction: 'Order the five tasks so every rule holds.',
    text: 'Rules: paint after sanding. Sanding after clearing. Varnish last. Photographs after varnish is dry, so photographs are final.',
    steps: [
      { id: 'clear', label: 'Clear the room', char: '🧹' },
      { id: 'sand', label: 'Sand the floor', char: '🪵' },
      { id: 'paint', label: 'Paint the walls', char: '🎨' },
      { id: 'varnish', label: 'Varnish the floor', char: '🪣' },
      { id: 'photo', label: 'Take photographs', char: '📷' },
    ],
    explain: 'Clearing enables sanding, sanding enables painting, varnish comes last of the work, and photographs follow it.',
  },
];

export function constrainedOrderCard(difficulty: Difficulty): PuzzleCard {
  const plan = CONSTRAINED[0];
  if (!plan) throw new Error('constrained pool empty');
  const steps = difficulty <= 2 ? plan.steps.slice(0, 4) : plan.steps;

  return {
    id: `ch-constrained-${difficulty}`,
    title: 'Order under rules',
    difficulty,
    domain: 'problem-solving',
    skills: { planning: 0.5, logic: 0.35, memory: 0.15 },
    parMs: steps.length * 14_000,
    mount: sequencePuzzle({
      instruction: plan.instruction,
      text: plan.text,
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

/* ------------------------------------------------------------ science reasoning */

const SCIENCE = [
  {
    text: 'Two identical plants sit in the same window with the same soil. One is watered daily, the other weekly, and the weekly one wilts. A gardener says the light caused it. Why is that conclusion unsound?',
    options: [
      { id: 'right', label: 'Light was the same for both, so it cannot explain the difference' },
      { id: 'a', label: 'Because plants always need more light than water' },
      { id: 'b', label: 'Because one week is not long enough to matter' },
    ],
    explain: 'A variable held constant across both cases cannot explain a difference between them.',
  },
  {
    text: 'A metal ball and a feather are dropped in a vacuum chamber and land together. What does this show?',
    options: [
      { id: 'right', label: 'Air resistance, not weight, normally makes the feather fall slower' },
      { id: 'a', label: 'The feather became heavier in the vacuum' },
      { id: 'b', label: 'Gravity is stronger inside a vacuum' },
    ],
    explain: 'Gravity accelerates all masses equally; in air it is drag that slows the feather.',
  },
];

export function scienceReasonCard(difficulty: Difficulty): PuzzleCard {
  const item = SCIENCE[Math.floor(Math.random() * SCIENCE.length)];
  if (!item) throw new Error('science pool empty');

  return {
    id: `ch-science-${difficulty}`,
    title: 'Test the claim',
    difficulty,
    domain: 'nature',
    skills: { logic: 0.4, knowledge: 0.3, problemSolving: 0.3 },
    parMs: 60_000,
    mount: choicePuzzle({
      instruction: 'Which reasoning holds up?',
      text: item.text,
      options: shuffle(item.options),
      correctId: 'right',
      explain: item.explain,
    }),
  };
}

export const CHALLENGER_BUILDERS = [
  twoRuleSortCard,
  ruleSwitchCard,
  practicalMathsCard,
  optimiseCard,
  constrainedOrderCard,
  scienceReasonCard,
];
