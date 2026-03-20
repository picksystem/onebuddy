import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  root: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.95rem',
    },
    '& .MuiFormHelperText-root': {
      fontSize: '0.75rem',
      marginLeft: theme.spacing(0.5),
    },
    '& .MuiSelect-select': {
      display: 'flex !important',
      alignItems: 'center',
    },
    '& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)': {
      transform: 'translate(13px, 10px) scale(0.9)',
    },
    [theme.breakpoints.down('sm')]: {
      '& .MuiSelect-select': {
        fontSize: '0.875rem',
      },
    },
  },
});
