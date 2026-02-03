import { useState, useEffect } from 'react';
import { Users, Package, Settings, BarChart3, Shield, Search, MoreHorizontal, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { userAPI } from '@/lib/api';
import { toast } from 'sonner';

interface User {
  id?: number | string;
  _id?: string;
  username: string;
  email: string;
  role: string;
  isActive?: boolean;
  status?: string;
  skillsCount?: number;
  downloads?: number;
  createdAt?: string;
  joinDate?: string;
}

interface Skill {
  id: number;
  name: string;
  author: string;
  downloads: number;
  status: string;
  createdAt: string;
}

const AdminPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'user'
  });
  const [users, setUsers] = useState<User[]>([]);
  const [skillsData, setSkillsData] = useState<Skill[]>([
    { id: 1, name: 'PDF解析器', author: 'john_doe', downloads: 1245, status: 'published', createdAt: '2024-01-15' },
    { id: 2, name: 'Excel处理器', author: 'jane_smith', downloads: 987, status: 'published', createdAt: '2024-01-10' },
    { id: 3, name: '图像识别器', author: 'bob_wilson', downloads: 756, status: 'pending', createdAt: '2024-01-05' },
    { id: 4, name: '文本翻译器', author: 'john_doe', downloads: 632, status: 'rejected', createdAt: '2024-01-03' },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      
      // 适配新旧两种响应格式
      let usersData = [];
      if (response.data.success !== undefined) {
        // 新格式: { success: true, data: { users: [...] } }
        usersData = response.data.data?.users || [];
      } else {
        // 旧格式: { users: [...] }
        usersData = response.data.users || [];
      }
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(t('admin.fetchUsersError') || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (id: number) => {
    try {
      // 获取当前用户状态并切换
      const currentUser = users.find(user => user.id === id);
      if (!currentUser) return;
      
      const newStatus = currentUser.status === 'active' ? 'inactive' : 'active';
      
      // 调用API更新用户状态
      const response = await userAPI.updateUserStatus(id.toString(), newStatus === 'active');
      
      // 检查响应是否成功（适配新旧两种格式）
      let isSuccessful = true;
      if (response.data.success !== undefined) {
        // 新格式: { success: true/false, ... }
        isSuccessful = response.data.success;
      } else {
        // 旧格式认为是成功的（否则会在catch中处理）
        isSuccessful = true;
      }
      
      if (!isSuccessful) {
        throw new Error(response.data.error || 'Failed to update user status');
      }
      
      // 更新本地状态
      setUsers(users.map(user => 
        user.id === id 
          ? { ...user, status: newStatus } 
          : user
      ));
      
      toast.success(t('admin.userStatusUpdated') || 'User status updated successfully!');
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(t('admin.userStatusUpdateError') || 'Error updating user status');
      
      // 如果API调用失败，恢复原始状态
      setUsers(users.map(user => 
        user.id === id 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
          : user
      ));
    }
  };

  const handleToggleSkillStatus = (id: number, newStatus: string) => {
    setSkillsData(skillsData.map(skill => 
      skill.id === id 
        ? { ...skill, status: newStatus } 
        : skill
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-card rounded-lg border p-4 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground font-medium">
                  AD
                </div>
                <div>
                  <h3 className="font-semibold">{t('admin.dashboard')}</h3>
                  <p className="text-xs text-muted-foreground">{t('admin.adminPanel')}</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <button
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm ${
                    activeTab === 'dashboard'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <BarChart3 className="h-4 w-4" />
                  {t('admin.dashboard')}
                </button>
                <button
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm ${
                    activeTab === 'users'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setActiveTab('users')}
                >
                  <Users className="h-4 w-4" />
                  {t('admin.users')}
                </button>
                <button
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm ${
                    activeTab === 'skills'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setActiveTab('skills')}
                >
                  <Package className="h-4 w-4" />
                  {t('admin.skills')}
                </button>
                <button
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm ${
                    activeTab === 'permissions'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setActiveTab('permissions')}
                >
                  <Shield className="h-4 w-4" />
                  {t('admin.permissions')}
                </button>
                <button
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm ${
                    activeTab === 'settings'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="h-4 w-4" />
                  {t('admin.settings')}
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div>
                <h1 className="text-2xl font-bold font-heading mb-6">{t('admin.dashboard')}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-card rounded-lg border p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('admin.totalUsers')}</p>
                        <p className="text-2xl font-bold">1,245</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg border p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('admin.totalSkills')}</p>
                        <p className="text-2xl font-bold">89</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg border p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Download className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('admin.totalDownloads')}</p>
                        <p className="text-2xl font-bold">124,567</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg border p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <BarChart3 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('admin.activeToday')}</p>
                        <p className="text-2xl font-bold">342</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-lg font-semibold mb-4">{t('admin.recentUsers')}</h2>
                    <div className="space-y-4">
                      {users.slice(0, 3).map(user => (
                        <div key={user.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            {user.joinDate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-lg font-semibold mb-4">{t('admin.pendingSkills')}</h2>
                    <div className="space-y-4">
                      {skillsData.filter(skill => skill.status === 'pending').map(skill => (
                        <div key={skill.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{skill.name}</p>
                            <p className="text-sm text-muted-foreground">{t('skills.author')}: {skill.author}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleToggleSkillStatus(skill.id, 'published')}
                            >
                              {t('admin.approve')}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleToggleSkillStatus(skill.id, 'rejected')}
                              className="text-destructive border-destructive hover:bg-destructive/10"
                            >
                              {t('admin.reject')}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold font-heading">{t('admin.users')}</h1>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t('admin.searchUsers')}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button onClick={() => setShowAddUserModal(true)}>
                      <Users className="h-4 w-4 mr-2" />
                      {t('admin.addUser')}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border overflow-hidden">
                  {loading ? (
                    <div className="p-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="mt-2">{t('common.loading') || 'Loading...'}</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left py-3 px-4">{t('admin.user.username')}</th>
                          <th className="text-left py-3 px-4">{t('admin.user.email')}</th>
                          <th className="text-left py-3 px-4">{t('admin.user.role')}</th>
                          <th className="text-left py-3 px-4">{t('admin.user.status')}</th>
                          <th className="text-left py-3 px-4">{t('admin.user.skillCount')}</th>
                          <th className="text-left py-3 px-4">{t('admin.user.downloadCount')}</th>
                          <th className="text-left py-3 px-4">{t('admin.user.joinDate')}</th>
                          <th className="text-center py-3 px-4">{t('common.actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users && users.length > 0 ? (
                          users.map((user: any) => (
                            <tr key={user.id || user._id} className="border-t">
                              <td className="py-3 px-4 font-medium">{user.username}</td>
                              <td className="py-3 px-4">{user.email}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  user.role === 'admin' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : user.role === 'publisher'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {t(`admin.role.${user.role}`)}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  user.isActive || user.status === 'active'
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {(user.isActive || user.status === 'active') 
                                   ? t('admin.user.active') 
                                   : t('admin.user.inactive')}
                                </span>
                              </td>
                              <td className="py-3 px-4">{user.skillsCount || 0}</td>
                              <td className="py-3 px-4">{(user.downloads || 0).toLocaleString()}</td>
                              <td className="py-3 px-4">{new Date(user.createdAt || user.joinDate).toLocaleDateString()}</td>
                              <td className="py-3 px-4 text-center">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleToggleUserStatus(user.id || user._id)}
                                  className="mr-2"
                                >
                                  {(user.isActive || user.status === 'active') 
                                   ? t('admin.disable') 
                                   : t('admin.enable')}
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="py-8 px-4 text-center text-muted-foreground">
                              {t('admin.noUsersFound') || 'No users found'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold font-heading">{t('admin.skills')}</h1>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t('admin.searchSkills')}
                        className="pl-10 w-64"
                      />
                    </div>
                    <select className="border rounded-md px-3 py-2 bg-background">
                      <option>{t('admin.allStatus')}</option>
                      <option>{t('admin.published')}</option>
                      <option>{t('admin.pending')}</option>
                      <option>{t('admin.rejected')}</option>
                    </select>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left py-3 px-4">{t('profile.skillName')}</th>
                        <th className="text-left py-3 px-4">{t('skills.author')}</th>
                        <th className="text-left py-3 px-4">{t('admin.downloads')}</th>
                        <th className="text-left py-3 px-4">{t('profile.status')}</th>
                        <th className="text-left py-3 px-4">{t('admin.createdAt')}</th>
                        <th className="text-center py-3 px-4">{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skillsData.map((skill) => (
                        <tr key={skill.id} className="border-t">
                          <td className="py-3 px-4 font-medium">{skill.name}</td>
                          <td className="py-3 px-4">{skill.author}</td>
                          <td className="py-3 px-4">{skill.downloads.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              skill.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : skill.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {t(`admin.skillStatus.${skill.status}`)}
                            </span>
                          </td>
                          <td className="py-3 px-4">{skill.createdAt}</td>
                          <td className="py-3 px-4 text-center">
                            <Button variant="outline" size="sm" className="mr-2">
                              {t('admin.view')}
                            </Button>
                            {skill.status === 'pending' && (
                              <div className="inline-flex gap-1">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleToggleSkillStatus(skill.id, 'published')}
                                >
                                  {t('admin.approve')}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleToggleSkillStatus(skill.id, 'rejected')}
                                  className="text-destructive border-destructive hover:bg-destructive/10"
                                >
                                  {t('admin.reject')}
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'permissions' && (
              <div>
                <h1 className="text-2xl font-bold font-heading mb-6">{t('admin.permissions')}</h1>
                
                <div className="bg-card rounded-lg border p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">{t('admin.rolePermissions')}</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <p className="font-medium">{t('admin.role.admin')} ({t('admin.role.adminLabel')})</p>
                        <p className="text-sm text-muted-foreground">{t('admin.role.adminDesc')}</p>
                      </div>
                      <Button variant="outline" size="sm">{t('admin.editPermission')}</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <p className="font-medium">{t('admin.role.publisher')} ({t('admin.role.publisherLabel')})</p>
                        <p className="text-sm text-muted-foreground">{t('admin.role.publisherDesc')}</p>
                      </div>
                      <Button variant="outline" size="sm">{t('admin.editPermission')}</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <p className="font-medium">{t('admin.role.user')} ({t('admin.role.userLabel')})</p>
                        <p className="text-sm text-muted-foreground">{t('admin.role.userDesc')}</p>
                      </div>
                      <Button variant="outline" size="sm">{t('admin.editPermission')}</Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border p-6">
                  <h2 className="text-lg font-semibold mb-4">{t('admin.userRoleAssignment')}</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left py-3 px-4">{t('admin.user.username')}</th>
                          <th className="text-left py-3 px-4">{t('admin.currentRole')}</th>
                          <th className="text-left py-3 px-4">{t('admin.availableRoles')}</th>
                          <th className="text-center py-3 px-4">{t('common.actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id} className="border-t">
                            <td className="py-3 px-4 font-medium">{user.username}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {t(`admin.role.${user.role}`)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <select className="border rounded-md px-2 py-1">
                                <option value="user">{t('admin.role.user')}</option>
                                <option value="publisher">{t('admin.role.publisher')}</option>
                                <option value="admin">{t('admin.role.admin')}</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Button variant="outline" size="sm">{t('admin.update')}</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h1 className="text-2xl font-bold font-heading mb-6">{t('admin.settings')}</h1>
                
                <div className="bg-card rounded-lg border p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-3">{t('admin.siteSettings')}</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('admin.siteTitle')}</label>
                        <Input defaultValue="SkillHub - 智能技能市场" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('admin.siteDescription')}</label>
                        <textarea 
                          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          defaultValue="连接开发者与智能技能的桥梁，让技术更易用"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-3">{t('admin.securitySettings')}</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{t('admin.require2FA')}</p>
                          <p className="text-sm text-muted-foreground">{t('admin.require2FADesc')}</p>
                        </div>
                        <Button variant="outline" size="sm">{t('admin.toggle')}</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{t('admin.enableEmailVerification')}</p>
                          <p className="text-sm text-muted-foreground">{t('admin.enableEmailVerificationDesc')}</p>
                        </div>
                        <Button variant="outline" size="sm">{t('admin.toggle')}</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-3">{t('admin.uploadSettings')}</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('admin.maxFileSize')}</label>
                        <Input type="number" defaultValue="50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('admin.allowedFileTypes')}</label>
                        <Input defaultValue=".zip,.tar.gz,.js,.ts,.json" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-3">{t('admin.maintenanceMode')}</h2>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('admin.siteMaintenance')}</p>
                        <p className="text-sm text-muted-foreground">{t('admin.siteMaintenanceDesc')}</p>
                      </div>
                      <Button variant="outline" size="sm">{t('admin.toggle')}</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* 添加用户模态框 */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">{t('admin.addUser')}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.user.username')}</label>
                <Input
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  placeholder={t('admin.user.username')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t('profile.email')}</label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder={t('profile.email')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t('auth.register.password')}</label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder={t('auth.register.password')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t('profile.fullName')}</label>
                <Input
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                  placeholder={t('profile.fullName')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.user.role')}</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full border rounded-md px-3 py-2 bg-background"
                >
                  <option value="user">{t('admin.role.user')}</option>
                  <option value="publisher">{t('admin.role.publisher')}</option>
                  <option value="admin">{t('admin.role.admin')}</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddUserModal(false);
                  setNewUser({
                    username: '',
                    email: '',
                    password: '',
                    fullName: '',
                    role: 'user'
                  });
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={async () => {
                  // 通知管理员需要通过其他方式添加用户
                  toast.info(t('admin.userAddNotImplemented') || 'User addition via admin panel is not implemented. Use the registration form instead.');
                  setShowAddUserModal(false);
                  setNewUser({
                    username: '',
                    email: '',
                    password: '',
                    fullName: '',
                    role: 'user'
                  });
                }}
              >
                {t('common.save')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;