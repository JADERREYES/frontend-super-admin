import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  FileText,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';
import { statsService } from '../../services/stats.service';
import {
  Badge,
  EmptyState,
  ErrorBox,
  formatDateTime,
  Loading,
  PageHeader,
} from '../../components/shared/ui';
import type { AdminPage, DashboardResponse } from '../../types/admin';

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response
  ) {
    const data = error.response.data as { message?: string };
    return data.message || 'No se pudo cargar el dashboard';
  }

  return 'No se pudo cargar el dashboard';
};

const MetricTile = ({
  title,
  value,
  helper,
  tone = 'default',
  cta,
  onClick,
}: {
  title: string;
  value: string | number;
  helper: string;
  tone?: 'default' | 'warning' | 'danger' | 'info';
  cta: string;
  onClick: () => void;
}) => {
  const toneClass = {
    default: 'border-slate-200 bg-white',
    warning: 'border-amber-200 bg-amber-50',
    danger: 'border-red-200 bg-red-50',
    info: 'border-sky-200 bg-sky-50',
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-5 text-left transition hover:shadow-sm ${toneClass}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
          <p className="mt-2 text-xs text-slate-600">{helper}</p>
        </div>
        <TrendingUp className="h-5 w-5 text-slate-400" />
      </div>
      <span className="mt-4 inline-flex text-sm font-medium text-teal-700">{cta}</span>
    </button>
  );
};

export const DashboardPage = ({
  onNavigate,
}: {
  onNavigate: (page: AdminPage) => void;
}) => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showTour, setShowTour] = useState(
    () => localStorage.getItem('admin_onboarding_seen') !== 'true',
  );

  const load = async ({ silent = false }: { silent?: boolean } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      if (!silent) {
        setError('');
      }
      setData(await statsService.getDashboard());
    } catch (err: unknown) {
      if (!silent) {
        setError(getErrorMessage(err));
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void load({ silent: true });
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, []);

  const stats = data?.stats || {
    totalUsers: 0,
    activeUsers: 0,
    totalChats: 0,
    premiumUsers: 0,
  };

  const ragIncidents = (stats.failedDocuments || 0) > 0;
  const riskCount = useMemo(
    () => Math.max(stats.openAlerts || 0, stats.humanReviewCases || 0),
    [stats.humanReviewCases, stats.openAlerts],
  );

  if (loading) return <Loading label="Cargando panel operativo..." />;
  if (error) return <ErrorBox message={error} onRetry={load} />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Centro de operacion"
        description={`${data?.period?.label || 'Estado actual'} - actualizado ${formatDateTime(data?.period?.generatedAt)}`}
        action={
          <button onClick={() => void load()} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white">
            <RefreshCw className="mr-1 inline h-4 w-4" />
            Actualizar
          </button>
        }
      />

      {showTour ? (
        <section className="rounded-xl border border-teal-200 bg-teal-50 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="font-semibold text-teal-950">Recorrido rapido para administradores</h2>
              <div className="mt-3 grid gap-3 text-sm text-teal-900 md:grid-cols-5">
                <button onClick={() => onNavigate('users')} className="rounded-lg bg-white p-3 text-left">Gestiona usuarios y roles.</button>
                <button onClick={() => onNavigate('alerts')} className="rounded-lg bg-white p-3 text-left">Revisa alertas criticas.</button>
                <button onClick={() => onNavigate('subscriptionRequests')} className="rounded-lg bg-white p-3 text-left">Valida pagos y solicitudes.</button>
                <button onClick={() => onNavigate('documents')} className="rounded-lg bg-white p-3 text-left">Administra documentos RAG.</button>
                <button onClick={() => onNavigate('settings')} className="rounded-lg bg-white p-3 text-left">Configura seguridad.</button>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.setItem('admin_onboarding_seen', 'true');
                setShowTour(false);
              }}
              className="rounded-lg border border-teal-300 bg-white px-4 py-2 text-sm text-teal-800"
            >
              Entendido
            </button>
          </div>
        </section>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-4">
        <MetricTile
          title="Usuarios"
          value={stats.totalUsers}
          helper={`${stats.activeUsers} cuentas activas`}
          cta="Gestionar usuarios"
          onClick={() => onNavigate('users')}
        />
        <MetricTile
          title="Operacion"
          value={stats.totalChats}
          helper="Conversaciones registradas"
          cta="Ver actividad"
          onClick={() => onNavigate('activity')}
        />
        <MetricTile
          title="RAG"
          value={stats.totalDocuments || 0}
          helper={`${stats.processedDocuments || 0} listos, ${stats.failedDocuments || 0} con incidencia`}
          tone={ragIncidents ? 'warning' : 'info'}
          cta={ragIncidents ? 'Revisar incidencias' : 'Ver documentos'}
          onClick={() => onNavigate('documents')}
        />
        <MetricTile
          title="Pagos y planes"
          value={stats.pendingSubscriptionRequests || 0}
          helper={`${stats.premiumUsers || 0} usuarios premium`}
          tone={(stats.pendingSubscriptionRequests || 0) > 0 ? 'warning' : 'default'}
          cta="Revisar y aprobar"
          onClick={() => onNavigate('subscriptionRequests')}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <button type="button" onClick={() => onNavigate('alerts')} className="rounded-xl border border-red-200 bg-red-50 p-5 text-left">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-red-800">Riesgos detectados</p>
              <p className="mt-2 text-3xl font-bold text-red-950">{riskCount}</p>
              <p className="mt-2 text-xs text-red-900">
                Alertas abiertas o conversaciones que pueden requerir revision humana.
              </p>
            </div>
            <ShieldAlert className="h-7 w-7 text-red-700" />
          </div>
          <p className="mt-4 text-xs text-red-800">
            Este panel prioriza seguimiento operativo; no emite diagnosticos clinicos.
          </p>
        </button>
        <button type="button" onClick={() => onNavigate('subscriptionRequests')} className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-left">
          <Bell className="mb-3 h-6 w-6 text-amber-700" />
          <p className="font-semibold text-amber-950">Solicitudes pendientes</p>
          <p className="mt-1 text-sm text-amber-900">
            Revisar comprobantes, activar planes y dejar trazabilidad.
          </p>
        </button>
        <button type="button" onClick={() => onNavigate('documents')} className="rounded-xl border border-sky-200 bg-sky-50 p-5 text-left">
          <FileText className="mb-3 h-6 w-6 text-sky-700" />
          <p className="font-semibold text-sky-950">Documentos / RAG</p>
          <p className="mt-1 text-sm text-sky-900">
            Validar indexacion, reprocesar errores y consultar diagnostico RAG.
          </p>
        </button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <h2 className="font-semibold text-slate-900">Flujos rapidos</h2>
          <p className="text-sm text-slate-500">Accesos directos a tareas operativas frecuentes.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <button onClick={() => onNavigate('subscriptionRequests')} className="rounded-lg border border-slate-200 p-4 text-left text-sm hover:border-teal-300 hover:bg-teal-50">
            Revisar solicitudes premium
          </button>
          <button onClick={() => onNavigate('documents')} className="rounded-lg border border-slate-200 p-4 text-left text-sm hover:border-teal-300 hover:bg-teal-50">
            Diagnosticar RAG
          </button>
          <button onClick={() => onNavigate('alerts')} className="rounded-lg border border-slate-200 p-4 text-left text-sm hover:border-teal-300 hover:bg-teal-50">
            Atender alertas abiertas
          </button>
          <button onClick={() => onNavigate('settings')} className="rounded-lg border border-slate-200 p-4 text-left text-sm hover:border-teal-300 hover:bg-teal-50">
            Revisar seguridad admin
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900">Actividad prioritaria</h2>
            <p className="text-sm text-slate-500">Cambios recientes con acceso directo a revision.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {(data?.recentActivity || []).length === 0 ? (
              <div className="p-5">
                <EmptyState title="Sin actividad reciente" description="Cuando haya usuarios, pagos o documentos nuevos apareceran aqui." />
              </div>
            ) : null}
            {(data?.recentActivity || []).slice(0, 8).map((item) => (
              <button key={item.id} type="button" onClick={() => onNavigate(item.type === 'subscriptionRequest' ? 'subscriptionRequests' : item.type === 'document' ? 'documents' : item.type === 'chat' ? 'activity' : 'users')} className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.subtitle}</p>
                </div>
                <div className="text-right">
                  {item.status ? <Badge tone={item.status === 'failed' ? 'danger' : 'info'}>{item.status}</Badge> : null}
                  <p className="mt-1 text-xs text-slate-400">{formatDateTime(item.timestamp)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900">Chats recientes</h2>
            <p className="text-sm text-slate-500">Resumen sin contenido sensible en portada.</p>
          </div>
          <div className="p-5">
            {(data?.recentChats || []).length === 0 ? (
              <EmptyState title="Sin chats recientes" description="Todavia no hay conversaciones para revisar." />
            ) : (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Chats recientes</p>
                    <p className="mt-2 text-3xl font-bold text-slate-950">{data?.recentChats?.length || 0}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Conversaciones con alta actividad</p>
                    <p className="mt-2 text-3xl font-bold text-slate-950">
                      {(data?.recentChats || []).filter((chat) => (chat.messageCount || 0) >= 8).length}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  Los textos y detalles personales no se muestran en el dashboard. Usa la vista dedicada para revisar actividad.
                </p>
                <button onClick={() => onNavigate('activity')} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white">
                  Ir a actividad
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <AlertTriangle className="mr-2 inline h-4 w-4 text-amber-600" />
        Las senales de riesgo ayudan a priorizar revision operativa. No sustituyen evaluacion profesional ni atencion de emergencia.
      </div>
    </div>
  );
};
