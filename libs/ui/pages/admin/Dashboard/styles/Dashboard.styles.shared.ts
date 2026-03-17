import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  container: {
    padding: theme.spacing(3),
    background: 'linear-gradient(160deg, #f0f4ff 0%, #fafbff 50%, #f0f4ff 100%)',
    minHeight: '100vh',
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.25) },
    [theme.breakpoints.between('sm', 'md')]: { padding: theme.spacing(2) },
  },

  // ── Hero Header ──────────────────────────────────────────────────────────────
  heroHeader: {
    marginBottom: theme.spacing(2.5),
    background:
      'linear-gradient(135deg, #060d1f 0%, #0d1f4a 18%, #1a3480 40%, #3730a3 62%, #0369a1 85%, #0891b2 100%)',
    backgroundSize: '300% 300%',
    animation: 'db-gradient-shift 10s ease infinite',
    borderRadius: 28,
    padding: theme.spacing(4.5, 5, 0),
    position: 'relative',
    overflow: 'hidden',
    boxShadow:
      '0 40px 100px rgba(55,48,163,0.38), 0 16px 40px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.15)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -140,
      right: -100,
      width: 500,
      height: 500,
      borderRadius: '50%',
      background:
        'radial-gradient(circle, rgba(139,92,246,0.45) 0%, rgba(99,102,241,0.15) 45%, transparent 70%)',
      animation: 'db-orb 16s ease-in-out infinite',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -100,
      left: '-5%',
      width: 420,
      height: 420,
      borderRadius: '50%',
      background:
        'radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(14,165,233,0.1) 50%, transparent 70%)',
      animation: 'db-orb 12s ease-in-out infinite reverse',
      pointerEvents: 'none',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      borderRadius: 22,
      padding: theme.spacing(3.5, 3.5, 0),
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: 18,
      padding: theme.spacing(2.5, 2, 0),
      marginBottom: theme.spacing(1.75),
    },
  },

  // ── Dot-grid overlay ────────────────────────────────────────────────────────
  heroGridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)',
    backgroundSize: '28px 28px',
    pointerEvents: 'none',
    zIndex: 0,
    [theme.breakpoints.down('sm')]: { backgroundSize: '22px 22px' },
  },

  // ── Sweeping shimmer light ──────────────────────────────────────────────────
  heroShimmer: {
    position: 'absolute',
    top: '-60%',
    left: '-55%',
    width: '45%',
    height: '220%',
    background:
      'linear-gradient(108deg, transparent 30%, rgba(255,255,255,0.065) 50%, transparent 70%)',
    animation: 'db-shimmer 7s ease-in-out infinite',
    pointerEvents: 'none',
    zIndex: 0,
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },

  heroOrb: {
    position: 'absolute',
    bottom: '8%',
    right: '28%',
    width: 260,
    height: 260,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(251,191,36,0.16) 0%, transparent 65%)',
    animation: 'db-float 11s ease-in-out infinite',
    pointerEvents: 'none',
    zIndex: 0,
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },

  heroOrb2: {
    position: 'absolute',
    top: '-20%',
    left: '30%',
    width: 320,
    height: 320,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(52,211,153,0.14) 0%, transparent 65%)',
    animation: 'db-orb 9s ease-in-out 1s infinite',
    pointerEvents: 'none',
    zIndex: 0,
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },

  heroOrb3: {
    position: 'absolute',
    bottom: '30%',
    right: '-8%',
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(244,114,182,0.18) 0%, transparent 65%)',
    animation: 'db-float 13s ease-in-out 2s infinite reverse',
    pointerEvents: 'none',
    zIndex: 0,
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },

  heroContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.between('sm', 'md')]: {
      paddingBottom: theme.spacing(2.5),
      gap: theme.spacing(2),
    },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column' as const,
      alignItems: 'flex-start',
      gap: theme.spacing(1.75),
    },
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(2),
      gap: theme.spacing(1.25),
    },
  },

  heroLeft: { flex: 1, minWidth: 0 },

  heroGreeting: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: 30,
    padding: '5px 14px 5px 10px',
    fontSize: '0.7rem',
    fontWeight: 800,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    marginBottom: theme.spacing(1.5),
    animation: 'db-slide-up 0.4s ease both',
    '&::before': {
      content: '"⚡"',
      fontSize: '0.75rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.62rem',
      letterSpacing: '0.1em',
      padding: '4px 11px 4px 8px',
      marginBottom: theme.spacing(1),
    },
  },

  heroWelcomeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    animation: 'db-slide-up 0.5s 0.05s ease both',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(1.25),
      marginBottom: theme.spacing(0.75),
    },
  },

  heroAvatar: {
    width: 68,
    height: 68,
    fontSize: '1.45rem',
    fontWeight: 800,
    flexShrink: 0,
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)',
    border: '2.5px solid rgba(255,255,255,0.2)',
    // ring: tight indigo glow → wider diffuse → outer depth
    boxShadow:
      '0 0 0 3px rgba(129,140,248,0.6), 0 0 0 6px rgba(99,102,241,0.2), 0 8px 32px rgba(79,70,229,0.55), 0 2px 8px rgba(0,0,0,0.4)',
    transition: 'box-shadow 0.28s ease, transform 0.28s ease',
    '&:hover': {
      boxShadow:
        '0 0 0 3px rgba(165,180,252,0.8), 0 0 0 6px rgba(129,140,248,0.3), 0 12px 40px rgba(79,70,229,0.7), 0 2px 8px rgba(0,0,0,0.4)',
      transform: 'scale(1.07)',
    },
    [theme.breakpoints.between('sm', 'md')]: { width: 58, height: 58, fontSize: '1.25rem' },
    [theme.breakpoints.down('sm')]: { width: 50, height: 50, fontSize: '1.1rem' },
  },

  heroTitle: {
    fontWeight: 900,
    color: '#fff',
    fontSize: '2.6rem',
    letterSpacing: '-0.04em',
    lineHeight: 1.1,
    textShadow: '0 2px 24px rgba(0,0,0,0.35)',
    '& strong': {
      background: 'linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 35%, #38bdf8 70%, #34d399 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 900,
    },
    [theme.breakpoints.between('sm', 'md')]: { fontSize: '2rem' },
    [theme.breakpoints.down('sm')]: { fontSize: '1.5rem' },
  },

  heroSub: {
    color: 'rgba(255,255,255,0.6)',
    marginTop: theme.spacing(1),
    fontSize: '0.9rem',
    lineHeight: 1.65,
    animation: 'db-slide-up 0.5s 0.12s ease both',
    maxWidth: 540,
    [theme.breakpoints.between('sm', 'md')]: { fontSize: '0.82rem' },
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem',
      lineHeight: 1.55,
      marginTop: theme.spacing(0.75),
    },
  },

  heroModePills: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(0.875),
    marginTop: theme.spacing(2),
    animation: 'db-slide-up 0.5s 0.2s ease both',
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(0.625), marginTop: theme.spacing(1.25) },
  },

  heroModePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(255,255,255,0.09)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.16)',
    borderRadius: 30,
    padding: '5px 14px',
    fontSize: '0.76rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.88)',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(255,255,255,0.16)',
      border: '1px solid rgba(255,255,255,0.3)',
      transform: 'translateY(-1px)',
    },
    [theme.breakpoints.down('sm')]: { padding: '4px 10px', fontSize: '0.68rem' },
  },

  heroRight: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: theme.spacing(1.25),
    animation: 'db-slide-up 0.5s 0.18s ease both',
    flexShrink: 0,
    [theme.breakpoints.down('md')]: {
      alignItems: 'flex-start',
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
    },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(0.75) },
  },

  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(74,222,128,0.12)',
    backdropFilter: 'blur(14px)',
    border: '1px solid rgba(74,222,128,0.3)',
    borderRadius: 40,
    padding: '7px 16px',
    boxShadow: '0 0 20px rgba(74,222,128,0.12)',
    [theme.breakpoints.down('sm')]: { padding: '5px 12px', gap: 6 },
  },

  heroBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 8px #4ade80, 0 0 16px rgba(74,222,128,0.5)',
    animation: 'db-pulse 1.8s ease-in-out infinite',
    flexShrink: 0,
  },

  heroBadgeText: {
    fontSize: '0.74rem',
    fontWeight: 700,
    color: '#86efac',
    letterSpacing: '0.06em',
    [theme.breakpoints.down('sm')]: { fontSize: '0.67rem' },
  },

  heroDate: {
    fontSize: '0.76rem',
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'right' as const,
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: '5px 12px',
    backdropFilter: 'blur(10px)',
    [theme.breakpoints.down('sm')]: { fontSize: '0.67rem', padding: '4px 10px' },
  },

  heroStatItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1.75, 1.5),
    borderRight: '1px solid rgba(255,255,255,0.08)',
    gap: theme.spacing(0.4),
    transition: 'background 0.2s ease',
    '&:last-child': { borderRight: 'none' },
    '&:hover': { background: 'rgba(255,255,255,0.05)' },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5, 1),
      '&:nth-of-type(2)': { borderRight: 'none' },
    },
  },

  heroStatValue: {
    fontSize: '1.35rem',
    fontWeight: 900,
    color: '#fff',
    lineHeight: 1,
    letterSpacing: '-0.02em',
    [theme.breakpoints.between('sm', 'md')]: { fontSize: '1.15rem' },
    [theme.breakpoints.down('sm')]: { fontSize: '1rem' },
  },

  heroStatLabel: {
    fontSize: '0.6rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    [theme.breakpoints.down('sm')]: { fontSize: '0.55rem', letterSpacing: '0.08em' },
  },

  heroStatDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    animation: 'db-pulse 2s ease-in-out infinite',
    flexShrink: 0,
  },

  // ── Primary KPI Cards ────────────────────────────────────────────────────────
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('lg')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
    [theme.breakpoints.down('sm')]: { gridTemplateColumns: '1fr 1fr', gap: theme.spacing(1.25) },
  },

  kpiCard: {
    borderRadius: 18,
    padding: theme.spacing(2.5),
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'default',
    transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      borderRadius: '18px 18px 0 0',
    },
    '&:hover': { transform: 'translateY(-5px)' },
    [theme.breakpoints.between('sm', 'md')]: { padding: theme.spacing(2), borderRadius: 16 },
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.5, 1.5), borderRadius: 14 },
  },

  kpiCard0: {
    animation: 'db-slide-up 0.55s 0s ease both',
    '&::before': { background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' },
    '&:hover': { boxShadow: '0 16px 40px rgba(79,70,229,0.18)' },
  },
  kpiCard1: {
    animation: 'db-slide-up 0.55s 0.08s ease both',
    '&::before': { background: 'linear-gradient(90deg, #10b981, #0d9488)' },
    '&:hover': { boxShadow: '0 16px 40px rgba(16,185,129,0.18)' },
  },
  kpiCard2: {
    animation: 'db-slide-up 0.55s 0.16s ease both',
    '&::before': { background: 'linear-gradient(90deg, #f59e0b, #ef4444)' },
    '&:hover': { boxShadow: '0 16px 40px rgba(245,158,11,0.18)' },
  },
  kpiCard3: {
    animation: 'db-slide-up 0.55s 0.24s ease both',
    '&::before': { background: 'linear-gradient(90deg, #0ea5e9, #2563eb)' },
    '&:hover': { boxShadow: '0 16px 40px rgba(14,165,233,0.18)' },
  },

  kpiTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1.25),
    marginTop: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: { marginBottom: theme.spacing(1) },
  },

  kpiIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 13,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: { width: 36, height: 36, borderRadius: 10 },
  },

  kpiIcon: {
    fontSize: '1.45rem !important',
    [theme.breakpoints.down('sm')]: { fontSize: '1.1rem !important' },
  },

  kpiValue: {
    fontSize: '2.1rem',
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: theme.spacing(0.3),
    animation: 'db-counter 0.7s cubic-bezier(0.34,1.56,0.64,1) both',
    [theme.breakpoints.between('sm', 'md')]: { fontSize: '1.7rem' },
    [theme.breakpoints.down('sm')]: { fontSize: '1.3rem' },
  },

  kpiLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: 'rgba(0,0,0,0.38)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    [theme.breakpoints.down('sm')]: { fontSize: '0.58rem', letterSpacing: '0.05em' },
  },

  kpiDivider: {
    borderColor: 'rgba(0,0,0,0.06)',
    margin: `${theme.spacing(1.25)} 0`,
    [theme.breakpoints.down('sm')]: { margin: `${theme.spacing(1)} 0` },
  },

  kpiTrend: { display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' as const },

  kpiTrendBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    padding: '2px 7px',
    borderRadius: 20,
    fontSize: '0.68rem',
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: { fontSize: '0.62rem', padding: '2px 6px' },
  },

  kpiTrendLabel: {
    fontSize: '0.68rem',
    color: 'rgba(0,0,0,0.42)',
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },

  // ── Service Mode Cards ────────────────────────────────────────────────────────
  modeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2.5),
    [theme.breakpoints.between('md', 'lg')]: { gridTemplateColumns: 'repeat(3, 1fr)' },
    [theme.breakpoints.between('sm', 'md')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: theme.spacing(1.25),
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing(1.1),
    },
  },

  modeCard: {
    borderRadius: 14,
    padding: theme.spacing(1.75, 2),
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(1),
    animation: 'db-slide-up 0.55s ease both',
    transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1)',
    '&:hover': { transform: 'translateY(-4px)' },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.25, 1.5),
      borderRadius: 12,
      gap: theme.spacing(0.75),
    },
  },

  modeCardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },

  modeIconBox: {
    width: 40,
    height: 40,
    borderRadius: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiSvgIcon-root': { fontSize: '1.25rem !important' },
    [theme.breakpoints.down('sm')]: {
      width: 34,
      height: 34,
      borderRadius: 9,
      '& .MuiSvgIcon-root': { fontSize: '1.1rem !important' },
    },
  },

  modeStatusDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 6px #4ade80',
    animation: 'db-pulse 2.5s ease-in-out infinite',
  },

  modeValue: {
    fontSize: '1.7rem',
    fontWeight: 800,
    lineHeight: 1,
    animation: 'db-counter 0.7s ease both',
    [theme.breakpoints.down('sm')]: { fontSize: '1.25rem' },
  },

  modeLabel: {
    fontSize: '0.66rem',
    fontWeight: 700,
    color: 'rgba(0,0,0,0.36)',
    letterSpacing: '0.07em',
    textTransform: 'uppercase' as const,
    [theme.breakpoints.down('sm')]: { fontSize: '0.6rem' },
  },

  modeBar: { height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' },
  modeBarFill: { height: '100%', borderRadius: 2, transition: 'width 1.2s ease' },

  modeSub: {
    fontSize: '0.7rem',
    color: 'rgba(0,0,0,0.42)',
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: { fontSize: '0.63rem' },
  },

  // ── Secondary Metric Row ─────────────────────────────────────────────────────
  secRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2.5),
    [theme.breakpoints.down('md')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
    [theme.breakpoints.down('sm')]: { gridTemplateColumns: '1fr 1fr', gap: theme.spacing(1.1) },
  },

  secCard: {
    borderRadius: 14,
    padding: theme.spacing(1.75, 2.25),
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(14px)',
    border: '1px solid rgba(79,70,229,0.08)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
    animation: 'db-slide-up 0.5s ease both',
    transition: 'all 0.25s ease',
    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(79,70,229,0.1)' },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.25, 1.5),
      gap: theme.spacing(1),
      borderRadius: 12,
    },
  },

  secIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    '& .MuiSvgIcon-root': { fontSize: '1.2rem !important' },
    [theme.breakpoints.down('sm')]: {
      width: 34,
      height: 34,
      borderRadius: 9,
      '& .MuiSvgIcon-root': { fontSize: '1rem !important' },
    },
  },

  secValue: {
    fontSize: '1.45rem',
    fontWeight: 800,
    lineHeight: 1,
    [theme.breakpoints.between('sm', 'md')]: { fontSize: '1.25rem' },
    [theme.breakpoints.down('sm')]: { fontSize: '1.05rem' },
  },

  secLabel: {
    fontSize: '0.7rem',
    color: 'rgba(0,0,0,0.44)',
    fontWeight: 500,
    marginTop: 2,
    [theme.breakpoints.down('sm')]: { fontSize: '0.62rem' },
  },

  // ── Layout Rows ──────────────────────────────────────────────────────────────
  chartRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: theme.spacing(2.5),
    marginBottom: theme.spacing(2.5),
    [theme.breakpoints.down('lg')]: { gridTemplateColumns: '1fr' },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(1.5), marginBottom: theme.spacing(1.5) },
  },

  twoColRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(2.5),
    marginBottom: theme.spacing(2.5),
    [theme.breakpoints.down('md')]: { gridTemplateColumns: '1fr' },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(1.5), marginBottom: theme.spacing(1.5) },
  },

  threeColRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 360px',
    gap: theme.spacing(2.5),
    marginBottom: theme.spacing(2.5),
    [theme.breakpoints.down('lg')]: { gridTemplateColumns: '1fr 1fr' },
    [theme.breakpoints.down('md')]: { gridTemplateColumns: '1fr' },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(1.5), marginBottom: theme.spacing(1.5) },
  },

  // ── Shared Panel ─────────────────────────────────────────────────────────────
  panel: {
    borderRadius: 18,
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(79,70,229,0.08)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    animation: 'db-slide-up 0.6s ease both',
    [theme.breakpoints.down('sm')]: { borderRadius: 14 },
  },

  chartPanel: {
    borderRadius: 18,
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(79,70,229,0.08)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    animation: 'db-slide-up 0.6s 0.1s ease both',
    [theme.breakpoints.down('sm')]: { borderRadius: 14 },
  },

  panelHead: {
    padding: theme.spacing(2, 2.75),
    borderBottom: '1px solid rgba(79,70,229,0.07)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.5, 2) },
  },

  panelTitle: {
    fontWeight: 700,
    fontSize: '0.92rem',
    color: '#1e293b',
    letterSpacing: '-0.01em',
    [theme.breakpoints.down('sm')]: { fontSize: '0.82rem' },
  },

  panelBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: '0.7rem',
    fontWeight: 700,
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: { padding: '2px 8px', fontSize: '0.65rem' },
  },

  panelBody: {
    padding: theme.spacing(1.75, 2.75),
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.25, 2) },
  },

  // ── Platform Health ───────────────────────────────────────────────────────────
  healthRow: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.1, 0),
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    '&:last-child': { borderBottom: 'none' },
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(0.9, 0) },
  },

  healthLabel: {
    fontSize: '0.8rem',
    color: '#374151',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    minWidth: 160,
    [theme.breakpoints.between('sm', 'md')]: { minWidth: 140, fontSize: '0.76rem' },
    [theme.breakpoints.down('sm')]: { minWidth: 110, fontSize: '0.7rem', gap: 5 },
  },

  healthDot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },

  healthBar: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    background: 'rgba(0,0,0,0.06)',
    margin: theme.spacing(0, 1.5),
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: { margin: theme.spacing(0, 1) },
  },

  healthFill: { height: '100%', borderRadius: 3 },

  healthValue: {
    fontSize: '0.78rem',
    fontWeight: 700,
    minWidth: 42,
    textAlign: 'right' as const,
    [theme.breakpoints.down('sm')]: { fontSize: '0.7rem', minWidth: 36 },
  },

  // ── City List ─────────────────────────────────────────────────────────────────
  cityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
    padding: theme.spacing(1.1, 0),
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    '&:last-child': { borderBottom: 'none' },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(1) },
  },

  cityRank: {
    width: 26,
    height: 26,
    borderRadius: 7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.72rem',
    fontWeight: 800,
    flexShrink: 0,
  },

  cityName: {
    flex: 1,
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#1e293b',
    [theme.breakpoints.down('sm')]: { fontSize: '0.76rem' },
  },

  citySub: {
    fontSize: '0.68rem',
    color: 'rgba(0,0,0,0.4)',
    marginTop: 2,
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },

  cityBar: {
    width: 72,
    height: 5,
    borderRadius: 3,
    background: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },

  cityBarFill: { height: '100%', borderRadius: 3 },

  cityValue: {
    fontSize: '0.8rem',
    fontWeight: 700,
    textAlign: 'right' as const,
    minWidth: 44,
    [theme.breakpoints.down('sm')]: { fontSize: '0.72rem', minWidth: 38 },
  },

  // ── Captain List ─────────────────────────────────────────────────────────────
  captainItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
    padding: theme.spacing(1.1, 0),
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    '&:last-child': { borderBottom: 'none' },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(1) },
  },

  captainAvatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.85rem',
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: { width: 32, height: 32, fontSize: '0.78rem' },
  },

  captainName: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#1e293b',
    [theme.breakpoints.down('sm')]: { fontSize: '0.76rem' },
  },
  captainSub: {
    fontSize: '0.68rem',
    color: 'rgba(0,0,0,0.42)',
    marginTop: 2,
    [theme.breakpoints.down('sm')]: { fontSize: '0.62rem' },
  },
  captainEarn: {
    fontSize: '0.8rem',
    fontWeight: 700,
    textAlign: 'right' as const,
    [theme.breakpoints.down('sm')]: { fontSize: '0.72rem' },
  },
  captainRate: { fontSize: '0.68rem', color: '#f59e0b', textAlign: 'right' as const, marginTop: 2 },

  // ── Activity Feed ─────────────────────────────────────────────────────────────
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1.25),
    padding: theme.spacing(1.25, 0),
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    '&:last-child': { borderBottom: 'none' },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(1), padding: theme.spacing(1, 0) },
  },

  activityDot: {
    width: 32,
    height: 32,
    borderRadius: 9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    '& .MuiSvgIcon-root': { fontSize: '0.9rem !important' },
    [theme.breakpoints.down('sm')]: { width: 28, height: 28, borderRadius: 8 },
  },

  activityText: {
    flex: 1,
    fontSize: '0.78rem',
    color: '#374151',
    fontWeight: 500,
    lineHeight: 1.5,
    [theme.breakpoints.down('sm')]: { fontSize: '0.72rem', lineHeight: 1.45 },
  },

  activityTime: {
    fontSize: '0.68rem',
    color: 'rgba(0,0,0,0.36)',
    fontWeight: 500,
    flexShrink: 0,
    marginTop: 2,
    whiteSpace: 'nowrap' as const,
    [theme.breakpoints.down('sm')]: { fontSize: '0.62rem' },
  },
});
