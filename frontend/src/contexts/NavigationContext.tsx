'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from './UserContext';

type ViewMode = 'admin' | 'normal';

interface NavigationContextType {
  viewMode: ViewMode;
  toggleViewMode: () => void;
  navigateToDashboard: () => void;
  isNavigating: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, loading: userLoading } = useUser();
  const [viewMode, setViewMode] = useState<ViewMode>('normal');
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Set the view mode based on user role
  useEffect(() => {
    console.log("USER", user)
    if (user?.isAdmin) {
      setViewMode('admin');
    } else {
      setViewMode('normal');
    }
  }, [user]);

  // Handle navigation for authenticated users on public pages
  useEffect(() => {
    // Only run this if user loading is complete and we're not already navigating
    if (!userLoading && isAuthenticated && !isNavigating) {
      const isPublicRoute = ['/', '/login', '/register'].includes(pathname || '');
      
      if (isPublicRoute) {
        setIsNavigating(true);
        console.log("USER JUST BEFORE REDIRECT", user)
        if (user?.isAdmin) {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
        setTimeout(() => setIsNavigating(false), 500);
      }
    }
  }, [userLoading, isAuthenticated, pathname, viewMode]);

  const toggleViewMode = () => {
    const newMode = viewMode === 'admin' ? 'normal' : 'admin';
    setViewMode(newMode);
    
    // Only navigate if authenticated
    if (isAuthenticated) {
      setIsNavigating(true);
      if (newMode === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  const navigateToDashboard = () => {
    console.log("viwemode", viewMode)
    if (viewMode === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
    setTimeout(() => setIsNavigating(false), 500);
  };

  return (
    <NavigationContext.Provider
      value={{
        viewMode,
        toggleViewMode,
        navigateToDashboard,
        isNavigating
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