import { useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { alertsService } from '../../services/alerts.service';
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
} from '../../components/shared/ui';

export const AlertsPage = ({ onCountChange }: { onCountChange?: (count: number) => void }) => {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('open');
  const [draft, setDraft] = useState<any>({ title: '', description: '', type: 'system', severity: 'medium', status: 'open', assignedTo: '' });
  const [supportMessage, setSupportMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingSupport, setSendingSupport] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const load = async ({ silent = false }: { silent?: boolean } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
        setError('');
      }
      const data = await alertsService.getAll();
      setItems(data);
      onCountChange?.(data.filter((item: any) => item.status !== 'resolved').length);
    } catch (err: any) {
      if (!silent) {
        setError(err?.response?.data?.message || 'No se pudieron cargar alertas');
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
  }, [onCountChange]);

  const filtered = useMemo(
    () =>
      items.filter((item) =>
        statusFilter === 'all'
          ? true
          : statusFilter === 'open'
            ? item.status !== 'resolved'
            : item.status === statusFilter,
      ),
    [items, statusFilter],
  );

  const openEditor = (item: any) => {
    setSelected(item);
    setDraft({ title: item.title || '', description: item.description || '', type: item.type || 'system', severity: item.severity || 'medium', status: item.status || 'open', assignedTo: item.assignedTo || '' });
    setSupportMessage('Este es un mensaje prioritario de apoyo. Si sientes que podrias hacerte dano o que tu vida corre peligro ahora, llama de inmediato al 123 en Colombia. Si estas en Bogota y necesitas orientacion emocional, tambien puedes comunicarte con la Linea 106. Busca a una persona de confianza y acude a un servicio de urgencias o a tu red cercana ahora mismo.');
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

  const sendCrisisSupport = async () => {
    if (!selected) return;
    try {
      setSendingSupport(true);
      setFormError('');
      await alertsService.sendCrisisSupport(selected.id, supportMessage);
      await load();
      setSelected(null);
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'No se pudo enviar el apoyo urgente al chat');
    } finally {
      setSendingSupport(false);
    }
  };

  if (loading) return <Loading label="Cargando alertas..." />;
  if (error) return <ErrorBox message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Alertas" description="Seguimiento de incidencias administrativas. Actualizacion automatica cada 10 segundos." action={<button onClick={() => void load()} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white"><RefreshCw className="mr-1 inline h-4 w-4" />Actualizar</button>} />
      <div className="grid gap-5 md:grid-cols-4">
        <MetricCard title="Abiertas" value={items.filter((item) => item.status !== 'resolved').length} />
        <MetricCard title="Criticas" value={items.filter((item) => item.severity === 'critical').length} />
        <MetricCard title="Investigando" value={items.filter((item) => item.status === 'investigating').length} />
        <MetricCard title="Resueltas" value={items.filter((item) => item.status === 'resolved').length} />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={inputClassName}>
          <option value="open">Abiertas</option>
          <option value="all">Todas</option>
          <option value="investigating">Investigando</option>
          <option value="resolved">Resueltas</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="No hay alertas para el filtro actual" description="Las alertas operativas apareceran en esta vista." />
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <button key={item.id} onClick={() => openEditor(item)} className="w-full rounded-xl border border-slate-200 bg-white p-5 text-left hover:border-slate-300">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-900">{item.title}</span>
                <Badge tone={item.severity === 'critical' ? 'danger' : item.severity === 'high' ? 'warning' : 'info'}>{item.severity}</Badge>
                <Badge tone={item.status === 'resolved' ? 'success' : item.status === 'investigating' ? 'info' : 'warning'}>{item.status}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </button>
          ))}
        </div>
      )}
      <Modal open={!!selected} title="Editar alerta" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="space-y-4">
            {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</div> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Titulo"><input value={draft.title} onChange={(event) => setDraft((prev: any) => ({ ...prev, title: event.target.value }))} className={inputClassName} /></Field>
              <Field label="Tipo"><select value={draft.type} onChange={(event) => setDraft((prev: any) => ({ ...prev, type: event.target.value }))} className={inputClassName}><option value="system">system</option><option value="security">security</option><option value="user">user</option><option value="subscription">subscription</option></select></Field>
              <Field label="Severidad"><select value={draft.severity} onChange={(event) => setDraft((prev: any) => ({ ...prev, severity: event.target.value }))} className={inputClassName}><option value="low">low</option><option value="medium">medium</option><option value="high">high</option><option value="critical">critical</option></select></Field>
              <Field label="Estado"><select value={draft.status} onChange={(event) => setDraft((prev: any) => ({ ...prev, status: event.target.value }))} className={inputClassName}><option value="open">open</option><option value="investigating">investigating</option><option value="resolved">resolved</option></select></Field>
              <Field label="Asignada a"><input value={draft.assignedTo} onChange={(event) => setDraft((prev: any) => ({ ...prev, assignedTo: event.target.value }))} className={inputClassName} /></Field>
              <Field label="Descripcion"><textarea rows={5} value={draft.description} onChange={(event) => setDraft((prev: any) => ({ ...prev, description: event.target.value }))} className={inputClassName} /></Field>
            </div>
            {draft.severity === 'critical' && draft.type === 'user' ? (
              <Field label="Mensaje urgente para el usuario">
                <textarea
                  rows={6}
                  value={supportMessage}
                  onChange={(event) => setSupportMessage(event.target.value)}
                  className={inputClassName}
                />
              </Field>
            ) : null}
            <div className="flex gap-3">
              <button onClick={() => setSelected(null)} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700">Cancelar</button>
              {draft.severity === 'critical' && draft.type === 'user' ? (
                <button disabled={sendingSupport} onClick={() => void sendCrisisSupport()} className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm text-white disabled:opacity-60">{sendingSupport ? 'Enviando apoyo...' : 'Enviar apoyo urgente'}</button>
              ) : null}
              <button disabled={saving} onClick={() => void save()} className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm text-white disabled:opacity-60">{saving ? 'Guardando...' : 'Guardar cambios'}</button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
