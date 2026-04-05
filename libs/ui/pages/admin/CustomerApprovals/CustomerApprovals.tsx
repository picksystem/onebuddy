import { Box, Loader, DataTable } from '@bandi/component';
import { Typography, Tabs, Divider, TextField, InputAdornment } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import SearchIcon from '@mui/icons-material/Search';
import HailIcon from '@mui/icons-material/Hail';
import CarRentalIcon from '@mui/icons-material/CarRental';
import BuildIcon from '@mui/icons-material/Build';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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
    pendingRows,
    needsActionCount,
    driverHireRows,
    vehicleRentalRows,
    mechanicHireRows,
    userRows,
    pendingDriverHireRows,
    pendingVehicleRentalRows,
    pendingMechanicHireRows,
    pendingUserRows,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    tabLists,
    tabs,
    columns,
    driverHireColumns,
    vehicleRentalColumns,
    mechanicHireColumns,
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

  const underReviewCount = activeRows.length - needsActionCount;

  const statCards = [
    {
      label: 'All Requests',
      value: activeRows.length,
      Icon: HowToRegIcon,
      cls: classes.statCard0,
      color: '#4f46e5',
      tabIndex: 0,
      sub1: needsActionCount,
      sub1Label: 'pending',
      sub1Color: '#d97706',
      sub2: underReviewCount,
      sub2Label: 'in review',
      sub2Color: '#2563eb',
    },
    {
      label: 'Driver Hire',
      value: pendingDriverHireRows.length,
      Icon: HailIcon,
      cls: classes.statCard2,
      color: '#16a34a',
      tabIndex: 2,
      sub1: pendingDriverHireRows.length,
      sub1Label: 'pending',
      sub1Color: '#d97706',
      sub2: driverHireRows.length - pendingDriverHireRows.length,
      sub2Label: 'processed',
      sub2Color: '#16a34a',
    },
    {
      label: 'Vehicle Rental',
      value: pendingVehicleRentalRows.length,
      Icon: CarRentalIcon,
      cls: classes.statCard4,
      color: '#7c3aed',
      tabIndex: 3,
      sub1: pendingVehicleRentalRows.length,
      sub1Label: 'pending',
      sub1Color: '#d97706',
      sub2: vehicleRentalRows.length - pendingVehicleRentalRows.length,
      sub2Label: 'processed',
      sub2Color: '#16a34a',
    },
    {
      label: 'Mechanic Hire',
      value: pendingMechanicHireRows.length,
      Icon: BuildIcon,
      cls: classes.statCard7,
      color: '#ea580c',
      tabIndex: 4,
      sub1: pendingMechanicHireRows.length,
      sub1Label: 'pending',
      sub1Color: '#d97706',
      sub2: mechanicHireRows.length - pendingMechanicHireRows.length,
      sub2Label: 'processed',
      sub2Color: '#16a34a',
    },
    {
      label: 'Users',
      value: pendingUserRows.length,
      Icon: PersonAddIcon,
      cls: classes.statCard5,
      color: '#0891b2',
      tabIndex: 1,
      sub1: pendingUserRows.length,
      sub1Label: 'pending',
      sub1Color: '#d97706',
      sub2: userRows.length - pendingUserRows.length,
      sub2Label: 'processed',
      sub2Color: '#16a34a',
    },
    {
      label: 'Pending',
      value: needsActionCount,
      Icon: PendingActionsIcon,
      cls: classes.statCard3,
      color: '#dc2626',
      tabIndex: 5,
      sub1: needsActionCount,
      sub1Label: 'pending',
      sub1Color: '#dc2626',
      sub2: underReviewCount,
      sub2Label: 'in review',
      sub2Color: '#2563eb',
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
                    cursor: 'pointer',
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
                      gap: '4px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        flex: '1 1 0',
                        minWidth: 0,
                      }}
                    >
                      <Box
                        className={classes.statSubDot}
                        sx={{
                          background: sub1Color,
                          boxShadow: `0 0 6px ${sub1Color}`,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        className={classes.statSub}
                        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        <span style={{ color: sub1Color, fontWeight: 700 }}>{sub1}</span>
                        {` ${sub1Label}`}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        flex: '1 1 0',
                        minWidth: 0,
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Box
                        className={classes.statSubDot}
                        sx={{
                          background: sub2Color,
                          boxShadow: `0 0 6px ${sub2Color}`,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        className={classes.statSub}
                        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
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

        {/* Tab 0: All Customers */}
        {tabLists.map((list, idx) => (
          <TabPanel key={idx} value={tabValue} index={idx}>
            {getFilteredData(list).length === 0 ? (
              <Box className={classes.emptyState}>
                <PendingActionsIcon className={classes.emptyIcon} />
                <Typography variant='h6' color='text.secondary'>
                  {tableSearch ? 'No matching requests' : 'No customer requests found'}
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

        {/* Tab 1: Users */}
        <TabPanel value={tabValue} index={1}>
          {userRows.length === 0 ? (
            <Box className={classes.emptyState}>
              <PersonAddIcon className={classes.emptyIcon} />
              <Typography variant='h6' color='text.secondary'>
                {tableSearch ? 'No matching users' : 'No user registrations found'}
              </Typography>
            </Box>
          ) : (
            <Box className={classes.tableContainer}>
              <DataTable
                columns={columns}
                data={getFilteredData(userRows)}
                rowKey='id'
                searchable={false}
                initialRowsPerPage={10}
              />
            </Box>
          )}
        </TabPanel>

        {/* Tab 2: Driver Hire */}
        <TabPanel value={tabValue} index={2}>
          <Box className={classes.tableContainer}>
            <DataTable
              columns={driverHireColumns}
              data={driverHireRows}
              rowKey='id'
              searchable={false}
              initialRowsPerPage={10}
            />
          </Box>
        </TabPanel>

        {/* Tab 3: Vehicle Rental */}
        <TabPanel value={tabValue} index={3}>
          <Box className={classes.tableContainer}>
            <DataTable
              columns={vehicleRentalColumns}
              data={vehicleRentalRows}
              rowKey='id'
              searchable={false}
              initialRowsPerPage={10}
            />
          </Box>
        </TabPanel>

        {/* Tab 4: Mechanic Hire */}
        <TabPanel value={tabValue} index={4}>
          <Box className={classes.tableContainer}>
            <DataTable
              columns={mechanicHireColumns}
              data={mechanicHireRows}
              rowKey='id'
              searchable={false}
              initialRowsPerPage={10}
            />
          </Box>
        </TabPanel>

        {/* Tab 5: Pending */}
        <TabPanel value={tabValue} index={5}>
          {getFilteredData(pendingRows).length === 0 ? (
            <Box className={classes.emptyState}>
              <PendingActionsIcon className={classes.emptyIcon} />
              <Typography variant='h6' color='text.secondary'>
                {tableSearch ? 'No matching requests' : 'No pending requests'}
              </Typography>
            </Box>
          ) : (
            <Box className={classes.tableContainer}>
              <DataTable
                columns={columns}
                data={getFilteredData(pendingRows)}
                rowKey='id'
                searchable={false}
                initialRowsPerPage={10}
              />
            </Box>
          )}
        </TabPanel>
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
