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
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 30%, #4f46e5 65%, #0ea5e9 100%)',
    backgroundSize: '300% 300%',
    animation: 'db-gradient-shift 8s ease infinite',
    borderRadius: 20,
    padding: theme.spacing(4, 4.5),
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 24px 64px rgba(79,70,229,0.28), 0 8px 24px rgba(0,0,0,0.12)',
    '&::before': {
      content: '""',
      position: 'absolute', top: -120, right: -80,
      width: 380, height: 380, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(167,139,250,0.4) 0%, transparent 70%)',
      animation: 'db-orb 14s ease-in-out infinite',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute', bottom: -80, left: '20%',
      width: 300, height: 300, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)',
      animation: 'db-orb 10s ease-in-out infinite reverse',
      pointerEvents: 'none',
    },
    [theme.breakpoints.between('sm', 'md')]: { padding: theme.spacing(3, 3.5), borderRadius: 16 },
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(2.25, 2), borderRadius: 14, marginBottom: theme.spacing(2) },
  },

  heroOrb: {
    position: 'absolute', bottom: '5%', right: '30%',
    width: 200, height: 200, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)',
    animation: 'db-float 9s ease-in-out infinite',
    pointerEvents: 'none', zIndex: 0,
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },

  heroContent: {
    position: 'relative', zIndex: 1,
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    [theme.breakpoints.down('md')]: { flexDirection: 'column' as const, alignItems: 'flex-start', gap: theme.spacing(1.5) },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(1.25) },
  },

  heroLeft: { flex: 1 },

  heroGreeting: {
    fontSize: '0.78rem', fontWeight: 700,
    color: 'rgba(255,255,255,0.6)', letterSpacing: '0.16em',
    textTransform: 'uppercase' as const, marginBottom: theme.spacing(0.5),
    animation: 'db-slide-up 0.4s ease both',
    [theme.breakpoints.down('sm')]: { fontSize: '0.68rem', letterSpacing: '0.12em' },
  },

  heroTitle: {
    fontWeight: 900, color: '#fff', fontSize: '2.4rem',
    letterSpacing: '-0.03em', lineHeight: 1.15,
    textShadow: '0 2px 20px rgba(0,0,0,0.3)',
    animation: 'db-slide-up 0.5s 0.05s ease both',
    [theme.breakpoints.between('sm', 'md')]: { fontSize: '1.9rem' },
    [theme.breakpoints.down('sm')]: { fontSize: '1.45rem' },
  },

  heroSub: {
    color: 'rgba(255,255,255,0.62)', marginTop: theme.spacing(0.75),
    fontSize: '0.9rem', animation: 'db-slide-up 0.5s 0.12s ease both',
    [theme.breakpoints.between('sm', 'md')]: { fontSize: '0.82rem' },
    [theme.breakpoints.down('sm')]: { fontSize: '0.76rem', lineHeight: 1.5 },
  },

  heroModePills: {
    display: 'flex', flexWrap: 'wrap' as const,
    gap: theme.spacing(0.75), marginTop: theme.spacing(1.75),
    animation: 'db-slide-up 0.5s 0.2s ease both', position: 'relative', zIndex: 1,
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(0.5), marginTop: theme.spacing(1.25) },
  },

  heroModePill: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.18)', borderRadius: 30,
    padding: '5px 14px', fontSize: '0.75rem', fontWeight: 700,
    color: 'rgba(255,255,255,0.9)',
    [theme.breakpoints.down('sm')]: { padding: '4px 10px', fontSize: '0.68rem' },
  },

  heroRight: {
    display: 'flex', flexDirection: 'column' as const,
    alignItems: 'flex-end', gap: theme.spacing(1),
    animation: 'db-slide-up 0.5s 0.18s ease both',
    [theme.breakpoints.down('md')]: { alignItems: 'flex-start' },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(0.5) },
  },

  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.22)', borderRadius: 40, padding: '7px 16px',
    [theme.breakpoints.down('sm')]: { padding: '5px 12px' },
  },

  heroBadgeDot: {
    width: 8, height: 8, borderRadius: '50%',
    background: '#4ade80', boxShadow: '0 0 10px #4ade80',
    animation: 'db-pulse 2s ease-in-out infinite', flexShrink: 0,
  },

  heroBadgeText: {
    fontSize: '0.75rem', fontWeight: 700,
    color: 'rgba(255,255,255,0.9)', letterSpacing: '0.06em',
    [theme.breakpoints.down('sm')]: { fontSize: '0.68rem' },
  },

  heroDate: {
    fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', textAlign: 'right' as const,
    [theme.breakpoints.down('sm')]: { fontSize: '0.68rem' },
  },

  // ── Primary KPI Cards ────────────────────────────────────────────────────────
  kpiGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: theme.spacing(2), marginBottom: theme.spacing(2),
    [theme.breakpoints.down('lg')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
    [theme.breakpoints.down('sm')]: { gridTemplateColumns: '1fr 1fr', gap: theme.spacing(1.25) },
  },

  kpiCard: {
    borderRadius: 18, padding: theme.spacing(2.5),
    background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
    position: 'relative', overflow: 'hidden', cursor: 'default',
    transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
    '&::before': {
      content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 4,
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
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: theme.spacing(1.25), marginTop: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: { marginBottom: theme.spacing(1) },
  },

  kpiIconWrap: {
    width: 48, height: 48, borderRadius: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    [theme.breakpoints.down('sm')]: { width: 36, height: 36, borderRadius: 10 },
  },

  kpiIcon: {
    fontSize: '1.45rem !important',
    [theme.breakpoints.down('sm')]: { fontSize: '1.1rem !important' },
  },

  kpiValue: {
    fontSize: '2.1rem', fontWeight: 800, lineHeight: 1,
    marginBottom: theme.spacing(0.3),
    animation: 'db-counter 0.7s cubic-bezier(0.34,1.56,0.64,1) both',
    [theme.breakpoints.between('sm', 'md')]: { fontSize: '1.7rem' },
    [theme.breakpoints.down('sm')]: { fontSize: '1.3rem' },
  },

  kpiLabel: {
    fontSize: '0.65rem', fontWeight: 700,
    color: 'rgba(0,0,0,0.38)', letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    [theme.breakpoints.down('sm')]: { fontSize: '0.58rem', letterSpacing: '0.05em' },
  },

  kpiDivider: {
    borderColor: 'rgba(0,0,0,0.06)', margin: `${theme.spacing(1.25)} 0`,
    [theme.breakpoints.down('sm')]: { margin: `${theme.spacing(1)} 0` },
  },

  kpiTrend: { display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' as const },

  kpiTrendBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 3,
    padding: '2px 7px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 700,
    [theme.breakpoints.down('sm')]: { fontSize: '0.62rem', padding: '2px 6px' },
  },

  kpiTrendLabel: {
    fontSize: '0.68rem', color: 'rgba(0,0,0,0.42)', fontWeight: 500,
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },

  // ── Service Mode Cards ────────────────────────────────────────────────────────
  modeGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
    gap: theme.spacing(1.5), marginBottom: theme.spacing(2.5),
    [theme.breakpoints.between('md', 'lg')]: { gridTemplateColumns: 'repeat(3, 1fr)' },
    [theme.breakpoints.between('sm', 'md')]: { gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing(1.25) },
    [theme.breakpoints.down('sm')]: { gridTemplateColumns: 'repeat(2, 1fr)', gap: theme.spacing(1.1) },
  },

  modeCard: {
    borderRadius: 14, padding: theme.spacing(1.75, 2),
    background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column' as const, gap: theme.spacing(1),
    animation: 'db-slide-up 0.55s ease both',
    transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1)',
    '&:hover': { transform: 'translateY(-4px)' },
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.25, 1.5), borderRadius: 12, gap: theme.spacing(0.75) },
  },

  modeCardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },

  modeIconBox: {
    width: 40, height: 40, borderRadius: 11,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    '& .MuiSvgIcon-root': { fontSize: '1.25rem !important' },
    [theme.breakpoints.down('sm')]: {
      width: 34, height: 34, borderRadius: 9,
      '& .MuiSvgIcon-root': { fontSize: '1.1rem !important' },
    },
  },

  modeStatusDot: {
    width: 7, height: 7, borderRadius: '50%',
    background: '#4ade80', boxShadow: '0 0 6px #4ade80',
    animation: 'db-pulse 2.5s ease-in-out infinite',
  },

  modeValue: {
    fontSize: '1.7rem', fontWeight: 800, lineHeight: 1,
    animation: 'db-counter 0.7s ease both',
    [theme.breakpoints.down('sm')]: { fontSize: '1.25rem' },
  },

  modeLabel: {
    fontSize: '0.66rem', fontWeight: 700,
    color: 'rgba(0,0,0,0.36)', letterSpacing: '0.07em',
    textTransform: 'uppercase' as const,
    [theme.breakpoints.down('sm')]: { fontSize: '0.6rem' },
  },

  modeBar: { height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' },
  modeBarFill: { height: '100%', borderRadius: 2, transition: 'width 1.2s ease' },

  modeSub: {
    fontSize: '0.7rem', color: 'rgba(0,0,0,0.42)', fontWeight: 500,
    [theme.breakpoints.down('sm')]: { fontSize: '0.63rem' },
  },

  // ── Secondary Metric Row ─────────────────────────────────────────────────────
  secRow: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: theme.spacing(1.5), marginBottom: theme.spacing(2.5),
    [theme.breakpoints.down('md')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
    [theme.breakpoints.down('sm')]: { gridTemplateColumns: '1fr 1fr', gap: theme.spacing(1.1) },
  },

  secCard: {
    borderRadius: 14, padding: theme.spacing(1.75, 2.25),
    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(14px)',
    border: '1px solid rgba(79,70,229,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    display: 'flex', alignItems: 'center', gap: theme.spacing(1.25),
    animation: 'db-slide-up 0.5s ease both', transition: 'all 0.25s ease',
    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(79,70,229,0.1)' },
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.25, 1.5), gap: theme.spacing(1), borderRadius: 12 },
  },

  secIcon: {
    width: 40, height: 40, borderRadius: 11,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    '& .MuiSvgIcon-root': { fontSize: '1.2rem !important' },
    [theme.breakpoints.down('sm')]: {
      width: 34, height: 34, borderRadius: 9,
      '& .MuiSvgIcon-root': { fontSize: '1rem !important' },
    },
  },

  secValue: {
    fontSize: '1.45rem', fontWeight: 800, lineHeight: 1,
    [theme.breakpoints.between('sm', 'md')]: { fontSize: '1.25rem' },
    [theme.breakpoints.down('sm')]: { fontSize: '1.05rem' },
  },

  secLabel: {
    fontSize: '0.7rem', color: 'rgba(0,0,0,0.44)', fontWeight: 500, marginTop: 2,
    [theme.breakpoints.down('sm')]: { fontSize: '0.62rem' },
  },

  // ── Layout Rows ──────────────────────────────────────────────────────────────
  chartRow: {
    display: 'grid', gridTemplateColumns: '1fr 360px',
    gap: theme.spacing(2.5), marginBottom: theme.spacing(2.5),
    [theme.breakpoints.down('lg')]: { gridTemplateColumns: '1fr' },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(1.5), marginBottom: theme.spacing(1.5) },
  },

  twoColRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(2.5), marginBottom: theme.spacing(2.5),
    [theme.breakpoints.down('md')]: { gridTemplateColumns: '1fr' },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(1.5), marginBottom: theme.spacing(1.5) },
  },

  threeColRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 360px',
    gap: theme.spacing(2.5), marginBottom: theme.spacing(2.5),
    [theme.breakpoints.down('lg')]: { gridTemplateColumns: '1fr 1fr' },
    [theme.breakpoints.down('md')]: { gridTemplateColumns: '1fr' },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(1.5), marginBottom: theme.spacing(1.5) },
  },

  // ── Shared Panel ─────────────────────────────────────────────────────────────
  panel: {
    borderRadius: 18, background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)', border: '1px solid rgba(79,70,229,0.08)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.05)', overflow: 'hidden',
    animation: 'db-slide-up 0.6s ease both',
    [theme.breakpoints.down('sm')]: { borderRadius: 14 },
  },

  chartPanel: {
    borderRadius: 18, background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)', border: '1px solid rgba(79,70,229,0.08)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.05)', overflow: 'hidden',
    animation: 'db-slide-up 0.6s 0.1s ease both',
    [theme.breakpoints.down('sm')]: { borderRadius: 14 },
  },

  panelHead: {
    padding: theme.spacing(2, 2.75),
    borderBottom: '1px solid rgba(79,70,229,0.07)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.5, 2) },
  },

  panelTitle: {
    fontWeight: 700, fontSize: '0.92rem', color: '#1e293b', letterSpacing: '-0.01em',
    [theme.breakpoints.down('sm')]: { fontSize: '0.82rem' },
  },

  panelBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: { padding: '2px 8px', fontSize: '0.65rem' },
  },

  panelBody: {
    padding: theme.spacing(1.75, 2.75),
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.25, 2) },
  },

  // ── Platform Health ───────────────────────────────────────────────────────────
  healthRow: {
    display: 'flex', alignItems: 'center',
    padding: theme.spacing(1.1, 0),
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    '&:last-child': { borderBottom: 'none' },
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(0.9, 0) },
  },

  healthLabel: {
    fontSize: '0.8rem', color: '#374151', fontWeight: 500,
    display: 'flex', alignItems: 'center', gap: 7,
    minWidth: 160,
    [theme.breakpoints.between('sm', 'md')]: { minWidth: 140, fontSize: '0.76rem' },
    [theme.breakpoints.down('sm')]: { minWidth: 110, fontSize: '0.7rem', gap: 5 },
  },

  healthDot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },

  healthBar: {
    flex: 1, height: 5, borderRadius: 3,
    background: 'rgba(0,0,0,0.06)', margin: theme.spacing(0, 1.5), overflow: 'hidden',
    [theme.breakpoints.down('sm')]: { margin: theme.spacing(0, 1) },
  },

  healthFill: { height: '100%', borderRadius: 3 },

  healthValue: {
    fontSize: '0.78rem', fontWeight: 700, minWidth: 42, textAlign: 'right' as const,
    [theme.breakpoints.down('sm')]: { fontSize: '0.7rem', minWidth: 36 },
  },

  // ── City List ─────────────────────────────────────────────────────────────────
  cityItem: {
    display: 'flex', alignItems: 'center', gap: theme.spacing(1.25),
    padding: theme.spacing(1.1, 0),
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    '&:last-child': { borderBottom: 'none' },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(1) },
  },

  cityRank: {
    width: 26, height: 26, borderRadius: 7,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.72rem', fontWeight: 800, flexShrink: 0,
  },

  cityName: {
    flex: 1, fontSize: '0.82rem', fontWeight: 600, color: '#1e293b',
    [theme.breakpoints.down('sm')]: { fontSize: '0.76rem' },
  },

  citySub: {
    fontSize: '0.68rem', color: 'rgba(0,0,0,0.4)', marginTop: 2,
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },

  cityBar: {
    width: 72, height: 5, borderRadius: 3,
    background: 'rgba(0,0,0,0.06)', overflow: 'hidden',
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },

  cityBarFill: { height: '100%', borderRadius: 3 },

  cityValue: {
    fontSize: '0.8rem', fontWeight: 700, textAlign: 'right' as const, minWidth: 44,
    [theme.breakpoints.down('sm')]: { fontSize: '0.72rem', minWidth: 38 },
  },

  // ── Captain List ─────────────────────────────────────────────────────────────
  captainItem: {
    display: 'flex', alignItems: 'center', gap: theme.spacing(1.25),
    padding: theme.spacing(1.1, 0),
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    '&:last-child': { borderBottom: 'none' },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(1) },
  },

  captainAvatar: {
    width: 36, height: 36, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
    [theme.breakpoints.down('sm')]: { width: 32, height: 32, fontSize: '0.78rem' },
  },

  captainName: {
    fontSize: '0.82rem', fontWeight: 600, color: '#1e293b',
    [theme.breakpoints.down('sm')]: { fontSize: '0.76rem' },
  },
  captainSub: {
    fontSize: '0.68rem', color: 'rgba(0,0,0,0.42)', marginTop: 2,
    [theme.breakpoints.down('sm')]: { fontSize: '0.62rem' },
  },
  captainEarn: {
    fontSize: '0.8rem', fontWeight: 700, textAlign: 'right' as const,
    [theme.breakpoints.down('sm')]: { fontSize: '0.72rem' },
  },
  captainRate: { fontSize: '0.68rem', color: '#f59e0b', textAlign: 'right' as const, marginTop: 2 },

  // ── Activity Feed ─────────────────────────────────────────────────────────────
  activityItem: {
    display: 'flex', alignItems: 'flex-start', gap: theme.spacing(1.25),
    padding: theme.spacing(1.25, 0),
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    '&:last-child': { borderBottom: 'none' },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(1), padding: theme.spacing(1, 0) },
  },

  activityDot: {
    width: 32, height: 32, borderRadius: 9,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    '& .MuiSvgIcon-root': { fontSize: '0.9rem !important' },
    [theme.breakpoints.down('sm')]: { width: 28, height: 28, borderRadius: 8 },
  },

  activityText: {
    flex: 1, fontSize: '0.78rem', color: '#374151', fontWeight: 500, lineHeight: 1.5,
    [theme.breakpoints.down('sm')]: { fontSize: '0.72rem', lineHeight: 1.45 },
  },

  activityTime: {
    fontSize: '0.68rem', color: 'rgba(0,0,0,0.36)', fontWeight: 500,
    flexShrink: 0, marginTop: 2, whiteSpace: 'nowrap' as const,
    [theme.breakpoints.down('sm')]: { fontSize: '0.62rem' },
  },
});
