import { Box, Loader, DataTable } from '@bandi/component';
import { Typography, Tabs, Divider, TextField, InputAdornment } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SearchIcon from '@mui/icons-material/Search';
import { useAdminKeyframes } from '@bandi/hooks';
import { useStyles } from './styles';
import { useCustomerApprovals } from './hooks/useCustomerApprovals';
import TabPanel from './components/TabPanel';
import ActionDialog from './dialogs/ActionDialog/ActionDialog';
import DetailDialog from './dialogs/DetailDialog/DetailDialog';

const CustomerApprovals = () => {
  const { classes } = useStyles();
  const keyframes = useAdminKeyframes();

  const {
    isLoading,
    activeRows,
    needsActionCount,
    mobilityActiveCount,
    logisticsActiveCount,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    tabLists,
    tabs,
    columns,
    detailRow,
    setDetailRow,
    actionTarget,
    actionNotes,
    setActionNotes,
    actionInProgress,
    handleOpenAction,
    handleCloseAction,
    handleConfirmAction,
    getFilteredData,
  } = useCustomerApprovals();

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
      label: 'All Requests',
      value: activeRows.length,
      Icon: HowToRegIcon,
      cls: classes.statCard0,
      sub: 'All onboarding requests',
      color: '#4f46e5',
    },
    {
      label: 'Mobility',
      value: mobilityActiveCount,
      Icon: DirectionsBusIcon,
      cls: classes.statCard1,
      sub: 'Passenger transport',
      color: '#10b981',
    },
    {
      label: 'Logistics',
      value: logisticsActiveCount,
      Icon: LocalShippingIcon,
      cls: classes.statCard2,
      sub: 'Goods & cargo transport',
      color: '#0ea5e9',
    },
    {
      label: 'Pending',
      value: needsActionCount,
      Icon: PendingActionsIcon,
      cls: classes.statCard3,
      sub: 'Awaiting review',
      color: '#d97706',
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
              Customer Requests
            </Typography>
          </Box>
          <Typography variant='body2' className={classes.description}>
            Review onboarding requests and manage approved mobility &amp; logistics customers from a
            single view.
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

        {/* Tab panels */}
        {tabLists.map((list, idx) => (
          <TabPanel key={idx} value={tabValue} index={idx}>
            {getFilteredData(list).length === 0 ? (
              <Box className={classes.emptyState}>
                <PendingActionsIcon className={classes.emptyIcon} />
                <Typography variant='h6' color='text.secondary'>
                  {tableSearch
                    ? 'No matching requests'
                    : idx === 1
                      ? 'No mobility requests found'
                      : idx === 2
                        ? 'No logistics requests found'
                        : idx === 3
                          ? 'No pending requests'
                          : 'No customer requests found'}
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
                />
              </Box>
            )}
          </TabPanel>
        ))}
      </Box>

      <DetailDialog
        row={detailRow}
        onClose={() => setDetailRow(null)}
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
    </>
  );
};

export default CustomerApprovals;
