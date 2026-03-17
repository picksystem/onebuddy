import { Routes, Route, Navigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { LazyMenuItems } from './routes';
import { constants } from '@bandi/utils';
import { ErrorBoundary, MainContent } from '@bandi/component';
import { useAuth } from '@bandi/hooks';
import { AppRoleContext } from '@bandi/theme';

const {
  // Admin layout
  AdminHeaderPage,
  AdminSideNavPage,

  // Governance
  AdminDashboardPage,
  AdminAccessRequestPage,
  AdminAuditTrailsPage,
  AdminEventsPage,

  // Administration
  AdminUsersPage,
  AdminCaptainsPage,
  AdminOrganizationsPage,
  AdminSubscriptionsPage,
  AdminCollectionsPage,
  AdminCategoriesPage,
  AdminTagsPage,
  AdminUserManagementPage,
  AdminSettingsPage,

  // Mobility Services
  AdminDriverHirePage,
  AdminVehicleRentalPage,

  // Supporting
  AdminProfilePage,

  // Auth
  SignInPage,
  SignUpPage,
  ForgotPasswordPage,
  NotFoundPage,
} = LazyMenuItems;

const AppRoutes = () => {
  const { AdminPath, AuthPath, Path } = constants;
  const { isAuthenticated, isAdmin } = useAuth();

  // Not authenticated — show auth pages
  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <Routes>
          <Route path={AuthPath.SIGNIN} element={<SignInPage />} />
          <Route path={AuthPath.SIGNUP} element={<SignUpPage />} />
          <Route path={AuthPath.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={Path.NOT_FOUND} element={<Navigate to={AuthPath.SIGNIN} replace />} />
        </Routes>
      </ErrorBoundary>
    );
  }

  // Authenticated as Admin
  if (isAdmin) {
    return (
      <AppRoleContext.Provider value='admin'>
        <ErrorBoundary>
          <AdminHeaderPage />
          <AdminSideNavPage />
          <MainContent>
            <Routes>
              <Route
                path={Path.DEFAULT_PAGE}
                element={<Navigate to={AdminPath.DASHBOARD} replace />}
              />

              {/* Governance */}
              <Route path={AdminPath.DASHBOARD} element={<AdminDashboardPage />} />
              <Route path={AdminPath.ACCESS_REQUEST} element={<AdminAccessRequestPage />} />
              <Route path={AdminPath.AUDIT_TRAILS} element={<AdminAuditTrailsPage />} />
              <Route path={AdminPath.EVENTS} element={<AdminEventsPage />} />

              {/* Administration */}
              <Route path={AdminPath.USERS} element={<AdminUsersPage />} />
              <Route path={AdminPath.CAPTAINS} element={<AdminCaptainsPage />} />
              <Route path={AdminPath.ORGANIZATIONS} element={<AdminOrganizationsPage />} />
              <Route path={AdminPath.SUBSCRIPTIONS} element={<AdminSubscriptionsPage />} />
              <Route path={AdminPath.COLLECTIONS} element={<AdminCollectionsPage />} />
              <Route path={AdminPath.CATEGORIES} element={<AdminCategoriesPage />} />
              <Route path={AdminPath.TAGS} element={<AdminTagsPage />} />
              <Route path={AdminPath.USER_MANAGEMENT} element={<AdminUserManagementPage />} />
              <Route path={AdminPath.SETTINGS} element={<AdminSettingsPage />} />

              {/* Mobility Services */}
              <Route path={AdminPath.DRIVER_HIRE} element={<AdminDriverHirePage />} />
              <Route path={AdminPath.VEHICLE_RENTAL} element={<AdminVehicleRentalPage />} />

              {/* Supporting */}
              <Route path={AdminPath.PROFILE} element={<AdminProfilePage />} />

              <Route path={Path.NOT_FOUND} element={<NotFoundPage />} />
            </Routes>
          </MainContent>
        </ErrorBoundary>
      </AppRoleContext.Provider>
    );
  }

  // Non-admin — redirect to sign in
  return (
    <ErrorBoundary>
      <Routes>
        <Route path={Path.NOT_FOUND} element={<Navigate to={AuthPath.SIGNIN} replace />} />
      </Routes>
    </ErrorBoundary>
  );
};

const App = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AppRoutes />
  </LocalizationProvider>
);

export default App;
