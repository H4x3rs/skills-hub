import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
  }) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = React.useCallback(async () => {
    // 优先从 localStorage 读取，避免刷新时 token 状态尚未更新导致提前 return
    const tokenToUse = token || localStorage.getItem('token');
    if (!tokenToUse) return;

    try {
      const response = await authAPI.getCurrentUser();
      
      // 适配新旧两种响应格式
      let user;
      if (response.data.success !== undefined) {
        // 新格式: { success: true, data: { user } }
        user = response.data.data?.user;
      } else {
        // 旧格式: { user }
        user = response.data.user;
      }
      
      setUser(user);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setUser(null);
      throw error; // 抛出错误以便调用方处理
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          setIsLoading(true);
          await fetchCurrentUser();
        } catch (error) {
          console.error('Failed to fetch current user during initialization:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    
    const data = response.data.data || response.data;
    const accessToken = data.accessToken || data.token;
    const refreshToken = data.refreshToken;
    const user = data.user;
    
    if (accessToken) {
      localStorage.setItem('token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      setToken(accessToken);
      setUser(user);
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
  }) => {
    const response = await authAPI.register(userData);
    
    const data = response.data.data || response.data;
    const accessToken = data.accessToken || data.token;
    const refreshToken = data.refreshToken;
    const user = data.user;
    
    if (accessToken) {
      localStorage.setItem('token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      setToken(accessToken);
      setUser(user);
    }
  };

  const logout = () => {
    authAPI.logout().catch(() => {}).finally(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setUser(null);
    });
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    fetchCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </AuthContext.Provider>
  );
};