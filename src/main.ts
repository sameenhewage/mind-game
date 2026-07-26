import './styles.css';

import { pickCard } from './content/catalog';
import { finalVaultCard } from './content/final-vault';
import { createBrain, type Brain } from './game/brain';
import { readAgeGroup, writeAgeGroup } from './game/prefs';
import type { AttemptResult, KnowledgeDomain, PuzzleCard } from './game/puzzle';
import { createRun, mintKey, runDepth, type RunState, type VaultKey } from './game/run';
import { ageGroupInfo, type AgeGroup } from './game/types';
import { renderAgeSelect } from './ui/age-select';
import { renderGameScreen } from './ui/game-screen';
import { renderHome } from './ui/home';
import { renderChamberClear, renderRunSummary } from './ui/results';
import { createScreenHost } from './ui/screen';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('MIND VAULT: #app container is missing from index.html');
}

const host = createScreenHost(root);

/** The age group is the only persisted value; everything else is this session. */
let ageGroup: AgeGroup | null = readAgeGroup();
let brain: Brain | null = ageGroup ? createBrain(ageGroup) : null;
let run: RunState | null = null;
let bestDepth = 0;

function themeFor(group: AgeGroup | null): string | undefined {
  return group ? ageGroupInfo(group).theme : undefined;
}

/** Changing mode starts a fresh session, because the whole ladder differs. */
function useAgeGroup(group: AgeGroup): Brain {
  if (ageGroup !== group || !brain) {
    ageGroup = group;
    brain = createBrain(group);
    run = null;
    bestDepth = 0;
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
      bestDepth,
      onStartRun: () => startRun(group),
      onChangeAge: showAgeSelect,
    }),
  });
}

function startRun(group: AgeGroup): void {
  useAgeGroup(group);
  run = createRun(group);
  showChamber(group);
}

/** Opens the next chamber, or the Final Vault once the chambers are done. */
function showChamber(group: AgeGroup): void {
  const active = useAgeGroup(group);
  const current = run;
  if (!current) {
    showHome(group);
    return;
  }

  const isFinal = current.cleared >= current.shape.chambers;
  current.inFinal = isFinal;

  const card = isFinal
    ? finalVaultCard(current, active.difficulty)
    : // Prefer a domain this run has not used yet, so one run spans subjects.
      pickNextChamberCard(group, current, active);

  const title = isFinal ? 'Final Vault' : `Chamber ${current.cleared + 1}`;
  const subtitle = isFinal
    ? `Keys: ${current.keys.length}`
    : `${card.title} · ${current.cleared + 1} of ${current.shape.chambers}`;

  const view = renderGameScreen({
    ageGroup: group,
    title,
    subtitle,
    mount: card.mount,
    onExit: () => leaveRun(group),
    onDone: (result) => finishChamber(group, card, result),
  });

  host.show({
    screen: 'game',
    theme: themeFor(group),
    element: view.element,
    dispose: view.dispose,
  });
}

/** Domains a run tries to visit, in order, so one run spans several subjects. */
const DOMAIN_ROTATION: KnowledgeDomain[] = [
  'maths',
  'problem-solving',
  'nature',
  'language',
  'history',
  'core',
];

function pickNextChamberCard(group: AgeGroup, current: RunState, active: Brain): PuzzleCard {
  const wanted = DOMAIN_ROTATION.find((domain) => !current.domains.includes(domain));
  const card = pickCard(group, active.difficulty, current.playedIds, wanted);
  current.playedIds = [...current.playedIds, card.id];
  current.domains = [...current.domains, card.domain];
  return card;
}

function finishChamber(group: AgeGroup, card: PuzzleCard, result: AttemptResult): void {
  const active = useAgeGroup(group);
  const current = run;
  if (!current) {
    showHome(group);
    return;
  }

  const outcome = active.record(result, {
    difficulty: card.difficulty,
    skills: card.skills,
    parMs: card.parMs,
  });

  if (current.inFinal) {
    current.finalResult = result;
    showSummary(group, current, active);
    return;
  }

  current.results = [...current.results, result];

  // A key only comes from a chamber that was actually solved, so the Final Vault
  // is easier for a clean run and harder for a scrappy one - by skill, not chance.
  let key: VaultKey | null = null;
  if (result.solved) {
    key = mintKey(current);
    current.keys = [...current.keys, key];
  }
  current.cleared += 1;
  bestDepth = Math.max(bestDepth, runDepth(current));

  host.show({
    screen: 'results',
    theme: themeFor(group),
    element: renderChamberClear({
      run: current,
      card,
      result,
      outcome,
      key,
      onNext: () => {
        // With no keys at all there is nothing for the vault to ask about.
        if (current.cleared >= current.shape.chambers && current.keys.length === 0) {
          showSummary(group, current, active);
          return;
        }
        showChamber(group);
      },
      onLeave: () => leaveRun(group),
    }),
  });
}

function showSummary(group: AgeGroup, current: RunState, active: Brain): void {
  bestDepth = Math.max(bestDepth, runDepth(current));
  host.show({
    screen: 'results',
    theme: themeFor(group),
    element: renderRunSummary({
      run: current,
      skills: active.skills,
      bestDepth,
      onAgain: () => startRun(group),
      onHome: () => showHome(group),
    }),
  });
}

function leaveRun(group: AgeGroup): void {
  if (run) bestDepth = Math.max(bestDepth, runDepth(run));
  run = null;
  showHome(group);
}

if (ageGroup) {
  showHome(ageGroup);
} else {
  showAgeSelect();
}
