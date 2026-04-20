import React from 'react';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import type { BadgeTone } from '../../types/admin';

export const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export const inputClassName =
  'w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500';

export const Badge = ({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) => {
  const map: Record<BadgeTone, string> = {
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-sky-50 text-sky-700',
  };

  return (
    <span className={cx('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', map[tone])}>
      {children}
    </span>
  );
};

export const MetricCard = ({
  title,
  value,
  helper,
  onClick,
}: {
  title: string;
  value: string | number;
  helper?: string;
  onClick?: () => void;
}) => {
  const content = (
    <>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {helper ? <p className="mt-2 text-xs text-slate-500">{helper}</p> : null}
    </>
  );

  if (!onClick) {
    return <div className="rounded-xl border border-slate-200 bg-white p-5">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-teal-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
      {content}
    </button>
  );
};

export const Loading = ({ label }: { label: string }) => (
  <div className="flex h-56 items-center justify-center">
    <div className="text-center">
      <LoaderCircle className="mx-auto mb-3 h-8 w-8 animate-spin text-teal-600" />
      <p className="text-slate-500">{label}</p>
    </div>
  </div>
);

export const ErrorBox = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
    <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
    <p className="text-red-700">{message}</p>
    <button onClick={onRetry} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white">
      Reintentar
    </button>
  </div>
);

export const EmptyState = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => (
  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
    <p className="font-medium text-slate-800">{title}</p>
    {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
  </div>
);

export const Modal = ({
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
      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            Cerrar
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
};

export const Field = ({
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

export const PageHeader = ({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {description ? <p className="text-slate-500">{description}</p> : null}
    </div>
    {action}
  </div>
);

export const formatMoney = (value: number, currency = 'COP') =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);

export const formatDateTime = (value?: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
};

export const toDateInputValue = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

export const PaginationControls = ({
  page,
  totalPages,
  total,
  limit,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onLimitChange,
  itemLabel,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  itemLabel: string;
}) => (
  <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
    <span>
      Pagina {page} de {totalPages} · {total} {itemLabel}
    </span>
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={limit}
        onChange={(event) => onLimitChange(Number(event.target.value))}
        className="rounded-lg border border-slate-300 px-3 py-2"
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
      <button
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-50"
      >
        Anterior
      </button>
      <button
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  </div>
);
