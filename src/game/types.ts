/** Core shared types. Age groups are a closed set; screens are a closed set. */

export type AgeGroup = '3-5' | '6-8' | '9-12' | '13-17' | '18+';

export type Screen = 'age-select' | 'home' | 'game' | 'results';

/** Presentation data for each age group. Age changes tone, not the application. */
export interface AgeGroupInfo {
  id: AgeGroup;
  /** Player-facing mode name. Never an intelligence label. */
  name: string;
  ageLabel: string;
  /** `data-theme` value on <html>; the core UI is shared. */
  theme: string;
  /** One short line, readable by a parent or an older player. */
  blurb: string;
}

export const AGE_GROUPS: readonly AgeGroupInfo[] = [
  {
    id: '3-5',
    name: 'Little Explorer',
    ageLabel: '3 - 5',
    theme: 'little-explorer',
    blurb: 'Shapes, colours, counting and matching. Big buttons, no timers.',
  },
  {
    id: '6-8',
    name: 'Young Explorer',
    ageLabel: '6 - 8',
    theme: 'young-explorer',
    blurb: 'Numbers, patterns, nature and first logic puzzles.',
  },
  {
    id: '9-12',
    name: 'Young Thinker',
    ageLabel: '9 - 12',
    theme: 'young-thinker',
    blurb: 'Reasoning, deduction and multi-step problems.',
  },
  {
    id: '13-17',
    name: 'Challenger',
    ageLabel: '13 - 17',
    theme: 'challenger',
    blurb: 'Multi-rule logic, planning and optimisation.',
  },
  {
    id: '18+',
    name: 'Mind Vault',
    ageLabel: '18+',
    theme: 'mind-vault',
    blurb: 'The full vault: memory, deduction, planning, abstract rules.',
  },
];

export function ageGroupInfo(id: AgeGroup): AgeGroupInfo {
  const found = AGE_GROUPS.find((group) => group.id === id);
  if (!found) {
    throw new Error(`Unknown age group: ${id}`);
  }
  return found;
}

export function isAgeGroup(value: unknown): value is AgeGroup {
  return AGE_GROUPS.some((group) => group.id === value);
}
