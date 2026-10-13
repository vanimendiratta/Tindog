import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

describe('DOM & HTML Structure Audit', () => {
  let dom;
  let document;

  beforeAll(() => {
    const htmlPath = path.resolve(__dirname, '../index.html');
    const html = fs.readFileSync(htmlPath, 'utf-8');
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  it('contains the essential viewport meta tag for responsive rendering', () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    expect(viewport).not.toBeNull();
    expect(viewport.getAttribute('content')).toContain('width=device-width');
  });

  it('contains required core section landmarks', () => {
    expect(document.getElementById('title')).not.toBeNull();
    expect(document.getElementById('match-simulator')).not.toBeNull();
    expect(document.getElementById('features')).not.toBeNull();
    expect(document.getElementById('testimonials')).not.toBeNull();
    expect(document.getElementById('press')).not.toBeNull();
    expect(document.getElementById('pricing')).not.toBeNull();
    expect(document.getElementById('cta')).not.toBeNull();
    expect(document.getElementById('footer')).not.toBeNull();
  });

  it('has valid non-empty alt attributes for all images', () => {
    const images = Array.from(document.querySelectorAll('img'));
    expect(images.length).toBeGreaterThan(0);

    images.forEach((img) => {
      const alt = img.getAttribute('alt');
      expect(alt).toBeDefined();
      expect(alt && alt.trim().length).toBeGreaterThan(0);
    });
  });

  it('has an accessible skip-link to main content', () => {
    const skipLink = document.querySelector('a.skip-link');
    expect(skipLink).not.toBeNull();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
    expect(document.getElementById('main-content')).not.toBeNull();
  });

  it('has both Download and Match celebration modals with demonstration notices', () => {
    const downloadModal = document.getElementById('downloadModal');
    const matchModal = document.getElementById('matchModal');
    expect(downloadModal).not.toBeNull();
    expect(matchModal).not.toBeNull();

    // Verifies explicit prototype notice is present
    expect(downloadModal.textContent).toContain('Prototype Notice');
    expect(document.getElementById('store-action-feedback')).not.toBeNull();
    expect(document.getElementById('match-action-feedback')).not.toBeNull();
  });

  it('has distinct pricing period elements for each tier', () => {
    expect(document.getElementById('period-chihuahua')).not.toBeNull();
    expect(document.getElementById('period-labrador')).not.toBeNull();
    expect(document.getElementById('period-mastiff')).not.toBeNull();
  });

  it('has billing toggle input with proper ID', () => {
    const toggle = document.getElementById('billing-toggle');
    expect(toggle).not.toBeNull();
    expect(toggle.getAttribute('type')).toBe('checkbox');
  });

  it('does not contain the typographical error "Pirority"', () => {
    const bodyText = document.body.textContent;
    expect(bodyText).not.toContain('Pirority');
    expect(bodyText).toContain('Priority Listing');
  });
});
