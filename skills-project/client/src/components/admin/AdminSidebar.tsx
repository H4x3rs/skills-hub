import { BarChart3, Users, Package, ShieldCheck, Key, Settings, Shield, FolderTree, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ALL_TABS = [
  { id: 'dashboard', icon: BarChart3 },
  { id: 'users', icon: Users },
  { id: 'skills', icon: Package },
  { id: 'blogs', icon: FileText },
  { id: 'categories', icon: FolderTree },
  { id: 'roles', icon: ShieldCheck },
  { id: 'permissions', icon: Key },
  { id: 'settings', icon: Settings },
] as const;

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin?: boolean;
}

export const AdminSidebar = ({ activeTab, onTabChange, isAdmin = true }: AdminSidebarProps) => {
  const { t } = useTranslation();
  const tabs = isAdmin ? ALL_TABS : ALL_TABS.filter((t) => t.id === 'skills');

  return (
    <div className="w-full md:w-56 flex-shrink-0">
      <div className="bg-card rounded-xl border p-4 sticky top-24 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b">
          <div className="bg-primary w-9 h-9 rounded-lg flex items-center justify-center text-primary-foreground shrink-0">
            <Shield className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate">
              {isAdmin ? t('admin.adminPanel', '管理后台') : t('profile.mySkills', '我的技能')}
            </h3>
          </div>
        </div>
        <nav className="space-y-0.5">
          {tabs.map(({ id, icon: Icon }) => (
            <button
              key={id}
              className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
              }`}
              onClick={() => onTabChange(id)}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{t(`admin.${id}`)}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
