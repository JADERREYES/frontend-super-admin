import { useEffect, useState } from 'react';
import {
  ExternalLink,
  Eye,
  FileText,
  Pencil,
  X,
} from 'lucide-react';
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

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${map[tone]}`}
    >
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
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[85vh] overflow-y-auto p-5">{children}</div>
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

const formatReportedAmount = (value?: number) =>
  value && value > 0 ? formatMoney(value, 'COP') : 'No reportado';

const requestStatusLabel: Record<PremiumRequestAdminItem['status'], string> = {
  new: 'Recibida',
  receipt_uploaded: 'Comprobante recibido',
  submitted: 'Enviada',
  under_review: 'En revision',
  contacted: 'Pendiente de contacto',
  pending_payment: 'Pendiente de pago',
  paid: 'Pago reportado',
  awaiting_validation: 'Validando pago',
  approved: 'Aprobada',
  activated: 'Plan activado',
  rejected: 'Rechazada',
};

const requestStatusTone: Record<
  PremiumRequestAdminItem['status'],
  'info' | 'warning' | 'success' | 'danger'
> = {
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
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatFileSize = (size?: number) => {
  if (!size) return 'Tamano no disponible';
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const isPreviewableImage = (mimeType?: string, url?: string) =>
  Boolean(mimeType?.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(url || ''));

const isPdf = (mimeType?: string, url?: string) =>
  Boolean(mimeType === 'application/pdf' || /\.pdf$/i.test(url || ''));

const isOperationallyPending = (status: PremiumRequestAdminItem['status']) =>
  [
    'new',
    'receipt_uploaded',
    'submitted',
    'under_review',
    'contacted',
    'pending_payment',
    'paid',
    'awaiting_validation',
  ].includes(status);

export function SubscriptionRequestsPage() {
  const [items, setItems] = useState<PremiumRequestAdminItem[]>([]);
  const [selected, setSelected] = useState<PremiumRequestAdminItem | null>(null);
  const [draftStatus, setDraftStatus] =
    useState<PremiumRequestAdminItem['status']>('submitted');
  const [draftNotes, setDraftNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | PremiumRequestAdminItem['status']
  >('all');
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const resolveAssetUrl = (path?: string) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) {
      return path;
    }
    return `${apiBaseUrl}${path}`;
  };

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setItems(await premiumRequestsService.getAll());
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'No se pudieron cargar las solicitudes',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filteredItems =
    statusFilter === 'all'
      ? items
      : items.filter((item) => item.status === statusFilter);
  const hasAnyRequests = items.length > 0;
  const isFilterHidingResults = hasAnyRequests && filteredItems.length === 0;
  const pendingCount = items.filter((item) => isOperationallyPending(item.status)).length;
  const newCount = items.filter(
    (item) => item.status === 'new' || item.status === 'submitted',
  ).length;
  const manualOnlyCount = items.filter(
    (item) => !item.proofUrl && !item.receiptUrl,
  ).length;
  const activatedCount = items.filter((item) => item.status === 'activated').length;

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
      setFormError(
        err?.response?.data?.message || 'No se pudo guardar la solicitud',
      );
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
      setFormError(
        err?.response?.data?.message || 'No se pudo activar el plan',
      );
    } finally {
      setActivating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-56 items-center justify-center text-slate-500">
        Cargando solicitudes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700">{error}</p>
        <button
          onClick={load}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Solicitudes premium y pagos
          </h1>
          <p className="text-slate-500">
            Revisa comprobantes, cambia estados y activa el plan
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as 'all' | PremiumRequestAdminItem['status'],
              )
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="new">Recibidas</option>
            <option value="receipt_uploaded">Comprobante recibido</option>
            <option value="submitted">Enviadas</option>
            <option value="under_review">En revision</option>
            <option value="contacted">Pendiente de contacto</option>
            <option value="pending_payment">Pendiente de pago</option>
            <option value="paid">Pago reportado</option>
            <option value="awaiting_validation">Validando pago</option>
            <option value="approved">Aprobadas</option>
            <option value="activated">Activadas</option>
            <option value="rejected">Rechazadas</option>
          </select>
          <button
            onClick={load}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white"
          >
            Actualizar
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        Esta pantalla concentra las solicitudes premium con o sin comprobante.
        Aqui se visualizan los datos reportados por el usuario, el archivo si
        existe y la activacion final del plan.
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">Pendientes</p>
          <p className="mt-2 text-2xl font-bold text-amber-950">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
          <p className="text-sm font-medium text-sky-800">Nuevas</p>
          <p className="mt-2 text-2xl font-bold text-sky-950">{newCount}</p>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
          <p className="text-sm font-medium text-violet-800">Solo datos manuales</p>
          <p className="mt-2 text-2xl font-bold text-violet-950">{manualOnlyCount}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-800">Activadas</p>
          <p className="mt-2 text-2xl font-bold text-emerald-950">{activatedCount}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        {hasAnyRequests ? (
          <span>
            Mostrando <strong>{filteredItems.length}</strong> de{' '}
            <strong>{items.length}</strong> solicitudes. Filtro actual:{' '}
            <strong>
              {statusFilter === 'all' ? 'Todos los estados' : requestStatusLabel[statusFilter]}
            </strong>
            .
          </span>
        ) : (
          <span>No hay solicitudes premium registradas todavia.</span>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-600">
            <tr>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Pago reportado</th>
              <th className="px-6 py-4">Comprobante</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((item) => (
              <tr
                key={item._id}
                className={`hover:bg-slate-50 ${
                  isOperationallyPending(item.status)
                    ? 'bg-amber-50/40'
                    : item.status === 'activated'
                      ? 'bg-emerald-50/35'
                      : ''
                }`}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{item.userName}</div>
                  <div className="text-sm text-slate-500">{item.userEmail}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-700">{item.planName}</div>
                  <div className="text-xs text-slate-500">
                    {requestTypeLabel[item.requestType]} ·{' '}
                    {formatMoney(item.planSnapshot.price, item.planSnapshot.currency)}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="font-medium text-slate-700">
                    {formatReportedAmount(item.reportedAmount)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.payerName || 'Sin nombre'} · {item.payerPhone || 'Sin telefono'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.paymentMethodSnapshot.name}
                    {item.paidAtReference ? ` · ${item.paidAtReference}` : ''}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {item.proofUrl || item.receiptUrl ? (
                    <a
                      href={resolveAssetUrl(item.proofUrl || item.receiptUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white"
                    >
                      <Eye className="h-4 w-4" />
                      Ver archivo
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500">Solo datos manuales</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Badge tone={requestStatusTone[item.status]}>
                    {requestStatusLabel[item.status]}
                  </Badge>
                  {isOperationallyPending(item.status) ? (
                    <div className="mt-2">
                      <Badge tone="warning">Requiere revision</Badge>
                    </div>
                  ) : null}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openEditor(item)}
                    className="rounded-lg p-2 hover:bg-slate-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length === 0 ? (
          <div className="border-t border-slate-100 px-6 py-8 text-center text-sm text-slate-500">
            {isFilterHidingResults
              ? 'No hay solicitudes para el filtro actual. Cambia a "Todos los estados" para ver el resto.'
              : 'No hay solicitudes premium registradas todavia.'}
          </div>
        ) : null}
      </div>

      <Modal open={!!selected} title="Gestionar solicitud" onClose={closeEditor}>
        {selected ? (
          <div className="space-y-4">
            {formError ? (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {formError}
              </div>
            ) : null}

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-medium text-slate-900">Estado actual</p>
              <p className="mt-1">
                {requestStatusLabel[selected.status]}. Puedes actualizar el
                seguimiento o activar el plan cuando el pago ya este validado.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Si guardas el estado como "Plan activado", ahora tambien se
                actualiza la suscripcion real del usuario.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Usuario</span>
                <input
                  value={`${selected.userName} (${selected.userEmail})`}
                  disabled
                  className={inputClassName}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Plan</span>
                <input
                  value={`${selected.planName} (${requestTypeLabel[selected.requestType]})`}
                  disabled
                  className={inputClassName}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Plan anterior</span>
                <input
                  value={selected.currentPlanName || selected.currentPlanCode || 'Sin dato'}
                  disabled
                  className={inputClassName}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Metodo</span>
                <input
                  value={`${selected.paymentMethodSnapshot.name} - ${selected.paymentMethodSnapshot.accountValue || selected.paymentMethodSnapshot.accountNumber || 'sin cuenta'}`}
                  disabled
                  className={inputClassName}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Monto reportado</span>
                <input
                  value={formatReportedAmount(selected.reportedAmount)}
                  disabled
                  className={inputClassName}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Pagador</span>
                <input
                  value={`${selected.payerName || 'Sin nombre'} - ${selected.payerPhone || 'Sin telefono'}`}
                  disabled
                  className={inputClassName}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Referencia temporal</span>
                <input
                  value={selected.paidAtReference || 'Sin referencia'}
                  disabled
                  className={inputClassName}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Estado</span>
                <select
                  value={draftStatus}
                  onChange={(e) =>
                    setDraftStatus(e.target.value as PremiumRequestAdminItem['status'])
                  }
                  className={inputClassName}
                >
                  <option value="new">Recibida</option>
                  <option value="receipt_uploaded">Comprobante recibido</option>
                  <option value="submitted">Enviada</option>
                  <option value="under_review">En revision</option>
                  <option value="contacted">Pendiente de contacto</option>
                  <option value="pending_payment">Pendiente de pago</option>
                  <option value="paid">Pago reportado</option>
                  <option value="awaiting_validation">Validando pago</option>
                  <option value="approved">Aprobada</option>
                  <option value="activated">Plan activado</option>
                  <option value="rejected">Rechazada</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Precio</span>
                <input
                  value={formatMoney(
                    selected.planSnapshot.price,
                    selected.planSnapshot.currency,
                  )}
                  disabled
                  className={inputClassName}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Duracion</span>
                <input
                  value={`${selected.planSnapshot.durationDays} dias`}
                  disabled
                  className={inputClassName}
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Mensaje</span>
              <textarea
                rows={5}
                value={selected.message || ''}
                readOnly
                className={inputClassName}
              />
            </label>

            {selected.proofUrl || selected.receiptUrl ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-medium text-slate-900">Comprobante</p>
                <p className="mt-1">
                  {selected.proofOriginalName ||
                    selected.receiptFileName ||
                    'Archivo adjunto'}
                </p>
                <div className="mt-3 grid gap-2 text-xs text-slate-500 md:grid-cols-3">
                  <div className="rounded-lg bg-white px-3 py-2">
                    <p className="font-medium text-slate-700">Provider</p>
                    <p className="mt-1">{selected.proofStorageProvider || 'Sin dato'}</p>
                  </div>
                  <div className="rounded-lg bg-white px-3 py-2">
                    <p className="font-medium text-slate-700">Tipo</p>
                    <p className="mt-1">{selected.proofMimeType || 'Sin dato'}</p>
                  </div>
                  <div className="rounded-lg bg-white px-3 py-2">
                    <p className="font-medium text-slate-700">Tamano</p>
                    <p className="mt-1">{formatFileSize(selected.proofSize)}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    href={resolveAssetUrl(selected.proofUrl || selected.receiptUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Abrir comprobante
                  </a>
                  {selected.proofStorageKey ? (
                    <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
                      <FileText className="h-4 w-4" />
                      {selected.proofStorageKey}
                    </span>
                  ) : null}
                </div>
                {isPreviewableImage(
                  selected.proofMimeType,
                  selected.proofUrl || selected.receiptUrl,
                ) ? (
                  <img
                    src={resolveAssetUrl(selected.proofUrl || selected.receiptUrl)}
                    alt="Comprobante"
                    className="mt-4 max-h-[420px] w-full rounded-xl border border-slate-200 object-contain bg-white"
                  />
                ) : null}
                {isPdf(
                  selected.proofMimeType,
                  selected.proofUrl || selected.receiptUrl,
                ) ? (
                  <iframe
                    title="Vista previa del comprobante"
                    src={resolveAssetUrl(selected.proofUrl || selected.receiptUrl)}
                    className="mt-4 h-[420px] w-full rounded-xl border border-slate-200 bg-white"
                  />
                ) : null}
              </div>
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Esta solicitud llego solo con datos manuales. Puedes revisarla,
                contactar al usuario y activar el plan si el pago ya fue validado.
              </div>
            )}

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Notas administrativas
              </span>
              <textarea
                rows={5}
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                className={inputClassName}
              />
            </label>

            <div className="flex gap-3">
              <button
                onClick={closeEditor}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700"
              >
                Cancelar
              </button>
              <button
                disabled={saving}
                onClick={() => void save()}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 disabled:opacity-60"
              >
                {saving
                  ? draftStatus === 'activated'
                    ? 'Activando...'
                    : 'Guardando...'
                  : draftStatus === 'activated'
                    ? 'Guardar y activar'
                    : 'Guardar estado'}
              </button>
              <button
                disabled={
                  activating || selected.status === 'rejected' || selected.status === 'activated'
                }
                onClick={() => void activate()}
                className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm text-white disabled:opacity-60"
              >
                {activating
                  ? 'Activando...'
                  : selected.status === 'activated'
                    ? 'Plan ya activado'
                    : 'Aprobar y activar plan'}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
