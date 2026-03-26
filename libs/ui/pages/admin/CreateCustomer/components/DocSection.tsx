import React, { ReactNode } from 'react';
import { Typography } from '@mui/material';
import { Box } from '@bandi/component';
import { useStyles } from '../styles';
import DocSlot from './DocSlot';

export interface DocSectionProps {
  label: string;
  icon: ReactNode;
  required?: boolean;
  filePreviews?: Array<{ label: string; file: File | null }>;
  accentColor?: string;
  children: ReactNode;
}

const DocSection: React.FC<DocSectionProps> = ({
  label,
  icon,
  required,
  filePreviews,
  accentColor = '#1976d2',
  children,
}) => {
  const { classes } = useStyles();
  const slots = filePreviews ?? [];
  const uploadedCount = slots.filter((f) => f.file !== null).length;
  const allDone = slots.length > 0 && uploadedCount === slots.length;

  return (
    <Box
      className={classes.docSectionRoot}
      sx={{
        borderColor: allDone ? 'success.light' : `${accentColor}28`,
        boxShadow: allDone ? '0 2px 12px rgba(46,125,50,0.10)' : `0 2px 10px ${accentColor}0d`,
      }}
    >
      {/* ─ Gradient header ─ */}
      <Box
        className={classes.docSectionHeader}
        sx={{
          background: allDone
            ? 'linear-gradient(135deg, rgba(46,125,50,0.10) 0%, rgba(46,125,50,0.04) 100%)'
            : `linear-gradient(135deg, ${accentColor}14 0%, ${accentColor}06 100%)`,
          borderColor: allDone ? 'rgba(46,125,50,0.15)' : `${accentColor}18`,
        }}
      >
        {/* Icon badge + label row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
          <Box
            className={classes.docSectionIconBadge}
            sx={{
              background: allDone
                ? 'linear-gradient(135deg, #2e7d32, #43a047)'
                : `linear-gradient(135deg, ${accentColor}cc, ${accentColor})`,
              boxShadow: allDone ? '0 3px 8px rgba(46,125,50,0.35)' : `0 3px 8px ${accentColor}40`,
            }}
          >
            <Box sx={{ color: '#fff', display: 'flex', '& svg': { fontSize: '1rem' } }}>{icon}</Box>
          </Box>

          {/* Label + subtitle */}
          <Box sx={{ minWidth: 0 }}>
            <Typography
              className={classes.docSectionLabel}
              sx={{ color: allDone ? 'success.dark' : accentColor }}
            >
              {label}
              {required && !allDone && <span style={{ color: '#d32f2f', marginLeft: 3 }}>*</span>}
            </Typography>
            {slots.length > 0 && (
              <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', mt: 0.25 }}>
                {allDone
                  ? '✓ All documents uploaded'
                  : `${uploadedCount} / ${slots.length} uploaded`}
              </Typography>
            )}
          </Box>
        </Box>

        {/* File slots — inline on desktop, full-width row below on mobile */}
        {slots.length > 0 && (
          <Box className={classes.docSectionSlotsRow}>
            {slots.map(({ label: fl, file }) => (
              <DocSlot
                key={fl}
                label={fl}
                file={file}
                accentColor={allDone ? '#2e7d32' : accentColor}
                size={56}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* ─ Body ─ */}
      <Box className={classes.docSectionBody}>{children}</Box>
    </Box>
  );
};

export default DocSection;
