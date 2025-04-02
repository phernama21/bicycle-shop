'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from './UserContext';

type ViewMode = 'admin' | 'normal';

interface NavigationContextType {
  viewMode: ViewMode;
  toggleViewMode: () => void;
  navigateToDashboard: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useUser();
  const [viewMode, setViewMode] = useState<ViewMode>('normal');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user?.isAdmin) {
      setViewMode('admin');
    } else {
      setViewMode('normal');
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && pathname === '/dashboard' || pathname === '/admin/dashboard') {
      navigateToDashboard();
    }
  }, [viewMode, isAuthenticated]);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'admin' ? 'normal' : 'admin');
  };

  const navigateToDashboard = () => {
    if (viewMode === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        viewMode,
        toggleViewMode,
        navigateToDashboard,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};