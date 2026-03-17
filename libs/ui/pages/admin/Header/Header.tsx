import {
  AppBar,
  Badge,
  Backdrop,
  CircularProgress,
  Chip,
  IconButton,
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
