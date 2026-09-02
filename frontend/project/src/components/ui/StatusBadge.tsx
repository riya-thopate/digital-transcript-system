import type { RequestStatus, DocumentStatus } from '@/types';
import { requestStatusLabels } from '@/mocks/data';
import { CheckCircle2, Clock, FileSearch, FileCheck2, FileX2, FileText } from 'lucide-react';

const statusConfig: Record<RequestStatus, { classes: string; icon: typeof Clock }> = {
  PENDING: {
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
  },
  UNDER_REVIEW: {
    classes: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: FileSearch,
  },
  APPROVED: {
    classes: 'bg-success-50 text-success-700 border-success-100',
    icon: FileCheck2,
  },
  REJECTED: {
    classes: 'bg-error-50 text-error-700 border-error-100',
    icon: FileX2,
  },
  DOCUMENT_GENERATED: {
    classes: 'bg-navy-50 text-navy-700 border-navy-200',
    icon: FileText,
  },
  AVAILABLE: {
    classes: 'bg-success-50 text-success-700 border-success-100',
    icon: CheckCircle2,
  },
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.classes}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {requestStatusLabels[status]}
    </span>
  );
}

const docStatusConfig: Record<DocumentStatus, { classes: string; label: string }> = {
  ISSUED: { classes: 'bg-success-50 text-success-700 border-success-100', label: 'Issued' },
  REVOKED: { classes: 'bg-error-50 text-error-700 border-error-100', label: 'Revoked' },
  EXPIRED: { classes: 'bg-slate-100 text-slate-600 border-slate-200', label: 'Expired' },
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const config = docStatusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
