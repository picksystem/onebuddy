import React, { useCallback, useEffect, useState } from 'react';
import { Chip, Typography, Button, Stack, Tab, Link } from '@mui/material';
import { Column } from '@bandi/component';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LinkIcon from '@mui/icons-material/Link';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useAuthActionMutation } from '@bandi/services';
import { useNotification } from '@bandi/hooks';
import { DriverHireRow, ActionType } from '../types/driverHire.types';
import { getFilteredData, getTabLists } from '../utils/driverHire.utils';

export const useDriverHire = () => {
  const [authAction] = useAuthActionMutation();
  const notify = useNotification();

  const [requests, setRequests] = useState<DriverHireRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tableSearch, setTableSearch] = useState('');
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);
  const [detailRow, setDetailRow] = useState<DriverHireRow | null>(null);
  const [selectedRow, setSelectedRow] = useState<DriverHireRow | null>(null);
  const [actionTarget, setActionTarget] = useState<{ row: DriverHireRow; type: ActionType } | null>(
    null,
  );
  const [actionNotes, setActionNotes] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await authAction({ action: 'get-driver-hire-requests' }).unwrap();
      setRequests(result.data || []);
    } catch {
      notify.error('Failed to load driver hire requests');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authAction]);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { all, pending, matched, rejected } = getTabLists(requests);
  const tabLists = [all, pending, matched, rejected];

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    const { row, type } = actionTarget;
    try {
      setActionInProgress(row.id);
      await authAction({
        action: type === 'match' ? 'match-driver-hire' : 'reject-driver-hire',
        userId: row.id,
        adminNotes: actionNotes || undefined,
      }).unwrap();
      notify.success(
        type === 'match'
          ? `Driver matched for ${row.name}`
          : `Driver hire request from ${row.name} rejected`,
      );
      setActionTarget(null);
      setActionNotes('');
      fetchRequests();
    } catch {
      notify.error(`Failed to ${type} request. Please try again.`);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleOpenAction = (row: DriverHireRow, type: ActionType) => {
    setActionTarget({ row, type });
    setActionNotes('');
  };

  const handleCloseAction = () => {
    setActionTarget(null);
    setActionNotes('');
  };

  const statusColor: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
    pending: 'warning',
    matched: 'success',
    rejected: 'error',
    completed: 'info',
  };

  const columns: Column<DriverHireRow>[] = [
    { id: 'sno', label: 'S.No', minWidth: 60, align: 'center', sortable: false },
    {
      id: 'name',
      label: 'Name',
      minWidth: 160,
      format: (_v: unknown, row: DriverHireRow): React.ReactNode => (
        <Link
          component='button'
          variant='body2'
          underline='hover'
          onClick={(e) => {
            e.stopPropagation();
            setDetailRow(row);
          }}
          sx={{ fontWeight: 500, cursor: 'pointer' }}
        >
          {row.name || '-'}
        </Link>
      ),
    },
    { id: 'email', label: 'Email', minWidth: 210, format: (v: unknown) => String(v || '-') },
    {
      id: 'vehicleType',
      label: 'Vehicle Type',
      minWidth: 140,
      format: (v: unknown) => String(v || '-'),
    },
    { id: 'location', label: 'Location', minWidth: 140, format: (v: unknown) => String(v || '-') },
    {
      id: 'preferredDate',
      label: 'Preferred Date',
      minWidth: 140,
      format: (v: unknown) => String(v || '-'),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      align: 'center',
      format: (v: unknown): React.ReactNode => {
        const s = String(v || '');
        return (
          <Chip
            label={s.charAt(0).toUpperCase() + s.slice(1)}
            color={statusColor[s] ?? 'default'}
            size='small'
          />
        );
      },
    },
    {
      id: 'id',
      label: 'Actions',
      minWidth: 200,
      align: 'center',
      sortable: false,
      format: (_v: unknown, row: DriverHireRow): React.ReactNode => {
        if (row.status !== 'pending') return <Typography variant='body2'>—</Typography>;
        const processing = actionInProgress === row.id;
        return (
          <Stack direction='row' spacing={1} justifyContent='center'>
            <Button
              variant='contained'
              color='success'
              size='small'
              startIcon={<LinkIcon />}
              disabled={processing}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAction(row, 'match');
              }}
            >
              Match
            </Button>
            <Button
              variant='outlined'
              color='error'
              size='small'
              startIcon={<CancelOutlinedIcon />}
              disabled={processing}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAction(row, 'reject');
              }}
            >
              Reject
            </Button>
          </Stack>
        );
      },
    },
  ];

  const tabs = (
    <>
      <Tab icon={<PersonSearchIcon />} iconPosition='start' label={`All (${all.length})`} />
      <Tab
        icon={<PendingActionsIcon />}
        iconPosition='start'
        label={`Pending (${pending.length})`}
      />
      <Tab icon={<CheckCircleIcon />} iconPosition='start' label={`Matched (${matched.length})`} />
      <Tab icon={<CancelIcon />} iconPosition='start' label={`Rejected (${rejected.length})`} />
    </>
  );

  return {
    isLoading,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    tabLists,
    columns,
    tabs,
    detailRow,
    setDetailRow,
    selectedRow,
    setSelectedRow,
    actionTarget,
    actionNotes,
    actionInProgress,
    handleConfirmAction,
    handleOpenAction,
    handleCloseAction,
    setActionNotes,
    getFilteredData: (list: DriverHireRow[]) => getFilteredData(list, tableSearch),
  };
};
