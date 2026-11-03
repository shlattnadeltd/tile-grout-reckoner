import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import { LOADER_DURATION_MS, SCREEN_H, SCREEN_W } from '../constants/config';
import theme from '../constants/theme';
import HairlineGrid from '../components/HairlineGrid';

type Props = { onDone: () => void };

const BAR_W = 180;

/**
 * Deliberately the darkest screen in the app: the same bg_game image as every
 * other screen, but under a 0.90-0.97 slate/ink overlay, with no chips and no
 * tappable call-to-action, so Loader can never be confused with Menu (rule #14).
 */
export default function LoaderScreen({ onDone }: Props) {
  const fade = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(0.86)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const gridFade = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        ...theme.animation.brand,
        useNativeDriver: true,
      }),
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(gridFade, {
        toValue: 1,
        duration: 700,
        delay: 120,
        useNativeDriver: true,
      }),
    ]).start();

    // width is NOT a native-driver property — useNativeDriver stays false here
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    const fadeTimer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: theme.animation.fade,
        useNativeDriver: true,
      }).start();
    }, LOADER_DURATION_MS - theme.animation.fade);

    const doneTimer = setTimeout(onDone, LOADER_DURATION_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [cardScale, cardFade, gridFade, progress, fade, onDone]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_W],
  });

  return (
    <Animated.View style={[styles.root, { opacity: fade }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground source={assets.bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={theme.gradients.loader}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.3, y: 1 }}
          style={styles.overlay}>
          <Animated.View style={[styles.gridLayer, { opacity: gridFade }]}>
            <HairlineGrid
              width={SCREEN_W}
              height={SCREEN_H}
              pitch={44}
              color={theme.colors.ui.gridDark}
            />
          </Animated.View>

          <View style={styles.content}>
            <Animated.View
              style={[
                styles.brandCard,
                { opacity: cardFade, transform: [{ scale: cardScale }] },
              ]}>
              <Image source={assets.logo} style={styles.logo} />
            </Animated.View>

            <Animated.View style={{ opacity: cardFade }}>
              <Text style={styles.titleTop}>TILE GROUT</Text>
              <Text style={styles.titleBottom}>RECKONER</Text>
              <Text style={styles.subtitle}>OFFLINE TILING ESTIMATOR</Text>
            </Animated.View>

            <View style={styles.barBlock}>
              <View style={styles.barTrack}>
                <Animated.View style={[styles.barFillWrap, { width: barWidth }]}>
                  <LinearGradient
                    colors={theme.gradients.progress}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.barFill}
                  />
                </Animated.View>
              </View>
              <Text style={styles.loading}>LOADING...</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.ink },
  bg: { flex: 1 },
  overlay: { flex: 1 },
  gridLayer: { ...StyleSheet.absoluteFillObject },
  content: {
    flex: 1,
    paddingHorizontal: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  brandCard: {
    width: 168,
    height: 168,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface.onDark,
    borderWidth: 1,
    borderColor: 'rgba(244,245,247,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 128, height: 128, resizeMode: 'contain' },
  titleTop: {
    ...theme.typography.brand,
    color: theme.colors.text.onDark,
    marginTop: 28,
  },
  titleBottom: {
    ...theme.typography.brand,
    color: theme.colors.accent.coral,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.4,
    color: theme.colors.text.onDarkMuted,
    marginTop: 10,
  },
  barBlock: { marginTop: 44, gap: 12 },
  barTrack: {
    width: BAR_W,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(244,245,247,0.14)',
    overflow: 'hidden',
  },
  barFillWrap: { height: 3, borderRadius: 2, overflow: 'hidden' },
  barFill: { flex: 1 },
  loading: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.text.onDarkFaint,
  },
});
