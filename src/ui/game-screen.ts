import type { AttemptResult, PuzzleMount } from '../game/puzzle';
import { prefersReducedMotion } from '../game/puzzle';
import { ageGroupInfo, type AgeGroup } from '../game/types';
import { el } from './dom';

export interface GameScreenOptions {
  ageGroup: AgeGroup;
  /** Chamber heading, e.g. "Chamber 1". */
  title: string;
  mount: PuzzleMount;
  onExit: () => void;
  onDone: (result: AttemptResult) => void;
}

export interface GameScreenView {
  element: HTMLElement;
  /** Tear down puzzle listeners when the screen is replaced. */
  dispose: () => void;
}

/** One chamber: one task. The puzzle owns the game area, nothing else. */
export function renderGameScreen({
  ageGroup,
  title,
  mount,
  onExit,
  onDone,
}: GameScreenOptions): GameScreenView {
  const info = ageGroupInfo(ageGroup);

  const exit = el('button', { class: 'iconbtn', type: 'button', 'aria-label': 'Leave run', text: 'Leave' });
  exit.addEventListener('click', onExit);

  const instruction = el('p', { class: 'chamber__instruction' });
  const progress = el('p', { class: 'chamber__progress', role: 'status' });
  const area = el('div', { class: 'stage', 'data-game-area': true });

  const element = el('section', { class: 'view view--game', 'aria-labelledby': 'chamber-title' }, [
    el('header', { class: 'chamber__bar' }, [
      el('div', { class: 'chamber__id' }, [
        el('h1', {
          class: 'chamber__title',
          id: 'chamber-title',
          tabindex: '-1',
          'data-screen-focus': true,
          text: title,
        }),
        el('p', { class: 'chamber__mode', text: info.name }),
      ]),
      exit,
    ]),
    instruction,
    area,
    el('footer', { class: 'chamber__foot' }, [progress]),
  ]);

  let done = false;
  const cleanup = mount({
    area,
    reduceMotion: prefersReducedMotion(),
    setInstruction: (text) => {
      instruction.textContent = text;
    },
    setProgress: (text) => {
      progress.textContent = text;
    },
    onDone: (result) => {
      if (done) return;
      done = true;
      onDone(result);
    },
  });

  return { element, dispose: cleanup };
}
