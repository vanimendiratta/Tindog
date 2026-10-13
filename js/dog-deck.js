/**
 * Dog Deck Controller
 * Provides an interactive Tinder-style swipeable card deck for TinDog.
 */
import { DOG_PROFILES } from './dog-data.js';

export class DogDeck {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('deck-container');
    this.onMatch = options.onMatch || (() => {});
    this.profiles = [...(options.profiles || DOG_PROFILES)];
    this.currentIndex = 0;
    this.matchedDogs = [];
  }

  getCurrentProfile() {
    if (this.currentIndex >= this.profiles.length) {
      return null;
    }
    return this.profiles[this.currentIndex];
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const profile = this.getCurrentProfile();
    if (!profile) {
      this.renderEmptyState();
      return;
    }

    const card = document.createElement('div');
    card.className = 'dog-card-item active-card';
    card.id = `card-${profile.id}`;
    card.setAttribute('data-id', profile.id);

    const tagsHtml = profile.tags
      .map((tag) => `<span class="badge dog-tag">${tag}</span>`)
      .join(' ');

    card.innerHTML = `
      <div class="card-image-wrap">
        <img src="${profile.image}" alt="${profile.name} - ${profile.breed}" class="card-dog-img" loading="eager" />
        <div class="card-gradient-overlay"></div>
        <div class="card-stamp stamp-like">LIKE</div>
        <div class="card-stamp stamp-nope">NOPE</div>
        <div class="card-stamp stamp-super">SUPER LIKE</div>
      </div>
      <div class="card-info">
        <div class="d-flex align-items-center justify-content-between mb-1">
          <h3 class="card-dog-name mb-0">${profile.name}, <span class="card-dog-age">${profile.age}</span></h3>
          ${profile.verified ? '<span class="verified-badge" title="Verified Good Boy"><i class="fas fa-check-circle text-primary"></i></span>' : ''}
        </div>
        <p class="card-dog-breed text-muted mb-2"><i class="fas fa-paw me-1"></i> ${profile.breed} • <i class="fas fa-map-marker-alt ms-1 me-1"></i> ${profile.distance}</p>
        <p class="card-dog-bio mb-3">${profile.bio}</p>
        <div class="card-tags">${tagsHtml}</div>
      </div>
    `;

    this.container.appendChild(card);
    this.setupGestures(card);
  }

  renderEmptyState() {
    this.container.innerHTML = `
      <div class="deck-empty-state text-center p-4">
        <div class="empty-icon mb-3"><i class="fas fa-dog fa-3x text-muted"></i></div>
        <h4>That's all the dogs nearby!</h4>
        <p class="text-muted">You've matched with ${this.matchedDogs.length} awesome pup(s).</p>
        <button id="reset-deck-btn" class="btn btn-outline-danger mt-2">
          <i class="fas fa-redo-alt me-2"></i> Shuffle & View Again
        </button>
      </div>
    `;

    const resetBtn = this.container.querySelector('#reset-deck-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }
  }

  swipe(direction) {
    const profile = this.getCurrentProfile();
    if (!profile) return null;

    const card = this.container.querySelector('.active-card');
    if (card) {
      if (direction === 'left') {
        card.classList.add('fly-left');
      } else if (direction === 'right') {
        card.classList.add('fly-right');
      } else if (direction === 'up') {
        card.classList.add('fly-up');
      }
    }

    const isMatch = (direction === 'right' || direction === 'up') && Math.random() <= profile.matchChance;
    if (isMatch) {
      this.matchedDogs.push(profile);
    }

    setTimeout(() => {
      this.currentIndex++;
      this.render();
      if (isMatch) {
        this.onMatch(profile, direction === 'up');
      }
    }, 280);

    return { profile, direction, isMatch };
  }

  pass() {
    return this.swipe('left');
  }

  like() {
    return this.swipe('right');
  }

  superLike() {
    return this.swipe('up');
  }

  reset() {
    this.currentIndex = 0;
    this.matchedDogs = [];
    this.render();
  }

  setupGestures(card) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    const onPointerDown = (e) => {
      isDragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      card.style.transition = 'none';
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      currentX = (e.clientX || (e.touches && e.touches[0].clientX) || 0) - startX;
      currentY = (e.clientY || (e.touches && e.touches[0].clientY) || 0) - startY;

      const rotate = currentX * 0.08;
      card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotate}deg)`;

      // Stamp indicator opacity
      const likeStamp = card.querySelector('.stamp-like');
      const nopeStamp = card.querySelector('.stamp-nope');
      const superStamp = card.querySelector('.stamp-super');

      if (currentY < -40 && Math.abs(currentX) < 40) {
        if (superStamp) superStamp.style.opacity = Math.min(Math.abs(currentY) / 100, 1);
        if (likeStamp) likeStamp.style.opacity = 0;
        if (nopeStamp) nopeStamp.style.opacity = 0;
      } else if (currentX > 20) {
        if (likeStamp) likeStamp.style.opacity = Math.min(currentX / 100, 1);
        if (nopeStamp) nopeStamp.style.opacity = 0;
        if (superStamp) superStamp.style.opacity = 0;
      } else if (currentX < -20) {
        if (nopeStamp) nopeStamp.style.opacity = Math.min(Math.abs(currentX) / 100, 1);
        if (likeStamp) likeStamp.style.opacity = 0;
        if (superStamp) superStamp.style.opacity = 0;
      } else {
        if (likeStamp) likeStamp.style.opacity = 0;
        if (nopeStamp) nopeStamp.style.opacity = 0;
        if (superStamp) superStamp.style.opacity = 0;
      }
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

      if (currentY < -80 && Math.abs(currentX) < 60) {
        this.superLike();
      } else if (currentX > 80) {
        this.like();
      } else if (currentX < -80) {
        this.pass();
      } else {
        card.style.transform = 'translate(0px, 0px) rotate(0deg)';
        const stamps = card.querySelectorAll('.card-stamp');
        stamps.forEach((s) => (s.style.opacity = 0));
      }
      currentX = 0;
      currentY = 0;
    };

    card.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    card.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });
  }
}
