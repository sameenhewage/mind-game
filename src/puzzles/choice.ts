/**
 * Choose / Reason.
 *
 * A short situation and 2-4 answers. Used for reasoning far more than recall:
 * the stem usually shows a pattern, a scene or a short original passage, and
 * the player works out which option follows from it.
 */

import type { PuzzleContext, PuzzleMount } from '../game/puzzle';
import { el } from '../ui/dom';
import { renderVisual, type Visual } from '../ui/visual';

export interface ChoiceOption {
  id: string;
  /** Accessible name and, when shown, the caption. */
  label: string;
  visual?: Visual;
}

export interface ChoiceSpec {
  instruction: string;
  /** Visual stem, e.g. a repeating pattern ending in a gap. */
  stem?: Visual[];
  /** Text stem, e.g. an original short passage or a situation. */
  text?: string;
  options: ChoiceOption[];
  correctId: string;
  /** Let the player try again after a wrong pick. On for young players. */
  allowRetry?: boolean;
  /** One line shown afterwards, so a wrong answer still teaches something. */
  explain?: string;
  /** Show option labels as text. Off for pre-readers. */
  showLabels?: boolean;
}

/** Shared option row, also used by the memory mechanic's recall step. */
export function renderOptions(
  options: ChoiceOption[],
  showLabels: boolean,
  onPick: (id: string, button: HTMLButtonElement) => void,
): HTMLElement {
  const row = el('div', {
    class: options.length > 3 ? 'options options--grid' : 'options',
    role: 'group',
  });

  for (const option of options) {
    const button = el(
      'button',
      { class: 'option', type: 'button', 'data-option-id': option.id, 'aria-label': option.label },
      [
        option.visual && renderVisual(option.visual),
        showLabels && el('span', { class: 'option__label', text: option.label }),
      ],
    );
    button.addEventListener('click', () => onPick(option.id, button));
    row.append(button);
  }

  return row;
}

export function choicePuzzle(spec: ChoiceSpec): PuzzleMount {
  return (ctx: PuzzleContext) => {
    const started = performance.now();
    let mistakes = 0;
    let finished = false;

    ctx.setInstruction(spec.instruction);
    ctx.setProgress(spec.allowRetry === true ? 'Pick an answer' : 'One answer only');

    const feedback = el('p', { class: 'feedback', role: 'status' });

    const finish = (solved: boolean) => {
      finished = true;
      if (spec.explain) feedback.textContent = spec.explain;
      window.setTimeout(
        () =>
          ctx.onDone({
            solved,
            mistakes,
            hintsUsed: 0,
            msElapsed: Math.round(performance.now() - started),
          }),
        ctx.reduceMotion ? 0 : spec.explain ? 1400 : 600,
      );
    };

    const optionRow = renderOptions(spec.options, spec.showLabels !== false, (id, button) => {
      if (finished) return;

      if (id === spec.correctId) {
        button.classList.add('is-right');
        ctx.setProgress('Correct');
        finish(true);
        return;
      }

      mistakes += 1;
      button.classList.add('is-wrong');

      if (spec.allowRetry === true) {
        // Gentle guidance: the wrong option steps aside instead of ending the turn.
        button.setAttribute('disabled', '');
        feedback.textContent = 'Not that one. Try another.';
        ctx.setProgress('Try again');
        return;
      }

      const right = optionRow.querySelector(`[data-option-id="${spec.correctId}"]`);
      right?.classList.add('is-right');
      ctx.setProgress('Answer shown');
      finish(false);
    });

    const board = el('div', { class: 'choice' }, [
      spec.text ? el('p', { class: 'choice__text', text: spec.text }) : null,
      spec.stem
        ? el(
            'div',
            { class: 'stem' },
            spec.stem.map((visual) => el('span', { class: 'stem__cell' }, [renderVisual(visual)])),
          )
        : null,
      optionRow,
      feedback,
    ]);

    ctx.area.replaceChildren(board);
    return () => {
      finished = true;
    };
  };
}
