import { lazy } from 'react';

// Lazy-loaded pages
export const LazyMenuItems = {
  // Admin layout
  AdminHeaderPage: lazy(() => import('@bandi/pages/admin/Header')),
  AdminSideNavPage: lazy(() => import('@bandi/pages/admin/SideNav')),

  // Governance pages
  AdminDashboardPage: lazy(() => import('@bandi/pages/admin/Dashboard')),
  AdminApisPage: lazy(() => import('@bandi/pages/admin/Apis')),
  AdminAccessRequestPage: lazy(() => import('@bandi/pages/admin/AccessRequest')),
  AdminAuditTrailsPage: lazy(() => import('@bandi/pages/admin/AuditTrails')),
  AdminEventsPage: lazy(() => import('@bandi/pages/admin/Events')),

  // Administration pages
  AdminUsersPage: lazy(() => import('@bandi/pages/admin/Users')),
  AdminCaptainsPage: lazy(() => import('@bandi/pages/admin/Captains')),
  AdminOrganizationsPage: lazy(() => import('@bandi/pages/admin/Organizations')),
  AdminSubscriptionsPage: lazy(() => import('@bandi/pages/admin/Subscriptions')),
  AdminCollectionsPage: lazy(() => import('@bandi/pages/admin/Collections')),
  AdminCategoriesPage: lazy(() => import('@bandi/pages/admin/Categories')),
  AdminTagsPage: lazy(() => import('@bandi/pages/admin/FastTag')),
  AdminThemingLanguagePage: lazy(() => import('@bandi/pages/admin/ThemingLanguage')),
  AdminApiGatewaysPage: lazy(() => import('@bandi/pages/admin/ApiGateways')),
  AdminSeoPage: lazy(() => import('@bandi/pages/admin/Seo')),
  AdminUserManagementPage: lazy(() => import('@bandi/pages/admin/UserManagement')),
  AdminSettingsPage: lazy(() => import('@bandi/pages/admin/Settings')),

  // Supporting pages
  AdminProfilePage: lazy(() => import('@bandi/pages/admin/Profile')),

  // Auth pages (shared/public)
  SignInPage: lazy(() => import('@bandi/pages/shared/SignIn')),
  SignUpPage: lazy(() => import('@bandi/pages/shared/SignUp')),
  ForgotPasswordPage: lazy(() => import('@bandi/pages/shared/ForgotPassword')),

  // NotFound page
  NotFoundPage: lazy(() => import('@bandi/component/NotFound')),
};
