import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Scanner from './pages/Scanner';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import SplashScreen from './components/SplashScreen';
import { CatalogProvider } from './context/CatalogContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('arome_splash_seen');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('arome_splash_seen', 'true');
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <CatalogProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="scanner" element={<Scanner />} />
              <Route path="chat" element={<Chat />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CatalogProvider>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
