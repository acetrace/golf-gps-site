import type { TierRow } from '../types/plan';

export const TIER_ROWS: readonly TierRow[] = [
  { label: 'GPS yardage to the pin', free: true, pro: true },
  { label: 'Live scorecard', free: true, pro: true },
  { label: 'Round history and sharing', free: true, pro: true },
  { label: 'Estimated handicap', free: false, pro: true },
  { label: 'Stats and trends', free: false, pro: true },
  { label: 'Shot tracking', free: false, pro: true },
];
