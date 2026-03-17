import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  container: {
    padding: theme.spacing(2),
    minHeight: '100%',
    background: 'linear-gradient(160deg, #f0f4ff 0%, #fafbff 50%, #f0f4ff 100%)',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3),
    },
  },

  // ── Hero Header ────────────────────────────────────────────────────────────
  pageHeader: {
    marginBottom: theme.spacing(3),
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 35%, #4f46e5 70%, #0ea5e9 100%)',
    backgroundSize: '300% 300%',
    borderRadius: theme.spacing(4),
    padding: theme.spacing(3),
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 20px 56px rgba(79,70,229,0.25)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -80,
      right: -80,
      width: 280,
      height: 280,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -60,
      left: '25%',
      width: 220,
      height: 220,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(14,165,233,0.25) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4),
    },
  },

  pageHeaderTitle: {
    fontWeight: 800,
    color: '#fff',
    fontSize: '1.4rem',
    letterSpacing: '-0.025em',
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.9rem',
    },
  },

  pageHeaderSubtitle: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: '0.875rem',
    marginTop: theme.spacing(0.5),
    position: 'relative',
    zIndex: 1,
  },

  // ── Tab Bar ────────────────────────────────────────────────────────────────
  tabBar: {
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(14px)',
    borderRadius: theme.spacing(3.5),
    padding: theme.spacing(0.75),
    marginBottom: theme.spacing(3),
    border: '1px solid rgba(79,70,229,0.08)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
  },

  tabs: {
    minHeight: 44,
    '& .MuiTab-root': {
      minHeight: 44,
      borderRadius: '10px',
      fontWeight: 600,
      fontSize: '0.82rem',
      textTransform: 'none' as const,
      color: 'text.secondary',
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
    '& .MuiTabs-indicator': { display: 'none' },
  },

  // ── Admin Controls Tab - two-column grid ────────────────────────────────────
  adminControlsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing(3),
    alignItems: 'start',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '360px 1fr',
    },
  },

  // ── Panel (shared for theme list and preview) ──────────────────────────────
  panel: {
    background: 'rgba(255,255,255,0.92)',
    borderRadius: theme.spacing(4),
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },

  panelHeader: {
    padding: theme.spacing(2.5),
    borderBottom: '1px solid rgba(0,0,0,0.06)',
  },

  panelHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  panelTitle: {
    fontWeight: 700,
    fontSize: '0.95rem',
  },

  panelSubtitle: {
    fontSize: '0.78rem',
    color: 'text.secondary',
    marginTop: theme.spacing(0.25),
  },

  panelAutoSave: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    opacity: 0.65,
  },

  // ── Theme list ─────────────────────────────────────────────────────────────
  themeList: {
    padding: theme.spacing(1.25),
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(0.5),
    maxHeight: 540,
    overflowY: 'auto' as const,
  },

  // ── Preview panel ──────────────────────────────────────────────────────────
  previewPanelHeaderRow: {
    padding: theme.spacing(2.5),
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  previewContent: {
    padding: theme.spacing(2.5),
  },

  colorPaletteLabel: {
    textTransform: 'uppercase' as const,
    letterSpacing: '0.09em',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1.5),
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'text.secondary',
  },

  colorPaletteRow: {
    display: 'flex',
    gap: theme.spacing(1.5),
    flexWrap: 'wrap' as const,
  },

  colorSwatch: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    background: '#f8fafc',
    borderRadius: theme.spacing(2.5),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    paddingTop: theme.spacing(0.85),
    paddingBottom: theme.spacing(0.85),
    border: '1px solid rgba(0,0,0,0.06)',
    transition: 'all 0.2s ease',
  },

  colorSwatchDot: {
    width: 20,
    height: 20,
    borderRadius: theme.spacing(1.5),
    flexShrink: 0,
    border: '1.5px solid rgba(0,0,0,0.1)',
  },

  colorSwatchLabel: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'text.secondary',
    lineHeight: 1.2,
  },

  colorSwatchHex: {
    fontSize: '0.65rem',
    color: 'text.disabled',
    fontFamily: 'monospace',
    lineHeight: 1.3,
  },

  // ── AppPreview - browser chrome ─────────────────────────────────────────────
  appPreviewWrapper: {
    borderRadius: theme.spacing(3),
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.1)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    transition: 'box-shadow 0.3s ease',
    userSelect: 'none' as const,
  },

  browserChrome: {
    height: 32,
    background: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    borderBottom: '1px solid rgba(0,0,0,0.08)',
  },

  browserUrlBar: {
    flex: 1,
    height: 16,
    borderRadius: theme.spacing(2),
    background: '#e2e8f0',
    marginLeft: theme.spacing(1.5),
    marginRight: theme.spacing(1.5),
  },

  appLayout: {
    height: 230,
    display: 'flex',
  },

  // ── General tab row items ──────────────────────────────────────────────────
  settingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    padding: theme.spacing(2.5),
    borderRadius: theme.spacing(3),
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      transform: 'translateY(-1px)',
    },
  },

  settingRowList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(2),
  },

  settingValue: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(0.85),
    paddingBottom: theme.spacing(0.85),
    borderRadius: theme.spacing(2),
    background: 'rgba(79,70,229,0.06)',
    border: '1px solid rgba(79,70,229,0.12)',
    color: '#4f46e5',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap' as const,
    fontSize: '0.82rem',
    fontWeight: 500,
  },
});
