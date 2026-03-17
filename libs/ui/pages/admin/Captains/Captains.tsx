import { Box, Loader, DataTable } from '@bandi/component';
import { Typography, Tabs, Divider, TextField, InputAdornment, Paper, Button, Tooltip, Link } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NearMeIcon from '@mui/icons-material/NearMe';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import SearchIcon from '@mui/icons-material/Search';
import BadgeIcon from '@mui/icons-material/Badge';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { IAuthUser } from '@bandi/interfaces';
import { useStyles } from './styles';
import { useCaptains } from './hooks/useCaptains';
import TabPanel from './components/TabPanel';
import DetailDialog from './dialogs/DetailDialog/DetailDialog';
import ActionDialog from './dialogs/ActionDialog/ActionDialog';

const Captains = () => {
  const { classes } = useStyles();
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
  } = useCaptains();
  const sel = selectedRow;

  const keyframes = (
    <GlobalStyles styles={`
      @keyframes um-gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      @keyframes um-orb-drift { 0%, 100% { transform: translate(0, 0) scale(1); } 25% { transform: translate(22px, -18px) scale(1.06); } 75% { transform: translate(-16px, 12px) scale(0.94); } }
      @keyframes um-float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 40% { transform: translateY(-18px) rotate(6deg); } 70% { transform: translateY(-9px) rotate(-3deg); } }
      @keyframes um-slide-up { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes um-counter { from { opacity: 0; transform: scale(0.65) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    `} />
  );

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
    { label: 'Total Captains', value: tabLists[0]?.length ?? 0, Icon: DirectionsCarIcon, cls: classes.statCard0, sub: 'All registered captains', color: '#4f46e5' },
    { label: 'Active', value: tabLists[1]?.length ?? 0, Icon: CheckCircleIcon, cls: classes.statCard2, sub: 'Currently available', color: '#10b981' },
    { label: 'On Trip', value: tabLists[2]?.length ?? 0, Icon: NearMeIcon, cls: classes.statCard1, sub: 'Actively on a journey', color: '#f59e0b' },
    { label: 'Offline', value: tabLists[3]?.length ?? 0, Icon: PersonOffIcon, cls: classes.statCard3, sub: 'Not currently active', color: '#0ea5e9' },
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
              Captains
            </Typography>
          </Box>
          <Typography variant='body2' className={classes.description}>
            Monitor and manage all on-ground service captains and their activity.
          </Typography>
        </Box>

        {/* Stat Cards */}
        <Box className={classes.statsGrid}>
          {statCards.map(({ label, value, Icon, cls, sub, color }) => (
            <Box key={label} className={`${classes.statCard} ${cls}`}>
              <Box className={classes.statCardTop}>
                <Box>
                  <Typography className={classes.statValue} sx={{ color }}>{value}</Typography>
                  <Typography className={classes.statLabel}>{label}</Typography>
                </Box>
                <Box className={classes.statIconWrap} sx={{ background: `${color}14`, border: `1.5px solid ${color}28` }}>
                  <Icon className={classes.statIcon} sx={{ color }} />
                </Box>
              </Box>
              <Divider className={classes.statDivider} />
              <Box className={classes.statSubRow}>
                <Box className={classes.statSubDot} sx={{ background: color, boxShadow: `0 0 6px ${color}` }} />
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
            <Tooltip title={sel ? 'View captain profile' : 'Select a captain first'}>
              <span>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<BadgeIcon />}
                  disabled={!sel}
                  onClick={() => sel && setDetailUser(sel)}
                  sx={{
                    background: sel ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : undefined,
                    boxShadow: sel ? '0 4px 14px rgba(79,70,229,0.4)' : undefined,
                    '&:hover': { transform: sel ? 'translateY(-1px)' : undefined },
                    transition: 'all 0.22s ease',
                  }}
                >
                  <span className={classes.buttonLabel}>View Profile</span>
                </Button>
              </span>
            </Tooltip>

            <Divider orientation='vertical' flexItem className={classes.dividerMobile} />

            <Tooltip title={sel && sel.status === 'pending_approval' ? 'Approve captain access' : sel ? 'Only pending requests can be approved' : 'Select a captain first'}>
              <span>
                <Button
                  size='small'
                  variant='contained'
                  color='success'
                  startIcon={<CheckCircleOutlineIcon />}
                  disabled={!sel || sel.status !== 'pending_approval'}
                  onClick={() => sel && handleOpenAction(sel, 'approve')}
                  sx={{
                    boxShadow: sel?.status === 'pending_approval' ? '0 4px 14px rgba(16,185,129,0.38)' : undefined,
                    '&:hover': { transform: sel?.status === 'pending_approval' ? 'translateY(-1px)' : undefined },
                    transition: 'all 0.22s ease',
                  }}
                >
                  <span className={classes.buttonLabel}>Approve Captain</span>
                </Button>
              </span>
            </Tooltip>

            <Tooltip title={sel && sel.status === 'pending_approval' ? 'Reject captain request' : sel ? 'Only pending requests can be rejected' : 'Select a captain first'}>
              <span>
                <Button
                  size='small'
                  variant='outlined'
                  color='error'
                  startIcon={<CancelOutlinedIcon />}
                  disabled={!sel || sel.status !== 'pending_approval'}
                  onClick={() => sel && handleOpenAction(sel, 'reject')}
                  sx={{
                    '&:hover': { transform: sel?.status === 'pending_approval' ? 'translateY(-1px)' : undefined, boxShadow: sel?.status === 'pending_approval' ? '0 4px 14px rgba(239,68,68,0.25)' : undefined },
                    transition: 'all 0.22s ease',
                  }}
                >
                  <span className={classes.buttonLabel}>Reject</span>
                </Button>
              </span>
            </Tooltip>
          </Box>

          {sel && (
            <Typography variant='caption' className={classes.selectionIndicator}>
              Selected: <strong>{sel.name}</strong> ({sel.email}) &nbsp;·&nbsp;
              <Link component='button' variant='caption' onClick={() => setSelectedRow(null)}>
                Clear
              </Link>
            </Typography>
          )}
        </Paper>

        {/* Tab panels */}
        {tabLists.map((list, idx) => (
          <TabPanel key={idx} value={tabValue} index={idx}>
            {getFilteredData(list).length === 0 ? (
              <Box className={classes.emptyState}>
                <DirectionsCarIcon className={classes.emptyIcon} />
                <Typography variant='h6' color='text.secondary'>
                  {tableSearch ? 'No matching captains' : 'No captains found'}
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
                  onRowClick={(row) => setSelectedRow((prev) => prev?.id === (row as IAuthUser).id ? null : row as typeof sel)}
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

export default Captains;
