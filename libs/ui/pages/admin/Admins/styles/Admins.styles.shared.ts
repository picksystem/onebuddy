import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  container: {
    padding: theme.spacing(3),
    background: 'linear-gradient(160deg, #fff1f2 0%, #fafbff 50%, #ffe4e6 100%)',
    minHeight: '100vh',
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.5) },
    [theme.breakpoints.between('sm', 'md')]: { padding: theme.spacing(2) },
  },

  pageHeader: {
    marginBottom: theme.spacing(2.5),
    background: 'linear-gradient(135deg, #3b0764 0%, #7f1d1d 30%, #dc2626 65%, #f87171 100%)',
    backgroundSize: '300% 300%',
    animation: 'adm-gradient-shift 8s ease infinite',
    borderRadius: 18,
    padding: theme.spacing(3.5, 4),
    position: 'relative',
    overflow: 'hidden',
    boxShadow:
      '0 24px 64px rgba(220,38,38,0.28), 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -100, right: -100,
      width: 350, height: 350,
      borderRadius: '50%',
      background: 'radial-gradient(circle at center, rgba(248,113,113,0.38) 0%, rgba(220,38,38,0.12) 50%, transparent 70%)',
      animation: 'adm-orb-drift 14s ease-in-out infinite',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -80, left: '22%',
      width: 280, height: 280,
      borderRadius: '50%',
      background: 'radial-gradient(circle at center, rgba(220,38,38,0.3) 0%, transparent 70%)',
      animation: 'adm-orb-drift 10s ease-in-out infinite reverse',
      pointerEvents: 'none',
    },
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(2.5, 2), borderRadius: 12 },
  },

  headerOrb3: {
    position: 'absolute',
    bottom: '10%', right: '28%',
    width: 180, height: 180,
    borderRadius: '50%',
    background: 'radial-gradient(circle at center, rgba(251,191,36,0.22) 0%, transparent 70%)',
    animation: 'adm-float 9s ease-in-out infinite',
    pointerEvents: 'none',
    zIndex: 0,
  },

  pageHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(0.5),
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
      alignItems: 'flex-start',
      gap: theme.spacing(1),
    },
  },

  title: {
    fontWeight: 800,
    color: '#fff',
    fontSize: '2rem',
    letterSpacing: '-0.028em',
    lineHeight: 1.18,
    textShadow: '0 2px 18px rgba(0,0,0,0.28)',
    position: 'relative',
    zIndex: 1,
    animation: 'adm-slide-up 0.5s 0.05s ease both',
    [theme.breakpoints.down('sm')]: { fontSize: '1.4rem' },
  },

  description: {
    color: 'rgba(255,255,255,0.68)',
    marginTop: theme.spacing(0.5),
    fontSize: '0.88rem',
    position: 'relative',
    zIndex: 1,
    animation: 'adm-slide-up 0.5s 0.12s ease both',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2.5),
    [theme.breakpoints.down('md')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
    [theme.breakpoints.down('sm')]: { gridTemplateColumns: '1fr 1fr', gap: theme.spacing(1.5) },
  },

  statCard: {
    borderRadius: 20,
    padding: theme.spacing(2.5),
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'default',
    transition: 'transform 0.32s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.32s ease',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: 4,
      borderRadius: '20px 20px 0 0',
    },
    '&:hover': { transform: 'translateY(-7px)' },
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(2), borderRadius: 16 },
  },

  statCard0: {
    animation: 'adm-slide-up 0.55s 0s ease both',
    '&::before': { background: 'linear-gradient(90deg, #dc2626, #f87171)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(220,38,38,0.16)' },
  },
  statCard1: {
    animation: 'adm-slide-up 0.55s 0.09s ease both',
    '&::before': { background: 'linear-gradient(90deg, #f59e0b, #ef4444)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(245,158,11,0.16)' },
  },
  statCard2: {
    animation: 'adm-slide-up 0.55s 0.18s ease both',
    '&::before': { background: 'linear-gradient(90deg, #10b981, #0d9488)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(16,185,129,0.16)' },
  },
  statCard3: {
    animation: 'adm-slide-up 0.55s 0.27s ease both',
    '&::before': { background: 'linear-gradient(90deg, #8b5cf6, #d946ef)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(139,92,246,0.16)' },
  },

  statCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1.75),
    marginTop: theme.spacing(0.5),
  },

  statIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    transition: 'transform 0.3s ease',
  },

  statIcon: { fontSize: '1.55rem !important' },

  statValue: {
    fontSize: '2.6rem', fontWeight: 800, lineHeight: 1,
    marginBottom: theme.spacing(0.4),
    animation: 'adm-counter 0.65s cubic-bezier(0.34,1.56,0.64,1) both',
    [theme.breakpoints.down('sm')]: { fontSize: '2rem' },
  },

  statLabel: {
    fontSize: '0.68rem', fontWeight: 700,
    color: 'rgba(0,0,0,0.38)', letterSpacing: '0.09em',
    textTransform: 'uppercase' as const,
  },

  statDivider: {
    borderColor: 'rgba(0,0,0,0.06)',
    marginBottom: theme.spacing(1.5),
  },

  statSubRow: { display: 'flex', alignItems: 'center', gap: 7 },

  statSubDot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },

  statSub: { fontSize: '0.75rem', color: 'rgba(0,0,0,0.48)', fontWeight: 500 },

  toolbar: {
    padding: theme.spacing(1.5, 2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
    background: 'rgba(255,255,255,0.87) !important',
    backdropFilter: 'blur(20px)',
    borderRadius: '14px !important',
    border: '1px solid rgba(220,38,38,0.1) !important',
    boxShadow: '0 4px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9) !important',
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.25) },
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

  tabsBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(14px)',
    borderRadius: 14,
    padding: theme.spacing(0.75),
    marginBottom: theme.spacing(1.5),
    border: '1px solid rgba(220,38,38,0.08)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    '& .MuiTabs-root': { minHeight: 44 },
    '& .MuiTab-root': {
      minHeight: 44, borderRadius: 10, fontWeight: 600, fontSize: '0.82rem',
      color: 'rgba(0,0,0,0.55)', transition: 'all 0.22s ease',
      '&.Mui-selected': {
        color: '#dc2626',
        background: 'rgba(220,38,38,0.08)',
        boxShadow: '0 2px 10px rgba(220,38,38,0.14)',
      },
    },
    '& .MuiTabs-indicator': { display: 'none' },
    [theme.breakpoints.down('sm')]: { flexDirection: 'column' as const, alignItems: 'stretch', borderRadius: 10 },
  },

  searchField: {
    marginLeft: theme.spacing(2),
    flexShrink: 0,
    width: '240px',
    '& .MuiOutlinedInput-root': {
      height: '36px', fontSize: '0.85rem',
      background: 'rgba(255,255,255,0.92)',
      borderRadius: 40,
      '& .MuiOutlinedInput-notchedOutline': { border: '1px solid rgba(220,38,38,0.18)', borderRadius: 40 },
      '&:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid rgba(220,38,38,0.4)' },
      '&.Mui-focused': {
        boxShadow: '0 0 0 3px rgba(220,38,38,0.1)',
        '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #dc2626' },
      },
    },
    '& .MuiInputBase-input': { padding: '4px 4px 4px 12px', fontSize: '0.85rem' },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': { fontSize: '1.1rem', color: 'rgba(220,38,38,0.6)' },
    [theme.breakpoints.down('sm')]: { marginLeft: 0, marginTop: theme.spacing(1), width: '100%' },
  },

  tableContainer: {
    backgroundColor: 'background.paper',
    borderRadius: 14,
    overflowX: 'auto' as const,
    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
    border: '1px solid rgba(220,38,38,0.06)',
  },

  emptyState: {
    textAlign: 'center' as const,
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    border: '2px dashed',
    borderColor: 'rgba(220,38,38,0.15)',
    borderRadius: 16,
    marginTop: theme.spacing(2),
    background: 'rgba(255,255,255,0.7)',
  },

  emptyIcon: {
    fontSize: '48px !important',
    color: 'rgba(220,38,38,0.3) !important',
    marginBottom: '8px !important',
  },

  dividerMobile: {
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },

  selectionIndicator: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(0.75),
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(0.75),
    borderTop: '1px solid rgba(220,38,38,0.08)',
    fontSize: '0.78rem',
    color: 'rgba(0,0,0,0.45)',
    animation: 'adm-slide-up 0.55s cubic-bezier(0.34,1.56,0.64,1) both',
  },
});
