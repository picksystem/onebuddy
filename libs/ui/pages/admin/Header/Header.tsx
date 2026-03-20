import {
  AppBar,
  Badge,
  Backdrop,
  CircularProgress,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Box } from '@bandi/component';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useStyles } from './styles';
import { useHeader } from './hooks/useHeader';
import LogoMark from './components/LogoMark';
import SearchBar from './components/SearchBar';
import NotificationsMenu from './components/NotificationsMenu';
import UserMenu from './components/UserMenu';

const Header = () => {
  const { classes } = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    isAdmin,
    anchorEl,
    notifAnchorEl,
    addAnchorEl,
    notifications,
    isLoading,
    loadingMessage,
    ticketSearch,
    showSearchResults,
    filteredIncidents,
    handleTicketSearchChange,
    handleSelectIncident,
    handleCloseSearchResults,
    handleSettingsOpen,
    handleSettingsClose,
    handleNotifOpen,
    handleNotifClose,
    handleNotifClick,
    handleAddOpen,
    handleAddClose,
    handleAddManagement,
    handleAddCustomer,
    handleLogout,
    handleProfile,
    handleUserPage,
    handleCaptainPage,
    handleLogoClick,
  } = useHeader();

  return (
    <AppBar position='fixed' className={classes.headerAppbar}>
      <Toolbar className={classes.headerToolbar}>
        {/* Logo — compact on mobile, full on tablet/desktop */}
        <Box className={classes.desktopLogoArea} onClick={handleLogoClick}>
          <LogoMark compact={isMobile} />
        </Box>

        <Box className={classes.logoDivider} />

        {/* Left: ADMIN chip + Notifications bell */}
        <Box className={classes.headerLeft}>
          <Chip
            className={classes.adminChip}
            icon={<AdminPanelSettingsIcon sx={{ fontSize: 15 }} />}
            label='ADMIN'
            size='small'
          />

          <Tooltip title='Notifications' placement='bottom'>
            <IconButton onClick={handleNotifOpen} size='small' className={classes.iconBtnBase}>
              <Badge badgeContent={notifications.length} color='error'>
                <NotificationsIcon sx={{ fontSize: '1.25rem' }} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title='Create New' placement='bottom'>
            <IconButton onClick={handleAddOpen} size='small' className={classes.iconBtnBase}>
              <AddCircleOutlineIcon sx={{ fontSize: '1.25rem' }} />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={addAnchorEl}
            open={Boolean(addAnchorEl)}
            onClose={handleAddClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 180,
                background: 'rgba(15,23,42,0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(99,102,241,0.25)',
                borderRadius: '12px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              },
            }}
          >
            <MenuItem
              onClick={handleAddManagement}
              sx={{
                gap: 1.5,
                py: 1.2,
                color: '#e2e8f0',
                '&:hover': { background: 'rgba(99,102,241,0.18)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 'unset', color: '#a5b4fc' }}>
                <ManageAccountsIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText
                primary='Create New Management'
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
              />
            </MenuItem>
            <MenuItem
              onClick={handleAddCustomer}
              sx={{
                gap: 1.5,
                py: 1.2,
                color: '#e2e8f0',
                '&:hover': { background: 'rgba(99,102,241,0.18)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 'unset', color: '#a5b4fc' }}>
                <PersonAddIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText
                primary='Create New Customer'
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
              />
            </MenuItem>
          </Menu>
        </Box>

        <NotificationsMenu
          anchorEl={notifAnchorEl}
          onClose={handleNotifClose}
          onViewAll={handleNotifClick}
          notifications={notifications}
        />

        {/* Center: mobile search bar */}
        <Box className={classes.centerSearchWrap}>
          <Box className={classes.mobileSearch}>
            <SearchBar
              value={ticketSearch}
              onChange={handleTicketSearchChange}
              onClickAway={handleCloseSearchResults}
              showResults={showSearchResults}
              incidents={filteredIncidents}
              onSelectIncident={handleSelectIncident}
              className={classes.mobileSearchField}
              wrapperClassName={classes.ticketSearchWrapper}
              dropdownClassName={classes.searchDropdown}
              noResultsClassName={classes.searchNoResults}
            />
          </Box>
        </Box>

        {/* Right: desktop search + action icons */}
        <Box className={classes.headerRight}>
          <Box className={classes.headerFields}>
            <SearchBar
              value={ticketSearch}
              onChange={handleTicketSearchChange}
              onClickAway={handleCloseSearchResults}
              showResults={showSearchResults}
              incidents={filteredIncidents}
              onSelectIncident={handleSelectIncident}
              className={classes.textField}
              wrapperClassName={classes.ticketSearchWrapper}
              dropdownClassName={classes.searchDropdown}
              noResultsClassName={classes.searchNoResults}
            />
          </Box>

          <Tooltip title='Settings' placement='bottom'>
            <IconButton size='small' className={classes.iconBtnBase} onClick={handleSettingsOpen}>
              <SettingsIcon className={classes.icon} />
            </IconButton>
          </Tooltip>

          <UserMenu
            anchorEl={anchorEl}
            onClose={handleSettingsClose}
            onProfile={handleProfile}
            onUserPage={handleUserPage}
            onCaptainPage={handleCaptainPage}
            onLogout={handleLogout}
            isAdmin={isAdmin}
          />
        </Box>
      </Toolbar>

      {/* Mode-switch loading overlay */}
      <Backdrop
        className={classes.loadingBackdrop}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color='inherit' size={60} />
        <Typography variant='h6' className={classes.loadingText}>
          {loadingMessage}
        </Typography>
      </Backdrop>
    </AppBar>
  );
};

export default Header;
