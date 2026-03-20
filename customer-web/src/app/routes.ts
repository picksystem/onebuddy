import { lazy } from 'react';

export const LazyPages = {
  // ── Welcome (customer landing page) ───────────────────────────────────────
  CustomerWelcomePage: lazy(() => import('../pages/Welcome/CustomerWelcome')),

  // ── Customer layout ────────────────────────────────────────────────────────
  CustomerHeaderPage: lazy(() => import('@bandi/pages/user/Header')),
  CustomerSideNavPage: lazy(() => import('@bandi/pages/user/SideNav')),

  // ── Customer pages ─────────────────────────────────────────────────────────
  CustomerDashboardPage:        lazy(() => import('@bandi/pages/user/Dashboard')),
  CustomerFavouritesPage:       lazy(() => import('@bandi/pages/user/Favourites')),
  CustomerRecentItemsPage:      lazy(() => import('@bandi/pages/user/RecentItems')),
  CustomerIncidentPage:         lazy(() => import('@bandi/pages/user/IncidentManagement')),
  CustomerChangePage:           lazy(() => import('@bandi/pages/user/ChangeManagement')),
  CustomerProblemPage:          lazy(() => import('@bandi/pages/user/ProblemManagement')),

  // ── Auth pages (shared) ────────────────────────────────────────────────────
  SignInPage:         lazy(() => import('@bandi/pages/shared/SignIn')),
  SignUpPage:         lazy(() => import('@bandi/pages/shared/SignUp')),
  ForgotPasswordPage: lazy(() => import('@bandi/pages/shared/ForgotPassword')),

  // ── Fallback ───────────────────────────────────────────────────────────────
  NotFoundPage: lazy(() => import('@bandi/component/NotFound')),
};
