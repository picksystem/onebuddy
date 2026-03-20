import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import PersonIcon from '@mui/icons-material/Person';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useFieldError } from '@bandi/hooks';
import TextField from '../../../../components/TextField/TextField';

const DuplicateError = ({ message }: { message: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: 'error.main' }}>
    <ErrorOutlineIcon sx={{ fontSize: '0.9rem' }} />
    <Typography sx={{ fontSize: '0.75rem' }}>{message}</Typography>
  </Box>
);

export const CITY_OPTIONS = [
  'Ahmedabad',
  'Bengaluru',
  'Bhopal',
  'Chennai',
  'Coimbatore',
  'Delhi',
  'Hyderabad',
  'Indore',
  'Jaipur',
  'Kolkata',
  'Lucknow',
  'Mumbai',
  'Nagpur',
  'Patna',
  'Pune',
  'Surat',
  'Thane',
  'Vadodara',
  'Visakhapatnam',
  'Other',
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Non-binary / Other' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

interface PersonalStepProps {
  values: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    city: string;
  };
  touched: Partial<Record<string, boolean>>;
  errors: Partial<Record<string, string>>;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onSelectChange: (field: string) => (e: SelectChangeEvent<string>) => void;
  onDateChange: (field: string, value: string) => void;
  onBlur: React.FocusEventHandler;
  classes: Record<string, string>;
  emailExists?: boolean;
  phoneExists?: boolean;
  onEmailChange?: (email: string) => void;
  onPhoneChange?: (phone: string) => void;
}

const PersonalStep = ({
  values,
  touched,
  errors,
  onChange,
  onSelectChange,
  onDateChange,
  onBlur,
  classes,
  emailExists,
  phoneExists,
  onEmailChange,
  onPhoneChange,
}: PersonalStepProps) => {
  const reqError = useFieldError();

  return (
    <Box className={classes.sectionCard}>
      <Box className={classes.sectionHeader}>
        <Box className={classes.sectionIcon}>
          <PersonIcon sx={{ fontSize: 16 }} />
        </Box>
        <Typography fontWeight={600} fontSize='0.95rem'>
          Personal Information
        </Typography>
      </Box>
      <Box className={classes.stepContent}>
        <Grid container spacing={2}>
          {/* Name row */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              id='firstName'
              name='firstName'
              label='First Name'
              type='text'
              placeholder='First name'
              value={values.firstName}
              onChange={onChange}
              onBlur={onBlur}
              error={touched.firstName && Boolean(errors.firstName)}
              errorText={reqError(touched.firstName, errors.firstName)}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              id='lastName'
              name='lastName'
              label='Last Name'
              type='text'
              placeholder='Last name'
              value={values.lastName}
              onChange={onChange}
              onBlur={onBlur}
              error={touched.lastName && Boolean(errors.lastName)}
              errorText={reqError(touched.lastName, errors.lastName)}
              fullWidth
              required
            />
          </Grid>

          {/* Contact row */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              id='email'
              name='email'
              label='Email'
              type='email'
              placeholder='you@example.com'
              value={values.email}
              onChange={(e) => {
                onChange(e);
                onEmailChange?.(e.target.value);
              }}
              onBlur={onBlur}
              error={(touched.email && Boolean(errors.email)) || emailExists}
              errorText={
                emailExists ? (
                  <DuplicateError message='This email is already registered' />
                ) : (
                  reqError(touched.email, errors.email)
                )
              }
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              id='phone'
              name='phone'
              label='Phone Number'
              type='tel'
              placeholder='+91 98765 43210'
              value={values.phone ?? ''}
              onChange={(e) => {
                onChange(e);
                onPhoneChange?.(e.target.value);
              }}
              onBlur={onBlur}
              error={(touched.phone && Boolean(errors.phone)) || phoneExists}
              errorText={
                phoneExists ? (
                  <DuplicateError message='This phone number is already registered' />
                ) : (
                  reqError(touched.phone, errors.phone)
                )
              }
              inputProps={{ inputMode: 'numeric' }}
              fullWidth
              required
            />
          </Grid>

          {/* DOB + Gender row */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Date of Birth'
                value={values.dateOfBirth ? dayjs(values.dateOfBirth) : null}
                onChange={(newValue) =>
                  onDateChange('dateOfBirth', newValue ? newValue.format('YYYY-MM-DD') : '')
                }
                maxDate={dayjs().subtract(18, 'year')}
                sx={{ width: '100%' }}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    required: true,
                    onBlur,
                    error: touched.dateOfBirth && Boolean(errors.dateOfBirth),
                    helperText: reqError(touched.dateOfBirth, errors.dateOfBirth),
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        paddingRight: '8px',
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: '8.5px 14px',
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required error={touched.gender && Boolean(errors.gender)}>
              <InputLabel id='gender-label' required>
                Gender
              </InputLabel>
              <Select
                labelId='gender-label'
                id='gender'
                name='gender'
                value={values.gender}
                label='Gender'
                onChange={onSelectChange('gender')}
                onBlur={onBlur}
              >
                {GENDER_OPTIONS.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              {touched.gender && errors.gender && (
                <FormHelperText>{reqError(touched.gender, errors.gender)}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* City */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required error={touched.city && Boolean(errors.city)}>
              <InputLabel id='city-label' required>
                City / Zone of Operation
              </InputLabel>
              <Select
                labelId='city-label'
                id='city'
                name='city'
                value={values.city}
                label='City / Zone of Operation'
                onChange={onSelectChange('city')}
                onBlur={onBlur}
              >
                {CITY_OPTIONS.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
              {touched.city && errors.city && <FormHelperText>{errors.city}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PersonalStep;
