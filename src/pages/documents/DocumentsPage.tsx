import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { documentsService } from '../../services/documents.service';
import { useAdminFilters } from '../../hooks/useAdminFilters';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import {
  Badge,
  cx,
  EmptyState,
  ErrorBox,
  Field,
  formatDateTime,
  inputClassName,
  Loading,
  MetricCard,
  Modal,
  PageHeader,
  PaginationControls,
} from '../../components/shared/ui';
import type { BadgeTone } from '../../types/admin';
import type { AdminDocument, RagHealth, RagSearchResult } from '../../types/admin';

type DocumentDraft = {
  title: string;
  category: string;
  status: string;
  version: string;
  author: string;
  content: string;
};

type DocumentFilters = {
  status: string;
};

type ExtractedDocumentView = {
  id: string;
  title: string;
  extractedText: string;
  extractedTextLength: number;
  systemStatus?: string;
  extractionStatus?: string;
  processingStatus?: string;
  processingError?: string;
  indexingStatus?: string;
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

const getDocumentStatusMeta = (systemStatus?: string): { label: string; tone: BadgeTone; helper: string } => {
  switch (systemStatus) {
    case 'processed':
      return { label: 'Listo para usar', tone: 'success', helper: 'Disponible para consulta interna.' };
    case 'pending':
      return { label: 'Procesando', tone: 'info', helper: 'El sistema esta preparando el contenido.' };
    case 'uploaded_not_extracted':
      return { label: 'Subido sin texto', tone: 'warning', helper: 'El archivo existe, pero requiere reintento de extraccion.' };
    case 'failed':
      return { label: 'Con incidencia', tone: 'danger', helper: 'Necesita revision o reproceso.' };
    default:
      return { label: 'Sin clasificar', tone: 'neutral', helper: 'Estado pendiente de confirmar.' };
  }
};

export const DocumentsPage = () => {
  const emptyDraft: DocumentDraft = { title: '', category: 'guidelines', status: 'published', version: '1.0.0', author: 'Admin', content: '' };
  const { filters, updateFilter } = useAdminFilters<DocumentFilters>({ status: 'all' });
  const fetchDocuments = useCallback(
    ({ page, limit }: DocumentFilters & { page: number; limit: number }) =>
      documentsService.getAll({
        page,
        limit,
        status: undefined,
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
  } = usePaginatedList<AdminDocument, DocumentFilters>({
    fetchPage: fetchDocuments,
    filters,
  });
  const [selected, setSelected] = useState<AdminDocument | Record<string, never> | null>(null);
  const [draft, setDraft] = useState<DocumentDraft>(emptyDraft);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminDocument | null>(null);
  const [extractedView, setExtractedView] = useState<ExtractedDocumentView | null>(null);
  const [ragHealth, setRagHealth] = useState<RagHealth | null>(null);
  const [ragQuery, setRagQuery] = useState('');
  const [ragResult, setRagResult] = useState<RagSearchResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const runRagSearch = async () => {
    if (!ragQuery.trim()) return;
    try {
      setFormError('');
      setRagResult(await documentsService.searchRag(ragQuery.trim(), 5));
    } catch (err: unknown) {
      setFormError(getErrorMessage(err, 'No se pudo consultar el RAG'));
    }
  };

  useEffect(() => {
    void documentsService.getRagHealth().then(setRagHealth).catch(() => setRagHealth(null));
  }, [items]);

  const statusCounts = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          const key = item.systemStatus || 'processed';
          if (key in acc) acc[key as keyof typeof acc] += 1;
          return acc;
        },
        { processed: 0, pending: 0, uploaded_not_extracted: 0, failed: 0 },
      ),
    [items],
  );

  const filteredItems = useMemo(
    () => items.filter((item) => filters.status === 'all' || item.systemStatus === filters.status),
    [items, filters.status],
  );

  const openCreate = () => {
    setSelected({});
    setDraft(emptyDraft);
    setSelectedFile(null);
    setFormError('');
  };

  const openEdit = (item: AdminDocument) => {
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
        if (selected && 'id' in selected && selected.id) await documentsService.replaceUpload(selected.id, draft, selectedFile);
        else await documentsService.upload(draft, selectedFile);
      } else if (selected && 'id' in selected && selected.id) {
        await documentsService.update(selected.id, draft);
      } else {
        await documentsService.create(draft);
      }
      await load();
      closeEditor();
    } catch (err: unknown) {
      setFormError(getErrorMessage(err, 'No se pudo guardar el documento'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    try {
      await documentsService.delete(deleteTarget.id);
      await load();
      setDeleteTarget(null);
    } catch (err: unknown) {
      setFormError(getErrorMessage(err, 'No se pudo eliminar el documento'));
    }
  };

  const runAction = async (item: AdminDocument, action: 'reindex' | 'reprocess' | 'view') => {
    try {
      setProcessingId(item.id);
      setFormError('');
      if (action === 'reindex') await documentsService.reindex(item.id);
      if (action === 'reprocess') await documentsService.reprocess(item.id);
      if (action === 'view') setExtractedView(await documentsService.getExtractedText(item.id));
      else await load();
    } catch (err: unknown) {
      setFormError(getErrorMessage(err, 'No se pudo completar la accion'));
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <Loading label="Cargando documentos..." />;
  if (error) return <ErrorBox message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentos internos / RAG"
        description="Carga, procesamiento e indexacion de conocimiento interno"
        action={<div className="flex gap-3"><button onClick={load} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"><RefreshCw className="mr-1 inline h-4 w-4" />Actualizar</button><button onClick={openCreate} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white"><Plus className="mr-1 inline h-4 w-4" />Subir documento</button></div>}
      />
      {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</div> : null}
      <div className="grid gap-5 md:grid-cols-4">
        <MetricCard title="Listos" value={statusCounts.processed} />
        <MetricCard title="Procesando" value={statusCounts.pending} />
        <MetricCard title="Sin texto" value={statusCounts.uploaded_not_extracted} />
        <MetricCard title="Incidencias" value={statusCounts.failed} />
      </div>
      {ragHealth ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-medium text-emerald-950">Como queda disponible para el chat</p>
            <p className="mt-1">
              Aqui no se entrena ChatGPT desde cero. El flujo real es: subir documento, extraer texto, indexar chunks y dejarlo en <strong>published</strong>. Si queda en <strong>draft</strong> o sin texto extraido, el chat no lo usara.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard title="RAG indexados" value={ragHealth.indexedDocuments} />
            <MetricCard title="Chunks" value={ragHealth.totalChunks} />
            <MetricCard title="Semanticos" value={ragHealth.semanticChunks} />
            <MetricCard title="Keyword" value={ragHealth.keywordChunks} />
          </div>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <span className="font-medium text-slate-800">Modo efectivo</span>
              <p>{ragHealth.effectiveRetrievalMode || 'none'}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <span className="font-medium text-slate-800">Embeddings</span>
              <p>{ragHealth.embeddingsConfigured ? ragHealth.embeddingModel || 'configurados' : 'no configurados'}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <span className="font-medium text-slate-800">Atlas Vector Search</span>
              <p>{ragHealth.atlasVectorIndexConfigured ? ragHealth.atlasVectorIndex || 'configurado' : 'sin indice configurado'}</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-sky-100 bg-sky-50 p-4 text-sm text-sky-900">
            <p className="font-medium text-sky-950">Ayuda rapida de estados</p>
            <p className="mt-1">
              <strong>processing</strong>: el archivo se esta extrayendo o indexando. <strong>indexed/completed</strong>: el contenido esta disponible para recuperacion. <strong>not_indexed</strong>: no hay texto usable para RAG. <strong>failed</strong>: requiere revisar error, reprocesar o reemplazar archivo. <strong>draft</strong>: aunque tenga texto, no alimenta el chat.
            </p>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              value={ragQuery}
              onChange={(event) => setRagQuery(event.target.value)}
              placeholder="Buscar en el conocimiento interno"
              className={inputClassName}
            />
            <button onClick={() => void runRagSearch()} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white">
              Probar recuperacion
            </button>
          </div>
          {ragResult ? (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-slate-600">
                Modo: <strong>{ragResult.retrievalMode}</strong> · resultados: {ragResult.chunks.length}
              </p>
              {ragResult.chunks.map((chunk) => (
                <div key={`${chunk.documentId}-${chunk.chunkIndex}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="font-medium text-slate-900">{chunk.documentTitle} · score {chunk.score.toFixed(3)}</p>
                  <p className="mt-1 line-clamp-3">{chunk.text}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)} className={inputClassName}>
          <option value="all">Todos</option>
          <option value="processed">Listos para usar</option>
          <option value="pending">Procesando</option>
          <option value="uploaded_not_extracted">Subidos sin texto</option>
          <option value="failed">Con incidencia</option>
        </select>
      </div>
      {filteredItems.length === 0 ? (
        <EmptyState title={items.length === 0 ? 'Todavia no hay documentos internos' : 'No hay documentos para este filtro'} description="Sube un PDF o DOCX para alimentar el conocimiento interno." />
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const statusMeta = getDocumentStatusMeta(item.systemStatus);
            return (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">{item.title}</span>
                      <Badge tone="info">{item.category}</Badge>
                      <Badge tone={item.status === 'published' ? 'success' : item.status === 'draft' ? 'warning' : 'neutral'}>{item.status}</Badge>
                      <Badge tone={item.hasFile ? 'info' : 'neutral'}>{item.hasFile ? 'archivo' : 'manual'}</Badge>
                      <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">v{item.version || '1.0.0'} · {item.author || 'Admin'} · {formatDateTime(item.lastUpdated)}</p>
                    <p className="mt-1 text-sm text-slate-500">chunks: {item.chunkCount || 0} · texto: {item.extractedTextAvailable ? 'disponible' : 'no disponible'} · caracteres: {item.extractedTextLength || 0}</p>
                    <div className={cx('mt-3 rounded-lg border p-3 text-sm', statusMeta.tone === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-800', statusMeta.tone === 'info' && 'border-sky-200 bg-sky-50 text-sky-800', statusMeta.tone === 'warning' && 'border-amber-200 bg-amber-50 text-amber-800', statusMeta.tone === 'danger' && 'border-red-200 bg-red-50 text-red-800', statusMeta.tone === 'neutral' && 'border-slate-200 bg-slate-50 text-slate-700')}>
                      {statusMeta.helper}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.hasFile ? <button onClick={() => void documentsService.download(item.id, item.originalFileName || item.title)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">Descargar</button> : null}
                    <button onClick={() => void runAction(item, 'view')} disabled={processingId === item.id} className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-60">Ver detalle</button>
                    <button onClick={() => void runAction(item, 'reprocess')} disabled={processingId === item.id} className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-60">{processingId === item.id ? 'Procesando...' : 'Reprocesar'}</button>
                    <button onClick={() => void runAction(item, 'reindex')} disabled={processingId === item.id} className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-60">Reindexar</button>
                    <button onClick={() => openEdit(item)} className="rounded-lg p-2 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteTarget(item)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            );
          })}
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
          itemLabel="documentos"
        />
      ) : null}      <Modal open={selected !== null} title={selected && 'id' in selected && selected.id ? 'Editar documento' : 'Nuevo documento'} onClose={closeEditor}>
        <div className="space-y-4">
          {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</div> : null}
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-800">Archivo adjunto opcional</p>
            <p className="mt-1 text-xs text-slate-500">Formatos permitidos: PDF y DOCX. Maximo 15 MB.</p>
            <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="mt-3 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-4 file:py-2 file:text-sm file:text-white" onChange={(event) => { const file = event.target.files?.[0] || null; setSelectedFile(file); if (file && !draft.title.trim()) setDraft((prev) => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, '') })); }} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Titulo"><input value={draft.title} onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))} className={inputClassName} /></Field>
            <Field label="Categoria"><select value={draft.category} onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))} className={inputClassName}><option value="terms">terms</option><option value="privacy">privacy</option><option value="faq">faq</option><option value="guidelines">guidelines</option><option value="security">security</option></select></Field>
            <Field label="Estado"><select value={draft.status} onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))} className={inputClassName}><option value="published">published</option><option value="draft">draft</option><option value="archived">archived</option></select></Field>
            <Field label="Version"><input value={draft.version} onChange={(event) => setDraft((prev) => ({ ...prev, version: event.target.value }))} className={inputClassName} /></Field>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Si este documento debe mejorar las respuestas del chat, dejalo en <strong>published</strong>. Usa <strong>draft</strong> solo si todavia no debe entrar al conocimiento visible para usuarios.
          </div>
          <Field label="Contenido manual"><textarea rows={8} value={draft.content} onChange={(event) => setDraft((prev) => ({ ...prev, content: event.target.value }))} className={inputClassName} /></Field>
          <div className="flex gap-3">
            <button onClick={closeEditor} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700">Cancelar</button>
            <button disabled={saving || (!draft.title.trim() && !selectedFile)} onClick={() => void save()} className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm text-white disabled:opacity-60">{saving ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </div>
      </Modal>
      <Modal open={!!deleteTarget} title="Eliminar documento" onClose={() => setDeleteTarget(null)}>
        {deleteTarget ? <div className="space-y-4"><p className="text-sm text-slate-600">Se eliminara <strong>{deleteTarget.title}</strong>.</p><div className="flex gap-3"><button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700">Cancelar</button><button onClick={() => void remove()} className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm text-white">Eliminar</button></div></div> : null}
      </Modal>
      <Modal open={!!extractedView} title="Detalle del documento" onClose={() => setExtractedView(null)}>
        {extractedView ? <div className="space-y-4"><div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2"><p><strong>Titulo:</strong> {extractedView.title}</p><p><strong>Estado:</strong> {getDocumentStatusMeta(extractedView.systemStatus).label}</p><p><strong>Extraccion:</strong> {extractedView.extractionStatus}</p><p><strong>Procesamiento:</strong> {extractedView.processingStatus}</p><p><strong>Indexacion:</strong> {extractedView.indexingStatus}</p><p><strong>Caracteres:</strong> {extractedView.extractedTextLength || 0}</p></div><textarea readOnly rows={18} value={extractedView.extractedText || ''} className={inputClassName} /></div> : null}
      </Modal>
    </div>
  );
};
