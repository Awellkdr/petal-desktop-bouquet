import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

const html = readFileSync('public/bloom.html', 'utf8');
const start = html.indexOf('function maybeLoadHash(){');
const end = html.indexOf('\nmaybeLoadHash();', start);
const code = html.slice(start, end) + '\nmaybeLoadHash(); state;';

function load(hash: string, native = false) {
  const bouquet = { flowers: [{ id: 'f1', species: 'Orchid' }], greens: [], gift: { message: 'Just for you' }, selectedId: 'f1', cardMinimized: true, widgetMode: true };
  return runInNewContext(code, {
    state: { recipientMode: false, widgetMode: false, transparentBg: false },
    window: native ? { bloomDesktop: {} } : {}, location: { hash }, nextId: 2,
    atob: () => JSON.stringify(bouquet), escape, decodeURIComponent,
    safeImported: (value: unknown) => value, setTimeout: () => {},
  });
}

describe('Recipient gift entry', () => {
  it('opens gift links read-only with the note expanded and no selected flower', () => {
    const state = load('#gift=payload');
    expect(state.recipientMode).toBe(true);
    expect(state.previewGift).toBe(true);
    expect(state.cardMinimized).toBe(false);
    expect(state.selectedId).toBe(null);
    expect(state.widgetMode).toBe(false);
    expect(state.gift.message).toBe('Just for you');
    expect(state.flowers[0].species).toBe('Orchid');
  });

  it('keeps desktop gifts transparent and separate from the browser recipient layout', () => {
    for (const state of [load('#widget=payload'), load('#gift=payload', true)]) {
      expect(state.recipientMode).toBe(false);
      expect(state.widgetMode).toBe(true);
      expect(state.transparentBg).toBe(true);
    }
  });

  it('keeps new bouquet and preset links in the editor', () => {
    for (const hash of ['#new', '#preset=blush-romance', '']) {
      expect(load(hash).recipientMode).toBe(false);
      expect(load(hash).widgetMode).toBe(false);
    }
  });
});