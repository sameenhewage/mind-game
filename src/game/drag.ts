/**
 * Pointer-based pick-and-place.
 *
 * One code path for mouse, touch and pen via Pointer Events. Native HTML5
 * drag-and-drop is not used: it has no touch support and no control over motion.
 *
 * Performance rules honoured here:
 * - geometry is measured once per gesture, never inside pointermove;
 * - pointermove only writes `transform`, so no layout is forced per frame;
 * - snap/return use the Web Animations API because the distance is only known
 *   at runtime, and both collapse to ~0ms under reduced motion.
 *
 * A press without movement is a tap, which selects the piece so it can also be
 * placed by tapping a bucket. That gives keyboard, switch and low-dexterity
 * players the same game without a separate mode.
 */

/** Movement in px before a press counts as a drag instead of a tap. */
const DRAG_SLOP = 6;
/** Forgiveness added around each bucket when deciding what a drop hit. */
const TARGET_PAD = 16;

const SNAP_MS = 260;
const RETURN_MS = 220;
const EASE_OUT = 'cubic-bezier(0.32, 0.72, 0, 1)';

export interface PlaceEvent {
  piece: HTMLElement;
  pieceId: string;
  bucket: HTMLElement;
  bucketId: string;
  correct: boolean;
}

export interface PickPlaceOptions {
  /** Container used for delegation; pieces must live inside it. */
  root: HTMLElement;
  isCorrect: (pieceId: string, bucketId: string) => boolean;
  /** Runs after the snap/return animation has finished. */
  onPlace: (event: PlaceEvent) => void;
  reduceMotion: boolean;
}

export interface PickPlace {
  destroy: () => void;
}

interface Box {
  cx: number;
  cy: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

function boxOf(element: Element): Box {
  const r = element.getBoundingClientRect();
  return {
    cx: r.left + r.width / 2,
    cy: r.top + r.height / 2,
    left: r.left,
    top: r.top,
    right: r.right,
    bottom: r.bottom,
  };
}

export function createPickPlace({
  root,
  isCorrect,
  onPlace,
  reduceMotion,
}: PickPlaceOptions): PickPlace {
  let pointerId: number | null = null;
  let piece: HTMLElement | null = null;
  let startX = 0;
  let startY = 0;
  let pieceBox: Box | null = null;
  let moved = false;
  /** Bucket rects captured at gesture start so pointermove stays read-free. */
  let buckets: { element: HTMLElement; id: string; box: Box }[] = [];
  let near: HTMLElement | null = null;
  let selected: HTMLElement | null = null;
  let busy = false;

  const pieces = () => Array.from(root.querySelectorAll<HTMLElement>('[data-piece-id]'));
  const bucketEls = () => Array.from(root.querySelectorAll<HTMLElement>('[data-bucket-id]'));

  function measureBuckets(): void {
    buckets = bucketEls().map((element) => ({
      element,
      id: element.dataset.bucketId ?? '',
      box: boxOf(element.querySelector('[data-bucket-mouth]') ?? element),
    }));
  }

  function setSelected(next: HTMLElement | null): void {
    if (selected === next) return;
    selected?.classList.remove('is-selected');
    selected?.setAttribute('aria-pressed', 'false');
    selected = next;
    if (selected) {
      selected.classList.add('is-selected');
      selected.setAttribute('aria-pressed', 'true');
    }
    root.classList.toggle('is-picking', selected !== null);
  }

  function setNear(next: HTMLElement | null): void {
    if (near === next) return;
    near?.classList.remove('is-near');
    near = next;
    near?.classList.add('is-near');
  }

  function bucketAt(x: number, y: number) {
    return buckets.find(
      ({ box }) =>
        x >= box.left - TARGET_PAD &&
        x <= box.right + TARGET_PAD &&
        y >= box.top - TARGET_PAD &&
        y <= box.bottom + TARGET_PAD,
    );
  }

  function animate(
    element: HTMLElement,
    frames: Keyframe[],
    ms: number,
    done: () => void,
  ): void {
    const animation = element.animate(frames, {
      duration: reduceMotion ? 1 : ms,
      easing: EASE_OUT,
      fill: 'forwards',
    });
    animation.addEventListener('finish', () => {
      animation.cancel();
      done();
    });
  }

  function returnHome(target: HTMLElement, from: string): void {
    busy = true;
    target.classList.add('is-returning');
    animate(
      target,
      [{ transform: from }, { transform: 'translate3d(0, 0, 0) scale(1)' }],
      RETURN_MS,
      () => {
        target.style.transform = '';
        target.classList.remove('is-returning', 'is-dragging');
        busy = false;
      },
    );
  }

  /** Correct drop: glide into the bucket mouth, then hand control back. */
  function snapInto(target: HTMLElement, from: string, box: Box, event: PlaceEvent): void {
    busy = true;
    const to = boxOf(target.querySelector('[data-bucket-mouth]') ?? target);
    const dx = to.cx - box.cx;
    const dy = to.cy - box.cy;
    animate(
      target,
      [
        { transform: from, opacity: '1' },
        { transform: `translate3d(${dx}px, ${dy}px, 0) scale(0.34)`, opacity: '0.15' },
      ],
      SNAP_MS,
      () => {
        target.style.transform = '';
        target.classList.remove('is-dragging');
        busy = false;
        onPlace(event);
      },
    );
  }

  function resolve(pieceEl: HTMLElement, bucket: HTMLElement, from: string, box: Box): void {
    const pieceId = pieceEl.dataset.pieceId ?? '';
    const bucketId = bucket.dataset.bucketId ?? '';
    const correct = isCorrect(pieceId, bucketId);
    const event: PlaceEvent = { piece: pieceEl, pieceId, bucket, bucketId, correct };

    setNear(null);
    setSelected(null);

    if (correct) {
      snapInto(pieceEl, from, box, event);
      return;
    }

    bucket.classList.add('is-rejecting');
    window.setTimeout(() => bucket.classList.remove('is-rejecting'), 320);
    pieceEl.classList.add('is-wrong');
    window.setTimeout(() => pieceEl.classList.remove('is-wrong'), 420);

    busy = true;
    pieceEl.classList.add('is-returning');
    animate(
      pieceEl,
      [{ transform: from }, { transform: 'translate3d(0, 0, 0) scale(1)' }],
      RETURN_MS,
      () => {
        pieceEl.style.transform = '';
        pieceEl.classList.remove('is-returning', 'is-dragging');
        busy = false;
        onPlace(event);
      },
    );
  }

  function onPointerDown(event: PointerEvent): void {
    if (busy || pointerId !== null || event.button !== 0) return;
    const target = (event.target as Element | null)?.closest<HTMLElement>('[data-piece-id]');
    if (!target || target.dataset.done === 'true' || !root.contains(target)) return;

    pointerId = event.pointerId;
    piece = target;
    startX = event.clientX;
    startY = event.clientY;
    moved = false;
    pieceBox = boxOf(target);
    measureBuckets();

    target.setPointerCapture(event.pointerId);
    target.classList.add('is-dragging');
  }

  function onPointerMove(event: PointerEvent): void {
    if (pointerId !== event.pointerId || !piece || !pieceBox) return;

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    if (!moved && Math.hypot(dx, dy) < DRAG_SLOP) return;
    moved = true;

    // Transform-only write: no layout read inside the move handler.
    piece.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.08)`;
    const hit = bucketAt(pieceBox.cx + dx, pieceBox.cy + dy);
    setNear(hit?.element ?? null);
  }

  function onPointerUp(event: PointerEvent): void {
    if (pointerId !== event.pointerId || !piece || !pieceBox) return;

    const activePiece = piece;
    const box = pieceBox;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    const wasDrag = moved;

    pointerId = null;
    piece = null;
    pieceBox = null;

    if (!wasDrag) {
      // A tap: arm the piece so a bucket tap or keyboard activation places it.
      activePiece.classList.remove('is-dragging');
      setSelected(selected === activePiece ? null : activePiece);
      return;
    }

    const from = `translate3d(${dx}px, ${dy}px, 0) scale(1.08)`;
    const hit = bucketAt(box.cx + dx, box.cy + dy);
    setNear(null);

    if (!hit) {
      returnHome(activePiece, from);
      return;
    }
    resolve(activePiece, hit.element, from, box);
  }

  function onPointerCancel(event: PointerEvent): void {
    if (pointerId !== event.pointerId || !piece) return;
    const activePiece = piece;
    pointerId = null;
    piece = null;
    pieceBox = null;
    if (moved) {
      returnHome(activePiece, activePiece.style.transform || 'translate3d(0,0,0) scale(1.08)');
    } else {
      activePiece.classList.remove('is-dragging');
    }
  }

  /** Placing a selected piece by activating a bucket (tap, click or keyboard). */
  function onClick(event: MouseEvent): void {
    if (busy) return;
    const from = event.target as Element | null;

    // `detail === 0` means the button was activated by keyboard, which produces no
    // pointer gesture, so selection has to happen here instead.
    if (event.detail === 0) {
      const keyPiece = from?.closest<HTMLElement>('[data-piece-id]');
      if (keyPiece && keyPiece.dataset.done !== 'true') {
        setSelected(selected === keyPiece ? null : keyPiece);
        return;
      }
    }

    if (!selected) return;
    const bucket = from?.closest<HTMLElement>('[data-bucket-id]');
    if (!bucket) return;
    const activePiece = selected;
    measureBuckets();
    resolve(activePiece, bucket, 'translate3d(0, 0, 0) scale(1)', boxOf(activePiece));
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !selected) return;
    setSelected(null);
  }

  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('pointermove', onPointerMove);
  root.addEventListener('pointerup', onPointerUp);
  root.addEventListener('pointercancel', onPointerCancel);
  root.addEventListener('click', onClick);
  root.addEventListener('keydown', onKeyDown);

  return {
    destroy() {
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerup', onPointerUp);
      root.removeEventListener('pointercancel', onPointerCancel);
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKeyDown);
      pieces().forEach((element) => {
        element.style.transform = '';
        element.classList.remove('is-dragging', 'is-returning', 'is-selected', 'is-wrong');
      });
    },
  };
}
