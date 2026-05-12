import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface User {
  id: number;
  name: string;
  telegram_id: string;
  [key: string]: any;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
}

// Helper to handle storage switch between Native (SecureStore) and Web (localStorage)
const storage = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true, // true until we check secure store

  login: async (token: string, user: User) => {
    await storage.setItem('auth_token', token);
    await storage.setItem('auth_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: async () => {
    await storage.removeItem('auth_token');
    await storage.removeItem('auth_user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  restoreToken: async () => {
    try {
      const token = await storage.getItem('auth_token');
      const userStr = await storage.getItem('auth_user');
      
      if (token && userStr) {
        set({ 
          token, 
          user: JSON.parse(userStr), 
          isAuthenticated: true 
        });
      }
    } catch (e) {
      console.error('Failed to restore token', e);
    } finally {
      set({ isLoading: false });
    }
  },
}));
