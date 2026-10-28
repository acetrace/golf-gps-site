import { describe, expect, it } from 'vitest';
import { APP_STORE_URL, appStoreUrl } from './campaigns';

describe('appStoreUrl', () => {
  it('tags the site campaign and leaves pt out while the provider token is empty', () => {
    expect(APP_STORE_URL).toBe('https://apps.apple.com/app/apple-store/id6762449303?ct=web-gps-site&mt=8');
  });

  it('carries the provider token once it is set', () => {
    expect(appStoreUrl('web-gps-site', '123456')).toBe('https://apps.apple.com/app/apple-store/id6762449303?pt=123456&ct=web-gps-site&mt=8');
  });
});
