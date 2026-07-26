/**
 * Memory.
 *
 * Study a small set, lose sight of it, then answer something about it. The
 * study window is shown as a filling bar rather than a countdown clock, so a
 * young player sees "look now" instead of "hurry up".
 */

import type { PuzzleContext, PuzzleMount } from '../game/puzzle';
import { el } from '../ui/dom';
import { renderVisual, type Visual } from '../ui/visual';
import { renderOptions, type ChoiceOption } from './choice';

export interface MemoryItem {
  id: string;
  label: string;
  visual: Visual;
}

export interface MemorySpec {
  /** Shown during the study step. */
  studyInstruction: string;
  /** Shown during the recall step. */
  question: string;
  items: MemoryItem[];
  /** How long the set stays visible. */
  showMs: number;
  /**
   * Item ids still on display during recall. Omit to hide everything.
   * Used for "which one is missing" tasks.
   */
  recallShow?: string[];
  /** Answer choices; defaults to every item. */
  options?: ChoiceOption[];
  correctId: string;
  allowRetry?: boolean;
  showLabels?: boolean;
  explain?: string;
}

export function memoryPuzzle(spec: MemorySpec): PuzzleMount {
  return (ctx: PuzzleContext) => {
    const started = performance.now();
    let mistakes = 0;
    let finished = false;
    let timer = 0;

    const showLabels = spec.showLabels === true;
    const board = el('div', { class: 'memory' });
    ctx.area.replaceChildren(board);

    const itemRow = (items: MemoryItem[]) =>
      el(
        'div',
        { class: items.length > 4 ? 'memory__set memory__set--grid' : 'memory__set' },
        items.map((item) =>
          el('span', { class: 'memory__item', 'aria-label': item.label }, [
            renderVisual(item.visual),
            showLabels && el('span', { class: 'option__label', text: item.label }),
          ]),
        ),
      );

    const recall = () => {
      if (finished) return;
      ctx.setInstruction(spec.question);
      ctx.setProgress(spec.allowRetry === true ? 'Pick an answer' : 'One answer only');

      const feedback = el('p', { class: 'feedback', role: 'status' });
      const shown = spec.recallShow
        ? spec.items.filter((item) => spec.recallShow?.includes(item.id))
        : [];

      const options: ChoiceOption[] =
        spec.options ??
        spec.items.map((item) => ({ id: item.id, label: item.label, visual: item.visual }));

      const finish = (solved: boolean) => {
        finished = true;
        if (spec.explain) feedback.textContent = spec.explain;
        timer = window.setTimeout(
          () =>
            ctx.onDone({
              solved,
              mistakes,
              hintsUsed: 0,
              msElapsed: Math.round(performance.now() - started),
            }),
          ctx.reduceMotion ? 0 : spec.explain ? 1200 : 600,
        );
      };

      const row = renderOptions(options, showLabels, (id, button) => {
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
          button.setAttribute('disabled', '');
          feedback.textContent = 'Not that one. Have another look in your head.';
          return;
        }
        row.querySelector(`[data-option-id="${spec.correctId}"]`)?.classList.add('is-right');
        finish(false);
      });

      board.replaceChildren(
        ...(shown.length > 0 ? [itemRow(shown)] : []),
        el('div', { class: 'memory__divider', 'aria-hidden': 'true' }),
        row,
        feedback,
      );
    };

    // Study step. With reduced motion the draining bar would empty instantly and
    // misreport the time left, so it is replaced by plain words.
    ctx.setInstruction(spec.studyInstruction);
    ctx.setProgress('Look carefully');
    const meter = ctx.reduceMotion
      ? el('p', { class: 'feedback', text: 'These will be hidden in a moment.' })
      : el('span', { class: 'lookbar', 'aria-hidden': 'true' }, [
          el('span', { class: 'lookbar__fill', style: `animation-duration: ${spec.showMs}ms` }),
        ]);
    board.replaceChildren(itemRow(spec.items), meter);

    // The study window itself is never shortened: reduced motion is about
    // animation, not about giving someone less time to look.
    timer = window.setTimeout(recall, spec.showMs);

    return () => {
      finished = true;
      window.clearTimeout(timer);
    };
  };
}
