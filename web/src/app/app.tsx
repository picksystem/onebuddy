import { Routes, Route, Navigate, useParams } from 'react-router-dom';
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
  AdminUserDetailPage,
  AdminCustomerDetailPage,
  AdminAccessRequestsPage,
  AdminCustomerApprovalsPage,

  // Governance
  AdminDashboardPage,
  AdminAccessManagementPage,
  AdminAuditTrailsPage,
  AdminEventsPage,

  // Administration
  AdminUsersPage,
  AdminSubscriptionsPage,
  AdminCollectionsPage,
  AdminCategoriesPage,
  AdminTagsPage,
  AdminUserManagementPage,
  AdminSettingsPage,

  // Operations
  AdminFleetManagementPage,
  AdminFleetAccessPage,
  AdminUserAccessPage,
  AdminUserMgmtPage,

  // Mobility Services
  AdminDriverHirePage,
  AdminVehicleRentalPage,
  AdminMechanicHirePage,
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
  AdminCreateCustomerFormPage,
  AdminCreateCustomerSimpleFormPage,

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

// Forces CreateManagementForm to remount when :type changes (admin ↔ consultant)
const KeyedManagementForm = () => {
  const { type } = useParams<{ type: string }>();
  return <AdminCreateManagementFormPage key={type} />;
};

const SIMPLE_CUSTOMER_TYPES = ['user', 'driver-hire', 'vehicle-rental', 'mechanic-hire'];

// Routes to the correct form based on :type param
const KeyedCustomerForm = () => {
  const { type } = useParams<{ type: string }>();
  if (type && SIMPLE_CUSTOMER_TYPES.includes(type)) {
    return <AdminCreateCustomerSimpleFormPage key={type} />;
  }
  return <AdminCreateCustomerFormPage key={type} />;
};

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
              <Route path={AdminPath.USER_DETAIL} element={<AdminUserDetailPage />} />
              <Route path={AdminPath.CUSTOMER_DETAIL} element={<AdminCustomerDetailPage />} />
              <Route path={AdminPath.ROLE_REQUESTS} element={<AdminAccessRequestsPage />} />
              <Route path={AdminPath.CUSTOMER_APPROVALS} element={<AdminCustomerApprovalsPage />} />

              {/* Governance */}
              <Route path={AdminPath.DASHBOARD} element={<AdminDashboardPage />} />
              <Route path={AdminPath.ACCESS_MANAGEMENT} element={<AdminAccessManagementPage />} />
              <Route path={AdminPath.AUDIT_TRAILS} element={<AdminAuditTrailsPage />} />
              <Route path={AdminPath.EVENTS} element={<AdminEventsPage />} />

              {/* Administration */}
              <Route path={AdminPath.USERS} element={<AdminUsersPage />} />
              <Route path={AdminPath.SUBSCRIPTIONS} element={<AdminSubscriptionsPage />} />
              <Route path={AdminPath.COLLECTIONS} element={<AdminCollectionsPage />} />
              <Route path={AdminPath.CATEGORIES} element={<AdminCategoriesPage />} />
              <Route path={AdminPath.TAGS} element={<AdminTagsPage />} />
              <Route path={AdminPath.USER_MANAGEMENT} element={<AdminUserManagementPage />} />
              <Route path={AdminPath.SETTINGS} element={<AdminSettingsPage />} />

              {/* Operations — split by category */}
              <Route path={AdminPath.MOBILITY_MANAGEMENT} element={<AdminFleetManagementPage />} />
              <Route path={AdminPath.LOGISTICS_MANAGEMENT} element={<AdminFleetManagementPage />} />
              <Route path={AdminPath.MOBILITY_ACCESS} element={<AdminFleetAccessPage />} />
              <Route path={AdminPath.LOGISTICS_ACCESS} element={<AdminFleetAccessPage />} />
              <Route path={AdminPath.USER_ACCESS} element={<AdminUserAccessPage />} />
              <Route path={AdminPath.USER_MGMT} element={<AdminUserMgmtPage />} />

              {/* Mobility Services */}
              <Route path={AdminPath.DRIVER_HIRE} element={<AdminDriverHirePage />} />
              <Route path={AdminPath.VEHICLE_RENTAL} element={<AdminVehicleRentalPage />} />
              <Route path={AdminPath.MECHANIC_HIRE} element={<AdminMechanicHirePage />} />
              <Route path={AdminPath.PARCEL} element={<AdminParcelPage />} />
              <Route path={AdminPath.LOGISTICS} element={<AdminLogisticsPage />} />

              {/* Finance */}
              <Route path={AdminPath.TRANSACTIONS} element={<AdminTransactionsPage />} />
              <Route path={AdminPath.DRIVER_EARNINGS} element={<AdminDriverEarningsPage />} />
              <Route path={AdminPath.COMMISSIONS} element={<AdminCommissionsPage />} />

              {/* Requests */}
              <Route path={AdminPath.KYC} element={<AdminKycPage />} />
              <Route path={AdminPath.CREATE_MANAGEMENT} element={<AdminCreateManagementPage />} />
              <Route path={AdminPath.CREATE_MANAGEMENT_TYPE} element={<KeyedManagementForm />} />
              <Route path={AdminPath.CREATE_CUSTOMER} element={<AdminCreateCustomerPage />} />
              <Route path={AdminPath.CREATE_CUSTOMER_TYPE} element={<KeyedCustomerForm />} />

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
