import { ageGroupInfo, type AgeGroup } from '../game/types';
import { el } from './dom';

export interface HomeOptions {
  ageGroup: AgeGroup;
  onStartRun: () => void;
  onChangeAge: () => void;
}

export function renderHome({ ageGroup, onStartRun, onChangeAge }: HomeOptions): HTMLElement {
  const info = ageGroupInfo(ageGroup);

  const start = el('button', { class: 'btn btn--primary btn--xl', type: 'button' }, [
    el('span', { class: 'btn__label', text: 'Start Run' }),
    el('span', { class: 'btn__hint', text: 'A short set of puzzles' }),
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
      el('button', {
        class: 'btn btn--muted btn--xl',
        type: 'button',
        disabled: true,
        'aria-disabled': 'true',
      }, [
        el('span', { class: 'btn__label', text: 'Daily Vault' }),
        el('span', { class: 'btn__hint', text: 'Coming soon' }),
      ]),
    ]),
  ]);
}
