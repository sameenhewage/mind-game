import type { Brain } from '../game/brain';
import { ageGroupInfo, type AgeGroup } from '../game/types';
import { el, pips } from './dom';
import { renderSkillPanel } from './skills';

export interface HomeOptions {
  ageGroup: AgeGroup;
  brain: Brain;
  onStartRun: () => void;
  onChangeAge: () => void;
}

export function renderHome({ ageGroup, brain, onStartRun, onChangeAge }: HomeOptions): HTMLElement {
  const info = ageGroupInfo(ageGroup);

  const start = el('button', { class: 'btn btn--primary btn--xl', type: 'button' }, [
    el('span', { class: 'btn__label', text: brain.hasHistory ? 'Next chamber' : 'Start Run' }),
    el('span', {
      class: 'btn__hint',
      text: brain.hasHistory ? `Level ${brain.difficulty}` : 'A short set of puzzles',
    }),
  ]);
  start.addEventListener('click', onStartRun);

  const change = el('button', {
    class: 'chip__action',
    type: 'button',
    text: 'Change',
    'aria-label': 'Change player mode',
  });
  change.addEventListener('click', onChangeAge);

  return el('section', { class: 'view view--home', 'aria-labelledby': 'home-title' }, [
    el('header', { class: 'view__head' }, [
      el('h1', { class: 'brand', id: 'home-title', tabindex: '-1', 'data-screen-focus': true }, [
        'Mind ',
        el('span', { class: 'brand__vault', text: 'Vault' }),
      ]),
      el('p', { class: 'view__sub', text: 'Short puzzles that train how you think.' }),
    ]),

    el('div', { class: 'chip' }, [
      el('span', { class: 'chip__text' }, [
        el('span', { class: 'chip__label', text: `Mode · ${info.ageLabel.replace(/\s/g, '')}` }),
        el('span', { class: 'chip__value', text: info.name }),
      ]),
      change,
    ]),

    el('div', { class: 'actions' }, [
      start,
      el(
        'button',
        { class: 'btn btn--muted btn--xl', type: 'button', disabled: true, 'aria-disabled': 'true' },
        [
          el('span', { class: 'btn__label', text: 'Daily Vault' }),
          el('span', { class: 'btn__hint', text: 'Coming soon' }),
        ],
      ),
    ]),

    brain.hasHistory
      ? el('section', { class: 'panel', 'aria-labelledby': 'session-title' }, [
          el('div', { class: 'panel__head' }, [
            el('h2', { class: 'panel__title', id: 'session-title', text: 'This session' }),
            el('span', { class: 'panel__meta' }, [
              el('span', { class: 'panel__level', text: `Level ${brain.difficulty}` }),
              pips(brain.difficulty, 5, `Difficulty ${brain.difficulty} of 5`),
            ]),
          ]),
          renderSkillPanel({ skills: brain.skills }),
          el('p', {
            class: 'note',
            text: `${brain.attempts} chamber${brain.attempts === 1 ? '' : 's'} played. Scores reset when you reload.`,
          }),
        ])
      : el('p', { class: 'note', text: 'Play a chamber to see how your session is going.' }),
  ]);
}
