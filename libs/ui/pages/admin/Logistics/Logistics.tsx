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
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SendIcon from '@mui/icons-material/Send';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useStyles } from './styles';
import { useLogistics } from './hooks/useLogistics';
import TabPanel from './components/TabPanel';
import { LogisticsRow } from './types/logistics.types';
import { useAdminKeyframes } from '@bandi/hooks';

const Logistics = () => {
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
    setDetailRow,
    selectedRow,
    setSelectedRow,
    handleOpenAction,
    getFilteredData,
  } = useLogistics();
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
      label: 'Total Shipments',
      value: tabLists[0]?.length ?? 0,
      Icon: LocalShippingIcon,
      cls: classes.statCard0,
      sub: 'All logistics requests',
      color: '#6366f1',
    },
    {
      label: 'Pending',
      value: tabLists[1]?.length ?? 0,
      Icon: PendingActionsIcon,
      cls: classes.statCard1,
      sub: 'Awaiting dispatch',
      color: '#f59e0b',
    },
    {
      label: 'In Transit',
      value: tabLists[2]?.length ?? 0,
      Icon: AirportShuttleIcon,
      cls: classes.statCard2,
      sub: 'Currently en route',
      color: '#8b5cf6',
    },
    {
      label: 'Delivered',
      value: tabLists[3]?.length ?? 0,
      Icon: CheckCircleIcon,
      cls: classes.statCard3,
      sub: 'Successfully delivered',
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
              <LocalShippingIcon />
            </Box>
            <Typography variant='h5' className={classes.title}>
              Logistics
            </Typography>
          </Box>
          <Typography variant='body2' className={classes.description}>
            Manage freight and cargo shipment requests, dispatch drivers, and track deliveries.
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
            placeholder='Search shipments...'
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
            <Tooltip title={sel ? 'View shipment details' : 'Select a shipment first'}>
              <span>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<InfoOutlinedIcon />}
                  disabled={!sel}
                  onClick={() => sel && setDetailRow(sel)}
                  sx={{
                    background: sel ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : undefined,
                    boxShadow: sel ? '0 4px 14px rgba(99,102,241,0.4)' : undefined,
                    '&:hover': { transform: sel ? 'translateY(-1px)' : undefined },
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
                sel && sel.status === 'pending'
                  ? 'Dispatch this shipment'
                  : sel
                    ? 'Only pending shipments can be dispatched'
                    : 'Select a shipment first'
              }
            >
              <span>
                <Button
                  size='small'
                  variant='contained'
                  color='primary'
                  startIcon={<SendIcon />}
                  disabled={!sel || sel.status !== 'pending'}
                  onClick={() => sel && handleOpenAction(sel, 'dispatch')}
                  sx={{
                    boxShadow:
                      sel?.status === 'pending' ? '0 4px 14px rgba(99,102,241,0.38)' : undefined,
                    '&:hover': {
                      transform: sel?.status === 'pending' ? 'translateY(-1px)' : undefined,
                    },
                    transition: 'all 0.22s ease',
                  }}
                >
                  <span className={classes.buttonLabel}>Dispatch</span>
                </Button>
              </span>
            </Tooltip>

            <Tooltip
              title={
                sel && sel.status === 'pending'
                  ? 'Reject this shipment request'
                  : sel
                    ? 'Only pending shipments can be rejected'
                    : 'Select a shipment first'
              }
            >
              <span>
                <Button
                  size='small'
                  variant='outlined'
                  color='error'
                  startIcon={<CancelOutlinedIcon />}
                  disabled={!sel || sel.status !== 'pending'}
                  onClick={() => sel && handleOpenAction(sel, 'reject')}
                  sx={{
                    '&:hover': {
                      transform: sel?.status === 'pending' ? 'translateY(-1px)' : undefined,
                      boxShadow:
                        sel?.status === 'pending' ? '0 4px 14px rgba(239,68,68,0.25)' : undefined,
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

        {/* Tab Panels */}
        {tabLists.map((list, idx) => (
          <TabPanel key={idx} value={tabValue} index={idx}>
            {getFilteredData(list).length === 0 ? (
              <Box className={classes.emptyState}>
                <LocalShippingIcon className={classes.emptyIcon} />
                <Typography variant='h6' color='text.secondary'>
                  {tableSearch ? 'No matching shipments' : 'No logistics shipments found'}
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
                      prev?.id === (row as LogisticsRow).id ? null : (row as LogisticsRow),
                    )
                  }
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

export default Logistics;
