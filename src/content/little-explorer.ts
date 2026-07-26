/**
 * Little Explorer (3-5).
 *
 * Design rules for this age: almost no reading, large targets, generous pacing,
 * no timers, and a wrong answer guides rather than punishes (`allowRetry`).
 * Difficulty grows through how much there is to hold and tell apart, never
 * through heavier graphics.
 *
 * Every activity is built from the shared engines: sort, match, choose, memory.
 */

import type { Difficulty } from '../game/brain';
import type { PuzzleCard } from '../game/puzzle';
import { shuffle } from '../game/util';
import { choicePuzzle } from '../puzzles/choice';
import { matchPuzzle } from '../puzzles/match';
import { memoryPuzzle } from '../puzzles/memory';
import { sortPuzzle, type SortPiece } from '../puzzles/sort';
import type { ColourName, ShapeKind, Visual } from '../ui/visual';

const SHAPE_LABEL: Record<ShapeKind, string> = {
  circle: 'Circle',
  triangle: 'Triangle',
  square: 'Square',
  star: 'Star',
  heart: 'Heart',
};

const SHAPE_COLOUR: Record<ShapeKind, ColourName> = {
  circle: 'blue',
  triangle: 'orange',
  square: 'green',
  star: 'purple',
  heart: 'red',
};

const COLOUR_LABEL: Record<ColourName, string> = {
  red: 'Red',
  orange: 'Orange',
  yellow: 'Yellow',
  green: 'Green',
  blue: 'Blue',
  purple: 'Purple',
};

/** Generous par times: a young player should never feel chased. */
const SLOW_STEP_MS = 5000;

/* ---------------------------------------------------------------- shape sort */

const SHAPE_STEPS: Record<Difficulty, { kinds: ShapeKind[]; each: number; colour: boolean }> = {
  1: { kinds: ['circle', 'square'], each: 2, colour: true },
  2: { kinds: ['circle', 'triangle', 'square'], each: 2, colour: true },
  3: { kinds: ['circle', 'triangle', 'square'], each: 3, colour: true },
  // The colour cue disappears, so the shape itself is the only signal left.
  4: { kinds: ['circle', 'triangle', 'square'], each: 3, colour: false },
  5: { kinds: ['circle', 'triangle', 'star'], each: 4, colour: false },
};

export function shapeSortCard(difficulty: Difficulty): PuzzleCard {
  const step = SHAPE_STEPS[difficulty];
  const paint = (kind: ShapeKind): Visual =>
    step.colour
      ? { type: 'shape', kind, colour: SHAPE_COLOUR[kind] }
      : { type: 'shape', kind };

  const pieces: SortPiece[] = [];
  for (const kind of step.kinds) {
    for (let n = 0; n < step.each; n += 1) {
      pieces.push({ id: `${kind}-${n}`, bucketId: kind, label: SHAPE_LABEL[kind], visual: paint(kind) });
    }
  }

  return {
    id: `le-shape-${difficulty}`,
    title: 'Shape sort',
    difficulty,
    domain: 'core',
    skills: { patternRecognition: 0.45, attention: 0.35, knowledge: 0.2 },
    parMs: pieces.length * SLOW_STEP_MS,
    mount: sortPuzzle({
      instruction: step.colour
        ? 'Put each shape in the box that matches it.'
        : 'All one colour now. Look at the shape.',
      pieces: shuffle(pieces),
      buckets: step.kinds.map((kind) => ({ id: kind, label: SHAPE_LABEL[kind], visual: paint(kind) })),
    }),
  };
}

/* --------------------------------------------------------------- colour sort */

const COLOUR_STEPS: Record<Difficulty, { colours: ColourName[]; each: number; mixShapes: boolean }> = {
  1: { colours: ['red', 'blue'], each: 2, mixShapes: false },
  2: { colours: ['red', 'blue', 'yellow'], each: 2, mixShapes: false },
  3: { colours: ['red', 'blue', 'yellow'], each: 2, mixShapes: true },
  4: { colours: ['red', 'blue', 'yellow', 'green'], each: 2, mixShapes: true },
  5: { colours: ['red', 'blue', 'green', 'purple'], each: 3, mixShapes: true },
};

export function colourSortCard(difficulty: Difficulty): PuzzleCard {
  const step = COLOUR_STEPS[difficulty];
  // Mixing shapes forces the player to ignore shape and attend to colour only.
  const shapes: ShapeKind[] = ['circle', 'square', 'triangle', 'heart', 'star'];

  const pieces: SortPiece[] = [];
  step.colours.forEach((colour, ci) => {
    for (let n = 0; n < step.each; n += 1) {
      const kind = step.mixShapes ? (shapes[(ci + n) % shapes.length] as ShapeKind) : 'circle';
      pieces.push({
        id: `${colour}-${n}`,
        bucketId: colour,
        label: COLOUR_LABEL[colour],
        visual: { type: 'shape', kind, colour },
      });
    }
  });

  return {
    id: `le-colour-${difficulty}`,
    title: 'Colour sort',
    difficulty,
    domain: 'core',
    skills: { patternRecognition: 0.4, attention: 0.4, knowledge: 0.2 },
    parMs: pieces.length * SLOW_STEP_MS,
    mount: sortPuzzle({
      instruction: step.mixShapes
        ? 'Different shapes. Sort them by colour.'
        : 'Put each one in the basket of the same colour.',
      pieces: shuffle(pieces),
      buckets: step.colours.map((colour) => ({
        id: colour,
        label: COLOUR_LABEL[colour],
        visual: { type: 'shape', kind: 'circle', colour },
      })),
    }),
  };
}

/* ------------------------------------------------------------- big and small */

export function sizeSortCard(difficulty: Difficulty): PuzzleCard {
  const threeWay = difficulty >= 3;
  const each = difficulty >= 4 ? 3 : 2;
  const groups: { id: string; label: string; size: 'sm' | 'md' | 'lg' }[] = threeWay
    ? [
        { id: 'big', label: 'Big', size: 'lg' },
        { id: 'middle', label: 'Middle', size: 'md' },
        { id: 'small', label: 'Small', size: 'sm' },
      ]
    : [
        { id: 'big', label: 'Big', size: 'lg' },
        { id: 'small', label: 'Small', size: 'sm' },
      ];

  const shapes: ShapeKind[] = ['circle', 'square', 'star', 'heart'];
  const pieces: SortPiece[] = [];
  groups.forEach((group, gi) => {
    for (let n = 0; n < each; n += 1) {
      pieces.push({
        id: `${group.id}-${n}`,
        bucketId: group.id,
        label: `${group.label} shape`,
        visual: {
          type: 'shape',
          kind: shapes[(gi + n) % shapes.length] as ShapeKind,
          colour: 'purple',
          size: group.size,
        },
      });
    }
  });

  return {
    id: `le-size-${difficulty}`,
    title: 'Big and small',
    difficulty,
    domain: 'maths',
    skills: { patternRecognition: 0.35, attention: 0.3, logic: 0.35 },
    parMs: pieces.length * SLOW_STEP_MS,
    mount: sortPuzzle({
      instruction: threeWay ? 'Big, middle or small?' : 'Big ones and small ones.',
      pieces: shuffle(pieces),
      buckets: groups.map((group) => ({ id: group.id, label: group.label })),
      showBucketLabels: true,
    }),
  };
}

/* ------------------------------------------------------------ counting 1 - 5 */

export function countSortCard(difficulty: Difficulty): PuzzleCard {
  const top = Math.min(5, difficulty + 2);
  const numbers = Array.from({ length: top }, (_, i) => i + 1);
  const each = difficulty >= 4 ? 2 : 1;

  const pieces: SortPiece[] = [];
  for (const count of numbers) {
    for (let n = 0; n < each; n += 1) {
      pieces.push({
        id: `n${count}-${n}`,
        bucketId: `n${count}`,
        label: `${count} dot${count === 1 ? '' : 's'}`,
        visual: { type: 'dots', count, colour: 'blue' },
      });
    }
  }

  return {
    id: `le-count-${difficulty}`,
    title: 'Count the dots',
    difficulty,
    domain: 'maths',
    skills: { logic: 0.3, attention: 0.35, knowledge: 0.35 },
    parMs: pieces.length * SLOW_STEP_MS * 1.2,
    mount: sortPuzzle({
      instruction: 'Count the dots. Put them under the right number.',
      pieces: shuffle(pieces),
      buckets: numbers.map((count) => ({
        id: `n${count}`,
        label: String(count),
        visual: { type: 'text', text: String(count), strong: true },
      })),
      showBucketLabels: false,
    }),
  };
}

/* ------------------------------------------------------- repeating patterns */

interface PatternStep {
  /** Repeating unit, e.g. AB or ABB. */
  unit: ShapeKind[];
  /** How many units to show before the gap. */
  repeats: number;
}

const PATTERN_STEPS: Record<Difficulty, PatternStep> = {
  1: { unit: ['circle', 'square'], repeats: 2 },
  2: { unit: ['circle', 'square', 'square'], repeats: 2 },
  3: { unit: ['circle', 'triangle', 'square'], repeats: 2 },
  4: { unit: ['circle', 'circle', 'triangle'], repeats: 2 },
  5: { unit: ['star', 'circle', 'triangle', 'circle'], repeats: 2 },
};

export function patternNextCard(difficulty: Difficulty): PuzzleCard {
  const step = PATTERN_STEPS[difficulty];
  const sequence: ShapeKind[] = [];
  for (let r = 0; r < step.repeats; r += 1) sequence.push(...step.unit);
  // Show one extra partial unit so the answer is the next item, not a new unit.
  const extra = step.unit.length > 2 ? step.unit.length - 1 : 1;
  for (let i = 0; i < extra; i += 1) sequence.push(step.unit[i] as ShapeKind);

  const answer = step.unit[extra % step.unit.length] as ShapeKind;
  const wrong = [...new Set(step.unit)].filter((kind) => kind !== answer);
  const distractors: ShapeKind[] = wrong.length > 0 ? wrong : ['heart'];

  const stem: Visual[] = [
    ...sequence.map((kind) => ({ type: 'shape' as const, kind, colour: SHAPE_COLOUR[kind] })),
    { type: 'text' as const, text: '?', strong: true },
  ];

  const options = shuffle([
    { id: answer, label: SHAPE_LABEL[answer], visual: { type: 'shape' as const, kind: answer, colour: SHAPE_COLOUR[answer] } },
    ...distractors.slice(0, 2).map((kind) => ({
      id: kind,
      label: SHAPE_LABEL[kind],
      visual: { type: 'shape' as const, kind, colour: SHAPE_COLOUR[kind] },
    })),
  ]);

  return {
    id: `le-pattern-${difficulty}`,
    title: 'What comes next',
    difficulty,
    domain: 'core',
    skills: { patternRecognition: 0.6, logic: 0.25, attention: 0.15 },
    parMs: 20_000,
    mount: choicePuzzle({
      instruction: 'The shapes repeat. What comes next?',
      stem,
      options,
      correctId: answer,
      allowRetry: true,
      showLabels: false,
    }),
  };
}

/* ---------------------------------------------------------- same / different */

export function oddOneOutCard(difficulty: Difficulty): PuzzleCard {
  const count = difficulty >= 4 ? 4 : 3;
  const base: ShapeKind = 'circle';
  // Level 1-2 differ by shape, 3+ only by colour, which is a finer distinction.
  const byColour = difficulty >= 3;

  const same: Visual = { type: 'shape', kind: base, colour: 'blue' };
  const odd: Visual = byColour
    ? { type: 'shape', kind: base, colour: 'green' }
    : { type: 'shape', kind: 'square', colour: 'blue' };

  const options = shuffle([
    { id: 'odd', label: 'The different one', visual: odd },
    ...Array.from({ length: count - 1 }, (_, i) => ({
      id: `same-${i}`,
      label: 'Same as the others',
      visual: same,
    })),
  ]);

  return {
    id: `le-odd-${difficulty}`,
    title: 'Spot the different one',
    difficulty,
    domain: 'core',
    skills: { attention: 0.5, patternRecognition: 0.35, logic: 0.15 },
    parMs: 18_000,
    mount: choicePuzzle({
      instruction: 'One of these is not like the others. Which one?',
      options,
      correctId: 'odd',
      allowRetry: true,
      showLabels: false,
    }),
  };
}

/* ------------------------------------------------------------ animal homes */

const HABITATS = [
  { id: 'water', animal: '🐟', animalLabel: 'Fish', home: '🌊', homeLabel: 'Water' },
  { id: 'sky', animal: '🐦', animalLabel: 'Bird', home: '☁️', homeLabel: 'Sky' },
  { id: 'grass', animal: '🐰', animalLabel: 'Rabbit', home: '🌱', homeLabel: 'Grass' },
  { id: 'tree', animal: '🐿️', animalLabel: 'Squirrel', home: '🌳', homeLabel: 'Tree' },
  { id: 'hive', animal: '🐝', animalLabel: 'Bee', home: '🌻', homeLabel: 'Flower' },
];

export function habitatMatchCard(difficulty: Difficulty): PuzzleCard {
  const howMany = Math.min(HABITATS.length, difficulty + 1);
  const chosen = HABITATS.slice(0, howMany);

  return {
    id: `le-habitat-${difficulty}`,
    title: 'Animal homes',
    difficulty,
    domain: 'nature',
    skills: { knowledge: 0.45, logic: 0.3, patternRecognition: 0.25 },
    parMs: chosen.length * SLOW_STEP_MS * 1.4,
    mount: matchPuzzle({
      instruction: 'Take each animal to where it lives.',
      showLabels: false,
      pairs: chosen.map((item) => ({
        id: item.id,
        from: { label: item.animalLabel, visual: { type: 'icon', char: item.animal } },
        to: { label: item.homeLabel, visual: { type: 'icon', char: item.home } },
      })),
    }),
  };
}

/* ----------------------------------------------------------- visual memory */

const MEMORY_POOL = [
  { id: 'apple', label: 'Apple', char: '🍎' },
  { id: 'ball', label: 'Ball', char: '⚽' },
  { id: 'cup', label: 'Cup', char: '🥤' },
  { id: 'cat', label: 'Cat', char: '🐱' },
  { id: 'boat', label: 'Boat', char: '⛵' },
  { id: 'sun', label: 'Sun', char: '☀️' },
];

export function visualMemoryCard(difficulty: Difficulty): PuzzleCard {
  const howMany = Math.min(MEMORY_POOL.length, difficulty + 2);
  const items = shuffle(MEMORY_POOL)
    .slice(0, howMany)
    .map((item) => ({
      id: item.id,
      label: item.label,
      visual: { type: 'icon' as const, char: item.char },
    }));

  const hidden = items[Math.floor(Math.random() * items.length)];
  if (!hidden) throw new Error('visual memory needs at least one item');
  const stillShown = items.filter((item) => item.id !== hidden.id).map((item) => item.id);

  return {
    id: `le-memory-${difficulty}`,
    title: 'What is missing',
    difficulty,
    domain: 'core',
    skills: { memory: 0.65, attention: 0.25, knowledge: 0.1 },
    // Longer looks at low levels; the window tightens as the set grows.
    parMs: 22_000,
    mount: memoryPuzzle({
      studyInstruction: 'Look at these things.',
      question: 'One has gone. Which one?',
      items,
      showMs: Math.max(2600, 4200 - difficulty * 300),
      recallShow: stillShown,
      correctId: hidden.id,
      allowRetry: true,
    }),
  };
}

/* ------------------------------------------------------- what happens next */

const STORIES = [
  {
    id: 'seed',
    steps: ['🌰', '🌱'],
    answer: { id: 'tree', char: '🌳', label: 'A tree' },
    wrong: [
      { id: 'rock', char: '🪨', label: 'A rock' },
      { id: 'boat', char: '⛵', label: 'A boat' },
    ],
    explain: 'A seed grows into a plant, then a tree.',
  },
  {
    id: 'egg',
    steps: ['🥚', '🐣'],
    answer: { id: 'hen', char: '🐔', label: 'A hen' },
    wrong: [
      { id: 'fish', char: '🐟', label: 'A fish' },
      { id: 'car', char: '🚗', label: 'A car' },
    ],
    explain: 'An egg hatches into a chick, and the chick grows into a hen.',
  },
  {
    id: 'rain',
    steps: ['☁️', '🌧️'],
    answer: { id: 'puddle', char: '💧', label: 'Water on the ground' },
    wrong: [
      { id: 'fire', char: '🔥', label: 'Fire' },
      { id: 'moon', char: '🌙', label: 'The moon' },
    ],
    explain: 'Clouds bring rain, and rain leaves water on the ground.',
  },
];

export function storyNextCard(difficulty: Difficulty): PuzzleCard {
  const story = STORIES[Math.floor(Math.random() * STORIES.length)];
  if (!story) throw new Error('story pool is empty');
  const wrongCount = difficulty >= 3 ? 2 : 1;

  const options = shuffle([
    { id: story.answer.id, label: story.answer.label, visual: { type: 'icon' as const, char: story.answer.char } },
    ...story.wrong.slice(0, wrongCount).map((item) => ({
      id: item.id,
      label: item.label,
      visual: { type: 'icon' as const, char: item.char },
    })),
  ]);

  return {
    id: `le-story-${difficulty}`,
    title: 'What happens next',
    difficulty,
    domain: 'nature',
    skills: { logic: 0.35, knowledge: 0.3, planning: 0.35 },
    parMs: 22_000,
    mount: choicePuzzle({
      instruction: 'This happens in order. What comes after?',
      stem: [
        ...story.steps.map((char) => ({ type: 'icon' as const, char })),
        { type: 'text' as const, text: '?', strong: true },
      ],
      options,
      correctId: story.answer.id,
      allowRetry: true,
      showLabels: false,
      explain: story.explain,
    }),
  };
}

/** Everything a 3-5 player can meet, in rough order of introduction. */
export const LITTLE_EXPLORER_BUILDERS = [
  shapeSortCard,
  colourSortCard,
  sizeSortCard,
  countSortCard,
  patternNextCard,
  oddOneOutCard,
  habitatMatchCard,
  visualMemoryCard,
  storyNextCard,
];
