import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
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

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Landing page - redirect to app */}
          <Route path="/" element={<Navigate to="/app" replace />} />
          
          {/* Join community page */}
          <Route path="/join" element={<JoinCommunity />} />
          
          {/* Main app routes */}
          <Route path="/app" element={<Layout />}>
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