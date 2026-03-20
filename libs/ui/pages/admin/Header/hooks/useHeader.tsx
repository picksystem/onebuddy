import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { constants } from '@bandi/utils';
import { useAuth, useDebounce } from '@bandi/hooks';
import { useAuthActionMutation } from '@bandi/services';
import { IAuthUser } from '@bandi/interfaces';

export const useHeader = () => {
  const navigate = useNavigate();
  const { AdminPath, AuthPath } = constants;
  const { user, isAdmin, logout } = useAuth();
  const [authAction] = useAuthActionMutation();

  // Menus
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [addAnchorEl, setAddAnchorEl] = useState<null | HTMLElement>(null);

  // Notifications
  const [notifications, setNotifications] = useState<IAuthUser[]>([]);

  // Loading overlay
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Search
  const [ticketSearch, setTicketSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const debouncedSearch = useDebounce(ticketSearch, 300);

  const filteredIncidents = useMemo(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) return [];
    return [];
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const result = await authAction({ action: 'get-pending-role-requests' }).unwrap();
        setNotifications(result.data || []);
      } catch {
        // non-critical
      }
    };
    fetchPendingRequests();
  }, [authAction]);

  const userName =
    user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';

  // Search handlers
  const handleTicketSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketSearch(e.target.value);
    setShowSearchResults(true);
  }, []);

  const handleSelectIncident = useCallback(() => {
    setShowSearchResults(false);
    setTicketSearch('');
  }, []);

  const handleCloseSearchResults = useCallback(() => setShowSearchResults(false), []);

  // Menu handlers
  const handleSettingsOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleSettingsClose = () => setAnchorEl(null);
  const handleAddOpen = (e: React.MouseEvent<HTMLElement>) => setAddAnchorEl(e.currentTarget);
  const handleAddClose = () => setAddAnchorEl(null);
  const handleAddManagement = () => {
    handleAddClose();
    navigate(AdminPath.CREATE_MANAGEMENT);
  };
  const handleAddCustomer = () => {
    handleAddClose();
    navigate(AdminPath.CREATE_CUSTOMER);
  };
  const handleNotifOpen = (e: React.MouseEvent<HTMLElement>) => setNotifAnchorEl(e.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);
  const handleNotifClick = () => {
    handleNotifClose();
    navigate(AdminPath.ACCESS_MANAGEMENT);
  };

  // Navigation handlers
  const handleLogout = () => {
    handleSettingsClose();
    logout();
    navigate(AuthPath.SIGNIN);
  };

  const handleProfile = () => {
    handleSettingsClose();
    navigate(AdminPath.PROFILE);
  };

  const handleUserPage = () => {
    handleSettingsClose();
    setLoadingMessage('Switching to User Mode...');
    setIsLoading(true);
    setTimeout(() => {
      navigate('/app/user/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  const handleCaptainPage = () => {
    handleSettingsClose();
    setLoadingMessage('Switching to Captain Mode...');
    setIsLoading(true);
    setTimeout(() => {
      navigate('/app/captain/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  const handleLogoClick = () => navigate('/app/admin/dashboard');

  return {
    // State
    user,
    isAdmin,
    userName,
    anchorEl,
    notifAnchorEl,
    addAnchorEl,
    notifications,
    isLoading,
    loadingMessage,
    ticketSearch,
    showSearchResults,
    filteredIncidents,
    // Handlers
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
  };
};
