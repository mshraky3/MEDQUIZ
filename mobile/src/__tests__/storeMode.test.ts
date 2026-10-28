import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('expo-constants', () => ({ default: { expoConfig: { extra: {} } } }));

async function loadConfig(env: Record<string, string | undefined>) {
  vi.resetModules();
  for (const key of ['EXPO_PUBLIC_STORE_MODE', 'EXPO_PUBLIC_WEBSITE_SUBSCRIBE_BUTTON', 'EXPO_PUBLIC_IN_APP_CHECKOUT']) {
    if (env[key] === undefined) delete process.env[key];
    else process.env[key] = env[key];
  }
  return import('../config');
}

afterEach(() => {
  delete process.env.EXPO_PUBLIC_STORE_MODE;
  delete process.env.EXPO_PUBLIC_WEBSITE_SUBSCRIBE_BUTTON;
  delete process.env.EXPO_PUBLIC_IN_APP_CHECKOUT;
});

describe('Play build (sign-in only) switches', () => {
  it('a normal build keeps checkout on and the Play switches off', async () => {
    const c = await loadConfig({});
    expect(c.PLAY_BUILD).toBe(false);
    expect(c.IN_APP_CHECKOUT_ENABLED).toBe(true);
    expect(c.WEBSITE_SUBSCRIBE_BUTTON).toBe(false);
  });

  it('EXPO_PUBLIC_STORE_MODE=play turns the card form off and hides the website button by default', async () => {
    const c = await loadConfig({ EXPO_PUBLIC_STORE_MODE: 'play' });
    expect(c.PLAY_BUILD).toBe(true);
    expect(c.IN_APP_CHECKOUT_ENABLED).toBe(false);
    expect(c.WEBSITE_SUBSCRIBE_BUTTON).toBe(false);
  });

  it('the website button needs the Play build AND exactly "true"', async () => {
    expect((await loadConfig({ EXPO_PUBLIC_STORE_MODE: 'play', EXPO_PUBLIC_WEBSITE_SUBSCRIBE_BUTTON: 'true' })).WEBSITE_SUBSCRIBE_BUTTON).toBe(true);
    expect((await loadConfig({ EXPO_PUBLIC_STORE_MODE: 'play', EXPO_PUBLIC_WEBSITE_SUBSCRIBE_BUTTON: '1' })).WEBSITE_SUBSCRIBE_BUTTON).toBe(false);
    expect((await loadConfig({ EXPO_PUBLIC_WEBSITE_SUBSCRIBE_BUTTON: 'true' })).WEBSITE_SUBSCRIBE_BUTTON).toBe(false);
  });
});
