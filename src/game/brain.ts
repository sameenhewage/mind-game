/**
 * Session brain engine.
 *
 * Deterministic, explainable arithmetic over five signals: solved, mistakes,
 * hints, pace and the difficulty that was attempted. No machine learning, no
 * opaque adaptation.
 *
 * These values describe performance inside MIND VAULT only. They are never an
 * IQ, an intelligence estimate, a mental age or any kind of assessment.
 *
 * State lives for the current session. Nothing here touches storage: reloading
 * the page legitimately starts a fresh session in this milestone.
 *
 * Only type imports are used, so this module can be executed directly by
 * `node --test` without a bundler.
 */

import type { AttemptResult } from './puzzle';
import type { AgeGroup } from './types';

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export const SKILL_IDS = [
  'memory',
  'attention',
  'logic',
  'problemSolving',
  'patternRecognition',
  'planning',
  'knowledge',
] as const;

export type SkillId = (typeof SKILL_IDS)[number];

/** Player-facing names. Deliberately game terms, not cognitive diagnoses. */
export const SKILL_LABEL: Record<SkillId, string> = {
  memory: 'Memory',
  attention: 'Focus',
  logic: 'Logic',
  problemSolving: 'Problem Solving',
  patternRecognition: 'Patterns',
  planning: 'Planning',
  knowledge: 'Knowledge',
};

/** Which skills a puzzle exercises. Weights should total roughly 1. */
export type SkillWeights = Partial<Record<SkillId, number>>;

export type Skills = Record<SkillId, number>;

/** Age sets where difficulty starts and how far performance may move it. */
interface Envelope {
  start: Difficulty;
  min: Difficulty;
  max: Difficulty;
}

const ENVELOPE: Record<AgeGroup, Envelope> = {
  '3-5': { start: 1, min: 1, max: 3 },
  '6-8': { start: 1, min: 1, max: 4 },
  '9-12': { start: 2, min: 1, max: 5 },
  '13-17': { start: 3, min: 2, max: 5 },
  '18+': { start: 3, min: 2, max: 5 },
};

/**
 * Skills start low and fill as the session goes on, so early play shows real
 * movement. This is session progress, not a verdict on the player: a fresh
 * session always starts here regardless of who is playing.
 */
const START_SKILL = 25;
/** Fraction of the gap to the target a fully weighted skill closes per attempt. */
const LEARN_RATE = 0.6;
/** Consecutive strong attempts required before difficulty rises. */
const RAISE_AFTER = 3;
/** Consecutive weak attempts required before difficulty eases. */
const LOWER_AFTER = 2;
const STRONG = 0.8;
const WEAK = 0.35;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function envelopeFor(ageGroup: AgeGroup): Envelope {
  return ENVELOPE[ageGroup];
}

export interface AttemptMeta {
  difficulty: Difficulty;
  skills: SkillWeights;
  /** Time a competent player of this age would need. Pacing only, never a timer. */
  parMs: number;
}

/**
 * How well one attempt went, 0..1.
 *
 * Solving it at all carries most of the credit; mistakes cost the most, hints
 * a little less, and pace only trims the edges so slow-but-thoughtful play is
 * never punished hard. Young players are not put under time pressure because
 * their content uses generous par times.
 */
export function attemptQuality(result: AttemptResult, parMs: number): number {
  if (!result.solved) return 0;

  let quality = 1;
  quality -= Math.min(0.6, result.mistakes * 0.15);
  quality -= Math.min(0.3, result.hintsUsed * 0.15);

  const pace = parMs > 0 ? result.msElapsed / parMs : 1;
  if (pace > 1) quality -= Math.min(0.2, (pace - 1) * 0.1);

  return clamp(quality, 0, 1);
}

/**
 * Where a skill should head after this attempt. Clearing a hard puzzle aims
 * higher than clearing an easy one, so a player who only does level 1 work
 * settles around the middle instead of reaching the top.
 */
export function skillTarget(quality: number, difficulty: Difficulty): number {
  const ceiling = 40 + difficulty * 12;
  return quality * ceiling;
}

export interface AttemptOutcome {
  quality: number;
  /** Difficulty to use for the next puzzle. */
  difficulty: Difficulty;
  difficultyDelta: -1 | 0 | 1;
  /** Rounded change per skill, for showing the player what moved. */
  deltas: Partial<Record<SkillId, number>>;
}

export interface Brain {
  readonly skills: Readonly<Skills>;
  readonly difficulty: Difficulty;
  readonly attempts: number;
  /** True once there is at least one attempt worth showing. */
  readonly hasHistory: boolean;
  record: (result: AttemptResult, meta: AttemptMeta) => AttemptOutcome;
}

export function createBrain(ageGroup: AgeGroup): Brain {
  const envelope = envelopeFor(ageGroup);
  const skills = Object.fromEntries(SKILL_IDS.map((id) => [id, START_SKILL])) as Skills;

  let difficulty: Difficulty = envelope.start;
  let attempts = 0;
  /** Recent qualities since the last difficulty change. */
  let window: number[] = [];

  function adjustDifficulty(): -1 | 0 | 1 {
    const strongRun = window.length >= RAISE_AFTER && window.slice(-RAISE_AFTER).every((q) => q >= STRONG);
    if (strongRun && difficulty < envelope.max) {
      difficulty = (difficulty + 1) as Difficulty;
      window = [];
      return 1;
    }
    if (strongRun) {
      window = [];
      return 0;
    }

    const weakRun = window.length >= LOWER_AFTER && window.slice(-LOWER_AFTER).every((q) => q <= WEAK);
    if (weakRun && difficulty > envelope.min) {
      difficulty = (difficulty - 1) as Difficulty;
      window = [];
      return -1;
    }
    if (weakRun) {
      window = [];
      return 0;
    }

    return 0;
  }

  return {
    get skills() {
      return skills;
    },
    get difficulty() {
      return difficulty;
    },
    get attempts() {
      return attempts;
    },
    get hasHistory() {
      return attempts > 0;
    },
    record(result, meta) {
      const quality = attemptQuality(result, meta.parMs);
      const target = skillTarget(quality, meta.difficulty);
      const deltas: Partial<Record<SkillId, number>> = {};

      for (const [id, weight] of Object.entries(meta.skills) as [SkillId, number][]) {
        if (!weight) continue;
        const before = skills[id];
        const after = clamp(before + (target - before) * LEARN_RATE * weight, 0, 100);
        skills[id] = after;
        deltas[id] = Math.round(after) - Math.round(before);
      }

      attempts += 1;
      window.push(quality);
      const difficultyDelta = adjustDifficulty();

      return { quality, difficulty, difficultyDelta, deltas };
    },
  };
}
