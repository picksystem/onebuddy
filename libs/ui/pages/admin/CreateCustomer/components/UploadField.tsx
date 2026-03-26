import React from 'react';
import { Chip } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button } from '@bandi/component';
import { useStyles } from '../styles';

export interface UploadFieldProps {
  label: string;
  file: File | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (f: File | null) => void;
  required?: boolean;
  error?: boolean;
}

const UploadField: React.FC<UploadFieldProps> = ({
  label,
  file,
  inputRef,
  onFileChange,
  required = true,
  error,
}) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.uploadFieldRoot}>
      <input
        type='file'
        ref={inputRef}
        style={{ display: 'none' }}
        accept='image/*,.pdf'
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />
      <Button
        variant='outlined'
        size='small'
        startIcon={<UploadFileIcon />}
        onClick={() => inputRef.current?.click()}
        className={classes.uploadFieldButton}
        sx={{
          ...(error && {
            borderColor: 'error.main',
            color: 'error.main',
            '&:hover': { borderColor: 'error.dark' },
          }),
          ...(file &&
            !error && {
              borderColor: 'success.main',
              color: 'success.main',
              '&:hover': { borderColor: 'success.dark' },
            }),
        }}
      >
        {label}
        {required && !file && (
          <span style={{ color: '#d32f2f', marginLeft: 3, fontWeight: 700 }}>*</span>
        )}
      </Button>
      {file ? (
        <Chip
          label={file.name}
          size='small'
          color='success'
          variant='outlined'
          onDelete={() => {
            onFileChange(null);
            if (inputRef.current) inputRef.current.value = '';
          }}
          sx={{ maxWidth: { xs: '100%', sm: 220 }, fontSize: '0.68rem' }}
        />
      ) : null}
    </Box>
  );
};

export default UploadField;
