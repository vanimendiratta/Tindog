import { describe, it, expect, beforeEach } from 'vitest';
import { PricingManager, PRICING_TIERS } from '../js/pricing.js';

describe('PricingManager & PRICING_TIERS', () => {
  let container;
  let priceChihuahua;
  let priceLabrador;
  let priceMastiff;
  let periodChihuahua;
  let periodLabrador;
  let periodMastiff;
  let billingToggle;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <input type="checkbox" id="billing-toggle" />
      <div id="price-chihuahua">Free</div>
      <div id="period-chihuahua">Forever complimentary</div>
      <div id="price-labrador">$49</div>
      <div id="period-labrador">/ mo</div>
      <div id="price-mastiff">$99</div>
      <div id="period-mastiff">/ mo</div>
      <div class="annual-discount-pill" style="display: none;">Save 20%</div>
    `;
    document.body.appendChild(container);

    priceChihuahua = document.getElementById('price-chihuahua');
    priceLabrador = document.getElementById('price-labrador');
    priceMastiff = document.getElementById('price-mastiff');
    periodChihuahua = document.getElementById('period-chihuahua');
    periodLabrador = document.getElementById('period-labrador');
    periodMastiff = document.getElementById('period-mastiff');
    billingToggle = document.getElementById('billing-toggle');
  });

  it('defines correct tier pricing constants', () => {
    expect(PRICING_TIERS.chihuahua.monthlyPrice).toBe(0);
    expect(PRICING_TIERS.labrador.monthlyPrice).toBe(49);
    expect(PRICING_TIERS.labrador.annualPrice).toBe(39);
    expect(PRICING_TIERS.mastiff.monthlyPrice).toBe(99);
    expect(PRICING_TIERS.mastiff.annualPrice).toBe(79);
  });

  it('initializes in monthly mode by default with proper labels', () => {
    const manager = new PricingManager({
      toggleEl: billingToggle,
      priceElements: {
        chihuahua: priceChihuahua,
        labrador: priceLabrador,
        mastiff: priceMastiff,
      },
      periodElements: {
        chihuahua: periodChihuahua,
        labrador: periodLabrador,
        mastiff: periodMastiff,
      },
    });
    manager.init();

    expect(manager.isAnnual).toBe(false);
    expect(priceLabrador.textContent).toBe('$49');
    expect(periodLabrador.textContent).toBe('/ mo');
    expect(priceMastiff.textContent).toBe('$99');
    expect(periodMastiff.textContent).toBe('/ mo');
    expect(priceChihuahua.textContent).toBe('Free');
    expect(periodChihuahua.textContent).toBe('Forever complimentary');
  });

  it('updates price display to discounted annual rates while preserving free tier', () => {
    const manager = new PricingManager({
      toggleEl: billingToggle,
      priceElements: {
        chihuahua: priceChihuahua,
        labrador: priceLabrador,
        mastiff: priceMastiff,
      },
      periodElements: {
        chihuahua: periodChihuahua,
        labrador: periodLabrador,
        mastiff: periodMastiff,
      },
    });
    manager.init();

    manager.setBillingCycle(true);
    expect(manager.isAnnual).toBe(true);
    expect(priceLabrador.textContent).toBe('$39');
    expect(periodLabrador.textContent).toBe('/ mo (billed annually)');
    expect(priceMastiff.textContent).toBe('$79');
    expect(periodMastiff.textContent).toBe('/ mo (billed annually)');
    expect(priceChihuahua.textContent).toBe('Free');
    expect(periodChihuahua.textContent).toBe('Forever complimentary');

    // Toggle back
    manager.toggle();
    expect(manager.isAnnual).toBe(false);
    expect(priceLabrador.textContent).toBe('$49');
    expect(periodLabrador.textContent).toBe('/ mo');
    expect(priceMastiff.textContent).toBe('$99');
    expect(periodMastiff.textContent).toBe('/ mo');
    expect(priceChihuahua.textContent).toBe('Free');
    expect(periodChihuahua.textContent).toBe('Forever complimentary');
  });
});
