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
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useStyles } from './styles';
import { useParcels } from './hooks/useParcels';
import TabPanel from './components/TabPanel';
import { ParcelRow } from './types/parcel.types';
import { useAdminKeyframes } from '@bandi/hooks';

const Parcel = () => {
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
  } = useParcels();
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
      label: 'Total Parcels',
      value: tabLists[0]?.length ?? 0,
      Icon: Inventory2Icon,
      cls: classes.statCard0,
      sub: 'All parcel requests',
      color: '#ea580c',
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
      Icon: LocalShippingIcon,
      cls: classes.statCard2,
      sub: 'On the way',
      color: '#0ea5e9',
    },
    {
      label: 'Delivered',
      value: tabLists[3]?.length ?? 0,
      Icon: CheckCircleIcon,
      cls: classes.statCard3,
      sub: 'Successfully delivered',
      color: '#10b981',
    },
    {
      label: 'Rejected',
      value: tabLists[4]?.length ?? 0,
      Icon: CancelIcon,
      cls: classes.statCard4,
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
              <Inventory2Icon />
            </Box>
            <Typography variant='h5' className={classes.title}>
              Parcel
            </Typography>
          </Box>
          <Typography variant='body2' className={classes.description}>
            Manage parcel delivery requests — track dispatch, transit, and delivery status.
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
            placeholder='Search parcels...'
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
            <Tooltip title={sel ? 'View parcel details' : 'Select a parcel first'}>
              <span>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<InfoOutlinedIcon />}
                  disabled={!sel}
                  onClick={() => sel && setDetailRow(sel)}
                  sx={{
                    background: sel ? 'linear-gradient(135deg, #ea580c, #fb923c)' : undefined,
                    boxShadow: sel ? '0 4px 14px rgba(234,88,12,0.4)' : undefined,
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
                  ? 'Dispatch this parcel'
                  : sel
                    ? 'Only pending parcels can be dispatched'
                    : 'Select a parcel first'
              }
            >
              <span>
                <Button
                  size='small'
                  variant='contained'
                  color='success'
                  startIcon={<RocketLaunchIcon />}
                  disabled={!sel || sel.status !== 'pending'}
                  onClick={() => sel && handleOpenAction(sel, 'dispatch')}
                  sx={{
                    boxShadow:
                      sel?.status === 'pending' ? '0 4px 14px rgba(16,185,129,0.38)' : undefined,
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
                  ? 'Reject this parcel request'
                  : sel
                    ? 'Only pending parcels can be rejected'
                    : 'Select a parcel first'
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
                <Inventory2Icon className={classes.emptyIcon} />
                <Typography variant='h6' color='text.secondary'>
                  {tableSearch ? 'No matching parcels' : 'No parcel requests found'}
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
                      prev?.id === (row as ParcelRow).id ? null : (row as ParcelRow),
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

export default Parcel;
