# Contributing to TinDog

Thank you for your interest in improving TinDog! We welcome contributions, bug reports, and suggestions from fellow developers and dog enthusiasts.

---

## Code of Conduct

Please treat everyone with respect, kindness, and positivity. Discriminatory, offensive, or harassing behavior will not be tolerated.

---

## Development Workflow

1. **Fork and Clone**
   ```bash
   git clone https://github.com/vanimendiratta/Tindog.git
   cd Tindog
   ```

2. **Install Dependencies**
   Ensure you have Node.js 18+ installed:
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Run Verification & Tests**
   Before submitting changes, make sure all linting checks and test suites pass:
   ```bash
   npm run lint
   npm test
   npm run build
   ```

---

## Branching & Commit Guidelines

- Create focused feature branches (e.g. `feature/dog-filters`, `fix/navbar-contrast`).
- Write clear, imperative commit messages (e.g. `feat(deck): add card sound effect toggle`, `fix(a11y): improve keyboard focus ring`).

---

## Pull Request Checklist

- [ ] Code follows project conventions and styling.
- [ ] No regression introduced to existing tests (`npm test` passes 100%).
- [ ] Added unit or DOM tests for new features.
- [ ] Verified responsive layout across mobile and desktop breakpoints.
- [ ] Updated documentation and README where applicable.
