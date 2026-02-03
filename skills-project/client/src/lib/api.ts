import axios from 'axios';

// 创建axios实例
const API_BASE_URL = 'http://localhost:3001/api'; // 后端运行在3001端口

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期或无效，清除本地存储并重定向到登录页
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证相关的API方法
export const authAPI = {
  // 用户注册
  register: (userData: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
  }) => {
    return api.post('/auth/register', userData);
  },

  // 用户登录
  login: (credentials: { email: string; password: string }) => {
    return api.post('/auth/login', credentials);
  },

  // 用户登出
  logout: () => {
    return api.post('/auth/logout');
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    return api.get('/auth/me');
  },
};

// 用户管理相关的API方法
export const userAPI = {
  // 获取所有用户（管理员）
  getAllUsers: (params?: { page?: number; limit?: number }) => {
    return api.get('/admin/users', { params });
  },

  // 获取特定用户信息
  getUserById: (userId: string) => {
    return api.get(`/users/${userId}`);
  },

  // 更新用户信息
  updateUser: (userId: string, userData: {
    fullName?: string;
    bio?: string;
    avatar?: string;
  }) => {
    return api.put(`/users/${userId}`, userData);
  },

  // 更新用户角色（管理员）
  updateUserRole: (userId: string, role: string) => {
    return api.put(`/admin/users/${userId}/role`, { role });
  },

  // 更新用户状态（管理员）
  updateUserStatus: (userId: string, isActive: boolean) => {
    return api.put(`/users/${userId}/status`, { isActive });
  },
};

export default api;