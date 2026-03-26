import React from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
} from '@mui/material';

export interface InlineSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ id: string; label: string }>;
  error?: boolean;
  helperText?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}

const InlineSelect: React.FC<InlineSelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  helperText,
  disabled,
  required,
  onBlur,
}) => (
  <FormControl size='small' fullWidth error={error} disabled={disabled} required={required}>
    <InputLabel>{label}</InputLabel>
    <MuiSelect
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as string)}
      onBlur={onBlur}
    >
      {options.map((o) => (
        <MenuItem key={o.id} value={o.id}>
          {o.label}
        </MenuItem>
      ))}
    </MuiSelect>
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
);

export default InlineSelect;
