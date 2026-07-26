/**
 * Tiny bootstrap preferences only. The selected age group is the single stored
 * value; gameplay progress stays in memory for this milestone. Storage can throw
 * (private mode, disabled cookies, full quota) so every access is guarded and the
 * game keeps working without it.
 */

import { isAgeGroup, type AgeGroup } from './types';

const AGE_GROUP_KEY = 'mindvault.ageGroup';

export function readAgeGroup(): AgeGroup | null {
  try {
    const raw = localStorage.getItem(AGE_GROUP_KEY);
    return isAgeGroup(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function writeAgeGroup(ageGroup: AgeGroup): void {
  try {
    localStorage.setItem(AGE_GROUP_KEY, ageGroup);
  } catch {
    // Preference is optional; the session continues with the in-memory choice.
  }
}
