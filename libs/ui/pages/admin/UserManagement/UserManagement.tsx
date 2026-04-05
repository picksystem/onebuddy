import { Box, Loader, DataTable } from '@bandi/component';
import { Typography, Grid, Tabs, Tab, Divider, TextField, InputAdornment } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SearchIcon from '@mui/icons-material/Search';
import HailIcon from '@mui/icons-material/Hail';
import CarRentalIcon from '@mui/icons-material/CarRental';
import BuildIcon from '@mui/icons-material/Build';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TabPanel from './components/TabPanel';
import useUserManagement from './hooks/useUserManagement';
import EditUserDialog from './dialogs/EditUserDialog/EditUserDialog';
import EditOnboardingDialog from './dialogs/EditOnboardingDialog/EditOnboardingDialog';
import CreateUserDialog from './dialogs/CreateUserDialog/CreateUserDialog';
import ChangesLogDialog from './dialogs/ChangesLogDialog/ChangesLogDialog';
import LoginDataDialog from './dialogs/LoginDataDialog/LoginDataDialog';
import ChangeProfileDialog from './dialogs/ChangeProfileDialog/ChangeProfileDialog';
import ResetPasswordDialog from './dialogs/ResetPasswordDialog/ResetPasswordDialog';
import { useStyles } from './styles';
import { useAdminKeyframes } from '@bandi/hooks';

const UserManagement = () => {
  const { classes } = useStyles();
  const keyframes = useAdminKeyframes();

  const {
    // table
    customerOnboardings,
    selectedOnboarding,
    setSelectedOnboarding,
    handleOnboardingRowClick,
    // edit onboarding
    editOnboardingOpen,
    setEditOnboardingOpen,
    editOnboardingForm,
    setEditOnboardingForm,
    isSavingOnboarding,
    isOnboardingDirty,
    handleOpenEditOnboarding,
    handleSaveEditOnboarding,
    driverHireRequests,
    vehicleRentalRequests,
    mechanicHireRequests,
    driverHireColumns,
    vehicleRentalColumns,
    mechanicHireColumns,
    isLoading,
    isMobile,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    selectedRow,
    setSelectedRow,
    columns,
    currentUser,
    // edit
    editOpen,
    setEditOpen,
    editForm,
    setEditForm,
    isSavingEdit,
    isDirty,
    handleOpenEdit,
    handleSaveEdit,
    // create
    createOpen,
    setCreateOpen,
    handleOpenNew,
    handleCreateSubmit,
    // changes log
    changesLogOpen,
    setChangesLogOpen,
    changeLog,
    isLoadingLog,
    logSearch,
    setLogSearch,
    logDateFrom,
    setLogDateFrom,
    logDateTo,
    setLogDateTo,
    logFilterField,
    setLogFilterField,
    logFilterReason,
    setLogFilterReason,
    logSortBy,
    logSortOrder,
    logPage,
    setLogPage,
    logRowsPerPage,
    setLogRowsPerPage,
    logMaximized,
    setLogMaximized,
    logShowFilters,
    setLogShowFilters,
    uniqueLogFields,
    filteredLog,
    paginatedLog,
    hasLogFilters,
    handleOpenChangesLog,
    handleLogSort,
    clearLogFilters,
    handleExportCsv,
    // login data
    loginDataOpen,
    setLoginDataOpen,
    // change profile
    changeProfileOpen,
    setChangeProfileOpen,
    changeProfileMode,
    changeProfileRole,
    setChangeProfileRole,
    changeProfileReasonCode,
    setChangeProfileReasonCode,
    changeProfileNoteText,
    setChangeProfileNoteText,
    changeProfileAttachment,
    setChangeProfileAttachment,
    changeProfileErrors,
    setChangeProfileErrors,
    changeProfileConfirmOpen,
    setChangeProfileConfirmOpen,
    isSavingProfile,
    changeProfileNoteRef,
    attachmentInputRef,
    handleOpenChangeProfile,
    handleChangeProfileSubmit,
    handleSaveChangeProfile,
    // reset password
    resetPwOpen,
    setResetPwOpen,
    newPassword,
    setNewPassword,
    newPasswordConfirm,
    setNewPasswordConfirm,
    isResettingPw,
    resetPwMode,
    setResetPwMode,
    autoResetPw,
    setAutoResetPw,
    showAutoResetPw,
    setShowAutoResetPw,
    showManualPw,
    setShowManualPw,
    showManualPwConfirm,
    setShowManualPwConfirm,
    resetPwForceChange,
    setResetPwForceChange,
    resetPwReason,
    setResetPwReason,
    resetPwErrors,
    setResetPwErrors,
    handleOpenResetPw,
    handleResetPassword,
  } = useUserManagement();

  // Only show approved / rejected in Customer Management — pending/under_review are in Customer Requests
  const managedOnboardings = customerOnboardings.filter(
    (r) => (r as any).status === 'approved' || (r as any).status === 'rejected',
  );
  const userOnboardings = managedOnboardings.filter((r) => r.serviceCategory === 'user');
  const draftOnboardings = customerOnboardings.filter((r) => (r as any).status === 'pending');

  const filterRows = <T extends object>(list: T[]) =>
    tableSearch
      ? list.filter((row) =>
          Object.values(row as Record<string, unknown>).some(
            (val) =>
              val !== null &&
              val !== undefined &&
              String(val).toLowerCase().includes(tableSearch.toLowerCase()),
          ),
        )
      : list;

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

  const approvedManaged = managedOnboardings.filter((r) => (r as any).status === 'approved').length;
  const approvedUsers = userOnboardings.filter((r) => (r as any).status === 'approved').length;
  const activeDriverHire = driverHireRequests.filter(
    (r) => r.status !== 'pending' && r.status !== 'rejected',
  ).length;
  const activeVehicleRental = vehicleRentalRequests.filter(
    (r) => r.status !== 'pending' && r.status !== 'rejected',
  ).length;
  const activeMechanicHire = mechanicHireRequests.filter(
    (r) => r.status !== 'pending' && r.status !== 'rejected',
  ).length;

  const statCards = [
    {
      label: 'All Customers',
      value: managedOnboardings.length,
      Icon: GroupIcon,
      cls: classes.statCard0,
      color: '#4f46e5',
      sub1: approvedManaged,
      sub1Label: 'approved',
      sub1Color: '#10b981',
      sub2: managedOnboardings.length - approvedManaged,
      sub2Label: 'rejected',
      sub2Color: '#ef4444',
    },
    {
      label: 'Driver Hire',
      value: driverHireRequests.length,
      Icon: HailIcon,
      cls: classes.statCard2,
      color: '#10b981',
      sub1: activeDriverHire,
      sub1Label: 'active',
      sub1Color: '#10b981',
      sub2: driverHireRequests.filter((r) => r.status === 'pending').length,
      sub2Label: 'pending',
      sub2Color: '#d97706',
    },
    {
      label: 'Vehicle Rental',
      value: vehicleRentalRequests.length,
      Icon: CarRentalIcon,
      cls: classes.statCard4,
      color: '#7c3aed',
      sub1: activeVehicleRental,
      sub1Label: 'active',
      sub1Color: '#10b981',
      sub2: vehicleRentalRequests.filter((r) => r.status === 'pending').length,
      sub2Label: 'pending',
      sub2Color: '#d97706',
    },
    {
      label: 'Mechanic Hire',
      value: mechanicHireRequests.length,
      Icon: BuildIcon,
      cls: classes.statCard7,
      color: '#ea580c',
      sub1: activeMechanicHire,
      sub1Label: 'active',
      sub1Color: '#10b981',
      sub2: mechanicHireRequests.filter((r) => r.status === 'pending').length,
      sub2Label: 'pending',
      sub2Color: '#d97706',
    },
    {
      label: 'Users',
      value: userOnboardings.length,
      Icon: PersonAddIcon,
      cls: classes.statCard5,
      color: '#0891b2',
      sub1: approvedUsers,
      sub1Label: 'approved',
      sub1Color: '#10b981',
      sub2: userOnboardings.length - approvedUsers,
      sub2Label: 'rejected',
      sub2Color: '#ef4444',
    },
    {
      label: 'Draft',
      value: draftOnboardings.length,
      Icon: EditNoteIcon,
      cls: classes.statCard3,
      color: '#0ea5e9',
      sub1: draftOnboardings.length,
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
      <Grid className={classes.container}>
        {/* ── Page header ── */}
        <Box className={classes.pageHeader}>
          {/* Floating ambient orb */}
          <Box className={classes.headerOrb3} />

          <Box className={classes.pageHeaderRow}>
            <Typography variant='h5' className={classes.title}>
              Customer Management
            </Typography>
          </Box>
          <Typography variant='body2' className={classes.description}>
            View and manage all users across different roles in the system.
          </Typography>
        </Box>

        {/* ── Stat Cards ── */}
        <Box className={classes.statsGrid}>
          {statCards.map(
            (
              {
                label,
                value,
                Icon,
                cls,
                color,
                sub1,
                sub1Label,
                sub1Color,
                sub2,
                sub2Label,
                sub2Color,
              },
              idx,
            ) => {
              const isActive = tabValue === idx;
              return (
                <Box
                  key={label}
                  className={`${classes.statCard} ${cls}`}
                  onClick={() => {
                    setTabValue(idx);
                    setTableSearch('');
                    setSelectedOnboarding(null);
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

        {/* ── Tabs + Search ── */}
        <Box className={classes.tabsBox}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => {
              setTabValue(v);
              setTableSearch('');
              setSelectedOnboarding(null);
            }}
            variant='scrollable'
            scrollButtons='auto'
            allowScrollButtonsMobile
            sx={{ flex: 1 }}
          >
            <Tab icon={<GroupIcon />} iconPosition='start' label='All Customers' />
            <Tab icon={<HailIcon />} iconPosition='start' label='Driver Hire' />
            <Tab icon={<CarRentalIcon />} iconPosition='start' label='Vehicle Rental' />
            <Tab icon={<BuildIcon />} iconPosition='start' label='Mechanic Hire' />
            <Tab icon={<PersonAddIcon />} iconPosition='start' label='Users' />
            <Tab icon={<EditNoteIcon />} iconPosition='start' label='Draft' />
          </Tabs>
          <TextField
            placeholder='Search...'
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className={classes.tabsSearchField}
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

        {/* ── Tab panels ── */}
        {/* 0: All Customers */}
        <TabPanel value={tabValue} index={0}>
          <Box className={classes.tableContainer}>
            <DataTable
              columns={columns}
              data={filterRows(managedOnboardings)}
              rowKey='id'
              searchable={false}
              initialRowsPerPage={10}
              onRowClick={handleOnboardingRowClick}
              activeRowKey={selectedOnboarding?.id}
            />
          </Box>
        </TabPanel>

        {/* 1: Driver Hire */}
        <TabPanel value={tabValue} index={1}>
          <Box className={classes.tableContainer}>
            <DataTable
              columns={driverHireColumns}
              data={filterRows(driverHireRequests)}
              rowKey='id'
              searchable={false}
              initialRowsPerPage={10}
            />
          </Box>
        </TabPanel>

        {/* 2: Vehicle Rental */}
        <TabPanel value={tabValue} index={2}>
          <Box className={classes.tableContainer}>
            <DataTable
              columns={vehicleRentalColumns}
              data={filterRows(vehicleRentalRequests)}
              rowKey='id'
              searchable={false}
              initialRowsPerPage={10}
            />
          </Box>
        </TabPanel>

        {/* 3: Mechanic Hire */}
        <TabPanel value={tabValue} index={3}>
          <Box className={classes.tableContainer}>
            <DataTable
              columns={mechanicHireColumns}
              data={filterRows(mechanicHireRequests)}
              rowKey='id'
              searchable={false}
              initialRowsPerPage={10}
            />
          </Box>
        </TabPanel>

        {/* 4: Users */}
        <TabPanel value={tabValue} index={4}>
          <Box className={classes.tableContainer}>
            <DataTable
              columns={columns}
              data={filterRows(userOnboardings)}
              rowKey='id'
              searchable={false}
              initialRowsPerPage={10}
              onRowClick={handleOnboardingRowClick}
              activeRowKey={selectedOnboarding?.id}
            />
          </Box>
        </TabPanel>

        {/* 5: Draft */}
        <TabPanel value={tabValue} index={5}>
          <Box className={classes.tableContainer}>
            <DataTable
              columns={columns}
              data={filterRows(draftOnboardings)}
              rowKey='id'
              searchable={false}
              initialRowsPerPage={10}
              onRowClick={handleOnboardingRowClick}
              activeRowKey={selectedOnboarding?.id}
            />
          </Box>
        </TabPanel>

        {/* ════════════════════════════════════════════════════════════════
          DIALOGS
      ════════════════════════════════════════════════════════════════ */}

        <EditOnboardingDialog
          open={editOnboardingOpen}
          onClose={() => setEditOnboardingOpen(false)}
          selectedOnboarding={selectedOnboarding}
          editForm={editOnboardingForm}
          onFormChange={setEditOnboardingForm}
          isSaving={isSavingOnboarding}
          isDirty={isOnboardingDirty}
          onSave={handleSaveEditOnboarding}
        />

        <EditUserDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          selectedRow={selectedRow}
          editForm={editForm}
          onFormChange={setEditForm}
          isSaving={isSavingEdit}
          isDirty={isDirty}
          onSave={handleSaveEdit}
          currentUserId={currentUser?.id}
        />

        <CreateUserDialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSubmit={handleCreateSubmit}
        />

        <ChangesLogDialog
          open={changesLogOpen}
          onClose={() => setChangesLogOpen(false)}
          selectedRow={selectedRow}
          selectedOnboarding={selectedOnboarding}
          isLoadingLog={isLoadingLog}
          changeLog={changeLog}
          logSearch={logSearch}
          onLogSearchChange={setLogSearch}
          logDateFrom={logDateFrom}
          onLogDateFromChange={setLogDateFrom}
          logDateTo={logDateTo}
          onLogDateToChange={setLogDateTo}
          logFilterField={logFilterField}
          onLogFilterFieldChange={setLogFilterField}
          logFilterReason={logFilterReason}
          onLogFilterReasonChange={setLogFilterReason}
          logSortBy={logSortBy}
          logSortOrder={logSortOrder}
          logPage={logPage}
          onLogPageChange={setLogPage}
          logRowsPerPage={logRowsPerPage}
          onLogRowsPerPageChange={setLogRowsPerPage}
          logMaximized={logMaximized}
          onLogMaximizedChange={setLogMaximized}
          logShowFilters={logShowFilters}
          onLogShowFiltersChange={setLogShowFilters}
          uniqueLogFields={uniqueLogFields}
          filteredLog={filteredLog}
          paginatedLog={paginatedLog}
          hasLogFilters={hasLogFilters}
          onLogSort={handleLogSort}
          onClearLogFilters={clearLogFilters}
          onExportCsv={handleExportCsv}
        />

        <LoginDataDialog
          open={loginDataOpen}
          onClose={() => setLoginDataOpen(false)}
          selectedRow={selectedRow}
          selectedOnboarding={selectedOnboarding}
        />

        <ChangeProfileDialog
          open={changeProfileOpen}
          onClose={() => setChangeProfileOpen(false)}
          confirmOpen={changeProfileConfirmOpen}
          onConfirmClose={() => setChangeProfileConfirmOpen(false)}
          selectedRow={selectedRow}
          selectedOnboarding={selectedOnboarding}
          mode={changeProfileMode}
          changeProfileRole={changeProfileRole}
          onRoleChange={setChangeProfileRole}
          changeProfileReasonCode={changeProfileReasonCode}
          onReasonCodeChange={setChangeProfileReasonCode}
          changeProfileNoteText={changeProfileNoteText}
          onNoteTextChange={setChangeProfileNoteText}
          changeProfileAttachment={changeProfileAttachment}
          onAttachmentChange={setChangeProfileAttachment}
          changeProfileErrors={changeProfileErrors}
          onErrorsChange={setChangeProfileErrors}
          isSaving={isSavingProfile}
          noteRef={changeProfileNoteRef}
          attachmentInputRef={attachmentInputRef}
          onSubmit={handleChangeProfileSubmit}
          onConfirmSave={handleSaveChangeProfile}
        />

        <ResetPasswordDialog
          open={resetPwOpen}
          onClose={() => setResetPwOpen(false)}
          selectedRow={selectedRow}
          selectedOnboarding={selectedOnboarding}
          resetPwMode={resetPwMode}
          onModeChange={setResetPwMode}
          autoResetPw={autoResetPw}
          onAutoResetPwChange={setAutoResetPw}
          showAutoResetPw={showAutoResetPw}
          onShowAutoResetPwChange={setShowAutoResetPw}
          newPassword={newPassword}
          onNewPasswordChange={setNewPassword}
          newPasswordConfirm={newPasswordConfirm}
          onNewPasswordConfirmChange={setNewPasswordConfirm}
          showManualPw={showManualPw}
          onShowManualPwChange={setShowManualPw}
          showManualPwConfirm={showManualPwConfirm}
          onShowManualPwConfirmChange={setShowManualPwConfirm}
          resetPwForceChange={resetPwForceChange}
          onForceChangeChange={setResetPwForceChange}
          resetPwReason={resetPwReason}
          onReasonChange={setResetPwReason}
          resetPwErrors={resetPwErrors}
          onErrorsChange={setResetPwErrors}
          isResetting={isResettingPw}
          onReset={handleResetPassword}
        />
      </Grid>
    </>
  );
};

export default UserManagement;
