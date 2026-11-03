import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  ClipPath,
  Defs,
  G,
  Line,
  Pattern as SvgPattern,
  Rect,
} from 'react-native-svg';
import theme from '../constants/theme';
import type { BoardGeometry } from '../game/layout';
import type { Pattern } from '../constants/config';

type Props = {
  geo: BoardGeometry;
  jointPx: number;
  pattern: Pattern;
  /** fraction of the board (0..1) covered by door / window cut-outs */
  exclusions: { x: number; y: number; w: number; h: number }[];
};

/**
 * The grout bed is the board ground; every tile is inset by jointPx so the
 * ground shows through AS the joint. Widening the joint visibly thickens
 * every grout line — that is the main live feedback of the app.
 */
function PatternBoardBase({ geo, jointPx, pattern, exclusions }: Props) {
  const { cols, rows, cell } = geo;
  const innerW = cols * cell;
  const innerH = rows * cell;

  const tiles = useMemo(() => {
    const out: { key: string; x: number; y: number; w: number }[] = [];
    for (let r = 0; r < rows; r += 1) {
      const shift = pattern === 'offset' && r % 2 === 1 ? cell / 2 : 0;
      // one extra column so the shifted row still fills the right edge
      for (let c = -1; c <= cols; c += 1) {
        const x = c * cell + shift;
        if (x >= innerW || x + cell <= 0) {
          continue;
        }
        out.push({ key: `${r}-${c}`, x, y: r * cell, w: cell });
      }
    }
    return out;
  }, [cols, rows, cell, pattern, innerW]);

  const j = Math.max(1, jointPx);
  const tileSize = Math.max(2, cell - j * 2);

  return (
    <View style={styles.card}>
      <Svg width={innerW} height={innerH}>
        <Defs>
          <ClipPath id="board">
            <Rect x={0} y={0} width={innerW} height={innerH} />
          </ClipPath>
          <SvgPattern
            id="hatch"
            patternUnits="userSpaceOnUse"
            width={8}
            height={8}>
            <Line
              x1={0}
              y1={8}
              x2={8}
              y2={0}
              stroke={theme.colors.accent.slate}
              strokeWidth={1.4}
              strokeOpacity={0.28}
            />
          </SvgPattern>
        </Defs>

        <Rect
          x={0}
          y={0}
          width={innerW}
          height={innerH}
          fill={theme.colors.bg.alt}
        />

        <G clipPath="url(#board)">
          {tiles.map(t => (
            <Rect
              key={t.key}
              x={t.x + j}
              y={t.y + j}
              width={tileSize}
              height={tileSize}
              rx={1}
              fill={theme.colors.surface.card}
              stroke={theme.colors.ui.borderMuted}
              strokeWidth={0.5}
            />
          ))}

          {exclusions.map((ex, i) => (
            <Rect
              key={`ex${i}`}
              x={ex.x * innerW}
              y={ex.y * innerH}
              width={Math.max(4, ex.w * innerW)}
              height={Math.max(4, ex.h * innerH)}
              fill="url(#hatch)"
              stroke={theme.colors.accent.slate}
              strokeWidth={1}
              strokeOpacity={0.45}
            />
          ))}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 6,
    borderWidth: 2,
    borderColor: theme.colors.ui.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface.card,
    alignSelf: 'center',
    overflow: 'hidden',
  },
});

export const PatternBoard = memo(PatternBoardBase);
export default PatternBoard;
