import type { ImageMetadata } from 'astro';
import type { Stat } from './stat';

export interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FeatureDetail {
  id: string;
  label: string;
  body: string;
  readout: Stat;
  focus: FocusRect;
}

export interface Feature {
  id: string;
  eyebrow: string;
  pro: boolean;
  title: string;
  accent: string;
  body: string;
  screenshot: ImageMetadata;
  screenshotAlt: string;
  details: readonly FeatureDetail[];
}

export type SpotlightSide = 'left' | 'right';
