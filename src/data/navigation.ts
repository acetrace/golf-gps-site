import type { NavLink } from '../types/navigation';
import { FEATURES } from './features';

export const LEGAL_LINKS: readonly NavLink[] = [
  { href: '/privacy-policy/', label: 'Privacy policy' },
  { href: '/terms-of-service/', label: 'Terms of service' },
];

export const NAV_LINKS: readonly NavLink[] = [
  { href: `/#${FEATURES[0].id}`, label: 'Features' },
  { href: '/#pro', label: 'Pro' },
  { href: '/privacy-policy/', label: 'Privacy' },
  { href: '/terms-of-service/', label: 'Terms' },
];

export const PRODUCT_LINKS: readonly NavLink[] = [
  ...FEATURES.map((feature) => ({ href: `/#${feature.id}`, label: feature.eyebrow })),
  { href: '/#pro', label: 'Free and Pro' },
];
