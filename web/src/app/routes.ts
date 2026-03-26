import { lazy } from 'react';

// Lazy-loaded pages
export const LazyMenuItems = {
  // Admin layout
  AdminHeaderPage: lazy(() => import('@bandi/pages/admin/Header')),
  AdminSideNavPage: lazy(() => import('@bandi/pages/admin/SideNav')),

  // Team pages
  AdminUserDetailPage: lazy(() => import('@bandi/pages/admin/UserDetail')),
  AdminCustomerDetailPage: lazy(() => import('@bandi/pages/admin/CustomerDetail')),
  AdminAccessRequestsPage: lazy(() => import('@bandi/pages/admin/AccessRequests')),
  AdminCustomerApprovalsPage: lazy(() => import('@bandi/pages/admin/CustomerApprovals')),

  // Governance pages
  AdminDashboardPage: lazy(() => import('@bandi/pages/admin/Dashboard')),
  AdminAccessManagementPage: lazy(() => import('@bandi/pages/admin/AccessManagement')),
  AdminAuditTrailsPage: lazy(() => import('@bandi/pages/admin/AuditTrails')),
  AdminEventsPage: lazy(() => import('@bandi/pages/admin/Events')),

  // Administration pages
  AdminUsersPage: lazy(() => import('@bandi/pages/admin/Users')),
  AdminSubscriptionsPage: lazy(() => import('@bandi/pages/admin/Subscriptions')),
  AdminCollectionsPage: lazy(() => import('@bandi/pages/admin/Collections')),
  AdminCategoriesPage: lazy(() => import('@bandi/pages/admin/Categories')),
  AdminTagsPage: lazy(() => import('@bandi/pages/admin/FastTag')),
  AdminUserManagementPage: lazy(() => import('@bandi/pages/admin/UserManagement')),
  AdminSettingsPage: lazy(() => import('@bandi/pages/admin/Settings')),

  // Operations pages
  AdminVehicleFleetPage: lazy(() => import('@bandi/pages/admin/VehicleFleet')),

  // Mobility Services pages
  AdminDriverHirePage: lazy(() => import('@bandi/pages/admin/DriverHire')),
  AdminVehicleRentalPage: lazy(() => import('@bandi/pages/admin/VehicleRental')),
  AdminParcelPage: lazy(() => import('@bandi/pages/admin/Parcel')),
  AdminLogisticsPage: lazy(() => import('@bandi/pages/admin/Logistics')),

  // Finance pages
  AdminTransactionsPage: lazy(() => import('@bandi/pages/admin/Transactions')),
  AdminDriverEarningsPage: lazy(() => import('@bandi/pages/admin/DriverEarnings')),
  AdminCommissionsPage: lazy(() => import('@bandi/pages/admin/Commissions')),

  // Requests pages
  AdminKycPage: lazy(() => import('@bandi/pages/admin/Kyc')),
  AdminCreateManagementPage: lazy(() =>
    import('@bandi/pages/admin/CreateTicket').then((m) => ({ default: m.CreateManagement })),
  ),
  AdminCreateManagementFormPage: lazy(() =>
    import('@bandi/pages/admin/CreateTicket').then((m) => ({ default: m.CreateManagementForm })),
  ),
  AdminCreateCustomerPage: lazy(() => import('@bandi/pages/admin/CreateCustomer')),
  AdminCreateCustomerFormPage: lazy(() =>
    import('@bandi/pages/admin/CreateCustomer').then((m) => ({ default: m.CreateCustomerForm })),
  ),
  AdminCreateCustomerSimpleFormPage: lazy(() =>
    import('@bandi/pages/admin/CreateCustomer').then((m) => ({ default: m.CreateSimpleForm })),
  ),

  // Reports pages
  AdminAnalyticsPage: lazy(() => import('@bandi/pages/admin/Analytics')),

  // Configuration pages
  AdminPricingPage: lazy(() => import('@bandi/pages/admin/Pricing')),
  AdminServiceTypesPage: lazy(() => import('@bandi/pages/admin/ServiceTypes')),
  AdminBusinessRulesPage: lazy(() => import('@bandi/pages/admin/BusinessRules')),
  AdminFeatureFlagsPage: lazy(() => import('@bandi/pages/admin/FeatureFlags')),
  AdminZonesPage: lazy(() => import('@bandi/pages/admin/Zones')),
  AdminIntegrationsPage: lazy(() => import('@bandi/pages/admin/Integrations')),

  // Supporting pages
  AdminProfilePage: lazy(() => import('@bandi/pages/admin/Profile')),

  // Auth pages (shared/public)
  SignInPage: lazy(() => import('@bandi/pages/shared/SignIn')),
  SignUpPage: lazy(() => import('@bandi/pages/shared/SignUp')),
  ForgotPasswordPage: lazy(() => import('@bandi/pages/shared/ForgotPassword')),

  // NotFound page
  NotFoundPage: lazy(() => import('@bandi/component/NotFound')),
};
