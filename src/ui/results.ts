import type { AttemptResult } from '../game/puzzle';
import { el } from './dom';

export interface ResultsOptions {
  result: AttemptResult;
  onAgain: () => void;
  onHome: () => void;
}

function summary(result: AttemptResult): string {
  if (!result.solved) return 'Not sorted this time. Try the chamber again.';
  if (result.mistakes === 0) return 'Every piece went straight to the right place.';
  if (result.mistakes <= 2) return 'Sorted, with a couple of second tries.';
  return 'Sorted. A few pieces took some searching.';
}

export function renderResults({ result, onAgain, onHome }: ResultsOptions): HTMLElement {
  const again = el('button', { class: 'btn btn--primary btn--xl', type: 'button' }, [
    el('span', { class: 'btn__label', text: 'Play again' }),
  ]);
  again.addEventListener('click', onAgain);

  const home = el('button', { class: 'btn btn--ghost', type: 'button', text: 'Back to Home' });
  home.addEventListener('click', onHome);

  const seconds = Math.max(1, Math.round(result.msElapsed / 1000));

  return el('section', { class: 'view view--results', 'aria-labelledby': 'results-title' }, [
    el('header', { class: 'view__head' }, [
      el('p', { class: 'tag', text: 'Chamber cleared' }),
      el('h1', {
        class: 'view__title',
        id: 'results-title',
        tabindex: '-1',
        'data-screen-focus': true,
        text: result.solved ? 'Well sorted' : 'Chamber closed',
      }),
      el('p', { class: 'view__sub', text: summary(result) }),
    ]),

    el('dl', { class: 'stats' }, [
      el('div', { class: 'stat' }, [
        el('dt', { class: 'stat__key', text: 'Time' }),
        el('dd', { class: 'stat__val', text: `${seconds}s` }),
      ]),
      el('div', { class: 'stat' }, [
        el('dt', { class: 'stat__key', text: 'Second tries' }),
        el('dd', { class: 'stat__val', text: String(result.mistakes) }),
      ]),
    ]),

    el('div', { class: 'actions' }, [again, home]),
  ]);
}
