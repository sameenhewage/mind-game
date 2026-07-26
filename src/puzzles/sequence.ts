/**
 * Sequence.
 *
 * Arrange items into the right order: numbers, story beats, life cycles,
 * historical events, or the steps of a plan. Ordering is checked only once every
 * slot is filled, so the player can think, place, and rethink - which is the
 * point of a planning task.
 *
 * The same pointer gesture as the other mechanics moves items between slots and
 * back to the tray, so nothing new has to be learned.
 */

import { createPickPlace } from '../game/drag';
import type { PuzzleContext, PuzzleMount } from '../game/puzzle';
import { el } from '../ui/dom';
import { renderVisual, type Visual } from '../ui/visual';

export interface SequenceItem {
  id: string;
  label: string;
  visual: Visual;
}

export interface SequenceSpec {
  instruction: string;
  /** Constraints or context the player needs in order to work out the order. */
  text?: string;
  /** Presentation order in the tray; shuffle before passing in. */
  items: SequenceItem[];
  /** Item ids in the correct order. */
  solution: string[];
  /** Caption under the slot row, e.g. "first" -> "last". */
  fromLabel?: string;
  toLabel?: string;
  showLabels?: boolean;
  /** Full-order checks allowed before the answer is shown. */
  attempts?: number;
  explain?: string;
}

const TRAY_ID = 'tray';

export function sequencePuzzle(spec: SequenceSpec): PuzzleMount {
  return (ctx: PuzzleContext) => {
    const started = performance.now();
    const maxAttempts = spec.attempts ?? 3;
    let mistakes = 0;
    let checks = 0;
    let finished = false;
    let timer = 0;

    ctx.setInstruction(spec.instruction);

    const tray = el('div', {
      class: 'tray tray--seq',
      'data-bucket-id': TRAY_ID,
      'data-bucket-mouth': true,
      'aria-label': 'Unplaced items',
    });

    for (const item of spec.items) {
      tray.append(
        el(
          'button',
          {
            class: 'piece piece--card',
            type: 'button',
            'data-piece-id': item.id,
            'aria-label': item.label,
            'aria-pressed': 'false',
          },
          [
            renderVisual(item.visual),
            spec.showLabels === true && el('span', { class: 'piece__label', text: item.label }),
          ],
        ),
      );
    }

    const slotRow = el('ol', { class: 'slots' });
    const slots: HTMLElement[] = [];
    spec.solution.forEach((_, index) => {
      const hole = el('span', {
        class: 'slot__hole',
        'data-bucket-mouth': true,
      });
      const slot = el(
        'li',
        {
          class: 'slot',
          'data-bucket-id': `slot-${index}`,
          'data-slot-index': String(index),
          role: 'button',
          tabindex: '0',
          'aria-label': `Position ${index + 1} of ${spec.solution.length}, empty`,
        },
        [el('span', { class: 'slot__num', text: String(index + 1) }), hole],
      );
      slot.addEventListener('keydown', (event) => {
        // role="button" does not bring keyboard activation with it.
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        slot.click();
      });
      slots.push(slot);
      slotRow.append(slot);
    });

    const feedback = el('p', { class: 'feedback', role: 'status' });

    const board = el('div', { class: 'sequence' }, [
      spec.text ? el('p', { class: 'choice__text', text: spec.text }) : null,
      tray,
      el('div', { class: 'sequence__track' }, [
        slotRow,
        spec.fromLabel || spec.toLabel
          ? el('div', { class: 'sequence__ends' }, [
              el('span', { text: spec.fromLabel ?? '' }),
              el('span', { text: spec.toLabel ?? '' }),
            ])
          : null,
      ]),
      feedback,
    ]);
    ctx.area.replaceChildren(board);

    const holeOf = (slot: HTMLElement) => slot.querySelector<HTMLElement>('.slot__hole');
    const occupant = (slot: HTMLElement) => holeOf(slot)?.querySelector<HTMLElement>('[data-piece-id]');
    const filled = () => slots.every((slot) => occupant(slot) !== undefined && occupant(slot) !== null);
    const currentOrder = () => slots.map((slot) => occupant(slot)?.dataset.pieceId ?? '');

    const progress = () => {
      const placed = slots.filter((slot) => occupant(slot)).length;
      ctx.setProgress(`${placed} of ${slots.length} placed`);
      // Full slots stay targets, because dropping on one swaps the pieces.
      slots.forEach((slot, index) => {
        const sitting = occupant(slot);
        slot.classList.toggle('is-taken', Boolean(sitting));
        slot.setAttribute(
          'aria-label',
          `Position ${index + 1} of ${slots.length}: ${sitting?.getAttribute('aria-label') ?? 'empty'}`,
        );
      });
    };
    progress();

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
        ctx.reduceMotion ? 0 : spec.explain ? 1600 : 700,
      );
    };

    const check = () => {
      checks += 1;
      const order = currentOrder();
      const wrong = slots.filter((_slot, index) => order[index] !== spec.solution[index]);

      if (wrong.length === 0) {
        board.classList.add('is-complete');
        ctx.setProgress('In order');
        finish(true);
        return;
      }

      mistakes += 1;
      for (const slot of wrong) {
        slot.classList.add('is-misplaced');
        window.setTimeout(() => slot.classList.remove('is-misplaced'), 700);
      }

      if (checks >= maxAttempts) {
        // Reveal the answer rather than leaving the player stuck.
        const byId = new Map(
          slots.flatMap((slot) => {
            const piece = occupant(slot);
            return piece ? [[piece.dataset.pieceId ?? '', piece] as const] : [];
          }),
        );
        spec.solution.forEach((id, index) => {
          const piece = byId.get(id);
          const hole = holeOf(slots[index] as HTMLElement);
          if (piece && hole) hole.append(piece);
        });
        ctx.setProgress('Answer shown');
        feedback.textContent = 'Here is the order.';
        finish(false);
        return;
      }

      feedback.textContent =
        wrong.length === slots.length
          ? 'Not in order yet. Try moving them around.'
          : `${slots.length - wrong.length} in the right place. Keep going.`;
    };

    const engine = createPickPlace({
      root: board,
      reduceMotion: ctx.reduceMotion,
      snap: 'settle',
      // Every slot accepts every item, and the tray always takes one back.
      // Ordering is judged once, when the row is full.
      isCorrect: () => true,
      onPlace: ({ piece, bucket, correct }) => {
        if (finished || !correct) return;

        const cameFrom = piece.parentElement;

        if (bucket.dataset.bucketId === TRAY_ID) {
          tray.append(piece);
        } else {
          const hole = holeOf(bucket);
          if (!hole) return;
          // Dropping onto a full slot swaps the two pieces, so a finished row can
          // still be rearranged without emptying it first.
          const sitting = hole.querySelector<HTMLElement>('[data-piece-id]');
          if (sitting && sitting !== piece && cameFrom) {
            cameFrom.append(sitting);
            sitting.style.transform = '';
          }
          hole.append(piece);
        }

        piece.style.transform = '';
        progress();

        if (filled()) check();
      },
    });

    return () => {
      finished = true;
      window.clearTimeout(timer);
      engine.destroy();
    };
  };
}
