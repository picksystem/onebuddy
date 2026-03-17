import { Box, Loader, DataTable } from '@bandi/component';
import { Typography, Tabs, Divider, TextField, InputAdornment, Paper, Button, Tooltip, Link } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LinkIcon from '@mui/icons-material/Link';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useStyles } from './styles';
import { useDriverHire } from './hooks/useDriverHire';
import TabPanel from './components/TabPanel';
import { DriverHireRow } from './types/driverHire.types';

const DriverHire = () => {
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
  } = useDriverHire();
  const sel = selectedRow;

  const keyframes = (
    <GlobalStyles
      styles={`
      @keyframes dh-gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      @keyframes dh-orb-drift { 0%, 100% { transform: translate(0, 0) scale(1); } 25% { transform: translate(20px, -16px) scale(1.06); } 75% { transform: translate(-14px, 10px) scale(0.94); } }
      @keyframes dh-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes dh-counter { from { opacity: 0; transform: scale(0.65) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      @keyframes dh-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.35); } }
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
      Icon: PersonSearchIcon,
      cls: classes.statCard0,
      sub: 'All driver hire requests',
      color: '#6d28d9',
    },
    {
      label: 'Pending',
      value: tabLists[1]?.length ?? 0,
      Icon: PendingActionsIcon,
      cls: classes.statCard1,
      sub: 'Awaiting admin action',
      color: '#f59e0b',
    },
    {
      label: 'Matched',
      value: tabLists[2]?.length ?? 0,
      Icon: CheckCircleIcon,
      cls: classes.statCard2,
      sub: 'Driver successfully assigned',
      color: '#10b981',
    },
    {
      label: 'Rejected',
      value: tabLists[3]?.length ?? 0,
      Icon: CancelIcon,
      cls: classes.statCard3,
      sub: 'Requests declined',
      color: '#ef4444',
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
              <PersonSearchIcon />
            </Box>
            <Typography variant='h5' className={classes.title}>
              Driver Hire
            </Typography>
          </Box>
          <Typography variant='body2' className={classes.description}>
            Manage requests from users who own a vehicle and are looking to hire a driver.
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
                    background: sel ? 'linear-gradient(135deg, #6d28d9, #a855f7)' : undefined,
                    boxShadow: sel ? '0 4px 14px rgba(109,40,217,0.4)' : undefined,
                    '&:hover': { transform: sel ? 'translateY(-1px)' : undefined },
                    transition: 'all 0.22s ease',
                  }}
                >
                  <span className={classes.buttonLabel}>View Details</span>
                </Button>
              </span>
            </Tooltip>

            <Divider orientation='vertical' flexItem className={classes.dividerMobile} />

            <Tooltip title={sel && sel.status === 'pending' ? 'Match a driver for this request' : sel ? 'Only pending requests can be matched' : 'Select a request first'}>
              <span>
                <Button
                  size='small'
                  variant='contained'
                  color='success'
                  startIcon={<LinkIcon />}
                  disabled={!sel || sel.status !== 'pending'}
                  onClick={() => sel && handleOpenAction(sel, 'match')}
                  sx={{
                    boxShadow: sel?.status === 'pending' ? '0 4px 14px rgba(16,185,129,0.38)' : undefined,
                    '&:hover': { transform: sel?.status === 'pending' ? 'translateY(-1px)' : undefined },
                    transition: 'all 0.22s ease',
                  }}
                >
                  <span className={classes.buttonLabel}>Match Driver</span>
                </Button>
              </span>
            </Tooltip>

            <Tooltip title={sel && sel.status === 'pending' ? 'Reject this driver hire request' : sel ? 'Only pending requests can be rejected' : 'Select a request first'}>
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
                <PersonSearchIcon className={classes.emptyIcon} />
                <Typography variant='h6' color='text.secondary'>
                  {tableSearch ? 'No matching requests' : 'No driver hire requests found'}
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
                  onRowClick={(row) => setSelectedRow((prev) => prev?.id === (row as DriverHireRow).id ? null : row as DriverHireRow)}
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

export default DriverHire;
