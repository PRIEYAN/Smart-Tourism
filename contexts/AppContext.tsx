import React, { createContext, ReactNode, useContext, useState } from 'react';

export type UserStatus = 'safe' | 'tracking' | 'sos';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface UserProfile {
  name: string;
  phone: string;
  age?: string;
  bloodGroup?: string;
  allergies?: string[];
  conditions?: string[];
  homeAddress?: string;
}

interface AppState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  status: UserStatus;
  emergencyContacts: EmergencyContact[];
  isTracking: boolean;
  isSOSActive: boolean;
}

interface AppContextType extends AppState {
  login: (phone: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addEmergencyContact: (contact: EmergencyContact) => void;
  removeEmergencyContact: (id: string) => void;
  setStatus: (status: UserStatus) => void;
  setTracking: (tracking: boolean) => void;
  setSOSActive: (active: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    user: null,
    status: 'safe',
    emergencyContacts: [],
    isTracking: false,
    isSOSActive: false,
  });

  const login = (phone: string) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user: { name: 'User', phone },
    }));
  };

  const logout = () => {
    setState({
      isAuthenticated: false,
      user: null,
      status: 'safe',
      emergencyContacts: [],
      isTracking: false,
      isSOSActive: false,
    });
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...profile } : null,
    }));
  };

  const addEmergencyContact = (contact: EmergencyContact) => {
    setState((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, contact],
    }));
  };

  const removeEmergencyContact = (id: string) => {
    setState((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((c) => c.id !== id),
    }));
  };

  const setStatus = (status: UserStatus) => {
    setState((prev) => ({ ...prev, status }));
  };

  const setTracking = (tracking: boolean) => {
    setState((prev) => ({ ...prev, isTracking: tracking }));
  };

  const setSOSActive = (active: boolean) => {
    setState((prev) => ({ ...prev, isSOSActive: active }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateProfile,
        addEmergencyContact,
        removeEmergencyContact,
        setStatus,
        setTracking,
        setSOSActive,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

