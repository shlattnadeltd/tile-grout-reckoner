import {
  BOARD_FRAME,
  BOARD_MAX_H,
  BOARD_MAX_W,
  MIN_CELL,
} from '../constants/config';
import { clamp } from '../utils/format';

export type BoardGeometry = {
  cols: number;
  rows: number;
  cell: number;
  /** outer width/height INCLUDING the 2 * BOARD_FRAME (padding + border) */
  boardW: number;
  boardH: number;
  frame: number;
};

/**
 * Rule #4: the parent's padding + border are part of the outer box, so the
 * cell is solved from (max - 2 * FRAME) and the board is rebuilt from the
 * rounded cell. Overflow is 0 by construction.
 */
export function solveBoard(
  colsWanted: number,
  rowsWanted: number,
): BoardGeometry {
  const cols = clamp(Math.round(colsWanted) || 4, 3, 10);
  const rows = clamp(Math.round(rowsWanted) || 4, 3, 8);

  const innerW = BOARD_MAX_W - 2 * BOARD_FRAME;
  const innerH = BOARD_MAX_H - 2 * BOARD_FRAME;

  const cellW = Math.floor(innerW / cols);
  const cellH = Math.floor(innerH / rows);
  const cell = Math.max(MIN_CELL, Math.min(cellW, cellH));

  return {
    cols,
    rows,
    cell,
    boardW: cell * cols + 2 * BOARD_FRAME,
    boardH: cell * rows + 2 * BOARD_FRAME,
    frame: BOARD_FRAME,
  };
}

/** grout line thickness in board pixels, derived from the real joint in mm */
export function jointToPx(jointMm: number, tileMm: number, cell: number) {
  const ratio = jointMm / Math.max(tileMm + jointMm, 1);
  return clamp(Math.round(ratio * cell * 2.6 * 10) / 10, 1, Math.max(1, cell / 5));
}
