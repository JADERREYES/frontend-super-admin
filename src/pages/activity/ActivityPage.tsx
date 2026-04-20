import { useEffect, useMemo, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { statsService } from '../../services/stats.service';
import {
  Badge,
  EmptyState,
  ErrorBox,
  formatDateTime,
  inputClassName,
  Loading,
  Modal,
  PageHeader,
} from '../../components/shared/ui';
import type { ActivityItem } from '../../types/admin';

const actionLabel = (action: string) => {
  if (action === 'USER_REGISTER') return 'Usuario creado';
  if (action === 'CHAT_CREATED') return 'Chat creado';
  return action;
};

const exportCsv = (items: ActivityItem[]) => {
  const header = ['fecha', 'accion', 'actor', 'tipo_actor', 'recurso', 'detalle'];
  const rows = items.map((item) =>
    [item.timestamp || '', item.action, item.actor, item.actorType, item.resource, item.details]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(','),
  );
  const blob = new Blob([[header.join(','), ...rows].join('\n')], {
    type: 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `actividad-admin-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const ActivityPage = () => {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<ActivityItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setItems(await statsService.getActivity());
    } catch (err: unknown) {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof err.response === 'object' &&
        err.response !== null &&
        'data' in err.response
          ? (err.response.data as { message?: string }).message
          : '';
      setError(message || 'No se pudo cargar actividad');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const matchesType = typeFilter === 'all' || item.actorType === typeFilter || item.action === typeFilter;
        const haystack = `${item.actor} ${item.resource} ${item.details} ${item.action}`.toLowerCase();
        const matchesSearch = !search.trim() || haystack.includes(search.trim().toLowerCase());
        const timestamp = item.timestamp ? new Date(item.timestamp).getTime() : 0;
        const matchesFrom = !fromDate || timestamp >= new Date(fromDate).getTime();
        const matchesTo = !toDate || timestamp <= new Date(`${toDate}T23:59:59`).getTime();
        return matchesType && matchesSearch && matchesFrom && matchesTo;
      }),
    [fromDate, items, search, toDate, typeFilter],
  );

  if (loading) return <Loading label="Cargando bitacora..." />;
  if (error) return <ErrorBox message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Actividad / Auditoria"
        description="Bitacora de eventos recientes para investigacion operativa."
        action={
          <div className="flex flex-wrap gap-2">
            <button onClick={() => exportCsv(filtered)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700">
              <Download className="mr-1 inline h-4 w-4" />
              Exportar
            </button>
            <button onClick={load} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white">
              <RefreshCw className="mr-1 inline h-4 w-4" />
              Actualizar
            </button>
          </div>
        }
      />
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-4">
        <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className={inputClassName}>
          <option value="all">Toda la actividad</option>
          <option value="user">Usuarios</option>
          <option value="USER_REGISTER">Altas de usuario</option>
          <option value="CHAT_CREATED">Chats</option>
        </select>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar actor, usuario o detalle" className={inputClassName} />
        <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className={inputClassName} />
        <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className={inputClassName} />
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="Sin actividad para mostrar" description="Ajusta los filtros o vuelve a cargar la bitacora." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-600">
              <tr><th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Evento</th><th className="px-6 py-4">Actor</th><th className="px-6 py-4">Recurso</th><th className="px-6 py-4">Detalle</th><th className="px-6 py-4">Accion</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-600">{formatDateTime(item.timestamp)}</td>
                  <td className="px-6 py-4"><Badge tone="info">{actionLabel(item.action)}</Badge></td>
                  <td className="px-6 py-4 text-sm text-slate-700">{item.actor}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.resource}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.details}</td>
                  <td className="px-6 py-4">
                    {item.action === 'CHAT_CREATED' ? (
                      <span className="text-xs font-medium text-slate-400">Privado</span>
                    ) : (
                      <button
                        onClick={() => setSelectedEvent(item)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        Ver detalle
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={!!selectedEvent} title="Detalle de actividad" onClose={() => setSelectedEvent(null)}>
        {selectedEvent ? (
          <div className="space-y-4 text-sm text-slate-700">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs uppercase text-slate-500">Fecha</p>
                <p className="font-medium text-slate-900">{formatDateTime(selectedEvent.timestamp)}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs uppercase text-slate-500">Evento</p>
                <p className="font-medium text-slate-900">{actionLabel(selectedEvent.action)}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs uppercase text-slate-500">Actor</p>
                <p className="font-medium text-slate-900">{selectedEvent.actor}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs uppercase text-slate-500">Recurso</p>
                <p className="font-medium text-slate-900">{selectedEvent.resource}</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs uppercase text-slate-500">Descripcion</p>
              <p className="mt-1">{selectedEvent.details}</p>
            </div>
            <p className="text-xs text-slate-500">
              Esta vista es de investigacion operativa. La bitacora no edita entidades ni altera datos.
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
