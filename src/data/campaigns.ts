import type { GolfGpsSiteCampaign } from '../types/campaign';

export const APP_STORE_PROVIDER_TOKEN: string = '';
export const GOLF_GPS_APP_STORE_ID: string = '6762449303';
export const SITE_CAMPAIGN: GolfGpsSiteCampaign = 'web-gps-site';

export function appStoreUrl(campaign: GolfGpsSiteCampaign, providerToken: string): string {
  const params = new URLSearchParams();
  if (providerToken !== '') params.set('pt', providerToken);
  params.set('ct', campaign);
  params.set('mt', '8');
  return `https://apps.apple.com/app/apple-store/id${GOLF_GPS_APP_STORE_ID}?${params.toString()}`;
}

export const APP_STORE_URL: string = appStoreUrl(SITE_CAMPAIGN, APP_STORE_PROVIDER_TOKEN);
