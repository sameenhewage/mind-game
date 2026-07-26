import { ageGroupInfo, type AgeGroup } from '../game/types';
import { el } from './dom';

export interface GameScreenOptions {
  ageGroup: AgeGroup;
  onExit: () => void;
  onFinish: () => void;
}

/**
 * Structural chamber shell: one screen, one task. Puzzles mount into the game
 * area in a later phase; nothing here simulates gameplay or scoring.
 */
export function renderGameScreen({ ageGroup, onExit, onFinish }: GameScreenOptions): HTMLElement {
  const info = ageGroupInfo(ageGroup);

  const exit = el('button', { class: 'iconbtn', type: 'button', 'aria-label': 'Leave run' }, ['Leave']);
  exit.addEventListener('click', onExit);

  const finish = el('button', { class: 'btn btn--primary', type: 'button', text: 'Finish run' });
  finish.addEventListener('click', onFinish);

  return el('section', { class: 'view view--game', 'aria-labelledby': 'chamber-title' }, [
    el('header', { class: 'chamber__bar' }, [
      el('div', { class: 'chamber__id' }, [
        el('h1', { class: 'chamber__title', id: 'chamber-title', tabindex: '-1', 'data-screen-focus': true, text: 'Chamber' }),
        el('p', { class: 'chamber__mode', text: info.name }),
      ]),
      exit,
    ]),

    el('p', { class: 'chamber__instruction', text: 'The first puzzle chamber is not built yet.' }),

    el('div', { class: 'stage', 'data-game-area': true }, [
      el('p', { class: 'stage__empty', text: 'Game area' }),
    ]),

    el('footer', { class: 'chamber__foot' }, [
      el('p', { class: 'chamber__progress', text: 'Progress appears here' }),
      finish,
    ]),
  ]);
}
