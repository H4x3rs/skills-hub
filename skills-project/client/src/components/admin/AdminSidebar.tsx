import { BarChart3, Users, Package, ShieldCheck, Key, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TABS = [
  { id: 'dashboard', icon: BarChart3 },
  { id: 'users', icon: Users },
  { id: 'skills', icon: Package },
  { id: 'roles', icon: ShieldCheck },
  { id: 'permissions', icon: Key },
  { id: 'settings', icon: Settings },
] as const;

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const { t } = useTranslation();

  return (
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
          {TABS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                activeTab === id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
              onClick={() => onTabChange(id)}
            >
              <Icon className="h-4 w-4" />
              {t(`admin.${id}`)}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
