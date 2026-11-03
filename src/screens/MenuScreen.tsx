import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  ImageBackground,
  ListRenderItemInfo,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  BookOpen,
  ClipboardList,
  Droplet,
  LayoutGrid,
  Layers,
  Plus,
  Ruler,
  Settings,
} from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import {
  BAG_WEIGHTS,
  JOINT_MAX,
  JOINT_MIN,
  SCREEN_W,
  TIPS,
  WASTE_STOPS,
} from '../constants/config';
import type { Unit } from '../constants/config';
import type { JobTotals, SavedRoom } from '../game/reckoner';
import { fixed } from '../utils/format';
import ScreenHeader from '../components/ScreenHeader';
import IconButton from '../components/IconButton';
import HairlineGrid from '../components/HairlineGrid';
import RoomCard from '../components/RoomCard';
import StatCard from '../components/StatCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import SheetModal from '../components/SheetModal';
import StepperSlider from '../components/StepperSlider';
import TileChip from '../components/TileChip';
import UnitToggle from '../components/UnitToggle';
import { ICON_STROKE } from '../components/icons';

export type Settings = {
  unit: Unit;
  joint: number;
  waste: number;
  bagWeight: number;
  haptics: boolean;
};

/** cells of the 2x2 tile sample beside the wordmark */
const HERO_TILES = [0, 1, 2, 3];

type Props = {
  rooms: SavedRoom[];
  totals: JobTotals;
  activeId: string | null;
  settings: Settings;
  onChangeSettings: (patch: Partial<Settings>) => void;
  onStart: () => void;
  onOpenTotals: () => void;
  onSelectRoom: (id: string) => void;
  onRemoveRoom: (id: string) => void;
};

export default function MenuScreen({
  rooms,
  totals,
  activeId,
  settings,
  onChangeSettings,
  onStart,
  onOpenTotals,
  onSelectRoom,
  onRemoveRoom,
}: Props) {
  const [sheet, setSheet] = useState<'none' | 'settings' | 'tips'>('none');
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const heroShift = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  const openSettings = useCallback(() => setSheet('settings'), []);
  const openTips = useCallback(() => setSheet('tips'), []);
  const closeSheet = useCallback(() => setSheet('none'), []);

  const setUnit = useCallback(
    (u: Unit) => onChangeSettings({ unit: u }),
    [onChangeSettings],
  );
  const setJoint = useCallback(
    (v: number) => onChangeSettings({ joint: Math.round(v) }),
    [onChangeSettings],
  );

  const renderRoom = useCallback(
    ({ item, index }: ListRenderItemInfo<SavedRoom>) => (
      <RoomCard
        name={item.name}
        dims={item.dims}
        tiles={item.tiles}
        active={item.id === activeId}
        index={index}
        onPress={() => onSelectRoom(item.id)}
        onRemove={() => onRemoveRoom(item.id)}
      />
    ),
    [activeId, onSelectRoom, onRemoveRoom],
  );

  const keyExtractor = useCallback((item: SavedRoom) => item.id, []);

  /** a lone pill looks orphaned, so the strip needs at least two values */
  const filledStats = useMemo(
    () =>
      [totals.tiles > 0, totals.groutKg > 0, totals.bags > 0].filter(Boolean)
        .length,
    [totals],
  );

  const empty = (
    <View style={styles.emptyCard}>
      <Ruler
        size={28}
        strokeWidth={ICON_STROKE}
        color={theme.colors.ui.borderMuted}
      />
      <Text style={styles.emptyTitle}>NO ROOMS YET</Text>
      <Text style={styles.emptyBody}>
        Add your first surface to get a materials list
      </Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ImageBackground source={assets.bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={theme.gradients.menu}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.2, y: 1 }}
          style={styles.overlay}>
          <HairlineGrid
            width={SCREEN_W}
            height={320}
            pitch={44}
            color={theme.colors.ui.gridLight}
          />
          <View pointerEvents="none" style={styles.blob} />

          <ScreenHeader
            bordered={false}
            style={styles.header}
            leftSlot={<IconButton Icon={ClipboardList} label="Job list" />}
            rightSlot={
              <>
                <IconButton
                  Icon={Settings}
                  label="Reckoner settings"
                  onPress={openSettings}
                />
                <IconButton
                  Icon={BookOpen}
                  label="Tips deck"
                  onPress={openTips}
                />
              </>
            }
          />

          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.hero,
              { opacity: enter, transform: [{ translateY: heroShift }] },
            ]}>
            <View style={styles.heroText}>
              <Text style={styles.heroTop}>TILE GROUT</Text>
              <Text style={styles.heroBottom}>RECKONER</Text>
              <View style={styles.rule} />
              <Text style={styles.tagline}>
                TILES - GROUT - ADHESIVE, FIGURED EXACTLY
              </Text>
            </View>
            {/* A 2x2 tile sample drawn in code. The Codex sprite that used to
                sit here is playing-card art (a red heart), which says nothing
                about tiling. */}
            <View pointerEvents="none" style={styles.heroArt}>
              {HERO_TILES.map(i => (
                <View
                  key={i}
                  style={[
                    styles.heroTile,
                    i === 0 || i === 3 ? styles.heroTileAlt : null,
                  ]}
                />
              ))}
            </View>
          </Animated.View>

          <View style={styles.listWrap}>
            <Text style={styles.sectionLabel}>JOB LIST</Text>
            <FlatList
              data={rooms}
              renderItem={renderRoom}
              keyExtractor={keyExtractor}
              ListEmptyComponent={empty}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </View>

          {filledStats >= 2 ? (
            <View style={styles.statsRow}>
              <View style={styles.statSlot}>
                <StatCard
                  Icon={LayoutGrid}
                  value={String(totals.tiles)}
                  label="TILES"
                  valueColor={theme.colors.accent.coral}
                />
              </View>
              <View style={styles.statSlot}>
                <StatCard
                  Icon={Droplet}
                  value={fixed(totals.groutKg, 1)}
                  label="GROUT KG"
                  valueColor={theme.colors.accent.slate}
                />
              </View>
              <View style={styles.statSlot}>
                <StatCard
                  Icon={Layers}
                  value={String(totals.bags)}
                  label="ADHESIVE"
                  valueColor={theme.colors.accent.ink}
                />
              </View>
            </View>
          ) : null}

          <View style={styles.ctaBlock}>
            <PrimaryButton
              label="START NEW ROOM"
              Icon={Plus}
              onPress={onStart}
            />
            <SecondaryButton
              label="OPEN SHOPPING TOTAL"
              onPress={onOpenTotals}
              disabled={rooms.length === 0}
            />
          </View>
        </LinearGradient>
      </ImageBackground>

      <SheetModal
        visible={sheet === 'settings'}
        title="RECKONER SETTINGS"
        onClose={closeSheet}>
        <View style={styles.sheetRow}>
          <Text style={styles.sheetLabel}>UNIT SYSTEM</Text>
          <UnitToggle unit={settings.unit} onChange={setUnit} />
        </View>

        <StepperSlider
          label="DEFAULT JOINT WIDTH"
          value={settings.joint}
          min={JOINT_MIN}
          max={JOINT_MAX}
          step={1}
          unit=" mm"
          onChange={setJoint}
        />

        <View>
          <Text style={styles.sheetLabel}>DEFAULT WASTE MARGIN</Text>
          <View style={styles.chipRow}>
            {WASTE_STOPS.map(w => (
              <TileChip
                key={w}
                width={58}
                label={`${w}%`}
                active={settings.waste === w}
                onPress={() => onChangeSettings({ waste: w })}
              />
            ))}
          </View>
        </View>

        <View>
          <Text style={styles.sheetLabel}>ADHESIVE BAG WEIGHT</Text>
          <View style={styles.chipRow}>
            {BAG_WEIGHTS.map(b => (
              <TileChip
                key={b}
                width={70}
                label={`${b} kg`}
                active={settings.bagWeight === b}
                onPress={() => onChangeSettings({ bagWeight: b })}
              />
            ))}
            <TileChip
              width={96}
              label={settings.haptics ? 'HAPTICS ON' : 'HAPTICS OFF'}
              active={settings.haptics}
              onPress={() => onChangeSettings({ haptics: !settings.haptics })}
            />
          </View>
        </View>
      </SheetModal>

      <SheetModal visible={sheet === 'tips'} title="TIPS DECK" onClose={closeSheet}>
        <FlatList
          data={TIPS}
          keyExtractor={(_, i) => `tip${i}`}
          style={styles.tipList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={styles.tipRow}>
              <View style={styles.tipChip}>
                <Text style={styles.tipChipText}>
                  {`[${String(index + 1).padStart(2, '0')}]`}
                </Text>
              </View>
              <Text style={styles.tipText}>{item}</Text>
            </View>
          )}
        />
      </SheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  bg: { flex: 1 },
  overlay: { flex: 1 },
  header: { backgroundColor: 'transparent', minHeight: theme.headerTop + 48 },
  blob: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(47,72,88,0.06)',
  },

  hero: {
    paddingHorizontal: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroText: { flex: 1, paddingRight: 12 },
  heroTop: {
    ...theme.typography.hero,
    color: theme.colors.text.primary,
  },
  heroBottom: {
    ...theme.typography.hero,
    color: theme.colors.accent.slate,
  },
  rule: {
    width: 56,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.accent.coral,
    marginTop: 12,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: theme.colors.text.secondary,
    marginTop: 12,
  },
  heroArt: {
    width: 108,
    height: 108,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderMuted,
    backgroundColor: theme.colors.surface.card,
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  heroTile: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.surface.tint,
  },
  heroTileAlt: { backgroundColor: theme.colors.surface.coralTint },

  listWrap: { flex: 1, paddingHorizontal: 20, marginTop: 18 },
  sectionLabel: {
    ...theme.typography.section,
    color: theme.colors.text.secondary,
    marginBottom: 10,
  },
  listContent: { paddingBottom: 8 },

  emptyCard: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.ui.borderMuted,
    borderRadius: theme.radius.lg,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
  },
  emptyBody: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text.muted,
    textAlign: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  statSlot: { flex: 1 },

  ctaBlock: {
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 14,
  },

  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetLabel: {
    ...theme.typography.micro,
    color: theme.colors.text.secondary,
    marginBottom: 10,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  tipList: { maxHeight: 320 },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  tipChip: {
    width: 40,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface.coralTint,
  },
  tipChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.accent.coral,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: theme.colors.text.primary,
  },
});
