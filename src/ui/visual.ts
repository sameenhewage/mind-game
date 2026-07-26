/**
 * Puzzle visuals. Everything is inline SVG, a text glyph, or plain text: no
 * raster assets, no sprite sheets, nothing to download.
 */

export type ShapeKind = 'circle' | 'triangle' | 'square' | 'star' | 'heart';

/** Named so content can say what it means when colour is the puzzle. */
export type ColourName = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';

export type VisualSize = 'sm' | 'md' | 'lg';

export type Visual =
  | { type: 'shape'; kind: ShapeKind; colour?: ColourName; size?: VisualSize }
  /** A single text glyph, used for animals and everyday objects. */
  | { type: 'icon'; char: string; size?: VisualSize }
  /** Countable dots, for early number work. */
  | { type: 'dots'; count: number; colour?: ColourName }
  | { type: 'text'; text: string; strong?: boolean };

const SVG_NS = 'http://www.w3.org/2000/svg';

const SHAPE_PATH: Record<ShapeKind, string> = {
  circle: 'M32 7a25 25 0 1 0 0 50 25 25 0 0 0 0-50Z',
  square: 'M14 8h36a6 6 0 0 1 6 6v36a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6Z',
  triangle: 'M32 9 57 54H7Z',
  star: 'M32 6 40 25l21 2-16 14 5 20-18-11-18 11 5-20L3 27l21-2Z',
  heart: 'M32 56S8 41 8 25a13 13 0 0 1 24-7 13 13 0 0 1 24 7c0 16-24 31-24 31Z',
};

function svg(viewBox = '0 0 64 64'): SVGSVGElement {
  const node = document.createElementNS(SVG_NS, 'svg');
  node.setAttribute('viewBox', viewBox);
  node.setAttribute('aria-hidden', 'true');
  node.setAttribute('focusable', 'false');
  return node;
}

export function shapeSvg(kind: ShapeKind): SVGSVGElement {
  const root = svg();
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', SHAPE_PATH[kind]);
  path.setAttribute('fill', 'currentColor');
  root.append(path);
  return root;
}

/**
 * Dice-style dot layouts on one fixed square canvas, so every card is the same
 * size and the dots stay countable instead of becoming a blur to estimate.
 */
const DOT_LAYOUT: Record<number, { points: [number, number][]; r: number }> = {
  1: { points: [[36, 36]], r: 13 },
  2: { points: [[21, 36], [51, 36]], r: 12 },
  3: { points: [[21, 51], [36, 21], [51, 51]], r: 11 },
  4: { points: [[21, 21], [51, 21], [21, 51], [51, 51]], r: 11 },
  5: { points: [[20, 20], [52, 20], [36, 36], [20, 52], [52, 52]], r: 10 },
  6: { points: [[20, 18], [52, 18], [20, 36], [52, 36], [20, 54], [52, 54]], r: 9 },
};

function dotsSvg(count: number): SVGSVGElement {
  const root = svg('0 0 72 72');
  const layout = DOT_LAYOUT[count] ?? DOT_LAYOUT[6];
  if (!layout) return root;

  for (const [cx, cy] of layout.points) {
    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('cx', String(cx));
    dot.setAttribute('cy', String(cy));
    dot.setAttribute('r', String(layout.r));
    dot.setAttribute('fill', 'currentColor');
    root.append(dot);
  }
  return root;
}

export function renderVisual(visual: Visual): HTMLElement {
  const classes = ['vis', `vis--${visual.type}`];

  if (visual.type === 'text') {
    if (visual.strong) classes.push('vis--strong');
    const span = document.createElement('span');
    span.className = classes.join(' ');
    span.textContent = visual.text;
    return span;
  }

  if (visual.type === 'icon') {
    classes.push(`size-${visual.size ?? 'md'}`);
    const span = document.createElement('span');
    span.className = classes.join(' ');
    span.textContent = visual.char;
    return span;
  }

  const wrap = document.createElement('span');
  if (visual.type === 'shape') {
    classes.push(`size-${visual.size ?? 'md'}`);
    if (visual.colour) classes.push(`ink-${visual.colour}`);
    wrap.className = classes.join(' ');
    wrap.append(shapeSvg(visual.kind));
    return wrap;
  }

  if (visual.colour) classes.push(`ink-${visual.colour}`);
  wrap.className = classes.join(' ');
  wrap.append(dotsSvg(visual.count));
  return wrap;
}
