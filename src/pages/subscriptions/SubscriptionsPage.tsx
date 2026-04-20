import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, RefreshCw } from 'lucide-react';
import { plansService, type AdminPlanItem } from '../../services/plans.service';
import { subscriptionsService } from '../../services/subscriptions.service';
import { useAdminFilters } from '../../hooks/useAdminFilters';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import {
  Badge,
  EmptyState,
  ErrorBox,
  Field,
  formatMoney,
  inputClassName,
  Loading,
  MetricCard,
  Modal,
  PageHeader,
  PaginationControls,
  toDateInputValue,
} from '../../components/shared/ui';
import type { AdminSubscription } from '../../types/admin';

type SubscriptionDraft = {
  planId: string;
  planName: string;
  planCode: string;
  planCategory: string;
  status: string;
  amount: number;
  autoRenew: boolean;
  startDate: string;
  endDate: string;
  currency: string;
  limits: Record<string, number>;
};

type SubscriptionFilters = {
  search: string;
  status: string;
};

const emptyDraft: SubscriptionDraft = {
  planId: '',
  planName: 'Free',
  planCode: 'free',
  planCategory: 'free',
  status: 'active',
  amount: 0,
  autoRenew: false,
  startDate: '',
  endDate: '',
  currency: 'COP',
  limits: {},
};

const sanitizeLimits = (limits: Record<string, number> = {}) => ({
  maxChatsPerMonth: Number(limits.maxChatsPerMonth || 0),
  maxMessagesPerMonth: Number(limits.maxMessagesPerMonth || 0),
  maxDocumentsMB: Number(limits.maxDocumentsMB || 0),
  monthlyTokens: Number(limits.monthlyTokens || 0),
  extraTokens: Number(limits.extraTokens || 0),
});

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

export const SubscriptionsPage = () => {
  const [plans, setPlans] = useState<AdminPlanItem[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState('');
  const [selected, setSelected] = useState<AdminSubscription | null>(null);
  const { filters, updateFilter } = useAdminFilters<SubscriptionFilters>({
    search: '',
    status: 'all',
  });
  const [draft, setDraft] = useState<SubscriptionDraft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchSubscriptions = useCallback(
    (params: SubscriptionFilters & { page: number; limit: number }) =>
      subscriptionsService.getAll({
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: params.status === 'all' ? undefined : params.status,
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
    applyFilters,
  } = usePaginatedList<AdminSubscription, SubscriptionFilters>({
    fetchPage: fetchSubscriptions,
    filters,
    initialLimit: 20,
  });

  const loadPlans = useCallback(async () => {
    try {
      setPlansLoading(true);
      setPlansError('');
      const planItems = await plansService.getAll();
      setPlans(planItems);
    } catch (err: unknown) {
      setPlansError(getErrorMessage(err, 'No se pudieron cargar planes'));
    } finally {
      setPlansLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  const refreshAll = async () => {
    await Promise.all([load(), loadPlans()]);
  };

  const filtered = useMemo(() => items, [items]);

  const openEditor = (item: AdminSubscription) => {
    setSelected(item);
    setDraft({
      planId: item.planId || '',
      planName: item.planName || 'Free',
      planCode: item.planCode || 'free',
      planCategory: item.planCategory || 'free',
      status: item.status || 'active',
      amount: Number(item.amount || 0),
      autoRenew: !!item.autoRenew,
      startDate: toDateInputValue(item.startDate),
      endDate: toDateInputValue(item.endDate),
      currency: item.currency || 'COP',
      limits: sanitizeLimits(item.limits || {}),
    });
    setFormError('');
  };

  const applyPlanDraft = (planId: string) => {
    const matchedPlan = plans.find((plan) => (plan.id || plan._id) === planId);
    if (!matchedPlan) return;
    setDraft((prev) => ({
      ...prev,
      planId: matchedPlan.id || matchedPlan._id,
      planName: matchedPlan.name,
      planCode: matchedPlan.code,
      planCategory: matchedPlan.category,
      amount: Number(matchedPlan.price || 0),
      currency: matchedPlan.currency || 'COP',
      limits: sanitizeLimits(matchedPlan.limits || {}),
    }));
  };

  const save = async () => {
    if (!selected) return;
    try {
      setSaving(true);
      setFormError('');
      await subscriptionsService.update(selected.id, {
        planId: draft.planId || undefined,
        planName: draft.planName,
        planCode: draft.planCode,
        planCategory: draft.planCategory,
        status: draft.status,
        amount: Number(draft.amount),
        currency: draft.currency || 'COP',
        autoRenew: draft.autoRenew,
        limits: sanitizeLimits(draft.limits || {}),
        startDate: draft.startDate || undefined,
        endDate: draft.endDate || undefined,
      });
      await load();
      setSelected(null);
    } catch (err: unknown) {
      setFormError(getErrorMessage(err, 'No se pudo guardar la suscripcion'));
    } finally {
      setSaving(false);
    }
  };

  if (loading || plansLoading) return <Loading label="Cargando suscripciones..." />;
  if (error || plansError) return <ErrorBox message={error || plansError} onRetry={refreshAll} />;

  const activeItems = items.filter((item) => item.status === 'active');
  const monthlyRevenue = activeItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Suscripciones" description="Plan vigente, estado y limites por usuario" action={<button onClick={() => void refreshAll()} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white"><RefreshCw className="mr-1 inline h-4 w-4" />Actualizar</button>} />
      <div className="grid gap-5 md:grid-cols-4">
        <MetricCard title="Ingresos activos" value={formatMoney(monthlyRevenue)} />
        <MetricCard title="Activas" value={activeItems.length} />
        <MetricCard title="Expiradas" value={items.filter((item) => item.status === 'expired').length} />
        <MetricCard title="Total" value={items.length} />
      </div>
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-3">
        <input value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} placeholder="Buscar por usuario, plan o ID" className={inputClassName} />
        <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)} className={inputClassName}>
          <option value="all">Todos los estados</option>
          <option value="active">Activas</option>
          <option value="expired">Expiradas</option>
          <option value="canceled">Canceladas</option>
          <option value="pending_activation">Pendientes</option>
        </select>
        <button onClick={applyFilters} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700">Aplicar filtros</button>
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="No hay suscripciones para el filtro actual" description="Ajusta la busqueda o revisa solicitudes pendientes." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-600">
              <tr><th className="px-6 py-4">Usuario</th><th className="px-6 py-4">Plan</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4">Vigencia</th><th className="px-6 py-4">Monto</th><th className="px-6 py-4 text-right">Acciones</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4"><div className="font-medium text-slate-900">{item.userName}</div><div className="font-mono text-xs text-slate-400">{item.userId}</div></td>
                  <td className="px-6 py-4"><div className="font-medium text-slate-700">{item.planName}</div><div className="text-xs text-slate-500">{item.planCode}</div></td>
                  <td className="px-6 py-4"><Badge tone={item.status === 'active' ? 'success' : item.status === 'expired' ? 'danger' : 'warning'}>{item.status}</Badge></td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.startDate ? new Date(item.startDate).toLocaleDateString() : '-'} - {item.endDate ? new Date(item.endDate).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{formatMoney(item.amount || 0, item.currency || 'COP')}</td>
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
          itemLabel="suscripciones"
        />
      ) : null}      <Modal open={!!selected} title="Editar suscripcion" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="space-y-4">
            {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</div> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Usuario"><input value={selected.userName} disabled className={inputClassName} /></Field>
              <Field label="Plan real"><select value={draft.planId} onChange={(event) => applyPlanDraft(event.target.value)} className={inputClassName}><option value="">Selecciona un plan</option>{plans.map((plan) => <option key={plan.id || plan._id} value={plan.id || plan._id}>{plan.name} · {plan.category} · {formatMoney(plan.price, plan.currency)}</option>)}</select></Field>
              <Field label="Nombre del plan"><input value={draft.planName} disabled className={inputClassName} /></Field>
              <Field label="Codigo"><input value={draft.planCode} disabled className={inputClassName} /></Field>
              <Field label="Estado"><select value={draft.status} onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))} className={inputClassName}><option value="active">active</option><option value="expired">expired</option><option value="canceled">canceled</option><option value="pending_activation">pending_activation</option></select></Field>
              <Field label="Monto"><input type="number" min="0" value={draft.amount} onChange={(event) => setDraft((prev) => ({ ...prev, amount: Number(event.target.value) }))} className={inputClassName} /></Field>
              <Field label="Inicio"><input type="date" value={draft.startDate} onChange={(event) => setDraft((prev) => ({ ...prev, startDate: event.target.value }))} className={inputClassName} /></Field>
              <Field label="Fin"><input type="date" value={draft.endDate} onChange={(event) => setDraft((prev) => ({ ...prev, endDate: event.target.value }))} className={inputClassName} /></Field>
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
