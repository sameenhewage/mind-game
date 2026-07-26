import type { AttemptOutcome, Skills } from '../game/brain';
import type { AttemptResult, PuzzleCard } from '../game/puzzle';
import { runDepth, runTotal, type RunState, type VaultKey } from '../game/run';
import { el, pips } from './dom';
import { renderSkillPanel } from './skills';

function attemptLine(result: AttemptResult): string {
  if (!result.solved) return 'Not solved this time. The answer was shown.';
  if (result.mistakes === 0) return 'Solved first time.';
  if (result.mistakes <= 2) return 'Solved, with a couple of second tries.';
  return 'Solved the long way round.';
}

export interface ChamberClearOptions {
  run: RunState;
  card: PuzzleCard;
  result: AttemptResult;
  outcome: AttemptOutcome;
  /** Awarded for clearing this chamber; null when the chamber was not solved. */
  key: VaultKey | null;
  onNext: () => void;
  onLeave: () => void;
}

/**
 * Between chambers. The key is shown large, with an explicit warning that the
 * vault will ask about it, so the final challenge tests attention rather than
 * ambushing the player.
 */
export function renderChamberClear({
  run,
  card,
  result,
  outcome,
  key,
  onNext,
  onLeave,
}: ChamberClearOptions): HTMLElement {
  const last = run.cleared >= run.shape.chambers;

  const next = el('button', { class: 'btn btn--primary btn--xl', type: 'button' }, [
    el('span', { class: 'btn__label', text: last ? 'Enter the Final Vault' : 'Next chamber' }),
    el('span', {
      class: 'btn__hint',
      text: last ? 'One challenge left' : `Chamber ${run.cleared + 1} of ${run.shape.chambers}`,
    }),
  ]);
  next.addEventListener('click', onNext);

  const leave = el('button', { class: 'btn btn--ghost', type: 'button', text: 'Leave the run' });
  leave.addEventListener('click', onLeave);

  return el('section', { class: 'view view--clear', 'aria-labelledby': 'clear-title' }, [
    el('header', { class: 'view__head' }, [
      el('p', { class: 'tag', text: `${card.title} · level ${card.difficulty}` }),
      el('h1', {
        class: 'view__title',
        id: 'clear-title',
        tabindex: '-1',
        'data-screen-focus': true,
        text: key ? 'Key recovered' : 'Chamber closed',
      }),
      el('p', { class: 'view__sub', text: attemptLine(result) }),
    ]),

    key
      ? el('div', { class: 'keycard' }, [
          el('span', { class: 'keycard__symbol', text: key.symbol }),
          el('span', { class: 'keycard__number', text: String(key.number) }),
          el('p', { class: 'keycard__warn', text: 'Remember this key. The Final Vault will ask.' }),
        ])
      : el('p', { class: 'note', text: 'No key from that chamber. Keep going.' }),

    el('div', { class: 'runbar' }, [
      pips(run.cleared, run.shape.chambers, `${run.cleared} of ${run.shape.chambers} chambers cleared`),
      el('span', { class: 'runbar__text', text: `Level ${outcome.difficulty}` }),
    ]),

    el('div', { class: 'actions' }, [next, leave]),
  ]);
}

export interface RunSummaryOptions {
  run: RunState;
  skills: Readonly<Skills>;
  /** Deepest run reached in this session, for a replay target. */
  bestDepth: number;
  onAgain: () => void;
  onHome: () => void;
}

function summaryTitle(run: RunState): string {
  if (run.finalResult?.solved) return 'Vault open';
  if (run.cleared >= run.shape.chambers) return 'The vault held';
  return 'Run ended';
}

function summaryLine(run: RunState): string {
  if (run.finalResult?.solved) {
    return run.results.every((result) => result.solved && result.mistakes === 0)
      ? 'Every chamber first time, and the vault opened.'
      : 'The keys were where you left them. The vault opened.';
  }
  if (run.cleared >= run.shape.chambers) {
    return 'Every chamber cleared, but the keys slipped. The vault stays shut.';
  }
  return 'The run stopped early. Every chamber is solvable, so try again.';
}

export function renderRunSummary({
  run,
  skills,
  bestDepth,
  onAgain,
  onHome,
}: RunSummaryOptions): HTMLElement {
  const again = el('button', { class: 'btn btn--primary btn--xl', type: 'button' }, [
    el('span', { class: 'btn__label', text: 'Run it again' }),
    el('span', { class: 'btn__hint', text: 'A new set of chambers and keys' }),
  ]);
  again.addEventListener('click', onAgain);

  const home = el('button', { class: 'btn btn--ghost', type: 'button', text: 'Back to Home' });
  home.addEventListener('click', onHome);

  const solved = run.results.filter((result) => result.solved).length;
  const total = runTotal(run);
  const depth = runDepth(run);
  const seconds = Math.round(
    [...run.results, ...(run.finalResult ? [run.finalResult] : [])].reduce(
      (sum, result) => sum + result.msElapsed,
      0,
    ) / 1000,
  );

  return el('section', { class: 'view view--results', 'aria-labelledby': 'summary-title' }, [
    el('header', { class: 'view__head' }, [
      el('p', { class: 'tag', text: 'Vault run' }),
      el('h1', {
        class: 'view__title',
        id: 'summary-title',
        tabindex: '-1',
        'data-screen-focus': true,
        text: summaryTitle(run),
      }),
      el('p', { class: 'view__sub', text: summaryLine(run) }),
    ]),

    el('dl', { class: 'stats' }, [
      el('div', { class: 'stat' }, [
        el('dt', { class: 'stat__key', text: 'Depth' }),
        el('dd', { class: 'stat__val', text: `${depth}/${total}` }),
      ]),
      el('div', { class: 'stat' }, [
        el('dt', { class: 'stat__key', text: 'Chambers' }),
        el('dd', { class: 'stat__val', text: `${solved}/${run.shape.chambers}` }),
      ]),
      el('div', { class: 'stat' }, [
        el('dt', { class: 'stat__key', text: 'Time' }),
        el('dd', { class: 'stat__val', text: `${seconds}s` }),
      ]),
    ]),

    el('p', {
      class: 'note',
      text:
        depth >= bestDepth
          ? `Deepest run this session: ${depth} of ${total}.`
          : `Your deepest this session is still ${bestDepth} of ${total}.`,
    }),

    renderSkillPanel({ skills }),
    el('p', { class: 'note', text: 'Session scores only. Reloading starts fresh.' }),

    el('div', { class: 'actions' }, [again, home]),
  ]);
}
