import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

const html = readFileSync('public/bloom.html', 'utf8');
const start = html.indexOf('const TELEBIRR_PAYMENT =');
const end = html.indexOf('\nasync function shareLink(){', start);
const paymentCode = html.slice(start, end);

describe('Manual Telebirr sharing', () => {
  it('uses the requested 100 ETB payment destination', () => {
    const payment = runInNewContext(paymentCode + '\nTELEBIRR_PAYMENT');
    expect(payment).toEqual({ amount: 100, currency: 'ETB', phone: '0921603875', recipient: 'Awel Kedir' });
  });

  it('copies the exact Telebirr phone number', async () => {
    const writeText = vi.fn();
    await runInNewContext(paymentCode + '\ncopyTelebirrNumber();', { navigator: { clipboard: { writeText } }, toast: vi.fn() });
    expect(writeText).toHaveBeenCalledWith('0921603875');
  });

  it('does not share without a confirmation SMS or transaction number', async () => {
    const shareLink = vi.fn();
    const elements: Record<string, { value?: string; hidden?: boolean; textContent?: string; focus?: () => void }> = {
      '#telebirr-confirmation': { value: '   ', focus: vi.fn() },
      '#payment-error': { hidden: true },
      '#share-result': { hidden: true },
    };
    await runInNewContext(paymentCode + '\npayAndShare();', { $: (key: string) => elements[key], shareLink, openShareModal: vi.fn() });
    expect(shareLink).not.toHaveBeenCalled();
    expect(elements['#payment-error']?.hidden).toBe(false);
    expect(elements['#share-result']?.hidden).toBe(true);
  });

  it.each(['TX123456789', 'Telebirr: You have sent ETB 100. Transaction No TX123456789.'])(
    'allows manual sharing with a reference: %s', async (value) => {
      const shareLink = vi.fn();
      const elements: Record<string, { value?: string; hidden?: boolean }> = {
        '#telebirr-confirmation': { value }, '#payment-error': { hidden: true }, '#share-result': { hidden: true },
      };
      await runInNewContext(paymentCode + '\npayAndShare();', { $: (key: string) => elements[key], shareLink });
      expect(shareLink).toHaveBeenCalledOnce();
      expect(elements['#share-result']?.hidden).toBe(false);
    },
  );
});