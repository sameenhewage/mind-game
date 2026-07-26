import type { AttemptOutcome, Skills } from '../game/brain';
import type { AttemptResult, PuzzleCard } from '../game/puzzle';
import { el } from './dom';
import { renderSkillPanel } from './skills';

export interface ResultsOptions {
  card: PuzzleCard;
  result: AttemptResult;
  outcome: AttemptOutcome;
  skills: Readonly<Skills>;
  onAgain: () => void;
  onHome: () => void;
}

function headline(outcome: AttemptOutcome, result: AttemptResult): string {
  if (!result.solved) return 'Chamber closed';
  if (outcome.quality >= 0.95) return 'Clean run';
  if (outcome.quality >= 0.7) return 'Well sorted';
  return 'Chamber cleared';
}

function summary(result: AttemptResult): string {
  if (!result.solved) return 'Not finished this time. The same idea will come back.';
  if (result.mistakes === 0) return 'Every piece went straight to the right place.';
  if (result.mistakes <= 2) return 'Sorted, with a couple of second tries.';
  return 'Sorted. A few pieces took some searching.';
}

/** What the engine decided to do next, in plain words. */
function nextStep(outcome: AttemptOutcome): string {
  if (outcome.difficultyDelta > 0) return `Stepping up to level ${outcome.difficulty}`;
  if (outcome.difficultyDelta < 0) return `Easing to level ${outcome.difficulty}`;
  return `Staying at level ${outcome.difficulty}`;
}

export function renderResults({
  card,
  result,
  outcome,
  skills,
  onAgain,
  onHome,
}: ResultsOptions): HTMLElement {
  const again = el('button', { class: 'btn btn--primary btn--xl', type: 'button' }, [
    el('span', { class: 'btn__label', text: 'Next chamber' }),
    el('span', { class: 'btn__hint', text: `Level ${outcome.difficulty}` }),
  ]);
  again.addEventListener('click', onAgain);

  const home = el('button', { class: 'btn btn--ghost', type: 'button', text: 'Back to Home' });
  home.addEventListener('click', onHome);

  const seconds = Math.max(1, Math.round(result.msElapsed / 1000));

  return el('section', { class: 'view view--results', 'aria-labelledby': 'results-title' }, [
    el('header', { class: 'view__head' }, [
      el('p', { class: 'tag', text: `${card.title} · level ${card.difficulty}` }),
      el('h1', {
        class: 'view__title',
        id: 'results-title',
        tabindex: '-1',
        'data-screen-focus': true,
        text: headline(outcome, result),
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
      el('div', { class: 'stat' }, [
        el('dt', { class: 'stat__key', text: 'Next' }),
        el('dd', { class: 'stat__val stat__val--sm', text: `Level ${outcome.difficulty}` }),
      ]),
    ]),

    el('p', { class: 'note', text: nextStep(outcome) }),

    renderSkillPanel({ skills, deltas: outcome.deltas }),

    el('div', { class: 'actions' }, [again, home]),
  ]);
}
