import { AGE_GROUPS, type AgeGroup } from '../game/types';
import { el, pips } from './dom';

export interface AgeSelectOptions {
  current: AgeGroup | null;
  onSelect: (ageGroup: AgeGroup) => void;
  onCancel?: (() => void) | undefined;
}

/** Asks for an age group and nothing else. No name, no birth date, no account. */
export function renderAgeSelect({ current, onSelect, onCancel }: AgeSelectOptions): HTMLElement {
  const list = el('div', { class: 'modes' });

  AGE_GROUPS.forEach((group, index) => {
    const selected = group.id === current;
    const card = el(
      'button',
      {
        class: selected ? 'mode mode--current' : 'mode',
        type: 'button',
        'aria-pressed': selected ? 'true' : 'false',
      },
      [
        el('span', { class: 'mode__head' }, [
          el('span', { class: 'mode__name', text: group.name }),
          el('span', { class: 'mode__age', text: group.ageLabel }),
        ]),
        el('span', { class: 'mode__blurb', text: group.blurb }),
        el('span', { class: 'mode__meter' }, [
          pips(index + 1, AGE_GROUPS.length, `Challenge level ${index + 1} of ${AGE_GROUPS.length}`),
        ]),
      ],
    );
    card.addEventListener('click', () => onSelect(group.id));
    list.append(card);
  });

  const view = el('section', { class: 'view view--select', 'aria-labelledby': 'select-title' }, [
    el('header', { class: 'view__head' }, [
      el('p', { class: 'brand brand--sm' }, [
        'Mind ',
        el('span', { class: 'brand__vault', text: 'Vault' }),
      ]),
      el('h1', { class: 'view__title', id: 'select-title', tabindex: '-1', 'data-screen-focus': true, text: 'Who is playing?' }),
      el('p', {
        class: 'view__sub',
        text: 'Pick the closest age. Puzzles adjust from there, and you can change this any time.',
      }),
    ]),
    list,
    el('footer', { class: 'view__foot' }, [
      el('p', { class: 'note', text: 'No name, no email, no account. Age group only.' }),
      onCancel && el('button', { class: 'btn btn--ghost', type: 'button', text: 'Keep current mode' }),
    ]),
  ]);

  if (onCancel) {
    view.querySelector<HTMLButtonElement>('.view__foot .btn')?.addEventListener('click', onCancel);
  }

  return view;
}
