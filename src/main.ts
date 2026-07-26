import './styles.css';

import { shapeSort } from './content/little-explorer';
import { readAgeGroup, writeAgeGroup } from './game/prefs';
import type { AttemptResult } from './game/puzzle';
import { ageGroupInfo, type AgeGroup } from './game/types';
import { renderAgeSelect } from './ui/age-select';
import { renderGameScreen } from './ui/game-screen';
import { renderHome } from './ui/home';
import { renderResults } from './ui/results';
import { createScreenHost } from './ui/screen';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('MIND VAULT: #app container is missing from index.html');
}

const host = createScreenHost(root);

/** The only persisted value. Everything else is session state. */
let ageGroup: AgeGroup | null = readAgeGroup();

function themeFor(group: AgeGroup | null): string | undefined {
  return group ? ageGroupInfo(group).theme : undefined;
}

function showAgeSelect(): void {
  const returning = ageGroup;
  host.show({
    screen: 'age-select',
    theme: themeFor(ageGroup),
    element: renderAgeSelect({
      current: ageGroup,
      onSelect: (selected) => {
        ageGroup = selected;
        writeAgeGroup(selected);
        showHome(selected);
      },
      onCancel: returning ? () => showHome(returning) : undefined,
    }),
  });
}

function showHome(group: AgeGroup): void {
  host.show({
    screen: 'home',
    theme: themeFor(group),
    element: renderHome({
      ageGroup: group,
      onStartRun: () => showGame(group),
      onChangeAge: showAgeSelect,
    }),
  });
}

function showGame(group: AgeGroup): void {
  const view = renderGameScreen({
    ageGroup: group,
    title: 'Chamber 1',
    mount: shapeSort(['circle', 'triangle', 'square']),
    onExit: () => showHome(group),
    onDone: (result) => showResults(group, result),
  });

  host.show({
    screen: 'game',
    theme: themeFor(group),
    element: view.element,
    dispose: view.dispose,
  });
}

function showResults(group: AgeGroup, result: AttemptResult): void {
  host.show({
    screen: 'results',
    theme: themeFor(group),
    element: renderResults({
      result,
      onAgain: () => showGame(group),
      onHome: () => showHome(group),
    }),
  });
}

if (ageGroup) {
  showHome(ageGroup);
} else {
  showAgeSelect();
}
