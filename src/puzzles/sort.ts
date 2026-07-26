/**
 * Sort Into Bucket.
 *
 * The core MIND VAULT interaction: move each piece to the bucket it belongs in.
 * Only the content changes between age groups - shapes, colours, sizes, counts
 * or categories all reuse this one engine.
 */

import { createPickPlace } from '../game/drag';
import type { PuzzleContext, PuzzleMount } from '../game/puzzle';
import { el } from '../ui/dom';
import { renderVisual, type Visual } from '../ui/visual';

export interface SortPiece {
  id: string;
  visual: Visual;
  /** Accessible name; also the fallback label under the piece. */
  label: string;
  bucketId: string;
}

export interface SortBucket {
  id: string;
  label: string;
  visual?: Visual;
}

export interface SortSpec {
  instruction: string;
  pieces: SortPiece[];
  buckets: SortBucket[];
  /** Show the piece label as text. Off for pre-readers. */
  showPieceLabels?: boolean;
  /** Show the bucket label as text. */
  showBucketLabels?: boolean;
  /**
   * `match` pairs each piece with one partner instead of filling a bucket. The
   * interaction is identical, so the same engine drives both.
   */
  variant?: 'buckets' | 'match';
  /**
   * Rule mutation: after `after` correct placements the sorting rule changes.
   * The player has to notice and adapt, which is the actual challenge.
   */
  ruleSwitch?: {
    after: number;
    instruction: string;
    bucketOf: (pieceId: string) => string;
  };
}

export function sortPuzzle(spec: SortSpec): PuzzleMount {
  return (ctx: PuzzleContext) => {
    const started = performance.now();
    let placed = 0;
    let mistakes = 0;
    let finished = false;

    const bucketOf = new Map(spec.pieces.map((piece) => [piece.id, piece.bucketId]));

    ctx.setInstruction(spec.instruction);
    const verb = spec.variant === 'match' ? 'matched' : 'sorted';
    const progress = () => ctx.setProgress(`${placed} of ${spec.pieces.length} ${verb}`);
    progress();

    const tray = el('div', {
      class: spec.pieces.length > 6 ? 'tray tray--wide' : 'tray',
      'data-tray': true,
    });
    for (const piece of spec.pieces) {
      const node = el(
        'button',
        {
          class: 'piece',
          type: 'button',
          'data-piece-id': piece.id,
          'aria-label': piece.label,
          'aria-pressed': 'false',
        },
        [renderVisual(piece.visual), spec.showPieceLabels === true && el('span', { class: 'piece__label', text: piece.label })],
      );
      tray.append(node);
    }

    const bucketRow = el('div', { class: 'buckets' });
    for (const bucket of spec.buckets) {
      const node = el(
        'button',
        {
          class: 'bucket',
          type: 'button',
          'data-bucket-id': bucket.id,
          'aria-label': `Put into ${bucket.label}`,
        },
        [
          el('span', { class: 'bucket__mouth', 'data-bucket-mouth': true }, [
            bucket.visual ? renderVisual(bucket.visual) : el('span', { class: 'bucket__hint', text: bucket.label }),
          ]),
          spec.showBucketLabels !== false && el('span', { class: 'bucket__label', text: bucket.label }),
          el('span', { class: 'bucket__slots', 'data-slots': true }),
        ],
      );
      bucketRow.append(node);
    }

    const board = el('div', {
      class: spec.variant === 'match' ? 'sort sort--match' : 'sort',
    }, [tray, bucketRow]);
    ctx.area.replaceChildren(board);

    let switched = false;
    const targetFor = (pieceId: string): string | undefined =>
      switched && spec.ruleSwitch ? spec.ruleSwitch.bucketOf(pieceId) : bucketOf.get(pieceId);

    const engine = createPickPlace({
      root: board,
      reduceMotion: ctx.reduceMotion,
      isCorrect: (pieceId, bucketId) => targetFor(pieceId) === bucketId,
      onPlace: ({ piece, bucket, correct }) => {
        if (finished) return;

        if (!correct) {
          mistakes += 1;
          return;
        }

        piece.dataset.done = 'true';
        piece.setAttribute('disabled', '');
        piece.classList.add('is-placed');

        const slots = bucket.querySelector('[data-slots]');
        const pieceSpec = spec.pieces.find((candidate) => candidate.id === piece.dataset.pieceId);
        if (slots && pieceSpec) {
          const token = renderVisual(pieceSpec.visual);
          token.classList.add('token');
          slots.append(token);
        }

        bucket.classList.add('is-filled');
        window.setTimeout(() => bucket.classList.remove('is-filled'), 360);

        placed += 1;
        progress();

        if (spec.ruleSwitch && !switched && placed === spec.ruleSwitch.after) {
          switched = true;
          ctx.setInstruction(spec.ruleSwitch.instruction);
          board.classList.add('is-switching');
          window.setTimeout(() => board.classList.remove('is-switching'), 700);
        }

        if (placed === spec.pieces.length) {
          finished = true;
          board.classList.add('is-complete');
          window.setTimeout(
            () =>
              ctx.onDone({
                solved: true,
                mistakes,
                hintsUsed: 0,
                msElapsed: Math.round(performance.now() - started),
              }),
            ctx.reduceMotion ? 0 : 420,
          );
        }
      },
    });

    return () => engine.destroy();
  };
}
