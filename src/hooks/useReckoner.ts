import { useCallback, useMemo, useRef, useState } from 'react';
import { DEFAULTS, MAX_EXCLUSIONS, TOTAL_STEPS } from '../constants/config';
import type { Pattern, Unit } from '../constants/config';
import { computeMaterials } from '../game/reckoner';
import type { Exclusion, Materials, RoomDraft } from '../game/reckoner';
import { clamp, fixed, fromMm, safeNum, toMm } from '../utils/format';

const makeDraft = (): RoomDraft => ({
  unit: DEFAULTS.unit,
  width: DEFAULTS.width,
  height: DEFAULTS.height,
  exclusions: [],
  tileW: DEFAULTS.tileW,
  tileH: DEFAULTS.tileH,
  thickness: DEFAULTS.thickness,
  joint: DEFAULTS.joint,
  pattern: DEFAULTS.pattern,
  waste: DEFAULTS.waste,
  finish: DEFAULTS.finish,
});

export type Reckoner = {
  step: number;
  draft: RoomDraft;
  materials: Materials;
  canAdvance: boolean;
  next: () => void;
  back: () => boolean;
  reset: () => void;
  setUnit: (u: Unit) => void;
  setField: (key: 'width' | 'height', value: string) => void;
  setTile: (w: number, h: number) => void;
  setNumber: (key: 'tileW' | 'tileH' | 'thickness' | 'joint', v: number) => void;
  setPattern: (p: Pattern) => void;
  setWaste: (w: number) => void;
  setFinish: (i: number) => void;
  addExclusion: () => void;
  updateExclusion: (id: string, key: 'w' | 'h', value: string) => void;
  removeExclusion: (id: string) => void;
};

/**
 * Owns the room draft. Components pull the individual slices they need
 * instead of subscribing to the whole object tree.
 */
export function useReckoner(bagWeight: number, defaultJoint: number, defaultWaste: number): Reckoner {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<RoomDraft>(() => ({
    ...makeDraft(),
    joint: defaultJoint,
    waste: defaultWaste,
  }));
  const seq = useRef(0);

  const materials = useMemo(
    () => computeMaterials(draft, bagWeight),
    [draft, bagWeight],
  );

  const canAdvance = materials.valid;

  const next = useCallback(() => {
    setStep(s => Math.min(TOTAL_STEPS, s + 1));
  }, []);

  /** returns false when there is no previous step (the caller should leave) */
  const back = useCallback(() => {
    let moved = false;
    setStep(s => {
      if (s > 1) {
        moved = true;
        return s - 1;
      }
      return s;
    });
    return moved;
  }, []);

  const reset = useCallback(() => {
    setStep(1);
    setDraft({ ...makeDraft(), joint: defaultJoint, waste: defaultWaste });
  }, [defaultJoint, defaultWaste]);

  const setUnit = useCallback((u: Unit) => {
    setDraft(d => {
      if (d.unit === u) {
        return d;
      }
      const conv = (v: string) => {
        const n = safeNum(v);
        return n > 0 ? fixed(fromMm(toMm(n, d.unit), u), 2) : v;
      };
      return {
        ...d,
        unit: u,
        width: conv(d.width),
        height: conv(d.height),
        exclusions: d.exclusions.map(ex => ({
          ...ex,
          w: conv(ex.w),
          h: conv(ex.h),
        })),
      };
    });
  }, []);

  const setField = useCallback((key: 'width' | 'height', value: string) => {
    const clean = value.replace(/[^0-9.,]/g, '').slice(0, 6);
    setDraft(d => ({ ...d, [key]: clean }));
  }, []);

  const setTile = useCallback((w: number, h: number) => {
    setDraft(d => ({ ...d, tileW: w, tileH: h }));
  }, []);

  const setNumber = useCallback(
    (key: 'tileW' | 'tileH' | 'thickness' | 'joint', v: number) => {
      setDraft(d => ({ ...d, [key]: v }));
    },
    [],
  );

  const setPattern = useCallback((p: Pattern) => {
    setDraft(d => ({ ...d, pattern: p }));
  }, []);

  const setWaste = useCallback((w: number) => {
    setDraft(d => ({ ...d, waste: clamp(w, 0, 20) }));
  }, []);

  const setFinish = useCallback((i: number) => {
    setDraft(d => ({ ...d, finish: i }));
  }, []);

  const addExclusion = useCallback(() => {
    setDraft(d => {
      if (d.exclusions.length >= MAX_EXCLUSIONS) {
        return d;
      }
      seq.current += 1;
      const ex: Exclusion = {
        id: `ex${seq.current}`,
        w: d.unit === 'm' ? '0.90' : '2.95',
        h: d.unit === 'm' ? '2.10' : '6.89',
      };
      return { ...d, exclusions: [...d.exclusions, ex] };
    });
  }, []);

  const updateExclusion = useCallback(
    (id: string, key: 'w' | 'h', value: string) => {
      const clean = value.replace(/[^0-9.,]/g, '').slice(0, 6);
      setDraft(d => ({
        ...d,
        exclusions: d.exclusions.map(ex =>
          ex.id === id ? { ...ex, [key]: clean } : ex,
        ),
      }));
    },
    [],
  );

  const removeExclusion = useCallback((id: string) => {
    setDraft(d => ({
      ...d,
      exclusions: d.exclusions.filter(ex => ex.id !== id),
    }));
  }, []);

  return {
    step,
    draft,
    materials,
    canAdvance,
    next,
    back,
    reset,
    setUnit,
    setField,
    setTile,
    setNumber,
    setPattern,
    setWaste,
    setFinish,
    addExclusion,
    updateExclusion,
    removeExclusion,
  };
}

export default useReckoner;
