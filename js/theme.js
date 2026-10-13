/**
 * Theme Controller
 * Manages dark/light theme switching with local storage persistence and system preference detection.
 */

export class ThemeManager {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'tindog-theme';
    this.toggleBtn = options.toggleBtn || document.getElementById('theme-toggle-btn');
    this.currentTheme = 'light';
  }

  getPreferredTheme() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.storageKey, theme);
    this.updateToggleIcon();
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
    return nextTheme;
  }

  updateToggleIcon() {
    if (!this.toggleBtn) return;
    const icon = this.toggleBtn.querySelector('i');
    if (!icon) return;

    if (this.currentTheme === 'dark') {
      icon.className = 'fas fa-sun';
      this.toggleBtn.setAttribute('aria-label', 'Switch to light theme');
      this.toggleBtn.setAttribute('title', 'Switch to light theme');
    } else {
      icon.className = 'fas fa-moon';
      this.toggleBtn.setAttribute('aria-label', 'Switch to dark theme');
      this.toggleBtn.setAttribute('title', 'Switch to dark theme');
    }
  }

  init() {
    const preferred = this.getPreferredTheme();
    this.applyTheme(preferred);

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.storageKey)) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }
}
