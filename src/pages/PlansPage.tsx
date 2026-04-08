import { useEffect, useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { plansService, type AdminPlanItem } from '../services/plans.service';

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

  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${map[tone]}`}>{children}</span>;
};

const Modal = ({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
};

const inputClassName =
  'w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500';

const formatMoney = (value: number, currency = 'COP') =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value || 0);

export function PlansPage() {
  const emptyDraft = {
    name: '',
    code: '',
    description: '',
    category: 'premium',
    price: 0,
    currency: 'COP',
    durationDays: 30,
    limits: { maxChatsPerMonth: 10, maxMessagesPerMonth: 100, maxDocumentsMB: 50, monthlyTokens: 100, extraTokens: 0 },
    isActive: true,
    isDefault: false,
    isCustomizable: false,
    displayOrder: 0,
    sortOrder: 0,
  };
  const [items, setItems] = useState<AdminPlanItem[]>([]);
  const [selected, setSelected] = useState<AdminPlanItem | null>(null);
  const [draft, setDraft] = useState<any>(emptyDraft);
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setItems(await plansService.getAll());
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudieron cargar los planes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openCreate = () => {
    setSelected(null);
    setDraft(emptyDraft);
    setFormError('');
    setEditorOpen(true);
  };

  const openEdit = (item: AdminPlanItem) => {
    setSelected(item);
    setDraft({
      name: item.name,
      code: item.code,
      description: item.description || '',
      category: item.category,
      price: item.price || 0,
      currency: item.currency || 'COP',
      durationDays: item.durationDays || 30,
      limits: {
        maxChatsPerMonth: item.limits?.maxChatsPerMonth ?? 0,
        maxMessagesPerMonth: item.limits?.maxMessagesPerMonth ?? 0,
        maxDocumentsMB: item.limits?.maxDocumentsMB ?? 0,
        monthlyTokens: item.limits?.monthlyTokens ?? 0,
        extraTokens: item.limits?.extraTokens ?? 0,
      },
      isActive: item.isActive,
      isDefault: item.isDefault,
      isCustomizable: item.isCustomizable,
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
        await plansService.update(selected.id, draft);
      } else {
        await plansService.create(draft);
      }
      await load();
      closeEditor();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'No se pudo guardar el plan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-56 items-center justify-center text-slate-500">Cargando planes...</div>;
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center"><p className="text-red-700">{error}</p><button onClick={load} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white">Reintentar</button></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Planes y paquetes</h1><p className="text-slate-500">Precio, duracion, categoria y limites por plan</p></div>
        <div className="flex gap-2">
          <button onClick={load} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700">Actualizar</button>
          <button onClick={openCreate} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white">Nuevo plan</button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-600"><tr><th className="px-6 py-4">Plan</th><th className="px-6 py-4">Categoria</th><th className="px-6 py-4">Precio</th><th className="px-6 py-4">Duracion</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4 text-right">Acciones</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4"><div className="font-medium text-slate-900">{item.name}</div><div className="text-xs text-slate-500">{item.code}</div></td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{formatMoney(item.price, item.currency)}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.durationDays} dias</td>
                <td className="px-6 py-4"><Badge tone={item.isActive ? 'success' : 'danger'}>{item.isActive ? 'Activo' : 'Inactivo'}</Badge></td>
                <td className="px-6 py-4 text-right"><button onClick={() => openEdit(item)} className="rounded-lg p-2 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={editorOpen} title={selected ? 'Editar plan' : 'Nuevo plan'} onClose={closeEditor}>
        <div className="space-y-4">
          {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</div> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Nombre</span><input value={draft.name} onChange={(e) => setDraft((prev: any) => ({ ...prev, name: e.target.value }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Codigo</span><input value={draft.code} onChange={(e) => setDraft((prev: any) => ({ ...prev, code: e.target.value }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Categoria</span><select value={draft.category} onChange={(e) => setDraft((prev: any) => ({ ...prev, category: e.target.value }))} className={inputClassName}><option value="free">free</option><option value="premium">premium</option><option value="extra_tokens">extra_tokens</option><option value="custom">custom</option><option value="subscription">subscription</option><option value="tokens">tokens</option></select></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Precio</span><input type="number" min="0" value={draft.price} onChange={(e) => setDraft((prev: any) => ({ ...prev, price: Number(e.target.value) }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Moneda</span><input value={draft.currency} onChange={(e) => setDraft((prev: any) => ({ ...prev, currency: e.target.value }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Duracion (dias)</span><input type="number" min="1" value={draft.durationDays} onChange={(e) => setDraft((prev: any) => ({ ...prev, durationDays: Number(e.target.value) }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Estado</span><select value={draft.isActive ? 'active' : 'inactive'} onChange={(e) => setDraft((prev: any) => ({ ...prev, isActive: e.target.value === 'active' }))} className={inputClassName}><option value="active">Activo</option><option value="inactive">Inactivo</option></select></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Default</span><select value={draft.isDefault ? 'true' : 'false'} onChange={(e) => setDraft((prev: any) => ({ ...prev, isDefault: e.target.value === 'true' }))} className={inputClassName}><option value="false">No</option><option value="true">Si</option></select></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Customizable</span><select value={draft.isCustomizable ? 'true' : 'false'} onChange={(e) => setDraft((prev: any) => ({ ...prev, isCustomizable: e.target.value === 'true' }))} className={inputClassName}><option value="false">No</option><option value="true">Si</option></select></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Orden</span><input type="number" min="0" value={draft.displayOrder} onChange={(e) => setDraft((prev: any) => ({ ...prev, displayOrder: Number(e.target.value), sortOrder: Number(e.target.value) }))} className={inputClassName} /></label>
          </div>
          <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Descripcion</span><textarea rows={4} value={draft.description} onChange={(e) => setDraft((prev: any) => ({ ...prev, description: e.target.value }))} className={inputClassName} /></label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Max chats/mes</span><input type="number" min="0" value={draft.limits.maxChatsPerMonth} onChange={(e) => setDraft((prev: any) => ({ ...prev, limits: { ...prev.limits, maxChatsPerMonth: Number(e.target.value) } }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Max mensajes/mes</span><input type="number" min="0" value={draft.limits.maxMessagesPerMonth} onChange={(e) => setDraft((prev: any) => ({ ...prev, limits: { ...prev.limits, maxMessagesPerMonth: Number(e.target.value) } }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Max documentos MB</span><input type="number" min="0" value={draft.limits.maxDocumentsMB} onChange={(e) => setDraft((prev: any) => ({ ...prev, limits: { ...prev.limits, maxDocumentsMB: Number(e.target.value) } }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Tokens mensuales</span><input type="number" min="0" value={draft.limits.monthlyTokens} onChange={(e) => setDraft((prev: any) => ({ ...prev, limits: { ...prev.limits, monthlyTokens: Number(e.target.value) } }))} className={inputClassName} /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Extra tokens</span><input type="number" min="0" value={draft.limits.extraTokens} onChange={(e) => setDraft((prev: any) => ({ ...prev, limits: { ...prev.limits, extraTokens: Number(e.target.value) } }))} className={inputClassName} /></label>
          </div>
          <div className="flex gap-3">
            <button onClick={closeEditor} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700">Cancelar</button>
            <button disabled={saving} onClick={() => void save()} className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm text-white disabled:opacity-60">{saving ? 'Guardando...' : 'Guardar plan'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
