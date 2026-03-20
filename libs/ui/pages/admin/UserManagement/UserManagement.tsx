import { Box, Loader, DataTable } from '@bandi/component';
import {
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  Paper,
  Divider,
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import PersonIcon from '@mui/icons-material/Person';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CarRentalIcon from '@mui/icons-material/CarRental';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import LoginIcon from '@mui/icons-material/Login';
import LockResetIcon from '@mui/icons-material/LockReset';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
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
    parcelRequests,
    isLoading,
    isMobile,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    selectedRow,
    setSelectedRow,
    columns,
    driverHireColumns,
    vehicleRentalColumns,
    parcelColumns,
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

  const sel = selectedRow;
  const isDraft = (sel?.id as unknown as number) === -1;
  const isOnboardingTab = tabValue <= 2;
  const mobilityOnboardings = customerOnboardings.filter((r) => r.serviceCategory === 'mobility');
  const logisticsOnboardings = customerOnboardings.filter((r) => r.serviceCategory === 'logistics');

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
      label: 'Total Onboardings',
      value: customerOnboardings.length,
      Icon: GroupIcon,
      cls: classes.statCard0,
      sub: 'All submitted onboardings',
      color: '#4f46e5',
    },
    {
      label: 'Mobility',
      value: mobilityOnboardings.length,
      Icon: LocalTaxiIcon,
      cls: classes.statCard1,
      sub: 'Ride-hailing captains',
      color: '#10b981',
    },
    {
      label: 'Logistics',
      value: logisticsOnboardings.length,
      Icon: PersonIcon,
      cls: classes.statCard2,
      sub: 'Delivery captains',
      color: '#0ea5e9',
    },
    {
      label: 'Driver Hire',
      value: driverHireRequests.length,
      Icon: PersonSearchIcon,
      cls: classes.statCard3,
      sub: 'Driver hire requests',
      color: '#7c3aed',
    },
    {
      label: 'Vehicle Rental',
      value: vehicleRentalRequests.length,
      Icon: CarRentalIcon,
      cls: classes.statCard4,
      sub: 'Vehicle rental requests',
      color: '#0f766e',
    },
    {
      label: 'Parcel',
      value: parcelRequests.length,
      Icon: Inventory2Icon,
      cls: classes.statCard5,
      sub: 'Parcel delivery requests',
      color: '#b45309',
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
          {statCards.map(({ label, value, Icon, cls, sub, color }, idx) => (
            <Box
              key={label}
              className={`${classes.statCard} ${cls}`}
              sx={idx === 5 ? { borderLeft: '2px solid', borderColor: 'divider' } : undefined}
            >
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
              setSelectedRow(null);
            }}
            variant='scrollable'
            scrollButtons='auto'
            allowScrollButtonsMobile
            sx={{ flex: 1 }}
          >
            <Tab
              icon={<GroupIcon />}
              iconPosition='start'
              label={isMobile ? undefined : 'All Users'}
            />
            <Tab
              icon={<LocalTaxiIcon />}
              iconPosition='start'
              label={isMobile ? undefined : 'Captains'}
              sx={{ borderLeft: '1px solid', borderColor: 'divider' }}
            />
            <Tab
              icon={<PersonIcon />}
              iconPosition='start'
              label={isMobile ? undefined : 'End Users'}
              sx={{ borderLeft: '1px solid', borderColor: 'divider' }}
            />
            <Tab
              icon={<PersonSearchIcon />}
              iconPosition='start'
              label={isMobile ? undefined : 'Driver Hire'}
              sx={{ borderLeft: '1px solid', borderColor: 'divider' }}
            />
            <Tab
              icon={<CarRentalIcon />}
              iconPosition='start'
              label={isMobile ? undefined : 'Vehicle Rental'}
              sx={{ borderLeft: '1px solid', borderColor: 'divider' }}
            />
            <Tab
              icon={<Inventory2Icon />}
              iconPosition='start'
              label={isMobile ? undefined : 'Parcel'}
              sx={{ borderLeft: '1px solid', borderColor: 'divider' }}
            />
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

        {/* ── Action toolbar ── */}
        <Paper variant='outlined' className={classes.toolbar}>
          <Box className={classes.toolbarStack}>
            {/* Create NEW — visible when no row selected in current context */}
            {((isOnboardingTab && !selectedOnboarding) || (!isOnboardingTab && !sel)) && (
              <Tooltip title='Create new user'>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<AddIcon />}
                  onClick={handleOpenNew}
                  className={classes.btnCreate}
                >
                  <span className={classes.buttonLabel}>CREATE NEW USER</span>
                </Button>
              </Tooltip>
            )}

            {/* Edit — for onboarding rows (tabs 0-2) */}
            {isOnboardingTab && selectedOnboarding && (
              <Tooltip title='Edit selected onboarding'>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<EditIcon />}
                  onClick={handleOpenEditOnboarding}
                  className={classes.btnCreate}
                >
                  <span className={classes.buttonLabel}>Edit</span>
                </Button>
              </Tooltip>
            )}

            {/* Edit — for user rows (tabs 3-5) */}
            {!isOnboardingTab && sel && !isDraft && (
              <Tooltip title='Edit selected user'>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<EditIcon />}
                  onClick={handleOpenEdit}
                  className={classes.btnCreate}
                >
                  <span className={classes.buttonLabel}>Edit</span>
                </Button>
              </Tooltip>
            )}

            {!isMobile && (
              <Divider orientation='vertical' flexItem className={classes.dividerMobile} />
            )}

            {/* Change Profile */}
            <Tooltip
              title={
                sel && !isDraft
                  ? 'Change user role / profile'
                  : isDraft
                    ? 'Cannot change profile for a draft'
                    : 'Select a user first'
              }
            >
              <span>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<ManageAccountsIcon />}
                  disabled={!sel || isDraft}
                  onClick={handleOpenChangeProfile}
                  className={classes.btnChangeProfile}
                >
                  <span className={classes.buttonLabel}>Change Profile</span>
                </Button>
              </span>
            </Tooltip>

            {!isMobile && (
              <Divider orientation='vertical' flexItem className={classes.dividerMobile} />
            )}

            {/* Changes Log */}
            <Tooltip
              title={
                sel && !isDraft
                  ? 'View change history'
                  : isDraft
                    ? 'No change history for a draft'
                    : 'Select a user first'
              }
            >
              <span>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<HistoryIcon />}
                  disabled={!sel || isDraft}
                  onClick={handleOpenChangesLog}
                  className={classes.btnChangesLog}
                >
                  <span className={classes.buttonLabel}>Changes Log</span>
                </Button>
              </span>
            </Tooltip>

            {/* Login Data */}
            <Tooltip
              title={
                sel && !isDraft
                  ? 'View login activity'
                  : isDraft
                    ? 'No login data for a draft'
                    : 'Select a user first'
              }
            >
              <span>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<LoginIcon />}
                  disabled={!sel || isDraft}
                  onClick={() => setLoginDataOpen(true)}
                  className={classes.btnLoginData}
                >
                  <span className={classes.buttonLabel}>Login Data</span>
                </Button>
              </span>
            </Tooltip>

            {!isMobile && (
              <Divider orientation='vertical' flexItem className={classes.dividerMobile} />
            )}

            {/* Reset Password */}
            <Tooltip
              title={
                sel && !isDraft
                  ? 'Manually reset user password'
                  : isDraft
                    ? 'Not available for a draft'
                    : 'Select a user first'
              }
            >
              <span>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<LockResetIcon />}
                  disabled={!sel || isDraft}
                  onClick={handleOpenResetPw}
                  className={classes.btnResetPassword}
                >
                  <span className={classes.buttonLabel}>Reset Password</span>
                </Button>
              </span>
            </Tooltip>
          </Box>

          {/* Selection indicator */}
          {sel && (
            <Box className={classes.selectionIndicator}>
              <Typography variant='caption' color='text.secondary'>
                Selected: <strong>{sel.name}</strong>
                {sel.email ? ` (${sel.email})` : ''}
              </Typography>
              <Button
                size='small'
                variant='outlined'
                startIcon={<HighlightOffIcon />}
                onClick={() => {
                  setSelectedRow(null);
                  setSelectedOnboarding(null);
                }}
                className={classes.btnClear}
              >
                Clear
              </Button>
            </Box>
          )}
        </Paper>

        {/* ── Onboarding tab panels (All / Mobility / Logistics) ── */}
        {[customerOnboardings, mobilityOnboardings, logisticsOnboardings].map((list, idx) => {
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

        {/* ── Driver Hire tab panel ── */}
        <TabPanel value={tabValue} index={3}>
          <Box className={classes.tableContainer}>
            <DataTable
              columns={driverHireColumns}
              data={(() => {
                const filtered = tableSearch
                  ? driverHireRequests.filter((row) =>
                      Object.values(row).some(
                        (val) =>
                          val !== null &&
                          val !== undefined &&
                          String(val).toLowerCase().includes(tableSearch.toLowerCase()),
                      ),
                    )
                  : driverHireRequests;
                return filtered.map((r, i) => ({ ...r, sno: i + 1 }));
              })()}
              rowKey='id'
              searchable={false}
              initialRowsPerPage={10}
            />
          </Box>
        </TabPanel>

        {/* ── Vehicle Rental tab panel ── */}
        <TabPanel value={tabValue} index={4}>
          <Box className={classes.tableContainer}>
            <DataTable
              columns={vehicleRentalColumns}
              data={(() => {
                const filtered = tableSearch
                  ? vehicleRentalRequests.filter((row) =>
                      Object.values(row).some(
                        (val) =>
                          val !== null &&
                          val !== undefined &&
                          String(val).toLowerCase().includes(tableSearch.toLowerCase()),
                      ),
                    )
                  : vehicleRentalRequests;
                return filtered.map((r, i) => ({ ...r, sno: i + 1 }));
              })()}
              rowKey='id'
              searchable={false}
              initialRowsPerPage={10}
            />
          </Box>
        </TabPanel>

        {/* ── Parcel tab panel ── */}
        <TabPanel value={tabValue} index={5}>
          <Box className={classes.tableContainer}>
            <DataTable
              columns={parcelColumns}
              data={(() => {
                const filtered = tableSearch
                  ? parcelRequests.filter((row) =>
                      Object.values(row).some(
                        (val) =>
                          val !== null &&
                          val !== undefined &&
                          String(val).toLowerCase().includes(tableSearch.toLowerCase()),
                      ),
                    )
                  : parcelRequests;
                return filtered.map((r, i) => ({ ...r, sno: i + 1 }));
              })()}
              rowKey='id'
              searchable={false}
              initialRowsPerPage={10}
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
