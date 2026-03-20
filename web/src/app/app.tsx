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

  // Team
  AdminAdminsPage,
  AdminUserDetailPage,

  // Governance
  AdminDashboardPage,
  AdminConsultantPage,
  AdminAccessManagementPage,
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

  // Operations
  AdminRidesPage,

  // Mobility Services
  AdminDriverHirePage,
  AdminVehicleRentalPage,
  AdminParcelPage,
  AdminLogisticsPage,

  // Finance
  AdminTransactionsPage,
  AdminDriverEarningsPage,
  AdminCommissionsPage,

  // Requests
  AdminKycPage,
  AdminCreateManagementPage,
  AdminCreateManagementFormPage,
  AdminCreateCustomerPage,

  // Reports
  AdminAnalyticsPage,

  // Configuration
  AdminPricingPage,
  AdminServiceTypesPage,
  AdminBusinessRulesPage,
  AdminFeatureFlagsPage,
  AdminZonesPage,
  AdminIntegrationsPage,

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

              {/* Team */}
              <Route path={AdminPath.ADMINS} element={<AdminAdminsPage />} />
              <Route path={AdminPath.USER_DETAIL} element={<AdminUserDetailPage />} />

              {/* Governance */}
              <Route path={AdminPath.DASHBOARD} element={<AdminDashboardPage />} />
              <Route path={AdminPath.CONSULTANT} element={<AdminConsultantPage />} />
              <Route path={AdminPath.ACCESS_MANAGEMENT} element={<AdminAccessManagementPage />} />
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

              {/* Operations */}
              <Route path={AdminPath.RIDES} element={<AdminRidesPage />} />

              {/* Mobility Services */}
              <Route path={AdminPath.DRIVER_HIRE} element={<AdminDriverHirePage />} />
              <Route path={AdminPath.VEHICLE_RENTAL} element={<AdminVehicleRentalPage />} />
              <Route path={AdminPath.PARCEL} element={<AdminParcelPage />} />
              <Route path={AdminPath.LOGISTICS} element={<AdminLogisticsPage />} />

              {/* Finance */}
              <Route path={AdminPath.TRANSACTIONS} element={<AdminTransactionsPage />} />
              <Route path={AdminPath.DRIVER_EARNINGS} element={<AdminDriverEarningsPage />} />
              <Route path={AdminPath.COMMISSIONS} element={<AdminCommissionsPage />} />

              {/* Requests */}
              <Route path={AdminPath.KYC} element={<AdminKycPage />} />
              <Route path={AdminPath.CREATE_MANAGEMENT} element={<AdminCreateManagementPage />} />
              <Route
                path={AdminPath.CREATE_MANAGEMENT_TYPE}
                element={<AdminCreateManagementFormPage />}
              />
              <Route path={AdminPath.CREATE_CUSTOMER} element={<AdminCreateCustomerPage />} />

              {/* Reports */}
              <Route path={AdminPath.ANALYTICS} element={<AdminAnalyticsPage />} />

              {/* Configuration */}
              <Route path={AdminPath.PRICING} element={<AdminPricingPage />} />
              <Route path={AdminPath.SERVICES} element={<AdminServiceTypesPage />} />
              <Route path={AdminPath.RULES} element={<AdminBusinessRulesPage />} />
              <Route path={AdminPath.FEATURE_FLAGS} element={<AdminFeatureFlagsPage />} />
              <Route path={AdminPath.ZONES} element={<AdminZonesPage />} />
              <Route path={AdminPath.INTEGRATIONS} element={<AdminIntegrationsPage />} />

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
