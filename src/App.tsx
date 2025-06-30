import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AuthGuard from './components/AuthGuard';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Share from './pages/Share';
import Events from './pages/Events';
import Profile from './pages/Profile';
import ItemDetail from './pages/ItemDetail';
import CreateItem from './pages/CreateItem';
import CreateEvent from './pages/CreateEvent';
import JoinCommunity from './pages/JoinCommunity';
import NeighborhoodMap from './pages/NeighborhoodMap';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected routes */}
          <Route path="/join" element={
            <AuthGuard>
              <JoinCommunity />
            </AuthGuard>
          } />
          
          <Route path="/app" element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
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
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;