import { Box, Loader, DataTable } from '@bandi/component';
import { Typography, Tabs, Divider, TextField, InputAdornment, Paper, Button, Tooltip, Link } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';
import CarRentalIcon from '@mui/icons-material/CarRental';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useStyles } from './styles';
import { useVehicleRental } from './hooks/useVehicleRental';
import TabPanel from './components/TabPanel';
import { VehicleRentalRow } from './types/vehicleRental.types';

const VehicleRental = () => {
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
    setDetailRow,
    selectedRow,
    setSelectedRow,
    handleOpenAction,
    getFilteredData,
  } = useVehicleRental();
  const sel = selectedRow;

  const keyframes = (
    <GlobalStyles
      styles={`
      @keyframes vr-gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      @keyframes vr-orb-drift { 0%, 100% { transform: translate(0, 0) scale(1); } 25% { transform: translate(20px, -16px) scale(1.06); } 75% { transform: translate(-14px, 10px) scale(0.94); } }
      @keyframes vr-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes vr-counter { from { opacity: 0; transform: scale(0.65) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      @keyframes vr-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.35); } }
    `}
    />
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
    {
      label: 'Total Requests',
      value: tabLists[0]?.length ?? 0,
      Icon: CarRentalIcon,
      cls: classes.statCard0,
      sub: 'All rental requests',
      color: '#0f766e',
    },
    {
      label: 'Pending',
      value: tabLists[1]?.length ?? 0,
      Icon: PendingActionsIcon,
      cls: classes.statCard1,
      sub: 'Awaiting vehicle assignment',
      color: '#f59e0b',
    },
    {
      label: 'Active Rentals',
      value: tabLists[2]?.length ?? 0,
      Icon: DirectionsCarIcon,
      cls: classes.statCard2,
      sub: 'Currently rented out',
      color: '#0ea5e9',
    },
    {
      label: 'Completed',
      value: tabLists[3]?.length ?? 0,
      Icon: CheckCircleIcon,
      cls: classes.statCard3,
      sub: 'Rentals successfully closed',
      color: '#10b981',
    },
  ];

  return (
    <>
      {keyframes}
      <Box className={classes.container}>
        {/* Page Header */}
        <Box className={classes.pageHeader}>
          <Box className={classes.headerOrb3} />
          <Box className={classes.pageHeaderRow}>
            <Box className={classes.headerIconWrap}>
              <CarRentalIcon />
            </Box>
            <Typography variant='h5' className={classes.title}>
              Vehicle Rental
            </Typography>
          </Box>
          <Typography variant='body2' className={classes.description}>
            Manage requests from users looking to rent a vehicle for personal or business use.
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
            className={classes.tabsFlex}
          >
            {tabs}
          </Tabs>
          <TextField
            placeholder='Search requests...'
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
            <Tooltip title={sel ? 'View request details' : 'Select a request first'}>
              <span>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<InfoOutlinedIcon />}
                  disabled={!sel}
                  onClick={() => sel && setDetailRow(sel)}
                  sx={{
                    background: sel ? 'linear-gradient(135deg, #0f766e, #0ea5e9)' : undefined,
                    boxShadow: sel ? '0 4px 14px rgba(15,118,110,0.4)' : undefined,
                    '&:hover': { transform: sel ? 'translateY(-1px)' : undefined },
                    transition: 'all 0.22s ease',
                  }}
                >
                  <span className={classes.buttonLabel}>View Details</span>
                </Button>
              </span>
            </Tooltip>

            <Divider orientation='vertical' flexItem className={classes.dividerMobile} />

            <Tooltip title={sel && sel.status === 'pending' ? 'Assign a vehicle for this request' : sel ? 'Only pending requests can be assigned' : 'Select a request first'}>
              <span>
                <Button
                  size='small'
                  variant='contained'
                  color='success'
                  startIcon={<AssignmentTurnedInIcon />}
                  disabled={!sel || sel.status !== 'pending'}
                  onClick={() => sel && handleOpenAction(sel, 'assign')}
                  sx={{
                    boxShadow: sel?.status === 'pending' ? '0 4px 14px rgba(16,185,129,0.38)' : undefined,
                    '&:hover': { transform: sel?.status === 'pending' ? 'translateY(-1px)' : undefined },
                    transition: 'all 0.22s ease',
                  }}
                >
                  <span className={classes.buttonLabel}>Assign Vehicle</span>
                </Button>
              </span>
            </Tooltip>

            <Tooltip title={sel && sel.status === 'pending' ? 'Reject this vehicle rental request' : sel ? 'Only pending requests can be rejected' : 'Select a request first'}>
              <span>
                <Button
                  size='small'
                  variant='outlined'
                  color='error'
                  startIcon={<CancelOutlinedIcon />}
                  disabled={!sel || sel.status !== 'pending'}
                  onClick={() => sel && handleOpenAction(sel, 'reject')}
                  sx={{
                    '&:hover': { transform: sel?.status === 'pending' ? 'translateY(-1px)' : undefined, boxShadow: sel?.status === 'pending' ? '0 4px 14px rgba(239,68,68,0.25)' : undefined },
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

        {/* Tab Panels */}
        {tabLists.map((list, idx) => (
          <TabPanel key={idx} value={tabValue} index={idx}>
            {getFilteredData(list).length === 0 ? (
              <Box className={classes.emptyState}>
                <CarRentalIcon className={classes.emptyIcon} />
                <Typography variant='h6' color='text.secondary'>
                  {tableSearch ? 'No matching requests' : 'No vehicle rental requests found'}
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
                  onRowClick={(row) => setSelectedRow((prev) => prev?.id === (row as VehicleRentalRow).id ? null : row as VehicleRentalRow)}
                  activeRowKey={sel?.id}
                />
              </Box>
            )}
          </TabPanel>
        ))}
      </Box>
    </>
  );
};

export default VehicleRental;
