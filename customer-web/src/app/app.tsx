import { Routes, Route, Navigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { LazyPages } from './routes';
import { constants } from '@bandi/utils';
import { ErrorBoundary, MainContent } from '@bandi/component';
import { useAuth } from '@bandi/hooks';
import { AppRoleContext } from '@bandi/theme';

const {
  CustomerWelcomePage,
  CustomerHeaderPage,
  CustomerSideNavPage,
  CustomerDashboardPage,
  CustomerFavouritesPage,
  CustomerRecentItemsPage,
  CustomerIncidentPage,
  CustomerChangePage,
  CustomerProblemPage,
  SignInPage,
  SignUpPage,
  ForgotPasswordPage,
  NotFoundPage,
} = LazyPages;

const AppRoutes = () => {
  const { AuthPath, UserPath } = constants;
  const { isAuthenticated } = useAuth();

  // ── Unauthenticated — Welcome + auth pages ─────────────────────────────────
  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <Routes>
          <Route path='/'                        element={<CustomerWelcomePage />} />
          <Route path={AuthPath.SIGNIN}          element={<SignInPage />} />
          <Route path={AuthPath.SIGNUP}          element={<SignUpPage />} />
          <Route path={AuthPath.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path='*'                        element={<Navigate to='/' replace />} />
        </Routes>
      </ErrorBoundary>
    );
  }

  // ── Authenticated customer ─────────────────────────────────────────────────
  return (
    <AppRoleContext.Provider value='user'>
      <ErrorBoundary>
        <CustomerHeaderPage />
        <CustomerSideNavPage />
        <MainContent>
          <Routes>
            <Route path='/'                          element={<Navigate to={UserPath.DASHBOARD} replace />} />
            <Route path={UserPath.DASHBOARD}         element={<CustomerDashboardPage />} />
            <Route path={UserPath.FAVOURITES}        element={<CustomerFavouritesPage />} />
            <Route path={UserPath.RECENT_ITEMS}      element={<CustomerRecentItemsPage />} />
            <Route path={UserPath.INCIDENT_MANAGEMENT} element={<CustomerIncidentPage />} />
            <Route path={UserPath.CHANGE_MANAGEMENT}   element={<CustomerChangePage />} />
            <Route path={UserPath.PROBLEM_MANAGEMENT}  element={<CustomerProblemPage />} />
            <Route path='*'                          element={<NotFoundPage />} />
          </Routes>
        </MainContent>
      </ErrorBoundary>
    </AppRoleContext.Provider>
  );
};

const App = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AppRoutes />
  </LocalizationProvider>
);

export default App;
