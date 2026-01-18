import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/api';

interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  profile_pic?: string;
  has_password?: boolean;
  personal_referral_code?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signInWithGoogle: (idToken: string) => Promise<{ error: any | null }>;
  signInWithApple: (idToken: string, user?: any) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await authService.getCurrentUser();
      // response is the axios response, so access .data
      if (response && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const signUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
    try {
      await authService.register({ 
        email, 
        password, 
        name: metadata ? `${metadata.first_name} ${metadata.last_name}`.trim() : 'User',
        role: 'customer' 
      });
      await signIn(email, password);
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data || error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await authService.login(email, password);
      setUser(data); 
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data || error };
    }
  };

  const signInWithGoogle = async (idToken: string) => {
    try {
      const data = await authService.googleLogin(idToken);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));
      }
      setUser(data);
      return { error: null };
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      return { error: error.response?.data || error };
    }
  };

  const signInWithApple = async (idToken: string, appleUser?: any) => {
    try {
      const data = await authService.appleLogin(idToken, appleUser);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));
      }
      setUser(data);
      return { error: null };
    } catch (error: any) {
      console.error('Apple Sign-In Error:', error);
      return { error: error.response?.data || error };
    }
  };

  const signOut = async () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithApple,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
