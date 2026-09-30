import React, { useEffect } from 'react';
import { RouterProvider, useRouter } from './router';
import { AppProvider, useApp } from './context/AppContext';
import { NicknameScreen } from './components/auth/NicknameScreen';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { DownloadPage } from './pages/DownloadPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { OpenSourcePage } from './pages/OpenSourcePage';
import { platform } from './services/platform';

const AppView: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <NicknameScreen />;
  }

  return <AppShell />;
};

const RouteRenderer: React.FC = () => {
  const { path, navigate } = useRouter();

  // If running inside Tauri standalone desktop or Android app, default to /app view
  useEffect(() => {
    if (!platform.isWeb && path === '/') {
      navigate('/app');
    }
  }, [path, navigate]);

  switch (path) {
    case '/download':
      return <DownloadPage />;
    case '/open-source':
      return <OpenSourcePage />;
    case '/privacy':
      return <PrivacyPage />;
    case '/terms':
      return <TermsPage />;
    case '/app':
      return (
        <AppProvider>
          <AppView />
        </AppProvider>
      );
    case '/':
    default:
      if (!platform.isWeb) {
        return (
          <AppProvider>
            <AppView />
          </AppProvider>
        );
      }
      return <LandingPage />;
  }
};

export default function App() {
  return (
    <RouterProvider>
      <RouteRenderer />
    </RouterProvider>
  );
}
