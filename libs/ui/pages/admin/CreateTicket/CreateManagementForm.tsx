import { useState, useEffect, ElementType, ReactNode, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Avatar,
  LinearProgress,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  Alert,
  IconButton,
  InputAdornment,
  Autocomplete,
  TextField as MuiTextField,
  Snackbar,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ShieldIcon from '@mui/icons-material/Shield';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Box, Button, TextField, Select } from '@bandi/component';
import { constants } from '@bandi/utils';
import { useFieldError, useAuth, useLocalStorage } from '@bandi/hooks';
import { useAuthActionMutation, useUploadUserAttachmentsMutation } from '@bandi/services';
import { useStyles } from './styles';

// ─── Types ────────────────────────────────────────────────────────────────────

type ManagementType = 'admin' | 'consultant';

interface TypeConfig {
  label: string;
  role: string;
  gradient: string;
  shadow: string;
  color: string;
  icon: ElementType;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<ManagementType, TypeConfig> = {
  admin: {
    label: 'Admin',
    role: 'System Administrator',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%)',
    shadow: '0 8px 32px rgba(99,102,241,0.35)',
    color: '#6366f1',
    icon: ManageAccountsIcon,
  },
  consultant: {
    label: 'Consultant',
    role: 'Business Consultant',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 50%, #0ea5e9 100%)',
    shadow: '0 8px 32px rgba(14,165,233,0.35)',
    color: '#0ea5e9',
    icon: BusinessCenterIcon,
  },
};

const SECTION_META = [
  {
    icon: PersonOutlineIcon,
    label: 'Personal Information',
    color: '#1976d2',
    gradient: 'linear-gradient(135deg,#1565c0,#1976d2)',
    glow: 'rgba(25,118,210,0.22)',
  },
  {
    icon: WorkOutlineIcon,
    label: 'Work Details',
    color: '#7b1fa2',
    gradient: 'linear-gradient(135deg,#6a1b9a,#8e24aa)',
    glow: 'rgba(123,31,162,0.22)',
  },
  {
    icon: ShieldIcon,
    label: 'Account Security',
    color: '#0e7490',
    gradient: 'linear-gradient(135deg,#0e7490,#06b6d4)',
    glow: 'rgba(14,116,144,0.22)',
  },
  {
    icon: NoteAltIcon,
    label: 'Admin Notes',
    color: '#546e7a',
    gradient: 'linear-gradient(135deg,#37474f,#546e7a)',
    glow: 'rgba(84,110,122,0.22)',
  },
  {
    icon: FolderOpenIcon,
    label: 'Attachments',
    color: '#2e7d32',
    gradient: 'linear-gradient(135deg,#1b5e20,#2e7d32)',
    glow: 'rgba(46,125,50,0.22)',
  },
];

// ─── Options ──────────────────────────────────────────────────────────────────

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

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
].map((c) => ({ value: c, label: c }));

const DEPARTMENT_OPTIONS = [
  'Operations',
  'Fleet Management',
  'Finance & Accounts',
  'Technology & Engineering',
  'Sales & Business Development',
  'Customer Support',
  'Driver-Captain Onboarding',
  'Compliance & Legal',
  'Human Resources',
  'Marketing',
  'Other',
].map((d) => ({ value: d, label: d }));

// ─── Password strength ────────────────────────────────────────────────────────

function getPwdStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
  return { score, label: pw ? labels[score] : '', color: pw ? colors[score] : '' };
}

// ─── Password generator ───────────────────────────────────────────────────────

function generatePassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const special = '@#$%&*!';
  const all = upper + lower + digits + special;
  const rand = (s: string) => s[Math.floor(Math.random() * s.length)];
  const base = [rand(upper), rand(lower), rand(digits), rand(special)];
  for (let i = 0; i < 8; i++) base.push(rand(all));
  return base.sort(() => Math.random() - 0.5).join('');
}

// ─── DuplicateError helper ────────────────────────────────────────────────────

const DuplicateError = ({ message }: { message: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: 'error.main' }}>
    <ErrorOutlineIcon sx={{ fontSize: '0.9rem' }} />
    <Typography sx={{ fontSize: '0.75rem' }}>{message}</Typography>
  </Box>
);

// ─── wrapSection helper ───────────────────────────────────────────────────────

function wrapSection(
  classes: Record<string, string>,
  index: number,
  children: ReactNode,
  collapsible = false,
) {
  const m = SECTION_META[index];
  const Icon = m.icon;

  const iconBadge = (
    <Box
      className={classes.sectionIconBadge}
      sx={{ background: m.gradient, boxShadow: `0 4px 14px ${m.glow}` }}
    >
      <Icon sx={{ fontSize: 16, color: '#fff' }} />
    </Box>
  );

  const title = (
    <Typography className={classes.sectionCardTitle} sx={{ color: m.color }}>
      {m.label}
    </Typography>
  );

  if (collapsible) {
    return (
      <MuiAccordion
        defaultExpanded={false}
        disableGutters
        sx={{
          borderLeft: `4px solid ${m.color}`,
          borderRadius: '14px !important',
          mb: 2,
          overflow: 'hidden',
          backgroundColor: 'background.paper',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          '&::before': { display: 'none' },
        }}
      >
        <MuiAccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: m.color, fontSize: 20 }} />}
          sx={{
            background: `${m.color}12`,
            borderBottom: '1px solid',
            borderColor: 'divider',
            minHeight: 0,
            px: 2.5,
            py: 0,
            '&.Mui-expanded': { minHeight: 0 },
            '& .MuiAccordionSummary-content': {
              margin: '12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            },
          }}
        >
          {iconBadge}
          {title}
        </MuiAccordionSummary>
        <MuiAccordionDetails sx={{ p: 0 }}>
          <Box className={classes.sectionCardBody}>{children}</Box>
        </MuiAccordionDetails>
      </MuiAccordion>
    );
  }

  return (
    <Box className={classes.sectionCard} sx={{ borderLeftColor: m.color }}>
      <Box className={classes.sectionCardHeader} sx={{ background: `${m.color}12` }}>
        {iconBadge}
        {title}
      </Box>
      <Box className={classes.sectionCardBody}>{children}</Box>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const CreateManagementForm = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { AdminPath } = constants;
  const { classes } = useStyles();
  const { user } = useAuth();

  const managementType: ManagementType = type === 'admin' || type === 'consultant' ? type : 'admin';
  const config = TYPE_CONFIG[managementType];
  const HeroIcon = config.icon;
  const reqError = useFieldError();

  const STORAGE_KEY = `mgmt_draft_${managementType}`;
  const [form, setForm, clearForm] = useLocalStorage<Record<string, string>>(STORAGE_KEY, {});
  const [userId] = useState(() => {
    const num = Math.floor(Math.random() * 90000) + 10000;
    return managementType === 'admin' ? `ADMIN${num}` : `CONSULT${num}`;
  });
  const [submitted, setSubmitted] = useState(false);
  const [genPassword, setGenPassword] = useState(() => generatePassword());
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [copied, setCopied] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [referredBy, setReferredBy] = useState<{ name: string; email: string } | null>(null);
  const [referralInput, setReferralInput] = useState('');
  const [reportingManager, setReportingManager] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [reportingManagerInput, setReportingManagerInput] = useState('');
  const [employeeList, setEmployeeList] = useState<{ name: string; email: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const emailDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [authAction] = useAuthActionMutation();
  const [uploadAttachments] = useUploadUserAttachmentsMutation();

  // Load employees + server-side draft on mount
  useEffect(() => {
    authAction({ action: 'get-all-users' })
      .unwrap()
      .then((res) => {
        const users = (res.data ?? []).map((u: any) => ({
          name: u.name || `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
          email: u.email,
        }));
        setEmployeeList(users);
      })
      .catch(() => {});
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const set = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [name]: e.target.value }));

  const sel = (name: string) => (e: { target: { value: unknown } }) =>
    setForm((p) => ({ ...p, [name]: e.target.value as string }));

  const checkEmailExists = (email: string) => {
    if (emailDebounce.current) clearTimeout(emailDebounce.current);
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailExists(false);
      return;
    }
    emailDebounce.current = setTimeout(async () => {
      try {
        const res = await authAction({ action: 'check-availability', email }).unwrap();
        setEmailExists(res.data?.emailExists ?? false);
      } catch {
        setEmailExists(false);
      }
    }, 600);
  };

  const checkPhoneExists = (phone: string) => {
    if (phoneDebounce.current) clearTimeout(phoneDebounce.current);
    if (!phone || phone.length < 7) {
      setPhoneExists(false);
      return;
    }
    phoneDebounce.current = setTimeout(async () => {
      try {
        const res = await authAction({ action: 'check-availability', phone }).unwrap();
        setPhoneExists(res.data?.phoneExists ?? false);
      } catch {
        setPhoneExists(false);
      }
    }, 600);
  };

  const handleRefreshGenPassword = useCallback(() => {
    setGenPassword(generatePassword());
    setCopied(false);
  }, []);

  const handleCopyGenPassword = useCallback(() => {
    navigator.clipboard.writeText(genPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [genPassword]);

  const handleApplyGenPassword = useCallback(() => {
    setForm((p) => ({ ...p, password: genPassword, confirmPassword: genPassword }));
  }, [genPassword]);

  // ── Completion logic ───────────────────────────────────────────────────────
  const requiredKeys = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'dateOfBirth',
    'gender',
    'city',
    'reasonForAccess',
    'password',
    'confirmPassword',
  ];
  const filledCount = requiredKeys.filter((k) => !!form[k]).length;
  const completionPct = Math.round((filledCount / requiredKeys.length) * 100);
  const isAllDone = filledCount === requiredKeys.length;

  // ── Password logic ─────────────────────────────────────────────────────────
  const pwdStrength = getPwdStrength(form.password ?? '');
  const pwdMismatch = !!form.confirmPassword && form.confirmPassword !== form.password;
  const pwdMatch = !!form.confirmPassword && form.confirmPassword === form.password;

  const canSubmit = isAllDone && !pwdMismatch && !emailExists && !phoneExists;

  // ── Reset all fields ───────────────────────────────────────────────────────
  const resetAllFields = () => {
    clearForm();
    setSubmitted(false);
    setReferredBy(null);
    setReferralInput('');
    setReportingManager(null);
    setReportingManagerInput('');
    setGenPassword(generatePassword());
    setShowPwd(false);
    setShowConfirmPwd(false);
    setCopied(false);
    setAttachments([]);
  };

  // Clear localStorage on unmount so returning to the form always starts fresh
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
    };
  }, [STORAGE_KEY]);

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitted(true);
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const createdUser = await authAction({
        action: 'create-management-request',
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: type ?? 'user',
        phone: form.phone || undefined,
        businessUnit: form.department || undefined,
        employeeId: form.employeeId || undefined,
        reasonForAccess: form.reasonForAccess || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        city: form.city || undefined,
        adminNotes: form.adminNotes || undefined,
        userId,
        reportingManagerEmail: reportingManager?.email || undefined,
        referredByEmail: referredBy?.email || undefined,
      }).unwrap() as any;

      // Upload attachments if any were added
      const newUserId = createdUser?.data?.id ?? createdUser?.data?.userId;
      if (attachments.length > 0 && newUserId) {
        await uploadAttachments({ userId: newUserId, files: attachments }).unwrap().catch(() => {});
      }

      // Clear all fields + server draft on success
      resetAllFields();
      await authAction({ action: 'delete-draft', type: managementType })
        .unwrap()
        .catch(() => {});

      setSnackbar({
        open: true,
        message: 'Request submitted! It is now pending approval.',
        severity: 'success',
      });
      setTimeout(() => navigate(AdminPath.CREATE_MANAGEMENT), 1800);
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to create account. Please try again.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Draft handler ──────────────────────────────────────────────────────────
  const handleDraft = async () => {
    setIsDrafting(true);
    try {
      await authAction({
        action: 'save-draft',
        type: managementType,
        formData: { form: { ...form, userId }, referredBy, reportingManager },
      }).unwrap();
      resetAllFields();
      setSnackbar({
        open: true,
        message: 'Draft saved! You have 7 days to submit before it expires.',
        severity: 'success',
      });
      setTimeout(() => navigate(AdminPath.CREATE_MANAGEMENT), 1800);
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to save draft. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsDrafting(false);
    }
  };

  // ── Avatar initials ────────────────────────────────────────────────────────
  const avatarInitials =
    [form.firstName, form.lastName]
      .filter(Boolean)
      .map((s) => s[0].toUpperCase())
      .join('') || (managementType === 'admin' ? 'A' : 'C');

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Box
        className={classes.managementHero}
        sx={{ background: config.gradient, boxShadow: config.shadow, mb: 2.5 }}
      >
        {/* Icon badge */}
        <Box className={classes.managementHeroIcon}>
          <HeroIcon sx={{ fontSize: 30, color: '#fff' }} />
        </Box>

        {/* Text */}
        <Box className={classes.managementHeroText}>
          <Typography className={classes.managementHeroTitle}>
            Create {config.label} Account
          </Typography>
          <Typography className={classes.managementHeroSub}>
            Complete all sections below to provision a new {config.label.toLowerCase()} with
            platform access
          </Typography>
        </Box>

        {/* Live avatar */}
        <Avatar
          sx={{
            width: 72,
            height: 72,
            background: 'rgba(255,255,255,0.2)',
            border: '3px solid rgba(255,255,255,0.4)',
            fontSize: '1.6rem',
            fontWeight: 800,
            flexShrink: 0,
            letterSpacing: '-1px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          {avatarInitials}
        </Avatar>
      </Box>

      {/* ── Created By ────────────────────────────────────────────────────── */}
      <Box className={classes.sectionCard} sx={{ borderLeftColor: '#78909c' }}>
        <Box className={classes.sectionCardHeader} sx={{ background: '#78909c12' }}>
          <Box
            className={classes.sectionIconBadge}
            sx={{
              background: 'linear-gradient(135deg,#546e7a,#78909c)',
              boxShadow: '0 4px 14px rgba(120,144,156,0.22)',
            }}
          >
            <BadgeOutlinedIcon sx={{ fontSize: 16, color: '#fff' }} />
          </Box>
          <Typography className={classes.sectionCardTitle} sx={{ color: '#546e7a' }}>
            Created By
          </Typography>
        </Box>
        <Box className={classes.sectionCardBody}>
          <Box className={classes.formGrid}>
            <TextField
              label='Full Name'
              value={
                user
                  ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.name || '—'
                  : '—'
              }
              disabled
              fullWidth
              size='small'
            />
            <TextField
              label='Email Address'
              value={user?.email ?? '—'}
              disabled
              fullWidth
              size='small'
            />
            <TextField
              label='Phone Number'
              value={user?.phone ?? '—'}
              disabled
              fullWidth
              size='small'
            />
            <Autocomplete
              options={employeeList}
              getOptionLabel={(opt) => opt.email}
              filterOptions={(opts, { inputValue }) => {
                const q = inputValue.toLowerCase();
                return opts.filter(
                  (o) => o.email.toLowerCase().includes(q) || o.name.toLowerCase().includes(q),
                );
              }}
              value={referredBy}
              onChange={(_, val) => setReferredBy(val)}
              inputValue={referralInput}
              onInputChange={(_, val) => setReferralInput(val)}
              renderInput={(params) => (
                <MuiTextField
                  {...params}
                  label='Reference (optional)'
                  placeholder='Search by name or email…'
                  size='small'
                  fullWidth
                />
              )}
              renderOption={(props, opt) => (
                <li {...props} key={opt.email}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', py: 0.25 }}>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3 }}>
                      {opt.name}
                    </Typography>
                    <Typography
                      sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.3 }}
                    >
                      {opt.email}
                    </Typography>
                  </Box>
                </li>
              )}
              clearOnEscape
              isOptionEqualToValue={(opt, val) => opt.email === val.email}
            />
          </Box>
        </Box>
      </Box>

      {/* ── Section 1: Personal Information ───────────────────────────────── */}
      {wrapSection(
        classes,
        0,
        <Box className={classes.formGrid}>
          {/* Row 1: userId (auto), firstName, lastName */}
          <TextField name='userId' label='User ID' value={userId} disabled size='small' fullWidth />
          <TextField
            name='firstName'
            label='First Name'
            placeholder='First name'
            value={form.firstName ?? ''}
            onChange={set('firstName')}
            required
            size='small'
            error={submitted && !form.firstName}
            errorText={reqError(submitted && !form.firstName, 'required')}
          />
          <TextField
            name='lastName'
            label='Last Name'
            placeholder='Last name'
            value={form.lastName ?? ''}
            onChange={set('lastName')}
            required
            size='small'
            error={submitted && !form.lastName}
            errorText={reqError(submitted && !form.lastName, 'required')}
          />
          <TextField
            name='email'
            label='Email Address'
            type='email'
            placeholder='you@company.com'
            value={form.email ?? ''}
            onChange={(e) => {
              set('email')(e);
              checkEmailExists(e.target.value);
            }}
            required
            size='small'
            error={(submitted && !form.email) || emailExists}
            errorText={
              emailExists ? (
                <DuplicateError message='This email is already registered' />
              ) : (
                reqError(submitted && !form.email, 'required')
              )
            }
          />

          {/* Row 2: phone, city, dateOfBirth */}
          <TextField
            name='phone'
            label='Phone Number'
            type='tel'
            placeholder='+91 98765 43210'
            value={form.phone ?? ''}
            onChange={(e) => {
              set('phone')(e);
              checkPhoneExists(e.target.value);
            }}
            required
            size='small'
            inputProps={{ inputMode: 'numeric' }}
            error={(submitted && !form.phone) || phoneExists}
            errorText={
              phoneExists ? (
                <DuplicateError message='This phone number is already registered' />
              ) : (
                reqError(submitted && !form.phone, 'required')
              )
            }
          />
          <Box sx={{ '& .MuiFormControl-root': { mb: 0 } }}>
            <Select
              label='City / Zone of Operation'
              options={CITY_OPTIONS}
              value={form.city ?? ''}
              onChange={sel('city')}
              required
              size='small'
              error={submitted && !form.city}
              errorText={reqError(submitted && !form.city, 'required')}
            />
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Date of Birth'
              value={form.dateOfBirth ? dayjs(form.dateOfBirth) : null}
              onChange={(newValue) =>
                setForm((p) => ({
                  ...p,
                  dateOfBirth: newValue ? newValue.format('YYYY-MM-DD') : '',
                }))
              }
              maxDate={dayjs().subtract(18, 'year')}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  required: true,
                  error: submitted && !form.dateOfBirth,
                  helperText: reqError(submitted && !form.dateOfBirth, 'required') as string,
                },
              }}
            />
          </LocalizationProvider>

          {/* Row 3: gender */}
          <Select
            label='Gender'
            options={GENDER_OPTIONS}
            value={form.gender ?? ''}
            onChange={sel('gender')}
            required
            size='small'
            error={submitted && !form.gender}
            errorText={reqError(submitted && !form.gender, 'required')}
          />
        </Box>,
      )}

      {/* ── Section 2: Work Details ────────────────────────────────────────── */}
      {wrapSection(
        classes,
        1,
        <Box className={classes.formGrid}>
          {/* Row 1: employeeId, department, managerEmail */}
          <TextField
            name='employeeId'
            label='Employee ID (Optional)'
            placeholder='e.g. 12345'
            value={form.employeeId ?? ''}
            onChange={set('employeeId')}
            size='small'
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />
          <Select
            label='Department (Optional)'
            options={DEPARTMENT_OPTIONS}
            value={form.department ?? ''}
            onChange={sel('department')}
            size='small'
          />
          <Autocomplete
            options={employeeList}
            getOptionLabel={(opt) => opt.email}
            filterOptions={(opts, { inputValue }) => {
              const q = inputValue.toLowerCase();
              return opts.filter(
                (o) => o.email.toLowerCase().includes(q) || o.name.toLowerCase().includes(q),
              );
            }}
            value={reportingManager}
            onChange={(_, val) => setReportingManager(val)}
            inputValue={reportingManagerInput}
            onInputChange={(_, val) => setReportingManagerInput(val)}
            renderInput={(params) => (
              <MuiTextField
                {...params}
                label='Reporting Manager (Optional)'
                placeholder='Search by name or email…'
                size='small'
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            )}
            renderOption={(props, opt) => (
              <li {...props} key={opt.email}>
                <Box sx={{ display: 'flex', flexDirection: 'column', py: 0.25 }}>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3 }}>
                    {opt.name}
                  </Typography>
                  <Typography
                    sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.3 }}
                  >
                    {opt.email}
                  </Typography>
                </Box>
              </li>
            )}
            clearOnEscape
            isOptionEqualToValue={(opt, val) => opt.email === val.email}
          />

          {/* Row 3: reasonForAccess (fullWidth) */}
          <Box className={classes.fullWidth}>
            <TextField
              name='reasonForAccess'
              label='Reason for Access'
              placeholder='Briefly describe why this account is being created and what access is required...'
              value={form.reasonForAccess ?? ''}
              onChange={set('reasonForAccess')}
              required
              size='small'
              multiline
              minRows={3}
              fullWidth
              error={submitted && !form.reasonForAccess}
              errorText={reqError(submitted && !form.reasonForAccess, 'required')}
            />
          </Box>
        </Box>,
      )}

      {/* ── Section 3: Account Security + Temporary Password ─────────────── */}
      {wrapSection(
        classes,
        2,
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Info alert */}
          <Alert severity='info' sx={{ borderRadius: 2 }}>
            Admin-created users are <strong>activated immediately</strong>. Set a secure password
            below and use the <strong>Temporary Password</strong> generator to share credentials
            with the user.
          </Alert>

          {/* 3-column row: Password | Confirm Password | Temp Password Generator */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
              gap: 2,
              alignItems: 'start',
            }}
          >
            {/* Col 1: Password + strength */}
            <Box>
              <TextField
                name='password'
                label='Password'
                type={showPwd ? 'text' : 'password'}
                placeholder='Min. 8 chars, 1 uppercase, 1 number'
                value={form.password ?? ''}
                onChange={set('password')}
                required
                size='small'
                fullWidth
                error={submitted && !form.password}
                errorText={reqError(submitted && !form.password, 'required')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton size='small' onClick={() => setShowPwd((v) => !v)} edge='end'>
                        {showPwd ? (
                          <VisibilityOffIcon fontSize='small' />
                        ) : (
                          <VisibilityIcon fontSize='small' />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {form.password && (
                <Box sx={{ mt: 1 }}>
                  <Box className={classes.pwdBars}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Box
                        key={n}
                        className={classes.pwdBar}
                        sx={{
                          background: n <= pwdStrength.score ? pwdStrength.color : undefined,
                          boxShadow:
                            n <= pwdStrength.score ? `0 0 5px ${pwdStrength.color}80` : 'none',
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant='caption' sx={{ color: pwdStrength.color, fontWeight: 700 }}>
                    {pwdStrength.label}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Col 2: Confirm Password + match */}
            <Box>
              <TextField
                name='confirmPassword'
                label='Confirm Password'
                type={showConfirmPwd ? 'text' : 'password'}
                placeholder='Re-enter your password'
                value={form.confirmPassword ?? ''}
                onChange={set('confirmPassword')}
                required
                size='small'
                fullWidth
                error={pwdMismatch || (submitted && !form.confirmPassword)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        onClick={() => setShowConfirmPwd((v) => !v)}
                        edge='end'
                      >
                        {showConfirmPwd ? (
                          <VisibilityOffIcon fontSize='small' />
                        ) : (
                          <VisibilityIcon fontSize='small' />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                errorText={
                  pwdMismatch
                    ? 'Passwords must match'
                    : reqError(submitted && !form.confirmPassword, 'required')
                }
              />
              {pwdMatch && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircleIcon sx={{ fontSize: '0.9rem', color: '#22c55e' }} />
                  <Typography variant='caption' sx={{ color: '#22c55e', fontWeight: 700 }}>
                    Passwords match
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Col 3: Temporary password generator */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%' }}>
              <Button
                variant='outlined'
                size='small'
                onClick={handleApplyGenPassword}
                sx={{
                  height: { xs: 'auto', sm: '40px' },
                  padding: { xs: '6px 10px', sm: '0 14px' },
                  fontSize: '0.8125rem',
                  whiteSpace: { xs: 'normal', sm: 'nowrap' },
                  lineHeight: 1.4,
                  flex: 1,
                }}
              >
                Temporary Password Generator
              </Button>
              <IconButton size='small' onClick={handleCopyGenPassword}>
                {copied ? (
                  <CheckCircleIcon sx={{ fontSize: 18, color: '#22c55e' }} />
                ) : (
                  <ContentCopyIcon fontSize='small' />
                )}
              </IconButton>
              <IconButton size='small' onClick={handleRefreshGenPassword}>
                <AutorenewIcon fontSize='small' />
              </IconButton>
            </Box>
          </Box>
        </Box>,
      )}

      {/* ── Section 4: Admin Notes ─────────────────────────────────────────── */}
      {wrapSection(
        classes,
        3,
        <TextField
          name='adminNotes'
          label='Admin Notes (Optional)'
          placeholder='Internal notes, special permissions, onboarding instructions...'
          value={form.adminNotes ?? ''}
          onChange={set('adminNotes')}
          size='small'
          multiline
          rows={4}
          fullWidth
        />,
      )}

      {/* ── Section 5: Attachments ─────────────────────────────────────────── */}
      {wrapSection(
        classes,
        4,
        <Box>
          <label style={{ display: 'block', cursor: 'pointer' }}>
            <input
              type='file'
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files) setAttachments((p) => [...p, ...Array.from(e.target.files!)]);
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                border: '1.5px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                px: 2.5,
                py: 2.5,
                transition: 'border-color 0.2s, background 0.2s',
                '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' },
              }}
            >
              <AttachFileIcon sx={{ fontSize: 22, color: 'text.disabled' }} />
              <Box>
                <Typography variant='body2' fontWeight={600} color='text.secondary'>
                  Click to upload files (optional)
                </Typography>
                <Typography variant='caption' color='text.disabled'>
                  PDF, PNG, JPG, DOCX — max 10 MB each
                </Typography>
              </Box>
            </Box>
          </label>
          {attachments.length > 0 && (
            <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {attachments.map((f, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'action.hover',
                  }}
                >
                  <Typography variant='caption' fontWeight={600} noWrap sx={{ maxWidth: 140 }}>
                    {f.name}
                  </Typography>
                  <IconButton
                    size='small'
                    sx={{ p: 0.25 }}
                    onClick={() => setAttachments((p) => p.filter((_, idx) => idx !== i))}
                  >
                    <CloseIcon sx={{ fontSize: 13 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>,
      )}

      {/* ── Sticky CTA bar ────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 20,
          mt: 2,
          px: 2.5,
          py: 1.75,
          backgroundColor: 'background.paper',
          borderRadius: '14px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 1.5, sm: 0 },
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        {/* Left: completion — single line: icon · label · bar · % */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flex: 1, mr: { sm: 3 } }}>
          <AutoAwesomeIcon sx={{ fontSize: '1rem', color: 'text.disabled', flexShrink: 0 }} />
          <Typography
            sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.secondary', flexShrink: 0 }}
          >
            Completion
          </Typography>
          <LinearProgress
            variant='determinate'
            value={completionPct}
            sx={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor: 'text.secondary',
                transition: 'width 0.4s ease',
              },
            }}
          />
          <Typography
            sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'text.secondary', flexShrink: 0 }}
          >
            {completionPct}%
          </Typography>
        </Box>

        {/* Right: action buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1,
            flexShrink: 0,
          }}
        >
          <Button
            variant='outlined'
            size='small'
            onClick={() => navigate(AdminPath.CREATE_MANAGEMENT)}
            sx={{
              height: '40px',
              padding: '0 12px',
              fontSize: '0.8125rem',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Back
          </Button>
          <Button
            variant='outlined'
            size='small'
            onClick={handleDraft}
            disabled={isDrafting || isSubmitting}
            sx={{
              height: '40px',
              padding: '0 12px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {isDrafting ? 'Saving…' : 'Draft'}
          </Button>
          <Button
            variant='contained'
            size='small'
            onClick={handleSubmit}
            disabled={(submitted && !canSubmit) || isSubmitting}
            sx={{
              height: '40px',
              padding: '0 16px',
              fontSize: '0.8125rem',
              background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
              fontWeight: 700,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 90 },
              boxShadow: '0 4px 14px rgba(34,197,94,0.35)',
              '&:hover': { filter: 'brightness(1.08)' },
              '&:disabled': { opacity: 0.45 },
            }}
          >
            {isSubmitting ? 'Creating…' : 'Submit'}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant='filled'
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateManagementForm;
