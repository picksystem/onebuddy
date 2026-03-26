import React, { useState, useEffect } from 'react';
import { Typography, Tooltip, IconButton } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@bandi/component';
import { useStyles } from '../styles';

export interface FileThumbProps {
  file: File;
  label: string;
  size?: number;
}

const FileThumb: React.FC<FileThumbProps> = ({ file, label, size = 72 }) => {
  const { classes } = useStyles();
  const [url, setUrl] = useState('');
  const [open, setOpen] = useState(false);
  const isImage = file.type.startsWith('image/');

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <>
      <Tooltip title={`${label} — click to preview`} arrow placement='top'>
        <Box
          onClick={() => setOpen(true)}
          className={classes.fileThumbRoot}
          sx={{
            width: size,
            height: size,
            borderColor: 'success.light',
          }}
        >
          {isImage && url ? (
            <img
              src={url}
              alt={label}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                bgcolor: '#fff3e0',
                gap: 0.5,
              }}
            >
              <PictureAsPdfIcon sx={{ fontSize: size * 0.4, color: '#e53935' }} />
              <Typography
                sx={{
                  fontSize: '0.55rem',
                  color: '#e53935',
                  fontWeight: 700,
                  textAlign: 'center',
                  px: 0.5,
                  lineHeight: 1.2,
                }}
              >
                PDF
              </Typography>
            </Box>
          )}
          {/* Uploaded badge */}
          <Box
            sx={{
              position: 'absolute',
              top: 3,
              right: 3,
              width: 16,
              height: 16,
              borderRadius: '50%',
              bgcolor: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 11, color: '#fff' }} />
          </Box>
        </Box>
      </Tooltip>

      {/* Full-size preview dialog */}
      {open && (
        <Box className={classes.fileThumbOverlay} onClick={() => setOpen(false)}>
          <Box className={classes.fileThumbContent}>
            <IconButton onClick={() => setOpen(false)} className={classes.fileThumbCloseBtn}>
              <CloseIcon fontSize='small' />
            </IconButton>
            {isImage && url ? (
              <img
                src={url}
                alt={label}
                style={{
                  maxWidth: '88vw',
                  maxHeight: '80vh',
                  borderRadius: 12,
                  boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            ) : (
              <Box
                sx={{
                  p: 6,
                  bgcolor: '#fff3e0',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <PictureAsPdfIcon sx={{ fontSize: 80, color: '#e53935' }} />
                <Typography sx={{ fontWeight: 700, color: '#e53935' }}>{label}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                  {file.name}
                </Typography>
              </Box>
            )}
            <Typography
              sx={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.78rem',
                mt: 1.5,
              }}
            >
              {label} — {file.name}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default FileThumb;
