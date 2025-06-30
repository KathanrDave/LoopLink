import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import { useToast } from '../hooks/useToast';
import Toast from './ui/Toast';

const Layout = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <Header />
      <main className="flex-1 pb-24 pt-20">
        <Outlet />
      </main>
      <BottomNav />
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
};

export default Layout;