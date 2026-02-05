import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import { useTheme } from './contexts/ThemeContext';
import HomePage from './pages/HomePage';
import SkillsPage from './pages/SkillsPage';
import SkillDetailPage from './pages/SkillDetailPage';
import AboutPage from './pages/AboutPage';
import DocsPage from './pages/DocsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { DocumentHead } from './components/DocumentHead';

function App() {
  const { theme } = useTheme();
  return (
    <Tooltip.Provider delayDuration={300}>
    <SiteSettingsProvider>
    <AuthProvider>
      <Toaster 
        position="top-right" 
        theme={theme}
        richColors 
        closeButton 
        offset={80}
        expand
        visibleToasts={6}
        gap={10}
        toastOptions={{
          classNames: {
            toast: 'botskill-toast',
            closeButton: 'botskill-toast-close',
          },
        }}
      />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <DocumentHead />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/skills" element={<Layout />}>
            <Route index element={<SkillsPage />} />
            <Route path=":id" element={<SkillDetailPage />} />
          </Route>
          <Route path="/about" element={<Layout />}>
            <Route index element={<AboutPage />} />
          </Route>
          <Route path="/docs" element={<Layout />}>
            <Route index element={<DocsPage />} />
          </Route>
          <Route path="/login" element={<Layout />}>
            <Route index element={<LoginPage />} />
          </Route>
          <Route path="/register" element={<Layout />}>
            <Route index element={<RegisterPage />} />
          </Route>
          <Route path="/profile" element={<Layout />}>
            <Route index element={<ProfilePage />} />
          </Route>
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin" redirectTo="/profile">
              <Layout>
                <AdminPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/blog" element={<Layout />}>
            <Route index element={<div className="container py-8"><h1 className="text-2xl font-bold">Blog Page</h1><p>Coming soon...</p></div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
    </SiteSettingsProvider>
    </Tooltip.Provider>
  );
}

export default App;