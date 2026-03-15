import { StrictMode, Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { CollapseProvider } from '@bandi/hooks';
import { store } from 'libs/ui/state';
import { Loader, NotificationModal } from '@bandi/component';
import { DynamicThemeProvider } from '@bandi/theme';
import App from './app';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <DynamicThemeProvider>
        <CssBaseline />
        <NotificationModal />
        <BrowserRouter>
          <CollapseProvider>
            <Suspense fallback={<Loader />}>
              <App />
            </Suspense>
          </CollapseProvider>
        </BrowserRouter>
      </DynamicThemeProvider>
    </Provider>
  </StrictMode>,
);
