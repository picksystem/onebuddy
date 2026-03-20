import { useState } from 'react';
import {
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button } from '@bandi/component';
import { useNavigate } from 'react-router-dom';
import { constants } from '@bandi/utils';

const CreateCustomer = () => {
  const navigate = useNavigate();
  const { AdminPath } = constants;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    // TODO: wire up to API
  };

  const handleCancel = () => navigate(AdminPath.DASHBOARD);

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      background: 'rgba(255,255,255,0.04)',
      '& fieldset': { borderColor: 'rgba(99,102,241,0.2)' },
      '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.5)' },
      '&.Mui-focused fieldset': { borderColor: '#6366f1' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.45)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#a5b4fc' },
    '& .MuiInputBase-input': { color: '#e2e8f0' },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.35)' },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d1b3e 0%, #0f2355 45%, #1a3a6b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 520,
          background: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '20px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          p: 4,
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
            }}
          >
            <PersonAddIcon sx={{ color: '#fff', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography sx={{ color: '#e2e8f0', fontWeight: 700, fontSize: '1.2rem' }}>
              Create Customer
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
              Add a new customer account
            </Typography>
          </Box>
        </Box>

        {/* Form */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label='First Name'
              value={form.firstName}
              onChange={handleChange('firstName')}
              fullWidth
              size='small'
              InputProps={{ startAdornment: <InputAdornment position='start'><BadgeOutlinedIcon fontSize='small' /></InputAdornment> }}
              sx={fieldSx}
            />
            <TextField
              label='Last Name'
              value={form.lastName}
              onChange={handleChange('lastName')}
              fullWidth
              size='small'
              sx={fieldSx}
            />
          </Box>

          <TextField
            label='Email Address'
            type='email'
            value={form.email}
            onChange={handleChange('email')}
            fullWidth
            size='small'
            InputProps={{ startAdornment: <InputAdornment position='start'><EmailOutlinedIcon fontSize='small' /></InputAdornment> }}
            sx={fieldSx}
          />

          <TextField
            label='Phone Number'
            value={form.phone}
            onChange={handleChange('phone')}
            fullWidth
            size='small'
            InputProps={{ startAdornment: <InputAdornment position='start'><PhoneOutlinedIcon fontSize='small' /></InputAdornment> }}
            sx={fieldSx}
          />

          <TextField
            label='Password'
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange('password')}
            fullWidth
            size='small'
            InputProps={{
              startAdornment: <InputAdornment position='start'><LockOutlinedIcon fontSize='small' /></InputAdornment>,
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton size='small' onClick={() => setShowPassword((p) => !p)} sx={{ color: 'rgba(255,255,255,0.35)' }}>
                    {showPassword ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={fieldSx}
          />

          <TextField
            label='Confirm Password'
            type={showConfirm ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            fullWidth
            size='small'
            InputProps={{
              startAdornment: <InputAdornment position='start'><LockOutlinedIcon fontSize='small' /></InputAdornment>,
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton size='small' onClick={() => setShowConfirm((p) => !p)} sx={{ color: 'rgba(255,255,255,0.35)' }}>
                    {showConfirm ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={fieldSx}
          />
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button
            variant='outlined'
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            sx={{
              flex: 1,
              borderColor: 'rgba(99,102,241,0.3)',
              color: '#a5b4fc',
              borderRadius: '10px',
              '&:hover': { borderColor: '#6366f1', background: 'rgba(99,102,241,0.1)' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={!form.firstName || !form.email || !form.password || !form.confirmPassword}
            sx={{
              flex: 2,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              borderRadius: '10px',
              fontWeight: 700,
              boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
              '&:hover': { filter: 'brightness(1.1)' },
              '&:disabled': { opacity: 0.5 },
            }}
          >
            Create Customer
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateCustomer;
