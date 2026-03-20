import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Chip,
  Divider,
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  FormHelperText,
  Stack,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import ScheduleIcon from '@mui/icons-material/Schedule';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FormikProps } from 'formik';
import { useStyles } from './styles';
import { useNotification } from '@bandi/hooks';
import {
  getDraftDaysRemaining,
  clearNewUserDraft,
  DRAFT_DAYS,
} from '../../utils/accessManagement.utils';
import { InitialCreateValues } from '../../types/accessManagement.types';

const CITY_OPTIONS = [
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

const DEPARTMENT_OPTIONS = [
  'Operations',
  'Fleet Management',
  'Finance & Accounts',
  'Technology & Engineering',
  'Sales & Business Development',
  'Customer Support',
  'Driver / Captain Onboarding',
  'Compliance & Legal',
  'Human Resources',
  'Marketing',
  'Other',
];

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  isOpenedAsDraft: boolean;
  draftMeta: { savedAt: string; expiresAt: string } | null;
  setDraftMeta: (v: null) => void;
  setDraftValues: (v: null) => void;
  setIsOpenedAsDraft: (v: boolean) => void;
  createFormik: FormikProps<InitialCreateValues>;
  reqError: (
    touched: unknown,
    error: string | undefined,
  ) => string | React.ReactElement | undefined;
  genPassword: string;
  showGenPw: boolean;
  setShowGenPw: (v: boolean | ((prev: boolean) => boolean)) => void;
  onRegeneratePw: () => void;
  onApplyGenPw: () => void;
  onSaveDraft: () => void;
  adminNotes: string;
  setAdminNotes: (v: string) => void;
}

const CreateUserDialog = ({
  open,
  onClose,
  isOpenedAsDraft,
  draftMeta,
  setDraftMeta,
  setDraftValues,
  setIsOpenedAsDraft,
  createFormik,
  reqError,
  genPassword,
  showGenPw,
  setShowGenPw,
  onRegeneratePw,
  onApplyGenPw,
  onSaveDraft,
  adminNotes,
  setAdminNotes,
}: CreateUserDialogProps) => {
  const { classes } = useStyles();
  const notify = useNotification();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      slotProps={{ paper: { className: classes.dialogPaper } }}
    >
      {/* Header */}
      <Box className={classes.header}>
        <Box className={classes.badgeRow}>
          <AddIcon className={classes.badgeIcon} />
          <Typography variant='caption' fontWeight={700} className={classes.badgeLabel}>
            New User
          </Typography>
          {draftMeta && isOpenedAsDraft && (
            <Chip
              label='Draft Restored'
              size='small'
              icon={<ScheduleIcon />}
              className={classes.draftChip}
              sx={{ ml: 0.5 }}
            />
          )}
        </Box>

        <Box className={classes.userCard}>
          <Avatar className={classes.headerAvatar}>
            <PersonIcon sx={{ fontSize: 30 }} />
          </Avatar>
          <Box>
            <Typography variant='h6' fontWeight={700} className={classes.headerTitle}>
              Create New User
            </Typography>
            <Typography variant='body2' className={classes.headerSubtitle}>
              Admin-created users are activated immediately. A welcome email with temporary
              credentials will be sent automatically.
            </Typography>
          </Box>
        </Box>

        <IconButton size='small' onClick={onClose} className={classes.closeBtn}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </Box>

      <DialogContent dividers>
        {/* Draft alert */}
        {draftMeta && isOpenedAsDraft && (
          <Alert
            severity='warning'
            icon={<ScheduleIcon />}
            sx={{ mb: 2 }}
            action={
              <Button
                size='small'
                color='inherit'
                onClick={() => {
                  clearNewUserDraft();
                  setDraftMeta(null);
                  setDraftValues(null);
                  setIsOpenedAsDraft(false);
                  createFormik.resetForm();
                }}
              >
                Clear Draft
              </Button>
            }
          >
            Draft restored — saved on{' '}
            <strong>{new Date(draftMeta.savedAt).toLocaleDateString()}</strong>. Expires in{' '}
            <strong>{getDraftDaysRemaining(draftMeta.expiresAt)} days</strong> and will be deleted
            automatically after {DRAFT_DAYS} days.
          </Alert>
        )}

        <form id='new-user-form' onSubmit={createFormik.handleSubmit} noValidate>
          {/* ── Personal Information ── */}
          <Typography variant='subtitle1' fontWeight={600} color='primary' sx={{ mb: 1.5 }}>
            Personal Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id='firstName'
                name='firstName'
                label='First Name'
                required
                fullWidth
                size='small'
                value={createFormik.values.firstName}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
                error={createFormik.touched.firstName && Boolean(createFormik.errors.firstName)}
                helperText={reqError(
                  createFormik.touched.firstName,
                  createFormik.errors.firstName as string,
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id='lastName'
                name='lastName'
                label='Last Name'
                required
                fullWidth
                size='small'
                value={createFormik.values.lastName}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
                error={createFormik.touched.lastName && Boolean(createFormik.errors.lastName)}
                helperText={reqError(
                  createFormik.touched.lastName,
                  createFormik.errors.lastName as string,
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id='email'
                name='email'
                label='Email'
                required
                type='email'
                fullWidth
                size='small'
                placeholder='you@example.com'
                value={createFormik.values.email}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
                error={createFormik.touched.email && Boolean(createFormik.errors.email)}
                helperText={reqError(
                  createFormik.touched.email,
                  createFormik.errors.email as string,
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id='phone'
                name='phone'
                label='Phone Number'
                required
                type='tel'
                fullWidth
                size='small'
                placeholder='+91 98765 43210'
                value={createFormik.values.phone}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
                error={createFormik.touched.phone && Boolean(createFormik.errors.phone)}
                helperText={reqError(
                  createFormik.touched.phone,
                  createFormik.errors.phone as string,
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Date of Birth'
                  value={
                    createFormik.values.dateOfBirth ? dayjs(createFormik.values.dateOfBirth) : null
                  }
                  onChange={(newValue) =>
                    createFormik.setFieldValue(
                      'dateOfBirth',
                      newValue ? newValue.format('YYYY-MM-DD') : '',
                    )
                  }
                  maxDate={dayjs().subtract(18, 'year')}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      required: true,
                      onBlur: createFormik.handleBlur,
                      error:
                        createFormik.touched.dateOfBirth &&
                        Boolean(createFormik.errors.dateOfBirth),
                      helperText: reqError(
                        createFormik.touched.dateOfBirth,
                        createFormik.errors.dateOfBirth as string,
                      ),
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl
                fullWidth
                size='small'
                required
                error={createFormik.touched.gender && Boolean(createFormik.errors.gender)}
              >
                <InputLabel id='gender-label' required>
                  Gender
                </InputLabel>
                <Select
                  labelId='gender-label'
                  id='gender'
                  name='gender'
                  value={createFormik.values.gender}
                  label='Gender'
                  onChange={createFormik.handleChange}
                  onBlur={createFormik.handleBlur}
                >
                  {GENDER_OPTIONS.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
                {createFormik.touched.gender && createFormik.errors.gender && (
                  <FormHelperText>
                    {reqError(createFormik.touched.gender, createFormik.errors.gender as string)}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                size='small'
                required
                error={createFormik.touched.city && Boolean(createFormik.errors.city)}
              >
                <InputLabel id='city-label' required>
                  City / Zone of Operation
                </InputLabel>
                <Select
                  labelId='city-label'
                  id='city'
                  name='city'
                  value={createFormik.values.city}
                  label='City / Zone of Operation'
                  onChange={createFormik.handleChange}
                  onBlur={createFormik.handleBlur}
                >
                  {CITY_OPTIONS.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
                {createFormik.touched.city && createFormik.errors.city && (
                  <FormHelperText>
                    {reqError(createFormik.touched.city, createFormik.errors.city as string)}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {/* ── Work Details ── */}
          <Typography variant='subtitle1' fontWeight={600} color='primary' sx={{ mb: 1.5 }}>
            Work Details
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id='employeeId'
                name='employeeId'
                label='Employee ID (Optional)'
                fullWidth
                size='small'
                placeholder='e.g. 12345'
                value={createFormik.values.employeeId}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size='small'>
                <InputLabel id='department-label'>Department (Optional)</InputLabel>
                <Select
                  labelId='department-label'
                  id='department'
                  name='department'
                  value={createFormik.values.department}
                  label='Department (Optional)'
                  onChange={createFormik.handleChange}
                  onBlur={createFormik.handleBlur}
                >
                  {DEPARTMENT_OPTIONS.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                id='managerEmail'
                name='managerEmail'
                label='Reporting Manager Email (Optional)'
                type='email'
                fullWidth
                size='small'
                placeholder='manager@company.com'
                value={createFormik.values.managerEmail}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
                error={
                  createFormik.touched.managerEmail && Boolean(createFormik.errors.managerEmail)
                }
                helperText={
                  (createFormik.touched.managerEmail &&
                    (createFormik.errors.managerEmail as string)) ||
                  'Helps route the approval request to the right person.'
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                id='reasonForAccess'
                name='reasonForAccess'
                label='Reason for Access'
                required
                fullWidth
                size='small'
                multiline
                minRows={3}
                placeholder='Briefly describe why this user needs access...'
                value={createFormik.values.reasonForAccess}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
                error={
                  createFormik.touched.reasonForAccess &&
                  Boolean(createFormik.errors.reasonForAccess)
                }
                helperText={reqError(
                  createFormik.touched.reasonForAccess,
                  createFormik.errors.reasonForAccess as string,
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {/* ── Account Security ── */}
          <Typography variant='subtitle1' fontWeight={600} color='primary' sx={{ mb: 1.5 }}>
            Account Security
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id='password'
                name='password'
                label='Enter Password'
                required
                type='password'
                fullWidth
                size='small'
                placeholder='Min. 8 chars, 1 uppercase, 1 number'
                value={createFormik.values.password}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
                error={createFormik.touched.password && Boolean(createFormik.errors.password)}
                helperText={reqError(
                  createFormik.touched.password,
                  createFormik.errors.password as string,
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id='confirmPassword'
                name='confirmPassword'
                label='Re-enter Password'
                required
                type='password'
                fullWidth
                size='small'
                placeholder='Re-enter your password'
                value={createFormik.values.confirmPassword}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
                error={
                  createFormik.touched.confirmPassword &&
                  Boolean(createFormik.errors.confirmPassword)
                }
                helperText={reqError(
                  createFormik.touched.confirmPassword,
                  createFormik.errors.confirmPassword as string,
                )}
              />
            </Grid>
          </Grid>

          {/* ── Temporary Password ── */}
          <Typography variant='body2' fontWeight={600} color='text.secondary' sx={{ mb: 0.5 }}>
            Temporary Password
          </Typography>
          <Typography variant='caption' color='text.secondary' display='block' sx={{ mb: 1 }}>
            Auto-generated — click Apply to use it in the fields above, or copy it to share with the
            user.
          </Typography>
          <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size='small'
              type={showGenPw ? 'text' : 'password'}
              value={genPassword}
              className={classes.monoInput}
              slotProps={{
                input: {
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton size='small' onClick={() => setShowGenPw((v) => !v)} edge='end'>
                        {showGenPw ? (
                          <VisibilityOffIcon fontSize='small' />
                        ) : (
                          <VisibilityIcon fontSize='small' />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <IconButton
              size='small'
              onClick={() => {
                navigator.clipboard.writeText(genPassword);
                notify.success('Temporary password copied');
              }}
            >
              <ContentCopyIcon fontSize='small' />
            </IconButton>
            <IconButton size='small' color='primary' onClick={onRegeneratePw}>
              <AutorenewIcon fontSize='small' />
            </IconButton>
            <Button
              size='small'
              variant='outlined'
              onClick={onApplyGenPw}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Apply
            </Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* ── Role Selection ── */}
          <Typography variant='subtitle1' fontWeight={600} color='primary' sx={{ mb: 1.5 }}>
            Role Selection
          </Typography>
          <FormControl
            fullWidth
            size='small'
            required
            error={createFormik.touched.role && Boolean(createFormik.errors.role)}
            sx={{ mb: 1 }}
          >
            <InputLabel id='create-role-label' required>
              Role
            </InputLabel>
            <Select
              labelId='create-role-label'
              id='role'
              name='role'
              value={createFormik.values.role}
              label='Role'
              onChange={createFormik.handleChange}
              onBlur={createFormik.handleBlur}
            >
              <MenuItem value='admin'>
                Admin — Manage platform settings, users &amp; reports
              </MenuItem>
              <MenuItem value='consultant'>
                Consultant — Read-only access to reports &amp; analytics
              </MenuItem>
            </Select>
            {createFormik.touched.role && createFormik.errors.role && (
              <FormHelperText>
                {reqError(createFormik.touched.role, createFormik.errors.role as string)}
              </FormHelperText>
            )}
          </FormControl>

          <Alert severity='success' sx={{ mt: 1, mb: 2 }}>
            Admin-created users are <strong>activated immediately</strong>. A welcome email with
            temporary credentials will be sent. The user must reset their password on first login.
          </Alert>

          {/* ── Admin Notes ── */}
          <Typography variant='subtitle1' fontWeight={600} color='primary' sx={{ mb: 1.5 }}>
            Admin Notes
          </Typography>
          <TextField
            multiline
            rows={3}
            fullWidth
            size='small'
            placeholder='Add notes about this user or reason for creation (optional)'
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />
        </form>
      </DialogContent>

      <DialogActions className={classes.actions}>
        <Button onClick={onClose} variant='outlined' sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button variant='outlined' color='secondary' onClick={onSaveDraft} sx={{ borderRadius: 2 }}>
          Draft
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={() => createFormik.handleSubmit()}
          disabled={createFormik.isSubmitting}
          sx={{ borderRadius: 2, px: 3 }}
        >
          {createFormik.isSubmitting ? 'Submitting…' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserDialog;
