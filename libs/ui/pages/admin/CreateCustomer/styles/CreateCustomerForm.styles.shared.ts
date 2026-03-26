import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  // ─── Shared section card styles (re-exported from CreateTicket shared) ────────
  managementHero: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(3, 4),
    marginBottom: theme.spacing(2.5),
    borderRadius: 16,
    overflow: 'hidden',
    flexShrink: 0,
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: -70,
      right: -70,
      width: 220,
      height: 220,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.07)',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute' as const,
      bottom: -45,
      left: 70,
      width: 160,
      height: 160,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.05)',
      pointerEvents: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2.5, 2.5),
      flexDirection: 'column' as const,
      alignItems: 'flex-start',
    },
  },

  managementHeroIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.16)',
    border: '1.5px solid rgba(255,255,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    position: 'relative' as const,
    zIndex: 1,
  },

  managementHeroText: {
    flex: 1,
    position: 'relative' as const,
    zIndex: 1,
  },

  managementHeroTitle: {
    color: '#fff',
    fontWeight: 800,
    fontSize: '1.45rem',
    letterSpacing: '-0.3px',
    lineHeight: 1.2,
    [theme.breakpoints.down('sm')]: { fontSize: '1.2rem' },
  },

  managementHeroSub: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: '0.85rem',
    marginTop: theme.spacing(0.3),
  },

  sectionCard: {
    borderLeft: '4px solid transparent',
    borderRadius: '14px',
    marginBottom: theme.spacing(2),
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },

  sectionCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.5, 2.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },

  sectionIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  sectionCardTitle: {
    fontWeight: 700,
    fontSize: '0.9rem',
  },

  sectionCardBody: {
    padding: theme.spacing(2.5),
  },

  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },

  // ─── Form root ────────────────────────────────────────────────────────────────
  formRoot: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100%',
  },

  // ─── Sticky CTA bar ───────────────────────────────────────────────────────────
  stickyCtaBar: {
    position: 'sticky',
    bottom: 20,
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    paddingTop: theme.spacing(1.75),
    paddingBottom: theme.spacing(1.75),
    backgroundColor: theme.palette.background.paper,
    borderRadius: '14px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
      alignItems: 'stretch',
      gap: theme.spacing(1.5),
    },
  },

  stickyCtaLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
    flex: 1,
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(3),
    },
  },

  stickyCtaRight: {
    display: 'flex',
    gap: theme.spacing(1),
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
    },
  },

  // ─── Completion bar ───────────────────────────────────────────────────────────
  completionBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    '& .MuiLinearProgress-bar': {
      borderRadius: 3,
      transition: 'width 0.4s ease',
    },
  },

  // ─── Bundle discount badge ────────────────────────────────────────────────────
  bundleDiscountBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5),
    borderRadius: '10px',
    background: 'rgba(245,158,11,0.08)',
    border: '1px solid rgba(245,158,11,0.2)',
  },

  // ─── Bundle item row ──────────────────────────────────────────────────────────
  bundleItemRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),
    padding: theme.spacing(2),
  },

  bundleItemHeader: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(1),
    marginBottom: theme.spacing(0.25),
  },

  bundleItemExpanded: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingTop: 0,
    borderTop: `1px solid ${theme.palette.divider}`,
  },

  // ─── Upload field ─────────────────────────────────────────────────────────────
  uploadFieldRoot: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      alignItems: 'stretch',
      width: '100%',
    },
  },

  uploadFieldButton: {
    textTransform: 'none' as const,
    fontSize: '0.75rem',
    borderRadius: '6px',
    whiteSpace: 'nowrap' as const,
    [theme.breakpoints.down('sm')]: {
      whiteSpace: 'normal' as const,
      width: '100%',
      justifyContent: 'flex-start',
    },
  },

  // ─── Doc section ──────────────────────────────────────────────────────────────
  docSectionRoot: {
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1.5px solid',
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    transition: 'border-color 0.3s, box-shadow 0.3s',
    '&:last-child': { marginBottom: 0 },
  },

  docSectionHeader: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    gap: theme.spacing(1.5),
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    borderBottom: '1px solid',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap' as const,
    },
  },

  docSectionIconBadge: {
    width: 34,
    height: 34,
    borderRadius: '9px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  docSectionLabel: {
    fontWeight: 700,
    fontSize: '0.86rem',
    lineHeight: 1.2,
  },

  docSectionSlotsRow: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
      flexBasis: '100%',
      marginTop: theme.spacing(0.5),
    },
  },

  docSectionBody: {
    padding: theme.spacing(2.5),
  },

  // ─── File thumb ───────────────────────────────────────────────────────────────
  fileThumbRoot: {
    borderRadius: '10px',
    overflow: 'hidden',
    border: '2px solid',
    cursor: 'zoom-in',
    flexShrink: 0,
    position: 'relative' as const,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.2s ease',
    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.22)' },
  },

  fileThumbOverlay: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.82)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'zoom-out',
    backdropFilter: 'blur(4px)',
  },

  fileThumbContent: {
    position: 'relative' as const,
    maxWidth: '90vw',
    maxHeight: '88vh',
  },

  fileThumbCloseBtn: {
    position: 'absolute' as const,
    top: -16,
    right: -16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#fff',
    backdropFilter: 'blur(8px)',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' },
  },

  // ─── Doc slot ─────────────────────────────────────────────────────────────────
  docSlotRoot: {
    borderRadius: '10px',
    border: '2px dashed',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(0.4),
    flexShrink: 0,
    transition: 'all 0.15s ease',
  },
});
