import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

type Props = {
  width: number;
  height: number;
  pitch?: number;
  color: string;
  top?: number;
};

/** The setting-out grid — the recurring decor motif of the app. */
function HairlineGridBase({ width, height, pitch = 44, color, top = 0 }: Props) {
  const lines = useMemo(() => {
    const v: number[] = [];
    const h: number[] = [];
    for (let x = pitch; x < width; x += pitch) {
      v.push(x);
    }
    for (let y = pitch; y < height; y += pitch) {
      h.push(y);
    }
    return { v, h };
  }, [width, height, pitch]);

  return (
    <View pointerEvents="none" style={[styles.wrap, { top }]}>
      <Svg width={width} height={height}>
        {lines.v.map(x => (
          <Line
            key={`v${x}`}
            x1={x}
            y1={0}
            x2={x}
            y2={height}
            stroke={color}
            strokeWidth={1}
          />
        ))}
        {lines.h.map(y => (
          <Line
            key={`h${y}`}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke={color}
            strokeWidth={1}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0 },
});

export const HairlineGrid = memo(HairlineGridBase);
export default HairlineGrid;
