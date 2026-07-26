/**
 * Small DOM helper. Text always goes through `textContent`, so authored content
 * never has to be HTML-escaped and can never inject markup.
 */

type Child = Node | string | null | undefined | false;

type Props = Record<string, string | number | boolean | undefined | null>;

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Props = {},
  children: Child[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'class') node.className = String(value);
    else if (key === 'text') node.textContent = String(value);
    else node.setAttribute(key, value === true ? '' : String(value));
  }

  for (const child of children) {
    if (child === undefined || child === null || child === false) continue;
    node.append(child);
  }

  return node;
}

/** 5-step challenge meter, also used later for difficulty display. */
export function pips(filled: number, total = 5, label?: string): HTMLElement {
  const wrap = el('span', {
    class: 'pips',
    role: 'img',
    'aria-label': label ?? `Level ${filled} of ${total}`,
  });
  for (let i = 1; i <= total; i += 1) {
    wrap.append(el('span', { class: i <= filled ? 'pip pip--on' : 'pip' }));
  }
  return wrap;
}
