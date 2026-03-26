import React from 'react';
import { Typography, Tooltip } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box } from '@bandi/component';
import { useStyles } from '../styles';
import FileThumb from './FileThumb';

export interface DocSlotProps {
  label: string;
  file: File | null;
  accentColor: string;
  size?: number;
}

const DocSlot: React.FC<DocSlotProps> = ({ label, file, accentColor, size = 72 }) => {
  const { classes } = useStyles();

  if (file) return <FileThumb file={file} label={label} size={size} />;

  return (
    <Tooltip title={`${label} — not uploaded`} arrow placement='top'>
      <Box
        className={classes.docSlotRoot}
        sx={{
          width: size,
          height: size,
          borderColor: `${accentColor}40`,
          bgcolor: `${accentColor}06`,
        }}
      >
        <UploadFileIcon sx={{ fontSize: size * 0.32, color: `${accentColor}70` }} />
        <Typography
          sx={{
            fontSize: '0.52rem',
            color: `${accentColor}90`,
            fontWeight: 600,
            textAlign: 'center',
            px: 0.5,
            lineHeight: 1.2,
          }}
        >
          {label.replace(' Front', '').replace(' Back', '').toUpperCase()}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default DocSlot;
