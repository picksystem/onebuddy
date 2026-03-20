import { Box, Loader, DataTable } from '@bandi/component';
import {
  Typography,
  Tabs,
  Divider,
  TextField,
  InputAdornment,
  Paper,
  Button,
  Tooltip,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ReviewsIcon from '@mui/icons-material/Reviews';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useStyles } from './styles';
import { useUsers } from './hooks/useUsers';
import TabPanel from './components/TabPanel';
import DetailDialog from './dialogs/DetailDialog/DetailDialog';
import ActionDialog from './dialogs/ActionDialog/ActionDialog';
import { useAdminKeyframes } from '@bandi/hooks';
import { UsersRow } from './types/users.types';

const Users = () => {
  const { classes } = useStyles();
  const keyframes = useAdminKeyframes();
  const {
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
    getFilteredData,
    allRequests,
    pendingRequests,
    underReviewRequests,
    approvedRequests,
    rejectedRequests,
  } = useUsers();
  const sel = selectedRow;

  if (isLoading) {
    return (
      <>
        {keyframes}
        <Box className={classes.container}>
          <Loader />
        </Box>
      </>
    );
  }

  const statCards = [
    {
      label: 'Total Requests',
      value: allRequests.length,
      Icon: PeopleIcon,
      cls: classes.statCard0,
      sub: 'All onboarding requests',
      color: '#4f46e5',
    },
    {
      label: 'Pending',
      value: pendingRequests.length,
      Icon: PendingActionsIcon,
      cls: classes.statCard1,
      sub: 'Awaiting review',
      color: '#f59e0b',
    },
    {
      label: 'Under Review',
      value: underReviewRequests.length,
      Icon: ReviewsIcon,
      cls: classes.statCard2,
      sub: 'Currently being reviewed',
      color: '#0ea5e9',
    },
    {
      label: 'Approved',
      value: approvedRequests.length,
      Icon: CheckCircleIcon,
      cls: classes.statCard3,
      sub: 'Successfully onboarded',
      color: '#10b981',
    },
    {
      label: 'Rejected',
      value: rejectedRequests.length,
      Icon: CancelIcon,
      cls: classes.statCard3,
      sub: 'Requests not approved',
      color: '#ef4444',
    },
  ];

  const canAction = sel && (sel.status === 'pending' || sel.status === 'under_review');
  const selName = sel ? `${sel.firstName} ${sel.lastName}`.trim() : '';

  return (
    <>
      {keyframes}
      <Box className={classes.container}>
        {/* Page header */}
        <Box className={classes.pageHeader}>
          <Box className={classes.headerOrb3} />
          <Box className={classes.pageHeaderRow}>
            <Typography variant='h5' className={classes.title}>
              End Users
            </Typography>
          </Box>
          <Typography variant='body2' className={classes.description}>
            Monitor and manage end user onboarding requests for logistics services.
          </Typography>
        </Box>

        {/* Stat Cards */}
        <Box className={classes.statsGrid}>
          {statCards.map(({ label, value, Icon, cls, sub, color }) => (
            <Box key={label} className={`${classes.statCard} ${cls}`}>
              <Box className={classes.statCardTop}>
                <Box>
                  <Typography className={classes.statValue} sx={{ color }}>
                    {value}
                  </Typography>
                  <Typography className={classes.statLabel}>{label}</Typography>
                </Box>
                <Box
                  className={classes.statIconWrap}
                  sx={{ background: `${color}14`, border: `1.5px solid ${color}28` }}
                >
                  <Icon className={classes.statIcon} sx={{ color }} />
                </Box>
              </Box>
              <Divider className={classes.statDivider} />
              <Box className={classes.statSubRow}>
                <Box
                  className={classes.statSubDot}
                  sx={{ background: color, boxShadow: `0 0 6px ${color}` }}
                />
                <Typography className={classes.statSub}>{sub}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Tabs + Search */}
        <Box className={classes.tabsBox}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => {
              setTabValue(v);
              setTableSearch('');
            }}
            variant='scrollable'
            scrollButtons='auto'
            allowScrollButtonsMobile
            sx={{ flex: 1 }}
          >
            {tabs}
          </Tabs>
          <TextField
            placeholder='Search...'
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className={classes.searchField}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Toolbar */}
        <Paper variant='outlined' className={classes.toolbar}>
          <Box className={classes.toolbarStack}>
            <Tooltip title={sel ? 'View user details' : 'Select a user first'}>
              <span>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<InfoOutlinedIcon />}
                  disabled={!sel}
                  onClick={() => sel && setDetailUser(sel)}
                  sx={{
                    background: sel ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : undefined,
                    boxShadow: sel ? '0 4px 14px rgba(79,70,229,0.4)' : undefined,
                    '&:hover': {
                      transform: sel ? 'translateY(-1px)' : undefined,
                      boxShadow: sel ? '0 6px 20px rgba(79,70,229,0.5)' : undefined,
                    },
                    transition: 'all 0.22s ease',
                  }}
                >
                  <span className={classes.buttonLabel}>View Details</span>
                </Button>
              </span>
            </Tooltip>

            <Divider orientation='vertical' flexItem className={classes.dividerMobile} />

            <Tooltip
              title={
                canAction
                  ? 'Approve access request'
                  : sel
                    ? 'Only pending or under-review requests can be approved'
                    : 'Select a user first'
              }
            >
              <span>
                <Button
                  size='small'
                  variant='contained'
                  color='success'
                  startIcon={<CheckCircleOutlineIcon />}
                  disabled={!canAction}
                  onClick={() => sel && handleOpenAction(sel, 'approve')}
                  sx={{
                    boxShadow: canAction ? '0 4px 14px rgba(16,185,129,0.38)' : undefined,
                    '&:hover': { transform: canAction ? 'translateY(-1px)' : undefined },
                    transition: 'all 0.22s ease',
                  }}
                >
                  <span className={classes.buttonLabel}>Approve</span>
                </Button>
              </span>
            </Tooltip>

            <Tooltip
              title={
                canAction
                  ? 'Reject access request'
                  : sel
                    ? 'Only pending or under-review requests can be rejected'
                    : 'Select a user first'
              }
            >
              <span>
                <Button
                  size='small'
                  variant='outlined'
                  color='error'
                  startIcon={<CancelOutlinedIcon />}
                  disabled={!canAction}
                  onClick={() => sel && handleOpenAction(sel, 'reject')}
                  sx={{
                    borderColor: canAction ? '#ef4444' : undefined,
                    '&:hover': {
                      transform: canAction ? 'translateY(-1px)' : undefined,
                      boxShadow: canAction ? '0 4px 14px rgba(239,68,68,0.25)' : undefined,
                    },
                    transition: 'all 0.22s ease',
                  }}
                >
                  <span className={classes.buttonLabel}>Reject</span>
                </Button>
              </span>
            </Tooltip>
          </Box>

          {sel && (
            <Box className={classes.selectionIndicator}>
              <Typography variant='caption' color='text.secondary'>
                Selected: <strong>{selName}</strong> ({sel.phone})
              </Typography>
              <Button
                size='small'
                variant='outlined'
                startIcon={<HighlightOffIcon sx={{ fontSize: '0.9rem !important' }} />}
                onClick={() => setSelectedRow(null)}
                sx={{
                  borderRadius: '50px',
                  fontSize: '0.7rem',
                  py: 0.3,
                  px: 1.5,
                  borderColor: 'rgba(239,68,68,0.4)',
                  color: 'rgba(239,68,68,0.85)',
                  '&:hover': {
                    borderColor: '#ef4444',
                    background: 'rgba(239,68,68,0.06)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 3px 10px rgba(239,68,68,0.2)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Clear
              </Button>
            </Box>
          )}
        </Paper>

        {/* Tab panels */}
        {tabLists.map((list, idx) => (
          <TabPanel key={idx} value={tabValue} index={idx}>
            {getFilteredData(list).length === 0 ? (
              <Box className={classes.emptyState}>
                <PeopleIcon className={classes.emptyIcon} />
                <Typography variant='h6' color='text.secondary'>
                  {tableSearch ? 'No matching users' : 'No users found'}
                </Typography>
              </Box>
            ) : (
              <Box className={classes.tableContainer}>
                <DataTable
                  columns={columns}
                  data={getFilteredData(list)}
                  rowKey='id'
                  searchable={false}
                  initialRowsPerPage={10}
                  onRowClick={(row) =>
                    setSelectedRow((prev: UsersRow | null) =>
                      prev?.id === (row as UsersRow).id ? null : (row as UsersRow),
                    )
                  }
                  activeRowKey={sel?.id}
                />
              </Box>
            )}
          </TabPanel>
        ))}

        <DetailDialog
          detailUser={detailUser}
          onClose={() => setDetailUser(null)}
          onOpenAction={handleOpenAction}
        />
        <ActionDialog
          actionTarget={actionTarget}
          actionNotes={actionNotes}
          actionInProgress={actionInProgress}
          onClose={handleCloseAction}
          onNotesChange={setActionNotes}
          onConfirm={handleConfirmAction}
        />
      </Box>
    </>
  );
};

export default Users;
