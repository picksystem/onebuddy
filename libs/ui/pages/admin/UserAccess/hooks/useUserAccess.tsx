import React, { useEffect, useState, useCallback } from 'react';
import { Column } from '@bandi/component';
import { Chip, Typography, Button, Stack, Tooltip, Tab } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { useAuthActionMutation } from '@bandi/services';
import { useNotification } from '@bandi/hooks';
import {
  CustomerApprovalRow,
  ApprovalStatus,
  ApprovalAction,
} from '../../CustomerApprovals/hooks/useCustomerApprovals';

export type { CustomerApprovalRow, ApprovalStatus, ApprovalAction };

const STATUS_META: Record<ApprovalStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#d97706', bg: '#fef3c7' },
  under_review: { label: 'Under Review', color: '#2563eb', bg: '#dbeafe' },
  approved: { label: 'Approved', color: '#16a34a', bg: '#dcfce7' },
  rejected: { label: 'Rejected', color: '#dc2626', bg: '#fee2e2' },
};

const fmtDate = (v: unknown) => {
  if (!v) return '—';
  try {
    return new Date(String(v)).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(v);
  }
};

export const useUserAccess = () => {
  const [authAction] = useAuthActionMutation();
  const notify = useNotification();

  const [allRows, setAllRows] = useState<CustomerApprovalRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tableSearch, setTableSearch] = useState('');
  const [detailRow, setDetailRow] = useState<CustomerApprovalRow | null>(null);
  const [actionInProgress, setActionInProgress] = useState<number | string | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    row: CustomerApprovalRow;
    type: ApprovalAction;
  } | null>(null);
  const [actionNotes, setActionNotes] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await authAction({ action: 'get-customer-onboardings' })
        .unwrap()
        .catch(() => ({ data: [] }));
      setAllRows(res.data ?? []);
    } catch {
      setAllRows([]);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Only platform users (serviceCategory === 'user'), pending or under_review
  const activeRows = allRows.filter(
    (r) =>
      (r.serviceCategory as string) === 'user' &&
      (r.status === 'pending' || r.status === 'under_review'),
  );
  const pendingRows = activeRows.filter((r) => r.status === 'pending');

  const tabLists: CustomerApprovalRow[][] = [activeRows, pendingRows];

  const getFilteredData = (rows: CustomerApprovalRow[]) => {
    if (!tableSearch.trim()) return rows;
    const q = tableSearch.toLowerCase();
    return rows.filter(
      (r) =>
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone?.includes(q) ||
        r.city?.toLowerCase().includes(q),
    );
  };

  const handleOpenAction = (row: CustomerApprovalRow, type: ApprovalAction) => {
    setActionTarget({ row, type });
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
      const label =
        actionTarget.type === 'approve'
          ? 'approved'
          : actionTarget.type === 'reject'
            ? 'rejected'
            : 'moved to under review';
      notify.success(`User ${label} successfully.`);
      handleCloseAction();
      fetchData();
    } catch {
      notify.error('Action failed. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };

  const tabs = [
    <Tab key={0} icon={<PersonIcon />} iconPosition='start' label='All Users' />,
    <Tab key={1} icon={<PendingActionsIcon />} iconPosition='start' label='Pending' />,
  ];

  const columns: Column<CustomerApprovalRow>[] = [
    {
      id: 'sno',
      label: '#',
      minWidth: 42,
      align: 'center',
      sortable: false,
      format: (_v: unknown, _r: CustomerApprovalRow, i?: number) => (
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8' }}>
          {(i ?? 0) + 1}
        </Typography>
      ),
    },
    {
      id: 'firstName',
      label: 'Name',
      minWidth: 130,
      format: (_v: unknown, row: CustomerApprovalRow) => (
        <Typography
          component='span'
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setDetailRow(row);
          }}
          sx={{
            fontWeight: 700,
            fontSize: '0.84rem',
            cursor: 'pointer',
            color: '#1d4ed8',
            textDecoration: 'underline',
            textDecorationColor: 'rgba(29,78,216,0.35)',
            textUnderlineOffset: '3px',
            '&:hover': { color: '#1e40af' },
          }}
        >
          {`${row.firstName} ${row.lastName}`.trim() || '—'}
        </Typography>
      ),
    },
    {
      id: 'phone',
      label: 'Phone',
      minWidth: 110,
      format: (_v: unknown, row: CustomerApprovalRow) => (
        <Typography sx={{ fontSize: '0.82rem', color: '#1e293b' }}>{row.phone || '—'}</Typography>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 160,
      format: (_v: unknown, row: CustomerApprovalRow) => (
        <Typography sx={{ fontSize: '0.82rem', color: '#1e293b' }}>{row.email || '—'}</Typography>
      ),
    },
    {
      id: 'city',
      label: 'Location',
      minWidth: 90,
      format: (_v: unknown, row: CustomerApprovalRow) => (
        <Stack spacing={0.1}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>
            {row.city || '—'}
          </Typography>
          {row.area && (
            <Typography sx={{ fontSize: '0.71rem', color: '#64748b' }}>{row.area}</Typography>
          )}
        </Stack>
      ),
    },
    {
      id: 'createdByName',
      label: 'Submitted',
      minWidth: 100,
      format: (_v: unknown, row: CustomerApprovalRow) => (
        <Stack spacing={0.1}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>
            {row.isSelfRegistered ? 'Self' : row.createdByName || '—'}
          </Typography>
          <Typography sx={{ fontSize: '0.69rem', color: '#94a3b8' }}>
            {fmtDate(row.submittedAt || row.createdAt)}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 102,
      align: 'center',
      format: (_v: unknown, row: CustomerApprovalRow) => {
        const s = row.status ?? 'pending';
        const meta = STATUS_META[s] ?? STATUS_META['pending'];
        return (
          <Chip
            label={meta.label}
            size='small'
            sx={{
              fontSize: '0.72rem',
              fontWeight: 700,
              bgcolor: meta.bg,
              color: meta.color,
              border: 'none',
            }}
          />
        );
      },
    },
    {
      id: 'vehicleNumber',
      label: 'Actions',
      minWidth: 160,
      align: 'center',
      sortable: false,
      format: (_v: unknown, row: CustomerApprovalRow) => {
        const isProcessing = actionInProgress === row.id;
        if (row.status === 'approved')
          return (
            <Chip
              icon={<CheckCircleOutlineIcon style={{ fontSize: 13 }} />}
              label='Approved'
              size='small'
              sx={{
                fontSize: '0.7rem',
                fontWeight: 700,
                bgcolor: '#dcfce7',
                color: '#15803d',
                border: 'none',
              }}
            />
          );
        if (row.status === 'rejected')
          return (
            <Chip
              icon={<CancelOutlinedIcon style={{ fontSize: 13 }} />}
              label='Rejected'
              size='small'
              sx={{
                fontSize: '0.7rem',
                fontWeight: 700,
                bgcolor: '#fee2e2',
                color: '#dc2626',
                border: 'none',
              }}
            />
          );
        return (
          <Stack direction='row' spacing={0.75} justifyContent='center'>
            <Tooltip title='Approve user'>
              <Button
                size='small'
                variant='contained'
                color='success'
                disabled={isProcessing}
                onClick={() => handleOpenAction(row, 'approve')}
                startIcon={<CheckCircleOutlineIcon sx={{ fontSize: '0.9rem !important' }} />}
                sx={{
                  fontSize: '0.7rem',
                  textTransform: 'none',
                  borderRadius: 1.5,
                  minWidth: 0,
                  px: 1,
                }}
              >
                Approve
              </Button>
            </Tooltip>
            <Tooltip title='Reject user'>
              <Button
                size='small'
                variant='outlined'
                color='error'
                disabled={isProcessing}
                onClick={() => handleOpenAction(row, 'reject')}
                startIcon={<CancelOutlinedIcon sx={{ fontSize: '0.9rem !important' }} />}
                sx={{
                  fontSize: '0.7rem',
                  textTransform: 'none',
                  borderRadius: 1.5,
                  minWidth: 0,
                  px: 1,
                }}
              >
                Reject
              </Button>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return {
    isLoading,
    activeRows,
    pendingRows,
    tabLists,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    tabs,
    columns,
    detailRow,
    setDetailRow,
    actionTarget,
    actionNotes,
    setActionNotes,
    actionInProgress,
    handleOpenAction,
    handleCloseAction,
    handleConfirmAction,
    getFilteredData,
  };
};
