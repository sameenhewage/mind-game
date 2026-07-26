import { el } from './dom';

export interface ResultsOptions {
  onHome: () => void;
}

export function renderResults({ onHome }: ResultsOptions): HTMLElement {
  const home = el('button', { class: 'btn btn--primary btn--xl', type: 'button', text: 'Back to Home' });
  home.addEventListener('click', onHome);

  return el('section', { class: 'view view--results', 'aria-labelledby': 'results-title' }, [
    el('header', { class: 'view__head' }, [
      el('p', { class: 'tag', text: 'Run complete' }),
      el('h1', { class: 'view__title', id: 'results-title', tabindex: '-1', 'data-screen-focus': true, text: 'Vault closed' }),
      el('p', { class: 'view__sub', text: 'Puzzle results and skill changes appear here once chambers exist.' }),
    ]),
    el('div', { class: 'actions' }, [home]),
  ]);
}
