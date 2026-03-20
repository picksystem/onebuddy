import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  container: {
    padding: theme.spacing(3),
    background: 'linear-gradient(160deg, #eff6ff 0%, #fafbff 50%, #e0e7ff 100%)',
    minHeight: '100vh',
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.5) },
    [theme.breakpoints.between('sm', 'md')]: { padding: theme.spacing(2) },
  },

  pageHeader: {
    marginBottom: theme.spacing(2.5),
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4f46e5 65%, #818cf8 100%)',
    backgroundSize: '300% 300%',
    borderRadius: 18,
    padding: theme.spacing(3.5, 4),
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow: '0 24px 64px rgba(79,70,229,0.28), 0 8px 24px rgba(0,0,0,0.12)',
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(2.5, 2), borderRadius: 12 },
  },

  headerOrb3: {
    position: 'absolute' as const,
    bottom: '10%',
    right: '28%',
    width: 180,
    height: 180,
    borderRadius: '50%',
    background: 'radial-gradient(circle at center, rgba(251,191,36,0.22) 0%, transparent 70%)',
    pointerEvents: 'none' as const,
    zIndex: 0,
  },

  pageHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(0.5),
    position: 'relative' as const,
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
    position: 'relative' as const,
    zIndex: 1,
    [theme.breakpoints.down('sm')]: { fontSize: '1.4rem' },
  },

  description: {
    color: 'rgba(255,255,255,0.68)',
    marginTop: theme.spacing(0.5),
    fontSize: '0.88rem',
    position: 'relative' as const,
    zIndex: 1,
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
    position: 'relative' as const,
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
    '&:hover': { transform: 'translateY(-7px)' },
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(2), borderRadius: 16 },
  },

  statCard0: {
    '&::before': { background: 'linear-gradient(90deg, #0ea5e9, #6366f1)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(14,165,233,0.16)' },
  },
  statCard1: {
    '&::before': { background: 'linear-gradient(90deg, #f59e0b, #ef4444)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(245,158,11,0.16)' },
  },
  statCard2: {
    '&::before': { background: 'linear-gradient(90deg, #10b981, #0d9488)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(16,185,129,0.16)' },
  },
  statCard3: {
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
    width: 52,
    height: 52,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'transform 0.3s ease',
  },

  statIcon: { fontSize: '1.55rem !important' },

  statValue: {
    fontSize: '2.6rem',
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: theme.spacing(0.4),
    [theme.breakpoints.down('sm')]: { fontSize: '2rem' },
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
    border: '1px solid rgba(79,70,229,0.1) !important',
    boxShadow: '0 4px 24px rgba(0,0,0,0.05) !important',
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.25) },
  },

  toolbarStack: {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: theme.spacing(0.75),
    alignItems: 'center',
    '& > span': { flex: 1, minWidth: 0 },
    '& span > .MuiButton-root': { width: '100%' },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
      alignItems: 'stretch',
      '& > span': { flex: 'unset', width: '100%' },
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
    border: '1px solid rgba(79,70,229,0.08)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    '& .MuiTabs-root': { minHeight: 44 },
    '& .MuiTab-root': {
      minHeight: 44,
      borderRadius: 10,
      fontWeight: 600,
      fontSize: '0.82rem',
      color: 'rgba(0,0,0,0.55)',
      transition: 'all 0.22s ease',
      '&.Mui-selected': {
        color: '#4f46e5',
        background: 'rgba(79,70,229,0.08)',
      },
    },
    '& .MuiTabs-indicator': { display: 'none' },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
      alignItems: 'stretch',
      borderRadius: 10,
    },
  },

  searchField: {
    marginLeft: theme.spacing(2),
    flexShrink: 0,
    width: '240px',
    '& .MuiOutlinedInput-root': {
      height: '36px',
      fontSize: '0.85rem',
      background: 'rgba(255,255,255,0.92)',
      borderRadius: 40,
    },
    '& .MuiInputBase-input': { padding: '4px 4px 4px 12px', fontSize: '0.85rem' },
    [theme.breakpoints.down('sm')]: { marginLeft: 0, marginTop: theme.spacing(1), width: '100%' },
  },

  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflowX: 'auto' as const,
    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
    border: '1px solid rgba(79,70,229,0.06)',
  },

  emptyState: {
    textAlign: 'center' as const,
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    border: '2px dashed rgba(79,70,229,0.15)',
    borderRadius: 16,
    marginTop: theme.spacing(2),
    background: 'rgba(255,255,255,0.7)',
  },

  emptyIcon: {
    fontSize: '48px !important',
    color: 'rgba(79,70,229,0.3) !important',
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
    borderTop: '1px solid rgba(79,70,229,0.08)',
    fontSize: '0.78rem',
    color: 'rgba(0,0,0,0.45)',
  },
}));
