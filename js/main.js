/**
 * Main application bootstrap entrypoint for TinDog.
 */
import { DogDeck } from './dog-deck.js';
import { PricingManager } from './pricing.js';
import { ThemeManager } from './theme.js';
import { ModalManager } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme Manager
  const themeManager = new ThemeManager();
  themeManager.init();

  // 2. Initialize Modals & Forms
  const modalManager = new ModalManager();
  modalManager.init();

  // 3. Initialize Interactive Dog Deck Simulator
  const deckContainer = document.getElementById('deck-container');
  let dogDeck = null;

  if (deckContainer) {
    dogDeck = new DogDeck({
      container: deckContainer,
      onMatch: (matchedDog, isSuper) => {
        modalManager.showMatch(matchedDog, isSuper);
      },
    });
    dogDeck.render();

    // Wire up deck action buttons
    const passBtn = document.getElementById('deck-pass-btn');
    const superBtn = document.getElementById('deck-super-btn');
    const likeBtn = document.getElementById('deck-like-btn');

    if (passBtn) passBtn.addEventListener('click', () => dogDeck.pass());
    if (superBtn) superBtn.addEventListener('click', () => dogDeck.superLike());
    if (likeBtn) likeBtn.addEventListener('click', () => dogDeck.like());

    // Keyboard navigation for card swiping
    window.addEventListener('keydown', (e) => {
      // Do not intercept keystrokes if typing inside an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        dogDeck.pass();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        dogDeck.like();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        dogDeck.superLike();
      }
    });
  }

  // 4. Initialize Dynamic Pricing
  const pricingManager = new PricingManager();
  pricingManager.init();

  // 5. Update dynamic copyright year in footer
  const copyrightYearEl = document.getElementById('copyright-year');
  if (copyrightYearEl) {
    copyrightYearEl.textContent = new Date().getFullYear();
  }

  // 6. Smooth scrolling for nav links
  document.querySelectorAll('a.nav-link[href^="#"], a.navbar-brand[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
          // Close mobile navbar if open
          const navbarCollapse = document.getElementById('navbar');
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = window.bootstrap?.Collapse?.getInstance(navbarCollapse);
            if (bsCollapse) bsCollapse.hide();
          }
        }
      }
    });
  });

  console.log('🐾 TinDog 2.0 initialized with interactive Match Deck and Modern Features.');
});
