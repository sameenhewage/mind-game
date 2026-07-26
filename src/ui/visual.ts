/**
 * Puzzle visuals. Everything is inline SVG or text: no raster assets, no sprite
 * sheets, and colour comes from theme tokens through CSS classes.
 */

export type ShapeKind = 'circle' | 'triangle' | 'square';

/** Palette slot, not a meaning. Keeps colour decisions in CSS. */
export type Tone = 'one' | 'two' | 'three' | 'four' | 'plain';

export type Visual =
  | { type: 'shape'; kind: ShapeKind; tone?: Tone }
  | { type: 'text'; text: string };

const SVG_NS = 'http://www.w3.org/2000/svg';

const SHAPE_GEOMETRY: Record<ShapeKind, { tag: 'circle' | 'rect' | 'path'; attrs: Record<string, string> }> = {
  circle: { tag: 'circle', attrs: { cx: '32', cy: '32', r: '25' } },
  square: { tag: 'rect', attrs: { x: '8', y: '8', width: '48', height: '48', rx: '9' } },
  triangle: { tag: 'path', attrs: { d: 'M32 8 56 55H8Z', 'stroke-linejoin': 'round', 'stroke-width': '6', stroke: 'currentColor' } },
};

export function shapeSvg(kind: ShapeKind): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 64 64');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const { tag, attrs } = SHAPE_GEOMETRY[kind];
  const node = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
  node.setAttribute('fill', 'currentColor');
  svg.append(node);
  return svg;
}

export function renderVisual(visual: Visual): HTMLElement {
  if (visual.type === 'text') {
    const span = document.createElement('span');
    span.className = 'vis vis--text';
    span.textContent = visual.text;
    return span;
  }

  const wrap = document.createElement('span');
  wrap.className = `vis vis--shape tone-${visual.tone ?? 'plain'}`;
  wrap.append(shapeSvg(visual.kind));
  return wrap;
}
