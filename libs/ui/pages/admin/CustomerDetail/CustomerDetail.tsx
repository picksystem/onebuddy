import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import SecurityIcon from '@mui/icons-material/Security';
import AirIcon from '@mui/icons-material/Air';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HistoryIcon from '@mui/icons-material/History';
import LoginIcon from '@mui/icons-material/Login';
import LockResetIcon from '@mui/icons-material/LockReset';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Loader } from '@bandi/component';
import { useAuthActionMutation, useUploadUserAttachmentsMutation } from '@bandi/services';
import { useNotification } from '@bandi/hooks';
import { constants } from '@bandi/utils';
import { useStyles } from './styles';
import { CustomerApprovalRow } from '../CustomerApprovals/hooks/useCustomerApprovals';
import {
  CustomerOnboardingRow,
  ChangeLogEntry,
  ResetPwErrors,
} from '../UserManagement/types/userManagement.types';
import ActionDialog from '../CustomerApprovals/dialogs/ActionDialog/ActionDialog';
import ChangesLogDialog from '../UserManagement/dialogs/ChangesLogDialog/ChangesLogDialog';
import LoginDataDialog from '../UserManagement/dialogs/LoginDataDialog/LoginDataDialog';
import ResetPasswordDialog from '../UserManagement/dialogs/ResetPasswordDialog/ResetPasswordDialog';
import { generateTempPassword } from '../UserManagement/utils/userManagement.utils';
import Tesseract from 'tesseract.js';

// ── Types ──────────────────────────────────────────────────────────────────────

interface CustomerEditForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  pincode: string;
  vehicleType: string;
  vehicleSubType: string;
  fuelType: string;
  tripPreference: string;
  vehicleNumber: string;
  rcNumber: string;
  rcExpiry: string;
  insuranceNumber: string;
  insuranceExpiry: string;
  pucNumber: string;
  pucExpiry: string;
  fitnessNumber: string;
  fitnessExpiry: string;
  permitNumber: string;
  permitExpiry: string;
  dlNumber: string;
  dlExpiry: string;
  idProofType: string;
  idProofNumber: string;
  adminNotes: string;
  bundleTypes: string[];
  bundleDiscount: string;
  rentalDuration: string;
  driverHireCount: string;
  driverHireShift: string;
  driverHireBudget: string;
}

interface NewDocFile {
  file: File;
  preview: string;
  name: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const BUNDLE_LABELS: Record<string, string> = {
  rental: 'Rent & Ride Bundle',
  driver_hire: 'Driver Hire Bundle',
  multi_vehicle: 'Multi-Vehicle Bundle',
  parcel_combo: 'Parcel + Ride Combo',
  cargo_coride: 'Cargo Co-Ride',
};

const BUNDLE_DISCOUNT_MAP: Record<string, number> = {
  rental: 10,
  driver_hire: 8,
  multi_vehicle: 12,
  parcel_combo: 0,
  cargo_coride: 0,
};

const BUNDLE_DESC: Record<string, string> = {
  rental: 'Offer vehicles for rental trips with 10% discount',
  driver_hire: 'Hire drivers for assigned trips with 8% discount',
  multi_vehicle: 'Manage multiple vehicles as a fleet with 12% discount',
  parcel_combo: 'Combine parcel delivery with ride services',
  cargo_coride: 'Share cargo space with other logistics partners',
};

// Bundle options per service category
const BUNDLES_BY_SERVICE: Record<string, string[]> = {
  mobility: ['rental', 'driver_hire', 'multi_vehicle', 'parcel_combo'],
  logistics: ['rental', 'driver_hire', 'multi_vehicle', 'cargo_coride'],
};

// Document metadata
const DOC_META: Record<
  string,
  {
    label: string;
    icon: React.ReactNode;
    color: string;
    numberKey?: keyof CustomerApprovalRow;
    expiryKey?: keyof CustomerApprovalRow;
  }
> = {
  rcFront: {
    label: 'RC (Front)',
    icon: <AssignmentIcon />,
    color: '#2e7d32',
    numberKey: 'rcNumber',
    expiryKey: 'rcExpiry',
  },
  rcBack: {
    label: 'RC (Back)',
    icon: <AssignmentIcon />,
    color: '#2e7d32',
    numberKey: 'rcNumber',
    expiryKey: 'rcExpiry',
  },
  regFront: { label: 'Registration (Front)', icon: <AssignmentIcon />, color: '#2e7d32' },
  insuranceFront: {
    label: 'Insurance',
    icon: <SecurityIcon />,
    color: '#0891b2',
    numberKey: 'insuranceNumber',
    expiryKey: 'insuranceExpiry',
  },
  pucFront: {
    label: 'PUC Certificate',
    icon: <AirIcon />,
    color: '#16a34a',
    numberKey: 'pucNumber',
    expiryKey: 'pucExpiry',
  },
  fitnessFront: {
    label: 'Fitness Certificate',
    icon: <HealthAndSafetyIcon />,
    color: '#7c3aed',
    numberKey: 'fitnessNumber',
    expiryKey: 'fitnessExpiry',
  },
  permitFront: {
    label: 'Permit',
    icon: <AssignmentTurnedInIcon />,
    color: '#d97706',
    numberKey: 'permitNumber',
    expiryKey: 'permitExpiry',
  },
  photoFront: {
    label: 'Personal Photo',
    icon: <PersonIcon />,
    color: '#0891b2',
  },
  dlFront: {
    label: 'DL (Front)',
    icon: <DriveEtaIcon />,
    color: '#e65100',
    numberKey: 'dlNumber',
    expiryKey: 'dlExpiry',
  },
  dlBack: {
    label: 'DL (Back)',
    icon: <DriveEtaIcon />,
    color: '#e65100',
    numberKey: 'dlNumber',
    expiryKey: 'dlExpiry',
  },
  idFront: {
    label: 'ID Proof (Front)',
    icon: <FingerprintIcon />,
    color: '#6366f1',
    numberKey: 'idProofNumber',
  },
  idBack: {
    label: 'ID Proof (Back)',
    icon: <FingerprintIcon />,
    color: '#6366f1',
    numberKey: 'idProofNumber',
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const fmtDate = (v?: string | null) => {
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

const fmtDateTime = (v?: string | null) => {
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

const genCustomerId = (row: CustomerApprovalRow) => {
  const prefix = row.serviceCategory === 'mobility' ? 'MOBIL' : 'LOGST';
  return `${prefix}${String(Number(row.id) || 0).padStart(5, '0')}`;
};

const parseJson = (v: unknown): unknown => {
  if (typeof v === 'string') {
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  }
  return v;
};

// ── OCR helpers ─────────────────────────────────────────────────────────────

const normalizeOcrDate = (raw: string): string => {
  // Convert DD/MM/YYYY or DD-MM-YYYY → YYYY-MM-DD for <input type="date">
  const m = raw.match(/(\d{1,2})[\s\/\-\.](\d{1,2})[\s\/\-\.](\d{2,4})/);
  if (!m) return raw;
  const [, d, mo, y] = m;
  const year = y.length === 2 ? `20${y}` : y;
  return `${year}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
};

const parseOcrText = (text: string): { number: string; expiry: string } => {
  const clean = text.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ');

  // Extract document number — try specific Indian doc patterns first, then generic
  const numPatterns = [
    /\b[A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{4}\b/, // RC: MH02AB1234
    /\b[A-Z]{2}[-\s]?\d{4}[-\s]?\d{7}\b/, // DL: MH-04-2015-1234567
    /\b[A-Z]{2}\d{11,13}\b/, // DL numeric
    /\b[A-Z0-9]{8,20}\b/, // Generic fallback
  ];
  let number = '';
  for (const p of numPatterns) {
    const m = clean.match(p);
    if (m) {
      number = m[0].replace(/\s/g, '');
      break;
    }
  }

  // Extract expiry — look for keyword context first
  const expiryCtx = clean.match(
    /(?:expir\w*|valid\s*(?:till|upto|thru)|validity|till|upto)[:\s]*(\d{1,2}[\s\/\-\.]\d{1,2}[\s\/\-\.]\d{2,4})/i,
  );
  let expiry = '';
  if (expiryCtx?.[1]) {
    expiry = normalizeOcrDate(expiryCtx[1]);
  } else {
    const dateM = clean.match(/\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})\b/);
    if (dateM) expiry = `${dateM[3]}-${dateM[2].padStart(2, '0')}-${dateM[1].padStart(2, '0')}`;
  }

  return { number, expiry };
};

// ── sx factories ───────────────────────────────────────────────────────────────

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

// ── Sub-components ─────────────────────────────────────────────────────────────

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
      <Typography sx={fieldValueSx(!!value && value !== '—')}>{value || '—'}</Typography>
    </Box>
  </Box>
);

const EditableField = ({
  icon,
  label,
  value,
  accent = '#6366f1',
  editing,
  editValue,
  onEditChange,
  type,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
  editing?: boolean;
  editValue?: string;
  onEditChange?: (v: string) => void;
  type?: string;
}) => {
  if (editing && onEditChange) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: '8px 14px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg,#fffbeb,#fef9ee)',
          border: '1.5px solid rgba(245,158,11,0.45)',
          boxShadow: '0 1px 6px rgba(245,158,11,0.12)',
          '&:focus-within': {
            border: '1.5px solid #f59e0b',
            boxShadow: '0 0 0 3px rgba(245,158,11,0.1)',
          },
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '10px',
            background: 'rgba(245,158,11,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: '#b45309',
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: '0.63rem',
              color: '#b45309',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.7px',
              lineHeight: 1.2,
              mb: 0.3,
            }}
          >
            {label}
          </Typography>
          <input
            type={type ?? 'text'}
            value={editValue ?? value}
            onChange={(e) => onEditChange(e.target.value)}
            style={{
              border: 'none',
              borderBottom: '1.5px solid rgba(245,158,11,0.6)',
              outline: 'none',
              background: 'transparent',
              width: '100%',
              fontSize: '0.875rem',
              color: '#92400e',
              fontWeight: 600,
              fontFamily: 'inherit',
              padding: '2px 0',
              cursor: 'text',
            }}
          />
        </Box>
      </Box>
    );
  }
  return <FieldCard icon={icon} label={label} value={value} accent={accent} />;
};

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

const IconPill = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <Box
    sx={{
      width: 36,
      height: 36,
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `${color}18`,
    }}
  >
    {children}
  </Box>
);

// ── Main Component ─────────────────────────────────────────────────────────────

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { classes, cx } = useStyles();
  const [authAction] = useAuthActionMutation();
  const [uploadAttachments] = useUploadUserAttachmentsMutation();
  const notify = useNotification();

  const [row, setRow] = useState<CustomerApprovalRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [infoRowOpen, setInfoRowOpen] = useState(false);
  const [navIds, setNavIds] = useState<(string | number)[]>([]);

  // ── Edit state ─────────────────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<CustomerEditForm>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    area: '',
    pincode: '',
    vehicleType: '',
    vehicleSubType: '',
    fuelType: '',
    tripPreference: '',
    vehicleNumber: '',
    rcNumber: '',
    rcExpiry: '',
    insuranceNumber: '',
    insuranceExpiry: '',
    pucNumber: '',
    pucExpiry: '',
    fitnessNumber: '',
    fitnessExpiry: '',
    permitNumber: '',
    permitExpiry: '',
    dlNumber: '',
    dlExpiry: '',
    idProofType: '',
    idProofNumber: '',
    adminNotes: '',
    bundleTypes: [],
    bundleDiscount: '',
    rentalDuration: '',
    driverHireCount: '',
    driverHireShift: '',
    driverHireBudget: '',
  });
  const setField = (key: keyof CustomerEditForm) => (val: string) =>
    setEditForm((p) => ({ ...p, [key]: val }));
  const toggleBundle = (bt: string) =>
    setEditForm((p) => ({
      ...p,
      bundleTypes: p.bundleTypes.includes(bt)
        ? p.bundleTypes.filter((b) => b !== bt)
        : [...p.bundleTypes, bt],
    }));

  // ── Document upload state ──────────────────────────────────────────────────
  const [newDocFiles, setNewDocFiles] = useState<NewDocFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ocrScanningKey, setOcrScanningKey] = useState<string | null>(null);
  const docScanInputRef = useRef<HTMLInputElement>(null);
  const pendingOcrDocKey = useRef<string>('');

  // ── Doc fullscreen dialog ──────────────────────────────────────────────────
  const [docDialogOpen, setDocDialogOpen] = useState(false);
  const [docDialogItem, setDocDialogItem] = useState<{
    key: string;
    label: string;
    color: string;
    icon: React.ReactNode;
    preview?: string;
  } | null>(null);

  // ── Action dialog ──────────────────────────────────────────────────────────
  const [actionTarget, setActionTarget] = useState<{
    row: CustomerApprovalRow;
    type: 'approve' | 'reject' | 'review';
  } | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [actionInProgress, setActionInProgress] = useState<string | number | null>(null);

  // ── Changes Log ────────────────────────────────────────────────────────────
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
  const [logRowsPerPage, setLogRowsPerPage] = useState(10);
  const [logMaximized, setLogMaximized] = useState(false);
  const [logShowFilters, setLogShowFilters] = useState(true);

  // ── Login Data / Reset Password ────────────────────────────────────────────
  const [loginDataOpen, setLoginDataOpen] = useState(false);
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

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchCustomer = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authAction({ action: 'get-customer-onboardings' }).unwrap();
      const all: CustomerApprovalRow[] = (res.data ?? []).map((r: CustomerApprovalRow) => ({
        ...r,
        bundleTypes: parseJson(r.bundleTypes) as string[] | undefined,
        additionalVehicles: parseJson(
          r.additionalVehicles,
        ) as CustomerApprovalRow['additionalVehicles'],
        parcelComboTypes: parseJson(r.parcelComboTypes) as string[] | undefined,
        uploadedFiles: parseJson(r.uploadedFiles) as string[] | undefined,
      }));
      // Support both numeric IDs (e.g. "5") and prefixed IDs (e.g. "MOBIL00005", "LOGST00003")
      const prefixMatch = id?.match(/^(MOBIL|LOGST)(\d+)$/i);
      const numericId = prefixMatch ? parseInt(prefixMatch[2], 10) : NaN;
      const found = prefixMatch
        ? all.find((r) => Number(r.id) === numericId)
        : all.find((r) => String(r.id) === String(id));
      setRow(found ?? null);
    } catch {
      setRow(null);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchCustomer();
    try {
      const stored = localStorage.getItem('customer_detail_nav_ids');
      const ts = localStorage.getItem('customer_detail_nav_ids_ts');
      if (stored && ts && Date.now() - Number(ts) < 1800000)
        setNavIds(JSON.parse(stored) as (string | number)[]);
    } catch {
      /* ignore */
    }
  }, [fetchCustomer]);

  // Cleanup blob URLs on unmount
  useEffect(
    () => () => {
      newDocFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    },
    [newDocFiles],
  );

  // ── Navigation ─────────────────────────────────────────────────────────────
  const navigateTo = (targetId: string | number) =>
    navigate(constants.AdminPath.CUSTOMER_DETAIL.replace(':id', String(targetId)));
  const currentIdx = navIds.findIndex((n) => String(n) === String(id));
  const prevId = currentIdx > 0 ? navIds[currentIdx - 1] : null;
  const nextId = currentIdx >= 0 && currentIdx < navIds.length - 1 ? navIds[currentIdx + 1] : null;

  // ── Edit handlers ──────────────────────────────────────────────────────────
  const handleStartEdit = () => {
    if (!row) return;
    setEditForm({
      firstName: row.firstName ?? '',
      lastName: row.lastName ?? '',
      phone: row.phone ?? '',
      email: row.email ?? '',
      city: row.city ?? '',
      area: row.area ?? '',
      pincode: row.pincode ?? '',
      vehicleType: row.vehicleType ?? '',
      vehicleSubType: row.vehicleSubType ?? '',
      fuelType: row.fuelType ?? '',
      tripPreference: row.tripPreference ?? '',
      vehicleNumber: row.vehicleNumber ?? '',
      rcNumber: row.rcNumber ?? '',
      rcExpiry: row.rcExpiry?.split('T')[0] ?? '',
      insuranceNumber: row.insuranceNumber ?? '',
      insuranceExpiry: row.insuranceExpiry?.split('T')[0] ?? '',
      pucNumber: row.pucNumber ?? '',
      pucExpiry: row.pucExpiry?.split('T')[0] ?? '',
      fitnessNumber: row.fitnessNumber ?? '',
      fitnessExpiry: row.fitnessExpiry?.split('T')[0] ?? '',
      permitNumber: row.permitNumber ?? '',
      permitExpiry: row.permitExpiry?.split('T')[0] ?? '',
      dlNumber: row.dlNumber ?? '',
      dlExpiry: row.dlExpiry?.split('T')[0] ?? '',
      idProofType: row.idProofType ?? '',
      idProofNumber: row.idProofNumber ?? '',
      adminNotes: row.adminNotes ?? '',
      bundleTypes: Array.isArray(row.bundleTypes) ? [...row.bundleTypes] : [],
      bundleDiscount:
        row.bundleDiscount !== undefined && row.bundleDiscount !== null
          ? String(row.bundleDiscount)
          : '',
      rentalDuration: row.rentalDuration ?? '',
      driverHireCount:
        row.driverHireCount !== undefined && row.driverHireCount !== null
          ? String(row.driverHireCount)
          : '',
      driverHireShift: row.driverHireShift ?? '',
      driverHireBudget: row.driverHireBudget ?? '',
    });
    setNewDocFiles([]);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    newDocFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    setNewDocFiles([]);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!row) return;
    setIsSaving(true);
    try {
      const ef = editForm;
      // Upload any new doc files
      if (newDocFiles.length > 0 && row.userId) {
        try {
          await uploadAttachments({
            userId: Number(row.userId),
            files: newDocFiles.map((f) => f.file),
          }).unwrap();
        } catch {
          /* non-fatal */
        }
      }
      await authAction({
        action: 'update-customer-onboarding',
        onboardingId: row.id,
        data: {
          firstName: ef.firstName || undefined,
          lastName: ef.lastName || undefined,
          phone: ef.phone || undefined,
          email: ef.email || undefined,
          city: ef.city || undefined,
          area: ef.area || undefined,
          pincode: ef.pincode || undefined,
          vehicleType: ef.vehicleType || undefined,
          vehicleSubType: ef.vehicleSubType || undefined,
          fuelType: ef.fuelType || undefined,
          tripPreference: ef.tripPreference || undefined,
          vehicleNumber: ef.vehicleNumber || undefined,
          rcNumber: ef.rcNumber || undefined,
          rcExpiry: ef.rcExpiry || undefined,
          insuranceNumber: ef.insuranceNumber || undefined,
          insuranceExpiry: ef.insuranceExpiry || undefined,
          pucNumber: ef.pucNumber || undefined,
          pucExpiry: ef.pucExpiry || undefined,
          fitnessNumber: ef.fitnessNumber || undefined,
          fitnessExpiry: ef.fitnessExpiry || undefined,
          permitNumber: ef.permitNumber || undefined,
          permitExpiry: ef.permitExpiry || undefined,
          dlNumber: ef.dlNumber || undefined,
          dlExpiry: ef.dlExpiry || undefined,
          idProofType: ef.idProofType || undefined,
          idProofNumber: ef.idProofNumber || undefined,
          adminNotes: ef.adminNotes || undefined,
          bundleTypes: ef.bundleTypes.length > 0 ? ef.bundleTypes : undefined,
          bundleDiscount: ef.bundleDiscount ? Number(ef.bundleDiscount) : undefined,
          rentalDuration: ef.rentalDuration || undefined,
          driverHireCount: ef.driverHireCount ? Number(ef.driverHireCount) : undefined,
          driverHireShift: ef.driverHireShift || undefined,
          driverHireBudget: ef.driverHireBudget || undefined,
        },
      }).unwrap();
      notify.success('Customer updated successfully');
      newDocFiles.forEach((f) => URL.revokeObjectURL(f.preview));
      setNewDocFiles([]);
      setIsEditing(false);
      fetchCustomer();
    } catch {
      notify.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Document drag & drop ───────────────────────────────────────────────────
  const handleFileDrop = (files: FileList | File[]) => {
    const arr = Array.from(files).filter(
      (f) => f.type.startsWith('image/') || f.type === 'application/pdf',
    );
    if (!arr.length) return;
    const newEntries: NewDocFile[] = arr.map((f) => ({
      file: f,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : '',
      name: f.name,
    }));
    setNewDocFiles((p) => [...p, ...newEntries]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileDrop(e.dataTransfer.files);
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFileDrop(e.target.files);
  };
  const removeNewDoc = (idx: number) => {
    setNewDocFiles((p) => {
      URL.revokeObjectURL(p[idx].preview);
      return p.filter((_, i) => i !== idx);
    });
  };

  // ── OCR scan handlers ──────────────────────────────────────────────────────
  const handleDocScan = (docKey: string) => {
    pendingOcrDocKey.current = docKey;
    if (docScanInputRef.current) {
      docScanInputRef.current.value = '';
      docScanInputRef.current.click();
    }
  };

  const handleDocScanFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !ef) return;
    const docKey = pendingOcrDocKey.current;
    const meta = DOC_META[docKey];
    if (!meta || !file.type.startsWith('image/')) {
      notify.error('Please select an image file for scanning');
      return;
    }
    setOcrScanningKey(docKey);
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file, 'eng', { logger: () => {} });
      const extracted = parseOcrText(text);
      let filled = 0;
      if (meta.numberKey && extracted.number) {
        setField(meta.numberKey as keyof CustomerEditForm)(extracted.number);
        filled++;
      }
      if (meta.expiryKey && extracted.expiry) {
        setField(meta.expiryKey as keyof CustomerEditForm)(extracted.expiry);
        filled++;
      }
      if (filled > 0) {
        notify.success(
          `✓ ${meta.label}: ${filled} field${filled > 1 ? 's' : ''} auto-filled from scan`,
        );
      } else {
        notify.error(`Could not extract data from ${meta.label} — please fill manually`);
      }
    } catch {
      notify.error('OCR scan failed — please fill fields manually');
    } finally {
      setOcrScanningKey(null);
    }
  };

  // ── Action handlers ────────────────────────────────────────────────────────
  const handleOpenAction = (r: CustomerApprovalRow, type: 'approve' | 'reject' | 'review') => {
    setActionTarget({ row: r, type });
    setActionNotes('');
  };
  const handleCloseAction = () => {
    setActionTarget(null);
    setActionNotes('');
  };
  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    setActionInProgress(actionTarget.row.id);
    try {
      const newStatus =
        actionTarget.type === 'approve'
          ? 'approved'
          : actionTarget.type === 'reject'
            ? 'rejected'
            : 'under_review';
      await authAction({
        action: 'update-customer-onboarding',
        onboardingId: actionTarget.row.id,
        data: { status: newStatus, adminNotes: actionNotes || undefined },
      }).unwrap();
      notify.success(
        `Customer ${actionTarget.type === 'approve' ? 'approved' : actionTarget.type === 'reject' ? 'rejected' : 'moved to under review'}.`,
      );
      handleCloseAction();
      fetchCustomer();
    } catch {
      notify.error('Action failed.');
    } finally {
      setActionInProgress(null);
    }
  };

  // ── Changes Log ────────────────────────────────────────────────────────────
  const handleOpenChangesLog = async () => {
    if (!row) return;
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
      const res = await authAction({
        action: 'get-change-log',
        onboardingId: row.id,
      } as any).unwrap();
      setChangeLog((res?.data as ChangeLogEntry[]) || []);
    } catch {
      setChangeLog([]);
    } finally {
      setIsLoadingLog(false);
    }
  };

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
    const csvRows = filteredLog.map((r) =>
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
    const a = document.createElement('a');
    a.href = URL.createObjectURL(
      new Blob([[headers.join(','), ...csvRows].join('\n')], { type: 'text/csv' }),
    );
    a.download = `changes-log-customer-${row?.id}.csv`;
    a.click();
  };

  // ── Reset Password ─────────────────────────────────────────────────────────
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
    if (!row) return;
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
        userId: row.id,
        newPassword: password,
        forceChange: resetPwForceChange,
        reason: resetPwReason,
      } as any).unwrap();
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

  // ── Adapters ───────────────────────────────────────────────────────────────
  const rowAsOnboarding = useMemo<CustomerOnboardingRow | null>(
    () =>
      row
        ? ({
            ...row,
            sno: 0,
            bundleTypes: Array.isArray(row.bundleTypes)
              ? JSON.stringify(row.bundleTypes)
              : (row.bundleTypes ?? null),
          } as unknown as CustomerOnboardingRow)
        : null,
    [row],
  );
  const rowAsUserRow = useMemo(
    () =>
      row
        ? ({
            id: row.id as number,
            sno: 0,
            name: `${row.firstName} ${row.lastName}`.trim(),
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email || '',
            phone: row.phone || '',
            role: 'user',
            status: row.status,
            isActive: row.status === 'approved',
          } as any)
        : null,
    [row],
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  if (isLoading)
    return (
      <Box
        className={classes.container}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Loader />
      </Box>
    );
  if (!row)
    return (
      <Box className={classes.container} sx={{ textAlign: 'center', pt: 10 }}>
        <Typography variant='h6' color='text.secondary'>
          Customer not found.
        </Typography>
      </Box>
    );

  const ef = isEditing ? editForm : null;
  const isMobility = row.serviceCategory === 'mobility';
  const customerId = genCustomerId(row);
  const canAct = row.status === 'pending' || row.status === 'under_review';
  const fullName = `${row.firstName} ${row.lastName}`.trim();
  const initials = `${row.firstName?.[0] ?? ''}${row.lastName?.[0] ?? ''}`.toUpperCase() || '?';
  const heroGradient = isMobility
    ? 'linear-gradient(135deg,#1a237e 0%,#283593 40%,#1565c0 100%)'
    : 'linear-gradient(135deg,#4e1d07 0%,#78350f 40%,#b45309 100%)';
  const bundleTypes = Array.isArray(row.bundleTypes) ? row.bundleTypes : [];
  const availableBundles = BUNDLES_BY_SERVICE[row.serviceCategory] ?? [];
  const iconSm = { fontSize: '1rem' };
  const iconMd = { fontSize: '1.1rem' };
  const isAdminCreated = !row.isSelfRegistered && (!!row.createdByName || !!row.createdByEmail);

  // Doc list for Attached Documents section
  const uploadedKeys = Array.isArray(row.uploadedFiles) ? row.uploadedFiles : [];
  const docItems: { key: string }[] =
    uploadedKeys.length > 0
      ? uploadedKeys.map((k) => ({ key: k }))
      : [
          ...(row.rcNumber ? [{ key: 'rcFront' }, { key: 'rcBack' }] : []),
          ...(row.insuranceNumber ? [{ key: 'insuranceFront' }] : []),
          ...(row.pucNumber ? [{ key: 'pucFront' }] : []),
          ...(row.fitnessNumber ? [{ key: 'fitnessFront' }] : []),
          ...(row.permitNumber ? [{ key: 'permitFront' }] : []),
          ...(row.dlNumber ? [{ key: 'dlFront' }, { key: 'dlBack' }] : []),
          ...(row.idProofNumber ? [{ key: 'idFront' }, { key: 'idBack' }] : []),
        ];

  const sidebarEditBorderSx = isEditing
    ? {
        border: '1.5px solid rgba(245,158,11,0.45) !important',
        boxShadow: '0 0 0 3px rgba(245,158,11,0.08),0 4px 24px rgba(0,0,0,0.06) !important',
      }
    : undefined;

  return (
    <Box className={classes.container}>
      {/* ── Mobile header ── */}
      <Box className={classes.mobileHeaderBar}>
        {prevId !== null ? (
          <IconButton size='small' sx={{ color: '#fff' }} onClick={() => navigateTo(prevId)}>
            <NavigateBeforeIcon />
          </IconButton>
        ) : (
          <Box sx={{ width: 34, opacity: 0.3 }}>
            <NavigateBeforeIcon />
          </Box>
        )}
        <Box className={classes.mobileHeaderCenter}>
          <Box className={classes.mobileCallerAvatar}>{initials}</Box>
          <Typography className={classes.mobileIncidentNumber}>{fullName}</Typography>
        </Box>
        {nextId !== null ? (
          <IconButton size='small' sx={{ color: '#fff' }} onClick={() => navigateTo(nextId)}>
            <NavigateNextIcon />
          </IconButton>
        ) : (
          <Box sx={{ width: 34, opacity: 0.3 }}>
            <NavigateNextIcon />
          </Box>
        )}
      </Box>
      <Box className={classes.mobileTitleBar}>
        <Typography className={classes.mobileTitleText}>{fullName}</Typography>
      </Box>

      {/* ── Desktop header — name only, no avatar ── */}
      <Box className={classes.headerRow}>
        {prevId !== null ? (
          <Tooltip title='Previous customer'>
            <IconButton
              size='small'
              className={classes.headerNavButton}
              onClick={() => navigateTo(prevId)}
            >
              <NavigateBeforeIcon sx={{ fontSize: '1.4rem' }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Box className={classes.navButtonDisabled}>
            <NavigateBeforeIcon sx={{ fontSize: '1.4rem', color: 'inherit' }} />
          </Box>
        )}

        <Box className={classes.headerCenter}>
          <Typography
            className={classes.headerTitle}
            sx={{ fontSize: '1.1rem !important', fontWeight: '700 !important' }}
          >
            {fullName}
          </Typography>
        </Box>

        {nextId !== null ? (
          <Tooltip title='Next customer'>
            <IconButton
              size='small'
              className={classes.headerNavButton}
              onClick={() => navigateTo(nextId)}
            >
              <NavigateNextIcon sx={{ fontSize: '1.4rem' }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Box className={classes.navButtonDisabled}>
            <NavigateNextIcon sx={{ fontSize: '1.4rem', color: 'inherit' }} />
          </Box>
        )}
      </Box>

      {/* ── Mobile info toggle ── */}
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
            className={cx(classes.mobileToggleLabel, infoRowOpen && classes.mobileToggleLabelOpen)}
          >
            Customer Info
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

      {/* ── Info strip ── */}
      <Box
        className={classes.infoRow}
        sx={{ display: { xs: infoRowOpen ? 'flex' : 'none', sm: 'flex' } }}
      >
        {[
          {
            icon: <BadgeIcon sx={{ fontSize: '1.4rem' }} />,
            label: 'Customer ID',
            value: customerId,
            color: '#6366f1',
          },
          {
            icon: <PersonIcon sx={{ fontSize: '1.4rem' }} />,
            label: 'Name',
            value: fullName,
            color: '#3b82f6',
          },
          {
            icon: <PhoneIcon sx={{ fontSize: '1.4rem' }} />,
            label: 'Phone',
            value: row.phone || '—',
            color: '#10b981',
          },
          {
            icon: <EmailIcon sx={{ fontSize: '1.4rem' }} />,
            label: 'Email',
            value: row.email || '—',
            color: '#f59e0b',
          },
          {
            icon: isMobility ? (
              <DirectionsBusIcon sx={{ fontSize: '1.4rem' }} />
            ) : (
              <LocalShippingIcon sx={{ fontSize: '1.4rem' }} />
            ),
            label: 'Service',
            value: isMobility ? 'Mobility' : 'Logistics',
            color: isMobility ? '#1d4ed8' : '#b45309',
          },
          {
            icon: <DirectionsCarIcon sx={{ fontSize: '1.4rem' }} />,
            label: 'Vehicle',
            value: row.vehicleType || '—',
            color: '#7c3aed',
          },
          {
            icon: <LocationOnIcon sx={{ fontSize: '1.4rem' }} />,
            label: 'City',
            value: row.city || '—',
            color: '#f43f5e',
          },
          {
            icon: <CalendarTodayIcon sx={{ fontSize: '1.4rem' }} />,
            label: 'Submitted',
            value: fmtDate(row.submittedAt ?? row.createdAt),
            color: '#06b6d4',
          },
        ].map(({ icon, label, value, color }) => (
          <Box key={label} className={classes.infoItem}>
            <Box
              data-info-icon
              className={classes.infoIconWrap}
              sx={{ background: `${color}18`, color, boxShadow: `0 4px 16px ${color}30` }}
            >
              {icon}
            </Box>
            <Typography className={classes.infoLabel}>{label}</Typography>
            <Tooltip title={value}>
              <Typography className={classes.infoValue}>{value}</Typography>
            </Tooltip>
          </Box>
        ))}
      </Box>

      {/* ── Main layout ── */}
      <Box className={classes.mainLayout}>
        {/* ── Sidebar — only shown when created by admin/consultant ── */}
        {isAdminCreated && (
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
                    background: 'linear-gradient(180deg,transparent,rgba(99,102,241,0.45))',
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
                    py: 1,
                    cursor: 'pointer',
                    '&:hover': { color: '#6366f1' },
                  }}
                >
                  Details
                </Box>
                <Box
                  sx={{
                    width: 2,
                    flex: 1,
                    background: 'linear-gradient(180deg,rgba(99,102,241,0.45),transparent)',
                    borderRadius: 1,
                  }}
                />
              </Box>
            )}

            {sidebarOpen && (
              <Box className={classes.sidebarContent} sx={sidebarEditBorderSx}>
                {/* Edit banner */}
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

                {/* Created By */}
                <SectionDivider label='Created By' isEditing={isEditing} />
                {row.createdByName || row.createdByEmail ? (
                  <>
                    <FieldCard
                      icon={<PersonIcon sx={iconSm} />}
                      label='Name'
                      value={row.createdByName ?? ''}
                      accent='#6366f1'
                    />
                    <FieldCard
                      icon={<EmailIcon sx={iconSm} />}
                      label='Email'
                      value={row.createdByEmail ?? ''}
                      accent='#3b82f6'
                    />
                    {row.createdByPhone && (
                      <FieldCard
                        icon={<PhoneIcon sx={iconSm} />}
                        label='Phone'
                        value={row.createdByPhone}
                        accent='#0891b2'
                      />
                    )}
                  </>
                ) : (
                  <FieldCard
                    icon={<PersonAddIcon sx={iconSm} />}
                    label='Created By'
                    value='Self-registered'
                    accent='#64748b'
                  />
                )}
                <FieldCard
                  icon={<CalendarTodayIcon sx={iconSm} />}
                  label='Created At'
                  value={fmtDateTime(row.createdAt)}
                  accent='#0891b2'
                />

                {/* Quick actions */}
                {canAct && (
                  <>
                    <SectionDivider label='Quick Actions' isEditing={isEditing} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {row.status === 'pending' && (
                        <Button
                          fullWidth
                          size='small'
                          variant='outlined'
                          startIcon={<RateReviewOutlinedIcon />}
                          onClick={() => handleOpenAction(row, 'review')}
                          disabled={!!actionInProgress}
                          sx={{
                            borderColor: '#2563eb',
                            color: '#2563eb',
                            '&:hover': { bgcolor: 'rgba(37,99,235,0.06)' },
                            textTransform: 'none',
                            borderRadius: 2,
                            fontSize: '0.78rem',
                          }}
                        >
                          Under Review
                        </Button>
                      )}
                      <Button
                        fullWidth
                        size='small'
                        variant='outlined'
                        startIcon={<CancelOutlinedIcon />}
                        onClick={() => handleOpenAction(row, 'reject')}
                        disabled={!!actionInProgress}
                        sx={{
                          borderColor: '#dc2626',
                          color: '#dc2626',
                          '&:hover': { bgcolor: 'rgba(220,38,38,0.06)' },
                          textTransform: 'none',
                          borderRadius: 2,
                          fontSize: '0.78rem',
                        }}
                      >
                        Reject
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </Box>
        )}

        {/* ── Content Area ── */}
        <Box className={classes.contentArea}>
          {/* ActionBar */}
          <Box className={classes.actionButtonsRow}>
            {isEditing ? (
              <>
                <Box className={`${classes.actionButton} actionButton`} onClick={handleSave}>
                  <IconButton size='small' disabled={isSaving} sx={{ padding: 0 }}>
                    <IconPill color='#16a34a'>
                      <SaveIcon sx={{ fontSize: '1.5rem', color: '#16a34a' }} />
                    </IconPill>
                  </IconButton>
                  <Typography className={classes.actionLabel}>Save</Typography>
                </Box>
                <Box className={`${classes.actionButton} actionButton`} onClick={handleCancelEdit}>
                  <IconButton size='small' sx={{ padding: 0 }}>
                    <IconPill color='#dc2626'>
                      <CloseIcon sx={{ fontSize: '1.5rem', color: '#dc2626' }} />
                    </IconPill>
                  </IconButton>
                  <Typography className={classes.actionLabel}>Cancel</Typography>
                </Box>
              </>
            ) : (
              <>
                <Box className={`${classes.actionButton} actionButton`} onClick={handleStartEdit}>
                  <IconButton size='small' sx={{ padding: 0 }}>
                    <IconPill color='#1976d2'>
                      <EditIcon sx={{ fontSize: '1.5rem', color: '#1976d2' }} />
                    </IconPill>
                  </IconButton>
                  <Typography className={classes.actionLabel}>Edit</Typography>
                </Box>
                {canAct && (
                  <>
                    <Box
                      className={`${classes.actionButton} actionButton`}
                      onClick={() => handleOpenAction(row, 'approve')}
                    >
                      <IconButton size='small' disabled={!!actionInProgress} sx={{ padding: 0 }}>
                        <IconPill color='#16a34a'>
                          <CheckCircleOutlineIcon sx={{ fontSize: '1.5rem', color: '#16a34a' }} />
                        </IconPill>
                      </IconButton>
                      <Typography className={classes.actionLabel}>Approve</Typography>
                    </Box>
                    {row.status === 'pending' && (
                      <Box
                        className={`${classes.actionButton} actionButton`}
                        onClick={() => handleOpenAction(row, 'review')}
                      >
                        <IconButton size='small' disabled={!!actionInProgress} sx={{ padding: 0 }}>
                          <IconPill color='#2563eb'>
                            <RateReviewOutlinedIcon sx={{ fontSize: '1.5rem', color: '#2563eb' }} />
                          </IconPill>
                        </IconButton>
                        <Typography className={classes.actionLabel}>Under Review</Typography>
                      </Box>
                    )}
                    <Box
                      className={`${classes.actionButton} actionButton`}
                      onClick={() => handleOpenAction(row, 'reject')}
                    >
                      <IconButton size='small' disabled={!!actionInProgress} sx={{ padding: 0 }}>
                        <IconPill color='#dc2626'>
                          <CancelOutlinedIcon sx={{ fontSize: '1.5rem', color: '#dc2626' }} />
                        </IconPill>
                      </IconButton>
                      <Typography className={classes.actionLabel}>Reject</Typography>
                    </Box>
                  </>
                )}
                <Box
                  className={`${classes.actionButton} actionButton`}
                  onClick={handleOpenChangesLog}
                >
                  <IconButton size='small' sx={{ padding: 0 }}>
                    <IconPill color='#0891b2'>
                      <HistoryIcon sx={{ fontSize: '1.5rem', color: '#0891b2' }} />
                    </IconPill>
                  </IconButton>
                  <Typography className={classes.actionLabel}>Changes Log</Typography>
                </Box>
                <Box
                  className={`${classes.actionButton} actionButton`}
                  onClick={() => setLoginDataOpen(true)}
                >
                  <IconButton size='small' sx={{ padding: 0 }}>
                    <IconPill color='#16a34a'>
                      <LoginIcon sx={{ fontSize: '1.5rem', color: '#16a34a' }} />
                    </IconPill>
                  </IconButton>
                  <Typography className={classes.actionLabel}>Login Data</Typography>
                </Box>
                <Box className={`${classes.actionButton} actionButton`} onClick={handleOpenResetPw}>
                  <IconButton size='small' sx={{ padding: 0 }}>
                    <IconPill color='#dc2626'>
                      <LockResetIcon sx={{ fontSize: '1.5rem', color: '#dc2626' }} />
                    </IconPill>
                  </IconButton>
                  <Typography className={classes.actionLabel}>Reset Password</Typography>
                </Box>
              </>
            )}
          </Box>

          {/* ── Contact & Location ── */}
          {(!!ef || row.area || row.pincode) && (
            <Box className={classes.descriptionCard}>
              <Box className={classes.descriptionCardHeader}>
                <Typography className={classes.descriptionSectionTitle}>
                  <LocationOnIcon sx={{ fontSize: '0.85rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Contact &amp; Location
                </Typography>
              </Box>
              <Box className={classes.descriptionCardBody}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 1.5,
                  }}
                >
                  {ef ? (
                    <>
                      <EditableField
                        icon={<PhoneIcon sx={iconSm} />}
                        label='Phone'
                        value={row.phone ?? ''}
                        accent='#10b981'
                        editing
                        editValue={ef.phone}
                        onEditChange={setField('phone')}
                      />
                      <EditableField
                        icon={<EmailIcon sx={iconSm} />}
                        label='Email'
                        value={row.email ?? ''}
                        accent='#f59e0b'
                        editing
                        editValue={ef.email}
                        onEditChange={setField('email')}
                      />
                      <EditableField
                        icon={<LocationOnIcon sx={iconSm} />}
                        label='City'
                        value={row.city ?? ''}
                        accent='#f43f5e'
                        editing
                        editValue={ef.city}
                        onEditChange={setField('city')}
                      />
                      <EditableField
                        icon={<LocationOnIcon sx={iconSm} />}
                        label='Area'
                        value={row.area ?? ''}
                        accent='#f43f5e'
                        editing
                        editValue={ef.area}
                        onEditChange={setField('area')}
                      />
                      <EditableField
                        icon={<LocationOnIcon sx={iconSm} />}
                        label='Pincode'
                        value={row.pincode ?? ''}
                        accent='#f43f5e'
                        editing
                        editValue={ef.pincode}
                        onEditChange={setField('pincode')}
                      />
                    </>
                  ) : (
                    <>
                      {row.area && (
                        <FieldCard
                          icon={<LocationOnIcon sx={iconSm} />}
                          label='Area'
                          value={row.area}
                          accent='#f43f5e'
                        />
                      )}
                      {row.pincode && (
                        <FieldCard
                          icon={<LocationOnIcon sx={iconSm} />}
                          label='Pincode'
                          value={row.pincode}
                          accent='#f43f5e'
                        />
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          )}

          {/* ── Vehicle Setup ── */}
          <Box className={classes.descriptionCard}>
            <Box className={classes.descriptionCardHeader}>
              <Typography className={classes.descriptionSectionTitle}>
                <DirectionsCarIcon sx={{ fontSize: '0.85rem', mr: 0.5, verticalAlign: 'middle' }} />
                Vehicle Setup
              </Typography>
            </Box>
            <Box className={classes.descriptionCardBody}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1.5,
                }}
              >
                {ef && (
                  <EditableField
                    icon={<DirectionsCarIcon sx={iconMd} />}
                    label='Vehicle Type'
                    value={row.vehicleType ?? ''}
                    accent='#7c3aed'
                    editing
                    editValue={ef.vehicleType}
                    onEditChange={setField('vehicleType')}
                  />
                )}
                <EditableField
                  icon={<DirectionsCarIcon sx={iconSm} />}
                  label='Vehicle Sub-type'
                  value={row.vehicleSubType ?? ''}
                  accent='#7c3aed'
                  editing={!!ef}
                  editValue={ef?.vehicleSubType}
                  onEditChange={setField('vehicleSubType')}
                />
                <EditableField
                  icon={<DirectionsCarIcon sx={iconSm} />}
                  label='Fuel Type'
                  value={row.fuelType ?? ''}
                  accent='#7c3aed'
                  editing={!!ef}
                  editValue={ef?.fuelType}
                  onEditChange={setField('fuelType')}
                />
                <EditableField
                  icon={<DirectionsCarIcon sx={iconSm} />}
                  label='Trip Preference'
                  value={row.tripPreference?.replace(/_/g, ' ') ?? ''}
                  accent='#7c3aed'
                  editing={!!ef}
                  editValue={ef?.tripPreference}
                  onEditChange={setField('tripPreference')}
                />
                <EditableField
                  icon={<DirectionsCarIcon sx={iconMd} />}
                  label='Vehicle Number'
                  value={row.vehicleNumber ?? ''}
                  accent='#1d4ed8'
                  editing={!!ef}
                  editValue={ef?.vehicleNumber}
                  onEditChange={setField('vehicleNumber')}
                />
              </Box>
            </Box>
          </Box>

          {/* ── Vehicle Documents ── */}
          <Box className={classes.descriptionCard}>
            <Box className={classes.descriptionCardHeader}>
              <Typography className={classes.descriptionSectionTitle}>
                <FolderOpenIcon sx={{ fontSize: '0.85rem', mr: 0.5, verticalAlign: 'middle' }} />
                Vehicle Documents
              </Typography>
            </Box>
            <Box className={classes.descriptionCardBody}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1.5,
                }}
              >
                <EditableField
                  icon={<AssignmentIcon sx={iconSm} />}
                  label='RC Number'
                  value={row.rcNumber ?? ''}
                  accent='#2e7d32'
                  editing={!!ef}
                  editValue={ef?.rcNumber}
                  onEditChange={setField('rcNumber')}
                />
                <EditableField
                  icon={<AssignmentIcon sx={iconSm} />}
                  label='RC Expiry'
                  value={fmtDate(row.rcExpiry)}
                  accent='#2e7d32'
                  editing={!!ef}
                  editValue={ef?.rcExpiry}
                  onEditChange={setField('rcExpiry')}
                  type='date'
                />
                <EditableField
                  icon={<SecurityIcon sx={iconSm} />}
                  label='Insurance No.'
                  value={row.insuranceNumber ?? ''}
                  accent='#0891b2'
                  editing={!!ef}
                  editValue={ef?.insuranceNumber}
                  onEditChange={setField('insuranceNumber')}
                />
                <EditableField
                  icon={<SecurityIcon sx={iconSm} />}
                  label='Insurance Expiry'
                  value={fmtDate(row.insuranceExpiry)}
                  accent='#0891b2'
                  editing={!!ef}
                  editValue={ef?.insuranceExpiry}
                  onEditChange={setField('insuranceExpiry')}
                  type='date'
                />
                <EditableField
                  icon={<AirIcon sx={iconSm} />}
                  label='PUC Number'
                  value={row.pucNumber ?? ''}
                  accent='#16a34a'
                  editing={!!ef}
                  editValue={ef?.pucNumber}
                  onEditChange={setField('pucNumber')}
                />
                <EditableField
                  icon={<AirIcon sx={iconSm} />}
                  label='PUC Expiry'
                  value={fmtDate(row.pucExpiry)}
                  accent='#16a34a'
                  editing={!!ef}
                  editValue={ef?.pucExpiry}
                  onEditChange={setField('pucExpiry')}
                  type='date'
                />
                <EditableField
                  icon={<HealthAndSafetyIcon sx={iconSm} />}
                  label='Fitness No.'
                  value={row.fitnessNumber ?? ''}
                  accent='#7c3aed'
                  editing={!!ef}
                  editValue={ef?.fitnessNumber}
                  onEditChange={setField('fitnessNumber')}
                />
                <EditableField
                  icon={<HealthAndSafetyIcon sx={iconSm} />}
                  label='Fitness Expiry'
                  value={fmtDate(row.fitnessExpiry)}
                  accent='#7c3aed'
                  editing={!!ef}
                  editValue={ef?.fitnessExpiry}
                  onEditChange={setField('fitnessExpiry')}
                  type='date'
                />
                <EditableField
                  icon={<AssignmentTurnedInIcon sx={iconSm} />}
                  label='Permit No.'
                  value={row.permitNumber ?? ''}
                  accent='#d97706'
                  editing={!!ef}
                  editValue={ef?.permitNumber}
                  onEditChange={setField('permitNumber')}
                />
                <EditableField
                  icon={<AssignmentTurnedInIcon sx={iconSm} />}
                  label='Permit Expiry'
                  value={fmtDate(row.permitExpiry)}
                  accent='#d97706'
                  editing={!!ef}
                  editValue={ef?.permitExpiry}
                  onEditChange={setField('permitExpiry')}
                  type='date'
                />
              </Box>
            </Box>
          </Box>

          {/* ── Personal Documents ── */}
          <Box className={classes.descriptionCard}>
            <Box className={classes.descriptionCardHeader}>
              <Typography className={classes.descriptionSectionTitle}>
                <ContactPageIcon sx={{ fontSize: '0.85rem', mr: 0.5, verticalAlign: 'middle' }} />
                Personal Documents
              </Typography>
            </Box>
            <Box className={classes.descriptionCardBody}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1.5,
                }}
              >
                <EditableField
                  icon={<DriveEtaIcon sx={iconMd} />}
                  label='DL Number'
                  value={row.dlNumber ?? ''}
                  accent='#e65100'
                  editing={!!ef}
                  editValue={ef?.dlNumber}
                  onEditChange={setField('dlNumber')}
                />
                <EditableField
                  icon={<DriveEtaIcon sx={iconSm} />}
                  label='DL Expiry'
                  value={fmtDate(row.dlExpiry)}
                  accent='#e65100'
                  editing={!!ef}
                  editValue={ef?.dlExpiry}
                  onEditChange={setField('dlExpiry')}
                  type='date'
                />
                <EditableField
                  icon={<FingerprintIcon sx={iconSm} />}
                  label='ID Proof Type'
                  value={row.idProofType?.toUpperCase() ?? ''}
                  accent='#6366f1'
                  editing={!!ef}
                  editValue={ef?.idProofType}
                  onEditChange={setField('idProofType')}
                />
                <EditableField
                  icon={<ContactPageIcon sx={iconSm} />}
                  label='ID Number'
                  value={row.idProofNumber ?? ''}
                  accent='#6366f1'
                  editing={!!ef}
                  editValue={ef?.idProofNumber}
                  onEditChange={setField('idProofNumber')}
                />
              </Box>
            </Box>
          </Box>

          {/* ── Bundle Options ── */}
          <Box className={classes.descriptionCard}>
            <Box className={classes.descriptionCardHeader}>
              <Typography className={classes.descriptionSectionTitle}>
                <LocalOfferIcon sx={{ fontSize: '0.85rem', mr: 0.5, verticalAlign: 'middle' }} />
                Bundle Options
              </Typography>
            </Box>
            <Box className={classes.descriptionCardBody}>
              {ef ? (
                // Edit mode: toggle bundle cards
                <Box>
                  <Typography
                    sx={{ fontSize: '0.72rem', color: '#64748b', mb: 1.5, fontWeight: 600 }}
                  >
                    Select bundles for {isMobility ? 'Mobility' : 'Logistics'} service
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    {availableBundles.map((bt) => {
                      const selected = ef.bundleTypes.includes(bt);
                      return (
                        <Box
                          key={bt}
                          onClick={() => toggleBundle(bt)}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                            p: '12px 14px',
                            borderRadius: '14px',
                            cursor: 'pointer',
                            background: selected
                              ? 'linear-gradient(135deg,#fffbeb,#fef3c7)'
                              : '#f8faff',
                            border: selected
                              ? '2px solid #f59e0b'
                              : '1.5px solid rgba(226,232,255,0.9)',
                            boxShadow: selected ? '0 4px 16px rgba(245,158,11,0.18)' : 'none',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              border: `2px solid ${selected ? '#f59e0b' : '#a5b4fc'}`,
                              background: selected
                                ? 'linear-gradient(135deg,#fffbeb,#fef3c7)'
                                : '#eef2ff',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '10px',
                              background: selected ? '#f59e0b18' : '#6366f118',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              mt: 0.25,
                            }}
                          >
                            <LocalOfferIcon
                              sx={{ fontSize: '1.1rem', color: selected ? '#f59e0b' : '#6366f1' }}
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 0.25,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: '0.82rem',
                                  fontWeight: 700,
                                  color: selected ? '#92400e' : '#1e293b',
                                }}
                              >
                                {BUNDLE_LABELS[bt]}
                              </Typography>
                              {BUNDLE_DISCOUNT_MAP[bt] > 0 && (
                                <Box
                                  sx={{
                                    px: 0.75,
                                    py: 0.2,
                                    borderRadius: '8px',
                                    background: selected ? '#f59e0b' : '#6366f120',
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: '0.65rem',
                                      fontWeight: 800,
                                      color: selected ? '#fff' : '#6366f1',
                                    }}
                                  >
                                    {BUNDLE_DISCOUNT_MAP[bt]}% off
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                            <Typography
                              sx={{
                                fontSize: '0.7rem',
                                color: selected ? '#b45309' : '#64748b',
                                lineHeight: 1.4,
                              }}
                            >
                              {BUNDLE_DESC[bt]}
                            </Typography>
                          </Box>
                          <Checkbox
                            checked={selected}
                            onChange={() => toggleBundle(bt)}
                            size='small'
                            sx={{
                              p: 0,
                              color: '#6366f1',
                              '&.Mui-checked': { color: '#f59e0b' },
                              flexShrink: 0,
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                  {/* Bundle sub-fields */}
                  {ef.bundleTypes.includes('driver_hire') && (
                    <Box sx={{ mb: 2 }}>
                      <SectionDivider label='Driver Hire Details' isEditing />
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                          gap: 1.5,
                        }}
                      >
                        <EditableField
                          icon={<PersonIcon sx={iconSm} />}
                          label='Driver Count'
                          value={
                            row.driverHireCount !== undefined && row.driverHireCount !== null
                              ? String(row.driverHireCount)
                              : ''
                          }
                          accent='#f59e0b'
                          editing
                          editValue={ef.driverHireCount}
                          onEditChange={setField('driverHireCount')}
                        />
                        <EditableField
                          icon={<AccessTimeIcon sx={iconSm} />}
                          label='Shift'
                          value={row.driverHireShift ?? ''}
                          accent='#f59e0b'
                          editing
                          editValue={ef.driverHireShift}
                          onEditChange={setField('driverHireShift')}
                        />
                        <EditableField
                          icon={<LocalOfferIcon sx={iconSm} />}
                          label='Budget'
                          value={row.driverHireBudget ?? ''}
                          accent='#f59e0b'
                          editing
                          editValue={ef.driverHireBudget}
                          onEditChange={setField('driverHireBudget')}
                        />
                      </Box>
                    </Box>
                  )}
                  {ef.bundleTypes.includes('rental') && (
                    <Box sx={{ mb: 2 }}>
                      <SectionDivider label='Rental Details' isEditing />
                      <EditableField
                        icon={<CalendarTodayIcon sx={iconSm} />}
                        label='Rental Duration'
                        value={row.rentalDuration ?? ''}
                        accent='#f59e0b'
                        editing
                        editValue={ef.rentalDuration}
                        onEditChange={setField('rentalDuration')}
                      />
                    </Box>
                  )}
                  <SectionDivider label='Discount' isEditing />
                  <EditableField
                    icon={<LocalOfferIcon sx={iconSm} />}
                    label='Bundle Discount (%)'
                    value={
                      row.bundleDiscount !== undefined && row.bundleDiscount !== null
                        ? `${row.bundleDiscount}%`
                        : ''
                    }
                    accent='#f59e0b'
                    editing
                    editValue={ef.bundleDiscount}
                    onEditChange={setField('bundleDiscount')}
                  />
                </Box>
              ) : bundleTypes.length > 0 ? (
                // View mode: show selected bundles
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 1,
                  }}
                >
                  {bundleTypes.map((bt, i) => (
                    <FieldCard
                      key={i}
                      icon={<LocalOfferIcon sx={iconSm} />}
                      label={`Bundle ${i + 1}`}
                      value={BUNDLE_LABELS[bt] ?? bt.replace(/_/g, ' ')}
                      accent='#f59e0b'
                    />
                  ))}
                  {row.bundleDiscount !== null && row.bundleDiscount !== undefined && (
                    <FieldCard
                      icon={<LocalOfferIcon sx={iconSm} />}
                      label='Discount'
                      value={`${row.bundleDiscount}%`}
                      accent='#f59e0b'
                    />
                  )}
                  {row.rentalDuration && (
                    <FieldCard
                      icon={<FolderOpenIcon sx={iconSm} />}
                      label='Rental Duration'
                      value={row.rentalDuration}
                      accent='#f59e0b'
                    />
                  )}
                  {row.driverHireCount !== null && row.driverHireCount !== undefined && (
                    <FieldCard
                      icon={<FolderOpenIcon sx={iconSm} />}
                      label='Driver Count'
                      value={String(row.driverHireCount)}
                      accent='#f59e0b'
                    />
                  )}
                  {row.driverHireShift && (
                    <FieldCard
                      icon={<FolderOpenIcon sx={iconSm} />}
                      label='Driver Shift'
                      value={row.driverHireShift}
                      accent='#f59e0b'
                    />
                  )}
                </Box>
              ) : (
                <Typography sx={{ fontSize: '0.825rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  No bundle options selected.
                </Typography>
              )}
            </Box>
          </Box>

          {/* ── Attached Documents ── */}
          {(docItems.length > 0 || isEditing) && (
            <Box className={classes.descriptionCard}>
              <Box className={classes.descriptionCardHeader}>
                <Typography className={classes.descriptionSectionTitle}>
                  <AttachFileIcon sx={{ fontSize: '0.85rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Attached Documents
                  <Box
                    component='span'
                    sx={{
                      ml: 1,
                      px: 1,
                      py: 0.2,
                      borderRadius: '20px',
                      background: 'rgba(46,125,50,0.12)',
                      border: '1px solid rgba(46,125,50,0.25)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: '#2e7d32',
                      verticalAlign: 'middle',
                    }}
                  >
                    {docItems.length + newDocFiles.length} doc
                    {docItems.length + newDocFiles.length !== 1 ? 's' : ''}
                  </Box>
                </Typography>
              </Box>
              <Box className={classes.descriptionCardBody}>
                {/* Existing doc cards grid */}
                {docItems.length > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: 'repeat(2,1fr)',
                        sm: 'repeat(3,1fr)',
                        md: 'repeat(4,1fr)',
                      },
                      gap: 1.5,
                      mb: newDocFiles.length > 0 || isEditing ? 2 : 0,
                    }}
                  >
                    {docItems.map(({ key }) => {
                      const meta = DOC_META[key] ?? {
                        label: key,
                        icon: <DescriptionIcon />,
                        color: '#64748b',
                      };
                      const numKey = meta.numberKey as keyof CustomerApprovalRow | undefined;
                      const expKey = meta.expiryKey as keyof CustomerApprovalRow | undefined;
                      return (
                        <Box
                          key={key}
                          onClick={() => {
                            setDocDialogItem({
                              key,
                              label: meta.label,
                              color: meta.color,
                              icon: meta.icon,
                            });
                            setDocDialogOpen(true);
                          }}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: '16px 10px 12px',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            background: `linear-gradient(145deg,${meta.color}0e 0%,${meta.color}1a 100%)`,
                            border: `1.5px solid ${meta.color}30`,
                            transition: 'all 0.22s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: `0 12px 28px ${meta.color}28`,
                              border: `1.5px solid ${meta.color}55`,
                              background: `linear-gradient(145deg,${meta.color}18 0%,${meta.color}28 100%)`,
                            },
                          }}
                        >
                          {/* Zoom hint */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              opacity: 0,
                              transition: 'opacity 0.2s',
                              '.parent:hover &': { opacity: 1 },
                            }}
                          >
                            <ZoomInIcon sx={{ fontSize: '0.85rem', color: meta.color }} />
                          </Box>
                          {/* Icon area */}
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: '16px',
                              background: `linear-gradient(135deg,${meta.color}22,${meta.color}40)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 1.25,
                              boxShadow: `0 4px 14px ${meta.color}30`,
                              color: meta.color,
                              '& svg': { fontSize: '1.7rem' },
                            }}
                          >
                            {meta.icon}
                          </Box>
                          {/* Label */}
                          <Typography
                            sx={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: meta.color,
                              textAlign: 'center',
                              lineHeight: 1.3,
                              mb: 0.5,
                            }}
                          >
                            {meta.label}
                          </Typography>
                          {/* Number / expiry sub-text */}
                          {numKey && row[numKey] && (
                            <Typography
                              sx={{
                                fontSize: '0.63rem',
                                color: '#64748b',
                                textAlign: 'center',
                                lineHeight: 1.2,
                              }}
                            >
                              {String(row[numKey])}
                            </Typography>
                          )}
                          {expKey && row[expKey] && (
                            <Typography
                              sx={{ fontSize: '0.6rem', color: '#94a3b8', textAlign: 'center' }}
                            >
                              Exp: {fmtDate(String(row[expKey]))}
                            </Typography>
                          )}
                          {/* Verified badge */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mt: 0.75 }}>
                            <CheckCircleOutlineIcon
                              sx={{ fontSize: '0.7rem', color: meta.color }}
                            />
                            <Typography
                              sx={{ fontSize: '0.6rem', fontWeight: 700, color: meta.color }}
                            >
                              Uploaded
                            </Typography>
                          </Box>
                          {/* OCR scan button — edit mode only */}
                          {ef && (
                            <Tooltip
                              title={`Scan ${meta.label} to auto-fill fields`}
                              placement='top'
                            >
                              <IconButton
                                size='small'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDocScan(key);
                                }}
                                disabled={ocrScanningKey !== null}
                                sx={{
                                  mt: 0.75,
                                  p: '4px 10px',
                                  borderRadius: '8px',
                                  background:
                                    ocrScanningKey === key ? `${meta.color}18` : `${meta.color}14`,
                                  border: `1px solid ${meta.color}30`,
                                  color: meta.color,
                                  fontSize: '0.58rem',
                                  fontWeight: 700,
                                  gap: 0.4,
                                  '&:hover': { background: `${meta.color}28` },
                                  '&:disabled': { opacity: 0.5 },
                                }}
                              >
                                {ocrScanningKey === key ? (
                                  <CircularProgress size={10} sx={{ color: meta.color }} />
                                ) : (
                                  <CameraAltIcon sx={{ fontSize: '0.85rem' }} />
                                )}
                                <Typography sx={{ fontSize: '0.58rem', fontWeight: 700 }}>
                                  {ocrScanningKey === key ? 'Scanning…' : 'Scan & Fill'}
                                </Typography>
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}

                {/* Newly uploaded doc previews (edit mode) */}
                {newDocFiles.length > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: 'repeat(2,1fr)',
                        sm: 'repeat(3,1fr)',
                        md: 'repeat(4,1fr)',
                      },
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    {newDocFiles.map((f, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          position: 'relative',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          border: '2px solid #f59e0b40',
                          background: '#fffbeb',
                          '&:hover .delete-btn': { opacity: 1 },
                        }}
                      >
                        {f.preview ? (
                          <Box
                            component='img'
                            src={f.preview}
                            sx={{
                              width: '100%',
                              height: 120,
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: 120,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#fef3c7',
                            }}
                          >
                            <PictureAsPdfIcon sx={{ fontSize: '2.5rem', color: '#f59e0b' }} />
                          </Box>
                        )}
                        <Box sx={{ p: 1 }}>
                          <Typography
                            sx={{
                              fontSize: '0.65rem',
                              color: '#92400e',
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {f.name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.58rem', color: '#b45309' }}>
                            New • {(f.file.size / 1024).toFixed(1)} KB
                          </Typography>
                        </Box>
                        <IconButton
                          className='delete-btn'
                          onClick={() => removeNewDoc(idx)}
                          size='small'
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            background: 'rgba(220,38,38,0.85)',
                            color: '#fff',
                            padding: '3px',
                            '&:hover': { background: '#dc2626' },
                          }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: '0.9rem' }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Drag & drop zone (edit mode only) */}
                {isEditing && (
                  <Box
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      mt: docItems.length > 0 ? 0 : 0,
                      p: '24px 20px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      border: `2px dashed ${isDragging ? '#f59e0b' : 'rgba(245,158,11,0.45)'}`,
                      background: isDragging
                        ? 'linear-gradient(135deg,#fef3c7,#fde68a)'
                        : 'linear-gradient(135deg,#fffbeb,#fef9ee)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      '&:hover': {
                        border: '2px dashed #f59e0b',
                        background: 'linear-gradient(135deg,#fef3c7,#fde68a)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '14px',
                        background: isDragging ? '#f59e0b' : 'rgba(245,158,11,0.18)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <CloudUploadIcon
                        sx={{ fontSize: '1.6rem', color: isDragging ? '#fff' : '#f59e0b' }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: isDragging ? '#92400e' : '#b45309',
                      }}
                    >
                      {isDragging ? 'Drop files here' : 'Drag & drop documents here'}
                    </Typography>
                    <Typography sx={{ fontSize: '0.68rem', color: '#b45309', opacity: 0.8 }}>
                      or click to browse • Images & PDFs up to 20 MB
                    </Typography>
                    <input
                      ref={fileInputRef}
                      type='file'
                      multiple
                      accept='image/*,application/pdf'
                      style={{ display: 'none' }}
                      onChange={handleFileInput}
                    />
                    {/* Hidden input for per-doc OCR scan */}
                    <input
                      ref={docScanInputRef}
                      type='file'
                      accept='image/*'
                      style={{ display: 'none' }}
                      onChange={handleDocScanFileSelect}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* ── Admin Notes (LAST) ── */}
          <Box className={classes.descriptionCard}>
            <Box className={classes.descriptionCardHeader}>
              <Typography className={classes.descriptionSectionTitle}>
                <EditIcon sx={{ fontSize: '0.85rem', mr: 0.5, verticalAlign: 'middle' }} />
                Admin Notes
              </Typography>
            </Box>
            <Box className={classes.descriptionCardBody}>
              {ef ? (
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  maxRows={8}
                  value={ef.adminNotes}
                  onChange={(e) => setField('adminNotes')(e.target.value)}
                  placeholder='Add admin notes…'
                  className={classes.descriptionTextField}
                  size='small'
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg,#fffbeb,#fef9ee)',
                      border: '1.5px solid rgba(245,158,11,0.45)',
                    },
                  }}
                />
              ) : (
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    color: row.adminNotes ? '#475569' : '#94a3b8',
                    lineHeight: 1.7,
                    fontStyle: row.adminNotes ? 'normal' : 'italic',
                  }}
                >
                  {row.adminNotes || 'No admin notes yet.'}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Document fullscreen dialog ── */}
      <Dialog
        open={docDialogOpen}
        onClose={() => setDocDialogOpen(false)}
        maxWidth='sm'
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              overflow: 'hidden',
              background: docDialogItem
                ? `linear-gradient(145deg,${docDialogItem.color}0e,${docDialogItem.color}18)`
                : '#fff',
              border: docDialogItem ? `1.5px solid ${docDialogItem.color}30` : 'none',
            },
          },
        }}
      >
        {docDialogItem &&
          (() => {
            const meta = docDialogItem;
            const docEntry = DOC_META[meta.key];
            const numKey = docEntry?.numberKey as keyof CustomerApprovalRow | undefined;
            const expKey = docEntry?.expiryKey as keyof CustomerApprovalRow | undefined;
            return (
              <>
                <DialogTitle
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    pb: 1,
                    background: `linear-gradient(135deg,${meta.color}18,${meta.color}28)`,
                    borderBottom: `1px solid ${meta.color}25`,
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '12px',
                      background: `linear-gradient(135deg,${meta.color}30,${meta.color}50)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: meta.color,
                      '& svg': { fontSize: '1.4rem' },
                    }}
                  >
                    {meta.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: meta.color }}>
                      {meta.label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>
                      Document Details
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => setDocDialogOpen(false)}
                    size='small'
                    sx={{ color: '#64748b' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                  {/* Large icon display */}
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}
                  >
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '24px',
                        background: `linear-gradient(135deg,${meta.color}22,${meta.color}44)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 12px 32px ${meta.color}30`,
                        color: meta.color,
                        mb: 2,
                        '& svg': { fontSize: '3rem' },
                      }}
                    >
                      {meta.icon}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        background: `${meta.color}18`,
                        border: `1px solid ${meta.color}35`,
                      }}
                    >
                      <CheckCircleOutlineIcon sx={{ fontSize: '0.85rem', color: meta.color }} />
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: meta.color }}>
                        Document Verified &amp; Uploaded
                      </Typography>
                    </Box>
                  </Box>
                  {/* Metadata */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={cardSx(meta.color)}>
                      <Box sx={pillSx(meta.color)}>{meta.icon}</Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={fieldLabelSx(meta.color)}>Document Type</Typography>
                        <Typography sx={fieldValueSx(true)}>{meta.label}</Typography>
                      </Box>
                    </Box>
                    {numKey && row[numKey] && (
                      <Box sx={cardSx(meta.color)}>
                        <Box sx={pillSx(meta.color)}>
                          <BadgeIcon sx={{ fontSize: '1rem' }} />
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography sx={fieldLabelSx(meta.color)}>Document Number</Typography>
                          <Typography sx={fieldValueSx(true)}>{String(row[numKey])}</Typography>
                        </Box>
                      </Box>
                    )}
                    {expKey && row[expKey] && (
                      <Box sx={cardSx(meta.color)}>
                        <Box sx={pillSx(meta.color)}>
                          <CalendarTodayIcon sx={{ fontSize: '1rem' }} />
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography sx={fieldLabelSx(meta.color)}>Expiry Date</Typography>
                          <Typography sx={fieldValueSx(true)}>
                            {fmtDate(String(row[expKey]))}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </DialogContent>
              </>
            );
          })()}
      </Dialog>

      {/* ── Other Dialogs ── */}
      <ActionDialog
        actionTarget={actionTarget}
        actionNotes={actionNotes}
        actionInProgress={actionInProgress}
        onClose={handleCloseAction}
        onNotesChange={setActionNotes}
        onConfirm={handleConfirmAction}
      />

      <ChangesLogDialog
        open={changesLogOpen}
        onClose={() => setChangesLogOpen(false)}
        selectedRow={rowAsUserRow}
        selectedOnboarding={rowAsOnboarding}
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
        onLogSort={handleLogSort}
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
        selectedRow={rowAsUserRow}
        selectedOnboarding={rowAsOnboarding}
      />

      <ResetPasswordDialog
        open={resetPwOpen}
        onClose={() => setResetPwOpen(false)}
        selectedRow={rowAsUserRow}
        selectedOnboarding={rowAsOnboarding}
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
    </Box>
  );
};

export default CustomerDetail;
