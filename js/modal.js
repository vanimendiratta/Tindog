/**
 * Modal & Interaction Controller
 * Manages App Download modal, Match Alert modal, and lead capture demonstration feedback.
 */

export class ModalManager {
  constructor() {
    this.downloadModalEl = document.getElementById('downloadModal');
    this.matchModalEl = document.getElementById('matchModal');
  }

  showMatch(dogProfile, isSuper = false) {
    if (!dogProfile) return;

    const modalTitle = document.getElementById('match-modal-title');
    const dogImg = document.getElementById('match-dog-img');
    const dogName = document.getElementById('match-dog-name');
    const dogBreed = document.getElementById('match-dog-breed');
    const matchFeedback = document.getElementById('match-action-feedback');

    if (modalTitle) {
      modalTitle.textContent = isSuper ? "It's a Super Match! ⭐" : "It's a Match! ❤️";
    }
    if (dogImg) {
      dogImg.src = dogProfile.image;
      dogImg.alt = `${dogProfile.name} match picture`;
    }
    if (dogName) {
      dogName.textContent = dogProfile.name;
    }
    if (dogBreed) {
      dogBreed.textContent = `${dogProfile.breed} • ${dogProfile.age}`;
    }
    if (matchFeedback) {
      matchFeedback.className = 'd-none';
      matchFeedback.textContent = '';
    }

    if (window.bootstrap && this.matchModalEl) {
      const modal = new window.bootstrap.Modal(this.matchModalEl);
      modal.show();
    }
  }

  setupDownloadListeners() {
    // 1. Lead capture demonstration form
    const signupForm = document.getElementById('early-access-form');
    const feedbackAlert = document.getElementById('signup-feedback');

    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('signup-email');
        const email = emailInput ? emailInput.value.trim() : '';

        if (!email || !email.includes('@') || !email.includes('.')) {
          if (feedbackAlert) {
            feedbackAlert.className = 'alert alert-danger mt-3 d-block';
            feedbackAlert.textContent = 'Please enter a valid email address.';
          }
          return;
        }

        if (feedbackAlert) {
          feedbackAlert.className = 'alert alert-success mt-3 d-block';
          feedbackAlert.innerHTML = `🐾 <strong>Simulated Signup Received:</strong> Validated <em>${email}</em> locally. <em>(Frontend demonstration: no network request or server submission occurred.)</em>`;
        }
        if (emailInput) {
          emailInput.value = '';
        }
      });
    }

    // 2. Direct store simulation buttons
    const storeBtns = document.querySelectorAll('.app-store-btn');
    const storeFeedback = document.getElementById('store-action-feedback');

    storeBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = btn.getAttribute('data-platform') || 'App Store';
        if (storeFeedback) {
          storeFeedback.className = 'alert alert-info mt-3 d-block text-start small';
          storeFeedback.innerHTML = `<i class="fas fa-info-circle me-1"></i> <strong>Simulated Link:</strong> In a production deployment, this button redirects to the verified ${platform} store listing.`;
        }
      });
    });

    // 3. Match Modal "Send a Bark" button handler
    const sendBarkBtn = document.getElementById('send-bark-btn');
    const matchFeedback = document.getElementById('match-action-feedback');

    if (sendBarkBtn) {
      sendBarkBtn.addEventListener('click', () => {
        if (matchFeedback) {
          matchFeedback.className = 'alert alert-success mt-3 d-block text-start small';
          matchFeedback.innerHTML = `<i class="fas fa-paw me-1"></i> <strong>Bark Sent!</strong> In a production chat service, this dispatches a real-time message notification.`;
        }
      });
    }
  }

  init() {
    this.setupDownloadListeners();
  }
}
