import { Box, Loader, DataTable } from '@bandi/component';
import { Typography, Tabs, Divider, TextField, InputAdornment } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import { IAuthUser } from '@bandi/interfaces';
import { useStyles } from './styles';
import { useFastTag } from './hooks/useFastTag';
import TabPanel from './components/TabPanel';
import DetailDialog from './dialogs/DetailDialog/DetailDialog';
import ActionDialog from './dialogs/ActionDialog/ActionDialog';

const FastTag = () => {
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
    actionTarget,
    actionNotes,
    actionInProgress,
    handleConfirmAction,
    handleOpenAction,
    handleCloseAction,
    setActionNotes,
    getFilteredData,
  } = useFastTag();

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
    { label: 'Total Requests', value: tabLists[0]?.length ?? 0, Icon: LocalOfferIcon, cls: classes.statCard0, sub: 'All tag requests', color: '#4f46e5' },
    { label: 'Pending', value: tabLists[1]?.length ?? 0, Icon: HourglassEmptyIcon, cls: classes.statCard1, sub: 'Awaiting review', color: '#f59e0b' },
    { label: 'Approved', value: tabLists[2]?.length ?? 0, Icon: CheckCircleIcon, cls: classes.statCard2, sub: 'Tags granted', color: '#10b981' },
    { label: 'Rejected', value: tabLists[3]?.length ?? 0, Icon: CancelIcon, cls: classes.statCard3, sub: 'Requests denied', color: '#0ea5e9' },
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
              Fast Tag Requests
            </Typography>
          </Box>
          <Typography variant='body2' className={classes.description}>
            Review and process all FastTag access requests from users and captains.
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

        {/* Tab panels */}
        {tabLists.map((list, idx) => (
          <TabPanel key={idx} value={tabValue} index={idx}>
            {getFilteredData(list).length === 0 ? (
              <Box className={classes.emptyState}>
                <LocalOfferIcon className={classes.emptyIcon} />
                <Typography variant='h6' color='text.secondary'>
                  {tableSearch
                    ? 'No matching requests'
                    : idx === 1
                      ? 'No pending requests'
                      : idx === 2
                        ? 'No approved requests'
                        : idx === 3
                          ? 'No rejected requests'
                          : 'No tag requests found'}
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
                  onRowClick={(row) => setDetailUser(row as IAuthUser)}
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

export default FastTag;
