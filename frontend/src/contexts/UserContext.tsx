'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserLogin, UserRegistration } from '@/models/user/domain/user';
import { userRepository } from '@/models/user/infrastructure/userRepository';
import { clearAuthHeaders } from '@/lib/api';
import { usePathname, useRouter } from 'next/navigation';
import { useAlert } from '@/contexts/AlertContext';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserRegistration) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { showAlert } = useAlert();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const currentUser = await userRepository.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          clearAuthHeaders();
          
        }
      } catch (err: any) {
        if(!['/', '/login', '/register'].includes(pathname)){
          showAlert('error', 'Authentication error', 'You need to log in.');
        }
        clearAuthHeaders();
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = async (credentials: UserLogin) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userRepository.login(credentials);
      setUser(response.user);
    } catch (err: any) {
      setError(err.response?.data?.errors?.[0] || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: UserRegistration) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userRepository.register(userData);
      setUser(response.user);
    } catch (err: any) {
      setError(err.response?.data?.errors?.[0] || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      await userRepository.logout();
      setUser(null);
      clearAuthHeaders();
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};