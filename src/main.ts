import './styles.css';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('MIND VAULT: #app container is missing from index.html');
}

// Phase 0 renders a static foundation screen only. Screens and gameplay are
// added in later phases; this proves the container, tokens and build pipeline.
root.innerHTML = `
  <header>
    <h1 class="brand">Mind <span class="brand__vault">Vault</span></h1>
  </header>

  <main class="app__main">
    <section class="panel" aria-labelledby="foundation-title">
      <p class="tag">Phase 0 &middot; Foundation</p>
      <h2 class="panel__title" id="foundation-title">
        Short puzzles that train how you think.
      </h2>
      <p class="panel__note">
        Responsive shell, theme tokens and build pipeline are in place.
        Age selection and the first puzzles arrive in the next phases.
      </p>
      <ul class="skills">
        <li>Memory</li>
        <li>Logic</li>
        <li>Focus</li>
        <li>Problem Solving</li>
      </ul>
    </section>
  </main>

  <footer class="app__footer">
    No account, no server. Progress stays on this device.
  </footer>
`;
