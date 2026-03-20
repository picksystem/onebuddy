import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  // ── Root ──────────────────────────────────────────────────────────────────
  root: {
    minHeight: '100vh',
    background: '#f8faff',
    display: 'flex',
    flexDirection: 'column' as const,
  },

  // ── Top Nav ───────────────────────────────────────────────────────────────
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 4),
    background: '#ffffff',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
  },

  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.2),
    cursor: 'pointer',
  },

  navBrandIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 20,
  },

  navBrandName: {
    fontWeight: 800,
    fontSize: '1.25rem',
    color: '#1e293b',
    letterSpacing: '-0.02em',
  },

  navBrandTagline: {
    fontSize: '0.65rem',
    color: '#64748b',
    marginTop: -2,
    letterSpacing: '0.04em',
  },

  navActions: {
    display: 'flex',
    gap: theme.spacing(1.5),
    alignItems: 'center',
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 45%, #1d4ed8 100%)',
    padding: theme.spacing(10, 4, 12),
    textAlign: 'center' as const,
    position: 'relative' as const,
    overflow: 'hidden',
  },

  heroOrb1: {
    position: 'absolute' as const,
    top: -120,
    right: -100,
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'rgba(99,102,241,0.12)',
    pointerEvents: 'none' as const,
  },

  heroOrb2: {
    position: 'absolute' as const,
    bottom: -80,
    left: -80,
    width: 360,
    height: 360,
    borderRadius: '50%',
    background: 'rgba(59,130,246,0.1)',
    pointerEvents: 'none' as const,
  },

  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: 20,
    padding: theme.spacing(0.5, 2),
    marginBottom: theme.spacing(3),
    backdropFilter: 'blur(8px)',
  },

  heroBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 8px #4ade80',
  },

  heroTitle: {
    fontWeight: 900,
    fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
    color: '#ffffff',
    letterSpacing: '-0.04em',
    lineHeight: 1.08,
    marginBottom: theme.spacing(2.5),
  },

  heroTitleAccent: {
    background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  heroSubtitle: {
    fontSize: '1.15rem',
    color: 'rgba(255,255,255,0.72)',
    maxWidth: 600,
    margin: '0 auto',
    lineHeight: 1.7,
    marginBottom: theme.spacing(5),
  },

  heroActions: {
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  },

  // ── Stats Bar ─────────────────────────────────────────────────────────────
  statsBar: {
    background: '#ffffff',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    padding: theme.spacing(3, 4),
  },

  statsGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(6),
    flexWrap: 'wrap' as const,
    maxWidth: 900,
    margin: '0 auto',
  },

  statItem: {
    textAlign: 'center' as const,
  },

  statValue: {
    fontWeight: 900,
    fontSize: '2rem',
    color: '#1e3a8a',
    lineHeight: 1,
  },

  statLabel: {
    fontSize: '0.78rem',
    color: '#64748b',
    marginTop: 4,
    fontWeight: 500,
  },

  // ── Portals Section ───────────────────────────────────────────────────────
  portalsSection: {
    padding: theme.spacing(8, 4),
    maxWidth: 1100,
    margin: '0 auto',
    width: '100%',
  },

  sectionLabel: {
    textAlign: 'center' as const,
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#2563eb',
    textTransform: 'uppercase' as const,
    marginBottom: theme.spacing(1),
  },

  sectionTitle: {
    textAlign: 'center' as const,
    fontWeight: 800,
    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
    color: '#0f172a',
    letterSpacing: '-0.03em',
    marginBottom: theme.spacing(1),
  },

  sectionSubtitle: {
    textAlign: 'center' as const,
    color: '#64748b',
    fontSize: '1rem',
    marginBottom: theme.spacing(6),
    maxWidth: 560,
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  // ── Portal Card ───────────────────────────────────────────────────────────
  portalCard: {
    borderRadius: 20,
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.07)',
    background: '#ffffff',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
    },
  },

  portalCardHeader: {
    padding: theme.spacing(3.5, 3, 2.5),
    position: 'relative' as const,
    overflow: 'hidden',
  },

  portalCardBody: {
    padding: theme.spacing(0, 3, 3),
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },

  portalIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },

  portalFeatureList: {
    listStyle: 'none',
    padding: 0,
    margin: `${theme.spacing(2)} 0`,
    flex: 1,
  },

  portalFeatureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: theme.spacing(1),
    fontSize: '0.875rem',
    color: '#475569',
    lineHeight: 1.5,
  },

  portalFeatureDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    marginTop: 7,
    flexShrink: 0,
  },

  portalBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    padding: '2px 8px',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    marginBottom: theme.spacing(1),
  },

  // ── Platform Section ──────────────────────────────────────────────────────
  platformSection: {
    background: '#f1f5f9',
    padding: theme.spacing(8, 4),
  },

  platformGrid: {
    maxWidth: 1100,
    margin: '0 auto',
    width: '100%',
  },

  featureCard: {
    background: '#ffffff',
    borderRadius: 16,
    padding: theme.spacing(3),
    border: '1px solid rgba(0,0,0,0.06)',
    height: '100%',
  },

  featureIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(1.5),
  },

  // ── Mobile Download Section ───────────────────────────────────────────────
  downloadSection: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
    padding: theme.spacing(8, 4),
    textAlign: 'center' as const,
    position: 'relative' as const,
    overflow: 'hidden',
  },

  downloadOrb: {
    position: 'absolute' as const,
    top: -60,
    right: -60,
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'rgba(99,102,241,0.15)',
    pointerEvents: 'none' as const,
  },

  downloadAppCard: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 18,
    padding: theme.spacing(3.5),
    backdropFilter: 'blur(12px)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: theme.spacing(2),
    transition: 'background 0.2s',
    '&:hover': {
      background: 'rgba(255,255,255,0.12)',
    },
  },

  downloadAppIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  comingSoonBadge: {
    background: 'rgba(251,191,36,0.18)',
    border: '1px solid rgba(251,191,36,0.4)',
    borderRadius: 20,
    padding: '4px 14px',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#fbbf24',
    letterSpacing: '0.06em',
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    background: '#0f172a',
    padding: theme.spacing(4, 4, 3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(2),
  },

  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: 'rgba(255,255,255,0.9)',
  },

  footerLinks: {
    display: 'flex',
    gap: theme.spacing(3),
    flexWrap: 'wrap' as const,
  },

  footerLink: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    transition: 'color 0.15s',
    '&:hover': { color: 'rgba(255,255,255,0.85)' },
  },
});
