import { useState } from 'react';
import { User, Calendar, Download, Upload, Package, Settings, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({
    username: 'john_doe',
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    bio: 'Full-stack developer passionate about building amazing experiences',
    avatar: '',
    joinDate: '2023-01-15',
    totalDownloads: 12456,
    totalSkills: 8,
  });

  const [skills, setSkills] = useState([
    { id: 1, name: 'PDF解析器', downloads: 1245, version: '1.2.3', status: 'published', lastUpdated: '2024-01-15' },
    { id: 2, name: 'Excel处理器', downloads: 987, version: '2.1.0', status: 'published', lastUpdated: '2024-01-10' },
    { id: 3, name: '图像识别器', downloads: 756, version: '1.0.5', status: 'published', lastUpdated: '2024-01-05' },
  ]);

  const handleSaveProfile = () => {
    console.log('Saving profile:', userData);
    // 实际应用中这里会调用API保存用户资料
  };

  const handleDeleteSkill = (id: number) => {
    if (window.confirm(t('common.deleteConfirm'))) {
      setSkills(skills.filter(skill => skill.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-card rounded-lg border p-4 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground font-medium text-lg">
                  JD
                </div>
                <div>
                  <h3 className="font-semibold">{userData.username}</h3>
                  <p className="text-xs text-muted-foreground">@{userData.username}</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <button
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm ${
                    activeTab === 'profile'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="h-4 w-4" />
                  {t('profile.mySkills')}
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
                  {t('profile.mySkills')}
                </button>
                <button
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm ${
                    activeTab === 'analytics'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setActiveTab('analytics')}
                >
                  <BarChart3 className="h-4 w-4" />
                  {t('profile.analytics')}
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
                  {t('profile.settings')}
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div>
                <h1 className="text-2xl font-bold font-heading mb-6">{t('profile.title')}</h1>
                
                <div className="bg-card rounded-lg border p-6">
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="bg-primary w-24 h-24 rounded-full flex items-center justify-center text-primary-foreground font-medium text-2xl mb-4">
                        JD
                      </div>
                      <Button variant="outline" size="sm">
                        {t('profile.changeAvatar')}
                      </Button>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('profile.username')}</label>
                        <Input
                          value={userData.username}
                          onChange={(e) => setUserData({...userData, username: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('profile.fullName')}</label>
                        <Input
                          value={userData.fullName}
                          onChange={(e) => setUserData({...userData, fullName: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('profile.email')}</label>
                        <Input
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('profile.joinDate')}</label>
                        <Input
                          value={userData.joinDate}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">{t('profile.bio')}</label>
                    <textarea
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={userData.bio}
                      onChange={(e) => setUserData({...userData, bio: e.target.value})}
                    />
                  </div>
                  
                  <Button onClick={handleSaveProfile}>{t('profile.saveChanges')}</Button>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold font-heading">{t('profile.mySkills')}</h1>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    {t('home.publishSkill')}
                  </Button>
                </div>
                
                <div className="bg-card rounded-lg border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left py-3 px-4">{t('profile.skillName')}</th>
                        <th className="text-left py-3 px-4">{t('profile.version')}</th>
                        <th className="text-left py-3 px-4">{t('profile.downloads')}</th>
                        <th className="text-left py-3 px-4">{t('profile.status')}</th>
                        <th className="text-left py-3 px-4">{t('profile.lastUpdated')}</th>
                        <th className="text-right py-3 px-4">{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skills.map((skill) => (
                        <tr key={skill.id} className="border-t">
                          <td className="py-3 px-4 font-medium">{skill.name}</td>
                          <td className="py-3 px-4">{skill.version}</td>
                          <td className="py-3 px-4">{skill.downloads.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {skill.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{skill.lastUpdated}</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="outline" size="sm" className="mr-2">
                              {t('profile.edit')}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="text-destructive border-destructive hover:bg-destructive/10"
                            >
                              {t('profile.delete')}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-bold font-heading mb-4">{t('profile.versionManagement')}</h2>
                  <div className="bg-card rounded-lg border p-6">
                    <h3 className="font-semibold mb-4">PDF解析器 - {t('profile.versionHistory')}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <span className="font-medium">v1.2.3</span>
                          <span className="text-sm text-muted-foreground ml-2">2024-01-15</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">{t('profile.setDefault')}</Button>
                          <Button variant="outline" size="sm">{t('profile.viewDetails')}</Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <span className="font-medium">v1.2.2</span>
                          <span className="text-sm text-muted-foreground ml-2">2024-01-10</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">{t('profile.setDefault')}</Button>
                          <Button variant="outline" size="sm">{t('profile.viewDetails')}</Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <span className="font-medium">v1.2.1</span>
                          <span className="text-sm text-muted-foreground ml-2">2024-01-05</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">{t('profile.setDefault')}</Button>
                          <Button variant="outline" size="sm">{t('profile.viewDetails')}</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h1 className="text-2xl font-bold font-heading mb-6">{t('profile.analytics')}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-card rounded-lg border p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Download className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('profile.totalDownloads')}</p>
                        <p className="text-2xl font-bold">{userData.totalDownloads.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg border p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('profile.skillCount')}</p>
                        <p className="text-2xl font-bold">{userData.totalSkills}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg border p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('profile.joinDate')}</p>
                        <p className="text-2xl font-bold">{userData.joinDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border p-6">
                  <h2 className="text-xl font-bold font-heading mb-4">{t('profile.trend')}</h2>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    {t('profile.chartArea')}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h1 className="text-2xl font-bold font-heading mb-6">设置</h1>
                
                <div className="bg-card rounded-lg border p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-3">账户设置</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">接收通知邮件</p>
                          <p className="text-sm text-muted-foreground">接收重要通知和更新</p>
                        </div>
                        <Button variant="outline" size="sm">切换</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">允许他人联系</p>
                          <p className="text-sm text-muted-foreground">允许其他用户通过邮件联系您</p>
                        </div>
                        <Button variant="outline" size="sm">切换</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-3">安全设置</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">双因素认证</p>
                          <p className="text-sm text-muted-foreground">增强账户安全性</p>
                        </div>
                        <Button variant="outline" size="sm">启用</Button>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-2">修改密码</p>
                        <div className="flex gap-2">
                          <Input type="password" placeholder="当前密码" className="max-w-xs" />
                          <Input type="password" placeholder="新密码" className="max-w-xs" />
                          <Button>更新密码</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-3">导出数据</h2>
                    <p className="text-sm text-muted-foreground mb-3">
                      导出您的个人数据和技能信息
                    </p>
                    <Button variant="outline">导出数据</Button>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-3 text-destructive">危险区域</h2>
                    <Button variant="destructive">删除账户</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;