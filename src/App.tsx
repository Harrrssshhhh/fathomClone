import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { AppSidebar } from './components/AppSidebar';
import { HomePage } from './pages/HomePage';
import { MeetingsPage } from './pages/MeetingsPage';
import { MeetingDetailPage } from './pages/MeetingDetailPage';
import { SearchPage } from './pages/SearchPage';
import { ActionItemsPage } from './pages/ActionItemsPage';
import { SharedClipsPage } from './pages/SharedClipsPage';
import { SharedClipPage } from './pages/SharedClipPage';
import { SettingsPage } from './pages/SettingsPage';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <AppSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ToastProvider>
          <Routes>
            {/* Shared clip — full-page, no sidebar */}
            <Route path="/shared/:clipId" element={<SharedClipPage />} />

            {/* Main app with sidebar */}
            <Route path="/*" element={
              <AppLayout>
                <Routes>
                  <Route path="/"                element={<HomePage />} />
                  <Route path="/meetings"         element={<MeetingsPage />} />
                  <Route path="/meetings/:id"     element={<MeetingDetailPage />} />
                  <Route path="/search"           element={<SearchPage />} />
                  <Route path="/action-items"     element={<ActionItemsPage />} />
                  <Route path="/shared"           element={<SharedClipsPage />} />
                  <Route path="/settings"         element={<SettingsPage />} />
                </Routes>
              </AppLayout>
            } />
          </Routes>
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
