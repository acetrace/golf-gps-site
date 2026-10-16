import type { FocusRect } from '../types/feature';

export function focusStyle(rect: FocusRect): string {
  return `--fx:${rect.x}%;--fy:${rect.y}%;--fw:${rect.width}%;--fh:${rect.height}%`;
}
