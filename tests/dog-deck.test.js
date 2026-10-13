import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DogDeck } from '../js/dog-deck.js';

describe('DogDeck Controller', () => {
  let container;
  const mockProfiles = [
    {
      id: 'test-1',
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: '2 yrs old',
      distance: '1 mile away',
      bio: 'Good boy',
      tags: ['Friendly'],
      image: 'images/golden.jpg',
      matchChance: 1.0,
      verified: true,
    },
    {
      id: 'test-2',
      name: 'Bella',
      breed: 'Beagle',
      age: '3 yrs old',
      distance: '2 miles away',
      bio: 'Loves tracking',
      tags: ['Sniffer'],
      image: 'images/frenchie.jpg',
      matchChance: 0.0,
      verified: false,
    },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement('div');
    container.id = 'deck-container';
    document.body.appendChild(container);
  });

  it('renders initial profile card correctly', () => {
    const deck = new DogDeck({
      container,
      profiles: mockProfiles,
    });
    deck.render();

    const card = container.querySelector('.dog-card-item');
    expect(card).not.toBeNull();
    expect(card.getAttribute('data-id')).toBe('test-1');
    expect(container.textContent).toContain('Buddy');
    expect(container.textContent).toContain('Golden Retriever');
  });

  it('increments index and updates card on pass (left swipe)', () => {
    const deck = new DogDeck({
      container,
      profiles: mockProfiles,
    });
    deck.render();

    expect(deck.currentIndex).toBe(0);
    deck.pass();

    vi.advanceTimersByTime(300);

    expect(deck.currentIndex).toBe(1);
    expect(deck.getCurrentProfile().name).toBe('Bella');
  });

  it('records match and triggers onMatch callback on like', () => {
    const matchCallback = vi.fn();
    const deck = new DogDeck({
      container,
      profiles: mockProfiles,
      onMatch: matchCallback,
    });
    deck.render();

    deck.like();
    vi.advanceTimersByTime(300);

    expect(deck.matchedDogs.length).toBe(1);
    expect(deck.matchedDogs[0].name).toBe('Buddy');
    expect(matchCallback).toHaveBeenCalledWith(mockProfiles[0], false);
  });

  it('shows empty state when all cards are swiped and allows reset', () => {
    const deck = new DogDeck({
      container,
      profiles: mockProfiles,
    });
    deck.render();

    deck.pass();
    vi.advanceTimersByTime(300);
    deck.pass();
    vi.advanceTimersByTime(300);

    expect(deck.getCurrentProfile()).toBeNull();
    expect(container.textContent).toContain("That's all the dogs nearby!");

    deck.reset();
    expect(deck.currentIndex).toBe(0);
    expect(deck.getCurrentProfile().name).toBe('Buddy');
  });
});
