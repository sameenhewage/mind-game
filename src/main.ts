import './styles.css';

import { readAgeGroup, writeAgeGroup } from './game/prefs';
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
  host.show({
    screen: 'game',
    theme: themeFor(group),
    element: renderGameScreen({
      ageGroup: group,
      onExit: () => showHome(group),
      onFinish: () => showResults(group),
    }),
  });
}

function showResults(group: AgeGroup): void {
  host.show({
    screen: 'results',
    theme: themeFor(group),
    element: renderResults({ onHome: () => showHome(group) }),
  });
}

if (ageGroup) {
  showHome(ageGroup);
} else {
  showAgeSelect();
}
