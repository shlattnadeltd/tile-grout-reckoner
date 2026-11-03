import { Dimensions } from 'react-native';

export const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/**
 * 8000ms EXACTLY (rule #13). Anything shorter races the screenshot window on
 * the emulator and the Loader has already swapped to Menu when the frame lands.
 */
export const LOADER_DURATION_MS = 8000;

export const TOTAL_STEPS = 4;

export const STEP_LABELS = [
  'STEP 1 OF 4 - SURFACE',
  'STEP 2 OF 4 - TILE PICKER',
  'STEP 3 OF 4 - PATTERN',
  'STEP 4 OF 4 - WASTE MARGIN',
];

export type Unit = 'm' | 'ft';
export type Pattern = 'straight' | 'offset';

export const FT_TO_M = 0.3048;

/** Board geometry (rules #4, #5) */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_MAX_H = 170;
export const BOARD_PAD = 6;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 8
export const MIN_CELL = 24;

/** Tile presets, millimetres */
export const TILE_PRESETS: { label: string; w: number; h: number }[] = [
  { label: '300x300', w: 300, h: 300 },
  { label: '600x600', w: 600, h: 600 },
  { label: '600x300', w: 600, h: 300 },
  { label: '200x200', w: 200, h: 200 },
];

export const TILES_PER_BOX: Record<string, number> = {
  '600x600': 4,
  '600x300': 8,
  '300x300': 11,
  '200x200': 25,
};

export const WASTE_STOPS = [0, 5, 10, 15, 20];
export const BAG_WEIGHTS = [10, 20, 25];

export const JOINT_MIN = 1;
export const JOINT_MAX = 12;
export const THICKNESS_MIN = 3;
export const THICKNESS_MAX = 20;
export const TILE_DIM_MIN = 50;
export const TILE_DIM_MAX = 1200;

export const MAX_EXCLUSIONS = 2;
export const MAX_CUT_ROWS = 3;

export const DEFAULTS = {
  unit: 'm' as Unit,
  /** Pre-filled with a realistic room so the flow is never blocked on an empty field. */
  width: '3.20',
  height: '2.60',
  tileW: 600,
  tileH: 600,
  thickness: 8,
  joint: 3,
  waste: 10,
  pattern: 'offset' as Pattern,
  bagWeight: 20,
  haptics: true,
  finish: 0,
};

export const FINISH_LABELS = ['MATT', 'GLOSS', 'STONE', 'WOOD'];

export const TIPS: string[] = [
  'Dry-lay one full row before you spread any adhesive.',
  'Start from the most visible wall, hide the cut row behind the door.',
  'Mix grout in small batches - it stiffens in about twenty minutes.',
  'A 3 mm joint suits rectified tiles; pressed tiles want 4 to 5 mm.',
  'Leave a 5 mm expansion gap at every wall, the skirting covers it.',
  'Back-butter tiles over 400 mm so the bed has no voids.',
  'Clean the joints with a damp sponge before the grout hazes over.',
  'Buy one spare box per room - the same batch colour is hard to re-order.',
];

export const DECIMALS = { length: 2, area: 2, grout: 1 };
