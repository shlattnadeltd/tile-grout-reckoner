/**
 * ONE icon library for the whole project — lucide at strokeWidth 1.5
 * (the NORDIC_MINIMAL mapping, rule #21). Never mix in a second set.
 */
import type { ComponentType } from 'react';

export type IconCmp = ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

export const ICON_STROKE = 1.5;
/** the only two icon sizes allowed inside a button (rule #20) */
export const BTN_ICON = 24;
/** the fixed size inside every StatCard / MaterialCard icon wrap */
export const CARD_ICON = 22;
