import React, { useEffect, useState, useCallback } from 'react';
import { Column } from '@bandi/component';
import { Chip, Typography, Button, Stack, Tab, Link } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReviewsIcon from '@mui/icons-material/Reviews';
import { useAuthActionMutation } from '@bandi/services';
import { useNotification } from '@bandi/hooks';
import { CaptainsRow, ActionType } from '../types/captains.types';
import { getFilteredData, getTabLists } from '../utils/captains.utils';

export const useCaptains = () => {
  const [authAction] = useAuthActionMutation();
  const notify = useNotification();

  const [requests, setRequests] = useState<CaptainsRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tableSearch, setTableSearch] = useState('');
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);
  const [detailUser, setDetailUser] = useState<CaptainsRow | null>(null);
  const [selectedRow, setSelectedRow] = useState<CaptainsRow | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    user: CaptainsRow;
    type: ActionType;
  } | null>(null);
  const [actionNotes, setActionNotes] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await authAction({ action: 'get-customer-onboardings' }).unwrap();
      const all: CaptainsRow[] = ((result.data || []) as CaptainsRow[])
        .filter((r) => r.serviceCategory === 'mobility')
        .map((r, i) => ({ ...r, sno: i + 1 }));
      setRequests(all);
    } catch {
      notify.error('Failed to load captain onboarding requests');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authAction]);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    all: allRequests,
    pending: pendingRequests,
    underReview: underReviewRequests,
    approved: approvedRequests,
    rejected: rejectedRequests,
  } = getTabLists(requests);
  const tabLists = [
    allRequests,
    pendingRequests,
    underReviewRequests,
    approvedRequests,
    rejectedRequests,
  ];

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    const { user, type } = actionTarget;
    try {
      setActionInProgress(user.id);
      await authAction({
        action: 'update-customer-onboarding',
        id: user.id,
        data: { status: type === 'approve' ? 'approved' : 'rejected' },
        adminNotes: actionNotes || undefined,
      }).unwrap();
      const name = `${user.firstName} ${user.lastName}`.trim();
      notify.success(
        type === 'approve'
          ? `Onboarding approved for ${name}`
          : `Onboarding request from ${name} has been rejected`,
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

  const handleOpenAction = (user: CaptainsRow, type: ActionType) => {
    setActionTarget({ user, type });
    setActionNotes('');
  };

  const handleCloseAction = () => {
    setActionTarget(null);
    setActionNotes('');
  };

  const statusColor: Record<string, 'warning' | 'default' | 'success' | 'error' | 'info'> = {
    pending: 'warning',
    under_review: 'default',
    approved: 'success',
    rejected: 'error',
  };

  const columns: Column<CaptainsRow>[] = [
    { id: 'sno', label: 'S.No', minWidth: 60, align: 'center', sortable: false },
    {
      id: 'firstName',
      label: 'Name',
      minWidth: 170,
      format: (_v: unknown, row: CaptainsRow): React.ReactNode => (
        <Link
          component='button'
          variant='body2'
          underline='hover'
          onClick={(e) => {
            e.stopPropagation();
            setDetailUser(row);
          }}
          sx={{ fontWeight: 500, cursor: 'pointer' }}
        >
          {`${row.firstName} ${row.lastName}`.trim() || '-'}
        </Link>
      ),
    },
    { id: 'phone', label: 'Phone', minWidth: 130, format: (v: unknown) => String(v || '-') },
    { id: 'email', label: 'Email', minWidth: 200, format: (v: unknown) => String(v || '-') },
    { id: 'city', label: 'City', minWidth: 100, format: (v: unknown) => String(v || '-') },
    {
      id: 'vehicleType',
      label: 'Vehicle Type',
      minWidth: 130,
      format: (v: unknown) =>
        String(v || '-')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c: string) => c.toUpperCase()),
    },
    {
      id: 'vehicleNumber',
      label: 'Veh. No.',
      minWidth: 115,
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
            label={s.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
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
      format: (_v: unknown, row: CaptainsRow): React.ReactNode => {
        if (row.status !== 'pending' && row.status !== 'under_review')
          return <Typography variant='body2'>-</Typography>;
        const isProcessing = actionInProgress === row.id;
        return (
          <Stack direction='row' spacing={1} justifyContent='center'>
            <Button
              variant='contained'
              color='success'
              size='small'
              startIcon={<CheckCircleOutlineIcon />}
              disabled={isProcessing}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAction(row, 'approve');
              }}
            >
              Approve
            </Button>
            <Button
              variant='outlined'
              color='error'
              size='small'
              startIcon={<CancelOutlinedIcon />}
              disabled={isProcessing}
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
      <Tab icon={<GroupIcon />} iconPosition='start' label={`All (${allRequests.length})`} />
      <Tab
        icon={<PendingActionsIcon />}
        iconPosition='start'
        label={`Pending (${pendingRequests.length})`}
      />
      <Tab
        icon={<ReviewsIcon />}
        iconPosition='start'
        label={`Under Review (${underReviewRequests.length})`}
      />
      <Tab
        icon={<CheckCircleIcon />}
        iconPosition='start'
        label={`Approved (${approvedRequests.length})`}
      />
      <Tab
        icon={<CancelIcon />}
        iconPosition='start'
        label={`Rejected (${rejectedRequests.length})`}
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
    detailUser,
    setDetailUser,
    selectedRow,
    setSelectedRow,
    actionTarget,
    actionNotes,
    actionInProgress,
    handleConfirmAction,
    handleOpenAction,
    handleCloseAction,
    setActionNotes,
    getFilteredData: (list: CaptainsRow[]) => getFilteredData(list, tableSearch),
    allRequests,
    pendingRequests,
    underReviewRequests,
    approvedRequests,
    rejectedRequests,
  };
};
