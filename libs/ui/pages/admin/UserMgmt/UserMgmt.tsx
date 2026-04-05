import { Box, Loader, DataTable } from '@bandi/component';
import { Typography, Tabs, Tab, Divider, TextField, InputAdornment } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SearchIcon from '@mui/icons-material/Search';
import { useAdminKeyframes } from '@bandi/hooks';
import { useStyles } from './styles';
import { useUserMgmt } from './hooks/useUserMgmt';
import TabPanel from './components/TabPanel';

const UserMgmt = () => {
  const { classes } = useStyles();
  const keyframes = useAdminKeyframes();

  const {
    isLoading,
    managedRows,
    draftRows,
    tabLists,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    columns,
    getFilteredData,
  } = useUserMgmt();

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

  const approvedUsers = managedRows.filter((r) => r.status === 'approved').length;

  const statCards = [
    {
      label: 'All Users',
      value: managedRows.length,
      Icon: GroupIcon,
      cls: classes.statCard0,
      color: '#0891b2',
      tabIndex: 0,
      sub1: approvedUsers,
      sub1Label: 'approved',
      sub1Color: '#10b981',
      sub2: managedRows.length - approvedUsers,
      sub2Label: 'rejected',
      sub2Color: '#ef4444',
    },
    {
      label: 'Draft',
      value: draftRows.length,
      Icon: EditNoteIcon,
      cls: classes.statCard1,
      color: '#0369a1',
      tabIndex: 1,
      sub1: draftRows.length,
      sub1Label: 'pending',
      sub1Color: '#d97706',
      sub2: 0,
      sub2Label: 'processed',
      sub2Color: '#10b981',
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
              User Management
            </Typography>
          </Box>
          <Typography variant='body2' className={classes.description}>
            View and manage all platform users — toggle status and track registration history.
          </Typography>
        </Box>

        {/* Stat Cards */}
        <Box className={classes.statsGrid}>
          {statCards.map(
            ({
              label,
              value,
              Icon,
              cls,
              color,
              tabIndex,
              sub1,
              sub1Label,
              sub1Color,
              sub2,
              sub2Label,
              sub2Color,
            }) => {
              const isActive = tabValue === tabIndex;
              return (
                <Box
                  key={label}
                  className={`${classes.statCard} ${cls}`}
                  onClick={() => {
                    setTabValue(tabIndex);
                    setTableSearch('');
                  }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    outline: isActive ? `2px solid ${color}` : 'none',
                    outlineOffset: 2,
                    transform: isActive ? 'translateY(-6px)' : undefined,
                    boxShadow: isActive
                      ? `0 16px 40px ${color}30, 0 4px 16px ${color}18`
                      : undefined,
                  }}
                >
                  <Box className={classes.statCardTop} sx={{ flex: 1, alignItems: 'flex-start' }}>
                    <Box>
                      <Typography className={classes.statValue} sx={{ color }}>
                        {value}
                      </Typography>
                      <Typography
                        className={classes.statLabel}
                        sx={{ minHeight: '2.2em', display: 'block' }}
                      >
                        {label}
                      </Typography>
                    </Box>
                    <Box
                      className={classes.statIconWrap}
                      sx={{ background: `${color}14`, border: `1.5px solid ${color}28` }}
                    >
                      <Icon className={classes.statIcon} sx={{ color }} />
                    </Box>
                  </Box>
                  <Divider className={classes.statDivider} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      rowGap: '3px',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Box
                        className={classes.statSubDot}
                        sx={{ background: sub1Color, boxShadow: `0 0 6px ${sub1Color}` }}
                      />
                      <Typography className={classes.statSub}>
                        <span style={{ color: sub1Color, fontWeight: 700 }}>{sub1}</span>
                        {` ${sub1Label}`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Box
                        className={classes.statSubDot}
                        sx={{ background: sub2Color, boxShadow: `0 0 6px ${sub2Color}` }}
                      />
                      <Typography className={classes.statSub}>
                        <span style={{ color: sub2Color, fontWeight: 700 }}>{sub2}</span>
                        {` ${sub2Label}`}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            },
          )}
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
            <Tab icon={<GroupIcon />} iconPosition='start' label='All Users' />
            <Tab icon={<EditNoteIcon />} iconPosition='start' label='Draft' />
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
                <GroupIcon className={classes.emptyIcon} />
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
                />
              </Box>
            )}
          </TabPanel>
        ))}
      </Box>
    </>
  );
};

export default UserMgmt;
