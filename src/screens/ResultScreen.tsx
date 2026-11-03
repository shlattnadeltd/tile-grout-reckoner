import React from 'react';
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Droplet, Layers, Package, RotateCcw } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import { SCREEN_W } from '../constants/config';
import type { JobTotals, RoomResult } from '../game/reckoner';
import { fixed } from '../utils/format';
import ScreenHeader from '../components/ScreenHeader';
import HairlineGrid from '../components/HairlineGrid';
import MaterialCard from '../components/MaterialCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

type Props = {
  result: RoomResult;
  totals: JobTotals;
  roomsCount: number;
  onPlayAgain: () => void;
  onMenu: () => void;
};

export default function ResultScreen({
  result,
  totals,
  roomsCount,
  onPlayAgain,
  onMenu,
}: Props) {
  const { materials, draft, dims } = result;

  // Rendered straight off the computed materials. A count-up animation used to
  // paint the first frame mid-flight, so a screenshot caught "0 BAGS" above a
  // "41.6 kg" subtitle and "5 BOXES" above "26 tiles" - the card contradicted
  // itself and the game screen it came from.
  const boxes = String(materials.boxes);
  const grout = fixed(materials.groutKg, 1);
  const bags = String(materials.bags);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ImageBackground source={assets.bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={theme.gradients.result}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.4, y: 1 }}
          style={styles.overlay}>
          <HairlineGrid
            width={SCREEN_W}
            height={260}
            pitch={44}
            color={theme.colors.ui.gridLight}
          />
          <View pointerEvents="none" style={styles.blob} />

          <ScreenHeader
            bordered={false}
            style={styles.header}
            title="MATERIALS SUMMARY"
          />

          <View style={styles.body}>
            <Text style={styles.roomLine} numberOfLines={1}>
              {dims}
            </Text>

            <View style={styles.cards}>
              <MaterialCard
                index={0}
                Icon={Package}
                value={`${boxes} BOXES`}
                sub={`${materials.tiles} tiles, ${draft.tileW}x${draft.tileH}, ${draft.pattern}`}
                accent={theme.colors.accent.coral}
              />
              <MaterialCard
                index={1}
                Icon={Droplet}
                value={`${grout} KG GROUT`}
                sub={`${draft.joint} mm joint, ${draft.thickness} mm thickness`}
                accent={theme.colors.accent.slate}
              />
              <MaterialCard
                index={2}
                Icon={Layers}
                value={`${bags} BAGS ADHESIVE`}
                sub={`${fixed(materials.adhesiveKg, 1)} kg at ${materials.notch} kg per m2`}
                accent={theme.colors.accent.ink}
              />
            </View>

            {materials.cuts.length > 0 ? (
              <View style={styles.planner}>
                <Text style={styles.plannerTitle}>CUT PLANNER</Text>
                {materials.cuts.map((c, i) => (
                  <View
                    key={c.wall}
                    style={[styles.cutRow, i === 0 ? styles.cutFirst : null]}>
                    <Text style={styles.cutWall} numberOfLines={1}>
                      {c.wall}
                    </Text>
                    <Text style={styles.cutValue}>
                      {`${c.count} CUTS AT ${c.mm} mm`}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            {roomsCount > 0 ? (
              <View style={styles.shopping}>
                <Text style={styles.shoppingTitle}>
                  {`ALL ROOMS - ${roomsCount} ${
                    roomsCount === 1 ? 'SURFACE' : 'SURFACES'
                  }`}
                </Text>
                <View style={styles.shoppingRow}>
                  <View style={styles.shopCell}>
                    <Text style={styles.shopValue}>{totals.tiles}</Text>
                    <Text style={styles.shopLabel}>TILES</Text>
                  </View>
                  <View style={styles.shopCell}>
                    <Text style={styles.shopValue}>
                      {fixed(totals.groutKg, 1)}
                    </Text>
                    <Text style={styles.shopLabel}>GROUT KG</Text>
                  </View>
                  <View style={styles.shopCell}>
                    <Text style={styles.shopValue}>{totals.bags}</Text>
                    <Text style={styles.shopLabel}>BAGS</Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>

          <View style={styles.ctaBlock}>
            <PrimaryButton
              label="MEASURE AGAIN"
              Icon={RotateCcw}
              onPress={onPlayAgain}
            />
            <SecondaryButton label="BACK TO JOB LIST" onPress={onMenu} />
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.alt },
  bg: { flex: 1 },
  overlay: { flex: 1 },
  header: { backgroundColor: 'transparent', minHeight: theme.headerTop + 48 },
  blob: {
    position: 'absolute',
    top: -60,
    right: -50,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(242,107,56,0.07)',
  },

  body: { flex: 1, paddingHorizontal: 20, gap: 12 },
  roomLine: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  cards: { gap: 10 },

  planner: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  plannerTitle: {
    ...theme.typography.section,
    color: theme.colors.text.secondary,
    marginBottom: 6,
  },
  cutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
  },
  cutFirst: { borderTopWidth: 0 },
  cutWall: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  cutValue: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.accent.slate,
    fontVariant: ['tabular-nums'],
  },

  shopping: {
    backgroundColor: theme.colors.surface.tint,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  shoppingTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
  },
  shoppingRow: { flexDirection: 'row' },
  shopCell: { flex: 1, gap: 2 },
  shopValue: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  shopLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
  },

  ctaBlock: { marginHorizontal: 20, marginBottom: 24, marginTop: 12, gap: 14 },
});
