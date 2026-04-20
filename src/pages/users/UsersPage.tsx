import { useCallback, useMemo, useState } from 'react';
import { Pencil, RefreshCw } from 'lucide-react';
import { usersService } from '../../services/users.service';
import { useAdminFilters } from '../../hooks/useAdminFilters';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import {
  Badge,
  EmptyState,
  ErrorBox,
  Field,
  inputClassName,
  Loading,
  MetricCard,
  Modal,
  PageHeader,
  PaginationControls,
} from '../../components/shared/ui';
import type { AdminUser } from '../../types/admin';

type UserFilters = {
  search: string;
  role: string;
  status: string;
};

type UserDraft = {
  role: AdminUser['role'];
  isActive: boolean;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }

  return fallback;
};

export const UsersPage = () => {
  const { filters, updateFilter } = useAdminFilters<UserFilters>({
    search: '',
    role: 'all',
    status: 'all',
  });
  const fetchUsers = useCallback(
    ({
      page,
      limit,
      search,
      role,
      status,
    }: UserFilters & { page: number; limit: number }) =>
      usersService.getAll({
        page,
        limit,
        search,
        role: role === 'all' ? undefined : role,
        isActive: status === 'all' ? undefined : status === 'active',
      }),
    [],
  );
  const {
    items,
    meta: pagination,
    loading,
    error,
    load,
    setPage,
    changeLimit,
  } = usePaginatedList<AdminUser, UserFilters>({
    fetchPage: fetchUsers,
    filters,
  });
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [draft, setDraft] = useState<UserDraft>({
    role: 'user',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const filtered = useMemo(() => items, [items]);

  const openEditor = (user: AdminUser) => {
    setSelected(user);
    setDraft({ role: user.role || 'user', isActive: !!user.isActive });
    setFormError('');
    setSuccess('');
  };

  const save = async () => {
    if (!selected) return;
    try {
      setSaving(true);
      setFormError('');
      if (draft.role !== selected.role) await usersService.updateRole(selected.id, draft.role);
      if (draft.isActive !== selected.isActive) await usersService.updateStatus(selected.id, draft.isActive);
      await load();
      setSelected(null);
      setSuccess('Usuario actualizado correctamente');
    } catch (err: unknown) {
      setFormError(getErrorMessage(err, 'No se pudo guardar el usuario'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading label="Cargando usuarios..." />;
  if (error) return <ErrorBox message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuarios"
        description="Gestion operativa de cuentas, estado y rol administrativo"
        action={<button onClick={load} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white"><RefreshCw className="mr-1 inline h-4 w-4" />Actualizar</button>}
      />
      {success ? <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div> : null}
      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard title="Total" value={items.length} />
        <MetricCard title="Activos" value={items.filter((item) => item.isActive).length} />
        <MetricCard title="Superadmin" value={items.filter((item) => item.role === 'superadmin').length} />
      </div>
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-4">
        <input value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} placeholder="Buscar por nombre, email o ID" className={inputClassName} />
        <select value={filters.role} onChange={(event) => updateFilter('role', event.target.value)} className={inputClassName}>
          <option value="all">Todos los roles</option>
          <option value="user">Usuario</option>
          <option value="superadmin">Superadmin</option>
        </select>
        <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)} className={inputClassName}>
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
        <button onClick={() => setPage(1)} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700">Aplicar filtros</button>
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="No hay usuarios para el filtro actual" description="Ajusta la busqueda o cambia los filtros." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-600">
              <tr><th className="px-6 py-4">Usuario</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Rol</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4 text-right">Acciones</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4"><div className="font-medium text-slate-900">{item.name}</div><div className="font-mono text-xs text-slate-400">{item.id}</div></td>
                  <td className="px-6 py-4 text-slate-600">{item.email}</td>
                  <td className="px-6 py-4"><Badge tone={item.role === 'superadmin' ? 'info' : 'neutral'}>{item.role || 'user'}</Badge></td>
                  <td className="px-6 py-4"><Badge tone={item.isActive ? 'success' : 'danger'}>{item.isActive ? 'Activo' : 'Inactivo'}</Badge></td>
                  <td className="px-6 py-4 text-right"><button onClick={() => openEditor(item)} className="rounded-lg p-2 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pagination ? (
        <PaginationControls
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onPageChange={setPage}
          onLimitChange={changeLimit}
          itemLabel="usuarios"
        />
      ) : null}      <Modal open={!!selected} title="Editar usuario" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="space-y-4">
            {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</div> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nombre"><input value={selected.name} disabled className={inputClassName} /></Field>
              <Field label="Email"><input value={selected.email} disabled className={inputClassName} /></Field>
              <Field label="Rol"><select value={draft.role} onChange={(event) => setDraft((prev) => ({ ...prev, role: event.target.value as AdminUser['role'] }))} className={inputClassName}><option value="user">user</option><option value="superadmin">superadmin</option></select></Field>
              <Field label="Estado"><select value={draft.isActive ? 'active' : 'inactive'} onChange={(event) => setDraft((prev) => ({ ...prev, isActive: event.target.value === 'active' }))} className={inputClassName}><option value="active">Activo</option><option value="inactive">Inactivo</option></select></Field>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelected(null)} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700">Cancelar</button>
              <button disabled={saving} onClick={() => void save()} className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm text-white disabled:opacity-60">{saving ? 'Guardando...' : 'Guardar cambios'}</button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
