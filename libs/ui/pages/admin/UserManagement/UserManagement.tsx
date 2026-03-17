import { Box, Loader, DataTable } from '@bandi/component';
import {
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  Paper,
  Divider,
  Link,
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CarRentalIcon from '@mui/icons-material/CarRental';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import LoginIcon from '@mui/icons-material/Login';
import LockResetIcon from '@mui/icons-material/LockReset';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TabPanel from './components/TabPanel';
import useUserManagement from './hooks/useUserManagement';
import EditUserDialog from './dialogs/EditUserDialog/EditUserDialog';
import CreateUserDialog from './dialogs/CreateUserDialog/CreateUserDialog';
import ChangesLogDialog from './dialogs/ChangesLogDialog/ChangesLogDialog';
import LoginDataDialog from './dialogs/LoginDataDialog/LoginDataDialog';
import ChangeProfileDialog from './dialogs/ChangeProfileDialog/ChangeProfileDialog';
import ResetPasswordDialog from './dialogs/ResetPasswordDialog/ResetPasswordDialog';
import { useStyles } from './styles';

const UserManagement = () => {
  const { classes } = useStyles();

  const {
    // table
    allUsers,
    admins,
    captains,
    driverHireRequests,
    vehicleRentalRequests,
    isLoading,
    isMobile,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    selectedRow,
    setSelectedRow,
    handleRowClick,
    columns,
    driverHireColumns,
    vehicleRentalColumns,
    getTableData,
    draftRow,
    currentUser,
    // edit
    editOpen,
    setEditOpen,
    editForm,
    setEditForm,
    isSavingEdit,
    isDirty,
    adminNotes,
    setAdminNotes,
    handleOpenEdit,
    handleSaveEdit,
    // create
    createOpen,
    isOpenedAsDraft,
    setIsOpenedAsDraft,
    draftMeta,
    setDraftMeta,
    draftValues,
    setDraftValues,
    genPassword,
    showGenPw,
    setShowGenPw,
    createFormik,
    handleOpenNew,
    handleOpenDraft,
    handleRegeneratePw,
    handleApplyGenPw,
    handleSaveDraft,
    handleCancelCreate,
    reqError,
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
  const regularUsersCount = allUsers.filter((u) => u.role === 'user').length;

  const keyframes = (
    <GlobalStyles
      styles={`
        @keyframes um-gradient-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes um-orb-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25%  { transform: translate(22px, -18px) scale(1.06); }
          75%  { transform: translate(-16px, 12px) scale(0.94); }
        }
        @keyframes um-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          40%  { transform: translateY(-18px) rotate(6deg); }
          70%  { transform: translateY(-9px) rotate(-3deg); }
        }
        @keyframes um-slide-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes um-counter {
          from { opacity: 0; transform: scale(0.65) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes um-pulse-live {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 8px #4ade80; }
          50%  { opacity: 0.55; transform: scale(1.35); box-shadow: 0 0 18px rgba(74,222,128,0.6); }
        }
        @keyframes um-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}
    />
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
    {
      label: 'Total Users',
      value: allUsers.length,
      Icon: GroupIcon,
      cls: classes.statCard0,
      sub: 'Platform Registrations',
      color: '#4f46e5',
    },
    {
      label: 'Admins',
      value: admins.length,
      Icon: AdminPanelSettingsIcon,
      cls: classes.statCard1,
      sub: 'Platform Administrators',
      color: '#f59e0b',
    },
    {
      label: 'Captains',
      value: captains.length,
      Icon: BusinessCenterIcon,
      cls: classes.statCard2,
      sub: 'Service Providers',
      color: '#10b981',
    },
    {
      label: 'Regular Users',
      value: regularUsersCount,
      Icon: PersonIcon,
      cls: classes.statCard3,
      sub: 'Booking & travelling Users',
      color: '#0ea5e9',
    },
    {
      label: 'Driver Hire',
      value: driverHireRequests.length,
      Icon: PersonSearchIcon,
      cls: classes.statCard4,
      sub: 'Driver hire requests',
      color: '#7c3aed',
    },
    {
      label: 'Vehicle Rental',
      value: vehicleRentalRequests.length,
      Icon: CarRentalIcon,
      cls: classes.statCard5,
      sub: 'Vehicle rental requests',
      color: '#0f766e',
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
              User Management
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
              icon={<AdminPanelSettingsIcon />}
              iconPosition='start'
              label={isMobile ? undefined : 'Admins'}
            />
            <Tab
              icon={<BusinessCenterIcon />}
              iconPosition='start'
              label={isMobile ? undefined : 'Captains'}
            />
            <Tab
              icon={<PersonIcon />}
              iconPosition='start'
              label={isMobile ? undefined : 'Users'}
            />
            <Tab
              icon={<PersonSearchIcon />}
              iconPosition='start'
              label={isMobile ? undefined : 'Driver Hire'}
            />
            <Tab
              icon={<CarRentalIcon />}
              iconPosition='start'
              label={isMobile ? undefined : 'Vehicle Rental'}
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
            {/* Create NEW USER — visible when no row selected */}
            {!sel && (
              <Tooltip title='Create new user'>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<AddIcon />}
                  onClick={handleOpenNew}
                  sx={{
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    boxShadow: '0 4px 14px rgba(79,70,229,0.45)',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(79,70,229,0.55)' },
                    transition: 'all 0.22s ease',
                  }}
                >
                  <span className={classes.buttonLabel}>CREATE NEW USER</span>
                </Button>
              </Tooltip>
            )}

            {/* Open Draft — visible only when the draft row is selected */}
            {isDraft && draftValues && (
              <Tooltip title='Open saved draft'>
                <Button
                  size='small'
                  variant='contained'
                  color='info'
                  startIcon={<ScheduleIcon />}
                  onClick={handleOpenDraft}
                  sx={{
                    background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
                    boxShadow: '0 4px 14px rgba(14,165,233,0.45)',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(14,165,233,0.55)' },
                    transition: 'all 0.22s ease',
                  }}
                >
                  <span className={classes.buttonLabel}>Open Draft</span>
                </Button>
              </Tooltip>
            )}

            {/* Edit — replaces Create button when a real row is selected */}
            {sel && !isDraft && (
              <Tooltip title='Edit selected user'>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<EditIcon />}
                  onClick={handleOpenEdit}
                  sx={{
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    boxShadow: '0 4px 14px rgba(79,70,229,0.45)',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(79,70,229,0.55)' },
                    transition: 'all 0.22s ease',
                  }}
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
                  variant='outlined'
                  startIcon={<ManageAccountsIcon />}
                  disabled={!sel || isDraft}
                  onClick={handleOpenChangeProfile}
                  sx={{
                    borderColor: sel && !isDraft ? '#10b981' : undefined,
                    color: sel && !isDraft ? '#10b981' : undefined,
                    '&:hover': {
                      background: sel && !isDraft ? 'rgba(16,185,129,0.07)' : undefined,
                      transform: sel && !isDraft ? 'translateY(-2px)' : undefined,
                      boxShadow: sel && !isDraft ? '0 4px 14px rgba(16,185,129,0.28)' : undefined,
                    },
                    transition: 'all 0.22s ease',
                  }}
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
                  variant='outlined'
                  startIcon={<HistoryIcon />}
                  disabled={!sel || isDraft}
                  onClick={handleOpenChangesLog}
                  sx={{
                    borderColor: sel && !isDraft ? '#6d28d9' : undefined,
                    color: sel && !isDraft ? '#6d28d9' : undefined,
                    '&:hover': {
                      background: sel && !isDraft ? 'rgba(109,40,217,0.07)' : undefined,
                      transform: sel && !isDraft ? 'translateY(-2px)' : undefined,
                      boxShadow: sel && !isDraft ? '0 4px 14px rgba(109,40,217,0.28)' : undefined,
                    },
                    transition: 'all 0.22s ease',
                  }}
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
                  variant='outlined'
                  startIcon={<LoginIcon />}
                  disabled={!sel || isDraft}
                  onClick={() => setLoginDataOpen(true)}
                  sx={{
                    borderColor: sel && !isDraft ? '#0f766e' : undefined,
                    color: sel && !isDraft ? '#0f766e' : undefined,
                    '&:hover': {
                      background: sel && !isDraft ? 'rgba(15,118,110,0.07)' : undefined,
                      transform: sel && !isDraft ? 'translateY(-2px)' : undefined,
                      boxShadow: sel && !isDraft ? '0 4px 14px rgba(15,118,110,0.28)' : undefined,
                    },
                    transition: 'all 0.22s ease',
                  }}
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
                  variant='outlined'
                  color='error'
                  startIcon={<LockResetIcon />}
                  disabled={!sel || isDraft}
                  onClick={handleOpenResetPw}
                  sx={{
                    boxShadow: sel && !isDraft ? '0 4px 14px rgba(239,68,68,0.25)' : undefined,
                    '&:hover': {
                      transform: sel && !isDraft ? 'translateY(-2px)' : undefined,
                      boxShadow: sel && !isDraft ? '0 8px 24px rgba(239,68,68,0.4)' : undefined,
                    },
                    transition: 'all 0.22s ease',
                  }}
                >
                  <span className={classes.buttonLabel}>Reset Password</span>
                </Button>
              </span>
            </Tooltip>
          </Box>

          {/* Selection indicator */}
          {sel && (
            <Typography
              variant='caption'
              color='text.secondary'
              className={classes.selectionIndicator}
            >
              Selected: <strong>{sel.name}</strong> ({sel.email}) &nbsp;·&nbsp;
              <Link component='button' variant='caption' onClick={() => setSelectedRow(null)}>
                Clear
              </Link>
            </Typography>
          )}
        </Paper>

        {/* ── Tab panels with DataTable ── */}
        {[allUsers, admins, captains, allUsers.filter((u) => u.role === 'user')].map(
          (list, idx) => {
            const tableData =
              idx === 0 && draftRow
                ? [{ ...draftRow, sno: 1 }, ...getTableData(list, 2)]
                : getTableData(list);
            const filteredData = tableSearch
              ? tableData.filter((row) =>
                  Object.values(row).some(
                    (val) =>
                      val !== null &&
                      val !== undefined &&
                      String(val).toLowerCase().includes(tableSearch.toLowerCase()),
                  ),
                )
              : tableData;
            return (
              <TabPanel key={idx} value={tabValue} index={idx}>
                <Box className={classes.tableContainer}>
                  <DataTable
                    columns={columns}
                    data={filteredData}
                    rowKey='id'
                    searchable={false}
                    initialRowsPerPage={10}
                    onRowClick={handleRowClick}
                    activeRowKey={selectedRow?.id as number}
                  />
                </Box>
              </TabPanel>
            );
          },
        )}

        {/* ── Driver Hire tab panel ── */}
        <TabPanel value={tabValue} index={4}>
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
        <TabPanel value={tabValue} index={5}>
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

        {/* ════════════════════════════════════════════════════════════════
          DIALOGS
      ════════════════════════════════════════════════════════════════ */}

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
          onClose={handleCancelCreate}
          createFormik={createFormik}
          reqError={reqError}
          genPassword={genPassword}
          showGenPw={showGenPw}
          setShowGenPw={setShowGenPw}
          onRegeneratePw={handleRegeneratePw}
          onApplyGenPw={handleApplyGenPw}
          onSaveDraft={handleSaveDraft}
          draftMeta={draftMeta}
          setDraftMeta={setDraftMeta}
          setDraftValues={setDraftValues}
          isOpenedAsDraft={isOpenedAsDraft}
          setIsOpenedAsDraft={setIsOpenedAsDraft}
          adminNotes={adminNotes}
          setAdminNotes={setAdminNotes}
        />

        <ChangesLogDialog
          open={changesLogOpen}
          onClose={() => setChangesLogOpen(false)}
          selectedRow={selectedRow}
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
        />

        <ChangeProfileDialog
          open={changeProfileOpen}
          onClose={() => setChangeProfileOpen(false)}
          confirmOpen={changeProfileConfirmOpen}
          onConfirmClose={() => setChangeProfileConfirmOpen(false)}
          selectedRow={selectedRow}
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
