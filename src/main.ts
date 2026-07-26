import './styles.css';

import { shapeSortCard } from './content/little-explorer';
import { createBrain, type Brain } from './game/brain';
import { readAgeGroup, writeAgeGroup } from './game/prefs';
import type { AttemptResult, PuzzleCard } from './game/puzzle';
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

/** The age group is the only persisted value; the brain lives for this session. */
let ageGroup: AgeGroup | null = readAgeGroup();
let brain: Brain | null = ageGroup ? createBrain(ageGroup) : null;
let chamberNumber = 0;

function themeFor(group: AgeGroup | null): string | undefined {
  return group ? ageGroupInfo(group).theme : undefined;
}

/** Choosing a different mode starts a fresh session, since the ladder differs. */
function useAgeGroup(group: AgeGroup): Brain {
  if (ageGroup !== group || !brain) {
    ageGroup = group;
    brain = createBrain(group);
    chamberNumber = 0;
  }
  return brain;
}

function showAgeSelect(): void {
  const returning = ageGroup;
  host.show({
    screen: 'age-select',
    theme: themeFor(ageGroup),
    element: renderAgeSelect({
      current: ageGroup,
      onSelect: (selected) => {
        writeAgeGroup(selected);
        showHome(selected);
      },
      onCancel: returning ? () => showHome(returning) : undefined,
    }),
  });
}

function showHome(group: AgeGroup): void {
  const active = useAgeGroup(group);
  host.show({
    screen: 'home',
    theme: themeFor(group),
    element: renderHome({
      ageGroup: group,
      brain: active,
      onStartRun: () => showGame(group),
      onChangeAge: showAgeSelect,
    }),
  });
}

function showGame(group: AgeGroup): void {
  const active = useAgeGroup(group);
  const card = shapeSortCard(active.difficulty);
  chamberNumber += 1;

  const view = renderGameScreen({
    ageGroup: group,
    title: `Chamber ${chamberNumber}`,
    mount: card.mount,
    onExit: () => showHome(group),
    onDone: (result) => showResults(group, card, result),
  });

  host.show({
    screen: 'game',
    theme: themeFor(group),
    element: view.element,
    dispose: view.dispose,
  });
}

function showResults(group: AgeGroup, card: PuzzleCard, result: AttemptResult): void {
  const active = useAgeGroup(group);
  const outcome = active.record(result, {
    difficulty: card.difficulty,
    skills: card.skills,
    parMs: card.parMs,
  });

  host.show({
    screen: 'results',
    theme: themeFor(group),
    element: renderResults({
      card,
      result,
      outcome,
      skills: active.skills,
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
