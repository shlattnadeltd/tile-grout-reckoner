/**
 * NORDIC_MINIMAL preset — accents overridden to the TileGroutReckoner brief
 * (slate blue ink + one hot-coral accent). The `name` field stays exactly as
 * it is in the preset file (rule #11b).
 */

export const theme = {
  name: 'nordic-minimal',

  colors: {
    bg: {
      primary: '#F4F5F7', // porcelain grey paper
      light: '#FAFAFA',
      alt: '#E8E8EC', // grout bed
      deep: '#DDDDE2',
      ink: '#1A2229',
    },
    surface: {
      card: '#FFFFFF',
      tint: 'rgba(47,72,88,0.06)',
      tintStrong: 'rgba(47,72,88,0.10)',
      coralTint: 'rgba(242,107,56,0.08)',
      onDark: 'rgba(244,245,247,0.06)',
    },
    accent: {
      slate: '#2F4858',
      ink: '#1A2229',
      coral: '#F26B38',
      coralDark: '#E05A28',
    },
    text: {
      primary: '#1A2229',
      secondary: '#5A6672',
      muted: '#8A949E',
      onDark: '#F4F5F7',
      onDarkMuted: 'rgba(244,245,247,0.55)',
      onDarkFaint: 'rgba(244,245,247,0.40)',
      inverse: '#FFFFFF',
    },
    ui: {
      border: '#DDDDE2',
      borderMuted: '#CFD6DD',
      divider: '#E8E8EC',
      scrim: 'rgba(26,34,41,0.55)',
      gridDark: 'rgba(244,245,247,0.07)',
      gridLight: 'rgba(47,72,88,0.05)',
    },
  },

  /** Each screen gets a visibly different overlay over the single bg_game image. */
  gradients: {
    loader: ['rgba(26,34,41,0.94)', 'rgba(47,72,88,0.90)', 'rgba(26,34,41,0.97)'],
    menu: ['rgba(250,250,250,0.90)', 'rgba(244,245,247,0.93)', 'rgba(232,232,236,0.95)'],
    game: ['rgba(244,245,247,0.96)', 'rgba(250,250,250,0.94)', 'rgba(232,232,236,0.97)'],
    result: ['rgba(232,232,236,0.95)', 'rgba(221,221,226,0.95)', 'rgba(203,208,214,0.96)'],
    coral: ['#F26B38', '#E05A28'],
    slate: ['#2F4858', '#1A2229'],
    progress: ['#2F4858', '#F26B38'],
  },

  typography: {
    hero: { fontSize: 40, fontWeight: '800' as const, letterSpacing: 1.2 },
    brand: { fontSize: 34, fontWeight: '800' as const, letterSpacing: 3.2 },
    numeral: { fontSize: 26, fontWeight: '800' as const, letterSpacing: 0.2 },
    title: { fontSize: 24, fontWeight: '700' as const, letterSpacing: 0.4 },
    section: { fontSize: 11, fontWeight: '800' as const, letterSpacing: 1.8 },
    body: { fontSize: 15, fontWeight: '500' as const, letterSpacing: 0.1 },
    field: { fontSize: 22, fontWeight: '700' as const, letterSpacing: 0.2 },
    caption: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 1.4 },
    micro: { fontSize: 10, fontWeight: '700' as const, letterSpacing: 1.6 },
    button: { fontSize: 16, fontWeight: '800' as const, letterSpacing: 2 },
  },

  radius: { xs: 4, sm: 6, md: 8, lg: 10, xl: 16, full: 999 },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  shadows: {
    /** the single coloured shadow in the whole app — on the coral CTA */
    cta: {
      shadowColor: '#F26B38',
      shadowOpacity: 0.28,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 5 },
      elevation: 5,
    },
    card: {
      shadowColor: '#1A2229',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    panelUp: {
      shadowColor: '#1A2229',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: -3 },
      elevation: 4,
    },
  },

  animation: {
    press: { tension: 300, friction: 18 },
    sheet: { tension: 56, friction: 11 },
    card: { tension: 60, friction: 9 },
    brand: { tension: 48, friction: 9 },
    fade: 260,
    screen: 280,
    hatch: 200,
    badge: 180,
    toast: 1600,
  },

  /** status-bar safe top padding used by every header (rule #6) */
  headerTop: 44,
} as const;

export type Theme = typeof theme;
export default theme;
