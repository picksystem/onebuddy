import { Box, Loader, DataTable } from '@bandi/component';
import { Typography, Grid, Tabs, Tab, Divider, TextField, InputAdornment } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SearchIcon from '@mui/icons-material/Search';
import TabPanel from './components/TabPanel';
import useAccessManagement from './hooks/useAccessManagement';
import EditUserDialog from './dialogs/EditUserDialog/EditUserDialog';
import CreateUserDialog from './dialogs/CreateUserDialog/CreateUserDialog';
import ChangesLogDialog from './dialogs/ChangesLogDialog/ChangesLogDialog';
import LoginDataDialog from './dialogs/LoginDataDialog/LoginDataDialog';
import ChangeProfileDialog from './dialogs/ChangeProfileDialog/ChangeProfileDialog';
import ResetPasswordDialog from './dialogs/ResetPasswordDialog/ResetPasswordDialog';
import { useStyles } from './styles';
import { useAdminKeyframes } from '@bandi/hooks';

const AccessManagement = () => {
  const { classes } = useStyles();
  const keyframes = useAdminKeyframes();

  const {
    // table
    allUsers,
    admins,
    consultants,
    isLoading,
    isMobile,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    selectedRow,
    setSelectedRow,
    handleRowSelect,
    columns,
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
  } = useAccessManagement();

  const sel = selectedRow;
  const isDraft = (sel?.id as unknown as number) === -1;

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
      label: 'Consultants',
      value: consultants.length,
      Icon: QueryStatsIcon,
      cls: classes.statCard2,
      sub: 'Platform Consultants',
      color: '#10b981',
    },
  ];

  return (
    <>
      {keyframes}
      <Grid className={classes.container}>
        {/* ── Page header ── */}
        <Box className={classes.pageHeader}>
          <Box className={classes.headerOrb3} />
          <Box className={classes.pageHeaderRow}>
            <Typography variant='h5' className={classes.title}>
              Access Management
            </Typography>
          </Box>
          <Typography variant='body2' className={classes.description}>
            View and manage all users and their access across different roles in the system.
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
              icon={<QueryStatsIcon />}
              iconPosition='start'
              label={isMobile ? undefined : 'Consultants'}
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

        {/* ── Tab panels with DataTable ── */}
        {[allUsers, admins, consultants].map((list, idx) => {
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
                  onRowClick={handleRowSelect}
                  activeRowKey={selectedRow?.id as number}
                />
              </Box>
            </TabPanel>
          );
        })}

        {/* ── Dialogs ── */}
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

export default AccessManagement;
