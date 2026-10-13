export const colors = {
  surface: '#131314',
  surfaceDim: '#131314',
  surfaceBright: '#39393a',
  surfaceContainerLowest: '#0e0e0f',
  surfaceContainerLow: '#1c1b1c',
  surfaceContainer: '#201f20',
  surfaceContainerHigh: '#2a2a2b',
  surfaceContainerHighest: '#353436',
  onSurface: '#e5e2e3',
  onSurfaceVariant: '#c5c7c9',
  outline: '#8f9194',
  outlineVariant: '#44474a',
  primary: '#ffffff',
  onPrimary: '#2f3132',
  amber: '#fabc4d',
  onAmber: '#281900',
  amberContainer: '#bd8718',
  error: '#ffb4ab',
  errorContainer: '#93000a',
} as const;

export const motionTokens = {
  duration: {
    instant: 0.12,
    fast: 0.2,
    base: 0.32,
    slow: 0.56,
    hero: 0.9,
  },
  easing: {
    easeOutExpo: [0.16, 1, 0.3, 1],
    easeOutQuart: [0.25, 1, 0.5, 1],
  },
  spring: {
    subtle: { type: 'spring', damping: 25, stiffness: 350 },
    bouncy: { type: 'spring', damping: 18, stiffness: 280 },
    gentle: { type: 'spring', damping: 30, stiffness: 200 },
  },
} as const;

export const radii = {
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-full',
} as const;
