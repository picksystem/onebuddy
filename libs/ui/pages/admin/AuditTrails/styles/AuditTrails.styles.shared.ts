import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  container: {
    padding: theme.spacing(2),
    minHeight: '100%',
    background: 'linear-gradient(145deg, #f5f3ff 0%, #ede9fe 40%, #f8f5ff 100%)',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3),
    },
  },

  header: {
    marginBottom: theme.spacing(4),
  },

  title: {
    fontWeight: 800,
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: '1.5rem',
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.875rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2rem',
    },
  },

  subtitle: {
    color: '#64748b',
    fontSize: '0.875rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: theme.spacing(2),
    },
  },

  statCard: {
    padding: theme.spacing(2),
    borderRadius: '14px',
    textAlign: 'center',
    transition: 'all 0.25s ease',
    cursor: 'default',
    '&:hover': {
      transform: 'translateY(-3px)',
    },
  },

  statValue: {
    fontSize: '1.5rem',
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: theme.spacing(0.25),
  },

  statLabel: {
    fontSize: '0.78rem',
    color: '#64748b',
    fontWeight: 600,
    marginTop: theme.spacing(0.25),
  },

  contentCard: {
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(99,102,241,0.1)',
    boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
    backdropFilter: 'blur(20px)',
    overflow: 'hidden',
  },

  actionButtons: {
    display: 'flex',
    gap: theme.spacing(0.5),
    justifyContent: 'center',
  },
});
