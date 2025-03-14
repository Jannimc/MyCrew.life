import { create } from 'zustand';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * Zustand store for authentication state and methods
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  
  // Set the current user
  setUser: (user) => set({ user }),
  
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('The email or password you entered is incorrect');
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
        }
        throw error;
      }
      
      if (data.user) {
        set({ user: data.user });
      }
    } catch (error) {
      console.error('Auth store sign in error:', error);
      throw error instanceof Error 
        ? error 
        : new Error('Unable to sign in at this time. Please try again later.');
    }
  },

  // Sign in with Google OAuth
  signInWithGoogle: async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        },
      });
      
      if (error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
        }
        throw error;
      }
    } catch (error) {
      console.error('Auth store Google sign in error:', error);
      throw error instanceof Error 
        ? error 
        : new Error('Unable to sign in with Google at this time. Please try again later.');
    }
  },

  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            email_confirm: true
          }
        },
      });
      
      if (error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
        }
        throw error;
      }
      
      if (data.user) {
        const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error('Auto sign in after signup failed:', signInError);
        } else if (signInData.user) {
          set({ user: signInData.user });
        }
      }
    } catch (error) {
      console.error('Auth store sign up error:', error);
      throw error instanceof Error 
        ? error 
        : new Error('Unable to create account at this time. Please try again later.');
    }
  },

  // Sign out the current user
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
        }
        throw error;
      }
      set({ user: null });
    } catch (error) {
      console.error('Auth store sign out error:', error);
      throw error instanceof Error 
        ? error 
        : new Error('Unable to sign out at this time. Please try again later.');
    }
  },
}));