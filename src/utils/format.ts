import { FT_TO_M, Unit } from '../constants/config';

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export const safeNum = (raw: string): number => {
  const n = parseFloat(String(raw).replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/** value typed in the active unit -> millimetres */
export const toMm = (value: number, unit: Unit): number =>
  unit === 'm' ? value * 1000 : value * FT_TO_M * 1000;

/** millimetres -> the active unit */
export const fromMm = (mm: number, unit: Unit): number =>
  unit === 'm' ? mm / 1000 : mm / 1000 / FT_TO_M;

export const fixed = (v: number, d: number): string => {
  if (!Number.isFinite(v)) {
    return (0).toFixed(d);
  }
  return v.toFixed(d);
};

export const formatLength = (value: number, unit: Unit): string =>
  `${fixed(value, 2)} ${unit}`;

/** ASCII `m2` / `ft2` only — no superscript glyphs (rule #15). */
export const formatArea = (m2: number, unit: Unit): string =>
  unit === 'm'
    ? `${fixed(m2, 2)} m2`
    : `${fixed(m2 / (FT_TO_M * FT_TO_M), 2)} ft2`;

export const formatKg = (kg: number): string => `${fixed(kg, 1)} kg`;

export const formatInt = (n: number): string =>
  Number.isFinite(n) ? String(Math.round(n)) : '0';

export const ceilTo = (v: number, step: number): number =>
  Math.ceil(v / step) * step;
