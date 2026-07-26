/**
 * Knowledge domains as puzzle material.
 *
 * The rule for this file: knowledge is never the task on its own. Every item
 * below asks the player to classify, order, match, deduce or infer, and the
 * subject matter is what makes that work interesting. There are no
 * "what year did X happen" questions.
 *
 * All passages are written for MIND VAULT. No copyrighted text is reproduced.
 */

import type { Difficulty } from '../game/brain';
import type { PuzzleCard } from '../game/puzzle';
import type { AgeGroup } from '../game/types';
import { shuffle } from '../game/util';
import { choicePuzzle } from '../puzzles/choice';
import { matchPuzzle } from '../puzzles/match';
import { sequencePuzzle } from '../puzzles/sequence';
import { sortPuzzle, type SortPiece } from '../puzzles/sort';
import type { CardBuilder } from './catalog';

/* ========================================================== HISTORY ======= */

const LONG_AGO = [
  { id: 'candle', label: 'Candle', char: '🕯️' },
  { id: 'quill', label: 'Quill pen', char: '🪶' },
  { id: 'scroll', label: 'Scroll', char: '📜' },
  { id: 'sail', label: 'Sailing ship', char: '⛵' },
];

const TODAY = [
  { id: 'phone', label: 'Phone', char: '📱' },
  { id: 'laptop', label: 'Laptop', char: '💻' },
  { id: 'rocket', label: 'Rocket', char: '🚀' },
  { id: 'plane', label: 'Aeroplane', char: '✈️' },
];

/** Ancient or modern: classification before chronology. */
export function oldOrNewCard(difficulty: Difficulty): PuzzleCard {
  const each = Math.min(4, 1 + difficulty);
  const pieces: SortPiece[] = [
    ...LONG_AGO.slice(0, each).map((item) => ({
      id: item.id,
      bucketId: 'old',
      label: item.label,
      visual: { type: 'icon' as const, char: item.char },
    })),
    ...TODAY.slice(0, each).map((item) => ({
      id: item.id,
      bucketId: 'new',
      label: item.label,
      visual: { type: 'icon' as const, char: item.char },
    })),
  ];

  return {
    id: `hist-oldnew-${difficulty}`,
    title: 'Long ago or today',
    difficulty,
    domain: 'history',
    skills: { knowledge: 0.45, logic: 0.3, patternRecognition: 0.25 },
    parMs: pieces.length * 7000,
    mount: sortPuzzle({
      instruction: 'Which of these come from long ago, and which are from today?',
      pieces: shuffle(pieces),
      buckets: [
        { id: 'old', label: 'Long ago' },
        { id: 'new', label: 'Today' },
      ],
      showBucketLabels: true,
    }),
  };
}

const TIMELINES = [
  {
    id: 'travel',
    instruction: 'Put these ways of travelling in order, oldest first.',
    steps: [
      { id: 'foot', label: 'Walking', char: '🚶' },
      { id: 'horse', label: 'Riding a horse', char: '🐴' },
      { id: 'train', label: 'Steam train', char: '🚂' },
      { id: 'plane', label: 'Aeroplane', char: '✈️' },
      { id: 'rocket', label: 'Spacecraft', char: '🚀' },
    ],
    explain: 'People walked, then tamed horses, then built steam engines, then aircraft, then spacecraft.',
  },
  {
    id: 'writing',
    instruction: 'Put these ways of recording words in order, oldest first.',
    steps: [
      { id: 'stone', label: 'Carving in stone', char: '🪨' },
      { id: 'scroll', label: 'Writing on scrolls', char: '📜' },
      { id: 'press', label: 'Printing press', char: '🗞️' },
      { id: 'type', label: 'Typewriter', char: '⌨️' },
      { id: 'screen', label: 'Digital screen', char: '💻' },
    ],
    explain: 'Carving came first, then handwritten scrolls, then printing, then typewriters, then screens.',
  },
  {
    id: 'light',
    instruction: 'Put these sources of light in order, oldest first.',
    steps: [
      { id: 'fire', label: 'Open fire', char: '🔥' },
      { id: 'candle', label: 'Candle', char: '🕯️' },
      { id: 'oil', label: 'Oil lamp', char: '🪔' },
      { id: 'bulb', label: 'Electric bulb', char: '💡' },
    ],
    explain: 'Fire, then candles, then oil lamps, then electric light.',
  },
];

/** Chronology by reasoning about what must have come first. */
export function timelineCard(difficulty: Difficulty): PuzzleCard {
  const line = TIMELINES[Math.floor(Math.random() * TIMELINES.length)];
  if (!line) throw new Error('timeline pool empty');
  const steps = difficulty <= 2 ? line.steps.slice(0, 3) : difficulty === 3 ? line.steps.slice(0, 4) : line.steps;

  return {
    id: `hist-timeline-${difficulty}`,
    title: 'Order in time',
    difficulty,
    domain: 'history',
    skills: { knowledge: 0.35, logic: 0.3, planning: 0.35 },
    parMs: steps.length * 11_000,
    mount: sequencePuzzle({
      instruction: line.instruction,
      items: shuffle(steps).map((step) => ({
        id: step.id,
        label: step.label,
        visual: { type: 'icon', char: step.char },
      })),
      solution: steps.map((step) => step.id),
      fromLabel: 'oldest',
      toLabel: 'newest',
      showLabels: true,
      explain: line.explain,
    }),
  };
}

const ERAS = [
  { id: 'ancient', label: 'Ancient world', items: [
    { id: 'pyramid', label: 'Pyramids built', char: '🔺' },
    { id: 'aqueduct', label: 'Roman aqueducts', char: '🏛️' },
  ] },
  { id: 'middle', label: 'Middle ages', items: [
    { id: 'castle', label: 'Stone castles', char: '🏰' },
    { id: 'windmill', label: 'Windmills spread', char: '🌬️' },
  ] },
  { id: 'industrial', label: 'Industrial age', items: [
    { id: 'factory', label: 'Steam factories', char: '🏭' },
    { id: 'rail', label: 'Railway networks', char: '🚂' },
  ] },
  { id: 'modern', label: 'Modern age', items: [
    { id: 'satellite', label: 'Satellites', char: '🛰️' },
    { id: 'network', label: 'Global networks', char: '🌐' },
  ] },
];

export function eraSortCard(difficulty: Difficulty): PuzzleCard {
  const groups = ERAS.slice(0, difficulty <= 2 ? 2 : difficulty === 3 ? 3 : 4);
  const each = difficulty >= 4 ? 2 : 1;

  const pieces: SortPiece[] = groups.flatMap((group) =>
    group.items.slice(0, each).map((item) => ({
      id: item.id,
      bucketId: group.id,
      label: item.label,
      visual: { type: 'icon' as const, char: item.char },
    })),
  );

  return {
    id: `hist-era-${difficulty}`,
    title: 'Place the age',
    difficulty,
    domain: 'history',
    skills: { knowledge: 0.4, logic: 0.35, patternRecognition: 0.25 },
    parMs: pieces.length * 10_000,
    mount: sortPuzzle({
      instruction: 'Put each development into the age it belongs to.',
      pieces: shuffle(pieces),
      buckets: groups.map((group) => ({ id: group.id, label: group.label })),
      showBucketLabels: true,
      showPieceLabels: true,
    }),
  };
}

const HISTORY_REASONING = [
  {
    text: 'Many of the oldest large cities grew up beside rivers. Which explanation best accounts for that?',
    options: [
      { id: 'right', label: 'Rivers gave drinking water, farm irrigation and a route for trade' },
      { id: 'a', label: 'Rivers were the only flat land available' },
      { id: 'b', label: 'People preferred the view' },
    ],
    explain: 'A river supplies water, feeds crops and carries goods, so settlements beside one could grow larger.',
  },
  {
    text: 'Printing with movable type spread quickly through Europe. What follows most directly from cheaper books?',
    options: [
      { id: 'right', label: 'Ideas travelled further and faster than before' },
      { id: 'a', label: 'Fewer people learned to read' },
      { id: 'b', label: 'Handwriting was immediately forgotten' },
    ],
    explain: 'When copies become cheap, the same argument can reach many more readers, and ideas spread.',
  },
  {
    text: 'Coastal trading towns often knew about distant events before inland villages did. Why?',
    options: [
      { id: 'right', label: 'Ships arrived carrying people, goods and news' },
      { id: 'a', label: 'Sea air makes news travel faster' },
      { id: 'b', label: 'Inland villages had no interest in news' },
    ],
    explain: 'News moved with people and cargo, so ports heard it first.',
  },
];

export function historyReasonCard(difficulty: Difficulty): PuzzleCard {
  const item = HISTORY_REASONING[Math.floor(Math.random() * HISTORY_REASONING.length)];
  if (!item) throw new Error('history reasoning pool empty');

  return {
    id: `hist-reason-${difficulty}`,
    title: 'Why it happened',
    difficulty,
    domain: 'history',
    skills: { logic: 0.4, knowledge: 0.35, problemSolving: 0.25 },
    parMs: 55_000,
    mount: choicePuzzle({
      instruction: 'Which explanation fits best?',
      text: item.text,
      options: shuffle(item.options),
      correctId: 'right',
      allowRetry: difficulty <= 2,
      explain: item.explain,
    }),
  };
}

/* ========================================================= LANGUAGE ======= */

const FIRST_WORDS = [
  { id: 'cat', word: 'CAT', char: '🐱' },
  { id: 'sun', word: 'SUN', char: '☀️' },
  { id: 'bus', word: 'BUS', char: '🚌' },
  { id: 'cup', word: 'CUP', char: '🥤' },
];

/** Very first reading: three-letter words matched to pictures. */
export function firstWordsCard(difficulty: Difficulty): PuzzleCard {
  const chosen = shuffle(FIRST_WORDS).slice(0, Math.min(FIRST_WORDS.length, 1 + difficulty));

  return {
    id: `lang-first-${difficulty}`,
    title: 'Word and picture',
    difficulty,
    domain: 'language',
    skills: { knowledge: 0.5, attention: 0.3, memory: 0.2 },
    parMs: chosen.length * 9000,
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

const RHYMES = [
  { stem: 'CAT', right: 'HAT', wrong: ['DOG', 'CUP'] },
  { stem: 'MOON', right: 'SPOON', wrong: ['STAR', 'MILK'] },
  { stem: 'CAKE', right: 'LAKE', wrong: ['BREAD', 'CARD'] },
  { stem: 'TREE', right: 'BEE', wrong: ['LEAF', 'TRAY'] },
];

export function rhymeCard(difficulty: Difficulty): PuzzleCard {
  const item = RHYMES[Math.floor(Math.random() * RHYMES.length)];
  if (!item) throw new Error('rhyme pool empty');

  return {
    id: `lang-rhyme-${difficulty}`,
    title: 'Sounds the same',
    difficulty,
    domain: 'language',
    skills: { patternRecognition: 0.4, knowledge: 0.4, attention: 0.2 },
    parMs: 22_000,
    mount: choicePuzzle({
      instruction: `Which word rhymes with ${item.stem}?`,
      options: shuffle([
        { id: 'right', label: item.right, visual: { type: 'text' as const, text: item.right } },
        ...item.wrong.map((word) => ({ id: word, label: word, visual: { type: 'text' as const, text: word } })),
      ]),
      correctId: 'right',
      allowRetry: true,
      showLabels: false,
      explain: `${item.stem} and ${item.right} end with the same sound.`,
    }),
  };
}

const SENTENCES = [
  { words: ['The', 'dog', 'chased', 'the', 'ball'], hint: 'Make a sentence that makes sense.' },
  { words: ['We', 'planted', 'seeds', 'in', 'spring'], hint: 'Make a sentence that makes sense.' },
  { words: ['Rain', 'filled', 'the', 'empty', 'bucket'], hint: 'Make a sentence that makes sense.' },
];

export function sentenceOrderCard(difficulty: Difficulty): PuzzleCard {
  const item = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
  if (!item) throw new Error('sentence pool empty');
  const words = difficulty <= 2 ? item.words.slice(0, 4) : item.words;

  return {
    id: `lang-sentence-${difficulty}`,
    title: 'Build the sentence',
    difficulty,
    domain: 'language',
    skills: { knowledge: 0.35, logic: 0.3, planning: 0.35 },
    parMs: words.length * 8000,
    mount: sequencePuzzle({
      instruction: item.hint,
      items: shuffle(words).map((word, index) => ({
        id: `${word}-${index}`,
        label: word,
        visual: { type: 'text', text: word },
      })),
      // Duplicate words are matched positionally, so ids carry their index.
      solution: words.map((word) => {
        const shuffledIds = words.map((w, i) => `${w}-${i}`);
        return shuffledIds[words.indexOf(word)] as string;
      }),
      fromLabel: 'first word',
      toLabel: 'last word',
    }),
  };
}

const PASSAGES = [
  {
    text:
      'The lighthouse keeper wrote in her log every evening. On the night of the storm she wrote only two words: "lamp held". ' +
      'In the morning three fishing boats were tied up safely in the harbour, and their crews came to thank her.',
    question: 'What do the two words most likely mean?',
    options: [
      { id: 'right', label: 'The light stayed lit through the storm' },
      { id: 'a', label: 'She repaired the lamp the next morning' },
      { id: 'b', label: 'She could not find the lamp' },
    ],
    explain: '"Lamp held" plus boats arriving safely points to the light staying on all night.',
  },
  {
    text:
      'Tomas always walked the long way to school, past the bakery. He never bought anything. He said the smell was enough, ' +
      'and besides, the baker waved at him every single morning.',
    question: 'Why does Tomas most likely take the longer route?',
    options: [
      { id: 'right', label: 'The walk gives him something he enjoys and someone who greets him' },
      { id: 'a', label: 'It is the only route to the school' },
      { id: 'b', label: 'He is saving money on bread' },
    ],
    explain: 'The passage stresses the smell and the wave, not distance or cost, so the appeal is the experience.',
  },
];

export function comprehensionCard(difficulty: Difficulty): PuzzleCard {
  const item = PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
  if (!item) throw new Error('passage pool empty');

  return {
    id: `lang-read-${difficulty}`,
    title: 'Read and infer',
    difficulty,
    domain: 'language',
    skills: { knowledge: 0.3, logic: 0.35, memory: 0.35 },
    parMs: 65_000,
    mount: choicePuzzle({
      instruction: item.question,
      text: item.text,
      options: shuffle(item.options),
      correctId: 'right',
      allowRetry: difficulty <= 2,
      explain: item.explain,
    }),
  };
}

const CONTEXT = [
  {
    text: 'The path was so overgrown that we had to hack our way through the dense scrub for an hour.',
    question: 'In this sentence, "dense" most nearly means:',
    options: [
      { id: 'right', label: 'Thickly packed together' },
      { id: 'a', label: 'Slow to understand' },
      { id: 'b', label: 'Very heavy' },
    ],
    explain: 'The clue is "overgrown" and having to cut through, so it describes thick growth.',
  },
  {
    text: 'Her argument was compelling: by the end, even those who had come to disagree were nodding.',
    question: '"Compelling" here most nearly means:',
    options: [
      { id: 'right', label: 'Convincing' },
      { id: 'a', label: 'Forced by law' },
      { id: 'b', label: 'Extremely long' },
    ],
    explain: 'Opponents ended up agreeing, so the argument persuaded them.',
  },
];

export function contextMeaningCard(difficulty: Difficulty): PuzzleCard {
  const item = CONTEXT[Math.floor(Math.random() * CONTEXT.length)];
  if (!item) throw new Error('context pool empty');

  return {
    id: `lang-context-${difficulty}`,
    title: 'Meaning from context',
    difficulty,
    domain: 'language',
    skills: { knowledge: 0.4, logic: 0.4, attention: 0.2 },
    parMs: 45_000,
    mount: choicePuzzle({
      instruction: item.question,
      text: item.text,
      options: shuffle(item.options),
      correctId: 'right',
      explain: item.explain,
    }),
  };
}

const ANALOGIES = [
  { stem: 'Seed is to plant as egg is to:', right: 'Bird', wrong: ['Nest', 'Shell'], why: 'Both are the early stage that grows into the adult.' },
  { stem: 'Author is to book as composer is to:', right: 'Symphony', wrong: ['Orchestra', 'Concert hall'], why: 'Each pairs a maker with the work they create.' },
  { stem: 'Thermometer is to temperature as clock is to:', right: 'Time', wrong: ['Hour hand', 'Alarm'], why: 'Each pairs an instrument with the quantity it measures.' },
  { stem: 'Drought is to crops as rust is to:', right: 'Iron', wrong: ['Rain', 'Paint'], why: 'Each pairs a process with what it damages.' },
];

export function wordAnalogyCard(difficulty: Difficulty): PuzzleCard {
  const item = ANALOGIES[Math.floor(Math.random() * ANALOGIES.length)];
  if (!item) throw new Error('analogy pool empty');

  return {
    id: `lang-analogy-${difficulty}`,
    title: 'Complete the pair',
    difficulty,
    domain: 'language',
    skills: { logic: 0.4, patternRecognition: 0.35, knowledge: 0.25 },
    parMs: 40_000,
    mount: choicePuzzle({
      instruction: item.stem,
      options: shuffle([
        { id: 'right', label: item.right, visual: { type: 'text' as const, text: item.right } },
        ...item.wrong.map((word) => ({ id: word, label: word, visual: { type: 'text' as const, text: word } })),
      ]),
      correctId: 'right',
      showLabels: false,
      explain: item.why,
    }),
  };
}

const MOTIVES = [
  {
    text:
      'Mira had trained all season for the race. At the final bend the runner ahead of her stumbled and fell. ' +
      'Mira stopped, helped her up, and they finished together, last of all. Afterwards Mira said she would do it again.',
    question: 'What does Mira\'s choice reveal about what she values?',
    options: [
      { id: 'right', label: 'She values how she competes more than where she places' },
      { id: 'a', label: 'She had lost interest in the race' },
      { id: 'b', label: 'She did not understand the rules' },
    ],
    explain: 'She trained hard, so she wanted to do well; stopping anyway shows a value she rates above placing.',
  },
  {
    text:
      'The old cartographer kept redrawing the same coastline. Each version was more accurate than the last, and each one ' +
      'he burned. When asked why, he said the next map would be better still.',
    question: 'Which reading of his behaviour is best supported?',
    options: [
      { id: 'right', label: 'He is driven by improvement rather than by keeping his work' },
      { id: 'a', label: 'He dislikes coastlines' },
      { id: 'b', label: 'He wants nobody to travel' },
    ],
    explain: 'Each version improves and each is destroyed, so the pursuit matters to him more than the product.',
  },
];

export function motiveCard(difficulty: Difficulty): PuzzleCard {
  const item = MOTIVES[Math.floor(Math.random() * MOTIVES.length)];
  if (!item) throw new Error('motive pool empty');

  return {
    id: `lang-motive-${difficulty}`,
    title: 'Read the motive',
    difficulty,
    domain: 'language',
    skills: { logic: 0.35, knowledge: 0.25, problemSolving: 0.4 },
    parMs: 70_000,
    mount: choicePuzzle({
      instruction: item.question,
      text: item.text,
      options: shuffle(item.options),
      correctId: 'right',
      explain: item.explain,
    }),
  };
}

const NARRATIVE = {
  id: 'harbour',
  instruction: 'Put the story back into the order it happened.',
  steps: [
    { id: 'letter', label: 'A letter arrives with no sender', char: '✉️' },
    { id: 'map', label: 'Inside is half a harbour map', char: '🗺️' },
    { id: 'search', label: 'She searches the archive for the other half', char: '🔍' },
    { id: 'find', label: 'The halves match a wreck site', char: '⚓' },
    { id: 'dive', label: 'The dive proves the story true', char: '🤿' },
  ],
  explain: 'The letter starts it, the map raises the question, the search and match answer it, and the dive confirms it.',
};

export function narrativeOrderCard(difficulty: Difficulty): PuzzleCard {
  const steps = difficulty <= 3 ? NARRATIVE.steps.slice(0, 4) : NARRATIVE.steps;

  return {
    id: `lang-narrative-${difficulty}`,
    title: 'Order the story',
    difficulty,
    domain: 'language',
    skills: { logic: 0.3, planning: 0.35, memory: 0.35 },
    parMs: steps.length * 12_000,
    mount: sequencePuzzle({
      instruction: NARRATIVE.instruction,
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
      explain: NARRATIVE.explain,
    }),
  };
}

/* =============================================== NATURE AND SCIENCE ======= */

const BODY_AND_EARTH = [
  { id: 'living', label: 'Living things', items: [
    { id: 'fern', label: 'Fern', char: '🌿' },
    { id: 'beetle', label: 'Beetle', char: '🪲' },
  ] },
  { id: 'weather', label: 'Weather', items: [
    { id: 'storm', label: 'Thunderstorm', char: '⛈️' },
    { id: 'snow', label: 'Snowfall', char: '🌨️' },
  ] },
  { id: 'space', label: 'Space', items: [
    { id: 'planet', label: 'Planet', char: '🪐' },
    { id: 'comet', label: 'Comet', char: '☄️' },
  ] },
];

export function scienceSortCard(difficulty: Difficulty): PuzzleCard {
  const groups = BODY_AND_EARTH.slice(0, difficulty <= 2 ? 2 : 3);
  const each = difficulty >= 4 ? 2 : 1;
  const pieces: SortPiece[] = groups.flatMap((group) =>
    group.items.slice(0, each).map((item) => ({
      id: item.id,
      bucketId: group.id,
      label: item.label,
      visual: { type: 'icon' as const, char: item.char },
    })),
  );

  return {
    id: `sci-sort-${difficulty}`,
    title: 'Sort the world',
    difficulty,
    domain: 'nature',
    skills: { knowledge: 0.45, logic: 0.3, attention: 0.25 },
    parMs: pieces.length * 8000,
    mount: sortPuzzle({
      instruction: 'Put each one where it belongs.',
      pieces: shuffle(pieces),
      buckets: groups.map((group) => ({ id: group.id, label: group.label })),
      showBucketLabels: true,
    }),
  };
}

const CAUSE_EFFECT = [
  {
    text: 'A pond in a park is covered by thick weed. The fish begin to struggle. Which link explains it best?',
    options: [
      { id: 'right', label: 'The weed blocks light and uses up oxygen the fish need' },
      { id: 'a', label: 'Fish dislike the colour green' },
      { id: 'b', label: 'Weed makes water heavier' },
    ],
    explain: 'Dense weed shades the water and consumes oxygen, which leaves less for the fish.',
  },
  {
    text: 'A hillside is cleared of trees. The next winter, mud slides onto the road below. What is the most likely link?',
    options: [
      { id: 'right', label: 'Roots were holding the soil, and without them rain washes it away' },
      { id: 'a', label: 'Trees were physically blocking the road before' },
      { id: 'b', label: 'Removing trees makes rain heavier' },
    ],
    explain: 'Root systems bind soil; once removed, rainfall carries the loose soil downhill.',
  },
  {
    text: 'Bees disappear from an orchard and the apple harvest falls sharply. Why?',
    options: [
      { id: 'right', label: 'Fewer pollinators means fewer flowers become fruit' },
      { id: 'a', label: 'Bees were guarding the trees' },
      { id: 'b', label: 'Apples need bees to eat the pests' },
    ],
    explain: 'Apple flowers need pollen moved between them, and bees do most of that work.',
  },
];

export function causeEffectCard(difficulty: Difficulty): PuzzleCard {
  const item = CAUSE_EFFECT[Math.floor(Math.random() * CAUSE_EFFECT.length)];
  if (!item) throw new Error('cause/effect pool empty');

  return {
    id: `sci-cause-${difficulty}`,
    title: 'Cause and effect',
    difficulty,
    domain: 'nature',
    skills: { logic: 0.4, knowledge: 0.35, problemSolving: 0.25 },
    parMs: 50_000,
    mount: choicePuzzle({
      instruction: 'Which link explains what happened?',
      text: item.text,
      options: shuffle(item.options),
      correctId: 'right',
      allowRetry: difficulty <= 2,
      explain: item.explain,
    }),
  };
}

/* ======================================================== per age band ==== */

/**
 * Knowledge content added on top of each age group's cognitive set, so every
 * mode meets maths, nature/science, problem solving, language and history.
 */
export const KNOWLEDGE_BUILDERS: Record<AgeGroup, CardBuilder[]> = {
  '3-5': [firstWordsCard, oldOrNewCard],
  '6-8': [oldOrNewCard, rhymeCard, sentenceOrderCard, scienceSortCard, timelineCard],
  '9-12': [timelineCard, causeEffectCard, comprehensionCard, contextMeaningCard, scienceSortCard],
  '13-17': [timelineCard, historyReasonCard, wordAnalogyCard, comprehensionCard, causeEffectCard],
  '18+': [eraSortCard, historyReasonCard, motiveCard, narrativeOrderCard, wordAnalogyCard],
};
