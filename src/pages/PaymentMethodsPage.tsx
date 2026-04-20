import { useEffect, useMemo, useState } from 'react';
import { Pencil, X } from 'lucide-react';
import {
  paymentMethodsService,
  type AdminPaymentMethodItem,
} from '../services/payment-methods.service';
import { useAdminFilters } from '../hooks/useAdminFilters';

type PaymentMethodDraft = Omit<AdminPaymentMethodItem, 'id' | '_id'>;
type PaymentMethodFilters = {
  search: string;
  status: 'all' | 'active' | 'inactive';
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

const Badge = ({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'success' | 'danger';
}) => {
  const map = {
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700',
    danger: 'bg-red-50 text-red-700',
  };

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${map[tone]}`}>
      {children}
    </span>
  );
};

const Modal = ({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
};

const inputClassName =
  'w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500';

export function PaymentMethodsPage() {
  const emptyDraft: PaymentMethodDraft = {
    name: '',
    code: '',
    provider: '',
    type: '',
    accountLabel: 'Numero de pago',
    accountValue: '',
    accountNumber: '',
    holderName: '',
    accountHolder: '',
    instructions: '',
    isActive: true,
    displayOrder: 0,
    sortOrder: 0,
  };

  const [items, setItems] = useState<AdminPaymentMethodItem[]>([]);
  const { filters, updateFilter } = useAdminFilters<PaymentMethodFilters>({
    search: '',
    status: 'all',
  });
  const [selected, setSelected] = useState<AdminPaymentMethodItem | null>(null);
  const [draft, setDraft] = useState<PaymentMethodDraft>(emptyDraft);
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setItems(await paymentMethodsService.getAll());
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron cargar los metodos'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const search = filters.search.trim().toLowerCase();
        const matchesSearch =
          !search ||
          item.name.toLowerCase().includes(search) ||
          item.code.toLowerCase().includes(search) ||
          (item.provider || '').toLowerCase().includes(search) ||
          (item.type || '').toLowerCase().includes(search);
        const matchesStatus =
          filters.status === 'all' ||
          (filters.status === 'active' ? item.isActive : !item.isActive);

        return matchesSearch && matchesStatus;
      }),
    [filters.search, filters.status, items],
  );

  const openCreate = () => {
    setSelected(null);
    setDraft(emptyDraft);
    setFormError('');
    setEditorOpen(true);
  };

  const openEdit = (item: AdminPaymentMethodItem) => {
    setSelected(item);
    setDraft({
      name: item.name,
      code: item.code,
      provider: item.provider || '',
      type: item.type || '',
      accountLabel: item.accountLabel || 'Numero de pago',
      accountValue: item.accountValue || item.accountNumber || '',
      accountNumber: item.accountNumber || '',
      holderName: item.holderName || item.accountHolder || '',
      accountHolder: item.accountHolder || '',
      instructions: item.instructions || '',
      isActive: item.isActive,
      displayOrder: item.displayOrder || item.sortOrder || 0,
      sortOrder: item.sortOrder || 0,
    });
    setFormError('');
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setSelected(null);
    setDraft(emptyDraft);
    setFormError('');
    setEditorOpen(false);
  };

  const save = async () => {
    try {
      setSaving(true);
      setFormError('');
      if (selected) {
        await paymentMethodsService.update(selected.id, draft);
      } else {
        await paymentMethodsService.create(draft);
      }
      await load();
      closeEditor();
    } catch (err: unknown) {
      setFormError(getErrorMessage(err, 'No se pudo guardar el metodo'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-56 items-center justify-center text-slate-500">Cargando metodos de pago...</div>;
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center"><p className="text-red-700">{error}</p><button onClick={load} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white">Reintentar</button></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Metodos de pago</h1>
          <p className="text-slate-500">Configura Nequi y otros medios activos</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700">Actualizar</button>
          <button onClick={openCreate} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white">Nuevo metodo</button>
        </div>
      </div>
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-3">
        <input value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} placeholder="Buscar metodo, codigo o proveedor" className={inputClassName} />
        <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value as PaymentMethodFilters['status'])} className={inputClassName}>
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
        <div className="rounded-lg bg-slate-50 px-4 py-2.5 text-sm text-slate-600">{filteredItems.length} de {items.length} metodos</div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-600">
            <tr>
              <th className="px-6 py-4">Metodo</th>
              <th className="px-6 py-4">Cuenta</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Orden</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4"><div className="font-medium text-slate-900">{item.name}</div><div className="text-xs text-slate-500">{item.type || item.provider || item.code}</div></td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.accountValue || item.accountNumber || '-'}</td>
                <td className="px-6 py-4"><Badge tone={item.isActive ? 'success' : 'danger'}>{item.isActive ? 'Activo' : 'Inactivo'}</Badge></td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.displayOrder || item.sortOrder || 0}</td>
                <td className="px-6 py-4 text-right"><button onClick={() => openEdit(item)} className="rounded-lg p-2 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={editorOpen} title={selected ? 'Editar metodo de pago' : 'Nuevo metodo de pago'} onClose={closeEditor}>
        <div className="space-y-4">
          {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</div> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Nombre</span><input value={draft.name} onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Codigo</span><input value={draft.code} onChange={(e) => setDraft((prev) => ({ ...prev, code: e.target.value }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Proveedor</span><input value={draft.provider} onChange={(e) => setDraft((prev) => ({ ...prev, provider: e.target.value }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Tipo</span><input value={draft.type} onChange={(e) => setDraft((prev) => ({ ...prev, type: e.target.value }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Etiqueta cuenta</span><input value={draft.accountLabel} onChange={(e) => setDraft((prev) => ({ ...prev, accountLabel: e.target.value }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Valor cuenta</span><input value={draft.accountValue} onChange={(e) => setDraft((prev) => ({ ...prev, accountValue: e.target.value, accountNumber: e.target.value }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Titular</span><input value={draft.holderName || draft.accountHolder} onChange={(e) => setDraft((prev) => ({ ...prev, holderName: e.target.value, accountHolder: e.target.value }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Orden</span><input type="number" min="0" value={draft.displayOrder} onChange={(e) => setDraft((prev) => ({ ...prev, displayOrder: Number(e.target.value), sortOrder: Number(e.target.value) }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Estado</span><select value={draft.isActive ? 'active' : 'inactive'} onChange={(e) => setDraft((prev) => ({ ...prev, isActive: e.target.value === 'active' }))} className={inputClassName}><option value="active">Activo</option><option value="inactive">Inactivo</option></select></label>
          </div>
          <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Instrucciones</span><textarea rows={5} value={draft.instructions} onChange={(e) => setDraft((prev) => ({ ...prev, instructions: e.target.value }))} className={inputClassName} /></label>
          <div className="flex gap-3">
            <button onClick={closeEditor} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700">Cancelar</button>
            <button disabled={saving} onClick={() => void save()} className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm text-white disabled:opacity-60">{saving ? 'Guardando...' : 'Guardar metodo'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
