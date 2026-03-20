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
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { IAuthUser } from '@bandi/interfaces';
import { useAdminKeyframes } from '@bandi/hooks';
import { useStyles } from './styles';
import { useConsultants } from './hooks/useConsultants';
import TabPanel from './components/TabPanel';
import DetailDialog from './dialogs/DetailDialog/DetailDialog';
import ActionDialog from './dialogs/ActionDialog/ActionDialog';

const Consultant = () => {
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
  } = useConsultants();
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
      label: 'Total Consultants',
      value: tabLists[0]?.length ?? 0,
      Icon: QueryStatsIcon,
      cls: classes.statCard0,
      sub: 'All consultant requests',
      color: '#0ea5e9',
    },
    {
      label: 'Pending',
      value: tabLists[1]?.length ?? 0,
      Icon: PendingActionsIcon,
      cls: classes.statCard1,
      sub: 'Awaiting admin approval',
      color: '#f59e0b',
    },
    {
      label: 'Approved',
      value: tabLists[2]?.length ?? 0,
      Icon: CheckCircleIcon,
      cls: classes.statCard2,
      sub: 'Active consultant accounts',
      color: '#10b981',
    },
    {
      label: 'Rejected',
      value: tabLists[3]?.length ?? 0,
      Icon: DoNotDisturbIcon,
      cls: classes.statCard3,
      sub: 'Declined access requests',
      color: '#8b5cf6',
    },
  ];

  return (
    <>
      {keyframes}
      <Box className={classes.container}>
        {/* Page header */}
        <Box className={classes.pageHeader}>
          <Box className={classes.headerOrb3} />
          <Box className={classes.pageHeaderRow}>
            <Typography variant='h5' className={classes.title}>
              Consultants
            </Typography>
          </Box>
          <Typography variant='body2' className={classes.description}>
            Manage consultant access requests — read-only access to reports &amp; analytics.
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
            <Tooltip title={sel ? 'View consultant details' : 'Select a consultant first'}>
              <span>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<InfoOutlinedIcon />}
                  disabled={!sel}
                  onClick={() => sel && setDetailUser(sel)}
                  sx={{
                    background: sel ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : undefined,
                    boxShadow: sel ? '0 4px 14px rgba(14,165,233,0.4)' : undefined,
                    '&:hover': {
                      transform: sel ? 'translateY(-1px)' : undefined,
                      boxShadow: sel ? '0 6px 20px rgba(14,165,233,0.5)' : undefined,
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
                sel && sel.status === 'pending_approval'
                  ? 'Approve access request'
                  : sel
                    ? 'Only pending requests can be approved'
                    : 'Select a consultant first'
              }
            >
              <span>
                <Button
                  size='small'
                  variant='contained'
                  color='success'
                  startIcon={<CheckCircleOutlineIcon />}
                  disabled={!sel || sel.status !== 'pending_approval'}
                  onClick={() => sel && handleOpenAction(sel, 'approve')}
                  sx={{
                    boxShadow:
                      sel?.status === 'pending_approval'
                        ? '0 4px 14px rgba(16,185,129,0.38)'
                        : undefined,
                    '&:hover': {
                      transform:
                        sel?.status === 'pending_approval' ? 'translateY(-1px)' : undefined,
                    },
                    transition: 'all 0.22s ease',
                  }}
                >
                  <span className={classes.buttonLabel}>Approve</span>
                </Button>
              </span>
            </Tooltip>

            <Tooltip
              title={
                sel && sel.status === 'pending_approval'
                  ? 'Reject access request'
                  : sel
                    ? 'Only pending requests can be rejected'
                    : 'Select a consultant first'
              }
            >
              <span>
                <Button
                  size='small'
                  variant='outlined'
                  color='error'
                  startIcon={<CancelOutlinedIcon />}
                  disabled={!sel || sel.status !== 'pending_approval'}
                  onClick={() => sel && handleOpenAction(sel, 'reject')}
                  sx={{
                    borderColor: sel?.status === 'pending_approval' ? '#ef4444' : undefined,
                    '&:hover': {
                      transform:
                        sel?.status === 'pending_approval' ? 'translateY(-1px)' : undefined,
                      boxShadow:
                        sel?.status === 'pending_approval'
                          ? '0 4px 14px rgba(239,68,68,0.25)'
                          : undefined,
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
                Selected: <strong>{sel.name}</strong> ({sel.email})
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
                <QueryStatsIcon className={classes.emptyIcon} />
                <Typography variant='h6' color='text.secondary'>
                  {tableSearch ? 'No matching consultants' : 'No consultant requests found'}
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
                    setSelectedRow((prev) =>
                      prev?.id === (row as IAuthUser).id ? null : (row as typeof sel),
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

export default Consultant;
