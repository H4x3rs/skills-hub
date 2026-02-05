import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  AdminSidebar,
  AdminDashboard,
  AdminUsers,
  AdminSkills,
  AdminRoles,
  AdminPermissions,
  AdminSettings,
  AddUserModal,
} from '@/components/admin';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { useAdminSkills } from '@/hooks/useAdminSkills';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const AdminPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const defaultTab = isAdmin ? (tabFromUrl || 'dashboard') : 'skills';
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (isAdmin && tabFromUrl && ['dashboard', 'users', 'skills', 'roles', 'permissions', 'settings'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else if (!isAdmin) {
      setActiveTab('skills');
    }
  }, [tabFromUrl, isAdmin]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', fullName: '', role: 'user' });

  const { users, loading, fetchUsers, toggleUserStatus, updateUserRole, deleteUser } = useAdminUsers(activeTab === 'users');
  const { skills: dashboardSkills, approveSkill, rejectSkill } = useAdminSkills(
    activeTab === 'dashboard',
    { status: 'pending_review', limit: 5 }
  );
  const { stats, loading: statsLoading, refetch: refetchStats } = useDashboardStats(activeTab === 'dashboard');

  const handleApproveSkill = async (id: string) => {
    await approveSkill(id);
    refetchStats();
  };
  const handleRejectSkill = async (id: string) => {
    await rejectSkill(id);
    refetchStats();
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} isAdmin={isAdmin} />
          <div className="flex-1 min-w-0">
            {activeTab === 'dashboard' && (
              <AdminDashboard
                users={users}
                skills={dashboardSkills}
                stats={stats}
                statsLoading={statsLoading}
                onRefetchStats={refetchStats}
                onApproveSkill={id => handleApproveSkill(String(id))}
                onRejectSkill={id => handleRejectSkill(String(id))}
              />
            )}
            {activeTab === 'users' && (
              <AdminUsers
                users={users}
                loading={loading}
                onToggleStatus={toggleUserStatus}
                onUpdateRole={updateUserRole}
                onAddUser={() => setShowAddUserModal(true)}
                onDeleteUser={deleteUser}
                onUserUpdated={fetchUsers}
              />
            )}
            {activeTab === 'roles' && <AdminRoles />}
            {activeTab === 'permissions' && <AdminPermissions />}
            {activeTab === 'skills' && <AdminSkills />}
            {activeTab === 'settings' && <AdminSettings />}
          </div>
        </div>
      </main>
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        formData={newUser}
        onFormChange={setNewUser}
      />
    </div>
  );
};

export default AdminPage;
