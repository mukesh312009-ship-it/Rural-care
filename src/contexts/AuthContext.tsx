import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_PROFILES } from '../services/mockDataService';
import { supabase, isConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  register: (profileData: Partial<UserProfile> & { password?: string }) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  isDoctorVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('ruralcare_active_role') as UserRole) || 'patient';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ruralcare_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_PROFILES[role];
  });

  useEffect(() => {
    // If role changed, ensure user profile matches that role
    const profile = INITIAL_PROFILES[role];
    setUser(profile);
    localStorage.setItem('ruralcare_active_role', role);
    localStorage.setItem('ruralcare_user', JSON.stringify(profile));
  }, [role]);

  const login = async (email: string, chosenRole?: UserRole): Promise<boolean> => {
    // Check if real Supabase auth is possible
    if (isConfigured) {
      try {
        // Real supabase attempt
      } catch (e) {
        console.warn('Supabase auth fallback:', e);
      }
    }

    // Role-based mock login
    const targetRole = chosenRole || 'patient';
    setRole(targetRole);
    const profile = INITIAL_PROFILES[targetRole];
    setUser({ ...profile, email: email || profile.email });
    return true;
  };

  const register = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    const newRole = profileData.role || 'patient';
    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      email: profileData.email || 'newuser@ruralcare.org',
      full_name: profileData.full_name || 'Rural Patient',
      phone_number: profileData.phone_number || '+91 90000 00000',
      role: newRole,
      language_preference: profileData.language_preference || 'ta',
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setRole(newRole);
    setUser(newProfile);
    localStorage.setItem('ruralcare_active_role', newRole);
    localStorage.setItem('ruralcare_user', JSON.stringify(newProfile));
    return true;
  };

  const logout = () => {
    // Reset to public / patient state
    setRole('patient');
    setUser(INITIAL_PROFILES.patient);
    localStorage.removeItem('ruralcare_user');
    if (isConfigured) {
      supabase.auth.signOut().catch(() => {});
    }
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    const profile = INITIAL_PROFILES[newRole];
    setUser(profile);
    localStorage.setItem('ruralcare_active_role', newRole);
    localStorage.setItem('ruralcare_user', JSON.stringify(profile));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('ruralcare_user', JSON.stringify(updated));
    }
  };

  const isDoctorVerified = role === 'doctor';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        switchRole,
        updateProfile,
        isDoctorVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
