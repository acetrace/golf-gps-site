export type StatTone = 'volt' | 'gold';

export interface Stat {
  value: string;
  label: string;
  tone: StatTone;
}
