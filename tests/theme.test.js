import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeManager } from '../js/theme.js';

describe('ThemeManager', () => {
  let toggleBtn;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    toggleBtn = document.createElement('button');
    toggleBtn.id = 'theme-toggle-btn';
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(toggleBtn);
  });

  it('initializes with default light theme when no storage preference exists', () => {
    const manager = new ThemeManager({ toggleBtn });
    manager.init();

    expect(manager.currentTheme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(toggleBtn.querySelector('i').className).toBe('fas fa-moon');
  });

  it('toggles theme between light and dark', () => {
    const manager = new ThemeManager({ toggleBtn });
    manager.init();

    const newTheme = manager.toggleTheme();
    expect(newTheme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('tindog-theme')).toBe('dark');
    expect(toggleBtn.querySelector('i').className).toBe('fas fa-sun');

    manager.toggleTheme();
    expect(manager.currentTheme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('restores theme from localStorage if previously set', () => {
    localStorage.setItem('tindog-theme', 'dark');
    const manager = new ThemeManager({ toggleBtn });
    manager.init();

    expect(manager.currentTheme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
