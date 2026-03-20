import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Tooltip, Switch, TextField, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PeopleIcon from '@mui/icons-material/People';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HistoryIcon from '@mui/icons-material/History';
import LoginIcon from '@mui/icons-material/Login';
import LockResetIcon from '@mui/icons-material/LockReset';
import MapPinIcon from '@mui/icons-material/PinDrop';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadIcon from '@mui/icons-material/Download';
import TimerIcon from '@mui/icons-material/Timer';
import { Loader } from '@bandi/component';
import { useAuthActionMutation } from '@bandi/services';
import { useNotification } from '@bandi/hooks';
import { IAuthUser } from '../../../../entities/interfaces';
import { constants } from '@bandi/utils';
import { useStyles } from './styles';
import ChangeProfileDialog from '../UserManagement/dialogs/ChangeProfileDialog/ChangeProfileDialog';
import ChangesLogDialog from '../UserManagement/dialogs/ChangesLogDialog/ChangesLogDialog';
import LoginDataDialog from '../UserManagement/dialogs/LoginDataDialog/LoginDataDialog';
import ResetPasswordDialog from '../UserManagement/dialogs/ResetPasswordDialog/ResetPasswordDialog';
import {
  UserRow,
  ChangeProfileErrors,
  ResetPwErrors,
  ChangeLogEntry,
} from '../UserManagement/types/userManagement.types';
import { generateTempPassword } from '../UserManagement/utils/userManagement.utils';

// ── Types ───────────────────────────────────────────────────────────────────

interface EditForm {
  firstName: string;
  lastName: string;
  phone: string;
  businessUnit: string;
  employeeId: string;
  isActive: boolean;
  accessFromDate: string;
  accessToDate: string;
  reasonForAccess: string;
  adminNotes: string;
}

const buildEditForm = (u: IAuthUser): EditForm => ({
  firstName: u.firstName ?? '',
  lastName: u.lastName ?? '',
  phone: u.phone ?? '',
  businessUnit: u.businessUnit ?? '',
  employeeId: u.employeeId ?? '',
  isActive: u.isActive,
  accessFromDate: u.accessFromDate ?? '',
  accessToDate: u.accessToDate ?? '',
  reasonForAccess: u.reasonForAccess ?? '',
  adminNotes: u.adminNotes ?? '',
});

// ── Helpers ─────────────────────────────────────────────────────────────────

const getStatusProps = (status: string | null | undefined) => {
  switch (status) {
    case 'active':
      return { label: 'Active', color: '#15803d', bg: '#dcfce7' };
    case 'pending_approval':
      return { label: 'Pending Approval', color: '#a16207', bg: '#fef9c3' };
    case 'inactive':
      return { label: 'Inactive', color: '#64748b', bg: '#f1f5f9' };
    case 'deactivated':
      return { label: 'Deactivated', color: '#dc2626', bg: '#fee2e2' };
    case 'rejected':
      return { label: 'Rejected', color: '#dc2626', bg: '#fee2e2' };
    default:
      return { label: status ?? 'Unknown', color: '#64748b', bg: '#f1f5f9' };
  }
};

const roleLabel = (role: string) =>
  ({ admin: 'Admin', consultant: 'Consultant', user: 'User', captain: 'Captain' })[role] ?? role;

const buildRefId = (role: string, id: number | string): string => {
  const prefix =
    role === 'admin'
      ? 'ADMIN'
      : role === 'consultant'
        ? 'CONSULT'
        : role === 'captain'
          ? 'CAPTAIN'
          : 'USER';
  const isDraft = String(id).startsWith('draft_') || (id as number) === -1;
  const type = isDraft ? 'DRAFT' : 'ROLE';
  let num = 0;
  if (!isDraft) num = Number(id);
  else if (String(id).startsWith('draft_'))
    num = parseInt(String(id).replace('draft_', ''), 10) || 0;
  return `${prefix}_${type}_${String(num).padStart(5, '0')}`;
};

const fmtDate = (v: string | null | undefined) => {
  if (!v) return '—';
  try {
    return new Date(v).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return v;
  }
};

const fmtDateTime = (v: string | null | undefined) => {
  if (!v) return '—';
  try {
    return new Date(v).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return v;
  }
};

const getInitials = (first: string, last: string) =>
  [first?.[0], last?.[0]].filter(Boolean).join('').toUpperCase() || '?';

// ── Shared sx factories ─────────────────────────────────────────────────────

const cardSx = (accent: string) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  mb: 1,
  p: '10px 14px',
  borderRadius: '12px',
  background: '#f8faff',
  border: '1px solid rgba(226,232,255,0.9)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: '#eef2ff',
    border: `1px solid ${accent}50`,
    transform: 'translateX(3px)',
  },
});

const editCardSx = (accent: string) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  mb: 1,
  p: '8px 12px 8px 14px',
  borderRadius: '12px',
  background: `linear-gradient(135deg, ${accent}0a 0%, ${accent}05 100%)`,
  border: `1.5px dashed ${accent}50`,
  transition: 'all 0.22s ease',
  '&:hover': { border: `1.5px dashed ${accent}90`, background: `${accent}0e` },
  '&:focus-within': { border: `1.5px solid ${accent}80`, boxShadow: `0 0 0 3px ${accent}18` },
});

const pillSx = (accent: string) => ({
  width: 34,
  height: 34,
  borderRadius: '10px',
  background: `${accent}18`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: accent,
});

const editPillSx = (accent: string) => ({
  width: 34,
  height: 34,
  borderRadius: '10px',
  background: `${accent}22`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: accent,
});

const fieldLabelSx = (accent: string) => ({
  fontSize: '0.65rem',
  color: accent,
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.7px',
  lineHeight: 1.2,
  mb: 0.25,
});

const fieldValueSx = (hasVal: boolean) => ({
  fontSize: '0.875rem',
  color: hasVal ? '#1e293b' : '#94a3b8',
  fontWeight: hasVal ? 600 : 400,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap' as const,
  lineHeight: 1.3,
});

const pencilBadgeSx = (accent: string) => ({
  position: 'absolute' as const,
  bottom: -3,
  right: -3,
  width: 14,
  height: 14,
  borderRadius: '50%',
  background: accent,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1.5px solid #fff',
});

// ── Sub-components ──────────────────────────────────────────────────────────

const FieldCard = ({
  icon,
  label,
  value,
  accent = '#6366f1',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
}) => (
  <Box sx={cardSx(accent)}>
    <Box sx={pillSx(accent)}>{icon}</Box>
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography sx={fieldLabelSx(accent)}>{label}</Typography>
      <Typography sx={fieldValueSx(!!value)}>{value || '—'}</Typography>
    </Box>
  </Box>
);

const EditTextCard = ({
  icon,
  label,
  value,
  onChange,
  accent = '#6366f1',
  type = 'text',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  accent?: string;
  type?: string;
}) => (
  <Box sx={editCardSx(accent)}>
    <Box sx={{ position: 'relative', flexShrink: 0 }}>
      <Box sx={editPillSx(accent)}>{icon}</Box>
      <Box sx={pencilBadgeSx(accent)}>
        <EditIcon sx={{ fontSize: '0.5rem', color: '#fff' }} />
      </Box>
    </Box>
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography sx={fieldLabelSx(accent)}>{label}</Typography>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: 'none',
          outline: 'none',
          background: 'transparent',
          width: '100%',
          fontSize: '0.875rem',
          color: '#1e293b',
          fontWeight: 600,
          fontFamily: 'inherit',
          padding: 0,
        }}
        placeholder={`Enter ${label}…`}
      />
    </Box>
  </Box>
);

const SectionDivider = ({ label, isEditing }: { label: string; isEditing?: boolean }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 1.5 }}>
    <Box
      sx={{
        flex: 1,
        height: '1px',
        background: isEditing
          ? 'linear-gradient(90deg,rgba(245,158,11,0.5),transparent)'
          : 'linear-gradient(90deg,rgba(99,102,241,0.35),transparent)',
      }}
    />
    <Typography
      sx={{
        fontSize: '0.65rem',
        color: isEditing ? '#b45309' : '#6366f1',
        fontWeight: 700,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.8px',
        whiteSpace: 'nowrap' as const,
      }}
    >
      {label}
    </Typography>
    <Box
      sx={{
        flex: 1,
        height: '1px',
        background: isEditing
          ? 'linear-gradient(90deg,transparent,rgba(245,158,11,0.5))'
          : 'linear-gradient(90deg,transparent,rgba(99,102,241,0.35))',
      }}
    />
  </Box>
);

// ── NavButton ────────────────────────────────────────────────────────────────

const NavButton = ({
  direction,
  targetId,
  onNavigate,
  className,
  classes,
}: {
  direction: 'prev' | 'next';
  targetId: number | string | null;
  onNavigate: (id: number | string) => void;
  className?: string;
  classes: Record<string, string>;
}) => {
  const Icon = direction === 'prev' ? NavigateBeforeIcon : NavigateNextIcon;
  const label = direction === 'prev' ? 'Previous user' : 'Next user';
  if (targetId === null || targetId === undefined)
    return (
      <Box className={classes.navButtonDisabled}>
        <Icon sx={{ fontSize: '1.4rem', color: 'inherit' }} />
      </Box>
    );
  return (
    <Tooltip title={label}>
      <IconButton size='small' className={className} onClick={() => onNavigate(targetId)}>
        <Icon sx={{ fontSize: '1.4rem' }} />
      </IconButton>
    </Tooltip>
  );
};

// ── ActionBar ────────────────────────────────────────────────────────────────

const iconSx = { fontSize: '1.5rem' };

const IconPill = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <Box
    sx={{
      width: 36,
      height: 36,
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.15s ease',
      background: `${color}18`,
    }}
  >
    {children}
  </Box>
);

interface ActionBtn {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const ActionBar = ({
  classes,
  isEditing,
  onEdit,
  onSave,
  onCancelEdit,
  onChangeProfile,
  onChangesLog,
  onLoginData,
  onResetPassword,
}: {
  classes: Record<string, string>;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onChangeProfile: () => void;
  onChangesLog: () => void;
  onLoginData: () => void;
  onResetPassword: () => void;
}) => {
  const viewBtns: ActionBtn[] = [
    {
      icon: (
        <IconPill color='#1976d2'>
          <EditIcon sx={{ ...iconSx, color: '#1976d2' }} />
        </IconPill>
      ),
      label: 'Edit',
      onClick: onEdit,
    },
    {
      icon: (
        <IconPill color='#7c3aed'>
          <SwapHorizIcon sx={{ ...iconSx, color: '#7c3aed' }} />
        </IconPill>
      ),
      label: 'Change Profile',
      onClick: onChangeProfile,
    },
    {
      icon: (
        <IconPill color='#0891b2'>
          <HistoryIcon sx={{ ...iconSx, color: '#0891b2' }} />
        </IconPill>
      ),
      label: 'Changes Log',
      onClick: onChangesLog,
    },
    {
      icon: (
        <IconPill color='#16a34a'>
          <LoginIcon sx={{ ...iconSx, color: '#16a34a' }} />
        </IconPill>
      ),
      label: 'Login Data',
      onClick: onLoginData,
    },
    {
      icon: (
        <IconPill color='#dc2626'>
          <LockResetIcon sx={{ ...iconSx, color: '#dc2626' }} />
        </IconPill>
      ),
      label: 'Reset Password',
      onClick: onResetPassword,
    },
  ];
  const editBtns: ActionBtn[] = [
    {
      icon: (
        <IconPill color='#16a34a'>
          <SaveIcon sx={{ ...iconSx, color: '#16a34a' }} />
        </IconPill>
      ),
      label: 'Save',
      onClick: onSave,
    },
    {
      icon: (
        <IconPill color='#dc2626'>
          <CloseIcon sx={{ ...iconSx, color: '#dc2626' }} />
        </IconPill>
      ),
      label: 'Cancel Edit',
      onClick: onCancelEdit,
    },
  ];
  const buttons = isEditing ? editBtns : viewBtns;
  return (
    <Box className={classes.actionButtonsRow}>
      {buttons.map((btn) => (
        <Box
          key={btn.label}
          className={`${classes.actionButton} actionButton`}
          onClick={btn.onClick}
        >
          <IconButton size='small' disabled={btn.disabled} sx={{ padding: 0 }}>
            {btn.icon}
          </IconButton>
          <Typography className={classes.actionLabel}>{btn.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { classes, cx } = useStyles();
  const [authAction] = useAuthActionMutation();
  const notify = useNotification();

  const [user, setUser] = useState<IAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [infoRowOpen, setInfoRowOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);

  // ── Change Profile dialog state ──────────────────────────────────────────
  const [changeProfileOpen, setChangeProfileOpen] = useState(false);
  const [changeProfileConfirmOpen, setChangeProfileConfirmOpen] = useState(false);
  const [changeProfileRole, setChangeProfileRole] = useState('');
  const [changeProfileReasonCode, setChangeProfileReasonCode] = useState('');
  const [changeProfileNoteText, setChangeProfileNoteText] = useState('');
  const [changeProfileAttachment, setChangeProfileAttachment] = useState<File | null>(null);
  const [changeProfileErrors, setChangeProfileErrors] = useState<ChangeProfileErrors>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const changeProfileNoteRef = useRef<HTMLTextAreaElement | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const adminAttachmentRef = useRef<HTMLInputElement | null>(null);
  const [adminAttachments, setAdminAttachments] = useState<File[]>([]);

  // ── Changes Log dialog state ─────────────────────────────────────────────
  const [changesLogOpen, setChangesLogOpen] = useState(false);
  const [changeLog, setChangeLog] = useState<ChangeLogEntry[]>([]);
  const [isLoadingLog, setIsLoadingLog] = useState(false);
  const [logSearch, setLogSearch] = useState('');
  const [logDateFrom, setLogDateFrom] = useState('');
  const [logDateTo, setLogDateTo] = useState('');
  const [logFilterField, setLogFilterField] = useState('');
  const [logFilterReason, setLogFilterReason] = useState('');
  const [logSortBy, setLogSortBy] = useState('createdAt');
  const [logSortOrder, setLogSortOrder] = useState<'asc' | 'desc'>('desc');
  const [logPage, setLogPage] = useState(0);
  const [logRowsPerPage, setLogRowsPerPage] = useState(25);
  const [logMaximized, setLogMaximized] = useState(false);
  const [logShowFilters, setLogShowFilters] = useState(true);

  // ── Login Data dialog state ──────────────────────────────────────────────
  const [loginDataOpen, setLoginDataOpen] = useState(false);

  // ── Reset Password dialog state ──────────────────────────────────────────
  const [resetPwOpen, setResetPwOpen] = useState(false);
  const [resetPwMode, setResetPwMode] = useState<'auto' | 'manual'>('auto');
  const [autoResetPw, setAutoResetPw] = useState('');
  const [showAutoResetPw, setShowAutoResetPw] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showManualPw, setShowManualPw] = useState(false);
  const [showManualPwConfirm, setShowManualPwConfirm] = useState(false);
  const [resetPwForceChange, setResetPwForceChange] = useState(true);
  const [resetPwReason, setResetPwReason] = useState('');
  const [resetPwErrors, setResetPwErrors] = useState<ResetPwErrors>({});
  const [isResettingPw, setIsResettingPw] = useState(false);

  // Navigation — always fetch all users (page opens in new tab so no router state)
  const [userIds, setUserIds] = useState<(number | string)[]>([]);

  // ── Draft expiry countdown ───────────────────────────────────────────────
  const [draftRemaining, setDraftRemaining] = useState('');
  const [draftExpired, setDraftExpired] = useState(false);

  useEffect(() => {
    // Use IDs saved by the table (respects current search/filter) — fall back to fetching all
    try {
      const stored = localStorage.getItem('user_detail_nav_ids');
      const ts = localStorage.getItem('user_detail_nav_ids_ts');
      if (stored && ts && Date.now() - Number(ts) < 30000) {
        const ids: (number | string)[] = JSON.parse(stored);
        if (Array.isArray(ids) && ids.length > 0) {
          setUserIds(ids);
          return;
        }
      }
    } catch {
      /* ignore */
    }

    // Fallback: fetch real users — drafts won't be navigable without localStorage context
    authAction({ action: 'get-all-users' })
      .unwrap()
      .then((res) => {
        const list: IAuthUser[] = Array.isArray(res.data) ? res.data : [];
        const ids: (number | string)[] = list.map((u) => u.id);
        // If the current page is a draft, prepend its own ID so at least its position is known
        if (id && (id === 'draft_local' || id.startsWith('draft_'))) {
          setUserIds([id, ...ids]);
        } else {
          setUserIds(ids);
        }
      })
      .catch(() => null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user?.draftExpiresAt) return;
    const update = () => {
      const diff = new Date(user.draftExpiresAt!).getTime() - Date.now();
      if (diff <= 0) {
        setDraftExpired(true);
        setDraftRemaining('');
        return;
      }
      setDraftExpired(false);
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      setDraftRemaining(
        days > 0
          ? `${days}d ${hours}h ${minutes}m remaining`
          : hours > 0
            ? `${hours}h ${minutes}m remaining`
            : `${minutes}m remaining`,
      );
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [user?.draftExpiresAt]);

  const numId = Number(id);
  const currentIdStr = id ?? '';
  const currentIdx = userIds.findIndex((uid) => String(uid) === currentIdStr);
  const prevId = currentIdx > 0 ? userIds[currentIdx - 1] : null;
  const nextId =
    currentIdx >= 0 && currentIdx < userIds.length - 1 ? userIds[currentIdx + 1] : null;

  const navigateToUser = (userId: number | string) => {
    const uidStr = String(userId);
    // If navigating to a draft, refresh draft_data from the stored map
    if (uidStr === 'draft_local' || uidStr.startsWith('draft_')) {
      try {
        const mapStr = localStorage.getItem('user_detail_draft_map');
        if (mapStr) {
          const draftMap = JSON.parse(mapStr);
          if (draftMap[uidStr]) {
            localStorage.setItem('user_detail_draft_data', JSON.stringify(draftMap[uidStr]));
            localStorage.setItem('user_detail_draft_data_ts', String(Date.now()));
          }
        }
      } catch {
        /* ignore */
      }
    }
    navigate(constants.AdminPath.USER_DETAIL.replace(':id', uidStr));
  };

  // ── Dialog handlers ──────────────────────────────────────────────────────

  const handleOpenChangeProfile = () => {
    setChangeProfileRole('');
    setChangeProfileReasonCode('');
    setChangeProfileNoteText('');
    setChangeProfileAttachment(null);
    setChangeProfileErrors({});
    setChangeProfileConfirmOpen(false);
    setChangeProfileOpen(true);
  };

  const handleChangeProfileSubmit = () => {
    const errors: ChangeProfileErrors = {};
    if (!changeProfileRole) errors.role = 'required';
    else if (changeProfileRole === user?.role) errors.role = 'Must be different from current role';
    if (!changeProfileReasonCode) errors.reasonCode = 'required';
    if (!changeProfileNoteText.trim()) errors.note = 'required';
    if (Object.keys(errors).length > 0) {
      setChangeProfileErrors(errors);
      return;
    }
    setChangeProfileConfirmOpen(true);
  };

  const handleSaveChangeProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      await authAction({
        action: 'update-user',
        userId: user.id,
        data: { role: changeProfileRole },
        reasonCode: changeProfileReasonCode,
        reasonNotes: changeProfileNoteText,
      }).unwrap();
      notify.success(`Role changed to ${changeProfileRole}`);
      setChangeProfileOpen(false);
      setChangeProfileConfirmOpen(false);
      setIsLoading(true);
      fetchUser();
    } catch (err: unknown) {
      notify.error(
        (err as { data?: { message?: string } })?.data?.message || 'Failed to change role',
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleOpenChangesLog = async () => {
    if (!user) return;
    setLogSearch('');
    setLogDateFrom('');
    setLogDateTo('');
    setLogFilterField('');
    setLogFilterReason('');
    setLogSortBy('createdAt');
    setLogSortOrder('desc');
    setLogPage(0);
    setLogShowFilters(true);
    setChangesLogOpen(true);
    setIsLoadingLog(true);
    try {
      const result = await authAction({ action: 'get-change-log', userId: user.id }).unwrap();
      setChangeLog((result?.data as ChangeLogEntry[]) || []);
    } catch {
      setChangeLog([]);
    } finally {
      setIsLoadingLog(false);
    }
  };

  const handleOpenResetPw = () => {
    setResetPwMode('auto');
    setAutoResetPw(generateTempPassword());
    setShowAutoResetPw(false);
    setNewPassword('');
    setNewPasswordConfirm('');
    setShowManualPw(false);
    setShowManualPwConfirm(false);
    setResetPwForceChange(true);
    setResetPwReason('');
    setResetPwErrors({});
    setResetPwOpen(true);
  };

  const handleResetPassword = async () => {
    if (!user) return;
    let password: string;
    if (resetPwMode === 'auto') {
      password = autoResetPw;
    } else {
      const errs: ResetPwErrors = {};
      if (!newPassword || newPassword.length < 8) errs.password = 'Must be at least 8 characters';
      if (!/[A-Z]/.test(newPassword))
        errs.password = errs.password || 'Must contain an uppercase letter';
      if (!/[0-9]/.test(newPassword)) errs.password = errs.password || 'Must contain a number';
      if (newPassword !== newPasswordConfirm) errs.confirm = 'Passwords do not match';
      if (Object.keys(errs).length > 0) {
        setResetPwErrors(errs);
        return;
      }
      password = newPassword;
    }
    setIsResettingPw(true);
    try {
      await authAction({
        action: 'reset-user-password',
        userId: user.id,
        newPassword: password,
        forceChange: resetPwForceChange,
        reason: resetPwReason,
      }).unwrap();
      notify.success('Password reset successfully');
      setResetPwOpen(false);
    } catch (err: unknown) {
      notify.error(
        (err as { data?: { message?: string } })?.data?.message || 'Failed to reset password',
      );
    } finally {
      setIsResettingPw(false);
    }
  };

  // ── Changes log computed ─────────────────────────────────────────────────
  const filteredLog = useMemo(() => {
    let rows = [...changeLog];
    if (logSearch) {
      const q = logSearch.toLowerCase();
      rows = rows.filter((r) =>
        Object.values(r).some((v) => v && String(v).toLowerCase().includes(q)),
      );
    }
    if (logDateFrom) rows = rows.filter((r) => r.createdAt && r.createdAt >= logDateFrom);
    if (logDateTo) rows = rows.filter((r) => r.createdAt && r.createdAt <= `${logDateTo}T23:59:59`);
    if (logFilterField) rows = rows.filter((r) => r.fieldName === logFilterField);
    if (logFilterReason) rows = rows.filter((r) => r.reasonCode === logFilterReason);
    rows.sort((a, b) => {
      const av = String(a[logSortBy as keyof ChangeLogEntry] ?? '');
      const bv = String(b[logSortBy as keyof ChangeLogEntry] ?? '');
      return logSortOrder === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return rows;
  }, [
    changeLog,
    logSearch,
    logDateFrom,
    logDateTo,
    logFilterField,
    logFilterReason,
    logSortBy,
    logSortOrder,
  ]);

  const paginatedLog = useMemo(
    () => filteredLog.slice(logPage * logRowsPerPage, logPage * logRowsPerPage + logRowsPerPage),
    [filteredLog, logPage, logRowsPerPage],
  );

  const uniqueLogFields = useMemo(
    () => [...new Set(changeLog.map((r) => r.fieldName).filter(Boolean))] as string[],
    [changeLog],
  );

  const hasLogFilters = !!(
    logSearch ||
    logDateFrom ||
    logDateTo ||
    logFilterField ||
    logFilterReason
  );

  const handleLogSort = (col: string) => {
    if (logSortBy === col) setLogSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else {
      setLogSortBy(col);
      setLogSortOrder('asc');
    }
  };

  const handleExportCsv = () => {
    if (!filteredLog.length) return;
    const headers = [
      'Date',
      'Change Type',
      'Field',
      'Previous Value',
      'New Value',
      'Changed By',
      'Reason Code',
      'Notes',
    ];
    const rows = filteredLog.map((r) =>
      [
        r.createdAt,
        r.changeType,
        r.fieldName,
        r.previousValue,
        r.newValue,
        r.changedByName,
        r.reasonCode,
        r.reasonNotes,
      ]
        .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
        .join(','),
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `changes-log-user-${user?.id}.csv`;
    a.click();
  };

  // ── user as UserRow adapter ──────────────────────────────────────────────
  const userAsRow = useMemo<UserRow | null>(() => (user ? { ...user, sno: 0 } : null), [user]);

  const fetchUser = async () => {
    try {
      const res = await authAction({ action: 'get-user', userId: numId }).unwrap();
      const u = res.data as IAuthUser;
      setUser(u);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    setUser(null);
    setIsEditing(false);

    // Draft ID: load from localStorage instead of calling API
    if (id && (id === 'draft_local' || id.startsWith('draft_'))) {
      try {
        const stored = localStorage.getItem('user_detail_draft_data');
        const ts = localStorage.getItem('user_detail_draft_data_ts');
        if (stored && ts && Date.now() - Number(ts) < 60000) {
          setUser(JSON.parse(stored) as IAuthUser);
          setIsLoading(false);
          return;
        }
      } catch {
        /* ignore */
      }
      setError(true);
      setIsLoading(false);
      return;
    }

    fetchUser();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartEdit = () => {
    if (!user) return;
    setEditForm(buildEditForm(user));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const handleSave = async () => {
    if (!user || !editForm) return;
    setIsSaving(true);
    try {
      await authAction({
        action: 'update-user',
        userId: user.id,
        data: {
          ...editForm,
          name: `${editForm.firstName} ${editForm.lastName}`,
          accessFromDate: editForm.accessFromDate
            ? new Date(editForm.accessFromDate).toISOString()
            : null,
          accessToDate: editForm.accessToDate
            ? new Date(editForm.accessToDate).toISOString()
            : null,
        },
      }).unwrap();
      notify.success('User updated successfully');
      setIsEditing(false);
      setEditForm(null);
      setIsLoading(true);
      fetchUser();
    } catch (err: unknown) {
      notify.error(
        (err as { data?: { message?: string } })?.data?.message || 'Failed to update user',
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <Box className={classes.container}>
        <Loader />
      </Box>
    );

  if (error || !user) {
    return (
      <Box className={classes.container}>
        <Typography color='error' variant='body2'>
          {error ? 'Failed to load user details' : `User "${id}" not found`}
        </Typography>
      </Box>
    );
  }

  const initials = getInitials(user.firstName, user.lastName);
  const { label: statusLabel, color: statusColor } = getStatusProps(user.status);

  const ef = editForm;
  const set = (k: keyof EditForm) => (v: string | boolean) =>
    setEditForm((p) => (p ? { ...p, [k]: v } : p));

  const iconSm = { fontSize: '1rem' };
  const iconMd = { fontSize: '1.1rem' };

  const sidebarEditBorderSx = isEditing
    ? {
        border: '1.5px solid rgba(245,158,11,0.45) !important',
        boxShadow: '0 0 0 3px rgba(245,158,11,0.08),0 4px 24px rgba(0,0,0,0.06) !important',
      }
    : undefined;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className={classes.container}>
        {/* ── Mobile header bar ─────────────────────────────────────────── */}
        <Box className={classes.mobileHeaderBar}>
          <NavButton
            direction='prev'
            targetId={prevId}
            onNavigate={navigateToUser}
            classes={classes}
          />
          <Box className={classes.mobileHeaderCenter}>
            <Typography className={classes.mobileIncidentNumber}>
              {user.firstName} {user.lastName}
            </Typography>
          </Box>
          <NavButton
            direction='next'
            targetId={nextId}
            onNavigate={navigateToUser}
            classes={classes}
          />
        </Box>

        {/* ── Mobile draft banner ───────────────────────────────────────── */}
        {user.draftExpiresAt && (
          <Box
            className={cx(
              classes.mobileDraftTimer,
              draftExpired && classes.mobileDraftTimerExpired,
            )}
          >
            <TimerIcon sx={{ fontSize: '0.875rem' }} color={draftExpired ? 'error' : 'warning'} />
            <Typography
              sx={{ fontSize: '0.875rem', fontWeight: 600 }}
              color={draftExpired ? 'error.main' : 'warning.dark'}
            >
              {draftExpired ? 'Draft Expired' : `Draft Expires In ${draftRemaining}`}
            </Typography>
          </Box>
        )}

        {/* ── Desktop header ────────────────────────────────────────────── */}
        <Box className={classes.headerRow}>
          <NavButton
            direction='prev'
            targetId={prevId}
            onNavigate={navigateToUser}
            className={classes.headerNavButton}
            classes={classes}
          />
          <Box className={classes.headerCenter}>
            <Typography className={classes.headerTitle}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.8px',
                fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.7)',
                mt: 0.25,
              }}
            >
              {buildRefId(user.role, user.id)}
            </Typography>
          </Box>
          <NavButton
            direction='next'
            targetId={nextId}
            onNavigate={navigateToUser}
            className={classes.headerNavButton}
            classes={classes}
          />
        </Box>

        {/* ── Desktop draft banner ──────────────────────────────────────── */}
        {user.draftExpiresAt && (
          <Box className={cx(classes.draftTimerBadge, draftExpired && classes.draftTimerExpired)}>
            <TimerIcon fontSize='small' color={draftExpired ? 'error' : 'warning'} />
            <Typography
              variant='body2'
              fontWeight={600}
              color={draftExpired ? 'error.main' : 'warning.dark'}
            >
              {draftExpired ? 'Draft Expired' : `Draft Expires In ${draftRemaining}`}
            </Typography>
          </Box>
        )}

        {/* ── Mobile user info toggle ───────────────────────────────────── */}
        <Box
          className={cx(classes.mobileToggleRow, infoRowOpen && classes.mobileToggleRowOpen)}
          onClick={() => setInfoRowOpen((p) => !p)}
          sx={{ display: { sm: 'none', xs: 'flex' }, mt: '8px' }}
        >
          <Box className={classes.mobileToggleLeft}>
            <Box
              className={cx(classes.mobileToggleDot, infoRowOpen && classes.mobileToggleDotOpen)}
            />
            <Typography
              className={cx(
                classes.mobileToggleLabel,
                infoRowOpen && classes.mobileToggleLabelOpen,
              )}
            >
              User Info
            </Typography>
          </Box>
          <Box className={classes.mobileToggleRight}>
            <Typography
              className={cx(
                classes.mobileToggleAction,
                infoRowOpen && classes.mobileToggleActionOpen,
              )}
            >
              {infoRowOpen ? 'Hide' : 'Show'}
            </Typography>
            <ExpandMoreIcon
              className={cx(classes.mobileToggleIcon, infoRowOpen && classes.mobileToggleIconOpen)}
            />
          </Box>
        </Box>

        {/* ── Info row ─────────────────────────────────────────────────── */}
        <Box
          className={classes.infoRow}
          sx={{ display: { xs: infoRowOpen ? 'flex' : 'none', sm: 'flex' } }}
        >
          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>
              <EmailIcon sx={{ fontSize: '0.75rem', mr: 0.4, verticalAlign: 'middle' }} />
              Email
            </Typography>
            <Tooltip title={user.email}>
              <Typography className={classes.infoValue}>{user.email}</Typography>
            </Tooltip>
          </Box>
          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>
              <PhoneIcon sx={{ fontSize: '0.75rem', mr: 0.4, verticalAlign: 'middle' }} />
              Phone
            </Typography>
            <Typography className={classes.infoValue}>{user.phone || '—'}</Typography>
          </Box>
          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>
              <WorkIcon sx={{ fontSize: '0.75rem', mr: 0.4, verticalAlign: 'middle' }} />
              Role
            </Typography>
            <Typography className={classes.infoValue}>{roleLabel(user.role)}</Typography>
          </Box>
          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>
              <MapPinIcon sx={{ fontSize: '0.75rem', mr: 0.4, verticalAlign: 'middle' }} />
              City / Zone
            </Typography>
            <Typography className={classes.infoValue}>{user.city || '—'}</Typography>
          </Box>
          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>
              <CalendarTodayIcon sx={{ fontSize: '0.75rem', mr: 0.4, verticalAlign: 'middle' }} />
              Date of Birth
            </Typography>
            <Typography className={classes.infoValue}>{fmtDate(user.dateOfBirth)}</Typography>
          </Box>
          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>
              <PersonIcon sx={{ fontSize: '0.75rem', mr: 0.4, verticalAlign: 'middle' }} />
              Gender
            </Typography>
            <Typography className={classes.infoValue}>{user.gender || '—'}</Typography>
          </Box>
          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>
              <CalendarTodayIcon sx={{ fontSize: '0.75rem', mr: 0.4, verticalAlign: 'middle' }} />
              Joined
            </Typography>
            <Typography className={classes.infoValue}>{fmtDate(user.createdAt)}</Typography>
          </Box>
          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>
              <AccessTimeIcon sx={{ fontSize: '0.75rem', mr: 0.4, verticalAlign: 'middle' }} />
              Last Login
            </Typography>
            <Typography className={classes.infoValue}>{fmtDateTime(user.lastLoginAt)}</Typography>
          </Box>
        </Box>

        {/* ── Main layout ──────────────────────────────────────────────── */}
        <Box className={classes.mainLayout}>
          {/* ── Sidebar ── */}
          <Box
            className={cx(
              classes.sidebar,
              sidebarOpen ? classes.sidebarExpanded : classes.sidebarCollapsed,
            )}
          >
            <IconButton
              className={classes.sidebarToggleButton}
              onClick={() => setSidebarOpen((p) => !p)}
              sx={sidebarOpen ? { right: 4 } : { left: '50%', transform: 'translateX(-50%)' }}
            >
              {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>

            {/* Collapsed vertical strip */}
            {!sidebarOpen && (
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  flexDirection: 'column',
                  alignItems: 'center',
                  pt: '52px',
                  pb: 2,
                  width: '100%',
                  minHeight: 220,
                  gap: 0,
                }}
              >
                <Box
                  sx={{
                    width: 2,
                    height: 36,
                    background: 'linear-gradient(180deg,transparent 0%,rgba(99,102,241,0.45) 100%)',
                    borderRadius: 1,
                  }}
                />
                <Box
                  onClick={() => setSidebarOpen(true)}
                  sx={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    fontSize: '0.58rem',
                    fontWeight: 800,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    userSelect: 'none',
                    py: 1,
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#6366f1' },
                  }}
                >
                  Details
                </Box>
                <Box
                  sx={{
                    width: 2,
                    flex: 1,
                    background: 'linear-gradient(180deg,rgba(99,102,241,0.45) 0%,transparent 100%)',
                    borderRadius: 1,
                  }}
                />
              </Box>
            )}

            {sidebarOpen && (
              <Box className={classes.sidebarContent} sx={sidebarEditBorderSx}>
                {/* Edit mode banner */}
                {isEditing && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      mb: 1.5,
                      px: 1.5,
                      py: 0.875,
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg,#fef3c7 0%,#fde68a 100%)',
                      border: '1.5px solid #f59e0b',
                      boxShadow: '0 2px 8px rgba(245,158,11,0.2)',
                    }}
                  >
                    <EditIcon sx={{ fontSize: '0.875rem', color: '#b45309', flexShrink: 0 }} />
                    <Typography
                      sx={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: '#92400e',
                        textTransform: 'uppercase',
                        letterSpacing: '0.6px',
                        flex: 1,
                      }}
                    >
                      Editing
                    </Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#b45309', fontWeight: 600 }}>
                      Tap fields to change
                    </Typography>
                  </Box>
                )}

                {/* Creator card */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 1.5,
                    p: '12px 14px',
                    borderRadius: '14px',
                    background: isEditing
                      ? 'linear-gradient(135deg,#fef3c7 0%,#fde68a 100%)'
                      : 'linear-gradient(135deg,#eef2ff 0%,#f0fdf4 100%)',
                    border: `1px solid ${isEditing ? 'rgba(245,158,11,0.4)' : 'rgba(99,102,241,0.2)'}`,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: isEditing
                        ? 'linear-gradient(135deg,#d97706 0%,#f59e0b 100%)'
                        : 'linear-gradient(135deg,#4338ca 0%,#6366f1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      flexShrink: 0,
                      boxShadow: isEditing
                        ? '0 2px 8px rgba(217,119,6,0.35)'
                        : '0 2px 8px rgba(67,56,202,0.35)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isEditing && ef
                      ? `${ef.firstName?.[0] ?? ''}${ef.lastName?.[0] ?? ''}`.toUpperCase() || '?'
                      : initials}
                  </Box>
                  {isEditing && ef ? (
                    <Box
                      sx={{
                        minWidth: 0,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}
                    >
                      <input
                        value={ef.firstName}
                        onChange={(e) => set('firstName')(e.target.value)}
                        placeholder='First name'
                        style={{
                          border: 'none',
                          borderBottom: '1.5px solid #f59e0b',
                          outline: 'none',
                          background: 'transparent',
                          width: '100%',
                          fontSize: '0.8rem',
                          color: '#92400e',
                          fontWeight: 700,
                          fontFamily: 'inherit',
                          padding: '1px 0',
                        }}
                      />
                      <input
                        value={ef.lastName}
                        onChange={(e) => set('lastName')(e.target.value)}
                        placeholder='Last name'
                        style={{
                          border: 'none',
                          borderBottom: '1.5px solid #f59e0b',
                          outline: 'none',
                          background: 'transparent',
                          width: '100%',
                          fontSize: '0.8rem',
                          color: '#92400e',
                          fontWeight: 700,
                          fontFamily: 'inherit',
                          padding: '1px 0',
                        }}
                      />
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        color: '#1e293b',
                        fontWeight: 700,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                      }}
                    >
                      {user.firstName} {user.lastName}
                    </Typography>
                  )}
                </Box>

                <SectionDivider label='Created By' isEditing={isEditing} />

                <FieldCard
                  icon={<PersonIcon sx={iconMd} />}
                  label='Full Name'
                  value={`${user.firstName} ${user.lastName}`}
                  accent='#4338ca'
                />
                <FieldCard
                  icon={<EmailIcon sx={iconSm} />}
                  label='Email'
                  value={user.email}
                  accent='#6366f1'
                />
                <FieldCard
                  icon={<BadgeIcon sx={iconSm} />}
                  label='Reference'
                  value={user.source ?? ''}
                  accent='#7c3aed'
                />
                <FieldCard
                  icon={<CalendarTodayIcon sx={iconSm} />}
                  label='Created At'
                  value={fmtDateTime(user.createdAt)}
                  accent='#0891b2'
                />

                <SectionDivider label='Work' isEditing={isEditing} />

                {isEditing && ef ? (
                  <>
                    <EditTextCard
                      icon={<BadgeIcon sx={iconMd} />}
                      label='Employee ID'
                      value={ef.employeeId}
                      onChange={set('employeeId')}
                      accent='#6366f1'
                    />
                    <EditTextCard
                      icon={<BusinessCenterIcon sx={iconSm} />}
                      label='Department'
                      value={ef.businessUnit}
                      onChange={set('businessUnit')}
                      accent='#0891b2'
                    />
                  </>
                ) : (
                  <>
                    <FieldCard
                      icon={<BadgeIcon sx={iconMd} />}
                      label='Employee ID'
                      value={user.employeeId || ''}
                      accent='#6366f1'
                    />
                    <FieldCard
                      icon={<BusinessCenterIcon sx={iconSm} />}
                      label='Department'
                      value={user.businessUnit || ''}
                      accent='#0891b2'
                    />
                    <FieldCard
                      icon={<EmailIcon sx={iconSm} />}
                      label='Manager Email'
                      value={user.applicationLead || ''}
                      accent='#7c3aed'
                    />
                  </>
                )}
              </Box>
            )}
          </Box>

          {/* ── Content Area ── */}
          <Box className={classes.contentArea}>
            {/* ActionBar */}
            <ActionBar
              classes={classes}
              isEditing={isEditing}
              onEdit={handleStartEdit}
              onSave={handleSave}
              onCancelEdit={handleCancelEdit}
              onChangeProfile={handleOpenChangeProfile}
              onChangesLog={handleOpenChangesLog}
              onLoginData={() => setLoginDataOpen(true)}
              onResetPassword={handleOpenResetPw}
            />

            {/* Account & Security */}
            <Box className={classes.descriptionCard}>
              <Box className={classes.descriptionCardHeader}>
                <Typography className={classes.descriptionSectionTitle}>
                  <SecurityIcon sx={{ fontSize: '0.85rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Account &amp; Security
                </Typography>
              </Box>
              <Box className={classes.descriptionCardBody}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 1,
                  }}
                >
                  {isEditing && ef ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: '10px 14px',
                        borderRadius: '12px',
                        background: ef.isActive ? '#dcfce718' : '#f1f5f9',
                        border: `1px solid ${ef.isActive ? '#16a34a40' : 'rgba(226,232,255,0.9)'}`,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: '10px',
                            background: ef.isActive ? '#16a34a18' : '#94a3b818',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <VpnKeyIcon
                            sx={{ fontSize: '1rem', color: ef.isActive ? '#16a34a' : '#94a3b8' }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '0.65rem',
                              color: ef.isActive ? '#16a34a' : '#64748b',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.7px',
                              lineHeight: 1.2,
                              mb: 0.25,
                            }}
                          >
                            Status
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '0.875rem',
                              color: ef.isActive ? '#15803d' : '#64748b',
                              fontWeight: 600,
                            }}
                          >
                            {ef.isActive ? 'Active' : 'Inactive'}
                          </Typography>
                        </Box>
                      </Box>
                      <Switch
                        checked={ef.isActive}
                        onChange={() => set('isActive')(!ef.isActive)}
                        size='small'
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#16a34a' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#16a34a',
                          },
                        }}
                      />
                    </Box>
                  ) : (
                    <FieldCard
                      icon={<VpnKeyIcon sx={iconSm} />}
                      label='Status'
                      value={statusLabel}
                      accent={statusColor}
                    />
                  )}
                  <FieldCard
                    icon={<SecurityIcon sx={iconSm} />}
                    label='Failed Login Attempts'
                    value={String(user.failedLoginAttempts ?? 0)}
                    accent='#dc2626'
                  />
                  <FieldCard
                    icon={<AccessTimeIcon sx={iconSm} />}
                    label='Password Changed At'
                    value={fmtDateTime(user.passwordChangedAt)}
                    accent='#7c3aed'
                  />
                  <FieldCard
                    icon={<AccessTimeIcon sx={iconSm} />}
                    label='Locked Until'
                    value={fmtDateTime(user.lockedUntil)}
                    accent='#d97706'
                  />
                  <FieldCard
                    icon={<AccessTimeIcon sx={iconSm} />}
                    label='Last Activity'
                    value={fmtDateTime(user.lastActivityAt)}
                    accent='#0891b2'
                  />
                </Box>
              </Box>
            </Box>

            {/* Access Information */}
            <Box className={classes.descriptionCard}>
              <Box className={classes.descriptionCardHeader}>
                <Typography className={classes.descriptionSectionTitle}>
                  <AccessTimeIcon sx={{ fontSize: '0.85rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Access Information
                </Typography>
              </Box>
              <Box className={classes.descriptionCardBody}>
                {isEditing && ef ? (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DatePicker
                        label='Access From'
                        value={ef.accessFromDate ? dayjs(ef.accessFromDate) : null}
                        onChange={(v) => set('accessFromDate')(v ? v.format('YYYY-MM-DD') : '')}
                        slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DatePicker
                        label='Access To'
                        value={ef.accessToDate ? dayjs(ef.accessToDate) : null}
                        onChange={(v) => set('accessToDate')(v ? v.format('YYYY-MM-DD') : '')}
                        slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 1,
                    }}
                  >
                    <FieldCard
                      icon={<CalendarTodayIcon sx={iconSm} />}
                      label='Access From'
                      value={fmtDate(user.accessFromDate)}
                      accent='#16a34a'
                    />
                    <FieldCard
                      icon={<CalendarTodayIcon sx={iconSm} />}
                      label='Access To'
                      value={fmtDate(user.accessToDate)}
                      accent='#dc2626'
                    />
                    <FieldCard
                      icon={<PeopleIcon sx={iconSm} />}
                      label='Reviewed By'
                      value={user.reviewedBy ? `#${user.reviewedBy}` : ''}
                      accent='#4338ca'
                    />
                    <FieldCard
                      icon={<AccessTimeIcon sx={iconSm} />}
                      label='Reviewed At'
                      value={fmtDateTime(user.reviewedAt)}
                      accent='#7c3aed'
                    />
                    <FieldCard
                      icon={<AccessTimeIcon sx={iconSm} />}
                      label='Updated At'
                      value={fmtDateTime(user.updatedAt)}
                      accent='#0891b2'
                    />
                  </Box>
                )}
              </Box>
            </Box>

            {/* Reason for Access */}
            <Box className={classes.descriptionCard}>
              <Box className={classes.descriptionCardHeader}>
                <Typography className={classes.descriptionSectionTitle}>
                  <SecurityIcon sx={{ fontSize: '0.85rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Reason for Access
                </Typography>
              </Box>
              <Box className={classes.descriptionCardBody}>
                {isEditing && ef ? (
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    size='small'
                    label='Reason for Access'
                    value={ef.reasonForAccess}
                    onChange={(e) => set('reasonForAccess')(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                  />
                ) : (
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: user.reasonForAccess ? '#1e293b' : '#94a3b8',
                      lineHeight: 1.7,
                    }}
                  >
                    {user.reasonForAccess || 'No reason provided.'}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Admin Notes */}
            <Box className={classes.descriptionCard}>
              <Box className={classes.descriptionCardHeader}>
                <Typography className={classes.descriptionSectionTitle}>
                  <BadgeIcon sx={{ fontSize: '0.85rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Admin Notes
                </Typography>
              </Box>
              <Box className={classes.descriptionCardBody}>
                {isEditing && ef ? (
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    size='small'
                    label='Admin Notes'
                    value={ef.adminNotes}
                    onChange={(e) => set('adminNotes')(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                  />
                ) : (
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: user.adminNotes ? '#334155' : '#94a3b8',
                      lineHeight: 1.7,
                    }}
                  >
                    {user.adminNotes || 'No admin notes.'}
                  </Typography>
                )}
              </Box>
            </Box>
            {/* Attachments */}
            <Box className={classes.descriptionCard}>
              <Box className={classes.descriptionCardHeader}>
                <Typography className={classes.descriptionSectionTitle}>
                  <AttachFileIcon sx={{ fontSize: '0.85rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Attachments
                </Typography>
              </Box>
              <Box className={classes.descriptionCardBody}>
                <input
                  ref={adminAttachmentRef}
                  type='file'
                  multiple
                  hidden
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    if (files.length) setAdminAttachments((prev) => [...prev, ...files]);
                    e.target.value = '';
                  }}
                />
                {adminAttachments.length === 0 ? (
                  <Box
                    onClick={() => adminAttachmentRef.current?.click()}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      py: 3,
                      borderRadius: '12px',
                      border: '1.5px dashed rgba(99,102,241,0.3)',
                      background: '#f8faff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { border: '1.5px dashed #6366f1', background: '#eef2ff' },
                    }}
                  >
                    <AttachFileIcon sx={{ fontSize: '1.5rem', color: '#94a3b8' }} />
                    <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
                      Click to upload attachments
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {adminAttachments.map((file, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: '8px 12px',
                          borderRadius: '10px',
                          background: '#f8faff',
                          border: '1px solid rgba(226,232,255,0.9)',
                          '&:hover': { background: '#eef2ff' },
                        }}
                      >
                        <AttachFileIcon
                          sx={{ fontSize: '1rem', color: '#6366f1', flexShrink: 0 }}
                        />
                        <Typography
                          sx={{
                            fontSize: '0.8rem',
                            color: '#1e293b',
                            fontWeight: 600,
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {file.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', flexShrink: 0 }}>
                          {(file.size / 1024).toFixed(1)} KB
                        </Typography>
                        <Tooltip title='Download'>
                          <IconButton
                            size='small'
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = URL.createObjectURL(file);
                              a.download = file.name;
                              a.click();
                            }}
                            sx={{ p: 0.25 }}
                          >
                            <DownloadIcon sx={{ fontSize: '0.9rem', color: '#6366f1' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Remove'>
                          <IconButton
                            size='small'
                            onClick={() =>
                              setAdminAttachments((prev) => prev.filter((_, i) => i !== idx))
                            }
                            sx={{ p: 0.25 }}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: '0.9rem', color: '#dc2626' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ))}
                    <Box
                      onClick={() => adminAttachmentRef.current?.click()}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: '7px 12px',
                        borderRadius: '10px',
                        border: '1.5px dashed rgba(99,102,241,0.3)',
                        cursor: 'pointer',
                        background: '#f8faff',
                        transition: 'all 0.2s ease',
                        '&:hover': { border: '1.5px dashed #6366f1', background: '#eef2ff' },
                      }}
                    >
                      <AttachFileIcon sx={{ fontSize: '0.9rem', color: '#6366f1' }} />
                      <Typography sx={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600 }}>
                        Add more files
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Dialogs ── */}
      <ChangeProfileDialog
        open={changeProfileOpen}
        onClose={() => setChangeProfileOpen(false)}
        confirmOpen={changeProfileConfirmOpen}
        onConfirmClose={() => setChangeProfileConfirmOpen(false)}
        selectedRow={userAsRow}
        mode='role'
        changeProfileRole={changeProfileRole}
        onRoleChange={setChangeProfileRole}
        changeProfileReasonCode={changeProfileReasonCode}
        onReasonCodeChange={setChangeProfileReasonCode}
        changeProfileNoteText={changeProfileNoteText}
        onNoteTextChange={setChangeProfileNoteText}
        changeProfileAttachment={changeProfileAttachment}
        onAttachmentChange={setChangeProfileAttachment}
        changeProfileErrors={changeProfileErrors}
        onErrorsChange={setChangeProfileErrors}
        isSaving={isSavingProfile}
        noteRef={changeProfileNoteRef}
        attachmentInputRef={attachmentInputRef}
        onSubmit={handleChangeProfileSubmit}
        onConfirmSave={handleSaveChangeProfile}
      />

      <ChangesLogDialog
        open={changesLogOpen}
        onClose={() => setChangesLogOpen(false)}
        selectedRow={userAsRow}
        changeLog={changeLog}
        isLoadingLog={isLoadingLog}
        logSearch={logSearch}
        onLogSearchChange={setLogSearch}
        logDateFrom={logDateFrom}
        onLogDateFromChange={setLogDateFrom}
        logDateTo={logDateTo}
        onLogDateToChange={setLogDateTo}
        logFilterField={logFilterField}
        onLogFilterFieldChange={setLogFilterField}
        logFilterReason={logFilterReason}
        onLogFilterReasonChange={setLogFilterReason}
        logSortBy={logSortBy}
        logSortOrder={logSortOrder}
        onLogSort={handleLogSort}
        logPage={logPage}
        onLogPageChange={setLogPage}
        logRowsPerPage={logRowsPerPage}
        onLogRowsPerPageChange={setLogRowsPerPage}
        logMaximized={logMaximized}
        onLogMaximizedChange={setLogMaximized}
        logShowFilters={logShowFilters}
        onLogShowFiltersChange={setLogShowFilters}
        uniqueLogFields={uniqueLogFields}
        filteredLog={filteredLog}
        paginatedLog={paginatedLog}
        hasLogFilters={hasLogFilters}
        onClearLogFilters={() => {
          setLogSearch('');
          setLogDateFrom('');
          setLogDateTo('');
          setLogFilterField('');
          setLogFilterReason('');
        }}
        onExportCsv={handleExportCsv}
      />

      <LoginDataDialog
        open={loginDataOpen}
        onClose={() => setLoginDataOpen(false)}
        selectedRow={userAsRow}
      />

      <ResetPasswordDialog
        open={resetPwOpen}
        onClose={() => setResetPwOpen(false)}
        selectedRow={userAsRow}
        resetPwMode={resetPwMode}
        onModeChange={setResetPwMode}
        autoResetPw={autoResetPw}
        onAutoResetPwChange={setAutoResetPw}
        showAutoResetPw={showAutoResetPw}
        onShowAutoResetPwChange={setShowAutoResetPw}
        newPassword={newPassword}
        onNewPasswordChange={setNewPassword}
        newPasswordConfirm={newPasswordConfirm}
        onNewPasswordConfirmChange={setNewPasswordConfirm}
        showManualPw={showManualPw}
        onShowManualPwChange={setShowManualPw}
        showManualPwConfirm={showManualPwConfirm}
        onShowManualPwConfirmChange={setShowManualPwConfirm}
        resetPwForceChange={resetPwForceChange}
        onForceChangeChange={setResetPwForceChange}
        resetPwReason={resetPwReason}
        onReasonChange={setResetPwReason}
        resetPwErrors={resetPwErrors}
        onErrorsChange={setResetPwErrors}
        isResetting={isResettingPw}
        onReset={handleResetPassword}
      />
    </LocalizationProvider>
  );
};

export default UserDetail;
