import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { Chip } from '@mui/material';
import { useAuthActionMutation } from '@bandi/services';
import { useAuth, useNotification, useMediaQuery } from '@bandi/hooks';
import { IAuthUser } from '@bandi/interfaces';
import {
  UserRow,
  EditFormShape,
  ChangeProfileErrors,
  ResetPwErrors,
  ChangeLogEntry,
  CustomerOnboardingRow,
  EditOnboardingFormShape,
} from '../types/userManagement.types';
import { DriverHireRow } from '../../DriverHire/types/driverHire.types';
import { VehicleRentalRow } from '../../VehicleRental/types/vehicleRental.types';
import { ParcelRow } from '../../Parcel/types/parcel.types';
import {
  buildEditForm,
  generateTempPassword,
  fmtDateTime,
  fmtDateUser,
} from '../utils/userManagement.utils';
import { Column } from '@bandi/component';

const useUserManagement = () => {
  const [authAction] = useAuthActionMutation();
  const { user: currentUser } = useAuth();
  const notify = useNotification();
  const isMobile = useMediaQuery('(max-width: 599px)');

  // ── Table state ───────────────────────────────────────────────────────────────
  const [customerOnboardings, setCustomerOnboardings] = useState<CustomerOnboardingRow[]>([]);
  const [driverHireRequests, setDriverHireRequests] = useState<DriverHireRow[]>([]);
  const [vehicleRentalRequests, setVehicleRentalRequests] = useState<VehicleRentalRow[]>([]);
  const [parcelRequests, setParcelRequests] = useState<ParcelRow[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tableSearch, setTableSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState<UserRow | null>(null);
  const [selectedOnboarding, setSelectedOnboarding] = useState<CustomerOnboardingRow | null>(null);

  // ── Edit Onboarding dialog ─────────────────────────────────────────────────
  const [editOnboardingOpen, setEditOnboardingOpen] = useState(false);
  const [editOnboardingForm, setEditOnboardingForm] = useState<EditOnboardingFormShape>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    area: '',
    pincode: '',
    serviceCategory: '',
    vehicleType: '',
    vehicleSubType: '',
    fuelType: '',
    tripPreference: '',
    vehicleNumber: '',
    rcNumber: '',
    rcExpiry: '',
    dlNumber: '',
    dlExpiry: '',
    insuranceNumber: '',
    insuranceExpiry: '',
    pucNumber: '',
    pucExpiry: '',
    fitnessNumber: '',
    fitnessExpiry: '',
    permitNumber: '',
    permitExpiry: '',
    idProofType: '',
    idProofNumber: '',
    bundleTypes: '',
    bundleDiscount: '',
    rentalVehiclePref: '',
    rentalDuration: '',
    rentalPickupZone: '',
    driverHireCount: '',
    driverHireShift: '',
    driverHireBudget: '',
    additionalVehicles: '',
    parcelComboTypes: '',
    parcelMaxWeight: '',
    parcelRadiusPref: '',
    cargoCoRideMax: '',
    cargoCoRideHaulPref: '',
    cargoCoRideRatePref: '',
    accessFromDate: '',
    accessToDate: '',
    status: '',
    adminNotes: '',
  });
  const [editOnboardingOriginal, setEditOnboardingOriginal] =
    useState<EditOnboardingFormShape>(editOnboardingForm);
  const [isSavingOnboarding, setIsSavingOnboarding] = useState(false);
  const isOnboardingDirty =
    editOnboardingOpen &&
    JSON.stringify(editOnboardingForm) !== JSON.stringify(editOnboardingOriginal);

  // ── Edit dialog (for future user tabs if needed) ──────────────────────────────
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditFormShape>(buildEditForm({} as IAuthUser));
  const [editOriginal, setEditOriginal] = useState<EditFormShape>(buildEditForm({} as IAuthUser));
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const isDirty = editOpen && JSON.stringify(editForm) !== JSON.stringify(editOriginal);

  // ── Create dialog ─────────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);

  // ── Changes log dialog ────────────────────────────────────────────────────────
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

  // ── Login data dialog ─────────────────────────────────────────────────────────
  const [loginDataOpen, setLoginDataOpen] = useState(false);

  // ── Change profile (role / status) dialog ────────────────────────────────────
  const [changeProfileOpen, setChangeProfileOpen] = useState(false);
  const [changeProfileMode, setChangeProfileMode] = useState<'role' | 'status'>('role');
  const [changeProfileRole, setChangeProfileRole] = useState('');
  const [changeProfileReasonCode, setChangeProfileReasonCode] = useState('');
  const [changeProfileNoteText, setChangeProfileNoteText] = useState('');
  const [changeProfileAttachment, setChangeProfileAttachment] = useState<File | null>(null);
  const [changeProfileErrors, setChangeProfileErrors] = useState<ChangeProfileErrors>({});
  const [changeProfileConfirmOpen, setChangeProfileConfirmOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const changeProfileNoteRef = useRef<HTMLTextAreaElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  // ── Reset password dialog ─────────────────────────────────────────────────────
  const [resetPwOpen, setResetPwOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [isResettingPw, setIsResettingPw] = useState(false);
  const [resetPwMode, setResetPwMode] = useState<'auto' | 'manual'>('auto');
  const [autoResetPw, setAutoResetPw] = useState('');
  const [showAutoResetPw, setShowAutoResetPw] = useState(false);
  const [showManualPw, setShowManualPw] = useState(false);
  const [showManualPwConfirm, setShowManualPwConfirm] = useState(false);
  const [resetPwForceChange, setResetPwForceChange] = useState(true);
  const [resetPwReason, setResetPwReason] = useState('');
  const [resetPwErrors, setResetPwErrors] = useState<ResetPwErrors>({});

  // ── Fetch ─────────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const [onboardingsResult, driverHireResult, vehicleRentalResult, parcelResult] =
        await Promise.all([
          authAction({ action: 'get-customer-onboardings' })
            .unwrap()
            .catch(() => ({ data: [] })),
          authAction({ action: 'get-driver-hire-requests' })
            .unwrap()
            .catch(() => ({ data: [] })),
          authAction({ action: 'get-vehicle-rental-requests' })
            .unwrap()
            .catch(() => ({ data: [] })),
          authAction({ action: 'get-parcel-requests' })
            .unwrap()
            .catch(() => ({ data: [] })),
        ]);
      setCustomerOnboardings(
        ((onboardingsResult.data || []) as CustomerOnboardingRow[]).map((r, i) => ({
          ...r,
          sno: i + 1,
        })),
      );
      setDriverHireRequests(driverHireResult.data || []);
      setVehicleRentalRequests(vehicleRentalResult.data || []);
      setParcelRequests(parcelResult.data || []);
    } catch {
      notify.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authAction]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOnboardingRowClick = (row: CustomerOnboardingRow) => {
    const isDeselecting = selectedOnboarding?.id === row.id;
    setSelectedOnboarding(isDeselecting ? null : row);
    if (isDeselecting) {
      setSelectedRow(null);
    } else {
      setSelectedRow({
        id: row.id,
        name: `${row.firstName} ${row.lastName}`.trim(),
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email || '',
        phone: row.phone || '',
        role: 'user',
        status: row.status,
        isActive: row.status === 'approved',
        sno: row.sno,
      } as unknown as UserRow);
    }
  };

  const handleOpenEditOnboarding = () => {
    if (!selectedOnboarding) return;
    const form: EditOnboardingFormShape = {
      firstName: selectedOnboarding.firstName || '',
      lastName: selectedOnboarding.lastName || '',
      phone: selectedOnboarding.phone || '',
      email: selectedOnboarding.email || '',
      city: selectedOnboarding.city || '',
      area: selectedOnboarding.area || '',
      pincode: selectedOnboarding.pincode || '',
      serviceCategory: selectedOnboarding.serviceCategory || '',
      vehicleType: selectedOnboarding.vehicleType || '',
      vehicleSubType: selectedOnboarding.vehicleSubType || '',
      fuelType: selectedOnboarding.fuelType || '',
      tripPreference: selectedOnboarding.tripPreference || '',
      vehicleNumber: selectedOnboarding.vehicleNumber || '',
      rcNumber: selectedOnboarding.rcNumber || '',
      rcExpiry: selectedOnboarding.rcExpiry || '',
      dlNumber: selectedOnboarding.dlNumber || '',
      dlExpiry: selectedOnboarding.dlExpiry || '',
      insuranceNumber: selectedOnboarding.insuranceNumber || '',
      insuranceExpiry: selectedOnboarding.insuranceExpiry || '',
      pucNumber: selectedOnboarding.pucNumber || '',
      pucExpiry: selectedOnboarding.pucExpiry || '',
      fitnessNumber: selectedOnboarding.fitnessNumber || '',
      fitnessExpiry: selectedOnboarding.fitnessExpiry || '',
      permitNumber: selectedOnboarding.permitNumber || '',
      permitExpiry: selectedOnboarding.permitExpiry || '',
      idProofType: selectedOnboarding.idProofType || '',
      idProofNumber: selectedOnboarding.idProofNumber || '',
      bundleTypes: selectedOnboarding.bundleTypes || '',
      bundleDiscount:
        selectedOnboarding.bundleDiscount !== null &&
        selectedOnboarding.bundleDiscount !== undefined
          ? String(selectedOnboarding.bundleDiscount)
          : '',
      rentalVehiclePref: selectedOnboarding.rentalVehiclePref || '',
      rentalDuration: selectedOnboarding.rentalDuration || '',
      rentalPickupZone: selectedOnboarding.rentalPickupZone || '',
      driverHireCount:
        selectedOnboarding.driverHireCount !== null &&
        selectedOnboarding.driverHireCount !== undefined
          ? String(selectedOnboarding.driverHireCount)
          : '',
      driverHireShift: selectedOnboarding.driverHireShift || '',
      driverHireBudget: selectedOnboarding.driverHireBudget || '',
      additionalVehicles: selectedOnboarding.additionalVehicles || '',
      parcelComboTypes: selectedOnboarding.parcelComboTypes || '',
      parcelMaxWeight: selectedOnboarding.parcelMaxWeight || '',
      parcelRadiusPref: selectedOnboarding.parcelRadiusPref || '',
      cargoCoRideMax:
        selectedOnboarding.cargoCoRideMax !== null &&
        selectedOnboarding.cargoCoRideMax !== undefined
          ? String(selectedOnboarding.cargoCoRideMax)
          : '',
      cargoCoRideHaulPref: selectedOnboarding.cargoCoRideHaulPref || '',
      cargoCoRideRatePref: selectedOnboarding.cargoCoRideRatePref || '',
      accessFromDate: selectedOnboarding.accessFromDate || '',
      accessToDate: selectedOnboarding.accessToDate || '',
      status: selectedOnboarding.status || '',
      adminNotes: selectedOnboarding.adminNotes || '',
    };
    setEditOnboardingForm(form);
    setEditOnboardingOriginal(form);
    setEditOnboardingOpen(true);
  };

  const handleSaveEditOnboarding = async () => {
    if (!selectedOnboarding) return;
    setIsSavingOnboarding(true);
    try {
      await authAction({
        action: 'update-customer-onboarding',
        id: selectedOnboarding.id,
        data: {
          ...editOnboardingForm,
          accessFromDate: editOnboardingForm.accessFromDate
            ? new Date(editOnboardingForm.accessFromDate).toISOString()
            : null,
          accessToDate: editOnboardingForm.accessToDate
            ? new Date(editOnboardingForm.accessToDate).toISOString()
            : null,
          rcExpiry: editOnboardingForm.rcExpiry || null,
          dlExpiry: editOnboardingForm.dlExpiry || null,
          insuranceExpiry: editOnboardingForm.insuranceExpiry || null,
          pucExpiry: editOnboardingForm.pucExpiry || null,
        },
      }).unwrap();
      notify.success('Onboarding updated successfully');
      setEditOnboardingOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      notify.error(
        (err as { data?: { message?: string } })?.data?.message || 'Failed to update onboarding',
      );
    } finally {
      setIsSavingOnboarding(false);
    }
  };

  // ── Edit (user) ───────────────────────────────────────────────────────────────
  const handleOpenEdit = () => {
    if (!selectedRow) return;
    const form = buildEditForm(selectedRow);
    setEditForm(form);
    setEditOriginal(form);
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedRow) return;
    setIsSavingEdit(true);
    try {
      await authAction({
        action: 'update-user',
        userId: selectedRow.id,
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
      setEditOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      notify.error(
        (err as { data?: { message?: string } })?.data?.message || 'Failed to update user',
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  // ── Create ────────────────────────────────────────────────────────────────────
  const handleOpenNew = () => setCreateOpen(true);

  const handleCreateSubmit = async (data: Record<string, unknown>) => {
    try {
      await authAction({ action: 'create-customer-onboarding', data }).unwrap();
      notify.success('Customer onboarding submitted successfully.');
      setCreateOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      notify.error(
        (err as { data?: { message?: string } })?.data?.message || 'Failed to submit onboarding',
      );
    }
  };

  // ── Changes log ───────────────────────────────────────────────────────────────
  const handleOpenChangesLog = async () => {
    if (!selectedRow) return;
    setLogSearch('');
    setLogDateFrom('');
    setLogDateTo('');
    setLogFilterField('');
    setLogFilterReason('');
    setLogSortBy('createdAt');
    setLogSortOrder('desc');
    setLogPage(0);
    setLogRowsPerPage(25);
    setLogMaximized(false);
    setLogShowFilters(true);
    setChangesLogOpen(true);
    setIsLoadingLog(true);
    try {
      const result = await authAction({
        action: 'get-change-log',
        userId: selectedRow.id,
      }).unwrap();
      setChangeLog((result?.data as ChangeLogEntry[]) || []);
    } catch {
      setChangeLog([]);
    } finally {
      setIsLoadingLog(false);
    }
  };

  const uniqueLogFields = useMemo(
    () => [...new Set(changeLog.map((l) => l.fieldName).filter((v): v is string => !!v))].sort(),
    [changeLog],
  );

  const filteredLog = useMemo(() => {
    let logs = [...changeLog];
    if (logSearch) {
      const q = logSearch.toLowerCase();
      logs = logs.filter((l) =>
        [
          l.changeType,
          l.fieldName,
          l.previousValue,
          l.newValue,
          l.changedByName,
          l.reasonCode,
          l.reasonNotes,
        ].some((v) => v && String(v).toLowerCase().includes(q)),
      );
    }
    if (logDateFrom) {
      logs = logs.filter((l) => l.createdAt && new Date(l.createdAt) >= new Date(logDateFrom));
    }
    if (logDateTo) {
      logs = logs.filter(
        (l) => l.createdAt && new Date(l.createdAt) <= new Date(`${logDateTo}T23:59:59`),
      );
    }
    if (logFilterField) {
      logs = logs.filter((l) => l.fieldName === logFilterField);
    }
    if (logFilterReason) {
      logs = logs.filter((l) => l.reasonCode === logFilterReason);
    }
    logs.sort((a, b) => {
      const aVal = String(a[logSortBy as keyof ChangeLogEntry] ?? '');
      const bVal = String(b[logSortBy as keyof ChangeLogEntry] ?? '');
      if (aVal === bVal) return 0;
      return (logSortOrder === 'asc' ? 1 : -1) * (aVal < bVal ? -1 : 1);
    });
    return logs;
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

  const hasLogFilters = !!(
    logSearch ||
    logDateFrom ||
    logDateTo ||
    logFilterField ||
    logFilterReason
  );

  const handleLogSort = (col: string) => {
    if (logSortBy === col) {
      setLogSortOrder((p) => (p === 'asc' ? 'desc' : 'asc'));
    } else {
      setLogSortBy(col);
      setLogSortOrder('asc');
    }
    setLogPage(0);
  };

  const clearLogFilters = () => {
    setLogSearch('');
    setLogDateFrom('');
    setLogDateTo('');
    setLogFilterField('');
    setLogFilterReason('');
    setLogPage(0);
  };

  const handleExportCsv = () => {
    const headers = [
      'Date/Time',
      'Change Type',
      'Field Changed',
      'Previous Value',
      'New Value',
      'Changed By',
      'Reason Code',
      'Reason Note',
    ];
    const rows = filteredLog.map((log) => [
      fmtDateTime(log.createdAt),
      log.changeType || '-',
      log.fieldName || '-',
      log.previousValue || '-',
      log.newValue || '-',
      log.changedByName || '-',
      log.reasonCode || '-',
      (log.reasonNotes || '-').replace(/\n/g, ' '),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `changes-log-${(selectedRow?.name || 'user').replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Change profile ────────────────────────────────────────────────────────────
  const handleOpenChangeProfile = () => {
    if (!selectedRow) return;
    setChangeProfileMode(selectedOnboarding ? 'status' : 'role');
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
    if (!changeProfileRole) {
      errors.role = 'required';
    } else if (changeProfileMode === 'role' && changeProfileRole === selectedRow?.role) {
      errors.role = 'Must be different from current role';
    } else if (changeProfileMode === 'status' && changeProfileRole === selectedOnboarding?.status) {
      errors.role = 'Must be different from current status';
    }
    if (!changeProfileReasonCode) {
      errors.reasonCode = 'required';
    }
    if (!changeProfileNoteText.trim()) {
      errors.note = 'required';
    }
    if (Object.keys(errors).length > 0) {
      setChangeProfileErrors(errors);
      return;
    }
    setChangeProfileConfirmOpen(true);
  };

  const handleSaveChangeProfile = async () => {
    if (!selectedRow) return;
    setIsSavingProfile(true);
    try {
      if (changeProfileMode === 'status' && selectedOnboarding) {
        await authAction({
          action: 'update-customer-onboarding',
          id: selectedOnboarding.id,
          data: { status: changeProfileRole },
          reasonCode: changeProfileReasonCode,
          reasonNotes: changeProfileNoteText,
        }).unwrap();
        notify.success(`Status changed to ${changeProfileRole.replace(/_/g, ' ')}`);
      } else {
        await authAction({
          action: 'update-user',
          userId: selectedRow.id,
          data: { role: changeProfileRole },
          reasonCode: changeProfileReasonCode,
          reasonNotes: changeProfileNoteText,
        }).unwrap();
        notify.success(`Role changed to ${changeProfileRole}`);
      }
      setChangeProfileOpen(false);
      setChangeProfileConfirmOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      notify.error(
        (err as { data?: { message?: string } })?.data?.message ||
          (changeProfileMode === 'status' ? 'Failed to change status' : 'Failed to change role'),
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  // ── Reset password ────────────────────────────────────────────────────────────
  const handleOpenResetPw = () => {
    const pw = generateTempPassword();
    setResetPwMode('auto');
    setAutoResetPw(pw);
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
    if (!selectedRow) return;
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
        userId: selectedRow.id,
        newPassword: password,
        forceChange: resetPwForceChange,
        reason: resetPwReason,
      }).unwrap();
      notify.success(
        `Password reset successfully.${resetPwForceChange ? ' User must change it on next login.' : ''}`,
      );
      setResetPwOpen(false);
    } catch (err: unknown) {
      notify.error(
        (err as { data?: { message?: string } })?.data?.message || 'Failed to reset password',
      );
    } finally {
      setIsResettingPw(false);
    }
  };

  // ── Smart expiry colour helper ────────────────────────────────────────────────
  const expiryNode = (expiryStr: string | null, createdAt: string): React.ReactNode => {
    if (!expiryStr) return <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>;
    const now = Date.now();
    const expiry = new Date(expiryStr).getTime();
    const start = new Date(createdAt).getTime();
    const total = expiry - start;
    const remaining = expiry - now;

    let color = '#16a34a';
    if (remaining <= 0) {
      color = '#dc2626';
    } else if (remaining <= 6 * 3_600_000) {
      color = '#dc2626';
    } else if (total > 0 && (now - start) / total >= 0.5) {
      color = '#d97706';
    }

    const label = remaining <= 0 ? 'Expired' : fmtDateUser(expiryStr, undefined, undefined);
    return (
      <span
        style={{ color, fontWeight: remaining <= 6 * 3_600_000 ? 700 : 500, fontSize: '0.82rem' }}
      >
        {label}
      </span>
    );
  };

  // ── CustomerOnboarding columns ────────────────────────────────────────────────
  const columns: Column<CustomerOnboardingRow>[] = useMemo(
    () => [
      { id: 'sno', label: 'S.No', minWidth: 55, sortable: false },
      {
        id: 'firstName',
        label: 'Name',
        minWidth: 150,
        format: (_v: unknown, row: CustomerOnboardingRow): React.ReactNode => (
          <span style={{ fontWeight: 600 }}>
            {`${row.firstName} ${row.lastName}`.trim() || '—'}
          </span>
        ),
      },
      { id: 'phone', label: 'Phone', minWidth: 125, format: (v) => String(v || '—') },
      { id: 'email', label: 'Email', minWidth: 185, format: (v) => String(v || '—') },
      { id: 'city', label: 'City', minWidth: 100, format: (v) => String(v || '—') },
      {
        id: 'serviceCategory',
        label: 'Service',
        minWidth: 110,
        format: (v): React.ReactNode => {
          const s = String(v || '');
          return (
            <Chip
              label={s.charAt(0).toUpperCase() + s.slice(1)}
              color={s === 'mobility' ? 'primary' : 'secondary'}
              size='small'
              variant='outlined'
              sx={{ fontWeight: 700, fontSize: '0.68rem' }}
            />
          );
        },
      },
      {
        id: 'vehicleType',
        label: 'Veh. Type',
        minWidth: 110,
        format: (v) =>
          String(v || '—')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase()),
      },
      { id: 'vehicleNumber', label: 'Veh. No.', minWidth: 115, format: (v) => String(v || '—') },
      { id: 'rcNumber', label: 'RC No.', minWidth: 130, format: (v) => String(v || '—') },
      {
        id: 'rcExpiry' as keyof CustomerOnboardingRow,
        label: 'RC Expiry',
        minWidth: 130,
        format: (_v: unknown, row: CustomerOnboardingRow): React.ReactNode =>
          expiryNode(row.rcExpiry ?? null, row.createdAt),
      },
      { id: 'dlNumber', label: 'DL No.', minWidth: 130, format: (v) => String(v || '—') },
      {
        id: 'dlExpiry',
        label: 'DL Expiry',
        minWidth: 130,
        format: (_v: unknown, row: CustomerOnboardingRow): React.ReactNode =>
          expiryNode(row.dlExpiry, row.createdAt),
      },
      {
        id: 'insuranceNumber' as keyof CustomerOnboardingRow,
        label: 'Ins. No.',
        minWidth: 120,
        format: (v) => String(v || '—'),
      },
      {
        id: 'insuranceExpiry' as keyof CustomerOnboardingRow,
        label: 'Ins. Expiry',
        minWidth: 120,
        format: (_v: unknown, row: CustomerOnboardingRow): React.ReactNode =>
          expiryNode(row.insuranceExpiry ?? null, row.createdAt),
      },
      {
        id: 'idProofType',
        label: 'ID Type',
        minWidth: 90,
        format: (v): React.ReactNode => {
          const t = String(v || '').toLowerCase();
          if (!t) return <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>;
          return (
            <Chip
              label={t === 'aadhaar' ? 'Aadhaar' : t === 'pan' ? 'PAN' : t}
              color={t === 'aadhaar' ? 'info' : 'default'}
              size='small'
              variant='outlined'
              sx={{ fontSize: '0.68rem' }}
            />
          );
        },
      },
      { id: 'idProofNumber', label: 'ID No.', minWidth: 130, format: (v) => String(v || '—') },
      {
        id: 'accessFromDate' as keyof CustomerOnboardingRow,
        label: 'Access From',
        minWidth: 120,
        format: (v) =>
          v ? (
            fmtDateUser(v as string, undefined, undefined)
          ) : (
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>
          ),
      },
      {
        id: 'accessToDate' as keyof CustomerOnboardingRow,
        label: 'Access Until',
        minWidth: 130,
        format: (_v: unknown, row: CustomerOnboardingRow): React.ReactNode =>
          expiryNode(row.accessToDate ?? null, row.accessFromDate ?? row.createdAt),
      },
      {
        id: 'status',
        label: 'Status',
        minWidth: 130,
        format: (v): React.ReactNode => {
          const s = String(v || '');
          const colorMap: Record<string, 'warning' | 'success' | 'error' | 'default'> = {
            pending: 'warning',
            approved: 'success',
            rejected: 'error',
            under_review: 'default',
          };
          return (
            <Chip
              label={s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              color={colorMap[s] ?? 'default'}
              size='small'
              variant='outlined'
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          );
        },
      },
      {
        id: 'submittedAt',
        label: 'Submitted',
        minWidth: 115,
        format: (v) =>
          v ? (
            fmtDateUser(v as string, undefined, undefined)
          ) : (
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Pending</span>
          ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const driverHireColumns: Column<DriverHireRow>[] = [
    { id: 'sno', label: 'S.No', minWidth: 60, align: 'center', sortable: false },
    { id: 'name', label: 'Name', minWidth: 150, format: (v: unknown) => String(v || '-') },
    { id: 'email', label: 'Email', minWidth: 210, format: (v: unknown) => String(v || '-') },
    {
      id: 'vehicleType',
      label: 'Vehicle Type',
      minWidth: 140,
      format: (v: unknown) => String(v || '-'),
    },
    { id: 'location', label: 'Location', minWidth: 140, format: (v: unknown) => String(v || '-') },
    { id: 'duration', label: 'Duration', minWidth: 120, format: (v: unknown) => String(v || '-') },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      align: 'center',
      format: (v: unknown): React.ReactNode => {
        const s = String(v || '');
        const colorMap: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
          pending: 'warning',
          matched: 'info',
          completed: 'success',
          rejected: 'error',
        };
        return (
          <Chip
            label={s.charAt(0).toUpperCase() + s.slice(1)}
            color={colorMap[s] ?? 'default'}
            size='small'
          />
        );
      },
    },
  ];

  const vehicleRentalColumns: Column<VehicleRentalRow>[] = [
    { id: 'sno', label: 'S.No', minWidth: 60, align: 'center', sortable: false },
    { id: 'name', label: 'Name', minWidth: 150, format: (v: unknown) => String(v || '-') },
    { id: 'email', label: 'Email', minWidth: 210, format: (v: unknown) => String(v || '-') },
    {
      id: 'vehicleType',
      label: 'Vehicle Type',
      minWidth: 140,
      format: (v: unknown) => String(v || '-'),
    },
    { id: 'location', label: 'Location', minWidth: 140, format: (v: unknown) => String(v || '-') },
    { id: 'duration', label: 'Duration', minWidth: 120, format: (v: unknown) => String(v || '-') },
    {
      id: 'startDate',
      label: 'Start Date',
      minWidth: 130,
      format: (v: unknown) => String(v || '-'),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      align: 'center',
      format: (v: unknown): React.ReactNode => {
        const s = String(v || '');
        const colorMap: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
          pending: 'warning',
          active: 'info',
          completed: 'success',
          rejected: 'error',
        };
        return (
          <Chip
            label={s.charAt(0).toUpperCase() + s.slice(1)}
            color={colorMap[s] ?? 'default'}
            size='small'
          />
        );
      },
    },
  ];

  const parcelColumns: Column<ParcelRow>[] = [
    { id: 'sno', label: 'S.No', minWidth: 60, align: 'center', sortable: false },
    { id: 'name', label: 'Name', minWidth: 150, format: (v: unknown) => String(v || '-') },
    { id: 'email', label: 'Email', minWidth: 210, format: (v: unknown) => String(v || '-') },
    {
      id: 'pickupLocation',
      label: 'Pickup Location',
      minWidth: 160,
      format: (v: unknown) => String(v || '-'),
    },
    {
      id: 'dropLocation',
      label: 'Drop Location',
      minWidth: 160,
      format: (v: unknown) => String(v || '-'),
    },
    {
      id: 'parcelType',
      label: 'Parcel Type',
      minWidth: 130,
      format: (v: unknown) => String(v || '-'),
    },
    { id: 'weight', label: 'Weight', minWidth: 100, format: (v: unknown) => String(v || '-') },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      align: 'center',
      format: (v: unknown): React.ReactNode => {
        const s = String(v || '');
        const colorMap: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
          pending: 'warning',
          in_transit: 'info',
          delivered: 'success',
          rejected: 'error',
        };
        return (
          <Chip
            label={s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            color={colorMap[s] ?? 'default'}
            size='small'
          />
        );
      },
    },
  ];

  return {
    // table
    customerOnboardings,
    selectedOnboarding,
    setSelectedOnboarding,
    handleOnboardingRowClick,
    // edit onboarding
    editOnboardingOpen,
    setEditOnboardingOpen,
    editOnboardingForm,
    setEditOnboardingForm,
    isSavingOnboarding,
    isOnboardingDirty,
    handleOpenEditOnboarding,
    handleSaveEditOnboarding,
    driverHireRequests,
    vehicleRentalRequests,
    parcelRequests,
    isLoading,
    isMobile,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    selectedRow,
    setSelectedRow,
    columns,
    driverHireColumns,
    vehicleRentalColumns,
    parcelColumns,
    currentUser,
    // edit
    editOpen,
    setEditOpen,
    editForm,
    setEditForm,
    isSavingEdit,
    isDirty,
    handleOpenEdit,
    handleSaveEdit,
    // create
    createOpen,
    setCreateOpen,
    handleOpenNew,
    handleCreateSubmit,
    // changes log
    changesLogOpen,
    setChangesLogOpen,
    changeLog,
    isLoadingLog,
    logSearch,
    setLogSearch,
    logDateFrom,
    setLogDateFrom,
    logDateTo,
    setLogDateTo,
    logFilterField,
    setLogFilterField,
    logFilterReason,
    setLogFilterReason,
    logSortBy,
    logSortOrder,
    logPage,
    setLogPage,
    logRowsPerPage,
    setLogRowsPerPage,
    logMaximized,
    setLogMaximized,
    logShowFilters,
    setLogShowFilters,
    uniqueLogFields,
    filteredLog,
    paginatedLog,
    hasLogFilters,
    handleOpenChangesLog,
    handleLogSort,
    clearLogFilters,
    handleExportCsv,
    // login data
    loginDataOpen,
    setLoginDataOpen,
    // change profile
    changeProfileOpen,
    setChangeProfileOpen,
    changeProfileMode,
    changeProfileRole,
    setChangeProfileRole,
    changeProfileReasonCode,
    setChangeProfileReasonCode,
    changeProfileNoteText,
    setChangeProfileNoteText,
    changeProfileAttachment,
    setChangeProfileAttachment,
    changeProfileErrors,
    setChangeProfileErrors,
    changeProfileConfirmOpen,
    setChangeProfileConfirmOpen,
    isSavingProfile,
    changeProfileNoteRef,
    attachmentInputRef,
    handleOpenChangeProfile,
    handleChangeProfileSubmit,
    handleSaveChangeProfile,
    // reset password
    resetPwOpen,
    setResetPwOpen,
    newPassword,
    setNewPassword,
    newPasswordConfirm,
    setNewPasswordConfirm,
    isResettingPw,
    resetPwMode,
    setResetPwMode,
    autoResetPw,
    setAutoResetPw,
    showAutoResetPw,
    setShowAutoResetPw,
    showManualPw,
    setShowManualPw,
    showManualPwConfirm,
    setShowManualPwConfirm,
    resetPwForceChange,
    setResetPwForceChange,
    resetPwReason,
    setResetPwReason,
    resetPwErrors,
    setResetPwErrors,
    handleOpenResetPw,
    handleResetPassword,
  };
};

export default useUserManagement;
