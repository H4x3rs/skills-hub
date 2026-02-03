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

  useEffect(() => {
    // 检查本地存储中的token并获取用户信息
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          setIsLoading(true); // 开始加载
          await fetchCurrentUser();
        } catch (error) {
          console.error('Failed to fetch current user during initialization:', error);
        } finally {
          setIsLoading(false); // 结束加载
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchCurrentUser = async () => {
    if (!token) return;

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
      // 如果获取用户信息失败，清除无效的token
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      throw error; // 抛出错误以便调用方处理
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    
    // 适配新旧两种响应格式
    let token, user;
    if (response.data.success !== undefined) {
      // 新格式: { success: true, data: { token, user } }
      token = response.data.data?.token;
      user = response.data.data?.user;
    } else {
      // 旧格式: { token, user }
      token = response.data.token;
      user = response.data.user;
    }
    
    if (token) {
      localStorage.setItem('token', token);
      setToken(token);
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
    
    // 适配新旧两种响应格式
    let token, user;
    if (response.data.success !== undefined) {
      // 新格式: { success: true, data: { token, user } }
      token = response.data.data?.token;
      user = response.data.data?.user;
    } else {
      // 旧格式: { token, user }
      token = response.data.token;
      user = response.data.user;
    }
    
    if (token) {
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
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
    </AuthContext.Provider>
  );
};