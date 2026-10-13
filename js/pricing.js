/**
 * Pricing Controller
 * Handles billing cycle toggling (Monthly vs Annual) and plan calculations.
 */

export const PRICING_TIERS = {
  chihuahua: {
    name: 'Chihuahua',
    monthlyPrice: 0,
    annualPrice: 0,
    monthlyPeriod: 'Forever complimentary',
    annualPeriod: 'Forever complimentary',
  },
  labrador: {
    name: 'Labrador',
    monthlyPrice: 49,
    annualPrice: 39, // ~$468/yr (20% discount on $49/mo)
    monthlyPeriod: '/ mo',
    annualPeriod: '/ mo (billed annually)',
  },
  mastiff: {
    name: 'Mastiff',
    monthlyPrice: 99,
    annualPrice: 79, // ~$948/yr (20% discount on $99/mo)
    monthlyPeriod: '/ mo',
    annualPeriod: '/ mo (billed annually)',
  },
};

export class PricingManager {
  constructor(options = {}) {
    this.isAnnual = options.initialAnnual || false;
    this.toggleEl = options.toggleEl || document.getElementById('billing-toggle');
    this.priceElements = options.priceElements || {
      chihuahua: document.getElementById('price-chihuahua'),
      labrador: document.getElementById('price-labrador'),
      mastiff: document.getElementById('price-mastiff'),
    };
    this.periodElements = options.periodElements || {
      chihuahua: document.getElementById('period-chihuahua'),
      labrador: document.getElementById('period-labrador'),
      mastiff: document.getElementById('period-mastiff'),
    };
  }

  setBillingCycle(isAnnual) {
    this.isAnnual = Boolean(isAnnual);
    this.updateUI();
  }

  toggle() {
    this.setBillingCycle(!this.isAnnual);
  }

  updateUI() {
    // 1. Update Chihuahua (Free)
    if (this.priceElements.chihuahua) {
      this.priceElements.chihuahua.textContent = 'Free';
    }
    if (this.periodElements.chihuahua) {
      this.periodElements.chihuahua.textContent = PRICING_TIERS.chihuahua.monthlyPeriod;
    }

    // 2. Update Labrador
    if (this.priceElements.labrador) {
      const price = this.isAnnual ? PRICING_TIERS.labrador.annualPrice : PRICING_TIERS.labrador.monthlyPrice;
      this.priceElements.labrador.textContent = `$${price}`;
    }
    if (this.periodElements.labrador) {
      this.periodElements.labrador.textContent = this.isAnnual
        ? PRICING_TIERS.labrador.annualPeriod
        : PRICING_TIERS.labrador.monthlyPeriod;
    }

    // 3. Update Mastiff
    if (this.priceElements.mastiff) {
      const price = this.isAnnual ? PRICING_TIERS.mastiff.annualPrice : PRICING_TIERS.mastiff.monthlyPrice;
      this.priceElements.mastiff.textContent = `$${price}`;
    }
    if (this.periodElements.mastiff) {
      this.periodElements.mastiff.textContent = this.isAnnual
        ? PRICING_TIERS.mastiff.annualPeriod
        : PRICING_TIERS.mastiff.monthlyPeriod;
    }

    // 4. Update Discount Badges
    const discountBadges = document.querySelectorAll('.annual-discount-pill');
    discountBadges.forEach((badge) => {
      badge.style.display = this.isAnnual ? 'inline-block' : 'none';
    });
  }

  init() {
    if (this.toggleEl) {
      this.toggleEl.checked = this.isAnnual;
      this.toggleEl.addEventListener('change', (e) => {
        this.setBillingCycle(e.target.checked);
      });
    }
    this.updateUI();
  }
}
