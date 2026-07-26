import { SKILL_LABEL, type SkillId, type Skills } from '../game/brain';
import { el } from './dom';

/** The four skills shown on the summary surfaces; all seven are still tracked. */
export const HEADLINE_SKILLS: SkillId[] = ['memory', 'logic', 'attention', 'problemSolving'];

export interface SkillPanelOptions {
  skills: Readonly<Skills>;
  ids?: SkillId[];
  /** Optional per-skill change to highlight after an attempt. */
  deltas?: Partial<Record<SkillId, number>> | undefined;
}

/**
 * Bars, not a score card. These describe MIND VAULT performance for the current
 * session only, which the caller states in the surrounding copy.
 */
export function renderSkillPanel({ skills, ids = HEADLINE_SKILLS, deltas }: SkillPanelOptions): HTMLElement {
  const list = el('ul', { class: 'skills' });

  for (const id of ids) {
    const value = Math.round(skills[id]);
    const delta = deltas?.[id] ?? 0;

    list.append(
      el('li', { class: 'skill' }, [
        el('span', { class: 'skill__head' }, [
          el('span', { class: 'skill__name', text: SKILL_LABEL[id] }),
          delta !== 0 &&
            el('span', {
              class: delta > 0 ? 'skill__delta skill__delta--up' : 'skill__delta skill__delta--down',
              text: delta > 0 ? `+${delta}` : String(delta),
            }),
        ]),
        el('span', {
          class: 'skill__bar',
          role: 'img',
          'aria-label': `${SKILL_LABEL[id]}: ${value} of 100 this session`,
        }, [
          el('span', { class: 'skill__fill', style: `transform: scaleX(${value / 100})` }),
        ]),
      ]),
    );
  }

  return list;
}
