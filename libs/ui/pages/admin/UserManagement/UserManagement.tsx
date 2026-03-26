import { Box, Loader, DataTable } from '@bandi/component';
import { Typography, Grid, Tabs, Tab, Divider, TextField, InputAdornment } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SearchIcon from '@mui/icons-material/Search';
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
  const approvedOnboardings = managedOnboardings.filter((r) => (r as any).status === 'approved');
  const rejectedOnboardings = managedOnboardings.filter((r) => (r as any).status === 'rejected');

  // Dynamic vehicle-type tabs from approved customers
  const vehicleTypes = [
    ...new Set(managedOnboardings.map((r) => (r.vehicleType || '').toLowerCase()).filter(Boolean)),
  ].sort();

  // All tab-lists: [All, Approved, Rejected, ...vehicle types]
  const tabLists = [
    managedOnboardings,
    approvedOnboardings,
    rejectedOnboardings,
    ...vehicleTypes.map((vt) =>
      managedOnboardings.filter((r) => (r.vehicleType || '').toLowerCase() === vt),
    ),
  ];

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
      label: 'Total Customers',
      value: managedOnboardings.length,
      Icon: GroupIcon,
      cls: classes.statCard0,
      sub: 'Approved & rejected customers',
      color: '#4f46e5',
    },
    {
      label: 'Approved',
      value: approvedOnboardings.length,
      Icon: CheckCircleOutlineIcon,
      cls: classes.statCard1,
      sub: 'Active customers',
      color: '#10b981',
    },
    {
      label: 'Rejected',
      value: rejectedOnboardings.length,
      Icon: CancelOutlinedIcon,
      cls: classes.statCard2,
      sub: 'Declined registrations',
      color: '#ef4444',
    },
    {
      label: 'Vehicle Types',
      value: vehicleTypes.length,
      Icon: DirectionsCarIcon,
      cls: classes.statCard3,
      sub: 'Distinct vehicle categories',
      color: '#0ea5e9',
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
            <Tab icon={<GroupIcon />} iconPosition='start' label={isMobile ? undefined : 'All'} />
            <Tab
              icon={<CheckCircleOutlineIcon />}
              iconPosition='start'
              label={isMobile ? undefined : 'Approved'}
            />
            <Tab
              icon={<CancelOutlinedIcon />}
              iconPosition='start'
              label={isMobile ? undefined : 'Rejected'}
            />
            {vehicleTypes.map((vt) => (
              <Tab
                key={vt}
                icon={
                  vt.includes('bus') || vt.includes('mobility') ? (
                    <DirectionsBusIcon />
                  ) : vt.includes('truck') || vt.includes('lorry') || vt.includes('cargo') ? (
                    <LocalShippingIcon />
                  ) : (
                    <DirectionsCarIcon />
                  )
                }
                iconPosition='start'
                label={isMobile ? undefined : vt.charAt(0).toUpperCase() + vt.slice(1)}
              />
            ))}
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

        {/* ── Tab panels (All / Approved / Rejected / ...vehicle types) ── */}
        {tabLists.map((list, idx) => {
          const filteredData = tableSearch
            ? list.filter((row) =>
                Object.values(row).some(
                  (val) =>
                    val !== null &&
                    val !== undefined &&
                    String(val).toLowerCase().includes(tableSearch.toLowerCase()),
                ),
              )
            : list;
          return (
            <TabPanel key={idx} value={tabValue} index={idx}>
              <Box className={classes.tableContainer}>
                <DataTable
                  columns={columns}
                  data={filteredData}
                  rowKey='id'
                  searchable={false}
                  initialRowsPerPage={10}
                  onRowClick={handleOnboardingRowClick}
                  activeRowKey={selectedOnboarding?.id}
                />
              </Box>
            </TabPanel>
          );
        })}

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
