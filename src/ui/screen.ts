/**
 * Minimal screen controller: swap one view into the app root, apply the age
 * theme, move focus. No router, no history API, no event bus, no state library.
 */

import type { Screen } from '../game/types';

export interface ScreenView {
  screen: Screen;
  element: HTMLElement;
  /** `data-theme` for <html>; omit to keep the default vault theme. */
  theme?: string | undefined;
}

export interface ScreenHost {
  show(view: ScreenView): void;
}

export function createScreenHost(root: HTMLElement): ScreenHost {
  return {
    show({ screen, element, theme }) {
      const html = document.documentElement;
      if (theme) {
        html.dataset.theme = theme;
      } else {
        delete html.dataset.theme;
      }

      element.classList.add('screen');
      element.dataset.screen = screen;

      root.replaceChildren(element);
      if (window.scrollY !== 0) {
        window.scrollTo({ top: 0 });
      }

      // Send focus to the screen heading so keyboard and screen-reader users
      // land on the new context instead of the top of the document.
      const target = element.querySelector<HTMLElement>('[data-screen-focus]');
      target?.focus({ preventScroll: true });
    },
  };
}
