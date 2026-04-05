import React, { useCallback, useEffect, useState } from 'react';
import { Chip, Typography, Button, Stack, Tab, Link, Avatar, Box as MuiBox } from '@mui/material';
import { Column } from '@bandi/component';
import BuildIcon from '@mui/icons-material/Build';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useAuthActionMutation } from '@bandi/services';
import { useNotification } from '@bandi/hooks';
import { MechanicHireRow, ActionType } from '../types/mechanicHire.types';
import { getFilteredData, getTabLists } from '../utils/mechanicHire.utils';

export const useMechanicHire = () => {
  const [authAction] = useAuthActionMutation();
  const notify = useNotification();

  const [requests, setRequests] = useState<MechanicHireRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tableSearch, setTableSearch] = useState('');
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);
  const [detailRow, setDetailRow] = useState<MechanicHireRow | null>(null);
  const [selectedRow, setSelectedRow] = useState<MechanicHireRow | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    row: MechanicHireRow;
    type: ActionType;
  } | null>(null);
  const [actionNotes, setActionNotes] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await authAction({ action: 'get-mechanic-hire-requests' }).unwrap();
      setRequests(result.data || []);
    } catch {
      notify.error('Failed to load mechanic hire requests');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authAction]);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { all, pending, assigned, completed } = getTabLists(requests);
  const tabLists = [all, pending, assigned, completed];

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    const { row, type } = actionTarget;
    try {
      setActionInProgress(row.id);
      await authAction({
        action: type === 'assign' ? 'assign-mechanic-hire' : 'reject-mechanic-hire',
        userId: row.id,
        adminNotes: actionNotes || undefined,
      }).unwrap();
      notify.success(
        type === 'assign'
          ? `Mechanic assigned for ${row.name}`
          : `Mechanic hire request from ${row.name} rejected`,
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

  const handleOpenAction = (row: MechanicHireRow, type: ActionType) => {
    setActionTarget({ row, type });
    setActionNotes('');
  };

  const handleCloseAction = () => {
    setActionTarget(null);
    setActionNotes('');
  };

  const statusColor: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
    pending: 'warning',
    assigned: 'info',
    completed: 'success',
    rejected: 'error',
  };

  const columns: Column<MechanicHireRow>[] = [
    { id: 'sno', label: 'S.No', minWidth: 60, align: 'center', sortable: false },
    {
      id: 'name',
      label: 'Name',
      minWidth: 160,
      format: (_v: unknown, row: MechanicHireRow): React.ReactNode => (
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
      id: 'mechanicImage',
      label: 'Photo',
      minWidth: 80,
      align: 'center' as const,
      sortable: false,
      format: (_v: unknown, row: MechanicHireRow): React.ReactNode => (
        <MuiBox sx={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar
            src={row.mechanicImage || ''}
            variant='rounded'
            sx={{ width: 52, height: 40, borderRadius: '8px', bgcolor: 'rgba(124,58,237,0.1)' }}
          >
            {!row.mechanicImage && (
              <EngineeringIcon sx={{ color: '#7c3aed', fontSize: '1.4rem' }} />
            )}
          </Avatar>
        </MuiBox>
      ),
    },
    {
      id: 'serviceType',
      label: 'Service Type',
      minWidth: 140,
      format: (v: unknown) => String(v || '-'),
    },
    {
      id: 'costPerHour',
      label: 'Cost / Hour',
      minWidth: 120,
      align: 'center' as const,
      format: (v: unknown): React.ReactNode => {
        const num = Number(v);
        if (!v || isNaN(num)) return <Typography variant='body2'>—</Typography>;
        return (
          <Typography variant='body2' sx={{ fontWeight: 600, color: '#7c3aed' }}>
            ₹{num.toLocaleString('en-IN')}
          </Typography>
        );
      },
    },
    { id: 'duration', label: 'Duration', minWidth: 120, format: (v: unknown) => String(v || '-') },
    { id: 'location', label: 'Location', minWidth: 140, format: (v: unknown) => String(v || '-') },
    {
      id: 'scheduledDate',
      label: 'Scheduled Date',
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
      format: (_v: unknown, row: MechanicHireRow): React.ReactNode => {
        if (row.status !== 'pending') return <Typography variant='body2'>—</Typography>;
        const processing = actionInProgress === row.id;
        return (
          <Stack direction='row' spacing={1} justifyContent='center'>
            <Button
              variant='contained'
              color='success'
              size='small'
              startIcon={<AssignmentTurnedInIcon />}
              disabled={processing}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAction(row, 'assign');
              }}
            >
              Assign
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
      <Tab icon={<BuildIcon />} iconPosition='start' label={`All (${all.length})`} />
      <Tab
        icon={<PendingActionsIcon />}
        iconPosition='start'
        label={`Pending (${pending.length})`}
      />
      <Tab
        icon={<EngineeringIcon />}
        iconPosition='start'
        label={`Assigned (${assigned.length})`}
      />
      <Tab
        icon={<CheckCircleIcon />}
        iconPosition='start'
        label={`Completed (${completed.length})`}
      />
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
    getFilteredData: (list: MechanicHireRow[]) => getFilteredData(list, tableSearch),
  };
};
