import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ArrowRight,
  Calculator,
  ChevronLeft,
  Plus,
} from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import {
  FINISH_LABELS,
  JOINT_MAX,
  JOINT_MIN,
  MAX_EXCLUSIONS,
  STEP_LABELS,
  THICKNESS_MAX,
  THICKNESS_MIN,
  TILE_DIM_MAX,
  TILE_DIM_MIN,
  TILE_PRESETS,
  TOTAL_STEPS,
  WASTE_STOPS,
} from '../constants/config';
import { jointToPx, solveBoard } from '../game/layout';
import { describeRoom } from '../game/reckoner';
import type { RoomResult, SavedRoom } from '../game/reckoner';
import { clamp, formatArea, safeNum } from '../utils/format';
import useReckoner from '../hooks/useReckoner';
import ScreenHeader from '../components/ScreenHeader';
import IconButton from '../components/IconButton';
import StepStrip from '../components/StepStrip';
import UnitToggle from '../components/UnitToggle';
import NumericField from '../components/NumericField';
import ExclusionRow from '../components/ExclusionRow';
import TileChip from '../components/TileChip';
import StepperSlider from '../components/StepperSlider';
import PatternBoard from '../components/PatternBoard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import Toast from '../components/Toast';
import { ICON_STROKE } from '../components/icons';
import type { Settings } from './MenuScreen';

type Props = {
  settings: Settings;
  roomName: string;
  onBack: () => void;
  onGameOver: (result: RoomResult) => void;
  onSaveRoom: (room: Omit<SavedRoom, 'id'>, snapshot: RoomResult) => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * Finish swatches are drawn in code, one tone per FINISH_LABELS entry. The
 * Codex sprite set turned out to be playing-card suit art - wrong subject for
 * a tiling estimator, and two of the four shared the same spade motif.
 */
const FINISH_TONES = ['#C7CCD1', '#EEF1F4', '#A8A296', '#B98049'];

export default function GameScreen({
  settings,
  roomName,
  onBack,
  onGameOver,
  onSaveRoom,
}: Props) {
  const r = useReckoner(settings.bagWeight, settings.joint, settings.waste);
  const { step, draft, materials } = r;

  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enter = useRef(new Animated.Value(0)).current;
  const badge = useRef(new Animated.Value(1)).current;
  const lastTiles = useRef(materials.tiles);

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: theme.animation.screen,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  useEffect(() => {
    if (lastTiles.current === materials.tiles) {
      return;
    }
    lastTiles.current = materials.tiles;
    Animated.sequence([
      Animated.timing(badge, {
        toValue: 1.08,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(badge, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, [materials.tiles, badge]);

  useEffect(
    () => () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    },
    [],
  );

  const unitLabel = draft.unit;

  const geo = useMemo(
    () => solveBoard(materials.cols, materials.rows),
    [materials.cols, materials.rows],
  );

  const jointPx = useMemo(
    () => jointToPx(draft.joint, Math.min(draft.tileW, draft.tileH), geo.cell),
    [draft.joint, draft.tileW, draft.tileH, geo.cell],
  );

  /** door / window cut-outs as fractions of the board rect */
  const boardExclusions = useMemo(() => {
    const W = safeNum(draft.width);
    const H = safeNum(draft.height);
    if (W <= 0 || H <= 0) {
      return [];
    }
    return draft.exclusions
      .map((ex, i) => {
        const w = clamp(safeNum(ex.w) / W, 0.04, 0.5);
        const h = clamp(safeNum(ex.h) / H, 0.04, 0.9);
        return { x: clamp(0.06 + i * 0.46, 0, 1 - w), y: 1 - h, w, h };
      })
      .filter(ex => ex.w > 0 && ex.h > 0);
  }, [draft.exclusions, draft.width, draft.height]);

  const handleBack = useCallback(() => {
    if (!r.back()) {
      onBack();
    }
  }, [r, onBack]);

  const buildResult = useCallback(
    (): RoomResult => ({
      name: roomName,
      dims: describeRoom(draft),
      draft,
      materials,
    }),
    [roomName, draft, materials],
  );

  const handlePrimary = useCallback(() => {
    if (step < TOTAL_STEPS) {
      r.next();
      return;
    }
    onGameOver(buildResult());
  }, [step, r, onGameOver, buildResult]);

  const handleSave = useCallback(() => {
    onSaveRoom(
      {
        name: roomName,
        dims: describeRoom(draft),
        tiles: materials.tiles,
        boxes: materials.boxes,
        groutKg: materials.groutKg,
        bags: materials.bags,
      },
      buildResult(),
    );
    if (settings.haptics) {
      Vibration.vibrate(12);
    }
    setToast(true);
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(
      () => setToast(false),
      theme.animation.toast,
    );
  }, [onSaveRoom, roomName, draft, materials, settings.haptics, buildResult]);

  const setWidth = useCallback((v: string) => r.setField('width', v), [r]);
  const setHeight = useCallback((v: string) => r.setField('height', v), [r]);

  const contentShift = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const activeTile = `${draft.tileW}x${draft.tileH}`;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ImageBackground source={assets.bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={theme.gradients.game}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.overlay}>
          <ScreenHeader
            leftSlot={
              <IconButton
                Icon={ChevronLeft}
                label="Back"
                onPress={handleBack}
              />
            }
            centerSlot={<StepStrip step={step} total={TOTAL_STEPS} />}
            subtitle={STEP_LABELS[step - 1]}
            rightSlot={<UnitToggle unit={draft.unit} onChange={r.setUnit} />}
          />

          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.body,
              { opacity: enter, transform: [{ translateY: contentShift }] },
            ]}>
            <View style={styles.boardWrap}>
              <PatternBoard
                geo={geo}
                jointPx={jointPx}
                pattern={draft.pattern}
                exclusions={boardExclusions}
              />
              <View style={styles.boardCaption}>
                <View style={styles.patternToggle}>
                  <TileChip
                    width={76}
                    label="STRAIGHT"
                    active={draft.pattern === 'straight'}
                    onPress={() => r.setPattern('straight')}
                  />
                  <TileChip
                    width={62}
                    label="OFFSET"
                    active={draft.pattern === 'offset'}
                    onPress={() => r.setPattern('offset')}
                  />
                </View>
                <Text style={styles.boardMeta} numberOfLines={1}>
                  {`${materials.cols} ACROSS - ${materials.rows} ROWS`}
                </Text>
              </View>
            </View>

            <View style={styles.panel}>
              {step === 1 ? (
                <View style={styles.panelInner}>
                  <View style={styles.fieldRow}>
                    <NumericField
                      label="WIDTH"
                      value={draft.width}
                      unit={unitLabel}
                      onChange={setWidth}
                      style={styles.fieldSlot}
                    />
                    <NumericField
                      label="HEIGHT"
                      value={draft.height}
                      unit={unitLabel}
                      onChange={setHeight}
                      style={styles.fieldSlot}
                    />
                  </View>

                  <Text style={styles.label}>EXCLUSIONS</Text>
                  {draft.exclusions.map((ex, i) => (
                    <ExclusionRow
                      key={ex.id}
                      id={ex.id}
                      index={i}
                      w={ex.w}
                      h={ex.h}
                      unit={unitLabel}
                      onChange={r.updateExclusion}
                      onRemove={r.removeExclusion}
                    />
                  ))}
                  {draft.exclusions.length < MAX_EXCLUSIONS ? (
                    <Pressable
                      style={styles.ghost}
                      hitSlop={HIT}
                      onPress={r.addExclusion}
                      accessibilityRole="button"
                      accessibilityLabel="Add exclusion">
                      <Plus
                        size={18}
                        strokeWidth={ICON_STROKE}
                        color={theme.colors.text.secondary}
                      />
                      <Text style={styles.ghostText}>ADD EXCLUSION</Text>
                    </Pressable>
                  ) : null}
                </View>
              ) : null}

              {step === 2 ? (
                <View style={styles.panelInner}>
                  <Text style={styles.label}>TILE SIZE, MM</Text>
                  <View style={styles.chipRow}>
                    {TILE_PRESETS.map(p => (
                      <TileChip
                        key={p.label}
                        label={p.label}
                        active={activeTile === p.label}
                        onPress={() => r.setTile(p.w, p.h)}
                      />
                    ))}
                  </View>

                  <StepperSlider
                    label="TILE THICKNESS"
                    value={draft.thickness}
                    min={THICKNESS_MIN}
                    max={THICKNESS_MAX}
                    step={1}
                    unit=" mm"
                    accent={theme.colors.accent.slate}
                    onChange={v => r.setNumber('thickness', Math.round(v))}
                  />

                  <Text style={styles.label}>FINISH</Text>
                  <View style={styles.swatchRow}>
                    {FINISH_LABELS.map((finish, i) => (
                      <Pressable
                        key={finish}
                        style={[
                          styles.swatch,
                          draft.finish === i ? styles.swatchActive : null,
                        ]}
                        hitSlop={HIT}
                        onPress={() => r.setFinish(i)}
                        accessibilityRole="button"
                        accessibilityLabel={`${finish} finish`}>
                        <View
                          style={[
                            styles.swatchChip,
                            { backgroundColor: FINISH_TONES[i] },
                          ]}>
                          <View style={styles.swatchJoint} />
                        </View>
                        <Text style={styles.swatchLabel}>{finish}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : null}

              {step === 3 ? (
                <View style={styles.panelInner}>
                  <StepperSlider
                    label="JOINT WIDTH"
                    value={draft.joint}
                    min={JOINT_MIN}
                    max={JOINT_MAX}
                    step={1}
                    unit=" mm"
                    onChange={v => r.setNumber('joint', Math.round(v))}
                  />
                  <Text style={styles.hint}>
                    The grout bed under the tiles widens as the joint grows.
                  </Text>
                  <StepperSlider
                    label="TILE WIDTH"
                    value={draft.tileW}
                    min={TILE_DIM_MIN}
                    max={TILE_DIM_MAX}
                    step={50}
                    unit=" mm"
                    accent={theme.colors.accent.slate}
                    onChange={v => r.setNumber('tileW', Math.round(v))}
                  />
                </View>
              ) : null}

              {step === 4 ? (
                <View style={styles.panelInner}>
                  <Text style={styles.label}>WASTE MARGIN</Text>
                  <View style={styles.chipRow}>
                    {WASTE_STOPS.map(w => (
                      <TileChip
                        key={w}
                        width={60}
                        label={`${w}%`}
                        active={draft.waste === w}
                        onPress={() => r.setWaste(w)}
                      />
                    ))}
                  </View>
                  <StepperSlider
                    label="FINE TUNE WASTE"
                    value={draft.waste}
                    min={0}
                    max={20}
                    step={1}
                    unit="%"
                    onChange={v => r.setWaste(Math.round(v))}
                  />
                  <Text style={styles.hint}>
                    {`${materials.boxes} boxes of ${materials.tilesPerBox} cover this surface.`}
                  </Text>
                </View>
              ) : null}
            </View>
          </Animated.View>

          <View style={styles.statStrip}>
            <View style={styles.statCell}>
              <Text style={styles.statValue}>
                {formatArea(materials.netArea, draft.unit)}
              </Text>
              <Text style={styles.statLabel}>AREA</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCell}>
              <Text style={styles.statValue}>{`${draft.joint} mm`}</Text>
              <Text style={styles.statLabel}>JOINT</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCell}>
              <Text style={styles.statValue}>{`${draft.waste}%`}</Text>
              <Text style={styles.statLabel}>WASTE</Text>
            </View>
          </View>

          <View style={styles.controls}>
            <Animated.View
              pointerEvents="none"
              style={[styles.badge, { transform: [{ scale: badge }] }]}>
              <Text style={styles.badgeValue}>{materials.tiles}</Text>
              <Text style={styles.badgeLabel}>TILES INCLUDING WASTE</Text>
            </Animated.View>

            <PrimaryButton
              label={step < TOTAL_STEPS ? 'NEXT STEP' : 'GET MATERIALS'}
              Icon={step < TOTAL_STEPS ? ArrowRight : Calculator}
              onPress={handlePrimary}
              disabled={!r.canAdvance}
            />
            <SecondaryButton
              label="SAVE ROOM TO JOB LIST"
              onPress={handleSave}
              disabled={!r.canAdvance}
            />
          </View>

          <Toast text="ROOM SAVED TO JOB LIST" visible={toast} />
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  bg: { flex: 1 },
  overlay: { flex: 1 },

  body: { flex: 1 },
  boardWrap: { marginTop: 14, paddingHorizontal: 16 },
  boardCaption: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patternToggle: { flexDirection: 'row', gap: 8 },
  boardMeta: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },

  panel: { flex: 1, paddingHorizontal: 16, marginTop: 14 },
  panelInner: { gap: 10 },
  fieldRow: { flexDirection: 'row', gap: 12 },
  fieldSlot: { flex: 1 },
  label: {
    ...theme.typography.micro,
    color: theme.colors.text.secondary,
  },
  hint: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: theme.colors.text.muted,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  ghost: {
    height: 48,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.ui.borderMuted,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ghostText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: 18,
    color: theme.colors.text.secondary,
  },

  swatchRow: { flexDirection: 'row', gap: 10 },
  swatch: {
    width: 72,
    height: 84,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.surface.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  swatchActive: {
    borderWidth: 1.5,
    borderColor: theme.colors.accent.coral,
  },
  swatchChip: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderMuted,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  swatchJoint: { height: 2, backgroundColor: 'rgba(255,255,255,0.6)' },
  swatchLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },

  statStrip: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(47,72,88,0.05)',
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.border,
  },
  statCell: { flex: 1, alignItems: 'center', gap: 3 },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: theme.colors.ui.border,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
  },

  controls: {
    backgroundColor: theme.colors.surface.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.border,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    gap: 12,
    ...theme.shadows.panelUp,
  },
  badge: { alignItems: 'flex-start', gap: 2 },
  badgeValue: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 38,
    color: theme.colors.accent.coral,
    fontVariant: ['tabular-nums'],
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.secondary,
  },
});
