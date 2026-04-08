import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Heart,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  MessageSquareShare,
  Pencil,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { authService } from './services/auth.service';
import { usersService } from './services/users.service';
import { subscriptionsService } from './services/subscriptions.service';
import { alertsService } from './services/alerts.service';
import { documentsService } from './services/documents.service';
import { settingsService } from './services/settings.service';
import { statsService } from './services/stats.service';
import {
  premiumRequestsService,
  type PremiumRequestAdminItem,
} from './services/premium-requests.service';
import { PaymentMethodsPage } from './pages/PaymentMethodsPage';
import { PlansPage } from './pages/PlansPage';
import { SubscriptionRequestsPage } from './pages/SubscriptionRequestsPage';

type Page =
  | 'login'
  | 'dashboard'
  | 'users'
  | 'subscriptions'
  | 'paymentMethods'
  | 'plans'
  | 'subscriptionRequests'
  | 'documents'
  | 'alerts'
  | 'activity'
  | 'settings';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

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
      className={cx(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
        map[tone],
      )}
    >
      {children}
    </span>
  );
};

const Card = ({ title, value }: { title: string; value: string | number }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
  </div>
);

const Loading = ({ label }: { label: string }) => (
  <div className="flex h-56 items-center justify-center">
    <div className="text-center">
      <LoaderCircle className="mx-auto mb-3 h-8 w-8 animate-spin text-teal-600" />
      <p className="text-slate-500">{label}</p>
    </div>
  </div>
);

const ErrorBox = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
    <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
    <p className="text-red-700">{message}</p>
    <button
      onClick={onRetry}
      className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
    >
      Reintentar
    </button>
  </div>
);

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

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="block space-y-2">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    {children}
  </label>
);

const inputClassName =
  'w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500';

const toDateInputValue = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const formatMoney = (value: number, currency = 'COP') =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);

const LoginPage = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authService.login(email, password);
      onLogin(data.user);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600">
            <Heart className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">MenteAmiga-AI</h1>
          <p className="mt-1 text-sm text-slate-500">
            Panel de Super Administracion
          </p>
        </div>
        {error ? (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <form onSubmit={submit} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={inputClassName}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contrasena"
            className={inputClassName}
          />
          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-3 font-medium text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {loading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
            Iniciar sesion
          </button>
        </form>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setData(await statsService.getDashboard());
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo cargar el dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (loading) return <Loading label="Cargando dashboard..." />;
  if (error) return <ErrorBox message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Datos reales del backend</p>
        </div>
        <button
          onClick={load}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white"
        >
          <RefreshCw className="inline h-4 w-4" /> Actualizar
        </button>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Usuarios Totales" value={data?.stats?.totalUsers || 0} />
        <Card title="Usuarios Activos" value={data?.stats?.activeUsers || 0} />
        <Card title="Chats Totales" value={data?.stats?.totalChats || 0} />
        <Card title="Premium" value={data?.stats?.premiumUsers || 0} />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">Chats recientes</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {(data?.recentChats || []).map((chat: any) => (
            <div key={chat.id} className="flex items-center justify-between p-5">
              <div>
                <p className="font-medium text-slate-900">{chat.title}</p>
                <p className="text-sm text-slate-500">
                  {chat.userEmail} · {chat.messageCount || 0} mensajes
                </p>
              </div>
              <p className="text-xs text-slate-400">
                {chat.createdAt
                  ? new Date(chat.createdAt).toLocaleString()
                  : '-'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const UsersPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [draft, setDraft] = useState({ role: 'user', isActive: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setItems(await usersService.getAll());
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudieron cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openEditor = (user: any) => {
    setSelected(user);
    setDraft({ role: user.role || 'user', isActive: !!user.isActive });
    setFormError('');
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
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'No se pudo guardar el usuario');
    } finally {
      setSaving(false);
    }
  };

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.email.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
  });

  if (loading) return <Loading label="Cargando usuarios..." />;
  if (error) return <ErrorBox message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Usuarios</h1><p className="text-slate-500">Gestion real de roles y estado</p></div>
        <button onClick={load} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white">Actualizar</button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre, email o ID" className={inputClassName} />
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-600"><tr><th className="px-6 py-4">Usuario</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Rol</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4 text-right">Acciones</th></tr></thead>
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
      <Modal open={!!selected} title="Editar usuario" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="space-y-4">
            {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</div> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nombre"><input value={selected.name} disabled className={inputClassName} /></Field>
              <Field label="Email"><input value={selected.email} disabled className={inputClassName} /></Field>
              <Field label="Rol"><select value={draft.role} onChange={(e) => setDraft((prev) => ({ ...prev, role: e.target.value }))} className={inputClassName}><option value="user">user</option><option value="superadmin">superadmin</option></select></Field>
              <Field label="Estado"><select value={draft.isActive ? 'active' : 'inactive'} onChange={(e) => setDraft((prev) => ({ ...prev, isActive: e.target.value === 'active' }))} className={inputClassName}><option value="active">Activo</option><option value="inactive">Inactivo</option></select></Field>
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

const SubscriptionsPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [draft, setDraft] = useState<any>({ planName: 'Free', planCode: 'free', planCategory: 'free', status: 'active', amount: 0, autoRenew: false, startDate: '', endDate: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setItems(await subscriptionsService.getAll());
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudieron cargar suscripciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openEditor = (item: any) => {
    setSelected(item);
    setDraft({
      planName: item.planName || 'Free',
      planCode: item.planCode || 'free',
      planCategory: item.planCategory || 'free',
      status: item.status || 'active',
      amount: Number(item.amount || 0),
      autoRenew: !!item.autoRenew,
      startDate: toDateInputValue(item.startDate),
      endDate: toDateInputValue(item.endDate),
    });
    setFormError('');
  };

  const save = async () => {
    if (!selected) return;
    try {
      setSaving(true);
      setFormError('');
      await subscriptionsService.update(selected.id, { planName: draft.planName, planCode: draft.planCode, planCategory: draft.planCategory, status: draft.status, amount: Number(draft.amount), autoRenew: draft.autoRenew, startDate: draft.startDate || undefined, endDate: draft.endDate || undefined });
      await load();
      setSelected(null);
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'No se pudo guardar la suscripcion');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading label="Cargando suscripciones..." />;
  if (error) return <ErrorBox message={error} onRetry={load} />;

  const mrr = items
    .filter((item) => item.status === 'active')
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Suscripciones activas</h1><p className="text-slate-500">Plan vigente y limites por cuenta de usuario</p></div>
        <button onClick={load} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white">Actualizar</button>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card title="MRR" value={`$${Math.round(mrr)}`} />
        <Card title="Activas" value={items.filter((item) => item.status === 'active').length} />
        <Card title="Past Due" value={items.filter((item) => item.status === 'past_due').length} />
        <Card title="Total" value={items.length} />
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-600"><tr><th className="px-6 py-4">Usuario</th><th className="px-6 py-4">Plan</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4">Vigencia</th><th className="px-6 py-4">Monto</th><th className="px-6 py-4 text-right">Acciones</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4"><div className="font-medium text-slate-900">{item.userName}</div><div className="font-mono text-xs text-slate-400">{item.userId}</div></td>
                <td className="px-6 py-4"><div className="font-medium text-slate-700">{item.planName}</div><div className="text-xs text-slate-500">{item.planCategory}</div></td>
                <td className="px-6 py-4"><Badge tone={item.status === 'active' ? 'success' : item.status === 'expired' ? 'warning' : 'neutral'}>{item.status}</Badge></td>
                <td className="px-6 py-4 text-slate-600">{item.endDate ? new Date(item.endDate).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-700">{formatMoney(item.amount || 0, item.currency || 'COP')}</td>
                <td className="px-6 py-4 text-right"><button onClick={() => openEditor(item)} className="rounded-lg p-2 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={!!selected} title="Editar suscripcion" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="space-y-4">
            {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</div> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Usuario"><input value={selected.userName} disabled className={inputClassName} /></Field>
              <Field label="Nombre del plan"><input value={draft.planName} onChange={(e) => setDraft((prev: any) => ({ ...prev, planName: e.target.value }))} className={inputClassName} /></Field>
              <Field label="Codigo"><input value={draft.planCode} onChange={(e) => setDraft((prev: any) => ({ ...prev, planCode: e.target.value }))} className={inputClassName} /></Field>
              <Field label="Categoria"><select value={draft.planCategory} onChange={(e) => setDraft((prev: any) => ({ ...prev, planCategory: e.target.value }))} className={inputClassName}><option value="free">free</option><option value="premium">premium</option><option value="extra_tokens">extra_tokens</option><option value="custom">custom</option></select></Field>
              <Field label="Estado"><select value={draft.status} onChange={(e) => setDraft((prev: any) => ({ ...prev, status: e.target.value }))} className={inputClassName}><option value="active">active</option><option value="expired">expired</option><option value="canceled">canceled</option><option value="pending_activation">pending_activation</option></select></Field>
              <Field label="Monto"><input type="number" min="0" value={draft.amount} onChange={(e) => setDraft((prev: any) => ({ ...prev, amount: Number(e.target.value) }))} className={inputClassName} /></Field>
              <Field label="Auto renew"><select value={draft.autoRenew ? 'true' : 'false'} onChange={(e) => setDraft((prev: any) => ({ ...prev, autoRenew: e.target.value === 'true' }))} className={inputClassName}><option value="true">Si</option><option value="false">No</option></select></Field>
              <Field label="Inicio"><input type="date" value={draft.startDate} onChange={(e) => setDraft((prev: any) => ({ ...prev, startDate: e.target.value }))} className={inputClassName} /></Field>
              <Field label="Fin"><input type="date" value={draft.endDate} onChange={(e) => setDraft((prev: any) => ({ ...prev, endDate: e.target.value }))} className={inputClassName} /></Field>
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

const requestTypeLabel: Record<PremiumRequestAdminItem['requestType'], string> = {
  premium: 'premium',
  extra_tokens: 'mas tokens',
  custom: 'personalizado',
};

const PremiumRequestsPage = () => {
  const [items, setItems] = useState<PremiumRequestAdminItem[]>([]);
  const [selected, setSelected] = useState<PremiumRequestAdminItem | null>(null);
  const [draftStatus, setDraftStatus] =
    useState<PremiumRequestAdminItem['status']>('new');
  const [draftNotes, setDraftNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setItems(await premiumRequestsService.getAll());
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'No se pudieron cargar las solicitudes premium',
      );
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
      setSelected(null);
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
          'No se pudo guardar la solicitud premium',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading label="Cargando solicitudes premium..." />;
  if (error) return <ErrorBox message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Solicitudes premium
          </h1>
          <p className="text-slate-500">
            Solicitudes reales de upgrade, mas tokens y planes personalizados
          </p>
        </div>
        <button
          onClick={load}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white"
        >
          Actualizar
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-600">
            <tr>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Plan / Uso</th>
              <th className="px-6 py-4">Solicitud</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{item.name}</div>
                  <div className="text-sm text-slate-500">{item.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-700">
                    {item.currentPlan}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.currentUsage.used}/{item.currentUsage.limit}
                    {item.currentUsage.upgradeRecommended
                      ? ' · upgrade recomendado'
                      : ''}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-700">
                    {requestTypeLabel[item.requestType]}
                  </div>
                  <div className="line-clamp-2 text-xs text-slate-500">
                    {item.message}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge tone={item.status === 'rejected' ? 'danger' : item.status === 'activated' || item.status === 'paid' ? 'success' : item.status === 'pending_payment' || item.status === 'contacted' ? 'warning' : 'info'}>
                    {item.status}
                  </Badge>
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
      </div>

      <Modal
        open={!!selected}
        title="Gestionar solicitud premium"
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-4">
            {formError ? (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {formError}
              </div>
            ) : null}
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Usuario">
                <input
                  value={`${selected.name} (${selected.email})`}
                  disabled
                  className={inputClassName}
                />
              </Field>
              <Field label="Metodo de pago">
                <input
                  value={selected.paymentMethod}
                  disabled
                  className={inputClassName}
                />
              </Field>
              <Field label="Plan actual">
                <input
                  value={selected.currentPlan}
                  disabled
                  className={inputClassName}
                />
              </Field>
              <Field label="Uso actual">
                <input
                  value={`${selected.currentUsage.used}/${selected.currentUsage.limit}`}
                  disabled
                  className={inputClassName}
                />
              </Field>
              <Field label="Tipo de solicitud">
                <input
                  value={requestTypeLabel[selected.requestType]}
                  disabled
                  className={inputClassName}
                />
              </Field>
              <Field label="Estado">
                <select
                  value={draftStatus}
                  onChange={(e) =>
                    setDraftStatus(
                      e.target.value as PremiumRequestAdminItem['status'],
                    )
                  }
                  className={inputClassName}
                >
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="pending_payment">pending_payment</option>
                  <option value="paid">paid</option>
                  <option value="activated">activated</option>
                  <option value="rejected">rejected</option>
                </select>
              </Field>
            </div>
            <Field label="Mensaje">
              <textarea
                rows={6}
                value={selected.message}
                readOnly
                className={inputClassName}
              />
            </Field>
            <Field label="Nota administrativa">
              <textarea
                rows={5}
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                className={inputClassName}
              />
            </Field>
            <div className="flex gap-3">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700"
              >
                Cancelar
              </button>
              <button
                disabled={saving}
                onClick={() => void save()}
                className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm text-white disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

// ALERTS_PAGE
// DOCUMENTS_PAGE
const AlertsPage = ({ onCountChange }: { onCountChange?: (count: number) => void }) => {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [draft, setDraft] = useState<any>({ title: '', description: '', type: 'system', severity: 'medium', status: 'open', assignedTo: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await alertsService.getAll();
      setItems(data);
      onCountChange?.(data.filter((item: any) => item.status !== 'resolved').length);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudieron cargar alertas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openEditor = (item: any) => {
    setSelected(item);
    setDraft({ title: item.title || '', description: item.description || '', type: item.type || 'system', severity: item.severity || 'medium', status: item.status || 'open', assignedTo: item.assignedTo || '' });
    setFormError('');
  };

  const save = async () => {
    if (!selected) return;
    try {
      setSaving(true);
      setFormError('');
      await alertsService.update(selected.id, draft);
      await load();
      setSelected(null);
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'No se pudo actualizar la alerta');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading label="Cargando alertas..." />;
  if (error) return <ErrorBox message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Alertas</h1><p className="text-slate-500">Gestion administrativa basica</p></div>
        <button onClick={load} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white">Actualizar</button>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Activas" value={items.filter((item) => item.status !== 'resolved').length} />
        <Card title="Criticas" value={items.filter((item) => item.severity === 'critical').length} />
        <Card title="Investigando" value={items.filter((item) => item.status === 'investigating').length} />
        <Card title="Resueltas" value={items.filter((item) => item.status === 'resolved').length} />
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <button key={item.id} onClick={() => openEditor(item)} className="w-full rounded-xl border border-slate-200 bg-white p-5 text-left hover:border-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">{item.title}</span>
              <Badge tone={item.severity === 'critical' ? 'danger' : item.severity === 'high' ? 'warning' : 'info'}>{item.severity}</Badge>
              <Badge tone={item.status === 'resolved' ? 'success' : item.status === 'investigating' ? 'info' : 'warning'}>{item.status}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </button>
        ))}
      </div>
      <Modal open={!!selected} title="Editar alerta" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="space-y-4">
            {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</div> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Titulo"><input value={draft.title} onChange={(e) => setDraft((prev: any) => ({ ...prev, title: e.target.value }))} className={inputClassName} /></Field>
              <Field label="Tipo"><select value={draft.type} onChange={(e) => setDraft((prev: any) => ({ ...prev, type: e.target.value }))} className={inputClassName}><option value="system">system</option><option value="security">security</option><option value="user">user</option><option value="subscription">subscription</option></select></Field>
              <Field label="Severidad"><select value={draft.severity} onChange={(e) => setDraft((prev: any) => ({ ...prev, severity: e.target.value }))} className={inputClassName}><option value="low">low</option><option value="medium">medium</option><option value="high">high</option><option value="critical">critical</option></select></Field>
              <Field label="Estado"><select value={draft.status} onChange={(e) => setDraft((prev: any) => ({ ...prev, status: e.target.value }))} className={inputClassName}><option value="open">open</option><option value="investigating">investigating</option><option value="resolved">resolved</option></select></Field>
              <Field label="Asignada a"><input value={draft.assignedTo} onChange={(e) => setDraft((prev: any) => ({ ...prev, assignedTo: e.target.value }))} className={inputClassName} /></Field>
              <Field label="Descripcion"><textarea rows={5} value={draft.description} onChange={(e) => setDraft((prev: any) => ({ ...prev, description: e.target.value }))} className={inputClassName} /></Field>
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

const DocumentsPage = () => {
  const emptyDraft = { title: '', category: 'terms', status: 'draft', version: '1.0.0', author: 'Admin', content: '' };
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [draft, setDraft] = useState<any>(emptyDraft);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setItems(await documentsService.getAll());
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudieron cargar documentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openCreate = () => {
    setSelected({});
    setDraft(emptyDraft);
    setSelectedFile(null);
    setFormError('');
  };

  const openEdit = (item: any) => {
    setSelected(item);
    setDraft({ title: item.title || '', category: item.category || 'terms', status: item.status || 'draft', version: item.version || '1.0.0', author: item.author || 'Admin', content: item.content || '' });
    setSelectedFile(null);
    setFormError('');
  };

  const closeEditor = () => {
    setSelected(null);
    setDraft(emptyDraft);
    setSelectedFile(null);
    setFormError('');
  };

  const save = async () => {
    try {
      setSaving(true);
      setFormError('');
      if (selectedFile) {
        if (selected?.id) await documentsService.replaceUpload(selected.id, draft, selectedFile);
        else await documentsService.upload(draft, selectedFile);
      } else if (selected?.id) {
        await documentsService.update(selected.id, draft);
      } else {
        await documentsService.create(draft);
      }
      await load();
      closeEditor();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'No se pudo guardar el documento');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await documentsService.delete(deleteTarget.id);
      await load();
      setDeleteTarget(null);
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'No se pudo eliminar el documento');
    } finally {
      setDeleting(false);
    }
  };

  const reindex = async (item: any) => {
    try {
      setProcessingId(item.id);
      setFormError('');
      await documentsService.reindex(item.id);
      await load();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'No se pudo procesar el documento para IA');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <Loading label="Cargando documentos..." />;
  if (error) return <ErrorBox message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Documentos</h1><p className="text-slate-500">CRUD real para documentos de texto</p></div>
        <div className="flex gap-3">
          <button onClick={load} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700">Actualizar</button>
          <button onClick={openCreate} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white"><Plus className="mr-1 inline h-4 w-4" /> Nuevo documento</button>
        </div>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{item.title}</span>
                  <Badge tone="info">{item.category}</Badge>
                  <Badge tone={item.status === 'published' ? 'success' : item.status === 'draft' ? 'warning' : 'neutral'}>{item.status}</Badge>
                  {item.hasFile ? <Badge tone="info">archivo</Badge> : <Badge tone="neutral">manual</Badge>}
                  <Badge tone={item.retrievalMode === 'semantic' ? 'success' : item.retrievalMode === 'keyword' ? 'warning' : 'neutral'}>{item.retrievalMode || 'none'}</Badge>
                  <Badge tone={item.indexingStatus === 'completed' ? 'success' : item.indexingStatus === 'failed' ? 'danger' : item.indexingStatus === 'processing' ? 'info' : 'neutral'}>{item.indexingStatus || 'not_indexed'}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-500">v{item.version || '1.0.0'} · {item.author || 'Admin'} · {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : '-'}</p>
                {item.hasFile ? (
                  <p className="mt-1 text-sm text-slate-500">
                    {item.originalFileName || item.storedFileName} · {Math.round((item.fileSize || 0) / 1024)} KB · extraccion: {item.extractionStatus || 'pending'}
                  </p>
                ) : null}
                <p className="mt-1 text-sm text-slate-500">
                  chunks: {item.chunkCount || 0} {item.embeddingModel ? `· embeddings: ${item.embeddingModel}` : ''}
                </p>
                <p className="mt-3 line-clamp-3 text-sm text-slate-600">{item.content || 'Sin contenido'}</p>
              </div>
              <div className="flex gap-2">
                {item.hasFile ? (
                  <button onClick={() => void documentsService.download(item.id, item.originalFileName || item.title)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">
                    Descargar
                  </button>
                ) : null}
                <button onClick={() => void reindex(item)} disabled={processingId === item.id} className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                  {processingId === item.id ? 'Procesando...' : 'Procesar IA'}
                </button>
                <button onClick={() => openEdit(item)} className="rounded-lg p-2 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeleteTarget(item)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal open={selected !== null} title={selected?.id ? 'Editar documento' : 'Nuevo documento'} onClose={closeEditor}>
        <div className="space-y-4">
          {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</div> : null}
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-800">Archivo adjunto opcional</p>
            <p className="mt-1 text-xs text-slate-500">Formatos permitidos: PDF y DOCX. Tamano maximo recomendado: 15 MB.</p>
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="mt-3 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-4 file:py-2 file:text-sm file:text-white"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setSelectedFile(file);
                if (file && !draft.title.trim()) {
                  setDraft((prev: any) => ({
                    ...prev,
                    title: file.name.replace(/\.[^/.]+$/, ''),
                  }));
                }
              }}
            />
            {selected?.hasFile && !selectedFile ? (
              <p className="mt-2 text-xs text-slate-500">Archivo actual: {selected.originalFileName || selected.storedFileName}</p>
            ) : null}
            {selectedFile ? (
              <p className="mt-2 text-xs text-slate-500">Archivo seleccionado: {selectedFile.name}</p>
            ) : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Titulo"><input value={draft.title} onChange={(e) => setDraft((prev: any) => ({ ...prev, title: e.target.value }))} className={inputClassName} /></Field>
            <Field label="Categoria"><select value={draft.category} onChange={(e) => setDraft((prev: any) => ({ ...prev, category: e.target.value }))} className={inputClassName}><option value="terms">terms</option><option value="privacy">privacy</option><option value="faq">faq</option><option value="guidelines">guidelines</option><option value="security">security</option></select></Field>
            <Field label="Estado"><select value={draft.status} onChange={(e) => setDraft((prev: any) => ({ ...prev, status: e.target.value }))} className={inputClassName}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></Field>
            <Field label="Version"><input value={draft.version} onChange={(e) => setDraft((prev: any) => ({ ...prev, version: e.target.value }))} className={inputClassName} /></Field>
            <Field label="Autor"><input value={draft.author} onChange={(e) => setDraft((prev: any) => ({ ...prev, author: e.target.value }))} className={inputClassName} /></Field>
          </div>
          <Field label="Contenido"><textarea rows={10} value={draft.content} onChange={(e) => setDraft((prev: any) => ({ ...prev, content: e.target.value }))} className={inputClassName} /></Field>
          <div className="flex gap-3">
            <button onClick={closeEditor} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700">Cancelar</button>
            <button disabled={saving || (!draft.title.trim() && !selectedFile)} onClick={() => void save()} className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm text-white disabled:opacity-60">{saving ? 'Guardando...' : selectedFile ? 'Guardar y subir archivo' : 'Guardar documento'}</button>
          </div>
        </div>
      </Modal>
      <Modal open={!!deleteTarget} title="Eliminar documento" onClose={() => setDeleteTarget(null)}>
        {deleteTarget ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Se eliminara el documento <strong>{deleteTarget.title}</strong>.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700">Cancelar</button>
              <button disabled={deleting} onClick={() => void remove()} className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm text-white disabled:opacity-60">{deleting ? 'Eliminando...' : 'Eliminar'}</button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

const DocumentsPageV2 = () => {
  const emptyDraft = {
    title: '',
    category: 'terms',
    status: 'draft',
    version: '1.0.0',
    author: 'Admin',
    content: '',
  };
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [draft, setDraft] = useState<any>(emptyDraft);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [extractedView, setExtractedView] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setItems(await documentsService.getAll());
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudieron cargar documentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openCreate = () => {
    setSelected({});
    setDraft(emptyDraft);
    setSelectedFile(null);
    setFormError('');
  };

  const openEdit = (item: any) => {
    setSelected(item);
    setDraft({
      title: item.title || '',
      category: item.category || 'terms',
      status: item.status || 'draft',
      version: item.version || '1.0.0',
      author: item.author || 'Admin',
      content: item.content || '',
    });
    setSelectedFile(null);
    setFormError('');
  };

  const closeEditor = () => {
    setSelected(null);
    setDraft(emptyDraft);
    setSelectedFile(null);
    setFormError('');
  };

  const save = async () => {
    try {
      setSaving(true);
      setFormError('');
      if (selectedFile) {
        if (selected?.id) {
          await documentsService.replaceUpload(selected.id, draft, selectedFile);
        } else {
          await documentsService.upload(draft, selectedFile);
        }
      } else if (selected?.id) {
        await documentsService.update(selected.id, draft);
      } else {
        await documentsService.create(draft);
      }
      await load();
      closeEditor();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'No se pudo guardar el documento');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await documentsService.delete(deleteTarget.id);
      await load();
      setDeleteTarget(null);
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'No se pudo eliminar el documento');
    } finally {
      setDeleting(false);
    }
  };

  const runAction = async (
    item: any,
    action: 'reindex' | 'reprocess' | 'view',
  ) => {
    try {
      setProcessingId(item.id);
      setFormError('');
      if (action === 'reindex') await documentsService.reindex(item.id);
      if (action === 'reprocess') await documentsService.reprocess(item.id);
      if (action === 'view') {
        setExtractedView(await documentsService.getExtractedText(item.id));
      } else {
        await load();
      }
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
          'No se pudo completar la accion sobre el documento',
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <Loading label="Cargando documentos..." />;
  if (error) return <ErrorBox message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Documentos</h1>
          <p className="text-slate-500">Gestion documental + preparacion IA</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700">Actualizar</button>
          <button onClick={openCreate} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white"><Plus className="mr-1 inline h-4 w-4" /> Nuevo documento</button>
        </div>
      </div>
      {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</div> : null}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-900">{item.title}</span>
                  <Badge tone="info">{item.category}</Badge>
                  <Badge tone={item.status === 'published' ? 'success' : item.status === 'draft' ? 'warning' : 'neutral'}>{item.status}</Badge>
                  <Badge tone={item.hasFile ? 'info' : 'neutral'}>{item.hasFile ? 'archivo' : 'manual'}</Badge>
                  <Badge tone={item.retrievalMode === 'semantic' ? 'success' : item.retrievalMode === 'keyword' ? 'warning' : 'neutral'}>{item.retrievalMode || 'none'}</Badge>
                  <Badge tone={item.indexingStatus === 'completed' ? 'success' : item.indexingStatus === 'failed' ? 'danger' : item.indexingStatus === 'processing' ? 'info' : 'neutral'}>{item.indexingStatus || 'not_indexed'}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-500">v{item.version || '1.0.0'} · {item.author || 'Admin'} · {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : '-'}</p>
                {item.hasFile ? <p className="mt-1 text-sm text-slate-500">{item.originalFileName || item.storedFileName} · {Math.round((item.fileSize || 0) / 1024)} KB · extraccion: {item.extractionStatus || 'pending'}</p> : null}
                <p className="mt-1 text-sm text-slate-500">estado: {item.processingStatus || 'processed'} · chunks: {item.chunkCount || 0}{item.embeddingModel ? ` · embeddings: ${item.embeddingModel}` : ''}</p>
                <p className="mt-1 text-sm text-slate-500">texto extraido: {item.extractedTextAvailable ? 'si' : 'no'} · caracteres: {item.extractedTextLength || 0}{item.lastProcessedAt ? ` · ultimo proceso: ${new Date(item.lastProcessedAt).toLocaleString()}` : ''}</p>
                {item.processingError ? <p className="mt-2 text-sm text-red-600">Error: {item.processingError}</p> : null}
                <p className="mt-3 line-clamp-3 text-sm text-slate-600">{item.content || 'Sin contenido'}</p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {item.hasFile ? <button onClick={() => void documentsService.download(item.id, item.originalFileName || item.title)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">Descargar</button> : null}
                <button onClick={() => void runAction(item, 'view')} disabled={processingId === item.id} className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-60">Ver texto</button>
                <button onClick={() => void runAction(item, 'reprocess')} disabled={processingId === item.id} className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-60">{processingId === item.id ? 'Procesando...' : 'Reprocess'}</button>
                <button onClick={() => void runAction(item, 'reindex')} disabled={processingId === item.id} className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-60">{processingId === item.id ? 'Procesando...' : 'Reindex'}</button>
                <button onClick={() => openEdit(item)} className="rounded-lg p-2 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeleteTarget(item)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal open={selected !== null} title={selected?.id ? 'Editar documento' : 'Nuevo documento'} onClose={closeEditor}>
        <div className="space-y-4">
          {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</div> : null}
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-800">Archivo adjunto opcional</p>
            <p className="mt-1 text-xs text-slate-500">Formatos permitidos: PDF y DOCX. Tamano maximo recomendado: 15 MB.</p>
            <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="mt-3 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-4 file:py-2 file:text-sm file:text-white" onChange={(e) => { const file = e.target.files?.[0] || null; setSelectedFile(file); if (file && !draft.title.trim()) { setDraft((prev: any) => ({ ...prev, title: file.name.replace(/\\.[^/.]+$/, '') })); } }} />
            {selected?.hasFile && !selectedFile ? <p className="mt-2 text-xs text-slate-500">Archivo actual: {selected.originalFileName || selected.storedFileName}</p> : null}
            {selectedFile ? <p className="mt-2 text-xs text-slate-500">Archivo seleccionado: {selectedFile.name}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Titulo"><input value={draft.title} onChange={(e) => setDraft((prev: any) => ({ ...prev, title: e.target.value }))} className={inputClassName} /></Field>
            <Field label="Categoria"><select value={draft.category} onChange={(e) => setDraft((prev: any) => ({ ...prev, category: e.target.value }))} className={inputClassName}><option value="terms">terms</option><option value="privacy">privacy</option><option value="faq">faq</option><option value="guidelines">guidelines</option><option value="security">security</option></select></Field>
            <Field label="Estado"><select value={draft.status} onChange={(e) => setDraft((prev: any) => ({ ...prev, status: e.target.value }))} className={inputClassName}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></Field>
            <Field label="Version"><input value={draft.version} onChange={(e) => setDraft((prev: any) => ({ ...prev, version: e.target.value }))} className={inputClassName} /></Field>
            <Field label="Autor"><input value={draft.author} onChange={(e) => setDraft((prev: any) => ({ ...prev, author: e.target.value }))} className={inputClassName} /></Field>
          </div>
          <Field label="Contenido"><textarea rows={10} value={draft.content} onChange={(e) => setDraft((prev: any) => ({ ...prev, content: e.target.value }))} className={inputClassName} /></Field>
          <div className="flex gap-3">
            <button onClick={closeEditor} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700">Cancelar</button>
            <button disabled={saving || (!draft.title.trim() && !selectedFile)} onClick={() => void save()} className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm text-white disabled:opacity-60">{saving ? 'Guardando...' : selectedFile ? 'Guardar y subir archivo' : 'Guardar documento'}</button>
          </div>
        </div>
      </Modal>
      <Modal open={!!deleteTarget} title="Eliminar documento" onClose={() => setDeleteTarget(null)}>
        {deleteTarget ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Se eliminara el documento <strong>{deleteTarget.title}</strong>.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700">Cancelar</button>
              <button disabled={deleting} onClick={() => void remove()} className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm text-white disabled:opacity-60">{deleting ? 'Eliminando...' : 'Eliminar'}</button>
            </div>
          </div>
        ) : null}
      </Modal>
      <Modal open={!!extractedView} title="Texto extraido" onClose={() => setExtractedView(null)}>
        {extractedView ? (
          <div className="space-y-4">
            <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
              <p><strong>Titulo:</strong> {extractedView.title}</p>
              <p><strong>Extraccion:</strong> {extractedView.extractionStatus}</p>
              <p><strong>Procesamiento:</strong> {extractedView.processingStatus}</p>
              <p><strong>Indexacion:</strong> {extractedView.indexingStatus}</p>
              <p><strong>Caracteres:</strong> {extractedView.extractedTextLength || 0}</p>
            </div>
            {extractedView.processingError ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{extractedView.processingError}</div> : null}
            <textarea readOnly rows={18} value={extractedView.extractedText || ''} className={inputClassName} />
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

const ActivityPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setItems(await statsService.getActivity());
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo cargar actividad');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (loading) return <Loading label="Cargando actividad..." />;
  if (error) return <ErrorBox message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Actividad</h1><p className="text-slate-500">Actividad reciente derivada de /admin/activity</p></div>
        <button onClick={load} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white">Actualizar</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-600"><tr><th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Accion</th><th className="px-6 py-4">Actor</th><th className="px-6 py-4">Recurso</th><th className="px-6 py-4">Detalle</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-600">{item.timestamp ? new Date(item.timestamp).toLocaleString() : '-'}</td>
                <td className="px-6 py-4"><Badge tone="info">{item.action}</Badge></td>
                <td className="px-6 py-4 text-sm text-slate-700">{item.actor}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.resource}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<any>({ platformName: 'MenteAmiga-AI', baseUrl: 'https://menteamiga.ai', timezone: 'UTC-5', language: 'es', dailyLimit: 20, monthlyLimit: 500 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setMessage('');
      const nextSettings = await settingsService.get();
      setSettings((prev: any) => ({ ...prev, ...nextSettings }));
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'No se pudo cargar configuracion');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    try {
      setSaving(true);
      setMessage('');
      await settingsService.update(settings);
      setMessage('Configuracion guardada correctamente');
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'No se pudo guardar configuracion');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading label="Cargando configuracion..." />;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900">Configuracion</h1><p className="text-slate-500">Configuracion real del backend</p></div>
      {message ? <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">{message}</div> : null}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <input value={settings.platformName} onChange={(e) => setSettings({ ...settings, platformName: e.target.value })} placeholder="Nombre de plataforma" className={inputClassName} />
        <input value={settings.baseUrl} onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })} placeholder="URL base" className={inputClassName} />
        <input value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} placeholder="Timezone" className={inputClassName} />
        <select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} className={inputClassName}><option value="es">Espanol</option><option value="en">English</option><option value="pt">Portugues</option></select>
        <input type="number" value={settings.dailyLimit} onChange={(e) => setSettings({ ...settings, dailyLimit: Number(e.target.value) })} placeholder="Limite diario" className={inputClassName} />
        <input type="number" value={settings.monthlyLimit} onChange={(e) => setSettings({ ...settings, monthlyLimit: Number(e.target.value) })} placeholder="Limite mensual" className={inputClassName} />
        <button disabled={saving} onClick={() => void save()} className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm text-white disabled:opacity-60">{saving ? 'Guardando...' : 'Guardar cambios'}</button>
      </div>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState<Page>('login');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [userName, setUserName] = useState('Admin');
  const [alertsCount, setAlertsCount] = useState(0);
  const [booting, setBooting] = useState(true);

  const loadAlertCount = async () => {
    if (!authService.isAuthenticated()) return;
    try {
      const alerts = await alertsService.getAll();
      setAlertsCount(alerts.filter((item: any) => item.status !== 'resolved').length);
    } catch {
      setAlertsCount(0);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!authService.isAuthenticated()) {
        setBooting(false);
        return;
      }
      try {
        const profile = await authService.getProfile();
        if (profile.role !== 'superadmin') {
          authService.logout();
          setPage('login');
          setAlertsCount(0);
        } else {
          setUserName(profile.name || profile.email?.split('@')[0] || 'Admin');
          localStorage.setItem('admin_user', JSON.stringify(profile));
          setPage('dashboard');
          await loadAlertCount();
        }
      } catch {
        authService.logout();
        setPage('login');
        setAlertsCount(0);
      } finally {
        setBooting(false);
      }
    };

    void bootstrap();
  }, []);

  const nav = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'users' as const, label: 'Usuarios', icon: <Users className="h-5 w-5" /> },
    { id: 'subscriptions' as const, label: 'Suscripciones', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'paymentMethods' as const, label: 'Metodos de pago', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'plans' as const, label: 'Planes', icon: <Plus className="h-5 w-5" /> },
    { id: 'subscriptionRequests' as const, label: 'Solicitudes premium', icon: <MessageSquareShare className="h-5 w-5" /> },
    { id: 'documents' as const, label: 'Documentos', icon: <FileText className="h-5 w-5" /> },
    { id: 'alerts' as const, label: 'Alertas', icon: <Bell className="h-5 w-5" /> },
    { id: 'activity' as const, label: 'Actividad', icon: <Activity className="h-5 w-5" /> },
    { id: 'settings' as const, label: 'Configuracion', icon: <Settings className="h-5 w-5" /> },
  ];

  const render = () => {
    switch (page) {
      case 'dashboard': return <DashboardPage />;
      case 'users': return <UsersPage />;
      case 'subscriptions': return <SubscriptionsPage />;
      case 'paymentMethods': return <PaymentMethodsPage />;
      case 'plans': return <PlansPage />;
      case 'subscriptionRequests': return <SubscriptionRequestsPage />;
      case 'documents': return <DocumentsPageV2 />;
      case 'alerts': return <AlertsPage onCountChange={setAlertsCount} />;
      case 'activity': return <ActivityPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  if (booting) return <Loading label="Validando sesion administrativa..." />;
  if (page === 'login') return <LoginPage onLogin={(user) => { setUserName(user?.name || user?.email?.split('@')[0] || 'Admin'); setPage('dashboard'); void loadAlertCount(); }} />;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {mobileOpen ? <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} /> : null}
      <aside className={cx('fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 lg:static', mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0', sidebarOpen ? 'w-64' : 'w-20')}>
        <div className={cx('flex h-16 items-center gap-3 border-b border-slate-200', sidebarOpen ? 'px-6' : 'justify-center px-4')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700"><Heart className="h-5 w-5 text-white" /></div>
          {sidebarOpen ? <div><h1 className="font-bold text-slate-900">MenteAmiga-AI</h1><p className="text-xs text-slate-500">Super Admin</p></div> : null}
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((item) => (
            <button key={item.id} onClick={() => { setPage(item.id); setMobileOpen(false); }} className={cx('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium', page === item.id ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50', !sidebarOpen && 'justify-center')}>
              {item.icon}
              {sidebarOpen ? <><span className="flex-1 text-left">{item.label}</span>{item.id === 'alerts' && alertsCount ? <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">{alertsCount}</span> : null}</> : null}
            </button>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <button onClick={() => setLogoutOpen(true)} className={cx('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50', !sidebarOpen && 'justify-center')}><LogOut className="h-5 w-5" />{sidebarOpen ? <span>Cerrar sesion</span> : null}</button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"><Menu className="h-5 w-5 text-slate-600" /></button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden rounded-lg p-2 hover:bg-slate-100 lg:block">{sidebarOpen ? <ChevronLeft className="h-5 w-5 text-slate-600" /> : <ChevronRight className="h-5 w-5 text-slate-600" />}</button>
            <span className="hidden text-sm font-medium text-slate-900 md:block">{nav.find((item) => item.id === page)?.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => void loadAlertCount()} className="rounded-lg p-2 hover:bg-slate-100"><RefreshCw className="h-5 w-5 text-slate-600" /></button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
              <div className="hidden text-right md:block"><p className="text-sm font-medium text-slate-900">{userName}</p><p className="text-xs text-slate-500">Super Admin</p></div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">{userName.charAt(0).toUpperCase()}</div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">{render()}</main>
      </div>
      <Modal open={logoutOpen} title="Cerrar sesion" onClose={() => setLogoutOpen(false)}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Tu sesion administrativa sera cerrada.</p>
          <div className="flex gap-3">
            <button onClick={() => setLogoutOpen(false)} className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700">Cancelar</button>
            <button onClick={() => { authService.logout(); setLogoutOpen(false); setPage('login'); setAlertsCount(0); }} className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm text-white">Cerrar sesion</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
