import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  container: {
    padding: theme.spacing(3),
    background: 'linear-gradient(160deg, #ecfdf5 0%, #fafbff 50%, #e0f2fe 100%)',
    minHeight: '100vh',
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.5) },
    [theme.breakpoints.between('sm', 'md')]: { padding: theme.spacing(2) },
  },

  pageHeader: {
    marginBottom: theme.spacing(2.5),
    background: 'linear-gradient(135deg, #022c22 0%, #064e3b 28%, #0f766e 62%, #0ea5e9 100%)',
    backgroundSize: '300% 300%',
    animation: 'vr-gradient-shift 8s ease infinite',
    borderRadius: 18,
    padding: theme.spacing(3.5, 4),
    position: 'relative',
    overflow: 'hidden',
    boxShadow:
      '0 24px 64px rgba(15,118,110,0.28), 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -100, right: -100,
      width: 350, height: 350,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(52,211,153,0.38) 0%, rgba(15,118,110,0.12) 50%, transparent 70%)',
      animation: 'vr-orb-drift 14s ease-in-out infinite',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -80, left: '22%',
      width: 280, height: 280,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)',
      animation: 'vr-orb-drift 10s ease-in-out infinite reverse',
      pointerEvents: 'none',
    },
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(2.5, 2), borderRadius: 12 },
  },

  headerOrb3: {
    position: 'absolute',
    bottom: '10%', left: '58%',
    width: 180, height: 180,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)',
    animation: 'vr-orb-drift 9s ease-in-out 2s infinite',
    pointerEvents: 'none',
  },

  pageHeaderRow: {
    display: 'flex', alignItems: 'center',
    gap: theme.spacing(1.5), position: 'relative', zIndex: 1,
    marginBottom: theme.spacing(0.75),
  },

  headerIconWrap: {
    width: 44, height: 44,
    borderRadius: 13,
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.22)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    '& .MuiSvgIcon-root': { fontSize: '1.4rem', color: '#fff' },
    [theme.breakpoints.down('sm')]: { width: 36, height: 36, borderRadius: 10 },
  },

  title: {
    color: '#fff',
    fontWeight: 800,
    letterSpacing: '-0.01em',
    position: 'relative', zIndex: 1,
    textShadow: '0 2px 12px rgba(0,0,0,0.2)',
    [theme.breakpoints.down('sm')]: { fontSize: '1.1rem' },
  },

  description: {
    color: 'rgba(255,255,255,0.65)',
    position: 'relative', zIndex: 1,
    fontSize: '0.875rem',
    [theme.breakpoints.down('sm')]: { fontSize: '0.8rem' },
  },

  // ── Stat Cards ────────────────────────────────────────────────────────────────
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2.5),
    [theme.breakpoints.down('lg')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
    [theme.breakpoints.down('sm')]: { gridTemplateColumns: '1fr 1fr', gap: theme.spacing(1.25) },
  },

  statCard: {
    borderRadius: 16,
    padding: theme.spacing(2.25),
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
    position: 'relative', overflow: 'hidden',
    transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
    '&::before': {
      content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 3,
      borderRadius: '16px 16px 0 0',
    },
    '&:hover': { transform: 'translateY(-4px)' },
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.5), borderRadius: 12 },
  },

  statCard0: {
    animation: 'vr-slide-up 0.5s 0s ease both',
    '&::before': { background: 'linear-gradient(90deg, #0f766e, #14b8a6)' },
    '&:hover': { boxShadow: '0 12px 32px rgba(15,118,110,0.16)' },
  },
  statCard1: {
    animation: 'vr-slide-up 0.5s 0.08s ease both',
    '&::before': { background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' },
    '&:hover': { boxShadow: '0 12px 32px rgba(245,158,11,0.16)' },
  },
  statCard2: {
    animation: 'vr-slide-up 0.5s 0.16s ease both',
    '&::before': { background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)' },
    '&:hover': { boxShadow: '0 12px 32px rgba(14,165,233,0.16)' },
  },
  statCard3: {
    animation: 'vr-slide-up 0.5s 0.24s ease both',
    '&::before': { background: 'linear-gradient(90deg, #10b981, #34d399)' },
    '&:hover': { boxShadow: '0 12px 32px rgba(16,185,129,0.16)' },
  },

  statCardTop: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: theme.spacing(1.25), marginTop: theme.spacing(0.5),
  },

  statValue: {
    fontSize: '1.9rem', fontWeight: 800, lineHeight: 1,
    animation: 'vr-counter 0.7s cubic-bezier(0.34,1.56,0.64,1) both',
    [theme.breakpoints.down('sm')]: { fontSize: '1.4rem' },
  },

  statLabel: {
    fontSize: '0.65rem', fontWeight: 700,
    color: 'rgba(0,0,0,0.38)', letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    marginTop: theme.spacing(0.25),
  },

  statIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    [theme.breakpoints.down('sm')]: { width: 36, height: 36, borderRadius: 9 },
  },

  statIcon: { fontSize: '1.35rem !important' },

  statDivider: {
    borderColor: 'rgba(0,0,0,0.06)',
    margin: `${theme.spacing(1.25)} 0`,
  },

  statSubRow: { display: 'flex', alignItems: 'center', gap: 6 },

  statSubDot: {
    width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
    animation: 'vr-pulse 2s ease-in-out infinite',
  },

  statSub: {
    fontSize: '0.7rem', color: 'rgba(0,0,0,0.45)', fontWeight: 500,
  },

  // ── Tabs + Search ─────────────────────────────────────────────────────────────
  tabsBox: {
    display: 'flex', alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    background: '#fff',
    borderRadius: 14,
    border: '1px solid rgba(15,118,110,0.1)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    padding: theme.spacing(0.75, 1.5),
    [theme.breakpoints.down('md')]: { flexDirection: 'column' as const, alignItems: 'stretch', gap: theme.spacing(1) },
  },

  tabsFlex: { flex: 1 },

  searchField: {
    minWidth: 220,
    '& .MuiOutlinedInput-root': {
      borderRadius: 20,
      height: 38,
      fontSize: '0.85rem',
      background: 'rgba(15,118,110,0.04)',
      '& fieldset': { borderColor: 'rgba(15,118,110,0.15)' },
      '&:hover fieldset': { borderColor: 'rgba(15,118,110,0.35)' },
      '&.Mui-focused fieldset': { borderColor: '#0f766e' },
    },
    [theme.breakpoints.down('md')]: { minWidth: 'unset', width: '100%' },
  },

  // ── Table ─────────────────────────────────────────────────────────────────────
  tableContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    border: '1px solid rgba(15,118,110,0.08)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
    background: '#fff',
  },

  // ── Empty state ───────────────────────────────────────────────────────────────
  emptyState: {
    display: 'flex', flexDirection: 'column' as const,
    alignItems: 'center', justifyContent: 'center',
    padding: theme.spacing(6),
    gap: theme.spacing(1.5),
    background: '#fff',
    borderRadius: 14,
    border: '1px solid rgba(15,118,110,0.08)',
  },

  emptyIcon: {
    fontSize: '3rem !important',
    color: 'rgba(15,118,110,0.25)',
  },

  toolbar: {
    padding: theme.spacing(1.5, 2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
    background: 'rgba(255,255,255,0.87) !important',
    backdropFilter: 'blur(20px)',
    borderRadius: '14px !important',
    border: '1px solid rgba(15,118,110,0.12) !important',
    boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9) !important',
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.25),
    },
  },

  toolbarStack: {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: theme.spacing(0.75),
    alignItems: 'center',
    '& > span': { flex: 1, minWidth: 0 },
    '& > .MuiButton-root': { flex: 1, minWidth: 0 },
    '& span > .MuiButton-root': { width: '100%' },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
      alignItems: 'stretch',
      gap: theme.spacing(0.75),
      '& > span': { flex: 'unset' as const, width: '100%' },
      '& > .MuiButton-root': { flex: 'unset' as const, width: '100%' },
      '& .MuiButton-root': { width: '100%', justifyContent: 'flex-start' },
    },
  },

  buttonLabel: {},

  dividerMobile: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },

  selectionIndicator: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(0.75),
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(0.75),
    borderTop: '1px solid rgba(15,118,110,0.1)',
    fontSize: '0.78rem',
    color: 'rgba(0,0,0,0.45)',
    animation: 'vr-slide-up 0.55s cubic-bezier(0.34,1.56,0.64,1) both',
  },
});
