import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { permissionAPI } from '@/lib/api';
import { TruncateWithTooltip } from '@/components/ui/truncate-with-tooltip';
import { toast } from 'sonner';

interface Permission {
  _id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

const ACTIONS = ['create', 'read', 'update', 'delete', 'manage'];

export const AdminPermissions = () => {
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Permission | null>(null);
  const [form, setForm] = useState({ name: '', description: '', resource: '', action: 'read' });

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const res = await permissionAPI.getAll({ limit: 100 });
      setPermissions(res.data.data?.permissions || []);
    } catch (error) {
      toast.error(t('admin.fetchUsersError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', resource: '', action: 'read' });
    setShowForm(false);
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await permissionAPI.update(editing._id, { description: form.description, resource: form.resource, action: form.action });
        toast.success(t('admin.updateSuccess'));
      } else {
        await permissionAPI.create(form);
        toast.success(t('admin.createSuccess'));
      }
      resetForm();
      fetchPermissions();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.delete') + '?')) return;
    try {
      await permissionAPI.delete(id);
      toast.success(t('admin.deleteSuccess'));
      fetchPermissions();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-heading">{t('admin.permissions')}</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('admin.addPermission')}
        </Button>
      </div>

      {(showForm || editing) && (
        <div className="bg-card rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? t('admin.edit') : t('admin.addPermission')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.permissionName')}</label>
              <Input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. skill_create"
                required
                disabled={!!editing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.permissionDesc')}</label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.resource')}</label>
                <Input value={form.resource} onChange={e => setForm({ ...form, resource: e.target.value })} placeholder="e.g. skill" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.action')}</label>
                <select
                  value={form.action}
                  onChange={e => setForm({ ...form, action: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 bg-background"
                >
                  {ACTIONS.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{t('admin.save')}</Button>
              <Button type="button" variant="outline" onClick={resetForm}>{t('common.cancel')}</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card rounded-lg border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <colgroup>
                <col style={{ width: 160 }} />
                <col style={{ width: 100 }} />
                <col style={{ width: 90 }} />
                <col style={{ width: 240 }} />
                <col style={{ width: 130 }} />
              </colgroup>
              <thead className="bg-muted">
                <tr>
                  <th className="text-left py-3 px-4">{t('admin.permissionName')}</th>
                  <th className="text-left py-3 px-4">{t('admin.resource')}</th>
                  <th className="text-left py-3 px-4">{t('admin.action')}</th>
                  <th className="text-left py-3 px-4">{t('admin.permissionDesc')}</th>
                  <th className="text-center py-3 px-4">{t('common.actions')}</th>
                </tr>
              </thead>
            <tbody>
              {permissions.map(p => (
                <tr key={p._id} className="border-t">
                  <td className="py-3 px-4 font-medium overflow-hidden min-w-0">
                    <TruncateWithTooltip content={p.name}>{p.name}</TruncateWithTooltip>
                  </td>
                  <td className="py-3 px-4">{p.resource}</td>
                  <td className="py-3 px-4">{p.action}</td>
                  <td className="py-3 px-4 overflow-hidden min-w-0">
                    <TruncateWithTooltip content={p.description}>{p.description}</TruncateWithTooltip>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setEditing(p); setForm({ name: p.name, description: p.description, resource: p.resource, action: p.action }); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(p._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
};
