import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ModalProvider } from './context/ModalContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Share from './pages/Share';
import Events from './pages/Events';
import Profile from './pages/Profile';
import ItemDetail from './pages/ItemDetail';
import CreateItem from './pages/CreateItem';
import CreateEvent from './pages/CreateEvent';
import JoinCommunity from './pages/JoinCommunity';
import NeighborhoodMap from './pages/NeighborhoodMap';
import AuthPage from './pages/AuthPage';
import { useAuth } from './hooks/useAuth';
import ModalManager from './components/modals/ModalManager';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/join" element={<JoinCommunity />} />
      
      {/* Protected app routes */}
      <Route path="/app" element={
        user ? <Layout /> : <Navigate to="/auth" replace />
      }>
        <Route index element={<Home />} />
        <Route path="share" element={<Share />} />
        <Route path="events" element={<Events />} />
        <Route path="profile" element={<Profile />} />
        <Route path="map" element={<NeighborhoodMap />} />
        <Route path="item/:id" element={<ItemDetail />} />
        <Route path="create-item" element={<CreateItem />} />
        <Route path="create-event" element={<CreateEvent />} />
      </Route>

      {/* Catch all - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <ModalProvider>
        <Router>
          <AppRoutes />
          <ModalManager />
        </Router>
      </ModalProvider>
    </AppProvider>
  );
}

export default App;