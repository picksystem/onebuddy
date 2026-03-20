import { Box, Loader, DataTable } from '@bandi/component';
import { Typography, Tabs, Divider, TextField, InputAdornment } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import PublicIcon from '@mui/icons-material/Public';
import DraftsIcon from '@mui/icons-material/Drafts';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import { IAuthUser } from '@bandi/interfaces';
import { useStyles } from './styles';
import { useCollections } from './hooks/useCollections';
import TabPanel from './components/TabPanel';
import DetailDialog from './dialogs/DetailDialog/DetailDialog';
import ActionDialog from './dialogs/ActionDialog/ActionDialog';
import { useAdminKeyframes } from '@bandi/hooks';

const Collections = () => {
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
    actionTarget,
    actionNotes,
    actionInProgress,
    handleConfirmAction,
    handleOpenAction,
    handleCloseAction,
    setActionNotes,
    getFilteredData,
  } = useCollections();

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
      label: 'Total',
      value: tabLists[0]?.length ?? 0,
      Icon: CollectionsIcon,
      cls: classes.statCard0,
      sub: 'All content collections',
      color: '#4f46e5',
    },
    {
      label: 'Published',
      value: tabLists[1]?.length ?? 0,
      Icon: PublicIcon,
      cls: classes.statCard2,
      sub: 'Live on the platform',
      color: '#10b981',
    },
    {
      label: 'Draft',
      value: tabLists[2]?.length ?? 0,
      Icon: DraftsIcon,
      cls: classes.statCard1,
      sub: 'Work in progress',
      color: '#f59e0b',
    },
    {
      label: 'Featured',
      value: tabLists[3]?.length ?? 0,
      Icon: StarIcon,
      cls: classes.statCard3,
      sub: "Editor's picks",
      color: '#0ea5e9',
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
              Collections
            </Typography>
          </Box>
          <Typography variant='body2' className={classes.description}>
            Manage all curated content collections and editorial picks on the platform.
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
                <CollectionsIcon className={classes.emptyIcon} />
                <Typography variant='h6' color='text.secondary'>
                  {tableSearch ? 'No matching collections' : 'No collections found'}
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

export default Collections;
