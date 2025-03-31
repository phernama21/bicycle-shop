'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserLogin, UserRegistration } from '@/models/user/domain/user';
import { userRepository } from '@/models/user/infrastructure/userRepository';
import { clearAuthHeaders } from '@/lib/api';

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

  // Check if user is already authenticated
  useEffect(() => {
    const validateToken = async () => {
      try {
        const currentUser = await userRepository.getCurrentUser();
        setUser(currentUser);
      } catch (err: any) {
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
      router.push('/dashboard');
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
      router.push('/dashboard');
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
      router.push('/login');
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