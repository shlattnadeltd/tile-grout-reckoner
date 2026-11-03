import { MAX_CUT_ROWS, TILES_PER_BOX } from '../constants/config';
import type { Pattern, Unit } from '../constants/config';
import { ceilTo, clamp, safeNum, toMm } from '../utils/format';

export type Exclusion = { id: string; w: string; h: string };

export type RoomDraft = {
  unit: Unit;
  width: string;
  height: string;
  exclusions: Exclusion[];
  tileW: number;
  tileH: number;
  thickness: number;
  joint: number;
  pattern: Pattern;
  waste: number;
  finish: number;
};

export type CutRow = { wall: string; count: number; mm: number };

export type Materials = {
  grossArea: number;
  netArea: number;
  widthMm: number;
  heightMm: number;
  cols: number;
  rows: number;
  tiles: number;
  boxes: number;
  tilesPerBox: number;
  groutKg: number;
  adhesiveKg: number;
  bags: number;
  notch: number;
  cuts: CutRow[];
  valid: boolean;
};

export const tileKey = (w: number, h: number) => `${w}x${h}`;

export const tilesPerBoxFor = (w: number, h: number): number => {
  const known = TILES_PER_BOX[tileKey(w, h)];
  if (known) {
    return known;
  }
  const m2 = (w * h) / 1e6;
  return Math.max(1, Math.round(1.44 / Math.max(m2, 0.0025)));
};

/** kg of adhesive per square metre, keyed off the largest tile dimension */
export const notchFor = (w: number, h: number): number => {
  const max = Math.max(w, h);
  if (max < 300) {
    return 3;
  }
  if (max < 600) {
    return 4;
  }
  return 5;
};

const EMPTY: Materials = {
  grossArea: 0,
  netArea: 0,
  widthMm: 0,
  heightMm: 0,
  cols: 4,
  rows: 4,
  tiles: 0,
  boxes: 0,
  tilesPerBox: 1,
  groutKg: 0,
  adhesiveKg: 0,
  bags: 0,
  notch: 4,
  cuts: [],
  valid: false,
};

export function computeMaterials(
  draft: RoomDraft,
  bagWeight: number,
): Materials {
  const w = safeNum(draft.width);
  const h = safeNum(draft.height);
  if (w <= 0 || h <= 0) {
    return EMPTY;
  }

  const widthMm = toMm(w, draft.unit);
  const heightMm = toMm(h, draft.unit);
  const grossArea = (widthMm * heightMm) / 1e6;

  const exclArea = draft.exclusions.reduce((sum, ex) => {
    const ew = safeNum(ex.w);
    const eh = safeNum(ex.h);
    if (ew <= 0 || eh <= 0) {
      return sum;
    }
    return sum + (toMm(ew, draft.unit) * toMm(eh, draft.unit)) / 1e6;
  }, 0);

  const netArea = Math.max(0.05, grossArea - exclArea);
  const share = clamp(netArea / grossArea, 0.05, 1);

  const tw = clamp(draft.tileW, 50, 1200);
  const th = clamp(draft.tileH, 50, 1200);
  const joint = clamp(draft.joint, 1, 12);
  const thickness = clamp(draft.thickness, 3, 20);

  const pitchX = tw + joint;
  const pitchY = th + joint;

  const colsExact = widthMm / pitchX;
  const rowsExact = heightMm / pitchY;

  const tilesExact = colsExact * rowsExact * share;
  const tiles = Math.max(1, Math.ceil(tilesExact * (1 + draft.waste / 100)));

  const tilesPerBox = tilesPerBoxFor(tw, th);
  const boxes = Math.max(1, Math.ceil(tiles / tilesPerBox));

  const groutRaw = (((tw + th) * joint * thickness * 1.6) / (tw * th)) * netArea;
  const groutKg = ceilTo(groutRaw, 0.1);

  const notch = notchFor(tw, th);
  const adhesiveKg = netArea * notch;
  const bags = Math.max(1, Math.ceil(adhesiveKg / Math.max(bagWeight, 1)));

  const edgeX = Math.round(widthMm - Math.floor(widthMm / pitchX) * pitchX);
  const edgeY = Math.round(heightMm - Math.floor(heightMm / pitchY) * pitchY);
  const colCount = Math.max(1, Math.ceil(colsExact));
  const rowCount = Math.max(1, Math.ceil(rowsExact));

  const cuts: CutRow[] = [
    { wall: 'NORTH WALL', count: colCount, mm: edgeY },
    { wall: 'EAST WALL', count: rowCount, mm: edgeX },
    { wall: 'SOUTH WALL', count: colCount, mm: edgeY },
    { wall: 'WEST WALL', count: rowCount, mm: edgeX },
  ]
    .filter(c => c.mm >= 1)
    .slice(0, MAX_CUT_ROWS);

  return {
    grossArea,
    netArea,
    widthMm,
    heightMm,
    cols: colCount,
    rows: rowCount,
    tiles,
    boxes,
    tilesPerBox,
    groutKg,
    adhesiveKg,
    bags,
    notch,
    cuts,
    valid: true,
  };
}

export type SavedRoom = {
  id: string;
  name: string;
  dims: string;
  tiles: number;
  boxes: number;
  groutKg: number;
  bags: number;
};

export type JobTotals = { tiles: number; groutKg: number; bags: number };

export const sumRooms = (rooms: SavedRoom[]): JobTotals =>
  rooms.reduce<JobTotals>(
    (acc, r) => ({
      tiles: acc.tiles + r.tiles,
      groutKg: Math.round((acc.groutKg + r.groutKg) * 10) / 10,
      bags: acc.bags + r.bags,
    }),
    { tiles: 0, groutKg: 0, bags: 0 },
  );

export type RoomResult = {
  name: string;
  dims: string;
  draft: RoomDraft;
  materials: Materials;
};

/** "3.20 x 2.60 m - 600x600 - 3 mm" */
export function describeRoom(draft: RoomDraft): string {
  const w = safeNum(draft.width).toFixed(2);
  const h = safeNum(draft.height).toFixed(2);
  return `${w} x ${h} ${draft.unit} - ${draft.tileW}x${draft.tileH} - ${draft.joint} mm`;
}
