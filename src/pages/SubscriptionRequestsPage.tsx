import { useEffect, useState } from 'react';
import { Pencil, X } from 'lucide-react';
import {
  premiumRequestsService,
  type PremiumRequestAdminItem,
} from '../services/premium-requests.service';

const Badge = ({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
}) => {
  const map = {
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-sky-50 text-sky-700',
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

const requestTypeLabel: Record<PremiumRequestAdminItem['requestType'], string> = {
  premium: 'Premium',
  extra_tokens: 'Mas tokens',
  custom: 'Personalizado',
};

const requestStatusTone: Record<PremiumRequestAdminItem['status'], 'info' | 'warning' | 'success' | 'danger'> = {
  new: 'info',
  receipt_uploaded: 'info',
  submitted: 'info',
  under_review: 'warning',
  contacted: 'warning',
  pending_payment: 'warning',
  paid: 'warning',
  awaiting_validation: 'warning',
  approved: 'success',
  activated: 'success',
  rejected: 'danger',
};

const formatMoney = (value: number, currency = 'COP') =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value || 0);

export function SubscriptionRequestsPage() {
  const [items, setItems] = useState<PremiumRequestAdminItem[]>([]);
  const [selected, setSelected] = useState<PremiumRequestAdminItem | null>(null);
  const [draftStatus, setDraftStatus] = useState<PremiumRequestAdminItem['status']>('submitted');
  const [draftNotes, setDraftNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setItems(await premiumRequestsService.getAll());
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudieron cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openEditor = (item: PremiumRequestAdminItem) => {
    setSelected(item);
    setDraftStatus(item.status);
    setDraftNotes(item.adminNotes || '');
    setFormError('');
  };

  const closeEditor = () => {
    setSelected(null);
    setDraftStatus('submitted');
    setDraftNotes('');
    setFormError('');
  };

  const save = async () => {
    if (!selected) return;
    try {
      setSaving(true);
      setFormError('');
      if (draftStatus !== selected.status) {
        await premiumRequestsService.updateStatus(selected._id, draftStatus);
      }
      if (draftNotes !== (selected.adminNotes || '')) {
        await premiumRequestsService.updateNotes(selected._id, draftNotes);
      }
      await load();
      closeEditor();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'No se pudo guardar la solicitud');
    } finally {
      setSaving(false);
    }
  };

  const activate = async () => {
    if (!selected) return;
    try {
      setActivating(true);
      setFormError('');
      await premiumRequestsService.activate(selected._id, draftNotes);
      await load();
      closeEditor();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'No se pudo activar el plan');
    } finally {
      setActivating(false);
    }
  };

  if (loading) return <div className="flex h-56 items-center justify-center text-slate-500">Cargando solicitudes...</div>;
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center"><p className="text-red-700">{error}</p><button onClick={load} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white">Reintentar</button></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Solicitudes premium y pagos</h1><p className="text-slate-500">Revisa comprobantes, cambia estados y activa el plan</p></div>
        <button onClick={load} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white">Actualizar</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-600"><tr><th className="px-6 py-4">Usuario</th><th className="px-6 py-4">Plan</th><th className="px-6 py-4">Metodo</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4">Fecha</th><th className="px-6 py-4 text-right">Acciones</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50">
                <td className="px-6 py-4"><div className="font-medium text-slate-900">{item.userName}</div><div className="text-sm text-slate-500">{item.userEmail}</div></td>
                <td className="px-6 py-4"><div className="font-medium text-slate-700">{item.planName}</div><div className="text-xs text-slate-500">{requestTypeLabel[item.requestType]} · {formatMoney(item.planSnapshot.price, item.planSnapshot.currency)}</div></td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.paymentMethodSnapshot.name}</td>
                <td className="px-6 py-4"><Badge tone={requestStatusTone[item.status]}>{item.status}</Badge></td>
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(item.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 text-right"><button onClick={() => openEditor(item)} className="rounded-lg p-2 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={!!selected} title="Gestionar solicitud" onClose={closeEditor}>
        {selected ? (
          <div className="space-y-4">
            {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</div> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Usuario</span><input value={`${selected.userName} (${selected.userEmail})`} disabled className={inputClassName} /></label>
              <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Plan</span><input value={`${selected.planName} (${requestTypeLabel[selected.requestType]})`} disabled className={inputClassName} /></label>
              <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Metodo</span><input value={`${selected.paymentMethodSnapshot.name} - ${selected.paymentMethodSnapshot.accountValue || selected.paymentMethodSnapshot.accountNumber || 'sin cuenta'}`} disabled className={inputClassName} /></label>
              <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Estado</span><select value={draftStatus} onChange={(e) => setDraftStatus(e.target.value as PremiumRequestAdminItem['status'])} className={inputClassName}><option value="new">new</option><option value="receipt_uploaded">receipt_uploaded</option><option value="submitted">submitted</option><option value="under_review">under_review</option><option value="contacted">contacted</option><option value="pending_payment">pending_payment</option><option value="paid">paid</option><option value="awaiting_validation">awaiting_validation</option><option value="approved">approved</option><option value="activated">activated</option><option value="rejected">rejected</option></select></label>
              <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Precio</span><input value={formatMoney(selected.planSnapshot.price, selected.planSnapshot.currency)} disabled className={inputClassName} /></label>
              <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Duracion</span><input value={`${selected.planSnapshot.durationDays} dias`} disabled className={inputClassName} /></label>
            </div>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Mensaje</span><textarea rows={5} value={selected.message || ''} readOnly className={inputClassName} /></label>
            {(selected.proofUrl || selected.receiptUrl) ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-medium text-slate-900">Comprobante</p>
                <p className="mt-1">{selected.proofOriginalName || selected.receiptFileName || 'Archivo adjunto'}</p>
                <a href={`${apiBaseUrl}${selected.proofUrl || selected.receiptUrl}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">Ver comprobante</a>
              </div>
            ) : null}
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Notas administrativas</span><textarea rows={5} value={draftNotes} onChange={(e) => setDraftNotes(e.target.value)} className={inputClassName} /></label>
            <div className="flex gap-3">
              <button onClick={closeEditor} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700">Cancelar</button>
              <button disabled={saving} onClick={() => void save()} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 disabled:opacity-60">{saving ? 'Guardando...' : 'Guardar estado'}</button>
              <button disabled={activating || selected.status === 'rejected'} onClick={() => void activate()} className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm text-white disabled:opacity-60">{activating ? 'Activando...' : 'Aprobar y activar plan'}</button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
