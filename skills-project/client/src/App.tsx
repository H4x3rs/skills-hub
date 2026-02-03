import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SkillsPage from './pages/SkillsPage';
import AboutPage from './pages/AboutPage';
import DocsPage from './pages/DocsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import Layout from './components/Layout';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/skills" element={<Layout />}>
          <Route index element={<SkillsPage />} />
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
        <Route path="/admin" element={<Layout />}>
          <Route index element={<AdminPage />} />
        </Route>
        <Route path="/blog" element={<Layout />}>
          <Route index element={<div className="container py-8"><h1 className="text-2xl font-bold">Blog Page</h1><p>Coming soon...</p></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;