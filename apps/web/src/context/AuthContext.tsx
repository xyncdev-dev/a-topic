'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { api } from '../lib/api';
import type { UserProfile } from '@a-topic/shared';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded: isClerkLoaded, isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerk();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await api.get<UserProfile>('/user/profile');
      setUser(profile);
    } catch (err) {
      console.warn('Failed to fetch user profile:', err);
    }
  }, []);

  useEffect(() => {
    if (!isClerkLoaded) return;

    if (isSignedIn) {
      setIsFetchingProfile(true);
      refreshUser().finally(() => setIsFetchingProfile(false));
    } else {
      setUser(null);
    }
  }, [isClerkLoaded, isSignedIn, refreshUser]);

  const logout = useCallback(async () => {
    setUser(null);
    localStorage.removeItem('atopic_token');
    await signOut();
  }, [signOut]);

  const login = async () => {
    await refreshUser();
  };

  const register = async () => {
    await refreshUser();
  };

  const isLoading = !isClerkLoaded || (Boolean(isSignedIn) && !user && isFetchingProfile);
  const isAuthenticated = Boolean(isSignedIn && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token: null,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
