import type { DocumentRequest } from '@/types';
import { StatusBadge } from './StatusBadge';
import { documentTypeLabels } from '@/mocks/data';
import { formatDate } from '@/utils/helpers';
import { Link } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';

export function RequestCard({
  request,
  basePath = '/student/requests',
}: {
  request: DocumentRequest;
  basePath?: string;
}) {
  return (
    <Link
      to={`${basePath}/${request.id}`}
      className="card block p-4 transition-all hover:shadow-card-hover hover:border-navy-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-navy-100">
            <FileText className="h-5 w-5 text-navy-700" />
          </div>
          <div>
            <p className="font-medium text-navy-900">{request.requestRef}</p>
            <p className="mt-0.5 text-sm text-slate-500">
              {documentTypeLabels[request.documentType]}
            </p>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>
      <p className="mt-3 line-clamp-1 text-sm text-slate-600">{request.purpose}</p>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>Updated {formatDate(request.updatedAt)}</span>
        <span className="flex items-center gap-1 font-medium text-navy-600">
          View details <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
