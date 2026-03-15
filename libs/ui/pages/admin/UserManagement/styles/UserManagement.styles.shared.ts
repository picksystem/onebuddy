import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  container: {
    padding: theme.spacing(3),
    background: 'linear-gradient(160deg, #f0f4ff 0%, #fafbff 50%, #f0f4ff 100%)',
    minHeight: '100vh',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      padding: theme.spacing(2),
    },
  },

  // ─── Hero Header ────────────────────────────────────────────────────────────
  pageHeader: {
    marginBottom: theme.spacing(2.5),
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 30%, #4f46e5 65%, #0ea5e9 100%)',
    backgroundSize: '300% 300%',
    animation: 'um-gradient-shift 8s ease infinite',
    borderRadius: 18,
    padding: theme.spacing(3.5, 4),
    position: 'relative',
    overflow: 'hidden',
    boxShadow:
      '0 24px 64px rgba(79,70,229,0.28), 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -100,
      right: -100,
      width: 350,
      height: 350,
      borderRadius: '50%',
      background:
        'radial-gradient(circle at center, rgba(167,139,250,0.38) 0%, rgba(99,102,241,0.12) 50%, transparent 70%)',
      animation: 'um-orb-drift 14s ease-in-out infinite',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -80,
      left: '22%',
      width: 280,
      height: 280,
      borderRadius: '50%',
      background:
        'radial-gradient(circle at center, rgba(14,165,233,0.3) 0%, transparent 70%)',
      animation: 'um-orb-drift 10s ease-in-out infinite reverse',
      pointerEvents: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2.5, 2),
      borderRadius: 12,
    },
  },

  headerOrb3: {
    position: 'absolute',
    bottom: '10%',
    right: '28%',
    width: 180,
    height: 180,
    borderRadius: '50%',
    background:
      'radial-gradient(circle at center, rgba(251,191,36,0.22) 0%, transparent 70%)',
    animation: 'um-float 9s ease-in-out infinite',
    pointerEvents: 'none',
    zIndex: 0,
  },

  titleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    background: 'rgba(255,255,255,0.14)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.24)',
    borderRadius: 40,
    padding: '5px 14px',
    marginBottom: theme.spacing(1.25),
    width: 'fit-content',
    position: 'relative',
    zIndex: 1,
    animation: 'um-slide-up 0.45s ease both',
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 8px #4ade80, 0 0 14px rgba(74,222,128,0.5)',
    animation: 'um-pulse-live 2s ease-in-out infinite',
    flexShrink: 0,
  },

  titleBadgeText: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.92)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
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
    animation: 'um-slide-up 0.5s 0.05s ease both',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.4rem',
    },
  },

  description: {
    color: 'rgba(255,255,255,0.68)',
    marginTop: theme.spacing(0.5),
    fontSize: '0.88rem',
    position: 'relative',
    zIndex: 1,
    animation: 'um-slide-up 0.5s 0.12s ease both',
  },

  // Stat pills inside the header banner
  headerStatRow: {
    display: 'flex',
    gap: theme.spacing(1.25),
    marginTop: theme.spacing(2.75),
    flexWrap: 'wrap' as const,
    position: 'relative',
    zIndex: 1,
    animation: 'um-slide-up 0.5s 0.2s ease both',
  },

  headerStatPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(14px)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 32,
    padding: '8px 16px',
    cursor: 'default',
    transition: 'all 0.25s ease',
    '&:hover': {
      background: 'rgba(255,255,255,0.22)',
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
    },
  },

  headerStatDot: {
    width: 9,
    height: 9,
    borderRadius: '50%',
    flexShrink: 0,
  },

  headerStatValue: {
    fontWeight: 700,
    fontSize: '1.05rem',
    color: '#fff',
    lineHeight: 1,
  },

  headerStatLabel: {
    fontSize: '0.7rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: '0.05em',
  },

  // ─── Stat Cards Grid ────────────────────────────────────────────────────────
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2.5),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr 1fr',
      gap: theme.spacing(1.5),
    },
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
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      borderRadius: '20px 20px 0 0',
    },
    '&:hover': {
      transform: 'translateY(-7px)',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      borderRadius: 16,
    },
  },

  statCard0: {
    animation: 'um-slide-up 0.55s 0s ease both',
    '&::before': { background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(79,70,229,0.16), 0 4px 16px rgba(79,70,229,0.08)' },
  },

  statCard1: {
    animation: 'um-slide-up 0.55s 0.09s ease both',
    '&::before': { background: 'linear-gradient(90deg, #f59e0b, #ef4444)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(245,158,11,0.16), 0 4px 16px rgba(245,158,11,0.08)' },
  },

  statCard2: {
    animation: 'um-slide-up 0.55s 0.18s ease both',
    '&::before': { background: 'linear-gradient(90deg, #10b981, #0d9488)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(16,185,129,0.16), 0 4px 16px rgba(16,185,129,0.08)' },
  },

  statCard3: {
    animation: 'um-slide-up 0.55s 0.27s ease both',
    '&::before': { background: 'linear-gradient(90deg, #0ea5e9, #2563eb)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(14,165,233,0.16), 0 4px 16px rgba(14,165,233,0.08)' },
  },

  statCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1.75),
    marginTop: theme.spacing(0.5),
  },

  statIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'transform 0.3s ease',
    '$statCard:hover &': {
      transform: 'scale(1.08) rotate(-4deg)',
    },
  },

  statIcon: {
    fontSize: '1.55rem !important',
  },

  statValue: {
    fontSize: '2.6rem',
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: theme.spacing(0.4),
    animation: 'um-counter 0.65s cubic-bezier(0.34,1.56,0.64,1) both',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
    },
  },

  statLabel: {
    fontSize: '0.68rem',
    fontWeight: 700,
    color: 'rgba(0,0,0,0.38)',
    letterSpacing: '0.09em',
    textTransform: 'uppercase' as const,
  },

  statDivider: {
    borderColor: 'rgba(0,0,0,0.06)',
    marginBottom: theme.spacing(1.5),
  },

  statSubRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
  },

  statSubDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    flexShrink: 0,
  },

  statSub: {
    fontSize: '0.75rem',
    color: 'rgba(0,0,0,0.48)',
    fontWeight: 500,
  },

  // ─── Glassmorphism Toolbar ────────────────────────────────────────────────
  toolbar: {
    padding: theme.spacing(1.5, 2),
    marginTop: theme.spacing(1),
    background: 'rgba(255,255,255,0.87) !important',
    backdropFilter: 'blur(20px)',
    borderRadius: '14px !important',
    border: '1px solid rgba(79,70,229,0.1) !important',
    boxShadow:
      '0 4px 24px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9) !important',
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
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column' as const,
      alignItems: 'stretch',
      gap: theme.spacing(0.75),
      '& > span': { width: '100%' },
      '& .MuiButton-root': { width: '100%', justifyContent: 'flex-start' },
    },
  },

  buttonLabel: {},

  // ─── Tabs + Search ────────────────────────────────────────────────────────
  tabsBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(14px)',
    borderRadius: 14,
    padding: theme.spacing(0.75),
    marginBottom: theme.spacing(1.5),
    border: '1px solid rgba(79,70,229,0.08)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    '& .MuiTabs-root': {
      minHeight: 44,
    },
    '& .MuiTab-root': {
      minHeight: 44,
      borderRadius: 10,
      fontWeight: 600,
      fontSize: '0.82rem',
      color: theme.palette.text.secondary,
      transition: 'all 0.22s ease',
      position: 'relative',
      '&.Mui-selected': {
        color: '#4f46e5',
        background: 'rgba(79,70,229,0.09)',
        boxShadow: '0 2px 10px rgba(79,70,229,0.14)',
      },
      '&:not(:last-of-type)::after': {
        content: '""',
        position: 'absolute',
        right: 0,
        top: '22%',
        height: '56%',
        width: 1,
        background: 'rgba(0,0,0,0.1)',
        borderRadius: 1,
        pointerEvents: 'none',
      },
    },
    '& .MuiTabs-indicator': {
      display: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
      alignItems: 'stretch',
      borderRadius: 10,
    },
  },

  tableContainer: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 14,
    overflowX: 'auto' as const,
    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
    border: '1px solid rgba(79,70,229,0.06)',
  },

  tabsSearchField: {
    marginLeft: theme.spacing(2),
    flexShrink: 0,
    width: '240px',
    '& .MuiOutlinedInput-root': {
      height: '36px',
      fontSize: '0.85rem',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(14px)',
      borderRadius: 40,
      color: theme.palette.text.primary,
      transition: 'all 0.22s ease',
      '& .MuiOutlinedInput-notchedOutline': {
        border: '1px solid rgba(79,70,229,0.18)',
        borderRadius: 40,
      },
      '&:hover': {
        '& .MuiOutlinedInput-notchedOutline': {
          border: '1px solid rgba(79,70,229,0.4)',
        },
      },
      '&.Mui-focused': {
        boxShadow: '0 0 0 3px rgba(79,70,229,0.1)',
        '& .MuiOutlinedInput-notchedOutline': {
          border: '1px solid #4f46e5',
        },
      },
    },
    '& .MuiInputBase-input': {
      padding: '4px 4px 4px 12px',
      fontSize: '0.85rem',
      color: theme.palette.text.primary,
      '&::placeholder': {
        color: theme.palette.text.secondary,
        opacity: 1,
      },
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      fontSize: '1.1rem',
      color: 'rgba(79,70,229,0.6)',
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginTop: theme.spacing(1),
      width: '100%',
    },
  },

  adminControlsBtn: {
    marginLeft: 'auto',
    flexShrink: 0,
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
      width: '100%',
    },
  },

  selectionIndicator: {
    display: 'block',
    marginTop: theme.spacing(1),
    padding: '5px 10px',
    borderLeft: '3px solid #4f46e5',
    borderRadius: '0 8px 8px 0',
    background: 'linear-gradient(90deg, rgba(79,70,229,0.07), transparent)',
  },

  dividerMobile: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
});
