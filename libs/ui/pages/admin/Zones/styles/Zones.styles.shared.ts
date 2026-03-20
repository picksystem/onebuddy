import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  container: {
    padding: theme.spacing(2),
    minHeight: '100%',
    background: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 40%, #f0fdf4 100%)',
    [theme.breakpoints.up('sm')]: { padding: theme.spacing(3) },
  },
  header: { marginBottom: theme.spacing(4) },
  title: {
    fontWeight: 800,
    background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: '1.5rem',
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.up('sm')]: { fontSize: '1.875rem' },
    [theme.breakpoints.up('md')]: { fontSize: '2rem' },
  },
  subtitle: {
    color: '#64748b',
    fontSize: '0.875rem',
    [theme.breakpoints.up('md')]: { fontSize: '1rem' },
  },
});
